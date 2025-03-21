import axios from 'axios';

export const CheckAuthentication = async () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const config = {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.get('http://localhost:8000/api/auth/user/', config);

      if (res.status === 200) {
        return true; // Token is valid
      }
    } catch (err) {
      localStorage.removeItem('token');
      return false; // Token is invalid or expired
    }
  }
  
  return false; // No token found
};

export const CheckVerification = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const response = await axios.get("http://localhost:8000/api/user-info/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data; // Return user data if needed
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
};