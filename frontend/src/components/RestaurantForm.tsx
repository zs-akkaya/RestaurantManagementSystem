import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantForm: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        category: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Add the new restaurant to the database by using POST to /restaurants endpoint
        try {
            const response = await fetch('http://localhost:5001/restaurants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            // If success, navigate to the homepage
            if (response.ok) {
                alert('Restaurant added successfully!');
                navigate('/');
            } else {
                alert('Failed to add restaurant');
            }
        } catch (error) {
            console.error('Error adding restaurant:', error);
            alert('An error occurred');
        }
    };

    return (
        <div>
            <h1>Add a New Restaurant</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default RestaurantForm;
