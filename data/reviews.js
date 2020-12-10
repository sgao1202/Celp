const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const verify = require('./verify');

let { ObjectId } = require('mongodb');

module.exports = {
	async getReviewById(reviewId) {
        if (!verify.validString(reviewId)) throw 'reviewId is not a valid string.';

        let parsedId = ObjectId(reviewId);
    
        const reviewCollection = await reviews();
        let review = await reviewCollection.findOne({ _id: parsedId });
        if (review === null) throw 'No review with that id';
        review._id = review._id.toString();

        return review;
    },

    async createReview(reviewerId, restaurantId, reviewText, metrics){
    	if (!verify.validString(reviewerId))   throw 'reviewerId is not a valid string.';
        if (!verify.validString(restaurantId)) throw 'restaurantId is not a valid string.';
        if (!verify.validString(reviewText))   throw 'reviewText is not a valid string.';
        if (!verify.validMetrics(metrics))     throw 'metrics is not valid';

        let newReview = {
        	reviewerId: reviewerId,
        	restaurantId: restaurantId,
        	reviewText: reviewText,
        	metrics: metrics,
        	likes: [],
        	dislikes: []
        };

        restaurants.updateMetrics(restaurantId, metrics, true);
        
        const reviewCollection = await reviews();
        const insertInfo = await reviewCollection.insertOne(newReview);
        if (insertInfo.insertedCount === 0) throw 'Could not add review';
    
        const newId = insertInfo.insertedId;

        const finReview = await this.getReviewById(newId.toString());
        return finReview;
    },

    /*async updateReview(id, newReview){
    	let {reviewerId, restaurantId, reviewText, rating, metrics} = newReview;
    	let updater = {};
    	if(verify.validString(reviewerId)){
    		updater.revewerId = revewerId;
    	}else if(reviewerId){
    		throw 'reviewerId is not a valid string.';
    	}
    	if(verify.validString(restaurantId)){
    		updater.restaurantId = restaurantId;
    	}else if(restaurantId){
    		throw 'restaurantId is not a valid string.';
    	}
    	if(verify.validString(reviewText)){
    		updater.reviewText = reviewText;
    	}else if(reviewText){
    		throw 'reviewText is not a valid string.';
    	}
    	if(verify.validRating(rating)){
    		updater.rating = rating;
    	}else if(rating){
    		throw 'rating is not a valid number.';
    	}
    	if(typeof(metrics)==='object'){
    		let { distancedTables, maskedEmployees, noTouchPayment, outdoorSeating } = metrics;
    		if(!(B(distancedTables) || B(maskedEmployees) || B(noTouchPayment) || B(outdoorSeating))){
    			updater.metrics = metrics;
    		}
    	}else if(metrics){
    		throw 'metrics is defined but not a valid object.';
    	}
    	if (!verify.validString(id)) throw 'id is not a valid string.';
        
        const reviewCollection = await reviews();
    	let review = await reviewCollection.findOne({ _id: ObjectId(id) });
        if (review === null) throw 'No review with that id';
    	const updatedInfo = await reviewCollection.updateOne({_id: ObjectId(id)}, {$set: updater});
		if (updatedInfo.modifiedCount === 0) {
	      throw 'Error: the review is not modified (updater format is valid but nothing to update).';
	    }
    	return await this.getReviewById(id);  	
    },*/

    async updateReviewLike(reviewId, userId, isLike){
    	if (!verify.validString(reviewId)) throw 'id is not a valid string.';
    	if (!verify.validString(userId)) throw 'cid is not a valid string.';
        
        const objReviewId = ObjectId(reviewId);

	    const reviewCollection = await reviews();
    	let review = await reviewCollection.findOne({ _id: objReviewId });
        if (review === null) throw 'No review with that id';

        if (isLike == null) {
            await reviewCollection.updateOne({_id: objReviewId},{$pull: {likes: userId}});
	    	await reviewCollection.updateOne({_id: objReviewId},{$pull: {dislikes: userId}});
            return true;
            
        } else if(isLike) {
	    	const updateInfo = await reviewCollection.updateOne({_id: objReviewId},{$addToSet: {likes: userId}});
	    	await reviewCollection.updateOne({_id: objReviewId},{$pull: {dislikes: userId}});
		    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) return false;
		    return true;

	    } else {
	    	const updateInfo = await reviewCollection.updateOne({_id: objReviewId},{$addToSet: {dislikes: userId}});
	    	await reviewCollection.updateOne({_id: objReviewId},{$pull: {likes: userId}});
		    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) return false;
            return true;      
	    }
    },

    async deleteReview(reviewId){
    	if (!verify.validString(reviewId)) throw 'reviewId is not a valid string.';

        /* Remove all comments on this review */
        let commentList = comments.getAllCommentsOfReview(reviewId);
        if (commentList.length > 0){
            for (let commentId of commentList) {
                await comments.deleteComment(commentId);
            }
        }
        
        let review = await this.getReviewById(reviewId);
        
        restaurants.updateMetrics(review.restaurantId, review.metrics, false);

        /* delete review from DB */
        const reviewCollection = await reviews();
        const deletionInfo = await reviewCollection.deleteOne({ _id: ObjectId(reviewId) });
        if (deletionInfo.deletedCount === 0) throw `Could not delete review with id of ${reviewId}`;

        return; 
    },

    async getAllReviewsOfUser(reviewerId) {
        if (!verify.validString(reviewerId)) throw 'reviewerId is not a valid string.';

        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find({'reviewerId': { $eq: reviewerId}}).toArray();
        for (let x of reviewList) {
            x._id = x._id.toString();
        }

        return reviewList;
    },

    async getAllReviewsOfRestaurant(restaurantId) {
        if (!verify.validString(restaurantId)) throw 'restaurantId is not a valid string.';

        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find({'restaurantId': { $eq: restaurantId}}).toArray();
        for (let x of reviewList) {
            x._id = x._id.toString();
        }

        return reviewList;
    }
}

const restaurants = require('./restaurants');
const comments = require('./comments');