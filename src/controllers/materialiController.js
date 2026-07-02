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

        return {
            idLibro: risultato.idLibro,
            righeAggiornate: risultato.righeAggiornate,
            messaggio: "Materiale aggiornato correttamente"
        };

    } catch (err) {
        next(err);
    }

}

async function deleteItem(req, res, next) {
    try {

        const risultato = await materialiService.deleteItem(req.params.id);

        return {
            idLibro: risultato.idLibro,
            righeAggiornate: risultato.righeAggiornate,
            messaggio: "Materiale cancellato correttamente"
        };

    } catch (err) {
        next(err);
    }

}


module.exports = {
    search,
    findById,
    insertItem,
    updateItem,
    deleteItem
};