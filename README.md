# Project Name

E-Learning Website

## Introduction

E-Learning Website is a full-stack web application that allows registered users to browse through courses, add courses to inventory, complete and remove courses. Users with mentor accounts can perform CRUD operations on their own courses. Users with admin accounts can perform CRUD on all data.

## Features

- The system maintains data associated with the books, authors and publishers.
- The system allows users to log in and out of the system.
- The system allows all the students to have a simple search option of courses.
- The system allows all the students to select and see more details about courses.
- The system allows the students to add, edit and delete their own account.
- The system allows mentors to add, edit and delete courses.
- The system allow only admin to has all CRUD privileges on students, mentors and courser.

## Buit With

- JavaScript
- NodeJS
- ExpressJS
- MongoDB
- ReactJS

## Setup

Clone this repository. You will need node and npm installed globally on your machine. If you want to run database locally make sure that you have mongoDB server installed and running in background. You can also run cloud database using mongoDB Compas. Create a clutser and paste your connection string in dotenv file.

## Installation:

- Go to: `server` and type `npm install` in terminal.
- Go to: `client` and type `npm install` in terminal.

## Environment Variables

Create a .env file in the root directory of your server route. This file will contain sensitive configuration information needed for your application to function properly.

PORT: The port number on which the server will listen for incoming requests.
JWT_SECRET: A secret key used for signing and verifying JWT tokens for authentication.
MONGO: The connection URL for your MongoDB database.
SESSION_SECRET: An optional secret key used for session management.

## To get a local copy up and running, follow these simple steps:

Clone the repo git clone https://github.com/your_username/e-learning-website.git Install NPM packages npm install Start the project npm start.
