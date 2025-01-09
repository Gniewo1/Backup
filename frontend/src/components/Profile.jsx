import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Verification from './Verification';
import axios from 'axios';
import '../styles/buttons.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [offers, setOffers] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);




  ///////////////////////////////////////////////////////////// handle sell button
  const handleClick = () => {
    // Redirect to the desired page, e.g., '/sell-card'
    navigate('/sell-card');
  };
  

  ///////////////////////////////////////////////////////////////////////////// Fetch current user info
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserOffers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cards/search-useroffers/', {
            headers: {
                Authorization: `Token ${token}`  // Include token in headers
            }
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
            'Authorization': `Token ${token}`,
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





  /////////////////////////////////////////////////////////////////// Real Page
  return (
    <>
      <Navbar />
      <div>
        {loadingUser ? (
          <p>Loading user information...</p>
        ) : (
          <div>
            <h1>Welcome {user.username}</h1>
            {/* <p>Email: {user.email}</p>
            <p>Username: {user.username}</p> */}
            {isAdmin ? (
              <>
                <p>You are Admin</p>
              </>
            ) : (
              <p>You are a regular user.</p>
            )}
            {(isAdmin || isVerified) ? (
              <>
              <p>You are a Verified user.</p>
              <button onClick={handleClick}  style={{ backgroundColor: 'blue', color: 'white' }}>Sell Card</button>
              </>
            ) : (
              <>
                <p>You are not a Verified user.</p>
                <Verification/>
              </>
            )}
          </div>
        )}
        {message && <p>{message}</p>}
      </div>
      <div>
          <h1>Your Offers</h1>
          {offers?.length > 0 ? (
              offers.map(offer => (
                  <div key={offer.id} className="offer">
                      <img src={offer.front_image} alt={offer.card__name} />
                      <h2>{offer.card__name}</h2>
                      <p>Current Price: {offer.auction_current_price}</p>
                      <p>Buy Now Price: {offer.buy_now_price}</p>
                  </div>
              ))
          ) : (
              <p>No offers found.</p>
          )}
        </div>
    </>
  );
};

export default Profile;