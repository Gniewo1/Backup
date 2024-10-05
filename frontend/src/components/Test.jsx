import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CardPurchaseForm = () => {
    const { offerId } = useParams();
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({
        city: '',
        zip_code: '',
        street: '',
        house_number: '',
        apartment_number: ''
    });

    useEffect(() => {
        const fetchUserId = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/api/user-info/', { // Example endpoint
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                setUserId(response.data.id); // Assuming the response contains user ID
            } catch (error) {
                console.error('Error fetching user ID', error);
            }
        };

        fetchUserId();
    }, []);



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(userId)
            console.log(offerId)
            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:8000/cards/purchases/', {
                buyer: userId,
                card_offer: offerId,
                city: formData.city,
                zip_code: formData.zip_code,
                street: formData.street,
                house_number: formData.house_number,
                apartment_number: formData.apartment_number || null
            },
            {
                headers: {
                    'Authorization': `Token ${token}`, // Use Bearer if you are using JWT
                },
            });

            if (response.status === 201) {
                alert('Purchase successful!');
            }
        } catch (error) {
            console.error('Error submitting the form', error);
            // Handle different error responses as needed
            if (error.response && error.response.status === 401) {
                alert('You are not authorized. Please log in.');
            } else {
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>City:</label>
                <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            <div>
                <label>ZIP Code:</label>
                <input 
                    type="text" 
                    name="zip_code" 
                    value={formData.zip_code} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            <div>
                <label>Street:</label>
                <input 
                    type="text" 
                    name="street" 
                    value={formData.street} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            <div>
                <label>House Number:</label>
                <input 
                    type="text" 
                    name="house_number" 
                    value={formData.house_number} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            <div>
                <label>Apartment Number (optional):</label>
                <input 
                    type="text" 
                    name="apartment_number" 
                    value={formData.apartment_number} 
                    onChange={handleChange} 
                />
            </div>
            <button type="submit">Submit Purchase</button>
        </form>
    );
};

export default CardPurchaseForm;