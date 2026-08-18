function authenticate(req, res, next) {
    if (!req.session?.user) {
        return res.status(401).json({
            message: 'Utente non autenticato'
        });
    }

    next();
}

function authorize(...roles) {
    return (req, res, next) => {
        if (!req.session?.user) {
            return res.status(401).json({
                message: 'Utente non autenticato'
            });
        }

        if (!roles.includes(req.session.user.ruolo)) {
            return res.status(403).json({
                message: 'Permessi insufficienti'
            });
        }

        next();
    };
}

module.exports = {
    authenticate,
    authorize
};
