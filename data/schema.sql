DROP TABLE IF EXISTS userWorkout;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS username;

CREATE TABLE exercises (
    exercise_id INT PRIMARY KEY
    , exercise_name VARCHAR(255) NOT NULL
    , category VARCHAR(255) NOT NULL
    , workout_desc VARCHAR(255)
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

-- --  seed info
-- INSERT INTO username (username) VALUES('Nathan');

-- INSERT INTO exercises (exercise_name, category)
--   VALUES('deadlift', '13');

-- INSERT INTO userWorkout (username, workout_id, workout_desc, equipment)
--   VALUES('Nathan', 1, 'test workout', 'dumbybell');