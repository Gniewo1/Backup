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
