const getConnection = require('../config/db');
const { logQuery } = require('../utils/dbLogger');

async function creaPrestito(idUtente, idLibro, durataMesi) {

    const conn = await getConnection();

    try {
        await conn.beginTransaction();

        /*
         * Recupera una copia disponibile
         */
        const [copie] = await conn.query(
            `SELECT min(id_copia) as id_copia
                FROM copie 
                where id_libro = ?
                and stato ="DISPONIBILE";`,
            [idLibro]
        );

        let result;
        let esito = null;
        const idCopia = copie[0].id_copia;

        if (!idCopia){

            /*throw new Error(
                'Nessuna copia disponibile'
            );*/
            //gestione delle prenotazioni
            result  = await inserisciPrenotazione(idUtente, idLibro, durataMesi, conn);
            esito ='PRENOTAZIONE';

        } else {
            result = await inserisciPrestito(idUtente, idLibro, idCopia, durataMesi, conn);
            esito = 'PRESTITO';
        }

        await conn.commit();

        return {
            esito: esito,
            id: result.insertId,
            idCopia
        };

    } catch (err) {

        await conn.rollback();
        throw err;

    } finally {
        await conn.end();
    }
}

async function inserisciPrestito(idUtente, idLibro, idCopia, durataMesi, conn) {
    /*
        * Inserisce il prestito
        */
    const [result] =
        await conn.query(
            `
                INSERT INTO prestiti
                (
                    id_utente,
                    id_libro,
                    id_copia,
                    data_inizio,
                    data_fine,
                    stato
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    NOW(),
                    DATE_ADD(NOW(), INTERVAL ? MONTH),
                    "ATTIVO"
                )
                `,
            [
                idUtente,
                idLibro,
                idCopia,
                durataMesi
            ]
        );

    /*
     * Aggiorna la disponibilità
     */
    await conn.query(
        `
            UPDATE copie
            SET stato = "PRESTITO"
            WHERE id_copia = ?
            `,
        [idCopia]
    );

    return result;
}

async function ricercaPrestiti(idUtente, titolo, autore, stato, tipo) {
    const conn = await getConnection();
    try {
        /*let sql = `SELECT p.*, l.*
                     FROM prestiti p, copie c, libri l
                    WHERE p.id_copia = c.id_copia
                      AND c.id_libro = l.id_libro`;*/
        let sql = `SELECT *
                     FROM vista_prestiti
                     WHERE 1=1`

        const params = [];

        //ATTENZIONE! DA MODIFICARE DATO CHE NON PUò ESSERE NULLO (?)
        if (idUtente) {
            sql += ` AND id_utente = ?`;
            params.push(idUtente);
        }

        if (titolo) {
            sql += ` AND titolo like ?`;
            params.push(`%${titolo}%`);
        }

        if (autore) {
            sql += ` AND autore like ?`;
            params.push(`%${autore}%`);
        }

        if (stato) {
            sql += ` AND stato like ?`;
            params.push(`%${stato}%`);
        }

        if (tipo) {
            sql += ` AND tipo like ?`;
            params.push(`%${tipo}%`);
        }

        //logQuery(sql, params);

        const [prestiti] = await conn.query(sql, params);

        //console.log(prestiti);
        return prestiti;

    } finally {
        await conn.end();
    }
}

async function restituisciPrestito(idPrestito) {

    const conn = await getConnection();

    try {
        await conn.beginTransaction();


        const [prestito] = await conn.query(
            `SELECT *
               FROM prestiti 
              WHERE id_prestito = ?;`,
            [idPrestito]
        );

        //console.log(prestito);

        if (!prestito[0].id_prestito) {

            throw new Error(
                'Nessun prestito trovato per il materiale scelto'
            );
        }

        if (prestito[0].data_restituzione === null) {

            // aggiorno lo stato e la data di restituzione
            await conn.query(
                `
                UPDATE prestiti
                   SET stato ="RESTITUITO",
                       data_restituzione = sysdate()
                 WHERE id_prestito = ?
                 `,
                [prestito[0].id_prestito]
            )

            // aggiorno la disponibilità della copia associata al prestito
            await conn.query(
                `
                UPDATE copie
                   SET stato = "DISPONIBILE"
                WHERE id_copia = ?
                `,
                [prestito[0].id_copia]
            );

            //gestisco la prenotazione
            await gestisciPrenotazione
                (
                    prestito[0].id_libro,
                    prestito[0].id_copia,
                    conn
                );


        } else {
            throw new Error(
                'Prestito già chiuso'
            );
        }

        await conn.commit();

        return {
            idPrestito: prestito[0].id_prestito,
            idCopia: prestito[0].id_copia,
            messaggio: 'Prestito restituito correttamente'
        };

    } catch (err) {

        await conn.rollback();
        throw err;

    } finally {
        await conn.end();
    }
}

//chiamata alla richiesta di un prestito, senza copie disponibili
async function inserisciPrenotazione(idUtente, idLibro, durataPrestito, conn) {

    const [rows] = await conn.query(
        `SELECT count(*) as nrPrenotazioni
           FROM prenotazioni 
          WHERE id_utente = ?
            AND id_libro = ?
            AND st_prenotazione ='ATTESA'`,
        [idUtente,
            idLibro
        ]
    );

    if (rows[0].nrPrenotazioni > 0) {
        throw new Error("Esiste già una prenotazione per questo libro");
    }

    const [result] =
        await conn.query(
            `
                INSERT INTO prenotazioni
                (
                    id_utente,
                    id_libro,
                    data_prenotazione,
                    durata_prestito,
                    st_prenotazione
                )
                VALUES
                (
                    ?,
                    ?,
                    NOW(),
                    ?,
                    "ATTESA"
                )
                `,
            [
                idUtente,
                idLibro,
                durataPrestito
            ]
        );

    return result;

}

//chiamata alla restituzione di una copia, per gestire eventuali prenotazioni
async function gestisciPrenotazione(idLibro, idCopia, conn) {

    const [prenotazioni] = await conn.query(
        `SELECT *
           FROM prenotazioni 
          WHERE id_libro = ?
            AND st_prenotazione ='ATTESA'
            ORDER BY id_prenotazione`,
        [idLibro]
    );

    const prenotazione = prenotazioni[0];
    if (prenotazione) {
        await inserisciPrestito
            (
                prenotazione.id_utente,
                idLibro,
                idCopia,
                prenotazione.durata_prestito,
                conn
            );

        await conn.query(
            `UPDATE prenotazioni
                SET st_prenotazione ='EVASA'
              WHERE id_prenotazione = ?`,
              [prenotazione.id_prenotazione]
        );
    }
}

async function getStati() {

    const conn = await getConnection();

    try {

        const [rows] = await conn.query(
            `
            SELECT categoria,
                   codice,
                   descrizione
            FROM configurazioni
            WHERE attivo = 1
              AND categoria IN (
                    'STATO_PRESTITO',
                    'STATO_PRENOTAZIONE'
              )
            ORDER BY categoria, ordine
            `
        );

        return rows;

    } finally {
        await conn.end();
    }
}


module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito,
    getStati
}