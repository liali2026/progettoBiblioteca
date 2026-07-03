const getDatabaseError = require('../utils/databaseErrorHandler');

function errorHandler(err, req, res, next) {

    console.error(err);

    const dbError = getDatabaseError(err);

    if (dbError) {

        return res.status(dbError.status).json({
            message: dbError.message
        });

    }

    return res.status(500).json({
        message: 'Errore interno del server'
    });

}

module.exports = errorHandler;