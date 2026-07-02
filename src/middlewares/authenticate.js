const authenticate = (req, res, next) => {

    //if (!req.session.isAuthenticated) {
    if (!req.session?.user) {

        return res.status(401).json({
            errore: 'Utente non autenticato'
        });

    }

    next();
};

module.exports = authenticate;