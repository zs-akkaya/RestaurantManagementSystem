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
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1); // Highlighted autocomplete suggestion
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const handleAddRestaurant = () => navigate('/add');
    const handleViewDetails = (id: string) => navigate(`/details/${id}`);

    const fetchRestaurants = async () => {
        try {
            const endpoint = searchQuery
                ? `http://localhost:5001/search?query=${searchQuery}`
                : 'http://localhost:5001/restaurants';
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

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);

        if (value.trim()) {
            const fetchedSuggestions = await fetchSuggestions(value);
            setSuggestions(fetchedSuggestions);
            setShowSuggestions(true);
            setActiveSuggestionIndex(-1); // Reset active index
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Manually make autocomplete suggestions as dropdown list
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            setActiveSuggestionIndex((prevIndex) =>
                Math.min(prevIndex + 1, suggestions.length - 1)
            );
        } else if (event.key === 'ArrowUp') {
            setActiveSuggestionIndex((prevIndex) =>
                Math.max(prevIndex - 1, 0)
            );
        } else if (event.key === 'Enter') {
            if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
                setSearchQuery(suggestions[activeSuggestionIndex]);
                setShowSuggestions(false);
            }
        } else if (event.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div>
            <button id="add-btn" onClick={handleAddRestaurant}>
                Add a New Restaurant
            </button>
            <h1>Welcome to the Restaurant Management System!</h1>

            <input
                id="search-input"
                type="text"
                placeholder="Search restaurants by name or category"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => setShowSuggestions(true)}
            />

            {showSuggestions && suggestions.length > 0 && (
                <ul id="autocomplete-dropdown">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={index === activeSuggestionIndex ? 'active' : ''}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}

            {restaurants.length > 0 ? (
                <ul id="restaurant-cards">
                    {restaurants.map((restaurant) => (
                        <div
                            id="restaurant-card"
                            onClick={() => handleViewDetails(restaurant._id)}
                            key={restaurant._id}
                        >
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
                <p id="no-restaurants">No restaurants available. Click to top-right to start.</p>
            )}
        </div>
    );
};

export default HomePage;
