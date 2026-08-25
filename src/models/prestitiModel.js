const {
    withConnection,
    withTransaction
} = require('../config/db');

async function creaPrestito(idUtente, idLibro, durataMesi) {
    return withTransaction(async connection => {
        const [books] = await connection.query(
            `SELECT id_libro
               FROM libri
              WHERE id_libro = ?
                AND attivo = 1`,
            [idLibro]
        );

        if (!books.length) {
            throw new Error('Libro non trovato');
        }

        //controllo esistenza di prestiti già in corso per lo stesso libro
        const [existing] = await connection.query(
            `SELECT id_prestito
                FROM vista_prestiti
                WHERE id_utente = ?
                    AND id_libro = ?
                    AND stato in ('ATTIVO','SCADUTO')
                LIMIT 1
                FOR UPDATE`,
            [idUtente, idLibro]
        );

        if (existing.length) {
            throw new Error('Esiste già un prestito attivo per questo libro');
        }
        //

        const [copies] = await connection.query(
            `SELECT id_copia
               FROM copie
              WHERE id_libro = ?
                AND stato = 'DISPONIBILE'
                AND attivo = 1
              ORDER BY id_copia
              LIMIT 1
              FOR UPDATE`,
            [idLibro]
        );

        if (!copies.length) {
            const result = await inserisciPrenotazione(
                connection,
                idUtente,
                idLibro,
                durataMesi
            );
            return {
                esito: 'PRENOTAZIONE',
                id: result.insertId,
                idCopia: null
            };
        }

        const idCopia = copies[0].id_copia;
        const result = await inserisciPrestito(
            connection,
            idUtente,
            idLibro,
            idCopia,
            durataMesi
        );

        return {
            esito: 'PRESTITO',
            id: result.insertId,
            idCopia
        };
    });
}

