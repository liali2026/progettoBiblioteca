// gestione della logica applicativa
const utentiModel = require('../models/utentiModel');
const bcrypt = require('bcrypt');


async function registrazione(email, password, name, surname, role) {
    if (!email || !password || !name || !surname) {
        throw new Error('Tutti i campi sono obbligatori');
    }

    if (String(password).length < 8) {
        throw new Error('La password deve contenere almeno 8 caratteri');
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const utenteEsistente = await utentiModel.findByUsername(normalizedEmail);
    if (utenteEsistente) {
        throw new Error(
            'Utente già esistente: usa la funzione di Login!'
        );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    return utentiModel.create(
        normalizedEmail,
        hashedPassword,
        String(name).trim(),
        String(surname).trim()
    );

}

async function login(email, password) {

    if (!email || !password) {
        throw new Error('Email e password sono obbligatorie');
    }

    const utenteEsistente = await utentiModel.findByUsername(
        String(email).trim().toLowerCase()
    );
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
