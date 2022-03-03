// Use express module to set up routing
const express = require('express');
const router = express.Router();
// Read controller file
const registerController = require('../controllers/register_controller');
const userValidationRules = require('../validation/user_validation');

//router.use('/photos', require('./photos_route'));
//router.use('/albums', require('./albums_route'));

// When user posts to /register, validate the input data and then run the register method  in register controller
router.post('/register', userValidationRules.registerRules, registerController.register);

// Export file
module.exports = router;