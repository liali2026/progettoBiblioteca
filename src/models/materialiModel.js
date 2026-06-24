const getConnection = require('../config/db');

async function search(titolo, autore) {
    const conn = await getConnection();
    try {

        let sql = `
            SELECT l.*, COUNT(c.id_copia) AS copie_disponibili
            FROM libri l
            LEFT JOIN copie c ON l.id_libro = c.id_libro
            WHERE 1=1
        `;

        const params = [];

        if (titolo) {
            sql += ` AND l.titolo LIKE ?`;
            params.push(`%${titolo}%`);
        }

        if (autore) {
            sql += ` AND l.autore LIKE ?`;
            params.push(`%${autore}%`);
        }

        sql += ` GROUP BY l.id_libro`;

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
            WHERE 1=1
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

module.exports = {
    search,
    findById
}