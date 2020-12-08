const express = require('express');
const router = express.Router();
const data = require('../data');
const bcrypt = require('bcrypt');
const userData = data.users;

// Redirect if user is logged in and authenticated
router.get('/', async (req, res) => {
    if (req.session.user){
        res.redirect("/restaurants");
    }
});

// Get login page
router.get('/login', async (req, res) => {
    if (req.session.user){
        res.redirect('/private');
    } else{
        res.render('users/login', {
            authenticated: false,
            partial: 'login-script'
        });
    }
});

// Get signup page
router.get('/signup', async (req, res) => {
    if (req.session.user){
        res.redirect('/private');
    } else{
        res.render('users/signup', {
            authenticated: false,
            partial: 'signup-script'
        })
    } 
})

// Post login
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    let myUser;

    /*
        Why not create a function in users to query by username since each username should be unique?
    */
    const users = await userData.getAllUsers();
    for (let i = 0; i < users.length; i++){
        if (users[i].username == username){
            myUser = users[i];
        }
    }
    if (!myUser){
        return res.status(401).render('users/login',
            {title: "Login",
            partial: "login-script",
            error: "Username or password does not match"
        });
    }
    let match = await bcrypt.compare(password, myUser.hashedPassword);

    if (match){
        req.session.user = myUser;
        // Redirect the user to their previous route after they login if it exists
        // Otherwise, bring them to the restaurants list page
        if (req.session.previousRoute) {
            res.redirect(req.session.previousRoute);
        } else {
            res.redirect('/restaurants');
        }
    }

    else {
        return res.status(401).render('users/login', 
        {   title: "Login",
            partial: "login-script",
            error: "Username or password does not match"
        });
    }
});

router.post('/signup', async(req, res) => {
    const {firstName, lastName, username, password, email} = req.body;
    let age = req.body.age;
    try {
        age = parseInt(age);
        const user = await userData.createUser(firstName, lastName, email, username, age, password);
        res.redirect("/restaurants");
    } catch(e){
        return res.status(401).render('users/signup',{
            authenticated: false,
            title: "Login",
            partial: "login-script",
            error: e
        });
    }
    
});

router.get('/logout', async(req,res) =>{
    req.session.destroy();
    res.redirect('/restaurants');
})
module.exports = router;