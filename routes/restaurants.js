const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;

// Route for the page of all restaurants
router.get('/', async (req, res) => {
    const restaurants = await restaurantData.getAllRestaurants();
    console.log(restaurants);
    res.render('restaurants/all', {restaurants: restaurants});
});

// Search for a specific restaurant
router.get('/:id', async (req, res) => {

});

// Route to create a restaurant
router.post('/create', async (req, res) => {

});

module.exports = router;