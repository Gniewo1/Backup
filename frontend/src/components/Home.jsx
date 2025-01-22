import React, { useEffect, useState } from 'react';
import { useNavigate }  from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/Home.css';

const Home = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleViewOffer = (offerId) => {
      // Navigate to the offer's specific page
      navigate(`/offers/${offerId}`);
  };

    useEffect(() => {
      axios.get('http://localhost:8000/cards/newest-offers/')
          .then(response => {
              const resultsWithDuration = response.data.map((item) => {
                  const auctionEndDate = item.auction_end_date ? new Date(item.auction_end_date) : null;
                  const currentDate = new Date();
                  const duration = auctionEndDate ? auctionEndDate - currentDate : null;
  
                  return {
                      ...item,
                      duration, // Add the calculated duration to the item
                  };
              });
  
              setOffers(resultsWithDuration);
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
                        <h3>{offer.card__name}</h3>
                        <p><strong>Seller: {offer.seller__username}</strong></p>
                        {offer.buy_now_price && <p>Buy Now Price: <strong>${offer.buy_now_price}</strong></p>}
                        {offer.auction_start_price && <p>Auction Price: <strong>${offer.auction_current_price}</strong></p>}
                        <p>
                                    {Math.floor(offer.duration / (1000 * 60 * 60 * 24))} days, 
                                    {Math.floor((offer.duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hours, 
                                    {Math.floor((offer.duration % (1000 * 60 * 60)) / (1000 * 60))} minutes
                                </p>
                                <button className="offer-button" onClick={() => handleViewOffer(offer.id)}>View Offer</button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default Home;

