const materialiService = require('../services/materialiService');

async function search(req, res, next) {

    try {
        const { titolo, autore } = req.query;

        const materiali = await materialiService.search(titolo, autore);
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

async function getAllGeneri(req, res, next) {

    try {
        const generi = await materialiService.getAllGeneri();
        res.json(generi);

    } catch (err) {
        next(err);
    }

}

async function insertItem(req, res, next) {
    try {

        const materiale = req.body;
        const risultato = await materialiService.insertItem(materiale);

        res.status(201).json({
            idLibro: risultato.idLibro,
            messaggio: "Materiale inserito correttamente"
        });

    } catch (err) {
        next(err);
    }

}

async function updateItem(req, res, next) {
    try {
        const materiale = req.body;
        materiale.idLibro = Number(req.params.id);
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


module.exports = {
    search,
    findById,
    getAllGeneri,
    insertItem,
    updateItem,
    deleteItem
};