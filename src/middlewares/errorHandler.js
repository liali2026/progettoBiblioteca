const getDatabaseError = require('../utils/databaseErrorHandler');

function errorHandler(err, req, res, next) {

    console.log(err);

    const dbError = getDatabaseError(err);

    if (dbError) {
        console.log("errorHandler - errore dal database");
        return res.status(dbError.status).json({
            message: dbError.message
        });
    }

    // errore di validazione
    if (err.dettagli) {
        console.log("errorHandler - errore di validazione");
        return res.status(400).json({
            message: err.message,
            dettagli: err.dettagli
        });
    }

    // errore applicativo generico
    if (err.message) {
        console.log("errorHandler - errore applicativo generico");
        return res.status(400).json({
            message: err.message
        });
    }

    //errore inatteso
    return res.status(500).json({
        message: 'Errore interno del server'
    });

}

module.exports = errorHandler;