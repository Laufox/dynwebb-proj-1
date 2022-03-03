const express = require('express');
const router = express.Router();
const albumsController = require('../controllers/albums_controller');

router.get('/', (req, res) => {
    res.status(200).send({
        status: "Success",
        data: "Hello"
    })
});

module.exports = router