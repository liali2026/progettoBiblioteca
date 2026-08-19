const prestitiModel = require('../models/prestitiModel');
const emailService = require('./emailService');

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

async function controllaScadenze() {

    const numeroScaduti =
        await prestitiModel.aggiornaPrestitiScaduti();

    console.log(
        `Controllo scadenze completato. Prestiti aggiornati: ${numeroScaduti}`
    );

    return numeroScaduti;
}

async function controllaPrestitiInScadenza(giorniPreavviso) {

    const prestiti =
        await prestitiModel.trovaPrestitiDaNotificare(
            giorniPreavviso
        );

    for (const prestito of prestiti) {

        // Per ora simuliamo l'invio
        console.log(
            `Prestito ${prestito.id_prestito} ` +
            `di ${prestito.nome} ${prestito.cognome} ` +
            `in scadenza il ${prestito.data_fine}`
        );
    }
    /*for (const prestito of prestiti) {

    try {

        await emailService.inviaNotificaScadenza(prestito);

        await prestitiModel.registraNotifica(
            prestito.id_prestito,
            'SCADENZA_PRESTITO'
        );

    } catch (err) {

        console.error(
            `Errore invio notifica prestito ${prestito.id_prestito}:`,
            err
        );

    }
}*/
}

async function testEmail() {

    await emailService.inviaEmail({
        destinatario: 'annalisa.liguori@tiscali.it',
        oggetto: 'Test biblioteca',
        testo: 'Questa è una mail di prova inviata dal server della biblioteca.'
    });

    console.log('Email inviata correttamente');
}

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito,
    getStati,
    controllaScadenze,
    controllaPrestitiInScadenza,
    testEmail
}
