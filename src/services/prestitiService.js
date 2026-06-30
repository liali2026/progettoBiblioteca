const prestitiModel = require('../models/prestitiModel');

async function creaPrestito(idUtente, idLibro, durataMesi) {

    if (durataMesi < 1 || durataMesi > 3) {
        throw new Error(
            'Durata non valida'
        );
    }

    return await prestitiModel.creaPrestito(idUtente, idLibro, durataMesi);
}

async function ricercaAllPrestiti(idUtente){
    if (!idUtente){
         throw new Error(
            'Utente non loggato'
        );
    }
    
    return await prestitiModel.ricercaAllPrestiti(idUtente);
}

module.exports = {
    creaPrestito,
    ricercaAllPrestiti
}