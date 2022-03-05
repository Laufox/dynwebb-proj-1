// Read the body function from express-validator
const { body } = require('express-validator');
// Read the models
const models = require('../models');

// Validation rules for creating a new photo
const createRules = [
    body('title').exists().isString().isLength({min: 3}),
    body('url').exists().isString().isURL(),
    body('comment').optional().isString().isLength({min: 3})
];

// Validation rules for updating a photo
const updateRules = [
    body('title').optional().isString().isLength({min: 3}),
    body('url').optional().isString().isURL(),
    body('comment').optional().isString().isLength({min: 3})
]

// Export the modules
module.exports = {
    createRules,
    updateRules
}