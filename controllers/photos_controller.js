// Read models
const models = require('../models');

// Read methods from express-validator
const { matchedData, validationResult } = require('express-validator');

// Function to read all photos that belongs to the user
const read = async (req, res) => {
    // Get the user and all albums it has relationship with
    const user = await models.User.fetchById(req.user.id, { withRelated: ['photos'] });

    // If the user has no photos, return and inform the user
    if (user.related('photos').length <= 0) {
        return res.status(404).send({
            status: 'fail',
            data: 'You have no photos yet'
        });
    }

    // Loop through user photos and pick the attributes to use on each one
    const photos = user.related('photos').toJSON().map( (photo) => {
        return {
            id: photo.id, 
            title: photo.title, 
            url: photo.url, 
            comment: photo.comment
        };
    } );

    // Return a successful message and all albums belonging to user
    res.status(200).send({
        status: 'success',
        data: {
            photos
        }
    });
}

// Function to read a specific photo that belongs to a user
const readOne = async (req, res) => {
    
    // If the id parameter is missing, or has an unexpeted value, return and inform the user
    if (!req.params.photoId || isNaN(req.params.photoId) || req.params.photoId < 0) {
        return res.status(400).send({
            status: 'fail',
            data: 'Invalid params'
        });
    }

    // Try to get the photo with the given param
    const photo = await new models.Photo({id: req.params.photoId}).fetch({require: false});

    // If not photo was not found, return and inform the user
    if (!photo) {
        return res.status(404).send({
            status: 'fail',
            data: 'There is no such photo'
        });
    }
    
    // If the photo does not belong to the user, return and inform the user
    if (photo.attributes.user_id !== req.user.id) {
        return res.status(403).send({
            status: 'fail',
            data: 'That is not your photo!'
        });
    }

    // Send a successful message to the user, aswell as the photo attributes
    res.status(200).send({
        status: 'success',
        data: {
            "id": photo.attributes.id,
            "title": photo.attributes.title,
            "url": photo.attributes.url,
            "comment": photo.attributes.comment
        }
    });
    
}

// Function to create new albums
const create = async (req, res) => {

    // Return an failure message if the data doesn't go through the validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            status: 'fail',
            data: errors.array()
        });
    }

    // Get the request data after it has gone through the validation
    const validData = matchedData(req);
    // Apply the users id to the validated data, to be used when creating new photo
    validData.user_id = req.user.id;

    try {
        // Try to create a new photo 
        const newPhoto = await new models.Photo(validData).save();

        // Inform the user that the photo was created
        res.status(201).send({
            status: 'success',
            data: {
                "title": validData.title,
                "url": validData.url,
                "comment": validData.comment,
                "user_id": validData.user_id,
                "id": newPhoto.id
            }
        })

    } catch (error) {
        // Throw an error if creating a photo failed
        res.status(500).send({
            status: 'Error',
            message: 'Issues when creating a new photo'
        });
        throw error;
    }
}

// Function to update an existing photo
const update = async (req, res) => {

    // If the id parameter is missing, or has an unexpeted value, return and inform the user
    if (!req.params.photoId || isNaN(req.params.photoId) || req.params.photoId < 0) {
        return res.status(400).send({
            status: 'fail',
            data: 'Invalid params'
        });
    }
    
    // Try to get the photo with the given param
    let photo = await new models.Photo({id: req.params.photoId}).fetch({require: false});

    // If no photo was found, return and inform the user
    if (!photo) {
        return res.status(404).send({
            status: 'fail',
            data: 'There is no such photo'
        });
    }

    // If the photo does not belong to the user, return and inform the user
    if (photo.attributes.user_id !== req.user.id) {
        return res.status(403).send({
            status: 'fail',
            data: 'That is not your photo!'
        });
    }

    // Return a failure message if the data doesn't go through the validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            status: 'fail',
            data: errors.array()
        });
    }

    // Get the request data after it has gone through the validation
    const validData = matchedData(req);

    try {
        
        // Update the database row with the new content
        photo = await photo.save(validData);

        // Send a successful message to the user, aswell as the photo attributes
        res.status(200).send({
            status: 'success',
            data: {
                "id": photo.attributes.id,
                "title": photo.attributes.title,
                "url": photo.attributes.url,
                "comment": photo.attributes.comment,
                "user_id": photo.attributes.user_id
            }
        });

    } catch (error) {
        // Throw an error if updating the photo failed
        res.status(500).send({
            status: 'Error',
            message: 'Issues when updating the photo'
        });
        throw error;
    }

}

// Export the modules
module.exports = {
    read,
    readOne,
    create,
    update
}