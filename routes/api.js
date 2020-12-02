const { response } = require('express');
const express = require('express');
const router = express.Router();
const reviews = require('../data/reviews');
let { ObjectId } = require('mongodb');

router.post('/delete/:id', async function (req,res){
    const id = ObjectId(req.params.id)
    const review = await reviews.deleteReview(req.params.id);
    console.log(review);
    res.status(200).json({
        success: true,
        review
    })
    return;
    
})

module.exports = router;