import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/CardOffer.css'; // Import CSS for styling
import Navbar from './Navbar';

const Test = () => {
  const [cards, setCards] = useState([]); // Full list of cards (names only)
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [suggestions, setSuggestions] = useState([]); // Suggestions for display
  const [selectedCard, setSelectedCard] = useState(null); // Selected card details
  const [offerPrice, setOfferPrice] = useState(''); // Set price
  const [frontImage, setFrontImage] = useState(null); // State for front image
  const [backImage, setBackImage] = useState(null);  // State for back image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all card names (without images)
    axios
      .get("http://localhost:8000/cards/card-names/")
      .then((response) => {
        setCards(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch card data.");
        setLoading(false);
      });
  }, []);

  // Handle input changes in the search bar
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Update suggestions dynamically
    if (searchValue.trim() !== "") {
      const filtered = cards.filter((card) =>
        card.name.toLowerCase().includes(searchValue)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  const handleSuggestionClick = (card) => {
    setSearchTerm(card.name); // Set the search bar value to the selected suggestion
    setSuggestions([]); // Clear suggestions after selection
    fetchCardDetails(card.id); // Fetch selected card's image
  };

  // Fetch card details (including image) for the selected card
  const fetchCardDetails = (cardId) => {
    axios
      .get(`http://localhost:8000/cards/card-image/${cardId}/`)
      .then((response) => {
        setSelectedCard(response.data); // Update selected card details
      })
      .catch(() => {
        setError("Failed to fetch card details.");
      });
  };

  if (loading) return <p>Loading cards...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />

      <div className="sell-offer-form-container"> 
      <h1>Sell Card</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for a card..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          padding: "10px",
          width: "90%",
          marginBottom: "5px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul
          style={{
            listStyleType: "none",
            padding: "0",
            margin: "0",
            border: "1px solid #ccc",
            borderTop: "none",
            borderRadius: "0 0 4px 4px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            maxHeight: "150px",
            overflowY: "auto",
            background: "#fff",
          }}
        >
          {suggestions.map((card) => (
            <li
              key={card.id}
              onClick={() => handleSuggestionClick(card)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
              }}
              onMouseOver={(e) => (e.target.style.background = "#f9f9f9")}
              onMouseOut={(e) => (e.target.style.background = "#fff")}
            >
              {card.name}
            </li>
          ))}
        </ul>
      )}

      {/* Selected Card Image */}
      {selectedCard && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h2>{selectedCard.name}</h2>
          <img
            src={selectedCard.image}
            alt={selectedCard.name}
            style={{
              maxWidth: "100%",
              maxHeight: "500px",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
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


    </div>
    </>
  );
};

export default Test;