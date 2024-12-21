import React from 'react';
import { useParams } from 'react-router-dom';

const RestaurantDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Required id for details

    return <h1>Restaurant Details for ID: {id}</h1>;
};

export default RestaurantDetails;
