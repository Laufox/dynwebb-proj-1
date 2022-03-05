// Read the body function from express-validator
const { body } = require('express-validator');
// Read the models
const models = require('../models');

// Validation rules for creating a new album
const createRules = [
    body('title').exists().isString().isLength({min: 3})
];

const updateRules = [
    body('title').exists().isString().isLength({min: 3})
];

// Export the modules
module.exports = {
    createRules,
    updateRules
}