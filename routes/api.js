const { response } = require('express');
const express = require('express');
const router = express.Router();
const reviews = require('../data/reviews');
const restaurants = require('../data/restaurants');
const xss = require('xss');

let { ObjectId } = require('mongodb');
const users = require('../data/users');

router.post('/delete/:id', async function (req,res){
    const id = ObjectId(xss(req.body.id))
    const review = await reviews.deleteReview(xss(req.body.id));

    res.status(200).json({
        success: true
    });
})

router.post('/like/:rid/:uid', async function (req,res){
    const rid = ObjectId(xss(req.body.rid));
    const uid = ObjectId(xss(req.body.uid));
    const review = await reviews.getReviewById(xss(req.body.rid));
    const update = await reviews.updateReviewLike(xss(req.body.rid), xss(req.body.uid), (review.likes.includes(xss(req.body.uid)))? null : true);
    const updatedRev = await reviews.getReviewById(xss(req.body.rid));

    res.status(200).json({
        likeNum: updatedRev.likes.length.toString(),
        dislikeNum: updatedRev.dislikes.length.toString(),
        success: true
    });
})

router.post('/dislike/:rid/:uid', async function (req,res){
    const rid = ObjectId(xss(req.body.rid));
    const uid = ObjectId(xss(req.body.uid));
    const review = await reviews.getReviewById(xss(req.body.rid));
    const update = await reviews.updateReviewLike(xss(req.body.rid), xss(req.body.uid), (review.dislikes.includes(xss(req.body.uid)))? null : false);
    const updatedRev = await reviews.getReviewById(xss(req.body.rid));

    res.status(200).json({
        likeNum: updatedRev.likes.length.toString(),
        dislikeNum: updatedRev.dislikes.length.toString(),
        success: true
    });
})

router.post('/favorite/:rid/:uid', async function (req, res){
    const rid = ObjectId(xss(req.body.rid));
    const uid = ObjectId(xss(req.body.rid));
    const update = await users.toggleFavoriteRestaurant(xss(req.body.uid), xss(req.body.rid));

    //update session user to display on user page
    req.session.user = await users.getUserById(xss(req.body.uid));

    res.status(200).json({
        success: true
    });

})

router.post('/report/:rid/:uid/:restid', async function (req, res){
    const rid = ObjectId(xss(req.body.rid));
    const uid = ObjectId(xss(req.body.uid));
    const restid = ObjectId(xss(req.body.restId))
    const deleted = await reviews.updateReviewReport(xss(req.body.rid), xss(req.body.uid));
    const restaurant = await restaurants.getRestaurantById(xss(req.body.restId));
    const allReviews = await reviews.getAllReviewsOfRestaurant(xss(req.body.restId));
    const numReviews = allReviews.length;
    restaurant.rating = (restaurant.rating / numReviews).toFixed(2);
    restaurant.price = (restaurant.price / numReviews).toFixed(2);
    restaurant.distancedTables = ((restaurant.distancedTables / numReviews) * 100).toFixed(2);
    restaurant.maskedEmployees = ((restaurant.maskedEmployees / numReviews) * 100).toFixed(2);
    restaurant.noTouchPayment = ((restaurant.noTouchPayment / numReviews) * 100).toFixed(2);
    restaurant.outdoorSeating = ((restaurant.outdoorSeating / numReviews) * 100).toFixed(2);
    res.status(200).json({
        success: true,
        deleted: deleted,
        restaurant: restaurant
    });
    
})

module.exports = router;