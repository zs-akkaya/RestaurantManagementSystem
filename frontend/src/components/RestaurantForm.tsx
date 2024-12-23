import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantForm.css';

const MAX_NAME_LENGTH = 60;
const MAX_CATEGORY_LENGTH = 30;
const MAX_DETAILS_LENGTH = 1000;

const RestaurantForm: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        address: '',
        phone: '',
        photo: '',
        details: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Length control for name, category, and details
        if (
            (name === 'name' && value.length > MAX_NAME_LENGTH) ||
            (name === 'category' && value.length > MAX_CATEGORY_LENGTH) ||
            (name === 'details' && value.length > MAX_DETAILS_LENGTH)
        ) {
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const validatePhoneNumber = (phone: string) => {
        // Remove spaces
        const sanitizedPhone = phone.replace(/\s+/g, '');
        // Check phone number with country prefix
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(sanitizedPhone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the phone number is valid
        if (!validatePhoneNumber(formData.phone)) {
            alert('Please enter a valid phone number with a country prefix (e.g., +90 212 123 12 34).');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/restaurants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

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

    const handleBackToHomepage = () => {
        navigate('/');
    };

    return (
        <div>
            <button id='home-btn' onClick={handleBackToHomepage}>Go Back to Homepage</button>
            <h1>Add a New Restaurant</h1>
            <form onSubmit={handleSubmit} id='restaurant-form'>
                <div>
                    <label>Name <span className="small italic">(max {MAX_NAME_LENGTH} characters)</span> <span className='red-text'>*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={MAX_NAME_LENGTH}
                    />
                </div>
                <div>
                    <label>Category <span className="small italic">(max {MAX_CATEGORY_LENGTH} characters)</span> <span className='red-text'>*</span></label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        maxLength={MAX_CATEGORY_LENGTH}
                    />
                </div>
                <div>
                    <label>Address <span className='red-text'>*</span></label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number <span className="small italic">(e.g., +90 212 123 12 34)</span> <span className='red-text'>*</span></label>
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
                    <label>Details <span className="small italic">(max {MAX_DETAILS_LENGTH} characters)</span></label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        maxLength={MAX_DETAILS_LENGTH}
                    />
                </div>
                <button id='submit-btn' type="submit">Add</button>
            </form>
        </div>
    );
};

export default RestaurantForm;
