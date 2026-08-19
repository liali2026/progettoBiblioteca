const path = require("path");

// controllo della presenza di tutti i parametri di configurazione corretti
const requiredEnv = [
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "SESSION_SECRET",
    "UPLOAD_DIR",
    "SERVER_PORT",
    "PRESTITO_GIORNI_PREAVVISO"
];

for (const variable of requiredEnv) {
    if (!process.env[variable]) {
        throw new Error(
            `Variabile d'ambiente mancante: ${variable}`
        );
    }
}

module.exports = {
    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8mb4'
    },

    server: {
        port: Number(process.env.SERVER_PORT)
    },

    session: {
        secret: process.env.SESSION_SECRET
    },

    upload: {
        dir: path.resolve(
            process.cwd(),
            process.env.UPLOAD_DIR
        )
    },

    prestiti: {
        giorniPreavviso: Number(process.env.PRESTITO_GIORNI_PREAVVISO || 7)
    },
    
    mail: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAIL_SECURE === 'true',
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD
    }
};
