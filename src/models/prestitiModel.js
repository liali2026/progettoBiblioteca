const { getConnection } = require('../config/database');

async function creaPrestito(idUtente, idLibro, durataMesi) {

    const conn =
        await getConnection();

    try {

        await conn.beginTransaction();

        /*
         * Recupera una copia disponibile
         */
        const [copie] =
            await conn.query(
                `
                SELECT id_copia
                FROM copie
                WHERE id_libro = ?
                  AND disponibile = 1
                LIMIT 1
                `,
                [idLibro]
            );

        if (copie.length === 0) {

            throw new Error(
                'Nessuna copia disponibile'
            );
        }

        const idCopia =
            copie[0].id_copia;

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
                    data_fine
                )
                VALUES
                (
                    ?,
                    ?,
                    NOW(),
                    DATE_ADD(
                        NOW(),
                        INTERVAL ? MONTH
                    )
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
            SET disponibile = 0
            WHERE id_copia = ?
            `,
            [idCopia]
        );

        await conn.commit();

        return {
            idPrestito:
                result.insertId,
            idCopia
        };

    } catch (err) {

        await conn.rollback();

        throw err;

    } finally {

        await conn.end();

    }
}

module.exports(
    creaPrestito
)