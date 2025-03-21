import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Verification = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  // Fetch user ID when the component mounts
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
        setUserId(data.id);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Handle verification
  const handleVerify = async () => {
    try {
      console.log('User ID:', userId);
      console.log('Code:', code);

      const response = await axios.post('http://localhost:8000/api/verify/', { code, user_id: userId });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Verification failed');
    }
  };

  return (
    <>
      <Navbar />
    <div>
      <h2>Podaj kod weryfikacyjny</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Kod weryfikacyjny"
      />
      <button onClick={handleVerify} disabled={!userId}>Weryfikuj</button>
      {message && <p>{message}</p>}
    </div>
    </>
  );
};

export default Verification;