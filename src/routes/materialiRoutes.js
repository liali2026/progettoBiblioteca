const express = require('express');

const materialiController = require('../controllers/materialiController');

const router = express.Router();

router.get('/', materialiController.search);
router.get('/:id', materialiController.findById);

module.exports = router;