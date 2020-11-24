const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const verify = require('./verify');
const bcrypt = require('bcrypt');
const saltRounds = 16;
let { ObjectId } = require('mongodb'); 

module.exports = {
    async getUserById(userId) {
        if (!verify.validString(userId)) throw 'userId is not a valid string.';

        let parsedId = ObjectId(userId.trim());

        const userCollection = await users();
        let user = await userCollection.findOne({ _id: parsedId });
        if (user === null) throw 'No user with that id';
        user._id = user._id.toString();
        return user;
    },

    async getAllUsers(){
        const userCollection = await users();
        const allUsers = await userCollection.find({}).toArray();
        for (let x of allUsers) {
            x._id = x._id.toString();
        }

        return allUsers;
    },

    async createUser(firstName, lastName, paramEmail, paramUsername, age, password) {
        if (!verify.validString(firstName))     throw 'firstName is not a valid string.';
        if (!verify.validString(lastName))      throw 'lastName is not a valid string.';
        if (!verify.validEmail(paramEmail))     throw 'email is not a valid string.';
        if (!verify.validString(paramUsername)) throw 'username is not a valid string.';
        if (!verify.validAge(age))              throw 'age must be a positive integer'
        if (!verify.validString(password))      throw 'password is not a valid string';

        /*before storing email and username into DB, make sure there are no duplicate entries of email or username in DB */
        const allUsers = await this.getAllUsers();
        let email = paramEmail.toLowerCase();
        let username = paramUsername.toLowerCase();
        allUsers.forEach(user => {
            if (user.email == email) throw 'this email is already taken';
            if (user.username == username) throw 'this username is already taken'
        })

        //create hashed password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        /* Add new user to DB */
        let newUser = {
            firstName: firstName, 
            lastName: lastName, 
            email: email, 
            username: username, 
            age: age, 
            hashedPassword: hashedPassword, 
            favoritedRestaurants: []
        };
        
        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user';

        const newId = insertInfo.insertedId;
        const finuser = await this.getUserById(newId.toString());

        return finuser;
    },

    async updateUser(userId, updatedUser){
        if (!verify.validString(userId)) throw 'userId is not a valid string';
        if (!updatedUser) throw 'must provide fields to update';

        let parsedId = ObjectId(userId.trim());

        const userCollection = await users();
        const changedUser = await userCollection.updateOne(
            { _id: parsedId },
            { $set: updatedUser }
        );

        if (changedUser.modifiedCount === 0) throw 'none of the fields have changed';
        return await this.getUserById(userId);
    }
}