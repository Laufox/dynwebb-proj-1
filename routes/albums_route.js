const express = require('express');
const router = express.Router();
const albumValidation = require('../validation/album_validation');
const albumsController = require('../controllers/albums_controller');

// Direct GET / traffic to the read method in albumsController file
router.get('/', albumsController.read);

// Direct POST / traffic to the create method in albumsController file
router.post('/', albumValidation.createRules, albumsController.create);

module.exports = router