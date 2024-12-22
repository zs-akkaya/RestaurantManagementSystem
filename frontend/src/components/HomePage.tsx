import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
    _id: string;
    name: string;
    category: string;
    photo?: string; // Optional
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    // Fetch all restaurants from the backend to show them on the homepage
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:5001/restaurants');
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

        fetchRestaurants();
    }, []);

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
