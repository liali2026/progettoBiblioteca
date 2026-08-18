const utentiService = require('../services/utentiService');

async function registrazione(req, res) {
    const {
        email,
        password,
        nome,
        cognome
    } = req.body;

    const utente = await utentiService.registrazione(
        email,
        password,
        nome,
        cognome
    );

    await regenerateSession(req);
    req.session.user = sessionUser(utente);
    res.status(201).json(req.session.user);
}

async function login(req, res) {
    const utente = await utentiService.login(
        req.body.email,
        req.body.password
    );

    await regenerateSession(req);

    req.session.user = sessionUser(utente);
    res.json(req.session.user);
}

function regenerateSession(req) {
    return new Promise((resolve, reject) => {
        req.session.regenerate(error =>
            error ? reject(error) : resolve()
        );
    });
}

function me(req, res) {
    if (!req.session?.user) {
        return res.status(401).json({
            message: 'Utente non autenticato'
        });
    }
    res.json(req.session.user);
}

function logout(req, res, next) {
    req.session.destroy(error => {
        if (error) {
            return next(error);
        }
        res.clearCookie('connect.sid');
        res.json({ messaggio: 'Logout effettuato' });
    });
}

function sessionUser(user) {
    return {
        id_utente: user.id_utente,
        ruolo: user.ruolo,
        email: user.email
    };
}

module.exports = {
    registrazione,
    login,
    me,
    logout
};
