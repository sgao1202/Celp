const express = require('express');
const router = express.Router();
const data = require('../data');
const reviews = require('../data/reviews');
const reviewData = data.reviews;
const restaurantData = data.restaurants;
const verifier = require('../data/verify');

router.get('/writeareview/:id', async (req, res) => {
    // Redirect the user to login page if they attempt to create a review without logging in 
    // Use req.session to store the redirect address after logging in
    if (!req.session.user) {
        console.log(req.session);
        req.session.previousRoute = req.originalUrl;
        res.redirect('/users/login');
        return;
    }

    // Clear the previousRoute in req.session if it exists
    if (req.session.previousRoute) req.session.previousRoute = '';

    let restaurantId = req.params.id.trim();
    if (!verifier.validString(restaurantId)) res.render('errors/error', {errorMessage: "No id was provided to 'restaurants/writeareview/:id' route"});

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

// User should only be able to access POST route after logging in
router.post('/writeareview/:id', async (req, res) => {
    // Validate input in this route before sending to server
    let restaurantId = req.params.id.trim();
    if (!verifier.validString(restaurantId)) res.render('errors/errror', {errorMessage: "Invalid restaurant id"});

    let newReviewData = req.body;
    console.log(newReviewData);
    let errors = [];
    for (let key in newReviewData) {
        console.log(`${key} : ${typeof newReviewData[key]}`);
    }

    if (!verifier.validRating(newReviewData.reviewRating)) errors.push('Invalid review rating');
    if (!verifier.validRating(newReviewData.reviewPricing)) errors.push('Invalid review price');
    if (!verifier.validString(newReviewData.reviewText)) errors.push('Invalid review text');
    try {
        const restaurant = await restaurantData.getRestaurantById(restaurantId);
        // const review = await reviews.createReview()
        res.redirect(`../../restaurants/${restaurantId}`);
    } catch (e) {
        res.status(500).render('errors/error', {errorMessage: e});
    }
});

module.exports = router;