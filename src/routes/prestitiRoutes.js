const express = require('express');
const prestitiController = require('../controllers/prestitiController');
const router = express.Router();

router.post('/', prestitiController.creaPrestito);

module.exports = router;