require('dotenv').config();
const path = require('path');

const config = require("./src/config/env");

const express = require('express');
const session = require('express-session');

const getConnection = require('./src/config/db.js');
const utentiRoutes = require('./src/routes/utentiRoutes.js');
const materialiRoutes = require('./src/routes/materialiRoutes.js');
const prestitiRoutes = require('./src/routes/prestitiRoutes.js');
const errorHandler = require('./src/middlewares/errorHandler.js');

const app = express();

app.use(express.json());
app.use(express.static('public'));// per la parte di front-end
app.use("/covers", express.static(path.join(__dirname, "uploads", "covers")));

app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false
})
);

app.use('/utenti', utentiRoutes);
app.use('/materiali', materialiRoutes);
app.use('/prestiti', prestitiRoutes);

//ultimo da registrare
app.use(errorHandler);

app.listen(config.server.port, () => {
    console.log('server avviato');
}


);