const prestitiModel = require('../models/prestitiModel');

async function creaPrestito(idUtente, idLibro, durataMesi) {

    if (durataMesi < 1 || durataMesi > 3) {
        throw new Error(
            'Durata non valida'
        );
    }

    return await prestitiModel.creaPrestito(idUtente, idLibro, durataMesi);
}

async function ricercaPrestiti(idUtente, titolo, autore, stato, tipo, storico) {
    //l'utente o è quello loggato o quello passato nella post
    /*if (!idUtente){
         throw new Error(
            'Utente non loggato'
        );
    }*/

    if (stato === 'ALL') {
        stato = null;
    }

    if (tipo === "ALL"){
        tipo = null;
    }

    if (storico === "ALL") {
        storico = null; //li devo far vedere tutti, sia quelli in corso, sia quelli storici
    }

    return await prestitiModel.ricercaPrestiti(idUtente, titolo, autore, stato, tipo, storico);
}

async function restituisciPrestito(idPrestito) {

    return await prestitiModel.restituisciPrestito(idPrestito);

}

async function getStati() {

    const rows = await prestitiModel.getStati();

    const risultato = {};

    for (const row of rows) {

        const chiave =
            row.categoria
                .replace("STATO_", "")
                .toLowerCase();

        if (!risultato[chiave]) {
            risultato[chiave] = [];
        }

        risultato[chiave].push({
            codice: row.codice,
            descrizione: row.descrizione,
            storico: row.storico
        });
    }

    return risultato;
}

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito,
    getStati
}