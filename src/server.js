require('dotenv').config();

const validateEnv = require('./config/env.js');
validateEnv();

const express = require('express');
const session = require('express-session');

const getConnection = require('./config/db.js');
const utentiRoutes = require('./routes/utentiRoutes.js');
const materialiRoutes = require('./routes/materialiRoutes.js');
const prestitiRoutes = require('./routes/prestitiRoutes.js');
const errorHandler = require('./middlewares/errorHandler.js');

const app = express();

app.use(express.json()); 
app.use(express.static('public'));// per la parte di front-end

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
})
);

app.use('/utenti', utentiRoutes); 
app.use('/materiali', materialiRoutes); 
app.use('/prestiti', prestitiRoutes); 

//ultimo da registrare
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('server avviato');
}
);