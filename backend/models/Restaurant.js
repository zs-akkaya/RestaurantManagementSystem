const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    photo: { type: String }, // Optional
    details: { type: String }, // Optional
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
