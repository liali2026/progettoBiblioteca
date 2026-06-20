const materialiService = require('../services/materialiService');

async function findAll(req, res, next) {

    try {
        const materiali =await materialiService.findAll();
        res.json(materiali);

    } catch(err) {
        next(err);
    }

}

module.exports = {
    findAll
};