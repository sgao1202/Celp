const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

// Redirect if user is logged in and authenticated
router.get('/', async (req, res) => {

});

// Get login page
router.get('/login', async (req, res) => {
    res.render('users/login');
});

// Post login
router.post('/login', async (req, res) => {
    
});
module.exports = router;