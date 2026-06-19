const express = require('express');
const utentiController = require('../controllers/utentiController');

const router = express.Router();

router.post('/registrazione', utentiController.registrazione);

module.exports = router;