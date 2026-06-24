const materialiService = require('../services/materialiService');

async function search(req, res, next) {

    try {
        const {titolo, autore} = req.query;

        const materiali =await materialiService.search(titolo, autore);
        res.json(materiali);

    } catch(err) {
        next(err);
    }

}

async function findById(req, res, next) {

    try {
        const materiali = await materialiService.findById(req.params.id);
        res.json(materiali);

    } catch(err) {
        next(err);
    }

}

module.exports = {
    search,
    findById
};