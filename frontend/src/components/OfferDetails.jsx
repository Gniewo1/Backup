import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/SearchResults.css';
import '../styles/OfferDetails.css';
import { CheckAuthentication } from '../functions/CheckAuthentication';

const OfferDetails = () => {
    const { offerId } = useParams();  // Get the offerId from the URL params
    const [offer, setOffer] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [duration, setDuration] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/cards/offers/${offerId}/`)
            .then(response => {
                setOffer(response.data);
                const auctionEndDate = new Date(response.data.auction_end_date);
                const currentDate = new Date();
                setDuration(auctionEndDate-currentDate);

            })
            .catch(error => {
                console.error('Error fetching offer details:', error);
            });

        const verifyAuthentication = async () => {
            const authenticated = await CheckAuthentication();
            setIsAuthenticated(authenticated);
            };
          
            verifyAuthentication();

    }, [offerId]);



        const handleClick = () => {
            if (isAuthenticated) {
                handleBuy();  // Trigger the buy function if authenticated
            } else {
                navigate('/login');  // Redirect to home page if not authenticated
            }
        };

        const handleBuy = () => {
            if (isAuthenticated) {
                navigate(`/buy-card/${offerId}`);
            }
        };

        if (!offer) {
            return <p>Loading...</p>;  // Show a loading message while the data is fetched
        }

        return (
            <>
                <Navbar />
                <div className="offer-detail">
                    <div className="offer-container">
                        {/* Left side */}
                        <div className="offer-left">
                            <h1>{offer.card_name}</h1>
                            <img src={`http://localhost:8000/${offer.card_image}`} alt={offer.card_name} />
                        </div>
                        
                        {/* Right side */}
                        <div className="offer-right">
                            <p>Offered by: <strong>{offer.user}</strong></p>
                            {offer.auction_price && (<p>Auction Price: <strong>${offer.auction_price}</strong></p>)}
                            {offer.buy_now_price && (<p>Buy now Price: <strong>${offer.buy_now_price}</strong></p>)}
                            <button 
                                onClick={handleClick} 
                                className={"offer-button"}
                            >
                                {isAuthenticated ? 'Buy Now' : 'Log in to Buy'}
                            </button>
                            <p><strong>Offer duration: </strong></p>
                            <p>{Math.floor(duration / (1000 * 60 * 60 * 24))} days, {Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hours, {Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))} minutes</p>
                        </div>
                    </div>
                </div>
            </>
        );
};

export default OfferDetails;