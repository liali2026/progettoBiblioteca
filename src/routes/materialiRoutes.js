const express = require('express');

const materialiController = require('../controllers/materialiController');

const router = express.Router();

//router.get('/', materialiController.findAll);

router.get('/', materialiController.search);

module.exports = router;