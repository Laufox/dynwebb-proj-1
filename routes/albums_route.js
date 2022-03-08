// Read express module and use for routing purposes
const express = require('express');
const router = express.Router();
// Read validation and controller files
const albumValidation = require('../validation/album_validation');
const albumsController = require('../controllers/albums_controller');

// Direct GET / traffic to the read method in albumsController file
router.get('/', albumsController.read);

// Direct GET /:albumId traffic to the readOne method in photosController file
router.get('/:albumId', albumsController.readOne);

/**
 *  Direct POST / traffic to the create method in albumsController file,
 *  using createRules method in albumsValidation file as validation middleware
*/
router.post('/', albumValidation.createRules, albumsController.create);

/**
 *  Direct PUT /:albumId traffic to the update method in albumsController file,
 *  using updateRules method in albumsValidation file as validation middleware
 */
router.put('/:albumId', albumValidation.updateRules, albumsController.update);

/**
 *  Direct POST /:albumId/photo traffic to the addPhoto method in albumsController file,
 *  using addPhotoRules method in albumsValidation file as validation middleware
 */
router.post('/:albumId/photo', albumValidation.addPhotoRules, albumsController.addPhoto);

// Export router for use in other files
module.exports = router