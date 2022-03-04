// Read models
const models = require('../models');

const { matchedData, validationResult } = require('express-validator');

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
            data: `Created album ${validData.title}`
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

module.exports = {
    create
};