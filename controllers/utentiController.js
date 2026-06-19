// controller: gestisce request e response
const utentiService = require('../services/utentiService');

async function registrazione(req, res, next) {

    try {

        //recupero i dati dal body (registrazione con una POST)
        const { email, password, name, surname, role } = req.body;

        const utente = await utentiService.registrazione(email, password, name, surname, role);

        req.session.isAuthenticated = true;
        req.session.user = {
            id_utente: utente.id_utente,
            ruolo: utente.ruolo,
            email: utente.email
        };

        res.status(201).json(utente);

    } catch (err) {

        next(err);

    }

}

async function login(req, res, next) {

    try {
        const { email, password } = req.body;

        const utente = await utentiService.login(email, password);

        req.session.isAuthenticated = true;
        req.session.user = {
            id_utente: utente.id_utente,
            ruolo: utente.ruolo,
            email: utente.email
        };

        res.status(201).json(utente);
    } catch (err) {
        next(err);
    }

}

module.exports = {
    registrazione,
    login
};