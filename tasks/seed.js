const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const restaurants = data.restaurants;
const reviews = data.reviews;
const users = data.users;
const comments = data.comments;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    // Create Restaurants
    const restaurant1 = await restaurants.createRestaurant('McDonalds', '234 Washington St', 'Fast Food');
    const restaurant2 = await restaurants.createRestaurant('QDOBA Mexican Eats', '400 Washington St', 'Mexican');
    const restaurant3 = await restaurants.createRestaurant('T Thai', '102 Hudson St', 'Thai');
    const restaurant4 = await restaurants.createRestaurant('No. 1', '642 Washington St,', 'Chinese');
    const restaurant5 = await restaurants.createRestaurant("O'Bagel", '600 Washington St, Hoboken', 'Breakfast');
    const restaurant6 = await restaurants.createRestaurant('Chicken Factory', '529 Washington St', 'Korean');

    // Create Users
    const user1 = await users.createUser('Simon', 'Smells', 'ss20@gmail.com', 'stinkyman20', 25, 'stonkystonk');
    const user2 = await users.createUser('Taquisha', 'Maramba', 'tmaram02@gmail.com', 'tqmaram095', 44, 'shakalaka');
    const user3 = await users.createUser('Brett', 'King', 'bretkingcrown@gmail.com', 'bigthrone39', 18, 'royaltyawaits');
    const user4 = await users.createUser('Marito', 'Carlito', 'mexicanoman@gmail.com', 'sombrerolegend', 30, 'stylePoetic');
    const user5 = await users.createUser('Annie', 'Patel', 'hehexd@gmail.com', 'secretlover21', 20, 'smoochcooch');
    const user6 = await users.createUser('Jon', 'Con', 'jancan99@gmail.com', 'ConBoy05', 10, 'robbinGbanks');

    console.log(1);
    
    // Create Reviews
    const r1u1 = await reviews.createReview(user1._id, restaurant1._id, "This restaurant is great", 5,
        {distancedTables: true, maskedEmployees: true, noTouchPayment: true, outdoorSeating: true});
    const r1u2 = await reviews.createReview(user2._id, restaurant1._id, "This restaurant was okay", 3,
        {distancedTables: true, maskedEmployees: true, noTouchPayment: false, outdoorSeating: false});
    const r2u1 = await reviews.createReview(user1._id, restaurant2._id, "This restaurant is terrible", 1,
        {distancedTables: false, maskedEmployees: false, noTouchPayment: false, outdoorSeating: true});
    const r2u2 = await reviews.createReview(user2._id, restaurant2._id, "This restaurant was not great", 2,
        {distancedTables: true, maskedEmployees: true, noTouchPayment: false, outdoorSeating: true});

    // Create Comments
    let cAu1 = await comments.createComment(r1u1._id, user1._id, "Hello myself");
    let cBu1 = await comments.createComment(r1u2._id, user1._id, "I agree");
    let cAu2 = await comments.createComment(r1u1._id, user2._id, "completely wrong");
    let cBu2 = await comments.createComment(r1u2._id, user2._id, "This is my review");
    let cAu3 = await comments.createComment(r1u1._id, user3._id, "how safe did you feel?");
    let cBu3 = await comments.createComment(r1u2._id, user3._id, "great review");

    /* test for case sensitive username and email */
    // const user11 = await users.createUser('Simon', 'Smells', 'SS20@gMAil.COM', 'stinkyman20', 25, 'stonkystonk');
    // const user12 = await users.createUser('Simon', 'Smells', 'smmm20@gmail.com', 'stiNkyMan20', 25, 'stonkystonk');

    /*
    //test getUserbyId
    try{
        console.log(await users.getUserById(user2._id.toString()));
    }catch(e){
        console.log(e);
    }

    //test updateUser
    try{
        const newUser1 = await users.updateUser(user1._id.toString(), {lastName: 'Stinks'});
        console.log(newUser1);
    } catch(e){
        console.log(e);
    }

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

    // Test Comments

    }
    console.log(await comments.getCommentById(cAu1._id));
    console.log(await comments.getAllCommentsOfReview("reviewA"));
    console.log(await comments.getAllCommentsOfUser("user1"));
    await comments.deleteComment(cAu1._id);

    console.log(await comments.getAllCommentsOfReview("reviewA"));
    console.log(await comments.getAllCommentsOfUser("user1"));
    */
    console.log('Done seeding database');
    await db.serverConfig.close();
}

main();