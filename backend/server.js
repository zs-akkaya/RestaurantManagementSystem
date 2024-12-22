const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS Middleware (Cross Origin Resource Sharing) (Authorized resource sharing)
app.use(cors());
app.use(bodyParser.json());

// Elasticsearch connection
const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
    node: 'https://192.168.0.10:9200',
    auth: {
        username: 'elastic',
        password: '64u90_yqHPxRxrMNn9Ls',
    },
    tls: {
        rejectUnauthorized: false,
    },
});

esClient.ping()
    .then(() => console.log('Elasticsearch connected'))
    .catch((err) => console.error('Elasticsearch connection error:', err));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/restaurantDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Create Elasticsearch Restaurant index if it does not exist
const createIndexIfNotExists = async () => {
    const indexExists = await esClient.indices.exists({ index: 'restaurants' });
    console.log('Restaurant index already exists.');

    if (!indexExists) {
        await esClient.indices.create({
            index: 'restaurants',
            body: {
                mappings: {
                    properties: {
                        name: { type: 'text' },
                        category: { type: 'text' },
                        address: { type: 'text' },
                        phone: { type: 'text' },
                        photo: { type: 'text' },
                        details: { type: 'text' },
                    },
                },
            },
        });
        console.log('Restaurants index created');
    }
};

createIndexIfNotExists();

// Import Restaurant Model
const Restaurant = require('./models/Restaurant');

// Endpoints
// GET, POST, PUT, DELETE with Elasticsearch indexing

// GET /restaurants - List all restaurants
app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /restaurants/:id - Get a specific restaurant by ID
app.get('/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/restaurants', async (req, res) => {
    try {
        const newRestaurant = new Restaurant(req.body);
        const savedRestaurant = await newRestaurant.save();

        // Index the new restaurant in Elasticsearch
        try {
            // Remove __v and _id
            const restaurantData = savedRestaurant.toObject({ versionKey: false }); // Removes __v
            delete restaurantData._id; // Removes _id

            await esClient.index({
                index: 'restaurants',
                id: savedRestaurant._id.toString(),
                document: restaurantData,
            });

            console.log('Restaurant indexed in Elasticsearch:', savedRestaurant._id);
        } catch (error) {
            console.error('Error indexing restaurant in Elasticsearch:', error);
        }

        res.status(201).json(savedRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.put('/restaurants/:id', async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Update the Elasticsearch index
        const restaurantData = updatedRestaurant.toObject({ versionKey: false });
        delete restaurantData._id; // Exclude _id again from the document body

        await esClient.update({
            index: 'restaurants',
            id: req.params.id, // MongoDB ID as the Elasticsearch ID
            doc: restaurantData, // Updated data
        });

        res.json(updatedRestaurant);
    } catch (error) {
        console.error('Error updating restaurant in Elasticsearch:', error);
        res.status(400).json({ message: error.message });
    }
});


app.delete('/restaurants/:id', async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Delete the document from Elasticsearch
        try {
            await esClient.delete({
                index: 'restaurants',
                id: req.params.id, // MongoDB ID as the Elasticsearch ID
            });
            console.log('Restaurant deleted from Elasticsearch:', req.params.id);
        } catch (error) {
            console.error('Error deleting restaurant from Elasticsearch:', error);
        }

        res.json({ message: 'Restaurant deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
