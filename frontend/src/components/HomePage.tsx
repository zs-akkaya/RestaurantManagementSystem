import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

interface Restaurant {
    _id: string;
    name: string;
    category: string;
    photo?: string;
}

// Homepage to see all the restaurants together and search for a specific restaurant

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1); // Highlighted autocomplete suggestion
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const handleAddRestaurant = () => navigate('/add');
    const handleViewDetails = (id: string) => navigate(`/details/${id}`);

    // Get all restaurants OR Get restaurants with search query results
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

    // Get autocomplete suggestions from /autocomplete endpoint
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

    // When click a autocomplete suggestion
    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
    };

    const [showWelcomeText, setShowWelcomeText] = useState<boolean>(true); // Control welcome text visibility

    return (
        <div>
            {/* Button for adding a new restaurant */}
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

            {/* Search a restaurant input */}
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

            {/* Autocomplete suggestions */}
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

            {/* Get restaurants */}
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
