import React from 'react';
import {  useNavigate, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { CheckAuthentication } from '../functions/CheckAuthentication';
import { LogOut } from '../functions/LogOut';
import { useState, useEffect } from 'react';
import axios from "axios";





const Navbar = () => {
  const [cards, setCards] = useState([]); // Full list of cards (names only)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const currentPath = window.location.pathname; 
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    const success = await LogOut();
    

    if (success) {
      
      if (currentPath === '/' || currentPath === '/home') {
        // If the user is already on the homepage, reload the page
        window.location.reload();
      } else {
        // If the user is not on the homepage, navigate to the homepage
        navigate('/');
      }

    } else {
      // Handle logout failure (e.g., show an error message)
      console.error('Logout failed');
    }
  };

  const handleSearch = (event) => {
    event.preventDefault(); // Prevent form submission
    // Navigate to the search results page with the search query
    navigate(`/search?query=${searchQuery}`);
  };

  useEffect(() => {

    axios
    .get("http://localhost:8000/cards/card-names/")
    .then((response) => {
      // console.log(response.data);
      setCards(response.data);
      setLoading(false);
    })
    .catch((error) => {
      setError("Failed to fetch card data.");
      setLoading(false);
    });


    const verifyAuthentication = async () => {
      const authenticated = await CheckAuthentication();
      setIsAuthenticated(authenticated);
    };

    verifyAuthentication();
  }, []);

  

  if (loading) return <p>Loading cards...</p>;
  if (error) return <p>{error}</p>;


  return (
    <>
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MyApp</Link>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button type="submit">Search</button>
      </form>


      
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {/* <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li> */}

        {isAuthenticated ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
              <li> 
              <button className="btn" onClick={handleLogout}>Logout</button>
            </li> 
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
    </>
  );
};

export default Navbar;