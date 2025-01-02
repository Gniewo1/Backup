import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CardOffer.css'; // Import CSS for styling
import Navbar from './Navbar';

const CardOffer = () => {
  const [cards, setCards] = useState([]);
  // const [cards_id setCards_id] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [frontImage, setFrontImage] = useState(null); // State for front image
  const [backImage, setBackImage] = useState(null);  // State for back image
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCardImage, setSelectedCardImage] = useState(''); // State for selected card image

  // Fetch cards when the component mounts
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cards/cards/');
        if (Array.isArray(response.data)) {
          setCards(response.data);
        } else {
          setError('Unexpected response format.');
        }
      } catch (err) {
        setError('Failed to fetch cards. Please try again.');
        console.error(err);
      }
    };

    fetchCards();
  }, []);

  const handleCardChange = (e) => {
    const cardId = e.target.value;
    setSelectedCard(cardId);

    const selectedCardObj = cards.find(card => card.id === parseInt(cardId));
    if (selectedCardObj) {
      setSelectedCardImage(selectedCardObj.image);
    } else {
      setSelectedCardImage('');
    }
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('card', cards);
    formData.append('offer_price', offerPrice);
    
    // Check if you have front and back images, and append them to formData
    if (frontImage) formData.append('front_image', frontImage);
    if (backImage) formData.append('back_image', backImage);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
  
      const response = await axios.post('http://localhost:8000/cards/card-offers/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          'Authorization': `Token ${token}`, // Add token to headers
        }
      });
  
      setSuccess('Offer created successfully!');
      setError('');
      // Reset form fields
      setSelectedCard('');
      setOfferPrice('');
      setSelectedCardImage(''); // Reset selected card image
    } catch (err) {
      setError('Failed to create offer. Please try again.');
      setSuccess('');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="empty-container"></div>

      <div className="sell-offer-form-container">
        <h2>Create a New Sell Offer</h2>
        <form onSubmit={handleSubmit} className="sell-offer-form">
          <div className="form-group">
            <label htmlFor="cardSelect">Select Card:</label>
            <select
              id="cardSelect"
              value={selectedCard}
              onChange={handleCardChange}
              required
              className="form-select"
            >
              <option value="">Select a card</option>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCardImage && (
            <div className="selected-card-image">
              <img src={selectedCardImage} alt="Selected Card" />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="offerPrice">Offer Price [€] :</label>
            <input
              type="number"
              id="offerPrice"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="frontImage">Front Image:</label>
            <input
              type="file"
              id="frontImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setFrontImage)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="backImage">Back Image:</label>
            <input
              type="file"
              id="backImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setBackImage)}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn-submit">Submit Offer</button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    </>
  );
};

export default CardOffer;