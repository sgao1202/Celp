const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;

// Route for the page of all restaurants
router.get('/', async (req, res) => {
    const restaurants = await restaurantData.getAllRestaurants();
    // console.log(restaurants);
    res.render('restaurants/all', {restaurants: restaurants});
});

// Search for a specific restaurant
router.get('/:id', async (req, res) => {

});

// Get create a restaurant page
router.get('/new', async (req, res) => {
    console.log('Entered GET route for restaurants/new');
    res.render('restaurants/new');
});

// Route to create a restaurant
router.post('/new', async (req, res) => {
    let newRestaurantData = req.body;
    console.log(newRestaurantData);
});

module.exports = router;