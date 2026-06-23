const materialiService = require('../services/materialiService');

/*async function findAll(req, res, next) {

    try {
        const materiali =await materialiService.findAll();
        res.json(materiali);

    } catch(err) {
        next(err);
    }

}*/

async function search(req, res, next) {

    try {
        const {titolo, autore} = req.query;

        const materiali =await materialiService.search(titolo, autore);
        res.json(materiali);

    } catch(err) {
        next(err);
    }

}


module.exports = {
    search
};