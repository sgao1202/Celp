const express = require('express');
const router = express.Router();
const data = require('../data');
const yelp = require('yelp-fusion');
const restaurantData = data.restaurants;
const reviewData = data.reviews;
const commentData = data.comments;
const userData = data.users;
const verify = require('../data/verify');
const xss = require('xss');
const e = require('express');
const apiKey = 'tWaKVqK2ktyz9c0V5G219_tqPdsQxkuNnt6RYpLXqf-TLZN9mQMBmpDZspWi7IUtvxHSghav2WgdYaCz-viZDUO19uPSJCLK-6ToPnfJWDMj1_-fELadhOJ8mqPSX3Yx';

let cuisineTypes = ['American', 'Breakfast', 'Chinese', 'Fast Food', 'Italian',
    'Mexican', 'Thai', 'Korean', 'Middle-Eastern', 'Indian', 'Soul Food',
    'French', 'Japanese', 'Vietnamese', 'Mediterranean', 'Cuban', 'Sichuan',
    'Greek', 'Halal','Other'
];
cuisineTypes.sort();

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
    // if (!req.session.user) {
    //     req.session.previousRoute = req.originalUrl;
    //     return res.redirect('/users/login');
    // }
    // Select options for cuisine type
    return res.render('restaurants/new', { 
            cuisines: cuisineTypes,
            authenticated: req.session.user? true : false,
            user: req.session.user,
            partial: 'restaurants-form-script'
    });
});

// Route to create a restaurant
router.post('/new', async (req, res) => {
    const newName = xss(req.body.name);
    const newAddress = xss(req.body.address);
    const newCuisine = xss(req.body.cuisine);
    const newCuisineInput = xss(req.body.cuisineInput);
    const newLink = xss(req.body.link);
    let otherOption = 'Other';

    if (newCuisine === otherOption) newCuisine = newCuisineInput;

    let errors = [];
    if (!verify.validString(newName)) errors.push('Invalid restaurant name');
    if (!verify.validString(newAddress)) errors.push('Invalid restaurat address');
    if (!verify.validString(newCuisine)) errors.push('Invalid cuisine');
    if (newLink && !verify.validLink(newLink)) errors.push('Invalid yelp link. Link should be of the form :\n https://www.yelp.com/biz/name-of-the-restaurant');

    
    const allRestaurants = await restaurantData.getAllRestaurants();

    for (let x of allRestaurants) {
        if (x.address === newAddress) errors.push('A restaurant with this address already exists');
    }

    // Do not submit if there are errors in the form
    if (errors.length > 0) {
        return res.render('restaurants/new', {
            cuisines: cuisineTypes,
            partial: 'restaurants-form-script',
            authenticated: req.session.user ? true : false,
            user: req.session.user,
            hasErrors: true,
            errors: errors
        });
    }

    try {
        const newRestaurant = await restaurantData.createRestaurant(newName, newAddress, newCuisine, newLink);
        res.redirect(`/restaurants`);
    } catch(e) {
        res.status(500).json({error: e});
    }
});

// Search for a specific restaurant
router.get('/:id', async (req, res) => {
    let id = req.params.id.trim();
    if (!id) return res.render('errors/error', {errorMessage: 'Id was not provided in route'});
    
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
            let { firstName, lastName, age } = await userData.getUserById(review.reviewerId);
            current.id = review._id;
            current.name = firstName + ' ' + lastName;
            current.age = age;
            current.text = review.reviewText;
            current.metrics = review.metrics;
            current.likes = review.likes;
            current.dislikes = review.dislikes;
            current.reported = review.reported;

            let allComments = await commentData.getAllCommentsOfReview(review._id);
            let comments = [];
            for (const comment of allComments) {
                let currentComment = {};
                let {firstName, lastName, age} = await userData.getUserById(comment.userId);
                currentComment.name = firstName + ' ' + lastName;
                currentComment.age = age;
                currentComment.text = comment.text
                comments.push(currentComment);
            }
            current.comments = comments;

            let max = 5;
            current.filledStars = verify.generateList(current.metrics.rating);
            current.unfilledStars = verify.generateList(max - current.metrics.rating);
            current.filledDollars = verify.generateList(current.metrics.price)
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

        // Get the restaurant's photos from calling Yelp API
        const client = yelp.client(apiKey);
        const matchRequest = {
            name: restaurant.name,
            address1: restaurant.address,
            city: 'Hoboken',
            state: 'NJ',
            country: 'US'
        };

        const matchRes = await client.businessMatch(matchRequest);
        const jsonRes = matchRes.jsonBody;
        let results = jsonRes.businesses;
        let result = results[0];
        let photos = [];
        if (results.length > 0) {
            const businessRes = await client.business(result.id);
            const jsonRes2 = businessRes.jsonBody;
            photos = jsonRes2.photos;
        }

        res.render('restaurants/single', {
            partial: 'restaurants-single-script',
            authenticated: req.session.user ? true : false,
            user: req.session.user,
            restaurant: restaurant,
            reviews: reviews,
            photos: photos
        });
    } catch(e) {
        res.status(500).render('errors/error', {errorMessage: e});
    }
});

module.exports = router;