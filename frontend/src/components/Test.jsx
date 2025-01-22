import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/SearchResults.css';

const Test = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      axios.get('http://localhost:8000/cards/newest-offers/')
          .then(response => {
              setOffers(response.data);
              setLoading(false);
          })
          .catch(error => {
              console.error('Error fetching offers:', error);
              setLoading(false);
          });
  }, []);

  if (loading) return <div>Loading...</div>;
    return (
      <>
      <Navbar />
        <div>
            <h2>Newest Offers</h2>
            <div className="offers-container">
                {offers.map(offer => (
                    <div key={offer.id} className="offer-card">
                        <img src={`http://localhost:8000/media/${offer.front_image}`} alt={`${offer.card__name} front`} />
                        <h3>{offer.front_image}</h3>
                        <h3>{offer.card__name}</h3>
                        <p>Seller: {offer.seller__username}</p>
                        <p>Type: {offer.offer_type}</p>
                        {offer.buy_now_price && <p>Buy Now Price: ${offer.buy_now_price}</p>}
                        {offer.auction_start_price && <p>Starting Auction Price: ${offer.auction_start_price}</p>}
                        <p>Created At: {new Date(offer.created_at).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>

                        {/* Offers Grid */}
                        <div className="offers-grid">
                    {filteredResults.map((offers, index) => (
                        <div className="offer-card" key={index}>
                            <img
                                src={`http://localhost:8000/media/${offers.front_image}`}
                                alt={offers.card__name}
                                className="offer-image"
                            />
                            <div className="offer-details">
                                <p><strong>Seller: {offers.seller__username}</strong></p>
                                <p>Card: {offers.card__name}</p>
                                {offers.auction_current_price && (<p>Auction Price: <strong>${offers.auction_current_price}</strong></p>)}
                                {offers.buy_now_price && (<p>Buy now Price: <strong>${offers.buy_now_price}</strong></p>)}
                                <p><strong>Offer duration: </strong></p>
                                <p>
                                    {Math.floor(offers.duration / (1000 * 60 * 60 * 24))} days,
                                    {Math.floor((offers.duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hours, 
                                    {Math.floor((offers.duration % (1000 * 60 * 60)) / (1000 * 60))} minutes
                                </p>
                                <button className="offer-button" onClick={() => handleViewOffer(offers.id)}>View Offer</button>
                            </div>
                        </div>
                    ))}
                </div>
        </>
    );
};

export default Test;