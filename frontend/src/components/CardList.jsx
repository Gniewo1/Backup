import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

const CardList = () => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        // Fetch cards from Django API
        axios.get('http://localhost:8000/cards/cards/')
            .then(response => {
                setCards(response.data);
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
            });
    }, []);

    return (
        <div className="card-list">
            {cards.map(card => (
                <Card key={card.id} name={card.name} image={card.image} />
            ))}
        </div>
    );
};

export default CardList;