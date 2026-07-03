const getConnection = require('../config/db');

async function search(titolo, autore) {
    const conn = await getConnection();
    try {

        /*let sql = `
            SELECT l.*, COUNT(c.id_copia) AS copie_disponibili
            FROM libri l
            LEFT JOIN copie c 
            ON l.id_libro = c.id_libro
            AND c.stato = 'DISPONIBILE'
            WHERE l.attivo = 1
        `;*/

        let sql = `
                  SELECT *
                    FROM vista_catalogo_libri
                   WHERE 1=1
                `

        const params = [];

        if (titolo) {
            sql += ` AND titolo LIKE ?`;
            params.push(`%${titolo}%`);
        }

        if (autore) {
            sql += ` AND autore LIKE ?`;
            params.push(`%${autore}%`);
        }

        //sql += ` GROUP BY l.id_libro`;

        const [materiali] = await conn.query(sql, params);

        return materiali;

    } finally {
        await conn.end();
    }
}


async function findById(id) {
    const conn = await getConnection();
    try {

        let sql = `
            SELECT l.*, COUNT(c.id_copia) AS copie_disponibili
            FROM libri l
            LEFT JOIN copie c ON l.id_libro = c.id_libro
            WHERE l.attivo = 1
        `;

        const params = [];

        if (id) {
            sql += ` AND l.id_libro = ?`;
            params.push(`${id}`);
        }

        sql += ` GROUP BY l.id_libro`;

        const [materiali] = await conn.query(sql, params);

        return materiali[0];

    } finally {
        await conn.end();
    }
}


async function insertItem(materiale) {

    const conn = await getConnection();
    try {

        const [result] =
            await conn.query(
                `
                INSERT INTO libri( 
                    titolo,
                    autore,
                    genere,
                    isbn,
                    anno_pubblicazione,
                    casa_editrice,
                    descrizione)
                VALUES (?, ?, ?, ?, ?, ?,?)
                `,
                [
                    materiale.titolo,
                    materiale.autore,
                    materiale.genere,
                    materiale.isbn,
                    materiale.annoPubblicazione,
                    materiale.casaEditrice,
                    materiale.descrizione
                ]
            );

        return {
            idLibro: result.insertId
        };

    } finally {
        await conn.end();
    }
}

async function updateItem(materiale) {

    const conn = await getConnection();
    try {

        const [result] =
            await conn.query(
                `
                UPDATE libri
                SET titolo = ?,
                    autore = ?,
                    genere = ?,
                    isbn = ?,
                    anno_pubblicazione = ?,
                    casa_editrice = ?,
                    descrizione = ?
                WHERE id_libro = ?
                  AND attivo = 1
                `,
                [
                    materiale.titolo,
                    materiale.autore,
                    materiale.genere,
                    materiale.isbn,
                    materiale.annoPubblicazione,
                    materiale.casaEditrice,
                    materiale.descrizione,
                    materiale.idLibro
                ]
            );

        if (result.affectedRows === 0) {
            throw new Error("Materiale non trovato");
        }

        return {
            idLibro: materiale.idLibro,
            righeAggiornate: result.affectedRows
        };

    } finally {
        await conn.end();
    }
}

async function deleteItem(idMateriale) {
    const conn = await getConnection();
    console.log("idMateriale " + idMateriale);
    try {
        await conn.beginTransaction();

        const [materiale] = await conn.query(
            `
            SELECT id_libro
            FROM libri
            WHERE id_libro = ?
              AND attivo = 1
            `,
            [idMateriale]
        );

        if (materiale.length === 0) {
            throw new Error("Materiale non trovato");
        }

        // controllo della presenza di copie in prestito
        const [prestiti] = await conn.query(
            `
                        SELECT COUNT(*) AS totale
                        FROM prestiti p
                        JOIN copie c ON p.id_copia = c.id_copia
                        WHERE c.id_libro = ?
                          AND p.stato in ('ATTIVO','SCADUTO')
                        `, [idMateriale]
        );

        if (prestiti[0].totale > 0) {
            throw new Error(
                "Impossibile eliminare il materiale: esistono prestiti associati."
            );
        }

        //cancellazione delle copie associate al libro
        /*await conn.query(
            `
                DELETE FROM copie
                WHERE id_libro = ?
                `,
            [idMateriale]
        );

        const [result] =
            await conn.query(
                `
                DELETE FROM libri
                WHERE id_libro = ?
                `,
                [idMateriale]
            );*/


        //cancellazione logica, per mantenere anche i dati di storico
        const [result] =
            await conn.query(
                `
                UPDATE libri
                   SET attivo = 0
                WHERE id_libro = ?
                `,
                [idMateriale]
            );


        if (result.affectedRows === 0) {
            throw new Error("Materiale non trovato");
        }

        await conn.commit();

        return {
            idLibro: idMateriale,
            righeCancellate: result.affectedRows
        };

    } catch (err) {

        await conn.rollback();
        throw err;

    } finally {
        await conn.end();
    }
}

module.exports = {
    search,
    findById,
    insertItem,
    updateItem,
    deleteItem
}