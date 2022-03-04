// Read models
const models = require('../models');

const { matchedData, validationResult } = require('express-validator');

// Function to create new albums
const create = async (req, res) => {

    // Return an failure message if the data doesn't go through the validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
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

        // Inform the user that the album was created
        res.status(200).send({
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

// Export the modules
module.exports = {
    create
}