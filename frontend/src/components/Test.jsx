import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CardOffer.css'; // Import a CSS file for styling

const CardOffer = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch cards when the component mounts
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cards/cards/');
        setCards(response.data);
      } catch (err) {
        setError('Failed to fetch cards. Please try again.');
        console.error(err);
      }
    };

    fetchCards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCardId = selectedCard; // Card ID to be sent in the request

    try {
      const response = await axios.post('http://localhost:8000/cards/sell-offers/', {
        card: selectedCardId,      // Send the selected card ID
        offer_price: offerPrice,    // Send the offer price
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust token retrieval as needed
        }
      });

      setSuccess('Offer created successfully!');
      setError('');
      // Reset form fields
      setSelectedCard('');
      setOfferPrice('');
    } catch (err) {
      setError('Failed to create offer. Please try again.');
      setSuccess('');
      console.error(err);
    }
  };

  return (
    <div className="sell-offer-form-container">
      <h2>Create a New Sell Offer</h2>
      <form onSubmit={handleSubmit} className="sell-offer-form">
        <div className="form-group">
          <label htmlFor="cardSelect">Select Card:</label>
          <select
            id="cardSelect"
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="offerPrice">Offer Price:</label>
          <input
            type="number"
            id="offerPrice"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="btn-submit">Submit Offer</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default CardOffer;