const prestitiModel = require('../models/prestitiModel');

async function creaPrestito(idUtente, idLibro, durataMesi) {

    if (!Number.isInteger(Number(durataMesi))
        || Number(durataMesi) < 1
        || Number(durataMesi) > 3) {
        throw new Error(
            'Durata non valida'
        );
    }

    return prestitiModel.creaPrestito(
        Number(idUtente),
        Number(idLibro),
        Number(durataMesi)
    );
}

async function ricercaPrestiti(filters) {
    return prestitiModel.ricercaPrestiti({
        ...filters,
        stato: filters.stato === 'ALL' ? null : filters.stato,
        tipo: filters.tipo === 'ALL' ? null : filters.tipo,
        storico: filters.storico === 'ALL' ? null : filters.storico
    });
}

async function restituisciPrestito(idPrestito, utente) {

    if (!Number.isInteger(Number(idPrestito))) {
        throw new Error('Identificativo prestito non valido');
    }
    return prestitiModel.restituisciPrestito(
        Number(idPrestito),
        utente
    );

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
