const express = require('express');

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const uploadCover =  require("../middlewares/uploadCover");

const materialiController = require('../controllers/materialiController');

const router = express.Router();



router.get('/generi', materialiController.getAllGeneri);
/*router.get("/generi", (req,res,next)=>{
    console.log("GET /generi");
    next();
}, materialiController.getAllGeneri);*/

router.post(
    '/admin/insert', 
    authenticate, 
    authorize("BIBLIOTECARIO"), 
    uploadCover.single('copertina'), //gestione della copertina
    materialiController.insertItem);

router.put(
    '/admin/update/:id', 
    authenticate, 
    authorize("BIBLIOTECARIO"), 
    uploadCover.single('copertina'), //gestione della copertina
    materialiController.updateItem);

router.delete(
    '/admin/delete/:id', 
    authenticate, 
    authorize("BIBLIOTECARIO"), 
    materialiController.deleteItem);

router.get('/', materialiController.search);
router.get('/:id', materialiController.findById);

module.exports = router;