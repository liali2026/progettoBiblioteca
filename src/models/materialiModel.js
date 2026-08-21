const {
    withConnection,
    withTransaction
} = require('../config/db');

async function search({
    titolo,
    autore,
    isbn,
    anno,
    idGenere,
    soloDisponibili
}) {
    const filters = [];
    const params = [];

    addLikeFilter(filters, params, 'titolo', titolo);
    addLikeFilter(filters, params, 'autore', autore);

    if (isbn) {
        filters.push('isbn = ?');
        params.push(isbn);
    }

    if (anno) {
        filters.push('anno_pubblicazione = ?');
        params.push(anno);
    }

    if (idGenere) {
        filters.push('id_genere = ?');
        params.push(idGenere);
    }

    if (soloDisponibili) {
        console.log(soloDisponibili);
        if (soloDisponibili === "1")
            filters.push('nr_copie_disponibili > 0');
        else 
            filters.push('nr_copie_disponibili = 0');
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    //console.log("where = " + where);

    return withConnection(async connection => {
        const [rows] = await connection.query(
            `SELECT *
               FROM vista_catalogo_libri
               ${where}
              ORDER BY titolo, autore`,
            params
        );
        return rows;
    });
}

async function findById(idLibro) {
    return withConnection(async connection => {
        const [rows] = await connection.query(
            `SELECT *
               FROM vista_catalogo_libri
              WHERE id_libro = ?`,
            [idLibro]
        );
        return rows[0];
    });
}

async function insertItem(materiale) {
    return withTransaction(async connection => {
        const [result] = await connection.query(
            `INSERT INTO libri (
                titolo,
                autore,
                id_genere,
                isbn,
                anno_pubblicazione,
                casa_editrice,
                descrizione,
                copertina
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                materiale.titolo,
                materiale.autore,
                materiale.idGenere,
                materiale.isbn,
                materiale.annoPubblicazione,
                materiale.casaEditrice,
                materiale.descrizione,
                materiale.copertina
            ]
        );

        await insertCopie(connection, result.insertId, materiale.nrCopie);
        return { idLibro: result.insertId };
    });
}

async function updateItem(materiale) {
    return withConnection(async connection => {
        const [result] = await connection.query(
            `UPDATE libri
                SET titolo = ?,
                    autore = ?,
                    id_genere = ?,
                    isbn = ?,
                    anno_pubblicazione = ?,
                    casa_editrice = ?,
                    descrizione = ?,
                    copertina = COALESCE(?, copertina)
              WHERE id_libro = ?
                AND attivo = 1`,
            [
                materiale.titolo,
                materiale.autore,
                materiale.idGenere,
                materiale.isbn,
                materiale.annoPubblicazione,
                materiale.casaEditrice,
                materiale.descrizione,
                materiale.copertina,
                materiale.idLibro
            ]
        );

        ensureAffected(result, 'Materiale non trovato');
        return {
            idLibro: materiale.idLibro,
            righeAggiornate: result.affectedRows
        };
    });
}

async function deleteItem(idLibro) {
    return withTransaction(async connection => {
        const [materials] = await connection.query(
            `SELECT id_libro
               FROM libri
              WHERE id_libro = ?
                AND attivo = 1
              FOR UPDATE`,
            [idLibro]
        );

        if (!materials.length) {
            throw new Error('Materiale non trovato');
        }

        const [activeLoans] = await connection.query(
            `SELECT COUNT(*) AS totale
               FROM prestiti
              WHERE id_libro = ?
                AND stato IN ('ATTIVO', 'SCADUTO')`,
            [idLibro]
        );

        if (activeLoans[0].totale > 0) {
            throw new Error(
                'Impossibile eliminare il materiale: esistono prestiti associati.'
            );
        }

        const [waitingReservations] = await connection.query(
            `SELECT COUNT(*) AS totale
               FROM prenotazioni
              WHERE id_libro = ?
                AND st_prenotazione = 'ATTESA'`,
            [idLibro]
        );

        if (waitingReservations[0].totale > 0) {
            throw new Error(
                'Impossibile eliminare il materiale: esistono prenotazioni in attesa.'
            );
        }

        await connection.query(
            `UPDATE copie
                SET attivo = 0
              WHERE id_libro = ?`,
            [idLibro]
        );

        const [result] = await connection.query(
            `UPDATE libri
                SET attivo = 0
              WHERE id_libro = ?
                AND attivo = 1`,
            [idLibro]
        );

        ensureAffected(result, 'Materiale non trovato');
        return {
            idLibro,
            righeCancellate: result.affectedRows
        };
    });
}

async function getAllGeneri() {
    return withConnection(async connection => {
        const [rows] = await connection.query(
            `SELECT *
               FROM generi
              ORDER BY descrizione`
        );
        return rows;
    });
}

async function getCopie(idLibro) {
    return withConnection(async connection => {
        const [rows] = await connection.query(
            `SELECT *
               FROM vista_copie
              WHERE id_libro = ?
              ORDER BY id_copia`,
            [idLibro]
        );
        return rows;
    });
}

async function addCopie(idLibro, nrCopie) {
    return withTransaction(async connection => {
        const [materials] = await connection.query(
            `SELECT id_libro
               FROM libri
              WHERE id_libro = ?
                AND attivo = 1
              FOR UPDATE`,
            [idLibro]
        );

        if (!materials.length) {
            throw new Error('Materiale non trovato');
        }

        await insertCopie(connection, idLibro, nrCopie);
        return {
            idLibro,
            righeInserite: nrCopie
        };
    });
}

async function findCopia(idLibro, idCopia) {
    return withConnection(async connection => {
        const [rows] = await connection.query(
            `SELECT *
               FROM vista_copie
              WHERE id_libro = ?
                AND id_copia = ?`,
            [idLibro, idCopia]
        );
        return rows[0];
    });
}

async function deleteCopia(idLibro, idCopia) {
    return withConnection(async connection => {
        const [result] = await connection.query(
            `UPDATE copie
                SET attivo = 0
              WHERE id_libro = ?
                AND id_copia = ?
                AND attivo = 1`,
            [idLibro, idCopia]
        );

        ensureAffected(result, 'Copia non trovata');
        return {
            idLibro,
            idCopia,
            righeCancellate: result.affectedRows
        };
    });
}

async function insertCopie(connection, idLibro, nrCopie) {
    const count = Number(nrCopie);
    if (!Number.isInteger(count) || count < 1) {
        throw new Error('Numero copie non valido.');
    }

    const [rows] = await connection.query(
        `SELECT COALESCE(MAX(id_copia), 0) AS maxCopia
           FROM copie
          WHERE id_libro = ?`,
        [idLibro]
    );

    const values = Array.from(
        { length: count },
        (_, index) => [rows[0].maxCopia + index + 1, idLibro, 'DISPONIBILE']
    );

    await connection.query(
        `INSERT INTO copie (id_copia, id_libro, stato) VALUES ?`,
        [values]
    );
}

function addLikeFilter(filters, params, column, value) {
    if (value) {
        filters.push(`${column} LIKE ?`);
        params.push(`%${value}%`);
    }
}

function ensureAffected(result, message) {
    if (!result.affectedRows) {
        throw new Error(message);
    }
}

module.exports = {
    search,
    findById,
    insertItem,
    updateItem,
    deleteItem,
    getAllGeneri,
    getCopie,
    addCopie,
    findCopia,
    deleteCopia
};
