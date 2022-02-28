const { body } = require('express-validator');
const models = require('../models');

const registerRules = [
    body('email').exists().isEmail().custom(
        async (email) => {
            const user = await new models.User({ email }).fetch({ require: false });

            if (user) {
                return Promise.reject("User already exists");
            }

            return Promise.resolve();
        }
    ),
    body('password').exists().isLength({ min: 6 }),
    body('first_name').exists().isLength({ min: 3 }),
    body('last_name').exists().isLength({ min: 3 })
];

module.exports = {
    registerRules
}