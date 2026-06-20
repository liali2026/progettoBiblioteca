// controller: gestisce request e response
const utentiService = require('../services/utentiService');

async function registrazione(req, res, next) {

    try {

        //recupero i dati dal body (registrazione con una POST)
        const { email, password, nome, cognome } = req.body;

        const utente = await utentiService.registrazione(email, password, nome, cognome);

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

async function me(req, res, next) {

    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                errore: 'Utente non autenticato'
            });
        }

        res.json(req.session.user);

    } catch(err) {
        next(err);
    }
}

function logout(req, res, next) {

    req.session.destroy(
        (err) => {
            if (err) {
                return next(err);
            }

            res.json({messaggio:'Logout effettuato'});
        }
    );
}

module.exports = {
    registrazione,
    login,
    me,
    logout
};
