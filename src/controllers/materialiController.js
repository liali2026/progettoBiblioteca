const materialiService = require('../services/materialiService');

async function search(req, res, next) {

    try {
        //const { titolo, autore } = req.query;
        const { titolo, autore, anno, idGenere } = req.query;
        const soloDisponibili = req.query.soloDisponibili === "true";
        
        //const materiali = await materialiService.search(titolo, autore);
        const materiali = await materialiService.search(titolo, autore, anno, idGenere, soloDisponibili);
        res.json(materiali);

    } catch (err) {
        next(err);
    }

}

async function findById(req, res, next) {
    
    try {
        const materiali = await materialiService.findById(req.params.id);
        res.json(materiali);

    } catch (err) {
        next(err);
    }

}

async function insertItem(req, res, next) {
    try {

        //const materiale = req.body;
        let materiale = JSON.parse(req.body.materiale);
        // gestione della copertina
        if (req.file) {
            materiale.copertina = req.file.filename;
        }
        const risultato = await materialiService.insertItem(materiale);

        res.status(201).json({
            idLibro: risultato.idLibro,
            messaggio: "Materiale inserito correttamente"
        });

    } catch (err) {
        console.error("ERRORE INSERT:", err);
        next(err);
    }

}

async function updateItem(req, res, next) {
    try {
        //const materiale = req.body;
        let materiale = JSON.parse(req.body.materiale);
        materiale.idLibro = Number(req.params.id);

        // gestione della copertina
        if (req.file) {
            materiale.copertina = req.file.filename;
        }
        
        const risultato = await materialiService.updateItem(materiale);

         res.json({
            idLibro: risultato.idLibro,
            righeAggiornate: risultato.righeAggiornate,
            messaggio: "Materiale aggiornato correttamente"
        });

    } catch (err) {
        next(err);
    }

}

async function deleteItem(req, res, next) {
    try {

        const idMateriale = req.params.id;
        const risultato = await materialiService.deleteItem(idMateriale);

        res.json({
            idLibro: risultato.idLibro,
            righeCancellate: risultato.righeCancellate,
            messaggio: "Materiale cancellato correttamente"
        });

    } catch (err) {
        next(err);
    }

}

async function getAllGeneri(req, res, next) {

    try {
        const generi = await materialiService.getAllGeneri();
        res.json(generi);

    } catch (err) {
        next(err);
    }

}

async function getCopie(req, res, next) {
    
    try {
        const idMateriale = Number(req.params.idMateriale);
        const copie = await materialiService.getCopie(idMateriale);
        res.json(copie);

    } catch (err) {
        next(err);
    }

}

async function addCopie(req, res, next) {
    
    try {
        const idMateriale = Number(req.params.idMateriale);
        const nrCopie = Number(req.body.nrCopie);

        const risultato = await materialiService.addCopie(idMateriale, nrCopie);

        res.json({
            idMateriale: risultato.idMateriale,
            righeInserite: risultato.righeInserite,
            messaggio: "Copie inserite correttamente"
        });

    } catch (err) {
        next(err);
    }

}

async function deleteCopia(req, res, next) {
    
    try {
        const idMateriale = Number(req.params.idMateriale);
        const idCopia = Number(req.params.idCopia);

        //console.log("deleteCopia - idMateriale =" + idMateriale + " idCopia = "+idCopia);
        
        const risultato = await materialiService.deleteCopia(idMateriale, idCopia);

        res.json({
            idMateriale: risultato.idMateriale,
            idCopia: risultato.idCopia,
            righeCancellate: risultato.righeCancellate,
            messaggio: "Copia cancellata correttamente"
        });

    } catch (err) {
        next(err);
    }

}


module.exports = {
    search,
    findById,
    insertItem,
    updateItem,
    deleteItem,
    getAllGeneri,
    getCopie,
    addCopie,
    deleteCopia
};