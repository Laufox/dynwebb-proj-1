const express = require('express');
const router = express.Router();
const photosValidation = require('../validation/photo_validation')
const photosController = require('../controllers/photos_controller');

router.get('/', (req, res) => {
    res.status(200).send({
        status: "Success",
        data: "Hello from photos route"
    })
});

router.post('/', photosValidation.createRules, photosController.create);

module.exports = router