const express = require('express');

const getConnection = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.get('/utenti', async (req, res, next) => {
    let conn;
    try {

        conn = await getConnection();
        const [utenti] = await conn.query('select * from utenti');
        res.json(utenti);

    } catch (err) {
        //res.status(500).json({ errore: err.message });
        /*const error = getDatabaseError(err);

        res.status(error.status).json({
            errore: error.message
        });*/
        next(err);
    } finally {
        if (conn) {
            await conn.end();
        }
    }
});

//ultimo da registrare
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('server avviato');
}
);