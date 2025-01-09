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
                    const resultsWithDuration = response.data.results.map((item) => {
                        // Assuming each item has an `auction_end_date` field
                        const auctionEndDate = new Date(item.auction_end_date);
                        const currentDate = new Date();
                        const duration = auctionEndDate - currentDate;

    
                        return {
                            ...item,
                            duration, // Add the calculated duration to the item
                        };
                    });
    
                    setResults(resultsWithDuration); // Update state with processed results
                    setResultCount(resultsWithDuration.length);
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
                            <p><strong>Offer duration: </strong></p>
                            <p>{Math.floor(offer.duration / (1000 * 60 * 60 * 24))} days, {Math.floor((offer.duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} hours, {Math.floor((offer.duration % (1000 * 60 * 60)) / (1000 * 60))} minutes</p>
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