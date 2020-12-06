const { response } = require('express');
const express = require('express');
const router = express.Router();
const reviews = require('../data/reviews');
const xss = require('xss');

let { ObjectId } = require('mongodb');

router.post('/delete/:id', async function (req,res){
    const id = ObjectId(xss(req.params.id))
    const review = await reviews.deleteReview(req.params.id);

    res.status(200).json({
        success: true
    });
})

router.post('/like/:id', async function (req,res){
    const id = ObjectId(req.params.id)
    const update = await reviews.updateReviewLike(req.params.id, )
})

module.exports = router;