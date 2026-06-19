const utentiService =  require('../services/utentiService');

async function registrazione(req, res, next) {

    try {

        const { username, password, email } = req.body;

        const utente =
            await utentiService.registrazione(
                username,
                password,
                email
            );

        res.status(201).json(utente);

    } catch(err) {

        next(err);

    }

}

module.exports = {
    registrazione
};