const express = require('express');

const materialiController = require('../controllers/materialiController');

const router = express.Router();

router.get('/', materialiController.findAll);

module.exports = router;