import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [items, setItems] = useState([]);
  useEffect(() => {
            const fetchItems = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/items'); // Match your backend port
                    setItems(response.data);
                } catch (error) {
                    console.error('Error fetching items:', error);
                }
            };
            fetchItems();
        }, []);

        return (
            <div>
                <h1>Items from PostgreSQL</h1>
                <ul>
                    {items.map(item => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            </div>
        );
    }

    export default App;