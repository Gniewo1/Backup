import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/SearchResults.css';

const CardPurchaseForm = () => {
    const { offerId } = useParams();
    const [userId, setUserId] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();
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

    const toggleActiveStatus = async () => {
        try {
            // Send a PATCH request to update the is_active field
            const response = await axios.patch(`http://localhost:8000/cards/update-card-status/${offerId}/`, {
                is_active: !isActive,  // Toggle the status
            },
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`, // Ensure you send the token here too
                },
            });
    
            // Update the local state based on the response
            setIsActive(response.data.is_active); // Assuming response has updated is_active
        } catch (error) {
            console.error('Error updating the card offer status:', error);
            // Optionally handle errors here as needed
        }
    };

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
                toggleActiveStatus();
                navigate('/')
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
            <button type="submit"  className={"offer-button"} style={{ marginTop: '20px' }}>Submit Purchase</button>
        </form>
    );
};

export default CardPurchaseForm;