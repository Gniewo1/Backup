import { useState } from 'react';

function VerifyngUser() {
  const [userId, setUserId] = useState('');  // To capture the user ID
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
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
      setMessage(`User with ID ${userId} verified successfully.`);
    } else {
      console.error('Error verifying user:', data);
      setMessage(`Error verifying user with ID ${userId}: ${data.detail}`);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={userId} 
        onChange={(e) => setUserId(e.target.value)} 
        placeholder="Enter user ID to verify"
      />
      <button onClick={handleVerify}>Verify User</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default VerifyngUser;