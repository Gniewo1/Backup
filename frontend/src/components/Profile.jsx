import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
// import Verification from './Verification';
import axios from 'axios';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Redirect to sell-card page
  const handleClick = () => {
    navigate('/sell-card');
  };

  // Fetch current user info and offers
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserOffers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cards/search-useroffers/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setOffers(response.data.offers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user-info/', {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        setUser(data);
        setIsAdmin(data.is_admin);
        setIsVerified(data.is_verified);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserInfo();
    fetchUserOffers();
  }, []);

  // Separate offers into active and inactive/past
  const now = new Date();
  const inactiveOffers = offers.filter(
    (offer) =>
      !offer.is_active || new Date(offer.auction_end_date) < now
  );
  const activeOffers = offers.filter(
    (offer) =>
      offer.is_active && new Date(offer.auction_end_date) >= now
  );

  return (
    <>
      <Navbar />
      <div className="empty-container"></div>
      <div className="profile-container">
        {/* Left Side: Inactive or Past-Time Offers */}
        <div className="offers-container">
          <h1>Inactive or Past-Time Offers</h1>
          {inactiveOffers.length > 0 ? (
            inactiveOffers.map((offer) => (
              <div key={offer.id} className="offer">
                <h2>{offer.card__name}</h2>
                <img
                  src={`http://localhost:8000/media/${offer.front_image}`}
                  alt={offer.card__name}
                  className="offer-image"
                />
                <p>Auction End Date: {new Date(offer.auction_end_date).toLocaleString()}</p>
                <p>Buy Now Price: {offer.buy_now_price}</p>
              </div>
            ))
          ) : (
            <p>No inactive or past-time offers found.</p>
          )}
        </div>

        {/* Right Side: Active Offers */}
        <div className="offers-container active-offers">
          <h1>Active Offers</h1>
          {activeOffers.length > 0 ? (
            activeOffers.map((offer) => (
              <div key={offer.id} className="offer">
                <h2>{offer.card__name}</h2>
                <img
                  src={`http://localhost:8000/media/${offer.front_image}`}
                  alt={offer.card__name}
                  className="offer-image"
                />
                <p>Current Price: {offer.auction_current_price}</p>
                <p>Auction End Date: {new Date(offer.auction_end_date).toLocaleString()}</p>
                <p>Buy Now Price: {offer.buy_now_price}</p>
              </div>
            ))
          ) : (
            <p>No active offers found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;