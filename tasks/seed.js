const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const restaurants = data.restaurants;
const reviews = data.reviews;
const users = data.users;
const comments = data.comments;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

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