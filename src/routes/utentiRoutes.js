const express = require('express');
const utentiController = require('../controllers/utentiController');

const router = express.Router();

router.post('/registrazione', utentiController.registrazione);
router.post('/login', utentiController.login);
router.get('/me', utentiController.me);
router.post('/logout',utentiController.logout);

module.exports = router;