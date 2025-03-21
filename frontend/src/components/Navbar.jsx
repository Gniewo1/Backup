import React from 'react';
import {  useNavigate, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { CheckAuthentication, CheckVerification } from '../functions/CheckAuthentication';
import { LogOut } from '../functions/LogOut';
import { useState, useEffect } from 'react';
import axios from "axios";





const Navbar = () => {
  const [cards, setCards] = useState([]); // Full list of cards (names only)
  const [suggestions, setSuggestions] = useState([]); // Suggestions for display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const currentPath = window.location.pathname; 
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');

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

  const handleSearch = async (event) => {  // Add async here
    event.preventDefault(); // Prevent form submission
    try {
      const response = await fetch(`http://localhost:8000/cards/check-offers/?q=${searchQuery}`);
      const data = await response.json();
      
      if (data.status === 'success') {
          setStatus('Offers have been updated successfully!');
      } else {
          setStatus('Failed to update offers.');
      }
    } catch (error) {
        setStatus('An error occurred.');
    }
    
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

    const verification = async () => {
      const verify = await CheckVerification();
      // console.log(verify.is_verified);
      setIsVerified(verify.is_verified);
    }

    verifyAuthentication();
    verification();
  }, []);


  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchQuery(searchValue);

    // Update suggestions dynamically
    if (searchValue.trim() !== "") {
      const filtered = cards.filter((card) =>
        card.name.toLowerCase().includes(searchValue)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  const handleSuggestionClick = (card) => {
    setSearchQuery(card.name); // Set the search bar value to the selected suggestion
    setSuggestions([]); // Clear suggestions after selection
    // fetchCardDetails(card.id); // Fetch selected card's image
  };
  

  if (loading) return <p>Loading cards...</p>;
  if (error) return <p>{error}</p>;


  return (
    <>
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Trading The Gathering</Link>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
    <input 
      type="text" 
      placeholder="Wyszukaj..." 
      value={searchQuery}
      onChange={handleSearchChange}
    />

    <button type="submit">Wyszukaj</button>

    {/* Suggestions */}
    {suggestions.length > 0 && (
      <ul>
        {suggestions.map((card) => (
          <li
            key={card.id}
            onClick={() => handleSuggestionClick(card)}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #f0f0f0",
            }}
            onMouseOver={(e) => (e.target.style.background = "#f9f9f9")}
            onMouseOut={(e) => (e.target.style.background = "#fff")}
          >
            {card.name}
          </li>
        ))}
      </ul>
    )}
  </form>
{/* 
        <button type="submit">Search</button>
      </form> */}


      
      <ul className="navbar-links">
        <li>
          <Link to="/">Główna</Link>
        </li>
        {/* <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li> */}

        {isAuthenticated ? (
          <>
          {isVerified ? (
            <li>
              <Link to="/profile">Profil</Link>
            </li>
          ):(
            <li>
              <Link to="/verification">Profil</Link>
            </li>
          )
          }
              <li>
          
              <button className="btn" onClick={handleLogout}>Wyloguj</button>
            </li> 
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Zaloguj</Link>
            </li>
            <li>
              <Link to="/register">Rejestracja</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
    </>
  );
};

export default Navbar;