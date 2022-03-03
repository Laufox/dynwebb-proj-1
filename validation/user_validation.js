// Read the body function from express-validator
const { body } = require('express-validator');
// Read the models
const models = require('../models');

// Validation rules for creating a new user
const registerRules = [
    // Email must be provided, must be a valid email and must not already exist in the database
    body('email').exists().isEmail().custom(
        // Custom validation function to check if the user email is already in the database
        async (email) => {
            // Try to get a new user from the databse where the email field equals what comes trough the request body
            const user = await new models.User({ email }).fetch({ require: false });

            // If a user was found, reject the promise
            if (user) {
                return Promise.reject("User already exists");
            }

            // Otherwise resolve the promise
            return Promise.resolve();
        }
    ),
    // Password must be provided and be minimum 6 charachters
    body('password').exists().isLength({ min: 6 }),
    // First name must be provided and be minimum 3 charachters
    body('first_name').exists().isLength({ min: 3 }),
    // Last name must be provided and be minimum 3 charachters
    body('last_name').exists().isLength({ min: 3 })
];

// Export the registerRules array
module.exports = {
    registerRules
}