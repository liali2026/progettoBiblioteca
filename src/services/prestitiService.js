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

async function annullaPrenotazione(idPrenotazione, utente) {

    if (!Number.isInteger(Number(idPrenotazione))) {
        throw new Error('Identificativo prenotazione non valido');
    }
    return prestitiModel.annullaPrenotazione(
        Number(idPrenotazione),
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

async function controllaPrestitiDaNotificare(tipo, giorniPreavviso) {

    let prestiti = [];
    switch (tipo) {

        case 'SCADENZA_PRESTITO':
            prestiti =
                await prestitiModel.trovaPrestitiInScadenza(
                    giorniPreavviso
                );
            break;

        case 'PRENOTAZIONE_EVASA':
            prestiti = 
            await prestitiModel.trovaPrenotazioniEvase();
            break;

        default:
            throw new Error(`Tipo di notifica non supportato: ${tipo}`);
    }

    for (const prestito of prestiti) {

        try {

            await inviaNotifica(prestito, tipo);

            await prestitiModel.registraNotifica(
                prestito.id_prestito,
                tipo,
                new Date()
            );

        } catch (err) {

            console.error(
                `Errore invio notifica ${tipo} ${prestito.id_prestito}:`,
                err
            );

        }
    }
}

async function inviaNotifica(prestito, tipo) {

    let testo;
    let oggetto;

    switch (tipo) {

        case 'SCADENZA_PRESTITO':
            testo = generaTestoNotificaScadenza(prestito);
            oggetto = `Prestito in scadenza: ${prestito.titolo}`;
            break;

        case 'PRENOTAZIONE_EVASA':
            testo = generaTestoNotificaPrenotazioneEvasa(prestito);
            oggetto = `Prenotazione evasa: ${prestito.titolo}`;
            break;

        default:
            throw new Error(`Tipo di notifica non supportato: ${tipo}`);
    }

    await emailService.inviaEmail({
        destinatario: prestito.email,
        oggetto,
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

function generaTestoNotificaPrenotazioneEvasa(prestito) {
    const dataScadenza = new Date(prestito.data_fine).toLocaleDateString('it-IT');

    return `
Gentile ${prestito.nome} ${prestito.cognome},

a seguito della tua precedente prenotazione è stato creato un prestito a tuo nome per "${prestito.titolo}".
Il prestito inizia da oggi ed è in scadenza il ${dataScadenza}.

Ti ricordiamo di restituire il materiale entro la data indicata oppure di cancellare il prestito, se non più interessato.

Cordiali saluti,
Biblioteca
`.trim();
}

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito,
    annullaPrenotazione,
    getStati,
    controllaScaduti,
    controllaPrestitiDaNotificare
}
