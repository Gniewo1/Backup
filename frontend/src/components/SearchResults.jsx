import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/SearchResults.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query'); // Retrieve 'query' parameter from the URL
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [filter, setFilter] = useState('all'); // Filter state: 'all', 'buy_now', 'auction'
    const [sortOption, setSortOption] = useState(''); // Sort state: 'price_asc', 'price_desc', 'duration_asc', 'duration_desc'
    const navigate = useNavigate();
    const [resultCount, setResultCount] = useState(0);

    const handleViewOffer = (offerId) => {
        // Navigate to the offer's specific page
        navigate(`/offers/${offerId}`);
    };

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);

        // Apply the filter
        if (selectedFilter === 'buy_now') {
            setFilteredResults(results.filter(offer => offer.buy_now_price));
        } else if (selectedFilter === 'auction') {
            setFilteredResults(results.filter(offer => offer.auction_current_price));
        } else {
            setFilteredResults(results); // Show all offers
        }
    };

    const handleSortChange = (e) => {
        const selectedSort = e.target.value;
        setSortOption(selectedSort);

        // Apply the sorting
        const sortedResults = [...filteredResults]; // Clone the filtered results
        if (selectedSort === 'price_asc') {
            sortedResults.sort((a, b) => 
                (a.auction_current_price > 0 ? a.auction_current_price : a.buy_now_price) - 
                (b.auction_current_price > 0 ? b.auction_current_price : b.buy_now_price)
            );
        } else if (selectedSort === 'price_desc') {
            sortedResults.sort((a, b) => 
                (b.auction_current_price > 0 ? b.auction_current_price : b.buy_now_price) - 
                (a.auction_current_price > 0 ? a.auction_current_price : a.buy_now_price)
            );
        } else if (selectedSort === 'duration_asc') {
            sortedResults.sort((a, b) => a.duration - b.duration);
        } else if (selectedSort === 'duration_desc') {
            sortedResults.sort((a, b) => b.duration - a.duration);
        }
        setFilteredResults(sortedResults);
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
                    setFilteredResults(resultsWithDuration); // Initialize filtered results
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
                <h2>Wyniki wyszukiwania ({filteredResults.length})</h2>

                {/* Filter and Sort Section */}
                <div className="filter-sort-section">
                    <div className="filter-section">
                        <label htmlFor="offer-filter">Filtruj typ oferty:</label>
                        <select id="offer-filter" value={filter} onChange={handleFilterChange}>
                            <option value="all">Wszystko</option>
                            <option value="buy_now">Kup Teraz</option>
                            <option value="auction">Aukcja</option>
                        </select>
                    </div>
                    <div className="sort-section">
                        <label htmlFor="offer-sort">Sortuj:</label>
                        <select id="offer-sort" value={sortOption} onChange={handleSortChange}>
                            <option value="">Brak sortowania</option>
                            <option value="price_asc">Cena: Rosnąco</option>
                            <option value="price_desc">Cena: Malejąco</option>
                            <option value="duration_asc">Najstarsze</option>
                            <option value="duration_desc">Najnowsze</option>
                        </select>
                    </div>
                </div>

                {/* Offers Grid */}
                <div className="offers-grid">
                    {filteredResults.map((offer, index) => (
                        <div className="offer-card" key={index}>
                            <img
                                src={`http://localhost:8000/media/${offer.front_image}`}
                                alt={offer.card__name}
                                className="offer-image"
                            />
                            <div className="offer-details">
                                <p>Sprzedawca: <strong>{offer.seller__username}</strong></p>
                                <p>Karta: <strong>{offer.card__name}</strong></p>
                                {offer.auction_current_price && (<p>Cena Aukcja: <strong>{offer.auction_current_price} zł</strong></p>)}
                                {offer.buy_now_price && (<p>Cena Kup Teraz: <strong>{offer.buy_now_price} zł</strong></p>)}
                                <p><strong>Czas trwania: </strong></p>
                                <p>
                                    {Math.floor(offer.duration / (1000 * 60 * 60 * 24))} dni, 
                                    {Math.floor((offer.duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} godzin, 
                                    {Math.floor((offer.duration % (1000 * 60 * 60)) / (1000 * 60))} minut
                                </p>
                                <button className="offer-button" onClick={() => handleViewOffer(offer.id)}>Pokaż ofertę</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SearchResults;