CREATE TABLE WorkoutTable (
    Id SERIAL PRIMARY KEY,
    workout_date DATE NOT NULL,
    week_day VARCHAR(255) NOT NULL,
    exercise VARCHAR(255) NOT NULL,
    focus_area VARCHAR(255),
    liift_round INT,
    weight_used DECIMAL(10,2) NOT NULL
);

--CREATE TABLE Liift4 (
   -- Id SERIAL PRIMARY Key,
   -- WeekAndDay VARCHAR(255),
   -- Exercise VARCHAR(255),
  --  FocusArea VARCHAR(255)
--);