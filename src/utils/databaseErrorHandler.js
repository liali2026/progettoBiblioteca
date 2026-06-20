function getDatabaseError(err){

    switch (err.code){
        
     case 'ECONNREFUSED':
            return {
                status: 503,
                code: err.code,
                message: 'Database non disponibile'
            };

        case 'ER_ACCESS_DENIED_ERROR':
            return {
                status: 500,
                code: err.code,
                message: 'Credenziali database errate'
            };

        case 'ER_BAD_DB_ERROR':
            return {
                status: 500,
                code: err.code,
                message: 'Database inesistente'
            };

        case 'ENOTFOUND':
            return {
                status: 500,
                code: err.code,
                message: 'Host del database non trovato'
            };

        case 'ETIMEDOUT':
            return {
                status: 504,
                code: err.code,
                message: 'Timeout durante la connessione al database'
            };

        default:
            return {
                status: 500,
                code: err.code || 'UNKNOWN_ERROR',
                message: err.message || 'Errore sconosciuto'
            };
}}

module.exports = getDatabaseError;