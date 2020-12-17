const express = require('express');
const router = express.Router();
const data = require('../data');
const bcrypt = require('bcrypt');
const xss = require('xss')
const userData = data.users;

// Redirect if user is logged in and authenticated
/*
    Why don't we use middleware for this?
*/
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
    const username = xss(req.body.username.trim())
    const password = xss(req.body.password.trim())
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
            errors: ["Username or password does not match"]
        });
    }
    let match = await bcrypt.compare(password, myUser.hashedPassword);

    if (match){
        req.session.user = myUser;
        // Redirect the user to their previous route after they login if it exists
        // Otherwise, bring them to the restaurants list page
        let temp = req.session.previousRoute;
        if (temp) {
            req.session.previousRoute = '';
            return res.redirect(temp);
        } 
        res.redirect('/');
    } else {
        return res.status(401).render('users/login', 
        {   title: "Login",
            partial: "login-script",
        });
    }
});

router.post('/signup', async(req, res) => {
    const firstName = xss(req.body.firstName);
    const lastName = xss(req.body.lastName);
    const username = xss(req.body.username);
    const password = xss(req.body.password);
    const email = xss(req.body.email);
    let age = xss(req.body.age);
    
    try {
        age = parseInt(age);
        const user = await userData.createUser(firstName, lastName, email, username, age, password);
        req.session.user = user;
        res.redirect("/restaurants");
    } catch(e){
        return res.status(401).render('users/signup',{
            authenticated: false,
            title: "Login",
            partial: "login-script"
        });
    }
    
});

router.get('/logout', async(req,res) =>{
    req.session.destroy();
    res.redirect('/');
})
module.exports = router;