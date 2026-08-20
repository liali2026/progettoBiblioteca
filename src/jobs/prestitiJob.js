const cron = require('node-cron');

const prestitiService = require('../services/prestitiService');

const config = require('../config/env');


function avviaPrestitiJob() {
    //parametri: minuti, ore, giorno del mese, mese, giorno della settimana
    //cron.schedule('* * * * *', async () => {
    cron.schedule('0 2 * * *', async () => {

        console.log('JOB PRESTITI: avvio controllo');

        try {
            await prestitiService.controllaScaduti();
            console.log('Controllo scadenze completato');
        } catch (err) {
            console.error(
                'Errore nel controllo delle scadenze:',
                err
            );
        }

        try {
            await prestitiService.controllaPrestitiInScadenza(
                config.prestiti.giorniPreavviso
            );
            console.log('Controllo notifiche completato');
        } catch (err) {
            console.error(
                'Errore nel controllo delle notifiche:',
                err
            );
        }

    });

}

module.exports = {
    avviaPrestitiJob
};