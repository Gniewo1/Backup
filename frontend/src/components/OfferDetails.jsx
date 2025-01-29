import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/SearchResults.css';
import '../styles/OfferDetails.css';
import { CheckAuthentication } from '../functions/CheckAuthentication';

const OfferDetails = () => {
    const { offerId } = useParams();
    const [offer, setOffer] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [duration, setDuration] = useState(null);
    const navigate = useNavigate();
    const [newOffer, setNewOffer] = useState('');
    const [isFrontImage, setIsFrontImage] = useState(true); // Track image state

    useEffect(() => {
        axios.get(`http://localhost:8000/cards/offers/${offerId}/`)
            .then(response => {
                setOffer(response.data);
                const auctionEndDate = new Date(response.data.auction_end_date);
                const currentDate = new Date();
                setDuration(auctionEndDate - currentDate);
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
                `http://localhost:8000/cards/place-offer/${offerId}/`,
                { offer_price: offerPriceToSend, offer_type: offerType },
                {
                    headers: {
                        Authorization: `Token ${token}`,
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
            handleAuction('buy_now');
        } else {
            navigate('/login');
        }
    };

    const handleClickAuction = () => {
        if (isAuthenticated) {
            handleAuction('auction');
        }
    };

    const toggleImage = () => {
        setIsFrontImage(!isFrontImage); // Toggle the image state
    };

    if (!offer) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Navbar />
            <div className="offer-detail">
                <div className="offer-container">
                    {/* Left side */}
                    <div className="offer-left">
                        <h1>{offer.card_name}</h1>
                        <img
                            src={`http://localhost:8000/${isFrontImage ? offer.card_image : offer.card_image_back}`}
                            alt={offer.card_name}
                        />
                        <button onClick={toggleImage} className="toggle-image-button">
                            {isFrontImage ? 'Pokaż Tył' : 'Pokaż Przód'}
                        </button>
                    </div>

                    {/* Right side */}
                    <div className="offer-right">
                        <p>Sprzedawca: <strong>{offer.user}</strong></p>
                        {offer.auction_price && (<p>Aukcja Cena: <strong>{offer.auction_price} zł</strong></p>)}

                        {/* New Offer Field */}
                        {offer.auction_price && (
                            <div className="new-offer-section">
                                <input
                                    type="number"
                                    id="new-offer"
                                    placeholder="Wprowadź ofertę"
                                    value={newOffer}
                                    onChange={(e) => setNewOffer(e.target.value)}
                                />
                                <button
                                    onClick={handleClickAuction}
                                    className="offer-button"
                                >
                                    Dodaj swoją ofertę
                                </button>
                            </div>
                        )}

                        {offer.buy_now_price && (<p>Kup Teraz Cena: <strong>{offer.buy_now_price} zł</strong></p>)}

                        <button
                            onClick={handleClickBuy}
                            className={"offer-button"}
                        >
                            {isAuthenticated ? 'Kup Teraz' : 'Zaloguj się, żeby kupić'}
                        </button>
                        <p><strong>Czas trwania: </strong></p>
                        <p>{Math.floor(duration / (1000 * 60 * 60 * 24))} dni, {Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} godziny, {Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))} minut</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OfferDetails;