async function ricercaPrestiti({
    idUtente,
    utente,
    titolo,
    autore,
    stato,
    tipo,
    storico
}) {
    const filters = [];
    const params = [];

    if (idUtente) {
        filters.push('id_utente = ?');
        params.push(idUtente);
    }

    addLikeFilter(filters, params, 'email', utente);
    addLikeFilter(filters, params, 'titolo', titolo);
    addLikeFilter(filters, params, 'autore', autore);

    if (stato) {
        filters.push('stato = ?');
        params.push(stato);
    }

    if (tipo) {
        filters.push('tipo = ?');
        params.push(tipo);
    }

    if (storico !== null && storico !== undefined) {
        filters.push('isStorico = ?');
        params.push(storico);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    return withConnection(async connection => {
        const [rows] = await connection.query(
            `SELECT *
               FROM vista_prestiti
               ${where}
              ORDER BY data_inizio DESC, id_prestito DESC`,
            params
        );
        return rows;
    });
}

async function restituisciPrestito(idPrestito, utente) {
    return withTransaction(async connection => {
        const [loans] = await connection.query(
            `SELECT *
               FROM prestiti
              WHERE id_prestito = ?
              FOR UPDATE`,
            [idPrestito]
        );

        const loan = loans[0];
        if (!loan) {
            throw new Error('Nessun prestito trovato');
        }

        if (utente.ruolo !== 'BIBLIOTECARIO'
            && Number(loan.id_utente) !== Number(utente.id_utente)) {
            const error = new Error(
                'Non puoi restituire un prestito di un altro utente'
            );
            error.status = 403;
            throw error;
        }

        if (loan.data_restituzione !== null) {
            throw new Error('Prestito già chiuso');
        }

        await connection.query(
            `UPDATE prestiti
                SET stato = 'RESTITUITO',
                    data_restituzione = NOW()
              WHERE id_prestito = ?`,
            [idPrestito]
        );

        await connection.query(
            `UPDATE copie
                SET stato = 'DISPONIBILE'
              WHERE id_libro = ?
                AND id_copia = ?`,
            [loan.id_libro, loan.id_copia]
        );

        const nuovaAssegnazione = await assegnaPrimaPrenotazione(
            connection,
            loan.id_libro,
            loan.id_copia
        );

        return {
            idPrestito,
            idCopia: loan.id_copia,
            nuovaAssegnazione,
            messaggio: 'Prestito restituito correttamente'
        };
    });
}

async function getStati() {
    return withConnection(async connection => {
        const [rows] = await connection.query(
            `SELECT categoria,
                    codice,
                    descrizione,
                    storico
               FROM configurazioni
              WHERE attivo = 1
                AND categoria IN (
                    'STATO_PRESTITO',
                    'STATO_PRENOTAZIONE'
                )
              ORDER BY categoria, ordine`
        );
        return rows;
    });
}

async function inserisciPrestito(
    connection,
    idUtente,
    idLibro,
    idCopia,
    durataMesi
) {

    const [result] = await connection.query(
        `INSERT INTO prestiti (
            id_utente,
            id_libro,
            id_copia,
            data_inizio,
            data_fine,
            stato
        ) VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MONTH), 'ATTIVO')`,
        [idUtente, idLibro, idCopia, durataMesi]
    );

    await connection.query(
        `UPDATE copie
            SET stato = 'PRESTITO'
          WHERE id_libro = ?
            AND id_copia = ?`,
        [idLibro, idCopia]
    );

    return result;
}

async function inserisciPrenotazione(
    connection,
    idUtente,
    idLibro,
    durataMesi
) {
    const [existing] = await connection.query(
        `SELECT id_prenotazione
           FROM prenotazioni
          WHERE id_utente = ?
            AND id_libro = ?
            AND st_prenotazione = 'ATTESA'
          LIMIT 1
          FOR UPDATE`,
        [idUtente, idLibro]
    );

    if (existing.length) {
        throw new Error('Esiste già una prenotazione per questo libro');
    }

    const [result] = await connection.query(
        `INSERT INTO prenotazioni (
            id_utente,
            id_libro,
            data_prenotazione,
            durata_prestito,
            st_prenotazione
        ) VALUES (?, ?, NOW(), ?, 'ATTESA')`,
        [idUtente, idLibro, durataMesi]
    );
    return result;
}

async function annullaPrenotazione(idPrenotazione, utente) {
    return withTransaction(async connection => {
        const [reservations] = await connection.query(
            `SELECT *
               FROM prenotazioni
              WHERE id_prenotazione = ?
                AND st_prenotazione = 'ATTESA'
              LIMIT 1
              FOR UPDATE`,
            [idPrenotazione]
        );

        const reservation = reservations[0]
        if (!reservation) {
            throw new Error('Prenotazione non trovata');
        }

        if (utente.ruolo !== 'BIBLIOTECARIO'
            && Number(reservation.id_utente) !== Number(utente.id_utente)) {
            const error = new Error(
                'Non puoi annullare una prenotazione di un altro utente'
            );
            error.status = 403;
            throw error;
        }

        const [result] = await connection.query(
            `UPDATE prenotazioni
            SET st_prenotazione = 'ANNULLATA',
                data_chiusura = NOW()
          WHERE id_prenotazione = ?
            AND st_prenotazione = 'ATTESA'`,
            [idPrenotazione]
        );

        if (!result.affectedRows) {
            throw new Error("Impossibile annullare la prenotazione");
        }
        return {
            idPrenotazione: idPrenotazione,
            righeAggiornate: result.affectedRows,
            messaggio: 'Prenotazione annullata correttamente'
        };
    });
}

async function assegnaPrimaPrenotazione(connection, idLibro, idCopia) {
    const [reservations] = await connection.query(
        `SELECT *
           FROM prenotazioni
          WHERE id_libro = ?
            AND st_prenotazione = 'ATTESA'
          ORDER BY data_prenotazione, id_prenotazione
          LIMIT 1
          FOR UPDATE`,
        [idLibro]
    );

    const reservation = reservations[0];
    if (!reservation) {
        return null;
    }

    const loan = await inserisciPrestito(
        connection,
        reservation.id_utente,
        idLibro,
        idCopia,
        reservation.durata_prestito
    );

    await connection.query(
        `UPDATE prenotazioni
            SET st_prenotazione = 'EVASA',
                data_chiusura = NOW()
          WHERE id_prenotazione = ?`,
        [reservation.id_prenotazione]
    );

    // Creo la notifica da elaborare successivamente dal job
    await registraNotificaConConnection(
        connection,
        loan.insertId,
        'PRENOTAZIONE_EVASA'
    );

    return {
        idPrenotazione: reservation.id_prenotazione,
        idPrestito: loan.insertId,
        idUtente: reservation.id_utente
    };
}

function addLikeFilter(filters, params, column, value) {
    if (value) {
        filters.push(`${column} LIKE ?`);
        params.push(`%${value}%`);
    }
}

async function aggiornaPrestitiScaduti() {
    return withConnection(async connection => {

        const [result] = await connection.query(
            `UPDATE prestiti
                SET stato = 'SCADUTO'
              WHERE stato = 'ATTIVO'
                AND data_fine < CURDATE()`
        );

        return result.affectedRows;
    });
}

async function trovaPrestitiInScadenza(giorniPreavviso) {

    return withConnection(async connection => {

        const [rows] = await connection.query(
            `SELECT
                p.id_prestito,
                p.id_utente,
                p.id_libro,
                p.data_inizio,
                p.data_fine,
                u.email,
                u.nome,
                u.cognome,
                l.titolo
             FROM prestiti p
             JOIN utenti u
               ON u.id_utente = p.id_utente
             JOIN libri l
               ON l.id_libro = p.id_libro
             WHERE p.stato = 'ATTIVO'
               AND p.data_fine <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
               AND NOT EXISTS (
                   SELECT 1
                   FROM notifiche_prestiti n
                   WHERE n.id_prestito = p.id_prestito
                     AND n.tipo = 'SCADENZA_PRESTITO'
               )
             ORDER BY p.data_fine`,
            [giorniPreavviso]
        );

        return rows;
    });
}


async function trovaPrenotazioniEvase() {

    return withConnection(async connection => {

        const [rows] = await connection.query(
            `SELECT
                p.id_prestito,
                p.id_utente,
                p.id_libro,
                p.data_inizio,
                p.data_fine,
                u.email,
                u.nome,
                u.cognome,
                l.titolo
             FROM prestiti p
             JOIN utenti u
               ON u.id_utente = p.id_utente
             JOIN libri l
               ON l.id_libro = p.id_libro
             WHERE p.stato = 'ATTIVO'
               AND EXISTS (
                   SELECT 1
                   FROM notifiche_prestiti n
                   WHERE n.id_prestito = p.id_prestito
                     AND n.tipo = 'PRENOTAZIONE_EVASA'
                     AND n.data_invio is null
               )
             ORDER BY p.id_prestito`
        );

        return rows;
    });
}

async function registraNotifica(idPrestito, tipo, dataInvio = null) {

    return withConnection(async connection => {

        return registraNotificaConConnection(
            connection,
            idPrestito,
            tipo,
            dataInvio
        );

    });
}


async function registraNotificaConConnection(
    connection,
    idPrestito,
    tipo,
    dataInvio = null
) {

    if (dataInvio === null) {

        const [result] = await connection.query(
            `INSERT INTO notifiche_prestiti
                (id_prestito, tipo, data_invio)
             VALUES (?, ?, NULL)`,
            [idPrestito, tipo]
        );

        return result;
    }

    const [result] = await connection.query(
        `UPDATE notifiche_prestiti
            SET data_invio = ?
          WHERE id_prestito = ?
            AND tipo = ?
            AND data_invio IS NULL`,
        [dataInvio, idPrestito, tipo]
    );

    if (result.affectedRows === 0) {

        const [insertResult] = await connection.query(
            `INSERT INTO notifiche_prestiti
                (id_prestito, tipo, data_invio)
             VALUES (?, ?, ?)`,
            [idPrestito, tipo, dataInvio]
        );

        return insertResult;
    }

    return result;
}

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito,
    annullaPrenotazione,
    getStati,
    aggiornaPrestitiScaduti,
    assegnaPrimaPrenotazione,
    trovaPrestitiInScadenza,
    trovaPrenotazioniEvase,
    registraNotifica
};
