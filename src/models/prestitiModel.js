const getConnection = require('../config/db');

async function creaPrestito(idUtente, idLibro, durataMesi) {

    const conn = await getConnection();

    try {
        await conn.beginTransaction();

        /*
         * Recupera una copia disponibile
         */
        /*const [copie] =
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
            copie[0].id_copia;*/
 
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
                    data_fine
                )
                VALUES
                (
                    ?,
                    ?,
                    NOW(),
                    DATE_ADD(NOW(), INTERVAL ? MONTH)
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

        return {idPrestito: result.insertId,
                idCopia};

    } catch (err) {

        await conn.rollback();
        throw err;

    } finally {
        await conn.end();
    }
}

async function ricercaAllPrestiti(idUtente){
    const conn = await getConnection();
    try {
        let sql = `SELECT p.*, l.*
                     FROM prestiti p, copie c, libri l
                    WHERE p.id_copia = c.id_copia
                      AND c.id_libro = l.id_libro`;
    
        const params = [];

        //ATTENZIONE! DA MODIFICARE DATO CHE NON PUò ESSERE NULLO (?)
        if (idUtente) {
            sql += ` AND id_utente = ?`;
            params.push(idUtente);
        }


        const [prestiti] = await conn.query(sql, params);
            /*await conn.query(
                'SELECT * FROM prestiti WHERE id_utente = ?', [idUtente]
            );*/

        //console.log(prestiti);
        return prestiti;

    } finally {
        await conn.end();
    }
}

module.exports = {
    creaPrestito,
    ricercaAllPrestiti
}