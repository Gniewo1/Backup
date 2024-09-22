import axios from 'axios';
 export const Verify = async (userId) => {
    const token = localStorage.getItem('token');  // Assuming you're using token authentication

    const response = await fetch('http://localhost:8000/api/verifying-user/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`  // Include the token for authentication
      },
      body: JSON.stringify({ id: userId, verified: true })  // Send the user ID and verified status
    });

    const data = await response.json();
    if (response.ok) {
      console.log('User verified successfully:', data);
    } else {
      console.error('Error verifying user:', data);
    }
  };


 
export const UpdateVerificationRequest = async (requestId, newStatus) => {
  const token = localStorage.getItem('token'); // Fetch token from local storage
  try {
      const response = await axios.patch(`http://localhost:8000/api/verification-requests/${requestId}/`, {
          status: newStatus,
      }, {
          headers: {
              Authorization: `Token ${token}`, // Use the token fetched above
          },
      });

      console.log('Status updated:', response.data);
      return response.data; // Return the response data if needed
  } catch (error) {
      if (error.response) {
          console.error('Error updating status:', error.response.data);
      } else {
          console.error('Error updating status:', error.message);
      }
      throw error; // Optionally rethrow the error for further handling
  }
};
  
