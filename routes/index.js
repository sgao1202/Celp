const { users } = require('../config/mongoCollections');
const restaurantRoutes = require('./restaurants');
const reviewRoutes = require('./reviews');
const userRoutes = require('./users');
const privateRoutes = require('./private');
const apiRoutes = require('./api');

const data = require('../data');
const { getAllUsers } = require('../data/users');
const restaurantData = data.restaurants;
const reviewData = data.reviews;
const userData = data.users;

const constructorMethod = (app) => {

    // Landing page '/' route
    app.get('/', (req, res) => {
        return res.render('landing/landing', {
            authenticated: req.session.user ? true : false,
            user: req.session.user,
            partial: 'landing-script'});
        })

    app.get('/statistics', async (req, res) => {
        let safest = [];
        let safestRating = undefined;

        let mostReviewed = [];
        let numReviews = undefined;

        let totalReviews = 0;

        const allRestaurants = await restaurantData.getAllRestaurants();

        // Number of Restaurants on the Site
        const numRestaurants = allRestaurants.length;

        for (let restaurant of allRestaurants) {
            let restaurantReviews = await reviewData.getAllReviewsOfRestaurant(restaurant._id);
            let numRestaurantReviews = restaurantReviews.length;
            let restaurantRating = restaurant.rating / numRestaurantReviews;

            // Safest Restaurant
            if (safest.length === 0) {
                safest.push(restaurant);
                safestRating = restaurantRating;
            } else if (safestRating === restaurantRating) {
                safest.push(restaurant);
            } else if (safestRating < restaurantRating) {
                safest = [restaurant];
                safestRating = restaurantRating;
            }

            // Most Reviewed Restaurant
            if (mostReviewed.length === 0) {
                mostReviewed.push(restaurant);
                numReviews = numRestaurantReviews;
            } else if (numReviews === numRestaurantReviews) {
                mostReviewed.push(restaurant);
            } else if (numReviews < numRestaurantReviews) {
                mostReviewed = [restaurant];
                numReviews = numRestaurantReviews;
            }

            // Number of Reviews on the Site
            totalReviews += numRestaurantReviews;
        }

        let mostUserReviews = []
        let highestUserReviews = undefined;

        const allUsers = await userData.getAllUsers();
        for (let user of allUsers) {
            let userReviews = await reviewData.getAllReviewsOfUser(user._id);
            let numUserReviews = userReviews.length;

            // User with most Reviews
            if (mostUserReviews.length === 0) {
                mostUserReviews.push(user);
                highestUserReviews = numUserReviews;
            } else if (highestUserReviews === numUserReviews) {
                mostUserReviews.push(user);
            } else if (highestUserReviews < numUserReviews) {
                mostUserReviews = [user];
                highestUserReviews = numUserReviews;
            }
        }
        return res.render('statistics/statistics', {
            partial: 'statistics-script',
            authenticated: req.session.user? true : false,
            user: req.session.user,
            safest: safest,
            safestRating: safestRating,
            mostReviewed: mostReviewed,
            numReviews: numReviews,
            mostActive: mostUserReviews,
            highestUserReviews: highestUserReviews,
            totalReviews: totalReviews,
            totalRestaurants: numRestaurants
        });
    });

    app.use('/restaurants', restaurantRoutes);
    app.use('/users', userRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/private', privateRoutes);
    app.use('/api', apiRoutes)

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;