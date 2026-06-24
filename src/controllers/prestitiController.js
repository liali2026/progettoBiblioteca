const prestitiService = require('../services/prestitiService');

async function creaPrestito(req, res, next) {
    try {

        const risultato =
            await prestitiService.creaPrestito(
                                            req.session.user.id_utente,
                                            req.body.idLibro,
                                            req.body.durataMesi
                                            );

        res.status(201).json(risultato);

    } catch (err) {
        next(err);
    }
}

module.exports = {
   creaPrestito
};