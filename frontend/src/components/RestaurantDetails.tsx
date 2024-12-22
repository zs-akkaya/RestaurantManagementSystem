import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Restaurant {
    name: string;
    category: string;
    address: string;
    phone: string;
    photo?: string;
    details?: string;
}

const RestaurantDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

    // Fetch a restaurant details with the specific restaurant ID
    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5001/restaurants/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setRestaurant(data);
                } else {
                    console.error('Failed to fetch restaurant details');
                }
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };

        fetchRestaurantDetails();
    }, [id]);

    if (!restaurant) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{restaurant.name}</h1>
            <p>Category: {restaurant.category}</p>
            <p>Address: {restaurant.address}</p>
            <p>Phone: {restaurant.phone}</p>
            {restaurant.photo && <img src={restaurant.photo} alt={restaurant.name} style={{ width: '300px' }} />}
            {restaurant.details && <p>Details: {restaurant.details}</p>}
        </div>
    );
};

export default RestaurantDetails;
