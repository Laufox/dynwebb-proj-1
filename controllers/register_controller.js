// Read models
const models = require('../models');
// Read bcrypt module for hashing passwords
const bcrypt = require('bcrypt');
// Read methods from express-validator
const { matchedData, validationResult } = require('express-validator');

// Method to run when creating a new user
const register = async (req, res) => {

    // Return an failure message if the data doesn't go through the validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            status: 'Fail',
            data: errors.array()
        });
    }

    // Get the request data after it has gone through the validation
    const validData = matchedData(req);

    try {
        // Hash the password
        validData.password = await bcrypt.hash(validData.password, 10);
    } catch (error) {
        // Throw an error if hashing failed
        res.status(500).send({
            status: 'Error',
            message: 'Issues when hashing password'
        });
        throw error;
    }

    try {
        // Create a new user with values sent by post request
        await new models.User(validData).save();

        // Send a successful message
        res.status(201).send({
            status: 'Success',
            data: {
                email: validData.email,
                firstName: validData.first_name,
                lastName: validData.last_name
            }
        });
    } catch (error) {
        // Throw an error if creating a user failed
        res.status(500).send({
            status: 'Error',
            message: 'Issues when creating a new user'
        });
        throw error;
    }
}

// Export methods
module.exports = {
    register
}