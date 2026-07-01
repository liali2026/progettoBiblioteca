const express = require('express');
const prestitiController = require('../controllers/prestitiController');
const router = express.Router();

router.post('/creaPrestito', prestitiController.creaPrestito);
router.post('/ricercaPrestiti', prestitiController.ricercaPrestiti);
router.post('/restituisciPrestito', prestitiController.restituisciPrestito);

module.exports = router;