const prestitiService = require('../services/prestitiService');

async function creaPrestito(req, res, next) {
    try {

        const risultato =
            await prestitiService.creaPrestito
                (req.session.user.id_utente,
                    req.body.idLibro,
                    req.body.durataMesi
                );

        //res.status(201).json(risultato);

        res.status(201).json({
            idPrestito: risultato.idPrestito,
            messaggio: 'Prestito registrato correttamente'
        });

    } catch (err) {
        next(err);
    }
}

async function ricercaPrestiti(req, res, next) {
    try {

        const { titolo, autore, stato } = req.body;
        //DA VERIFICARE
        // nel caso sia l'utente proprietario dei servizi allora deve essere nella sessione
        // se sono il bibliotecario potrei voler cercare i prestiti di un certo utente
        const idUtente = req.session.user.id_utente;
        const prestiti = await prestitiService.ricercaPrestiti
                                (idUtente,
                                    titolo,
                                    autore, stato
                                );
        res.json(prestiti);

    } catch (err) {
        next(err);
    }
}

async function restituisciPrestito(req, res, next) {
    try {

        const { idPrestito } = req.body;

        const risultato = await prestitiService.restituisciPrestito(idPrestito);
                            
        res.json(risultato);

    } catch (err) {
        next(err);
    }
}

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito
};