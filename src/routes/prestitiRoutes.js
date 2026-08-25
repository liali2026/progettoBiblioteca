const express = require('express');
const prestitiController = require('../controllers/prestitiController');
const {
    authenticate
} = require('../middlewares/authenticate');
const router = express.Router();

router.post('/creaPrestito', authenticate, prestitiController.creaPrestito);
router.post('/ricercaPrestiti', authenticate, prestitiController.ricercaPrestiti);
router.post(
    '/restituisciPrestito',
    authenticate,
    prestitiController.restituisciPrestito
);
router.post(
    '/annullaPrenotazione',
    authenticate,
    prestitiController.annullaPrenotazione
);
router.get( "/config/stati", authenticate, prestitiController.getStati);

module.exports = router;
