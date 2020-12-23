# CS 546 Web Programming I Final Project: Celp
A restaurant review application designed specifically for reviewing the COVID-19 safety measures of restaurants in Hoboken, NJ.

Built using HTML, CSS, Bootstrap, Express, Node.js, and MongoDB.

## How to Setup
Run 'npm install' to install the required dependencies for our project.  

Then run 'npm run seed' to run the task of seeding the database.

## How the Application Works
- Upon loading the website, the first page will be the landing page.
- A non-authenticated user will be able to view the statistics page, the list of restaurants, and the individual page of a restaurant.
- Only a logged in, or authenicated, user will be able to favorite, comment, like, report, create a restaurant or write a review. 
- In addition, an authenticated user will be able to view their own profile which includes information about their account, favorited restaurants, and any reviews they may have written.

## Additional Extra Features
- Restaurant images from Yelp 
- Added a dark mode feature

## API Keys
This web application integrates the Google Maps Javascript API and the Yelp Fusion API. In order to run the application properly, request API keys from the Google Clouds platform and Yelp Fusion. Then insert those keys into the appropriate variables in the 'partials/restaurants-single-script.handlebars' and 'public/js/restaurantIndividual.js'.

## GitHub Link
- https://github.com/sgao1202/Celp