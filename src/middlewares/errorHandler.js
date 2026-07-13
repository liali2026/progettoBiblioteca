const getDatabaseError = require('../utils/databaseErrorHandler');

function errorHandler(err, req, res, next) {

    console.error("errorHandler err " + err);
    console.log("errorHandler err.dettagli =", err.dettagli);

    const dbError = getDatabaseError(err);

    if (dbError) {
        console.log("errorHandler - dbError");
        return res.status(dbError.status).json({
            message: dbError.message
        });
    }

    // errore di validazione
    if (err.dettagli) {
        console.log("errorHandler - err.dettagli");
        return res.status(400).json({
            message: err.message,
            dettagli: err.dettagli
        });
    }

    // errore applicativo generico
    if (err.message) {
        console.log("errorHandler - err.message");
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