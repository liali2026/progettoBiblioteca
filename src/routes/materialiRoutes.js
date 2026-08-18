const express = require('express');

const {
    authorize
} = require('../middlewares/authenticate');
const uploadCover =  require("../middlewares/uploadCover");

const materialiController = require('../controllers/materialiController');

const router = express.Router();



router.get('/generi', materialiController.getAllGeneri);

router.post(
    '/admin/insert', 
    authorize("BIBLIOTECARIO"), 
    uploadCover.single('copertina'), //gestione della copertina
    materialiController.insertItem);

router.put(
    '/admin/update/:id', 
    authorize("BIBLIOTECARIO"), 
    uploadCover.single('copertina'), //gestione della copertina
    materialiController.updateItem);

router.delete(
    '/admin/delete/:id', 
    authorize("BIBLIOTECARIO"), 
    materialiController.deleteItem);

//GESTIONE DELLE COPIE
router.get(
    "/admin/:idMateriale/copies",
    authorize("BIBLIOTECARIO"),
    materialiController.getCopie
);

router.post(
    "/admin/:idMateriale/copies",
    authorize("BIBLIOTECARIO"),
    materialiController.addCopie
);

router.delete(
    "/admin/:idMateriale/copies/:idCopia",
    authorize("BIBLIOTECARIO"),
    materialiController.deleteCopia
);


router.get('/', materialiController.search);
router.get('/:id', materialiController.findById);

module.exports = router;
