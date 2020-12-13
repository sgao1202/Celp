const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewData = data.reviews;
const restaurantData = data.restaurants;
const commentData = data.comments;
const userData = data.users;
const verifier = require('../data/verify');
const xss = require('xss');

let { ObjectId } = require('mongodb');
const users = require('../data/users');

router.post('/delete/:id', async function (req,res){
    const id = ObjectId(xss(req.body.id))
    const delReview = await reviewData.deleteReview(xss(req.body.id));
    const reviewList = await reviewData.getAllReviewsOfUser(delReview.reviewerId)
    let empty = false;
    if (reviewList.length == 0){
        empty = true;
    }

    res.status(200).json({
        success: true,
        empty: empty
    });
})

router.post('/like/:rid/:uid', async function (req,res){
    const rid = ObjectId(xss(req.body.rid));
    const uid = ObjectId(xss(req.body.uid));
    const review = await reviewData.getReviewById(xss(req.body.rid));
    const update = await reviewData.updateReviewLike(xss(req.body.rid), xss(req.body.uid), (review.likes.includes(xss(req.body.uid)))? null : true);
    const updatedRev = await reviewData.getReviewById(xss(req.body.rid));

    res.status(200).json({
        likeNum: updatedRev.likes.length.toString(),
        dislikeNum: updatedRev.dislikes.length.toString(),
        success: true
    });
})

router.post('/dislike/:rid/:uid', async function (req,res){
    const rid = ObjectId(xss(req.body.rid));
    const uid = ObjectId(xss(req.body.uid));
    const review = await reviewData.getReviewById(xss(req.body.rid));
    const update = await reviewData.updateReviewLike(xss(req.body.rid), xss(req.body.uid), (review.dislikes.includes(xss(req.body.uid)))? null : false);
    const updatedRev = await reviewData.getReviewById(xss(req.body.rid));

    res.status(200).json({
        likeNum: updatedRev.likes.length.toString(),
        dislikeNum: updatedRev.dislikes.length.toString(),
        success: true
    });
})

router.post('/favorite/:rid/:uid', async function (req, res){
    const rid = ObjectId(xss(req.body.rid));
    const uid = ObjectId(xss(req.body.rid));
    const update = await userData.toggleFavoriteRestaurant(xss(req.body.uid), xss(req.body.rid));

    //update session user to display on user page
    req.session.user = await userData.getUserById(xss(req.body.uid));

    res.status(200).json({
        success: true
    });

})

router.post('/report/:rid/:uid/:restid', async function (req, res){
    const rid = ObjectId(xss(req.body.rid));
    const uid = ObjectId(xss(req.body.uid));
    const restid = ObjectId(xss(req.body.restId))
    const deleted = await reviewData.updateReviewReport(xss(req.body.rid), xss(req.body.uid));
    const restaurant = await restaurantData.getRestaurantById(xss(req.body.restId));
    const allReviews = await reviewData.getAllReviewsOfRestaurant(xss(req.body.restId));
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

router.post('/comment/new', async (req, res) => {   
    let errors = [];
    let reviewId = xss(req.body.reviewId.trim());
    let text = xss(req.body.text.trim());

    if (!req.session.user) errors.push('Must log in to comment');
    let userId = req.session.user._id;
    if (!verifier.validString(reviewId)) errors.push('Invalid comment reviewId');
    if (!verifier.validString(userId)) errors.push('Invalid comment userId');
    if (!verifier.validString(text)) errors.push('Invalid comment textt');

    if (errors.length > 0) {
        res.status(500).json({
            success: false,
            errors: errors,
            message: 'Errors encountered'
        });
    }

    try {
        const comment = await commentData.createComment(reviewId, userId, text);
        // Get user info
        let {username, age, firstName, lastName} = await userData.getUserById(userId);
        let commentLayout = {
            username: username,
            text: comment.text
        };
        res.render('partials/comment_item', { layout: null, ...commentLayout});
        // res.json({
        //     success: true,
        //     text: comment.text,
        //     username: username,
        //     firstName: firstName,
        //     lastName: lastName
        // });
    } catch (e) {
        errors.push(e);
        res.status(500).json({
            success: false,
            errors: errors
        });
    }
});

module.exports = router;