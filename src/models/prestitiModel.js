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

        if (!copie[0].id_copia) {

            throw new Error(
                'Nessuna copia disponibile'
            );
        }

        const idCopia = copie[0].id_copia;

        /*
         * Inserisce il prestito
         */
        const [result] =
            await conn.query(
                `
                INSERT INTO prestiti
                (
                    id_utente,
                    id_copia,
                    data_inizio,
                    data_fine,
                    stato
                )
                VALUES
                (
                    ?,
                    ?,
                    NOW(),
                    DATE_ADD(NOW(), INTERVAL ? MONTH),
                    "ATTIVO"
                )
                `,
                [
                    idUtente,
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
            SET stato = "IN_PRESTITO"
            WHERE id_copia = ?
            `,
            [idCopia]
        );

        await conn.commit();

        return {
            idPrestito: result.insertId,
            idCopia
        };

    } catch (err) {

        await conn.rollback();
        throw err;

    } finally {
        await conn.end();
    }
}

async function ricercaPrestiti(idUtente, titolo, autore, stato) {
    const conn = await getConnection();
    try {
        let sql = `SELECT p.*, l.*
                     FROM prestiti p, copie c, libri l
                    WHERE p.id_copia = c.id_copia
                      AND c.id_libro = l.id_libro`;

        const params = [];

        //ATTENZIONE! DA MODIFICARE DATO CHE NON PUò ESSERE NULLO (?)
        if (idUtente) {
            sql += ` AND p.id_utente = ?`;
            params.push(idUtente);
        }

        if (titolo) {
            sql += ` AND l.titolo like ?`;
            params.push(`%${titolo}%`);
        }

        if (autore) {
            sql += ` AND l.autore like ?'`;
            params.push(`%${autore}%`);
        }

        if (stato) {
            sql += ` AND p.stato like ?`;
            params.push(`%${stato}%`);
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
                 where id_prestito = ?;`,
            [idPrestito]
        );

        console.log(prestito);

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

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito
}