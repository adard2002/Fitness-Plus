# FitNess Plus version: 1.0.0
Group Members: Adara, Yvette, Nathan, Lilly


# Description of Project: 
We want the user to be able to go and search an exercise using an api sorted by categories and be able to store that in their saved workouts so they can always view it later. 


# The overall problem domain and how the project solves those problems
Our app, FitNess Plus, solves the issue that some people have, which is trying to figure out what workout to do.  Our site will allow you to come in and search for workouts based on a specific area that you want to focus on.  OR, you can not select an area and it will display all workouts.
We used a workout api for generating the workout response and a sequel database for storing the workouts they would like to save and user name storage.  We also have a page that shows the saved workouts after they login.


# A list of any libraries, frameworks, or packages that your application requires in order to properly function
    - cors: ^2.8.5,
    - dotenv: ^8.2.0,
    - ejs: ^3.1.6,
    - eslint: ^7.21.0,
    - express: ^4.17.1,
    - method-override: ^3.0.0,
    - node.js: 0.0.1-security,
    - pg: ^8.5.1,
    - superagent: ^6.1.0


# Instructions that the user may need to follow in order to get your application up and running on their own computer
- git clone https://github.com/adard2002/Mystery-Project.git
- set up a database
- run the schema.sql
- run the seed.sql


# Clearly defined API endpoints with sample responses
- https://wger.de/api/v2/exercise/ 
```
{
    "count": 408,
    "next": "https://wger.de/api/v2/exercise/?limit=20&offset=20",
    "previous": null,
    "results": [
        {
            "id": 345,
            "category": 10,
            "description": "
Two Handed Russian Style Kettlebell swing",
            "name": "2 Handed Kettlebell Swing",
            "name_original": "2 Handed Kettlebell swing",
            "muscles": [],
            "muscles_secondary": [],
            "equipment": [
                10
            ],
            "creation_date": "2015-08-03",
            "language": 2,
            "uuid": "c788d643-150a-4ac7-97ef-84643c6419bf",
            "variations": null
        },
        ...
    ]
}
```

# Clearly defined database schemas
```
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
```

<!-- 
# cedarrapids-code-301d7
Code 301: Intermediate Software Development course

# Code 301: Intermediate Software Development

Welcome to Code 301! This class builds on your 201 foundation with a deep dive into the world of servers. Using jQuery, Node.js, npm libraries, flexbox and grid, this class prepares you for 401.

## Overview 

## General Daily Plan

## Learning Objectives

### Index of cheatsheets and resources

## Wireframes


## User Stories https://trello.com/b/GZuElVQ1/mystery-project 
Title 
User Story sentence
Feature Tasks
Acceptance Tests

### Be sure to identify the relationships (if any) between each of the tables:

1-to-1 relationships
1-to-many relationships
many-to-many relationships
Also, include in each table:

### The name of column
The required data type
Indication if the column is a key (Example: Primary Key, Foreign Key, Composite Key) -->
