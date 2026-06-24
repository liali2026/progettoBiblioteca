const prestitiModel = require('../models/prestitiModel');

async function creaPrestito(idUtente, idLibro, durataMesi) {

    if (durataMesi < 1 || durataMesi > 3) {
        throw new Error(
            'Durata non valida'
        );
    }

    return await prestitiModel.creaPrestito(idUtente, idLibro, durataMesi);
}

module.exports = {
    creaPrestito
}