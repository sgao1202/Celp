const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;
const reviewData = data.reviews;

// Route for the page of all restaurants
router.get('/', async (req, res) => {
    const restaurants = await restaurantData.getAllRestaurants();
    // console.log(restaurants);
    res.render('restaurants/list', { 
        partial: 'restaurants-list-script', 
        restaurants: restaurants
    });
});

// Search for a specific restaurant
router.get('/:id', async (req, res) => {
    let id = req.params.id.trim();
    if (!id) res.render('errors/error', {errorMessage: 'Id was not provided in route'});
    
    try {
        const restaurant = await restaurantData.getRestaurantById(id);
        // Retreive all the reviews for that restaurant
        res.render('restaurants/individual', {
            partial: 'restaurants-single-script',
            restaurant: restaurant
        });
    } catch(e) {
        res.status(500).render('errors/error', {errorMessage: e});
    }
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