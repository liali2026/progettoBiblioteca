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
            id: risultato.id
        });

    } catch (err) {
        next(err);
    }
}

async function ricercaPrestiti(req, res, next) {
    try {

        const { titolo, autore, stato, idUtente, tipo } = req.body;

        //occorre gestire il bibliotecario
        //const idUtente = req.session.user.id_utente; 

        const isBibliotecario = req.session.user.ruolo === 'BIBLIOTECARIO';
        let utenteFiltro = null;

        if (isBibliotecario) {
            // il bibliotecario può filtrare per utente
            utenteFiltro = idUtente || null;
        } else {
            // utente normale può vedere solo i suoi prestiti
            utenteFiltro = req.session.user.id_utente;
        }

        
        const prestiti = await prestitiService.ricercaPrestiti
                                (//idUtente,
                                 utenteFiltro,
                                 titolo,
                                 autore, 
                                 stato,
                                 tipo
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

async function getStati(req, res, next) {

    try {

        const stati =
            await prestitiService.getStati();

        res.json(stati);

    } catch (err) {
        next(err);
    }
}

module.exports = {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito,
    getStati
};