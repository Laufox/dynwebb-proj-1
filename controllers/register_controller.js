// Read models
const models = require('../models');
// Read bcrypt module for hashing passwords
const bcrypt = require('bcrypt');

// Method to run when creating a new user
const register = async (req, res) => {
    try {
        // Hash the password
        req.body.password = await bcrypt.hash(req.body.password, 10);
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
        const user = await new models.User(req.body).save();

        // Send a successful message
        res.status(200).send({
            status: 'Success',
            data: {
                user
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