const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const restaurants = data.restaurants;
const reviews = data.reviews;
const users = data.users;
const comments = data.comments;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    // Restaurants
    const mcDonalds      = await restaurants.createRestaurant('McDonalds',          '234 Washington St',  'Fast Food');
    const qdoba          = await restaurants.createRestaurant('QDOBA Mexican Eats', '400 Washington St',  'Mexican');
    const tThai          = await restaurants.createRestaurant('T Thai',             '102 Hudson St',      'Thai');
    const noOne          = await restaurants.createRestaurant('No. 1',              '642 Washington St',  'Chinese');
    const oBagel         = await restaurants.createRestaurant("O'Bagel",            '600 Washington St',  'Breakfast');
    const chickenFactory = await restaurants.createRestaurant('Chicken Factory',    '529 Washington St',  'Korean');
    const chipotle       = await restaurants.createRestaurant("Chipotle",           '229 Washington St',  'Mexican');
    const brassRail      = await restaurants.createRestaurant("Brass Rail",         '135 Washington St',  'American');
    const pizzaRepublic  = await restaurants.createRestaurant("Pizza Republic",     '406 Washington St',  'Italian');
    /*
    const vitosDeli      = await restaurants.createRestaurant("Vitos Deli",         '806 Washington St',  'Italian');
    const midtownPhilly  = await restaurants.createRestaurant("Midtown Philly",     '523 Washington St',  'American');
    const cluckUChicken  = await restaurants.createRestaurant("Chipotle",           '229 Washington St',  'Mexican');
    const amandas        = await restaurants.createRestaurant('Amandas',            '908 Washington St',  'American');
    const theCuban       = await restaurants.createRestaurant('The Cuban',          '333 Washington St',  'Cuban');
    const turningPoint   = await restaurants.createRestaurant('Turning Point',      '1420 Sinatra Dr N',  'Brunch');
    const elysianCafe    = await restaurants.createRestaurant('Elysian Cafe',       '1001 Washington St', 'French');
    const unionHall      = await restaurants.createRestaurant('Union Hall',         '306 Sinatra Dr',     'American');
    const mamounsFalafel = await restaurants.createRestaurant('Mamouns Falafel',    '300 Washington St',  'Mediterranean');
    const augustinos     = await restaurants.createRestaurant('Augustinos',         '1104 Washington St', 'Italian');
    */

    // Users
    const Smells    = await users.createUser('Simon',    'Smells',    'ss20@gmail.com',           'stinkyman20',    25, 'stonkystonk');
    const Maramba   = await users.createUser('Taquisha', 'Maramba',   'tmaram02@gmail.com',       'tqmaram095',     44, 'shakalaka');
    const King      = await users.createUser('Brett',    'King',      'bretkingcrown@gmail.com',  'bigthrone39',    18, 'royaltyawaits');
    const Carlito   = await users.createUser('Marito',   'Carlito',   'mexicanoman@gmail.com',    'sombrerolegend', 30, 'stylePoetic');
    const Patel     = await users.createUser('Annie',    'Patel',     'hehexd@gmail.com',         'secretlover21',  20, 'smoochcooch');
    const Con       = await users.createUser('Jon',      'Con',       'jancan99@gmail.com',       'ConBoy05',       10, 'robbinGbanks');
    const Reelaks   = await users.createUser('Bo',       'Reelaks',   'bigBo@yahoo.com',          'bigBadBo',       21, 'abc123');
    const Nekoui    = await users.createUser('Matthew',  'Nekoui',    'flyeaglesfly@gmail.com',   'Mnmoney17',      22, 'carsonWentzGod');
    const Burkart   = await users.createUser('Ryan',     'Burkart',   'cmonBurk@hotmail.com',     'BigBurk',        14, 'bemyfriend');
    const Basilone  = await users.createUser('Mark',     'Basilone',  'basilone@gmail.com',       'MarktheShark',   93, 'sharkrally');
    const Gheesling = await users.createUser('Dan',      'Gheesling', 'dan@dangheesling.com',     'teamGheese',     37, 'cantStopMe');
    const Taylor    = await users.createUser('Susan',    'Taylor',    'soccerLegend@yahoo.com',   'SusanTaylor',    30, 'beststriker123');
    const Curau     = await users.createUser('Jason',    'Curau',     'liverpoolfan@hotmail.com', 'ChillxFusionz',  21, 'theEgyptianKing');
    const Abell     = await users.createUser('Dani',     'Abell',     'ihatejason@gmail.com',     'Abell1111',      10, 'abell1111');

    const mcD1 = await reviews.createReview(Smells._id, mcDonalds._id, "Im Lovin It", {rating: 5, price: 1, distancedTables: true, maskedEmployees: true, noTouchPayment: false, outdoorSeating: false});
    await comments.createComment(mcD1._id, Taylor._id, "I agree. Felt perfectly safe.");
    await comments.createComment(mcD1._id, Burkart._id, "I see what you did there, very funny.");

    const mcD2 = await reviews.createReview(Maramba._id, mcDonalds._id, "NO MASKS!!!! I am never going back. Happened multiple times!!!", {rating: 2, price: 1, distancedTables: true, maskedEmployees: false, noTouchPayment: false, outdoorSeating: false});
    await comments.createComment(mcD2._id, Gheesling._id, "Your are crazy, they had masks on all the time.");

    const mcD3 = await reviews.createReview(Maramba._id, mcDonalds._id, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed leo at lectus hendrerit venenatis. Quisque id mauris sed ipsum sodales convallis vel in mi. Duis quis arcu ac mauris auctor sollicitudin. Aenean maximus elit ac cursus vestibulum. Duis pulvinar odio vitae ultrices ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed in urna sit amet quam varius auctor sit amet sit amet risus. Quisque mollis mollis ex non maximus.", {rating: 2, price: 1, distancedTables: true, maskedEmployees: false, noTouchPayment: false, outdoorSeating: false});
    await comments.createComment(mcD3._id, Gheesling._id, "Wow this is such a long review.");

    const qdoba1 = await reviews.createReview(Curau._id, qdoba._id, "Everything was great except you have to pay by cash :(", {rating: 4, price: 2, distancedTables: true, maskedEmployees: true, noTouchPayment: false, outdoorSeating: true});
    await comments.createComment(qdoba1._id, Abell._id, "I could not disagree more");

    const tThai1 = await reviews.createReview(King._id, tThai._id, "Perfect Experience", {rating: 5, price: 3, distancedTables: true, maskedEmployees: true, noTouchPayment: true, outdoorSeating: true});
    
    const tThai2 = await reviews.createReview(Nekoui._id, tThai._id, "Terrible, never coming back.", {rating: 1, price: 5, distancedTables: false, maskedEmployees: false, noTouchPayment: false, outdoorSeating: false});
    await comments.createComment(tThai2._id, Reelaks._id, "This review is slander to the highest degree. Completely false.");
    await comments.createComment(tThai2._id, Basilone._id, "No one listen to this guy!");

    const noOne1 = await reviews.createReview(Nekoui._id, noOne._id, "AWFUL AWFUL AWFUL", {rating: 1, price: 1, distancedTables: false, maskedEmployees: false, noTouchPayment: false, outdoorSeating: false});
    await comments.createComment(noOne1._id, Nekoui._id, "STILL AWFUL");
    await comments.createComment(noOne1._id, Gheesling._id, "Someone needs to get this guy off this site.");
    await comments.createComment(noOne1._id, Curau._id, "This guy is crazy");

    const rail = await reviews.createReview(Burkart._id, brassRail._id, "Not great but not terrible.", {rating: 3, price: 5, distancedTables: true, maskedEmployees: true, noTouchPayment: false, outdoorSeating: false});

    const repub = await reviews.createReview(Smells._id, pizzaRepublic._id, "Felt safe the entire time", {rating: 5, price: 2, distancedTables: true, maskedEmployees: true, noTouchPayment: false, outdoorSeating: true});
    await comments.createComment(repub._id, Patel._id, 'Shame they dont have no touch payment.')

    await users.toggleFavoriteRestaurant(Smells._id, mcDonalds._id)
    await users.toggleFavoriteRestaurant(Smells._id, qdoba._id)
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
    await comments.deleteComment(cAu1._id);

    console.log(await comments.getAllCommentsOfReview("reviewA"));
    */
    console.log('Done seeding database');
    await db.serverConfig.close();
}

main();