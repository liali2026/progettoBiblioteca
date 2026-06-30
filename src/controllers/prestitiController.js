const prestitiService = require('../services/prestitiService');

async function creaPrestito(req, res, next) {
    try {

        const risultato =
            await prestitiService.creaPrestito(req.session.user.id_utente, req.body.idLibro, req.body.durataMesi);

        //res.status(201).json(risultato);

        res.status(201).json({
            idPrestito: risultato.idPrestito,
            messaggio: 'Prestito registrato correttamente'
        });

    } catch (err) {
        next(err);
    }
}

async function ricercaAllPrestiti(req, res, next) {
    try {
        //DA VERIFICARE
        // nel caso sia l'utente proprietario dei servizi allora deve essere nella sessione
        // se sono il bibliotecario potrei voler cercare i prestiti di un certo utente
        const idUtente =  req.session.user?.id_utente ?? req.query.idUtente;

        const prestiti = await prestitiService.ricercaAllPrestiti(idUtente);
        res.json(prestiti);

    } catch (err) {
        next(err);
    }
}

module.exports = {
    creaPrestito,
    ricercaAllPrestiti
};