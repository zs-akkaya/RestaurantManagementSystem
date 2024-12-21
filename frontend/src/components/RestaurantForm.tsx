import React from 'react';
import { useParams } from 'react-router-dom';

const RestaurantForm: React.FC = () => {
    const { id } = useParams<{ id?: string }>(); // Optional id for adding/modifying

    return <h1>Restaurant Form - {id ? 'Modify' : 'Add'} Restaurant</h1>;
};

export default RestaurantForm;
