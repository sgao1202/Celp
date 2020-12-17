const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const session = require('express-session');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },
    checkListMem: function(elem, target){
      if (elem && target) {
        return target.includes(elem);
      }
      else return false;
    },
    checkListLengthZero: function(arr){
      return arr.length == 0;
    }
  },
  partialsDir: ['views/partials/']
});

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

app.use(
  session({
      name: "AuthCookie",
      secret: 'some secret string',
      resave: false,
      saveUninitialized: true
  })
);

//if user attempts to access private route without being authenicated, redirect them to the "main" page
app.use('/private', async(req, res, next) =>{
    if (!req.session.user) {
      let errors = [];
      errors.push("You cannot access the private route without logging in")
      return res.render('errors/error',{
        title: 'Errors',
        errors: errors,
        partial: 'errors-script'});
    } 
    next();
});

app.use('/restaurants/new', async(req,res, next) =>{
  if (!req.session.user) {
    req.session.previousRoute = req.originalUrl;
    return res.render("users/login", {
        title: 'Log In',
        error: "You must be logged in to create a restaurant",
        partial: 'login-script'
      });
  } 
  next();
})

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});