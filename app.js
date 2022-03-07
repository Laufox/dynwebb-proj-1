// Using dotenv module for database configuration
require('dotenv').config();
// Using debug module to handle debugging during development
const debug = require('debug')('photo-app:app.js');
// Using cors module
const cors = require('cors');
// using express module
const express = require('express');
const app = express();

// Applying various settings for the server
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Letting the routes folder distribute incoming requests
app.use(require('./routes'));

// Starting the server up on port 3000
app.listen(process.env.PORT, () => {
    debug("Photo app server started at port 3000");
});