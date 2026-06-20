// controllo della presenza di tutti i parametri di configurazione corretti per il sistema
function validateEnv() {

    const requiredEnv = [
        'DB_HOST',
        'DB_PORT',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME',
        'SESSION_SECRET'
    ];

    for (const variable of requiredEnv) {
        if (!process.env[variable]) {
            throw new Error(
                `Variabile d'ambiente mancante: ${variable}`
            );
        }
    }
}

module.exports = validateEnv;