// gestione della logica applicativa
const utentiModel = require('../models/utentiModel');
const bcrypt = require('bcrypt');


async function registrazione(email, password, name, surname, role) {

    const utenteEsistente = await utentiModel.findByUsername(email);
    if (utenteEsistente) {
        throw new Error(
            'Utente già esistente: usa la funzione di Login!'
        );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    return await utentiModel.create(email, hashedPassword, name, surname, role);

}

async function login(email, password) {

    const utenteEsistente = await utentiModel.findByUsername(email);
    if (!utenteEsistente) {
        throw new Error(
            'Utente non riconosciuto'
        );
    }

    const passwordValida = await bcrypt.compare(password, utenteEsistente.password_hash);
    if (!passwordValida) {
        throw new Error(
            'Password non valida'
        );
    }

    return utenteEsistente;
}

module.exports = {
    registrazione,
    login
};