const express = require('express');
const router = express.Router();
const photosValidation = require('../validation/photo_validation')
const photosController = require('../controllers/photos_controller');

// Direct GET / traffic to the read method in photosController file
router.get('/', photosController.read);

// Direct GET /:photoId traffic to the read method in photosController file
router.get('/:photoId', photosController.readOne);

// Direct POST / traffic to the create method in photosController file
router.post('/', photosValidation.createRules, photosController.create);

module.exports = router