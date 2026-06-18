const express = require('express');

const db = require('./config/db');

const app = express();

app.get('/utenti', async(req, res)=> {
    try {
        const conn = await db;
        const [utenti] = await conn.query('select * from utenti');
        res.json(utenti);
    } catch(err) {
        res.status(500).json({errore: err.message});
    }

});

app.listen(3000, () =>{
    console.log('server avviato');
}
);