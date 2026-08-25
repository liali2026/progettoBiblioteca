const prestitiService = require('../services/prestitiService');

async function creaPrestito(req, res) {
    const risultato = await prestitiService.creaPrestito(
        req.session.user.id_utente,
        req.body.idLibro,
        req.body.durataMesi
    );
    res.status(201).json(risultato);
}

async function ricercaPrestiti(req, res) {
    const isBibliotecario =
        req.session.user.ruolo === 'BIBLIOTECARIO';

    const filters = {
        ...req.body,
        idUtente: isBibliotecario
            ? null
            : req.session.user.id_utente,
        utente: isBibliotecario
            ? req.body.utente
            : null
    };

    res.json(await prestitiService.ricercaPrestiti(filters));
}

async function restituisciPrestito(req, res) {
    res.json(
        await prestitiService.restituisciPrestito(
            req.body.idPrestito,
            req.session.user
        )
    );
}

async function annullaPrenotazione(req, res) {
    res.json(
        await prestitiService.annullaPrenotazione(
            req.body.idPrenotazione,
            req.session.user
        )
    );
}

async function getStati(req, res) {
    res.json(await prestitiService.getStati());
}

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito,
    annullaPrenotazione,
    getStati
};
