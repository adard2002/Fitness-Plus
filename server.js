'use strict';


//Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');

var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;

// const cors = require('cors');
const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === 'production' && { rejectUnauthorized: false };
const superagent = require('superagent');
const methodOverride = require('method-override');

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
app.get('/test', (request, response) => {
  dbGetWorkoutByUser('Nathan')
    .then(res => response.send(res))
    .catch(e => errorHandler(e,request,response));
});

app.post('/saves', saveWorkoutHandler);

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
  const category = request.body.searchType;
  let url = 'https://wger.de/api/v2/exercise/';
  console.log('request aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', url);
  superagent.get(url)
    .query({
      language: 2,
      category: category
    })
    .then((workoutsResponse) => workoutsResponse.body.results.map(workoutResult => {
      console.log('workoutsResponse', workoutsResponse);
      return new Workout(workoutResult);

    }))
    .then(workouts => {
      console.log('workouts', workouts);
      response.render('pages/searches/show', {workouts: workouts});
    }) //do not include a / before pages or it will say that it is not in the views folder and do not include the .ejs at the end of show
    .catch(err => {
      console.log(err);
      errorHandler(err, request, response);
    });

} // end workoutHandler function

function saveWorkoutHandler(request, response) {
  const { exercise_id, exercise_name, category, workout_desc, equipment } = request.body;
  console.log('request body', request.body);
  const SQL = `INSERT INTO bookstable (exercise_id, exercise_name, category, workout_desc, equipment) VALUES ($1, $2, $3, $4, $5) RETURNING id;`;  //<<--make sure there is a semi colon before the back tic
  const parameters = [exercise_id, exercise_name, category, workout_desc, equipment];
  return client.query(SQL, parameters)
    .then(result => {
      let id = result.rows[0].id;
      console.log('id', id);
      response.redirect(`/saves/${id}`);
    })
    .catch(err => {
      errorHandler(err, request, response);
      console.err('Error in saveWorkoutHandler', err);
    });
} // end saveWorkoutHandler function

//Has to be after stuff loads too
app.use(notFoundHandler);

//Has to be after stuff loads
app.use(errorHandler);

function getAvatar(seed) {
  const url = `https://avatars.dicebear.com/api/jdenticon/${seed}.svg`;
  //console.log('🥤🥤🥤', url);
  return { image: url };
}

function dbGetWorkoutByUser (username){
  const query = {
    name: 'getWorkoutByUser',
    text: `SELECT 
        t3.exercise_id AS id
        , t3.exercise_name AS name
        , t3.category AS category
        , t3.workout_desc AS description
        , t3.equipment AS equipment
      FROM userExercise t1
      INNER JOIN username t2
      ON t1.username = t2.username
      INNER JOIN exercises t3
      ON t1.exercise_id = t3.exercise_id
      WHERE t2.username = $1`,
    values: [username]
  };
  // returns array of Workout objects
  return client.query(query).then(res => res.rows.map(obj => new Workout(obj)));
}

function validateUser(username){
  let result;
  const query = {
    // name: 'getUserByName',
    text: `SELECT username
      FROM username
      WHERE username.username = $1`,
    values: [username]
  };
  return client.query(query)
    .then(res => {
      console.log('📚📚📚',res.rows[0]);
      if (res.rows.length === 1){
        return true;
      }else{
        return createUser(username)
          .then(res => {
            return false;
          });
      }
    });
  // console.log('❤❤❤',result);
  // return result;
}

function createUser(username){
  let result;
  const query = {
    name: 'createUserByName',
    text: `INSERT INTO username (username)
      VALUES ($1)
      RETURNING *`,
    values: [username]
  };
  return client.query(query)
    .then(res => console.log('🥚🥚🥚', res.rows[0]));
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
  this.id = workoutData.id;
  this.name = workoutData.name;
  this.category = workoutCategory[workoutData.category] || workoutData.category;
  this.description = workoutData.description;
  this.equipment = Array.isArray(workoutData.equipment)?workoutData.equipment.map(id => workoutEquipment[id]).join():workoutData.equipment;
  // console.log('equipment--------------', workoutData.equipment);
}

client.connect() //<<--keep in server.js
  .then(() => {
    console.log('PG connected!');
    app.listen(PORT, () => console.log(`App is listening on ${PORT}`)); //<<--these are tics not single quotes
  })
  .catch(err => {
    throw `PG error!:  ${err.message}`;//<<--these are tics not single quotes
  });

// Enumerations
const workoutCategory = {
  10: 'Abs'
  , 8: 'Arms'
  , 12: 'Back'
  , 14: 'Calves'
  , 11: 'Chest'
  , 9: 'Legs'
  , 13: 'Shoulders'
};

const workoutEquipment = {
  1: 'Barbell'
  , 8: 'Bench'
  , 3: 'Dumbbell'
  , 4: 'Gym Mat'
  , 9: 'Incline Bench'
  , 10: 'Kettlebell'
  , 7: 'None'
  , 6: 'Pull-Up Bar'
  , 5: 'Swiss Ball'
  , 2: 'SZ-Bar'
};
