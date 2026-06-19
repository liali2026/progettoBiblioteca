const getDatabaseError = require('../utils/databaseErrorHandler');

function errorHandler(err, req, res, next) {

    console.error(err);

    const dbError = getDatabaseError(err);

    if (dbError) {

        return res.status(dbError.status).json({
            errore: dbError.message
        });

    }

    return res.status(500).json({
        errore: 'Errore interno del server'
    });

}

module.exports = errorHandler;