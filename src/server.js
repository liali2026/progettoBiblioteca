require('dotenv').config();

const validateEnv = require('./config/env.js');
validateEnv();

const express = require('express');
const session = require('express-session');

const getConnection = require('./config/db');
const utentiRoutes = require('./routes/utentiRoutes');
const materialiRoutes = require('./routes/materialiRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json()); //da verificare cosa usare effettivamente
app.use(express.static('public'));// per la parte di front-end

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
})
);

app.use('/utenti', utentiRoutes); 
app.use('/materiali', materialiRoutes); 

//ultimo da registrare
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('server avviato');
}
);