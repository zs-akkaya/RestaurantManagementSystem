import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Restaurant {
    name: string;
    category: string;
    address: string;
    phone: string;
    photo?: string; // Optional
    details?: string; // Optional
}

const RestaurantDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

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

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this restaurant?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5001/restaurants/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Restaurant deleted successfully!');
                    navigate('/'); // Navigate to the homepage after deletion
                } else {
                    alert('Failed to delete restaurant');
                }
            } catch (error) {
                console.error('Error deleting restaurant:', error);
                alert('An error occurred while deleting the restaurant');
            }
        }
    };

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
            <button onClick={() => navigate(`/edit/${id}`)}>Edit Details</button>
            <button onClick={handleDelete} style={{ color: 'red' }}>Delete Restaurant</button>
        </div>
    );
};

export default RestaurantDetails;
