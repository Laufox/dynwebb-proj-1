// Read models
const models = require('../models');

const { matchedData, validationResult } = require('express-validator');

// Function to list all albums of user
const read = async (req, res) => {
    // Get the user and all albums it has relationship with
    const user = await models.User.fetchById(req.user.id, { withRelated: ['albums'] });

    // Return a successful message and all albums belonging to user
    res.status(200).send({
        status: 'success',
        data: {
            data: user.related('albums')
        }
    })
}

// Function to create new albums
const create = async (req, res) => {
    // Return an failure message if the data doesn't go through the validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: 'Fail',
            data: errors.array()
        });
    }

    // Get the request data after it has gone through the validation
    const validData = matchedData(req);

    // Apply the users id to the validated data, to be used when creating new album
    validData.user_id = req.user.id;


    try {
        // Try to create a new album 
        const newAlbum = await new models.Album(validData).save();

        // Inform the user that the album was created
        res.status(200).send({
            status: "success",
            data: {
                "title": validData.title,
                "user_id": validData.user_id,
                "id": newAlbum.id
            }
        });
    } catch (error) {
        // Throw an error if creating an album failed
        res.status(500).send({
            status: 'Error',
            message: 'Issues when creating a new album'
        });
        throw error;
    }

    
};

// Export the modules
module.exports = {
    read,
    create
};