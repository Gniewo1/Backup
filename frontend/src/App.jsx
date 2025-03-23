import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import SellCard from './components/SellCard'
import CardPurchaseForm from './components/BuyCard'
import SearchResults from './components/SearchResults'
import OfferDetails from './components/OfferDetails';
import Verification from './components/Verification';
import Shipment from './components/Shipment';
import {Routes, Route, useLocation, Navigate} from 'react-router-dom'
import axios from 'axios'

function App() {

  //Check authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Check if the token is valid by calling a protected route
          const config = {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          };

          const res = await axios.get('http://localhost:8000/api/auth/user/', config);

          if (res.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (err) {
          // If token is invalid, remove it from localStorage and set auth to false
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
    };

    checkIfLoggedIn();
  }, []);
  // Authentication ends

  return (
    <>
    <Routes>
     <Route path="/" element={<Home/>} />
     <Route path="/navbar" element={<Navbar/>} />
     <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register/>} />
     <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
     <Route path="/profile" element={<Profile />} />
     <Route path="/sell-card" element={<SellCard />} />
     <Route path="/search" element={<SearchResults />} />
     <Route path="/buy-card/:offerId" element={<CardPurchaseForm />} />
     <Route path="/offers/:offerId" element={<OfferDetails />} />
     <Route path="/sold/:offerId" element={<Shipment />} />
     <Route path="/verification" element={<Verification />} />
    </Routes>
    </>
  )

}

export default App
