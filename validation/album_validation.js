// Read the body function from express-validator
const { body } = require('express-validator');
// Read the models
const models = require('../models');

// Validation rules for creating a new user
const createRules = [
    body('title').exists().isString().isLength({min: 3})
];

module.exports = {
    createRules
}