const express = require('express');
const router = express.Router();

router.get('/', async(req, res) =>{
    const userData = req.session.user;
    return res.render('users/info', {
        log: true,
        authenticated: true,
        partial: 'user-info-script',
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.username,
        email: userData.email,
        age: userData.age,
    });
});

module.exports = router;