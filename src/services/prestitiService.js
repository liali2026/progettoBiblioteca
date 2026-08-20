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

async function controllaScaduti() {

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

        try {

            await inviaNotificaScadenza(prestito);

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
    }
}

async function inviaNotificaScadenza(prestito) {

    const testo = generaTestoNotificaScadenza(prestito);

    await emailService.inviaEmail({
        destinatario: prestito.email,
        oggetto: `Prestito in scadenza: ${prestito.titolo}`,
        testo
    });
}

function generaTestoNotificaScadenza(prestito) {
    const dataScadenza = new Date(prestito.data_fine).toLocaleDateString('it-IT'); 

    return `
Gentile ${prestito.nome} ${prestito.cognome},

il prestito del materiale "${prestito.titolo}"
è in scadenza il ${dataScadenza}.

Ti ricordiamo di restituire il materiale entro la data indicata.

Cordiali saluti,
Biblioteca
`.trim();
}

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito,
    getStati,
    controllaScaduti,
    controllaPrestitiInScadenza
}
