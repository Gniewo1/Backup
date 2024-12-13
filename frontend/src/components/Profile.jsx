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
  const navigate = useNavigate();




  ///////////////////////////////////////////////////////////// handle sell button
  const handleClick = () => {
    // Redirect to the desired page, e.g., '/sell-card'
    navigate('/sell-card');
  };
  

  ///////////////////////////////////////////////////////////////////////////// Fetch current user info
  useEffect(() => {
    const token = localStorage.getItem('token');

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
    </>
  );
};

export default Profile;