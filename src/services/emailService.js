const nodemailer = require('nodemailer');

const config = require('../config/env');

const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    auth: {
        user: config.mail.user,
        pass: config.mail.password
    }
});

async function inviaEmail({
    destinatario,
    oggetto,
    testo
}) {

    await transporter.sendMail({
        from: config.mail.user,
        to: destinatario,
        subject: oggetto,
        text: testo
    });
}



module.exports = {
    inviaEmail
};