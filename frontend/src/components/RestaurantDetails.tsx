import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RestaurantDetails.css'

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

    // Show the restaurant in Google Maps
    const openInGoogleMaps = () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}`;
        window.open(googleMapsUrl, '_blank');
    };

    const handleBackToHomepage = () => {
        navigate('/');
    };

    return (
        <div>
            <button id='home-btn' onClick={handleBackToHomepage}>Go Back to Homepage</button>
            {/* Restaurant Details card */}
            <div id='restaurant-details'>
                <h1>{restaurant.name}</h1>
                <p><span className='bold'>Category:</span> <span className='italic'>{restaurant.category}</span></p>
                {restaurant.photo && <img src={restaurant.photo} alt={restaurant.name} />}
                <p>
                    <span className='bold'>Address:</span> {restaurant.address}{' '}
                    <button id='maps-btn' onClick={openInGoogleMaps}>
                        Open in Google Maps
                    </button>
                </p>
                <p id='tel'>
                    <span className='bold'>Phone:</span> <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
                </p>
                {restaurant.details && <p><span className='bold'>Details:</span> {restaurant.details}</p>}
                <div id='btns'>
                    <button id='edit-btn' onClick={() => navigate(`/edit/${id}`)}>Edit Details</button>
                    <button id='delete-btn' onClick={handleDelete}>Delete Restaurant</button>
                </div>
            </div>

        </div>
    );
};

export default RestaurantDetails;
