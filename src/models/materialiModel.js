const getConnection = require('../config/db');

/*async function findAll() {
    const conn = await getConnection();
    try {

        const [libri] = await conn.query(
            `SELECT l.*, count(c.id_copia) as copie_disponibili
             FROM libri l LEFT JOIN  copie c
             on l.id_libro = c.id_libro
            group by l.id_libro `)
        return libri;

    } finally {
        await conn.end();
    }
}*/

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

/*findById()
create()
update()
remove()*/

module.exports = {
    search
}