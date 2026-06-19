const getConnection = require('../config/db');

async function findByUsername(username) {

    const conn = await getConnection();

    try {

        const [utenti] =
            await conn.query(
                'SELECT * FROM utenti WHERE email = ?', [username]
            );

        return utenti[0];

    } finally {
        await conn.end();
    }

}

async function create(
    username,
    password,
    email
) {

    const conn =
        await getConnection();

    try {

        const [result] =
            await conn.query(
                `
                INSERT INTO utenti
                (
                    username,
                    password,
                    email
                )
                VALUES (?, ?, ?)
                `,
                [
                    username,
                    password,
                    email
                ]
            );

        return {
            id: result.insertId,
            username,
            email
        };

    } finally {

        await conn.end();

    }

}

module.exports = {
    findByUsername,
    create
};