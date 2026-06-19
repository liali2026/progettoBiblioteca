const utentiModel = require('../models/utentiModel');

const bcrypt = require('bcrypt');


async function registrazione(username, password, email) {

    const utenteEsistente =
        await utentiModel.findByUsername(
            username
        );

    if (utenteEsistente) {

        throw new Error(
            'Username già esistente'
        );

    }

    const hashedPassword = await bcrypt.hash(password,10);

    return await utentiModel.create(
        username,
        hashedPassword,
        email
    );

}

module.exports = {
    registrazione
};