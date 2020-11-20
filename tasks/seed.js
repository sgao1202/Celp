const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const restaurants = data.restaurants;
const reviews = data.reviews;
const users = data.users;
const comments = data.comments;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    // Create restaurants
    const restaurant1 = await restaurants.createRestaurant('McDonalds', '234 Washington St', 'Fast Food');
    const restaurant2 = await restaurants.createRestaurant('QDOBA Mexican Eats', '400 Washington St', 'Mexican');
    const restaurant3 = await restaurants.createRestaurant('T Thai', '102 Hudson St', 'Thai');
    const restaurant4 = await restaurants.createRestaurant('No. 1', '642 Washington St,', 'Chinese');
    const restaurant5 = await restaurants.createRestaurant("O'Bagel", '600 Washington St, Hoboken', 'Breakfast');
    const restaurant6 = await restaurants.createRestaurant('Chicken Factory', '529 Washington St', 'Korean');

    // Create users
    const user1 = await users.createUser('Simon', 'Smells', 'ss20@gmail.com', 'ss20', 25, 'stonkystonk');
    const user2 = await users.createUser('Taquisha', 'Maramba', 'tmaram02@gmail.com', 'tqmaram095', 44, 'shakalaka');
    const user3 = await users.createUser('Brett', 'King', 'bretkingcrown@gmail.com', 'bigthrone39', 18, 'royaltyawaits');
    const user4 = await users.createUser('Marito', 'Carlito', 'mexicanoman@gmail.com', 'sombrerolegend', 30, 'stylePoetic');
    const user5 = await users.createUser('Annie', 'Patel', 'hehexd@gmail.com', 'secretlover21', 20, 'smoochcooch');
    const user6 = await users.createUser('Jon', 'Con', 'jancan99@gmail.com', 'ConBoy05', 10, 'robbinGbanks');

    // Test restaurants
    try {
        const newR1 = await restaurants.updateRestaurant(restaurant1._id.toString(), {name: 'Changed Name'});
        console.log(newR1);
        await restaurants.addReview(restaurant1._id.toString(), 'reviewA');
        await restaurants.removeReview(restaurant1._id.toString(), 'reviewA');
    } catch(e) {
        console.log(e);
        console.log('Error caught');
        console.log();
    }
    // Create comments
    let cAu1 = await comments.createComment("reviewA", "user1", "hello a1");
    let cBu1 = await comments.createComment("reviewB", "user1", "hello b1");
    let cAu2 = await comments.createComment("reviewA", "user2", "hello a2");
    let cBu2 = await comments.createComment("reviewB", "user2", "hello b2");
    let cAu3 = await comments.createComment("reviewA", "user3", "hello a3");
    let cBu3 = await comments.createComment("reviewB", "user3", "hello b3");

    console.log(await comments.getCommentById(cAu1._id));
    console.log(await comments.getAllCommentsOfReview("reviewA"));
    console.log(await comments.getAllCommentsOfUser("user1"));
    await comments.deleteComment(cAu1._id);

    console.log(await comments.getAllCommentsOfReview("reviewA"));
    console.log(await comments.getAllCommentsOfUser("user1"));

    console.log('Done seeding database');
    await db.serverConfig.close();
}

main();