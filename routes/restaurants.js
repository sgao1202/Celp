const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;
const reviewData = data.reviews;
const commentData = data.comments;
const userData = data.users;
const verify = require('../data/verify');

// Route for the page of all restaurants
router.get('/', async (req, res) => {
    const restaurants = await restaurantData.getAllRestaurants();
    if (req.session.user){
        const myUser = req.session.user;
        res.render('restaurants/list', { 
            log: true,
            authenticated: true,
            userName: myUser.username,
            partial: 'restaurants-list-script', 
            restaurants: restaurants
        });
    }
    else{
        res.render('restaurants/list', { 
            log: false,
            authenticated: false,
            partial: 'restaurants-list-script', 
            restaurants: restaurants
        });
    }
    
});

// Get create a restaurant page
router.get('/new', async (req, res) => {
    res.render('restaurants/new', {
        partial: 'restaurants-form-script'
    });
});

// Route to create a restaurant
router.post('/new', async (req, res) => {
    let newRestaurantData = req.body;
    let errors = [];

    if (!verify.validString(newRestaurantData.name)) errors.push('Invalid restaurant name');
    if (!verify.validString(newRestaurantData.address)) errors.push('Invalid restaurat address');
    if (!verify.validString(newRestaurantData.cuisine)) errors.push('Invalid cuisine');

    // Do not submit if there are errors in the form
    if (errors.length > 0) {
        res.render('restaurants/new', {
            partial: 'restaurants-form-script',
            hasErrors: true,
            errors: errors
        });
    }

    try {
        const newRestaurant = await restaurantData.createRestaurant(newRestaurantData.name, newRestaurantData.address, newRestaurantData.cuisine);
        res.redirect(`/restaurants`);
    } catch(e) {
        res.status(500).json({error: e});
    }
});

// Search for a specific restaurant
router.get('/:id', async (req, res) => {
    let id = req.params.id.trim();
    if (!id) res.render('errors/error', {errorMessage: 'Id was not provided in route'});
    
    try {
        const restaurant = await restaurantData.getRestaurantById(id);
        const allReviews = await reviewData.getAllReviewsOfRestaurant(id);
        
        // Reviews will be a list of objects s.t. each object will hold all the info for a single review
        /*
            {
                username: "sgao",
                age: 20,
                text: "Oh wow this is a great restaurant",
                metrics : {subdocument of metrics}
            }
        */
        const reviews = [];
        for (const review of allReviews) {
            let current = {};
            const { username, age } = await userData.getUserById(review.reviewerId);
            current.username = username;
            current.age = age;
            current.text = review.reviewText
            current.metrics = review.metrics;
            current.comments = await commentData.getAllCommentsOfReview(review._id);
            reviews.push(current);
        }
        console.log(reviews);
        // Retreive all the reviews for that restaurant
        res.render('restaurants/single', {
            partial: 'restaurants-single-script',
            restaurant: restaurant,
            reviews: reviews
        });
    } catch(e) {
        res.status(500).render('errors/error', {errorMessage: e});
    }
});

module.exports = router;