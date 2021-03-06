// Read models
const models = require('../models');

// Read methods from express-validator
const { matchedData, validationResult } = require('express-validator');

// Function to list all albums of user
const read = async (req, res) => {
    // Get the user and all albums it has relationship with
    const user = await models.User.fetchById(req.user.id, { withRelated: ['albums'] });

    // Return a successful message and all albums belonging to user
    res.status(200).send({
        status: 'success',
        data: user.related('albums'),
        
    })
}

// Function to read a specific album that belongs to a user
const readOne = async (req, res) => {

    // If the id parameter is missing, or has an unexpeted value, return and inform the user
    if (!req.params.albumId || isNaN(req.params.albumId) || req.params.albumId < 0) {
        return res.status(400).send({
            status: 'fail',
            data: 'Invalid params'
        });
    }

    // Try to get the album with the given param, including it's photos
    const album = await models.Album.fetchById(req.params.albumId, {withRelated: ['photos'], require: false});

    // If not album was not found, return and inform the user
    if (!album) {
        return res.status(404).send({
            status: 'fail',
            data: 'There is no such album'
        });
    }

    // If the album does not belong to the user, return and inform the user
    if (album.attributes.user_id !== req.user.id) {
        return res.status(403).send({
            status: 'fail',
            data: 'That is not your album!'
        });
    }

    // Loop through album photos and pick the attributes to use on each one
    const photos = album.related('photos').toJSON().map( (photo) => {
        return {
            id: photo.id, 
            title: photo.title, 
            url: photo.url, 
            comment: photo.comment,
            user_id: photo.user_id
        };
    } );

    // Send a successful message to the user, aswell as the album attributes and it's photos
    res.status(200).send({
        status: 'success',
        data: {
            "id": album.attributes.id,
            "title": album.attributes.title,
            "photos": photos
        }
    });
}

// Function to create new albums
const create = async (req, res) => {
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

    // Apply the users id to the validated data, to be used when creating new album
    validData.user_id = req.user.id;


    try {
        // Try to create a new album 
        const newAlbum = await new models.Album(validData).save();

        // Inform the user that the album was created
        res.status(201).send({
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

// Function to update an existing album
const update = async (req, res) => {

    // If the id parameter is missing, or has an unexpeted value, return and inform the user
    if (!req.params.albumId || isNaN(req.params.albumId) || req.params.albumId < 0) {
        return res.status(400).send({
            status: 'fail',
            data: 'Invalid params'
        });
    }

    // Try to get the album with the given param
    let album = await new models.Album({id: req.params.albumId}).fetch({require: false});

    // If no album was found, return and inform the user
    if (!album) {
        return res.status(404).send({
            status: 'fail',
            data: 'There is not such album'
        });
    }

    // If the album does not belong to the user, return and inform the user
    if (album.attributes.user_id !== req.user.id) {
        return res.status(403).send({
            status: 'fail',
            data: 'Thas is not your album!'
        });
    }

    // Return a failure message if the data didn't went through the validation
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
        album = await album.save(validData);

        // Send a successful message to the user, aswell as the photo attributes
        res.status(200).send({
            status: 'success',
            data: {
                "id": album.attributes.id,
                "title": album.attributes.title,
                "user_id": album.attributes.user_id
            }
        });

    } catch (error) {
        // Throw an error if updating the album failed
        res.status(500).send({
            status: 'Error',
            message: 'Issues when updating the photo'
        });
        throw error;
    }

}

const addPhoto = async (req, res) => {
    // If the id parameter is missing, or has an unexpeted value, return and inform the user
    if (!req.params.albumId || isNaN(req.params.albumId) || req.params.albumId < 0) {
        return res.status(400).send({
            status: 'fail',
            data: 'Invalid params'
        });
    }

    // Return a failure message if the data didn't went through the validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            status: 'fail',
            data: errors.array()
        });
    }

    // Get the request data after it has gone through the validation
    const validData = matchedData(req);

    // Get the photo to add to album
    const photo = await new models.Photo({ id: validData.photo_id }).fetch({ require: false });

    try {
        // Get the requested album and it's photos
        const album = await models.Album.fetchById(req.params.albumId, {withRelated: ['photos'], require: false});

        // If the album was not found, return and inform the user
        if (!album) {
            return res.status(404).send({
                status: 'fail',
                message: 'No such album exists'
            })
        }

        // If the photo and/or album does not have the correct owner, return and inform the user
        if (photo.attributes.user_id !== album.attributes.user_id || album.attributes.user_id !== req.user.id) {
            return res.status(403).send({
                status: 'fail',
                data: 'That photo and/or album is not yours!'
            });
        }

        // If the photo is already added to the album, return and inform the user
        if ( album.related('photos').find( photo => photo.id === validData.photo_id ) ) {
            return res.status(400).send({
                status: 'fail',
                data: 'Photo already added to this album'
            });
        }

        // Try to attach given photo to album list
        await album.photos().attach(validData.photo_id);

        // Send the user a successful message
        res.status(201).send({
            status: 'succes',
            data: null
        });

    } catch (error) {
        // Return an error message if the database could not go through with the request
        res.status(500).send({
			status: 'error',
			message: 'Database error when adding the photo',
		});
		throw error;
    }

}

// Export the modules
module.exports = {
    read,
    readOne,
    create,
    update,
    addPhoto
};