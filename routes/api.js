const { response } = require('express');
const express = require('express');
const router = express.Router();
const reviews = require('../data/reviews');
const xss = require('xss');

let { ObjectId } = require('mongodb');

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
    const update = await reviews.updateReviewLike(xss(req.params.rid), xss(req.params.uid), (review.dislikes.includes(xss(req.body.uid)))? null : false);
    const updatedRev = await reviews.getReviewById(xss(req.body.rid));

    res.status(200).json({
        likeNum: updatedRev.likes.length.toString(),
        dislikeNum: updatedRev.dislikes.length.toString(),
        success: true
    });
})

module.exports = router;