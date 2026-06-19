const authenticate = (req, res, next) => {

    if (!req.session.isAuthenticated) {

        return res.status(401).json({
            errore: 'Utente non autenticato'
        });

    }

    next();
};

module.exports = authenticate;