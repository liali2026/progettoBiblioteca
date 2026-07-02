const authorize = (...roles) => {

    return (req, res, next) => {

        if (!req.session?.user) {
            return res.status(401).json({
                errore: 'Utente non autenticato'
            });
        }

        if (!roles.includes(req.session.user.ruolo)) {
            return res.status(403).json({
                errore: 'Permessi insufficienti'
            });
        }

        next();

    };

};

module.exports = authorize;