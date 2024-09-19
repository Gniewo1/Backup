import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'
import { LogOut } from '../functions/LogOut';

const Profile = () => {
  const [user, setUser] = useState(null);

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
      .then(data => setUser(data))
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
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
    </>
  );
};

export default Profile;