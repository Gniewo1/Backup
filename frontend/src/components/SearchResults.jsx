import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/SearchResults.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');  // Retrieve 'query' parameter from the URL
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const [resultCount, setResultCount] = useState(0);

    const handleViewOffer = (offerId) => {
        // Navigate to the offer's specific page
        navigate(`/offers/${offerId}`);
    };

    useEffect(() => {
        // Fetch data from the backend based on the query
        if (query) {
            axios.get(`http://localhost:8000/cards/search_offers/?q=${query}`)
                .then((response) => {
                    setResults(response.data.results);
                    setResultCount(response.data.results.length);
                    
                })
                .catch((error) => {
                    console.error('Error fetching search results:', error);
                });
        }
        
    }, [query]);




    return (
        <>
        <Navbar />
        <div className="empty-container"></div>
        <div className="search-results">
            <h2>Search Results ({resultCount})</h2>
            <div className="offers-grid">
                {results.map((offer, index) => (
                    <div className="offer-card" key={index}>
                        <img 
                            src={`http://localhost:8000/media/${offer.front_image}`} 
                            alt={offer.card__name} 
                            className="offer-image" 
                        />
                        <div className="offer-details">
                            <p><strong>Seller: {offer.seller__username}</strong></p>
                            <p>Card: {offer.card__name}</p>
                            {offer.auction_current_price && (<p>Auction Price: <strong>${offer.auction_current_price}</strong></p>)}
                            {offer.buy_now_price && (<p>Buy now Price: <strong>${offer.buy_now_price}</strong></p>)}
                            <button className="offer-button" onClick={() => handleViewOffer(offer.id)}>View Offer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default SearchResults;