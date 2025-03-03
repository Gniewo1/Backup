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
        name: '',
        surname: '',
        street: '',
        house_number: '',
        apartment_number: '',
        city: '',
        zip_code: '',

    });
    const navigate = useNavigate();
    const [isFrontImage, setIsFrontImage] = useState(true); // Track image state

    useEffect(() => {
        axios.get(`http://localhost:8000/cards/offer-sold/${offerId}/`)
            .then(response => {
                console.log(response.data);
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
                    `http://localhost:8000/cards/delivery-data/${offerId}/`,
                    shippingInfo,
                    {
                        headers: {
                            'Authorization': `Token ${token}`,
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
                        {offer.shipping_exists ? (<h2>Dane wysyłki zostały już wysłane</h2>) : (
                            <form onSubmit={handleSubmitShipping}>
                                <div>
                                    <label htmlFor="shipping_name">Imię</label>
                                    <input
                                        type="text"
                                        id="shipping_name"
                                        name="name"
                                        value={shippingInfo.name}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_surname">Nazwisko</label>
                                    <input
                                        type="text"
                                        id="shipping_surname"
                                        name="surname"
                                        value={shippingInfo.surname}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_street">Ulica</label>
                                    <input
                                        type="text"
                                        id="shipping_street"
                                        name="street"
                                        value={shippingInfo.street}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_house_number">Numer budynku</label>
                                    <input
                                        type="text"
                                        id="shipping_house_number"
                                        name="house_number"
                                        value={shippingInfo.house_number}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_apartment_number">Numer mieszkania</label>
                                    <input
                                        type="text"
                                        id="shipping_apartment_number"
                                        name="apartment_number"
                                        value={shippingInfo.apartment_number}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_city">Miasto</label>
                                    <input
                                        type="text"
                                        id="shipping_city"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_zip_code">Kod pocztowy</label>
                                    <input
                                        type="text"
                                        id="shipping_zip_code"
                                        name="zip_code"
                                        value={shippingInfo.zip_code}
                                        onChange={handleShippingChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="offer-button">Zatwierdź dane do wysyłki</button>
                            </form>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Test;