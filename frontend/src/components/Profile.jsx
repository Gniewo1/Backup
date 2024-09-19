import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'
import { LogOut } from '../functions/LogOut';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');  // Get token from localStorage

    fetch('http://localhost:8000/api/user-info/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,  // Send the token in the header
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
        setIsAdmin(data.is_admin);
        setIsVerified(data.is_verified)
      })
      .catch(error => console.error('Error fetching user info:', error));
  }, []);

  return (
    <>
    <Navbar />
    <div>
      {user ? (
        <div>
          <h1>Witaj</h1>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
          {isAdmin ? <p>You are an Admin.</p> : <p>You are a regular user.</p>}
          {(isAdmin || isVerified) ? <p>You are a Verified user.</p> : <p>You are not a Verified user.</p>}
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
    </>
  );
};

export default Profile;