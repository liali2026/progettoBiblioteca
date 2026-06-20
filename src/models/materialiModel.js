const getConnection = require('../config/db');

async function findAll() {
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
}

/*findById()
create()
update()
remove()*/

module.exports = {
    findAll
}