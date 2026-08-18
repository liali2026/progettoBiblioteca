// gestione dei dati su database
const { withConnection } = require('../config/db');

async function findByUsername(email) {
    return withConnection(async connection => {
        const [utenti] =
            await connection.query(
                'SELECT * FROM utenti WHERE email = ?', [email]
            );

        return utenti[0];
    });
}

async function create( email, password, name, surname) 
{
    const role = "UTENTE";

    return withConnection(async connection => {
        const [result] =
            await connection.query(
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
        

    });

}

module.exports = {
    findByUsername,
    create
};
