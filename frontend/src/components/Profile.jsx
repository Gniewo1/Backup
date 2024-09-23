import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import '../styles/buttons.css';
import { Verify, UpdateVerificationRequest } from '../functions/VerifyingUser';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);


  // const updateVerificationRequestStatus = async (requestId, newStatus) => {
  //   try {
  //     const response = await axios.patch(`http://localhost:8000/api/verification-requests/${requestId}/`, {
  //       status: newStatus,
  //     }, {
  //       headers: {
  //         Authorization: `Token ${token}`, // if using token authentication
  //       },
  //     });
  
  //     console.log('Status updated:', response.data);
  //   } catch (error) {
  //     console.error('Error updating status:', error.response.data);
  //   }
  // };
  

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

  //////////////////////////////////////////////////////////////////////////////////// Fetch pending verification requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (isAdmin) { // Fetch only if the user is admin
        try {
          const response = await axios.get('http://localhost:8000/api/show-verification-requests/', {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
            },
          });
          setRequests(response.data);
        } catch (error) {
          setError('Error fetching pending requests.');
          console.error('Error fetching pending requests:', error);
        } finally {
          setLoadingRequests(false);
        }
      } else {
        setLoadingRequests(false); // Set loading to false if not admin
      }
    };

    fetchPendingRequests();
  }, [isAdmin]);


  /////////////////////////////////////////////////////////////////////// Send Verification request
  const sendVerificationRequest = async () => {
    setLoadingUser(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/verification-request/',
        {},
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage('Verification request sent successfully!');
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail || 'Error sending request.');
      } else {
        setMessage('Network error. Please try again.');
      }
    } finally {
      setLoadingUser(false);
    }
  };

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
                {/* <p>You are an Admin.</p> */}
                <div>
                  <h1>Pending Verification Requests</h1>
                  {loadingRequests ? (
                    <p>Loading pending requests...</p>
                  ) : (
                    <>
                      {requests.length === 0 ? (
                        <p>No pending requests.</p>
                      ) : (
                        <ul>
                          {requests.map((request) => (
                            <li key={request.id}>
                              <p>Username: {request.user}</p>
                              <p>User.ID: {request.user_id}</p>
                              <p>Request.ID: {request.id}</p>
                              <p>Status: {request.status}</p>
                              <p>Requested on: {new Date(request.request_date).toLocaleString()}</p>
                              <button onClick={() => {Verify(request.user_id);
                                 UpdateVerificationRequest(request.id, 'approved');
                                 window.location.reload();
                              }} className="button accept-button">Accept</button>
                              <button onClick={() => {
                                 UpdateVerificationRequest(request.id, 'rejected');
                                 window.location.reload();
                              }}
                              className="button refuse-button">Refuse</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <p>You are a regular user.</p>
            )}
            {(isAdmin || isVerified) ? (
              <p>You are a Verified user.</p>
            ) : (
              <>
                <p>You are not a Verified user.</p>
                <button onClick={sendVerificationRequest} disabled={loadingUser} style={{ backgroundColor: 'blue', color: 'white' }}>
                  {loadingUser ? 'Sending...' : 'Send Verification Request'}
                </button>
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