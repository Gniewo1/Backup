import React, { useState } from 'react';

const SearchOffers = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:8000/cards/search_offers/?q=${query}`);
            const data = await response.json();
            setResults(data.results);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by card name..."
                />
                <button type="submit">Search</button>
            </form>

            <ul>
                {results.map((offer, index) => (
                    <li key={index}>
                        <p>
                            <strong>{offer.user__username}</strong> offers <strong>{offer.card__name}</strong> for {offer.offer_price}
                        </p>
                        <img 
                            src={`http://localhost:8000/media/${offer.card__image}`} 
                            alt={offer.card__name} 
                            width="100"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchOffers;

