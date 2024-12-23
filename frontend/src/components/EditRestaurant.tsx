import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RestaurantForm.css';

// Edit a restaurant page

const EditRestaurant: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // To get the restaurant info
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        address: '',
        phone: '',
        photo: '',
        details: '',
    });

    useEffect(() => {
        // Get restaurant details from /restaurants/id endpoint
        const fetchRestaurantDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5001/restaurants/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    console.error('Failed to fetch restaurant details');
                }
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };

        fetchRestaurantDetails();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Update details by using PUT method on /restaurants/id endpoint
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5001/restaurants/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Restaurant details updated successfully!');
                navigate(`/details/${id}`); // Navigate back to the details page after update
            } else {
                alert('Failed to update restaurant details');
            }
        } catch (error) {
            console.error('Error updating restaurant details:', error);
            alert('An error occurred while updating details');
        }
    };

    const handleBackToDetailsPage = () => {
        navigate(`/details/${id}`); // Go back to the restaurant details page
    };

    return (
        <div>
            {/* Button to go back to the details page */}
            <button id='details-btn' onClick={handleBackToDetailsPage}>Go Back to Details Page</button>
            <h1>Edit Restaurant Details</h1>
            <form onSubmit={handleSubmit} id='restaurant-form'>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Photo URL</label>
                    <input
                        type="url"
                        name="photo"
                        value={formData.photo}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Details</label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                    />
                </div>
                <button id='submit-btn' type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditRestaurant;
