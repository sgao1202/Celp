const { users } = require('../config/mongoCollections');
const restaurantRoutes = require('./restaurants');
const reviewRoutes = require('./reviews');
const userRoutes = require('./users');
const privateRoutes = require('./private');

const constructorMethod = (app) => {

    // Landing page '/' route
    app.get('/', (req, res) => {
        // res.render('landing/landing', {
        //     partial: 'landing-script'
        // });
        res.redirect('/restaurants')
    });
    app.use('/restaurants', restaurantRoutes);
    app.use('/users', userRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/private', privateRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;