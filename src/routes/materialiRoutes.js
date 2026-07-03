const express = require('express');
const materialiController = require('../controllers/materialiController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const router = express.Router();


router.get('/', materialiController.search);
router.get('/:id', materialiController.findById);

router.post(
    '/admin/insert', 
    authenticate, 
    authorize("BIBLIOTECARIO"), 
    materialiController.insertItem);

router.put(
    '/admin/update/:id', 
    authenticate, 
    authorize("BIBLIOTECARIO"), 
    materialiController.updateItem);

router.delete(
    '/admin/delete/:id', 
    authenticate, 
    authorize("BIBLIOTECARIO"), 
    materialiController.deleteItem);

module.exports = router;