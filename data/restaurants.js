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
//     "distancedTables": 88,
//     "maskedEmployees": 12,
//     "noTouchPayment": 100,
//     "outdoorSeating": 0,
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
        // Find the restaurant in the database with _id=id
        const restaurant = await restaurantCollection.findOne({_id: objId});
        // Throw error if the restaurant with id does not exist
        if (!restaurant) throw `No restaurant found with id=${id}`;

        // Convert _id field to string before returning
        return verify.convertId(restaurant);
    },

    /*
        Creating a new restaurant should only take in 3 string arguments: name, address, and cusine.
        The rest of the fields will be initialized upon creation, but updated later on with additional data.
    */
    async createRestaurant(name, address, cuisine) {
        if (!verify.validString(name)) throw 'Restaurant name must be a valid string';
        if (!verify.validString(address)) throw 'Restaurant adddress must be a valid string';
        if (!verify.validString(cuisine)) throw 'Restaurant cuisine must be a valid string';

        const restaurantCollection = await restaurants();
        const newRestaurant = {
            name: name.trim(),
            address: address.trim(),
            cuisine: cuisine.trim(),
            rating: 0,
            distancedTables: 0,
            maskedEmployees: 0,
            noTouchPayment: 0,
            outdoorSeating: 0,
            reviews: []
        };
        
        const insertInfo = await restaurantCollection.insertOne(newRestaurant);
        if (insertInfo.insertedCount === 0) throw 'Could not add restaurant to database';
        const id = insertInfo.insertedId.toString();
        return await this.getRestaurantById(id);
    },

    /*
        Can only update a restaurant in the form:
        {
            name: newName,
            address: newAddress,
            cuisine: newCuisine
        }
    async updateRestaurant(id, updatedRestaurant) {
        if (!verify.validString(id)) throw 'Restaurant Id is not valid string';
        if (!updatedRestaurant || typeof updatedRestaurant !== 'object') throw 'Must provide info to update';
        let objId = ObjectId(id.trim());

        const updateRestaurantData = {};
        if (updatedRestaurant.name) {
            if (!verify.validString(updatedRestaurant.name)) throw 'Restaurant name is not a valid string';
            updateRestaurantData.name = updatedRestaurant.name;
        }

        if (updatedRestaurant.address) {
            if (!verify.validString(updatedRestaurant.address)) throw 'Restaurant address is not a valid string';
            updateRestaurantData.address = updatedRestaurant.address;
        }

        if (updatedRestaurant.cuisine) {
            if (!verify.validString(updatedRestaurant.cuisine)) throw 'Restaurant cuisine is not a valid string';
            updateRestaurantData.cuisine = updatedRestaurant.cuisine;
        }

        const restaurantCollection = await restaurants();
        const updateInfo = await restaurantCollection.updateOne({ _id: objId }, { $set: updateRestaurantData });
        if (!updateInfo.matchedCount || !updateInfo.modifiedCount) throw `Failed to update restaurant with id=${id}`;
        return await this.getRestaurantById(id);
    },*/
    /*
    async deleteRestaurant(id) {
        if (!verify.validString(id)) throw 'Restaurant Id must be a valid string';
        let trimmedId = id.trim();
        let objId = ObjectId(trimmedId);

        const restaurantCollection = await restaurants();
        const { name } = await this.getRestaurantById(trimmedId);
        const deleteInfo = await restaurantCollection.deleteOne({_id: objId});
        if (deleteInfo.deletedCount === 0) throw `Could not delete restaurant with id=${trimmedId}`;
        return `${name} has been successfully deleted.`;
    },*/
}