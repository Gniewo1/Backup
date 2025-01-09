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
    const [newOffer, setNewOffer] = useState('');
    // const [sendOffer, setSendOffer] = useState('');

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

    

    const handleAuction = async (type) => {
        try {
            const token = localStorage.getItem('token');
            const offerType = type;
            let offerPriceToSend = newOffer; // Default to the user's entered offer
            if (type === 'buy_now') {
                offerPriceToSend = offer.buy_now_price; // Override for buy_now
            }
            const response = await axios.post(
                `http://localhost:8000/cards/place_offer/${offerId}/`,
                { offer_price: offerPriceToSend, offer_type: offerType },
                {
                    headers: {
                        Authorization: `Token ${token}`, // Include the token for authentication
                    },
                }
            );
    
            if (response.status === 200) {
                alert("Offer placed successfully!");
            }
        } catch (error) {
            console.error(error.response?.data?.error || "An error occurred");
            alert(error.response?.data?.error || "An error occurred");
        }
    };


        const handleClickBuy = () => {
            if (isAuthenticated) {
                // setSendOffer(offer.buy_now_price);
                handleAuction('buy_now');  // Trigger the buy function if authenticated
            } else {
                navigate('/login');  // Redirect to home page if not authenticated
            }
        };

        // const handleBuy = () => {
        //     if (isAuthenticated) {
        //         handleAuction('buy_now');
        //     }
        // };

        const handleClickAuction = () => {
            if (isAuthenticated) {
                // setSendOffer(newOffer);
                handleAuction('auction');
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

                            {/* New Offer Field */}
                            {offer.auction_price && (
                                <div className="new-offer-section">
                                    <input 
                                        type="number" 
                                        id="new-offer" 
                                        placeholder="Enter your offer" 
                                        value={newOffer}
                                        onChange={(e) => setNewOffer(e.target.value)} 
                                    />
                                    <button 
                                        onClick={handleClickAuction} 
                                        className="offer-button"
                                    >
                                        Give New Offer
                                    </button>
                                </div>
                            )}

                            {offer.buy_now_price && (<p>Buy now Price: <strong>${offer.buy_now_price}</strong></p>)}
                            

        
                            <button 
                                onClick={handleClickBuy} 
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