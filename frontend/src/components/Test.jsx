import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/SearchResults.css';
import '../styles/OfferDetails.css';
import { CheckAuthentication } from '../functions/CheckAuthentication';

const Test = () => {
    const { offerId } = useParams();
    const [offer, setOffer] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        shipping_name: '',
        shipping_address: '',
        shipping_city: '',
        shipping_postal_code: '',
        shipping_country: ''
    });
    const navigate = useNavigate();
    const [isFrontImage, setIsFrontImage] = useState(true); // Track image state

    useEffect(() => {
        axios.get(`http://localhost:8000/cards/offer-sold/${offerId}/`)
            .then(response => {
                setOffer(response.data);
                console.log(response.data);
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

    const handleShippingChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitShipping = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    `http://localhost:8000/cards/submit-shipping/${offerId}/`,
                    shippingInfo,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    alert('Shipping information submitted successfully!');
                }
            } catch (error) {
                console.error(error.response?.data?.error || 'An error occurred');
                alert(error.response?.data?.error || 'An error occurred');
            }
        } else {
            navigate('/login');
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
                        <p className="text-gray-600">Cena końcowa: {offer.auction_price} PLN</p>
                        <p className="text-gray-600">Konto do przelewu: {offer.bank_number}</p>

                        {/* Shipping Info Form */}
                        <div className="shipping-info mt-4">
                            <h3>Wymagane dane do wysyłki</h3>
                            <form onSubmit={handleSubmitShipping}>
                                <div>
                                    <label htmlFor="shipping_name">Imię i Nazwisko</label>
                                    <input
                                        type="text"
                                        id="shipping_name"
                                        name="shipping_name"
                                        value={shippingInfo.shipping_name}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_address">Adres</label>
                                    <input
                                        type="text"
                                        id="shipping_address"
                                        name="shipping_address"
                                        value={shippingInfo.shipping_address}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_city">Miasto</label>
                                    <input
                                        type="text"
                                        id="shipping_city"
                                        name="shipping_city"
                                        value={shippingInfo.shipping_city}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_postal_code">Kod pocztowy</label>
                                    <input
                                        type="text"
                                        id="shipping_postal_code"
                                        name="shipping_postal_code"
                                        value={shippingInfo.shipping_postal_code}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_country">Kraj</label>
                                    <input
                                        type="text"
                                        id="shipping_country"
                                        name="shipping_country"
                                        value={shippingInfo.shipping_country}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="offer-button">Zatwierdź dane do wysyłki</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Test;