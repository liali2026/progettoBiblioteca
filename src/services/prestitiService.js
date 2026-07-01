const prestitiModel = require('../models/prestitiModel');

async function creaPrestito(idUtente, idLibro, durataMesi) {

    if (durataMesi < 1 || durataMesi > 3) {
        throw new Error(
            'Durata non valida'
        );
    }

    return await prestitiModel.creaPrestito(idUtente, idLibro, durataMesi);
}

async function ricercaPrestiti(idUtente, titolo, autore, stato){
    if (!idUtente){
         throw new Error(
            'Utente non loggato'
        );
    }

    if (stato === 'ALL') {
        stato = null;
    }
    
    return await prestitiModel.ricercaPrestiti(idUtente, titolo, autore, stato);
}

async function restituisciPrestito(idPrestito){

    return await prestitiModel.restituisciPrestito(idPrestito);

}

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito
}