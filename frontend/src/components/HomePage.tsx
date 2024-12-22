import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    // Fetch all the restaurants
    const fetchRestaurants = async () => {
        try {
            const endpoint = searchQuery
                ? `http://localhost:5001/search?query=${searchQuery}` // use searchQuery if exists
                : 'http://localhost:5001/restaurants'; // Fetch all of the restaurants if no search query
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

    // Fetch restaurants on initial load and also whenever the search query changes
    useEffect(() => {
        fetchRestaurants();
    }, [searchQuery]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleAddRestaurant = () => {
        navigate('/add');
    };

    const handleViewDetails = (id: string) => {
        navigate(`/details/${id}`);
    };

    return (
        <div>
            <h1>Welcome to the Restaurant Management System!</h1>
            <button onClick={handleAddRestaurant}>Add a New Restaurant</button>
            <h2>Restaurant List</h2>
            <input
                type="text"
                placeholder="Search a restaurant by name or category"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            {restaurants.length > 0 ? (
                <ul>
                    {restaurants.map((restaurant) => (
                        <li key={restaurant._id}>
                            <h3>{restaurant.name}</h3>
                            <p>Category: {restaurant.category}</p>
                            {restaurant.photo && <img src={restaurant.photo} alt={restaurant.name} style={{ width: '200px' }} />}
                            <button onClick={() => handleViewDetails(restaurant._id)}>Show Details</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No restaurants available.</p>
            )}
        </div>
    );
};

export default HomePage;
