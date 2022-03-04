const express = require('express');
const router = express.Router();
const albumValidation = require('../validation/album_validation');
const albumsController = require('../controllers/albums_controller');

router.get('/', (req, res) => {
    res.status(200).send({
        status: "Success",
        data: "Hello from album route"
    })
});

router.post('/', albumValidation.createRules, albumsController.create);

module.exports = router