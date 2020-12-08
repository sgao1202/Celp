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
        req.session.previousRoute = req.originalUrl;
        res.redirect('/users/login');
        return;
    }

    // Clear the previousRoute in req.session if it exists
    // if (req.session.previousRoute) req.session.previousRoute = '';
    let errors = [];
    let restaurantId = req.params.id.trim();
    if (!verifier.validString(restaurantId)) {
        errors.push("No id was provided to 'restaurants/writeareview/:id' route");
        res.render('errors/error', {
            errors: errors,
            partial: 'errors-script'
        });
    }

    try {
        const restaurant = await restaurantData.getRestaurantById(restaurantId);
        res.render('reviews/create', {
            partial: 'write-a-review-script',
            restaurant: restaurant
        });
    } catch (e) {
        errors.push(e)
        res.status(500).render('errors/error', {
            errors: errors,
            partial: 'errors-script'
        });
    }
});

// User should only be able to access POST route after logging in
router.post('/writeareview/:id', async (req, res) => {
    // Validate input in this route before sending to server
    let restaurantId = req.params.id.trim();
    if (!verifier.validString(restaurantId)) res.render('errors/errror', {errorMessage: "Invalid restaurant id"});

    // Everything in req.body is a string
    let newReviewData = req.body;
    newReviewData.metrics = {
        rating: parseInt(newReviewData.reviewRating),
        price: parseInt(newReviewData.reviewPrice),
        distancedTables: !!newReviewData.distancedTables,
        maskedEmployees: !!newReviewData.maskedEmployees,
        noTouchPayment: !!newReviewData.noTouchPayment,
        outdoorSeating: !!newReviewData.outdoorSeating
    };
    
    // Route-side input validation
    let errors = [];
    if (!req.session.user) errors.push('User is not logged in!');
    if (!verifier.validRating(newReviewData.metrics.rating)) errors.push('Invalid review rating');
    if (!verifier.validRating(newReviewData.metrics.price)) errors.push('Invalid review price');
    if (!verifier.validString(newReviewData.reviewText)) errors.push('Invalid review text');

    if (errors.length > 0) {
        res.render('errors/error', {
            errors: errors,
            partial: 'errors-script'
        });
        return;
    }

    try {
        const restaurant = await restaurantData.getRestaurantById(restaurantId);
        const review = await reviews.createReview(req.session.user._id, restaurantId, newReviewData.reviewText, newReviewData.metrics);
        res.redirect(`../../restaurants/${restaurantId}`);
    } catch (e) {
        errors.push(e);
        res.status(500).render('errors/error', {
            errors: errors,
            partial: 'errors-script'
        });
    }
});

module.exports = router;