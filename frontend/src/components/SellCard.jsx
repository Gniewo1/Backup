import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/CardOffer.css'; // Import CSS for styling
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CardOffer = () => {
  const [cards, setCards] = useState([]); // Full list of cards (names only)
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [suggestions, setSuggestions] = useState([]); // Suggestions for display
  const [selectedCard, setSelectedCard] = useState(null); // Selected card details
  const [selectedCard_Offer, setSelectedCard_Offer] = useState(null); // Selected card details
  const [offerPrice, setOfferPrice] = useState(''); // Set price
  const [auctionPrice, setAuctionPrice] = useState(''); // Set price of auction
  const [frontImage, setFrontImage] = useState(null); // State for front image
  const [backImage, setBackImage] = useState(null);  // State for back image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [offerType, setOfferType] = useState("buy_now");

  const navigate = useNavigate();

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

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

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
        // console.log(response.data.id)
        setSelectedCard_Offer(response.data.id);
        setSelectedCard(response.data); // Update selected card details
      })
      .catch(() => {
        setError("Failed to fetch card details.");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('card', selectedCard_Offer);
    formData.append('buy_now_price', offerPrice);
    formData.append('auction_start_price', auctionPrice);
    formData.append('offer_type', offerType);
    
    // Check if you have front and back images, and append them to formData
    if (frontImage) formData.append('front_image', frontImage);
    if (backImage) formData.append('back_image', backImage);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
  
      const response = await axios.post('http://localhost:8000/cards/create-offers/', formData, {
        headers: {
          // 'Content-Type': 'multipart/form-data', // Important for file uploads
          'Authorization': `Token ${token}`, // Add token to headers
        }
      });
  
      setSuccess('Offer created successfully!');
      setError('');
      // Reset form fields
      setSelectedCard('');
      setOfferPrice('');
      // setSelectedCardImage(''); // Reset selected card image
      navigate('/');

    } catch (err) {
      // setError('Failed to create offer. Please try again.');
      // setSuccess('');
      console.error(err);
    }
  };

  if (loading) return <p>Loading cards...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="empty-container"></div>

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

         {/* Offer Type Dropdown */}
         <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Offer Type:
              </label>
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                style={{
                  padding: "10px",
                  width: "100%",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="buy_now">Buy Now</option>
                <option value="auction">Auction</option>
                <option value="buy_now_and_auction">Buy Now and Auction</option>
              </select>
            </div>


            {/* Conditionally render the price fields */}
        {offerType !== "auction" && (
          <div className="form-group">
            <label htmlFor="offerPrice">Buy Now Price [€] :</label>
            <input
              type="number"
              id="offerPrice"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              required
              className="form-input"
            />
          </div>
        )}

        {offerType !== "buy_now" && (
          <div className="form-group">
            <label htmlFor="offerPrice">Auction Price [€] :</label>
            <input
              type="number"
              id="auctionPrice"
              value={auctionPrice}
              onChange={(e) => setAuctionPrice(e.target.value)}
              required={offerType === "auction" || offerType === "buy_now_and_auction"}
              className="form-input"
            />
          </div>
        )}


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
          <form onSubmit={handleSubmit}>
        <button type="submit" className="btn-submit">Submit Offer</button>
      </form>
    </div>
    </>
  );
};

export default CardOffer;