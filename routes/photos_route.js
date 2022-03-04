const express = require('express');
const router = express.Router();
const photosController = require('../controllers/photos_controller');

router.get('/', (req, res) => {
    res.status(200).send({
        status: "Success",
        data: "Hello from photos route"
    })
});

module.exports = router