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
            console.log('Controllo prestiti scaduti completato');
        } catch (err) {
            console.error(
                'Errore nel controllo prestiti scaduti:',
                err
            );
        }

        try {
            await prestitiService.controllaPrestitiDaNotificare(
                'SCADENZA_PRESTITO', config.prestiti.giorniPreavviso
            );
            console.log('Controllo notifiche scadenze completato');
        } catch (err) {
            console.error(
                'Errore nel controllo delle notifiche scadenze:',
                err
            );
        }

        try {
            await prestitiService.controllaPrestitiDaNotificare(
                'PRENOTAZIONE_EVASA', null);
            console.log('Controllo notifiche prenotazioni evase completato');
        } catch (err) {
            console.error(
                'Errore nel controllo delle notifiche prenotazioni evase:',
                err
            );
        }

    });

}

module.exports = {
    avviaPrestitiJob
};