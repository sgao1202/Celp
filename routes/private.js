const express = require('express');
const reviews = require('../data/reviews');
const restaurants = require('../data/restaurants')
const router = express.Router();
const verifier = require('../data/verify');

router.get('/', async(req, res) =>{
    const userData = req.session.user;
    const userReviews = await reviews.getAllReviewsOfUser(userData._id);

    // Combine restaurants and reviews into one array for easier access
    let restaurantNames = [];
    for (let review of userReviews){
        let rest = await restaurants.getRestaurantById(review.restaurantId);
        restaurantNames.push(rest.name);
    }

    let reviewRest = [];
    for (let i = 0; i < userReviews.length; i++) {
        let currentReview = userReviews[i];
        let max = 5;
        let price = currentReview.metrics.price;
        let rating = currentReview.metrics.rating
        
        reviewRest.push({
            review: currentReview, 
            restaurant: restaurantNames[i],
            filledStars: verifier.generateList(rating),
            unfilledStars: verifier.generateList(max-rating),
            filledDollars: verifier.generateList(price)
        });
    }

    // Get restaurant names of user's favorited restaurants
    let favRestaurants = [];
    for (let restaurantId of userData.favoritedRestaurants){
        let rest = await restaurants.getRestaurantById(restaurantId);
        favRestaurants.push({
            id: restaurantId, 
            name: rest.name
        });
    }


    return res.render('users/info', {
        authenticated: true,
        partial: 'user-info-script',
        user: userData,
        favRestaurants: favRestaurants,
        reviews: reviewRest
    });
});

module.exports = router;