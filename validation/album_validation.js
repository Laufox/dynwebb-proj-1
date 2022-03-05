// Read the body function from express-validator
const { body } = require('express-validator');
// Read the models
const models = require('../models');

// Validation rules for creating a new album
const createRules = [
    body('title').exists().isString().isLength({min: 3})
];

// Validation rules for updating an album
const updateRules = [
    body('title').exists().isString().isLength({min: 3})
];

// Validation rules for adding a photo to album
const addPhotoRules = [
    body('photo_id').exists().isInt().custom(
        // Make sure that there is a photo with given id
        async value => {
            const photo = await new models.Photo({ id: value }).fetch({ require: false});

            if (!photo) {
                // Reject if no photo was found
                return Promise.reject('There is no photo with that id');
            }

            // Otherwise resolve
            return Promise.resolve();
        }
    )
];

// Export the modules
module.exports = {
    createRules,
    updateRules,
    addPhotoRules
}