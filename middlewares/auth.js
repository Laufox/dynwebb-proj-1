
// Read models
const models = require('../models');
// Read bcrypt module
const bcrypt = require('bcrypt');

const basic = async (req, res, next) => {

    // If the user has not sent authorization data, respond with a failure message
    if (!req.headers.authorization) {
        return res.status(401).send({
            status: 'fail',
            data: 'You need to identify yourself'
        });
    }

    // Seperate authorization method from payload data
    const [authSchema, base64Payload] = req.headers.authorization.split(' ');

    // If the authorization method is not basic, return with a failure message
    if (authSchema.toLowerCase() !== 'basic') {
        return res.status(401).send({
            status: 'fail',
            data: 'Bad authorization method'
        });
    }

    // Read the payload data, transform it to a string, and store it's content in variables
    const [email, password] = Buffer.from(base64Payload, 'base64').toString().split(':');

    // Try to find a user that has the given email
    const user = await new models.User({ email }).fetch({ require: false });
    // If user does not exist, return with a failure message
    if (!user) {
        return res.status(404).send({
            status: 'fail',
            data: 'User does not exist'
        });
    }

    // Check if given password is the same as the password stored in database
    const result = await bcrypt.compare(password, user.get('password'));
    // If the password doesn't match, return with a failure message
    if (!result) {
        return res.status(401).send({
            status: 'fail',
            data: 'Password is wrong'
        });
    }

    // Attach user to request object to make it usable in functions that handles the same request
    req.user = user;

    // Move on with the request
    next();
}

// Export middleware function
module.exports = {
    basic
}