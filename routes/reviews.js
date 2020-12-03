const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewData = data.reviews;
const restaurantData = data.restaurants;

router.get('/writeareview/:id', async (req, res) => {
    let restaurantId = req.params.id.trim();
    if (!restaurantId) res.render('errors/error', {errorMessage: "No id was provided to 'restaurants/writeareview/:id' route"});

    try {
        const restaurant = await restaurantData.getRestaurantById(restaurantId);
        res.render('reviews/create', {
            partial: 'write-a-review-script',
            restaurant: restaurant
        });
    } catch (e) {
        res.status(500).render('errors/error', {errorMessage: e});
    }
});

router.post('/writeareview/:id', async (req, res) => {
    // Validate input in route
});

module.exports = router;