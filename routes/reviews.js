const express = require('express');
const router = express.Router();
const data = require('../data');
const reviews = require('../data/reviews');
const reviewData = data.reviews;
const restaurantData = data.restaurants;
const verifier = require('../data/verify');
const xss = require('xss')

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
            authenticated: req.session.user? true : false,
            user : req.session.user,
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
    let restaurantId = xss(req.params.id.trim());
    if (!verifier.validString(restaurantId)) res.render('errors/errror', {errorMessage: "Invalid restaurant id"});

    // Everything in req.body is a string
    const newRating = parseInt(xss(req.body.reviewRating));
    const newPrice = parseInt(xss(req.body.reviewPrice));
    const newDistanced = xss(req.body.distancedTables);
    const newMasked = xss(req.body.maskedEmployees);
    const newPayment = xss(req.body.noTouchPayment);
    const newSeating = xss(req.body.outdoorSeating);
    const newReviewText = xss(req.body.reviewText);

    const newMetrics = {
        rating: newRating,
        price: newPrice,
        distancedTables: !!newDistanced,
        maskedEmployees: !!newMasked,
        noTouchPayment: !!newPayment,
        outdoorSeating: !!newSeating
    };
    
    // Route-side input validation
    let errors = [];
    if (!req.session.user) errors.push('User is not logged in!');
    if (!verifier.validRating(newMetrics.rating)) errors.push('Invalid review rating');
    if (!verifier.validRating(newMetrics.price)) errors.push('Invalid review price');
    if (!verifier.validString(newReviewText)) errors.push('Invalid review text');

    if (errors.length > 0) {
        res.render('errors/error', {
            errors: errors,
            partial: 'errors-script'
        });
        return;
    }

    try {
        const restaurant = await restaurantData.getRestaurantById(restaurantId);
        const review = await reviews.createReview(req.session.user._id, restaurantId, newReviewText, newMetrics);
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