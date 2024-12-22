import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleAddRestaurant = () => {
        navigate('/add');
    };

    return (
        <div>
            <h1>Welcome to the Restaurant Management System!</h1>
            <button onClick={handleAddRestaurant}>Add a New Restaurant</button>
        </div>
    );
};

export default HomePage;
