import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/SearchResults.css';
import { CheckAuthentication } from '../functions/CheckAuthentication';

const OfferDetails = () => {
    const { offerId } = useParams();  // Get the offerId from the URL params
    const [offer, setOffer] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/cards/offers/${offerId}/`)
            .then(response => {
                setOffer(response.data);
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
                alert(`You are buying ${offer.card_name} for $${offer.offer_price}`);
            }
        };

        if (!offer) {
            return <p>Loading...</p>;  // Show a loading message while the data is fetched
        }

    return (
        <>
            <Navbar />
            <div className="offer-detail">
                <h2>{offer.card_name}</h2>
                <img src={`http://localhost:8000/${offer.card_image}`} alt={offer.card_name} />
                <p>Offered by: <strong>{offer.user}</strong></p>
                <p>Price: <strong>${offer.offer_price}</strong></p>
                {/* <p>Date Created: {new Date(offer.created_at).toLocaleString()}</p>
                {offer.is_active ? <p>Status: Active</p> : <p>Status: Inactive</p>} */}
                <button 
                    onClick={handleClick} 
                    className={"offer-button"}
                >
                    {isAuthenticated ? 'Buy Now' : 'Log in to Buy'}
                </button>
            </div>
        </>
    );
};

export default OfferDetails;