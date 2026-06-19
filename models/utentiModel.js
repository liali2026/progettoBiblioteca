// gestione dei dati su database
const getConnection = require('../config/db');

async function findByUsername(email) {
    const conn = await getConnection();
    try {
        const [utenti] =
            await conn.query(
                'SELECT * FROM utenti WHERE email = ?', [email]
            );

        return utenti[0];

    } finally {
        await conn.end();
    }
}

async function create( email, password, name, surname, role) 
{
    const conn = await getConnection();

    try {
        const [result] =
            await conn.query(
                `
                INSERT INTO utenti
                (
                    email,
                    password_hash,
                    nome,
                    cognome,
                    ruolo
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    email,
                    password,
                    name,
                    surname,
                    role
                ]
            );

        return {
            id_utente: result.insertId,
            email: email,
            ruolo: role
        };
        

    } finally {
        await conn.end();
    }

}

module.exports = {
    findByUsername,
    create
};