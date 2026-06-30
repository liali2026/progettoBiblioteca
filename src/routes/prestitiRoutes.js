const express = require('express');
const prestitiController = require('../controllers/prestitiController');
const router = express.Router();

router.post('/creaPrestito', prestitiController.creaPrestito);
router.get('/ricercaAllPrestiti', prestitiController.ricercaAllPrestiti);

module.exports = router;