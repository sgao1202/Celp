const restaurantRoutes = require('./restaurants');
const reviewRoutes = require('./reviews');
const userRoutes = require('./users');
const privateRoutes = require('./private');
const apiRoutes = require('./api');
const statisticsRoutes = require('./statistics');

const constructorMethod = (app) => {

    // Landing page '/' route
    app.get('/', (req, res) => {
        return res.render('landing/landing', {
            authenticated: req.session.user ? true : false,
            user: req.session.user,
            partial: 'landing-script'});
    });
    app.use('/api', apiRoutes);
    app.use('/private', privateRoutes);
    app.use('/restaurants', restaurantRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/statistics', statisticsRoutes);
    app.use('/users', userRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;