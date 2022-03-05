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

// Direct POST / traffic to the create method in albumsController file
router.post('/', albumValidation.createRules, albumsController.create);

module.exports = router