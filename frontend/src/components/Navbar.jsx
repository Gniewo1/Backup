import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { CheckAuthentication } from '../functions/CheckAuthentication';
import { LogOut } from '../functions/LogOut';
import { useState, useEffect } from 'react'




const Navbar = () => {
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
    const verifyAuthentication = async () => {
      const authenticated = await CheckAuthentication();
      setIsAuthenticated(authenticated);
    };

    verifyAuthentication();
  }, []);

  




  return (
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
  );
};

export default Navbar;