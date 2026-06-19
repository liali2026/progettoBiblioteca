const authorize = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.session.role)) {

            return res.status(403).json({
                errore: 'Permessi insufficienti'
            });

        }

        next();

    };

};

module.exports = authorize;