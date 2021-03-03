'use strict';


//Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
// const cors = require('cors');
const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === 'production' && { rejectUnauthorized: false };
const superagent = require('superagent');
const methodOverride = require('method-override');
const { request, response } = require('express');

// Database Setup
if (!process.env.DATABASE_URL) {
  throw 'DATABASE_URL is missing!';
}
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });


//Application Setup
const PORT = process.env.PORT || 3001 || 3002 || 3003;
console.log('Server is running on port: ', PORT);
const app = express();
app.use(express.urlencoded({extended: true}));

// app.get('/', getWorkout);

app.get('/', (request, response) => {
  response.render('index');
});

app.get('/login', (request, response) => {
  response.render('./login');
});

app.get('/workout', (request, response) => {
  response.render('workout');
});

app.get('/searches', workoutHandler);
app.post('/searches', workoutHandler); //has to match the form action on the new.js for the /searches


app.get('/searches/new', (request, response) => {
  response.render('pages/searches/new'); //do not include a / before pages or it will say that it is not in the views folder
});

app.get('/searches/show', (request, response) => {
  response.render('pages/searches/show'); //do not include a / before pages or it will say that it is not in the views folder
});


//Express Middleware
app.use(express.urlencoded({ extended: true }));

//Specify a directory for static resources
app.use(express.static('./public'));


//Cors Middleware
// app.use(cors());
app.use(methodOverride('_method'));

//Set the view engine for server-side templating
app.set('view engine', 'ejs');


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

// function getWorkout(request, response){
//   const SQL = `
//     SELECT *
//     FROM WorkoutTable
//     `;
//   console.log('response');

//   client.query(SQL)
//     .then(results => {
//       const {rowCount, rows} = results;
//       console.log('DB', rows, rowCount);
//       response.render('workout', {
//         workouts: rows,
//       });
//     })
//     .catch(err => {
//       errorHandler(err, request, response);
//     });
// }

function workoutHandler(request, response) {
  const url = 'https://wger.de/api/v2/exerciseinfo/';
  superagent.get(url)
    .query({
      // category: `+in${request.body.searchType}`
    })
    .then((workoutsResponse) => workoutsResponse.body(workoutResult => new Workout(workoutResult.results)))
    .then(results => response.render('pages/searches/show', {results: results})) //do not include a / before pages or it will say that it is not in the views folder and do not include the .ejs at the end of show
    .catch(err => {
      console.log(err);
      errorHandler(err, request, response);
    });

} // end workoutHandler function

//Has to be after stuff loads too
app.use(notFoundHandler);

//Has to be after stuff loads
app.use(errorHandler);

function getAvatar(seed) {
  const url = `https://avatars.dicebear.com/api/jdenticon/${seed}.svg`;
  //console.log('🥤🥤🥤', url);
  return { image: url };
}

function errorHandler(error, request, response, next) {
  console.error(error);
  response.status(500).json({
    error: true,
    message: error.message,
  });
}

function notFoundHandler(request, response) {
  response.status(404).json({
    notFound: true,
  });
}


function Workout(workoutData) {
  this.name = workoutData.name;
  this.category = workoutData.category[1];
  this.description = workoutData.description;
  this.equipment = workoutData.equipment[1];
}

client.connect() //<<--keep in server.js
  .then(() => {
    console.log('PG connected!');
    app.listen(PORT, () => console.log(`App is listening on ${PORT}`)); //<<--these are tics not single quotes
  })
  .catch(err => {
    throw `PG error!:  ${err.message}`;//<<--these are tics not single quotes
  });
