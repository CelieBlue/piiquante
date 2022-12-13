//Express importation
const express = require('express');

//CORS Importation
const cors = require('cors');

//Morgan importation
const morgan = require('morgan');

//Mongoose importation
const mongoose = require('./db/db');

//Images: Path importation to acceed to the path of the server
const path = require('path');

//User router importation
const userRoutes = require('./routes/user');

//Sauce router importation
const sauceRoutes = require('./routes/sauce');

//Create a express application
const app = express();

//To read the request sent in the body
app.use(express.json());

//Enable all CORS requests
app.use(cors());

//Log the req and res
app.use(morgan('dev'));

//========================================

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//========================================

//Call the Routes of API with authorization
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;