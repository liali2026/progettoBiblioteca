function errorHandler(err, req, res, next) {
    const dbError = getDatabaseError(err);
    if (dbError) {
        return res.status(dbError.status).json({
            message: dbError.message
        });
    }

    if (err.dettagli) {
        return res.status(400).json({
            message: err.message,
            dettagli: err.dettagli
        });
    }

    const status = err.status || (err.code ? 500 : 400);

    if (status >= 500) {
        console.error(err);
    }

    return res.status(status).json({
        message: status >= 500
            ? 'Errore interno del server'
            : err.message
    });
}

function getDatabaseError(err) {
    const errors = {
        ER_DUP_ENTRY: [409, 'Dato già presente'],
        ECONNREFUSED: [503, 'Database non disponibile'],
        ER_ACCESS_DENIED_ERROR: [500, 'Credenziali database errate'],
        ER_BAD_DB_ERROR: [500, 'Database inesistente'],
        ENOTFOUND: [500, 'Host del database non trovato'],
        ETIMEDOUT: [504, 'Timeout durante la connessione al database']
    };

    const match = errors[err.code];
    return match
        ? { status: match[0], message: match[1] }
        : null;
}

module.exports = errorHandler;
