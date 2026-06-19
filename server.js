require('dotenv').config();

const validateEnv = require('./config/env.js');
validateEnv();

const express = require('express');
const session = require('express-session');


const getConnection = require('./config/db');
const utentiRoutes = require('./routes/utentiRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json()); //da verificare cosa usare effettivamente

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
})
);

app.use('/utenti', utentiRoutes); //per la registrazione sarà "POST /utenti/registrazione"

//ultimo da registrare
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('server avviato');
}
);