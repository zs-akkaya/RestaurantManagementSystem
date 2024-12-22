import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditRestaurant: React.FC = () => {
    const { id } = useParams<{ id: string }>();
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
                // Back to the homepage
                navigate(`/`);
            } else {
                alert('Failed to update restaurant details');
            }
        } catch (error) {
            console.error('Error updating restaurant details:', error);
            alert('An error occurred while updating details');
        }
    };

    return (
        <div>
            <h1>Edit Restaurant Details</h1>
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
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
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
                    <label>Phone:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Photo URL:</label>
                    <input
                        type="url"
                        name="photo"
                        value={formData.photo}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Details:</label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditRestaurant;
