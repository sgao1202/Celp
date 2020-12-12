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
    restaurants.forEach(async (restaurant)=>{
        allReviews = await reviewData.getAllReviewsOfRestaurant(restaurant._id);
        numReviews = allReviews.length;
        restaurant.rating = (restaurant.rating / numReviews).toFixed(2);
        restaurant.price = (restaurant.price / numReviews).toFixed(2);
        if (numReviews === 0) {
            restaurant.rating = 'No Reviews';
            restaurant.price = 'No Reviews';
        }
    });
    return res.render('restaurants/list', { 
        authenticated: req.session.user ? true : false,
        user: req.session.user,
            partial: 'restaurants-list-script', 
            restaurants: restaurants
    });
});

// Get create a restaurant page
router.get('/new', async (req, res) => {
    return res.render('restaurants/new', { 
            authenticated: req.session.user? true : false,
            user: req.session.user,
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
    if (!verify.validLink(newRestaurantData.link)) errors.push('Invalid yelp link. Link should be of the form :\n https://www.yelp.com/biz/name-of-the-restaurant');

    // Do not submit if there are errors in the form
    if (errors.length > 0) {
        res.render('restaurants/new', {
            partial: 'restaurants-form-script',
            authenticated: req.session.user? true : false,
            user: req.session.user,
            hasErrors: true,
            errors: errors
        });
    }

    try {
        const newRestaurant = await restaurantData.createRestaurant(newRestaurantData.name, newRestaurantData.address, newRestaurantData.cuisine, newRestaurantData.link);
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
                metrics : {subdocument of metrics},
                comments: []
            }
        */
        const reviews = [];
        for (const review of allReviews) {
            let current = {};
            let { username, age } = await userData.getUserById(review.reviewerId);
            current.id = review._id;
            current.username = username;
            current.age = age;
            current.text = review.reviewText;
            current.metrics = review.metrics;
            current.likes = review.likes;
            current.dislikes = review.dislikes;

            let allComments = await commentData.getAllCommentsOfReview(review._id);
            let comments = [];
            for (const comment of allComments) {
                let currentComment = {};
                let {username, age} = await userData.getUserById(comment.userId);
                currentComment.username = username;
                currentComment.age = age;
                currentComment.text = comment.text
                comments.push(currentComment);
            }
            current.comments = comments;
            reviews.push(current);
        }

        // Calculate percentages for ratings based off of reviews
        const numReviews = allReviews.length;
        restaurant.rating = (restaurant.rating / numReviews).toFixed(2);
        restaurant.price = (restaurant.price / numReviews).toFixed(2);
        restaurant.distancedTables = ((restaurant.distancedTables / numReviews) * 100).toFixed(2);
        restaurant.maskedEmployees = ((restaurant.maskedEmployees / numReviews) * 100).toFixed(2);
        restaurant.noTouchPayment = ((restaurant.noTouchPayment / numReviews) * 100).toFixed(2);
        restaurant.outdoorSeating = ((restaurant.outdoorSeating / numReviews) * 100).toFixed(2);

        res.render('restaurants/single', {
            partial: 'restaurants-single-script',
            authenticated: req.session.user ? true : false,
            user: req.session.user,
            restaurant: restaurant,
            reviews: reviews
        });
    } catch(e) {
        res.status(500).render('errors/error', {errorMessage: e});
    }
});

module.exports = router;