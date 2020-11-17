const mongoCollections = require('../config/mongoCollections');
const restaurants = mongoCollections.users;
const verify = require('./verify');

let { ObjectId } = require('mongodb');