// gestione della logica applicativa
const utentiModel = require('../models/utentiModel');
const bcrypt = require('bcrypt');

function validaPassword(password) {

    const valore = String(password);

    if (valore.length < 8) {
        throw new Error(
            'La password deve contenere almeno 8 caratteri.'
        );
    }

    if (!/[A-Z]/.test(valore)) {
        throw new Error(
            'La password deve contenere almeno una lettera maiuscola.'
        );
    }

    if (!/[a-z]/.test(valore)) {
        throw new Error(
            'La password deve contenere almeno una lettera minuscola.'
        );
    }

    if (!/[0-9]/.test(valore)) {
        throw new Error(
            'La password deve contenere almeno un numero.'
        );
    }

    if (!/[^A-Za-z0-9]/.test(valore)) {
        throw new Error(
            'La password deve contenere almeno un carattere speciale.'
        );
    }
}

async function registrazione(email, password, name, surname, role) {
    if (!email || !password || !name || !surname) {
        throw new Error('Tutti i campi sono obbligatori');
    }
    
    const normalizedEmail = String(email).trim().toLowerCase();
    const utenteEsistente = await utentiModel.findByUsername(normalizedEmail);
    if (utenteEsistente) {
        throw new Error(
            'Utente già esistente: usa la funzione di Login!'
        );
    }

    validaPassword(password);
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
