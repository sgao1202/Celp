const mongoCollections = require('../config/mongoCollections');
const restaurants = mongoCollections.restaurants;
const verify = require('./verify');

let { ObjectId } = require('mongodb');

// Example Restaurant JSON
// {
//     "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b6c9283",
//     "name": "Bobs Burgers",
//     "address": "123 Washington St",
//     "cuisine": "American",
//     "rating": 2.3,
//     "price": 1,
//     "distancedTables": 88,
//     "maskedEmployees": 12,
//     "noTouchPayment": 100,
//     "outdoorSeating": 0,
//     "link": "https://www.yelp.com/biz/bobs-burgers-hoboken"
// }

module.exports = {

    // Returns an array of all the restaurants in the database
    async getAllRestaurants() {
        const restaurantCollection = await restaurants();
        const allRestaurants = await restaurantCollection.find({}).toArray();

        // Change all _id values to strings
        return allRestaurants.map(verify.convertId);
    },

    // Returns: a singular document (JSON) from the database
    async getRestaurantById(id) {
        if (!verify.validString(id)) throw 'Restuarant Id must be a valid string';
        let objId = ObjectId(id.trim());
        const restaurantCollection = await restaurants();

        const restaurant = await restaurantCollection.findOne({_id: objId});
        if (!restaurant) throw `No restaurant found with id=${id}`;

        // Convert _id field to string before returning
        return verify.convertId(restaurant);
    },

    /*
        Creating a new restaurant should only take in 3 string arguments: name, address, and cusine.
        The rest of the fields will be initialized upon creation, but updated later on with additional data.
    */
    async createRestaurant(name, address, cuisine, link) {
        if (!verify.validString(name))    throw 'Restaurant name must be a valid string';
        if (!verify.validString(address)) throw 'Restaurant adddress must be a valid string';
        if (!verify.validString(cuisine)) throw 'Restaurant cuisine must be a valid string';
        if (link && !verify.validLink(link)) throw 'Restaurant external link must be a valid yelp link.';


        const restaurantCollection = await restaurants();
        const newRestaurant = {
            name: name.trim(),
            address: address.trim(),
            cuisine: cuisine.trim(),
            rating: 0,
            price: 0,
            distancedTables: 0,
            maskedEmployees: 0,
            noTouchPayment: 0,
            outdoorSeating: 0,
            link: link.trim(),
        };
        
        const insertInfo = await restaurantCollection.insertOne(newRestaurant);
        if (insertInfo.insertedCount === 0) throw 'Could not add restaurant to database';
        const id = insertInfo.insertedId.toString();

        return await this.getRestaurantById(id);
    },

    async updateMetrics(restaurantId, metrics, toAdd) {
        if (!verify.validBoolean(toAdd)) throw 'toAdd is not a boolean';
        if (!verify.validMetrics(metrics)) throw 'invalid metrics';
        if (!verify.validString(restaurantId)) throw 'restaurantId is not a valid string';
        
        let updatedMetrics = {};
        let currentRestaurant = (await this.getRestaurantById(restaurantId)); 
        const restaurantCollection = await restaurants();

        if (toAdd) {
            updatedMetrics = {
                rating:          currentRestaurant.rating + metrics.rating,
                price:           currentRestaurant.price + metrics.price,
                distancedTables: currentRestaurant.distancedTables + metrics.distancedTables,
                maskedEmployees: currentRestaurant.maskedEmployees + metrics.maskedEmployees,
                noTouchPayment:  currentRestaurant.noTouchPayment + metrics.noTouchPayment,
                outdoorSeating:  currentRestaurant.outdoorSeating + metrics.outdoorSeating
            }

            const updatedInfo = await restaurantCollection.updateOne({_id: ObjectId(restaurantId)}, {$set: updatedMetrics});
            if (updatedInfo.modifiedCount === 0) throw 'could not update movie successfully';
        } else {
            updatedMetrics = {
                rating:          currentRestaurant.rating - metrics.rating,
                price:           currentRestaurant.price - metrics.price,
                distancedTables: currentRestaurant.distancedTables - metrics.distancedTables,
                maskedEmployees: currentRestaurant.maskedEmployees - metrics.maskedEmployees,
                noTouchPayment:  currentRestaurant.noTouchPayment - metrics.noTouchPayment,
                outdoorSeating:  currentRestaurant.outdoorSeating - metrics.outdoorSeating
            }

            const updatedInfo = await restaurantCollection.updateOne({_id: ObjectId(restaurantId)}, {$set: updatedMetrics});
            if (updatedInfo.modifiedCount === 0) throw 'could not update movie successfully';
        }

        return true;
    }
}