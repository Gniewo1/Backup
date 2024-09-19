import React, { useEffect, useState } from 'react';

const ItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');  // Get token from localStorage

    fetch('http://localhost:8000/api/items/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,  // Include the token in the header
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div>
      <h1>Items List</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <h2>{item.first_name}</h2>
            <p>{item.last_name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;