// Read express module and use for routing purposes
const express = require('express');
const router = express.Router();
// Read validation and controller files
const photosValidation = require('../validation/photo_validation')
const photosController = require('../controllers/photos_controller');

// Direct GET / traffic to the read method in photosController file
router.get('/', photosController.read);

// Direct GET /:photoId traffic to the readOne method in photosController file
router.get('/:photoId', photosController.readOne);

// Direct POST / traffic to the create method in photosController file,
// using createRules method in photosValidation file as validation middleware
router.post('/', photosValidation.createRules, photosController.create);

// Direct PUT /:photoId traffic to the update method in photosController file
// using updateRules method in photosValidation file as validation middleware
router.put('/:photoId', photosValidation.updateRules, photosController.update);

// Export router for use in other files
module.exports = router