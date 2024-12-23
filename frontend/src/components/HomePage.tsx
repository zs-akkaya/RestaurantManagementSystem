import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

interface Restaurant {
    _id: string;
    name: string;
    category: string;
    photo?: string;
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Search query for Elasticsearch
    const [showWelcomeText, setShowWelcomeText] = useState<boolean>(true); // Control welcome text visibility

    const handleAddRestaurant = () => {
        navigate('/add');
    };

    const handleViewDetails = (id: string) => {
        navigate(`/details/${id}`);
    };

    const fetchRestaurants = async () => {
        try {
            const endpoint = searchQuery
                ? `http://localhost:5001/search?query=${searchQuery}` // Use searchQuery if exists
                : 'http://localhost:5001/restaurants'; // Fetch all restaurants if no search query
            const response = await fetch(endpoint);
            if (response.ok) {
                const data = await response.json();
                setRestaurants(data);
            } else {
                console.error('Failed to fetch restaurants');
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, [searchQuery]);

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await fetch(`http://localhost:5001/autocomplete?query=${query}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Failed to fetch autocomplete suggestions');
                return [];
            }
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error);
            return [];
        }
    };

    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);

        if (value.trim()) {
            const fetchedSuggestions = await fetchSuggestions(value);
            setSuggestions(fetchedSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div>
            <button id="add-btn" onClick={handleAddRestaurant}>
                Add a New Restaurant
            </button>
            <h1>Welcome to the Restaurant Management System!</h1>

            {showWelcomeText && (
                <div id="welcome-banner">
                    <p>
                        Welcome to the Restaurant Management System!<br></br>
                        Start by adding a new restaurant using the button at the top-right. You can edit or delete restaurants afterward. Click on a restaurant card to view its details. You can also filter and search restaurants by their names or categories.
                    </p>
                    <button onClick={() => setShowWelcomeText(false)}>X</button>
                </div>
            )}

            {/* Search restaurants */}
            <input
                id="search-input"
                type="text"
                placeholder="Search restaurants by name or category"
                value={searchQuery}
                onChange={handleSearchChange}
            />

            {/* Autocomplete suggestions */}
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => setSearchQuery(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}

            {restaurants.length > 0 ? (
                <ul id="restaurant-cards">
                    {restaurants.map((restaurant) => (
                        <div id="restaurant-card" onClick={() => handleViewDetails(restaurant._id)} key={restaurant._id}>
                            <li>
                                <h3>{restaurant.name}</h3>
                                <p>{restaurant.category}</p>
                                {restaurant.photo && (
                                    <img
                                        id="restaurant-card-img"
                                        src={restaurant.photo}
                                        alt={restaurant.name}
                                    />
                                )}
                            </li>
                        </div>
                    ))}
                </ul>
            ) : (
                <p id='no-restaurants'>No restaurants available. Click to top-right to start.</p>
            )}
        </div>
    );
};

export default HomePage;
