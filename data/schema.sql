DROP TABLE IF EXISTS userExercise;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS username;

CREATE TABLE exercises (
    exercise_id INT PRIMARY KEY
    , exercise_name VARCHAR(255) NOT NULL
    , category VARCHAR(255) NOT NULL
    , workout_desc VARCHAR
    , equipment VARCHAR(255)
);



CREATE TABLE username (
  username VARCHAR(255) PRIMARY KEY
);



CREATE TABLE userExercise (
  id SERIAL PRIMARY KEY
  , username VARCHAR(255) REFERENCES username (username)
  , exercise_id INTEGER REFERENCES exercises (exercise_id)
--  , startDate DATE NOT NULL
--  , weight_used DECIMAL(10,2)
);

