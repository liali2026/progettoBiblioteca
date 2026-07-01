import * as Auth from './auth.js';
import * as CommonLayoutView from './ui/commonLayoutView.js';
import * as MessageView from './ui/messageView.js';

import * as PrestitiApi from './api/prestitiApi.js';
import * as PrestitiView from './ui/miei-prestitiView.js';

async function ricercaPrestiti() {
    try {

        const titolo = document.getElementById('titolo').value.toLowerCase().trim();
        const autore = document.getElementById('autore').value.toLowerCase().trim();
        const stato = document.getElementById('stato').value;

        const risultati = await PrestitiApi.ricercaPrestiti(titolo, autore, stato);

        console.log(risultati);

        if (!risultati || risultati.length === 0) {
            PrestitiView.resetPrestiti();
            MessageView.mostraWarning('Nessun dato trovato con i criteri di ricerca.');
        } else {
            PrestitiView.renderPrestiti(risultati);
        }

    } catch (err) {

        console.log(err.message);
        MessageView.mostraErrore(err.message);

    }
}

function resetRicerca() {
    PrestitiView.resetRicerca();
    MessageView.nascondiMessaggio();
}

async function restituisciPrestito(idPrestito) {
    try {

        const risultato = await PrestitiApi.restituisciPrestito(idPrestito);

        await ricercaPrestiti();
        //MessageView.mostraSuccesso("Operazione di restituzione eseguita con successo");
        MessageView.mostraSuccesso(
            `Prestito n. <strong>${risultato.idPrestito}</strong>: ${risultato.messaggio}`
        );

    } catch (err) {
        console.error(err);
        MessageView.mostraErrore(err.message);
    }
}



async function inizializzaPagina() {
    CommonLayoutView.renderNavbar('miei-prestiti');
    CommonLayoutView.renderBreadcrumb([
        {
            label: "Home",
            href: "/"
        },
        {
            label: "Area Personale",
            href: "/pages/area-personale.html"
        },
        {
            label: "Prestiti",
            active: true
        }
    ]);

    await Auth.initPage();

    document
        .getElementById('btnRicerca')
        .addEventListener('click', ricercaPrestiti);
    document
        .getElementById('btnPulisci')
        .addEventListener('click', resetRicerca);

    document
        .getElementById('tabellaPrestiti')
        .addEventListener(
            'click',
            async (e) => {
                if (!e.target.classList.contains('btnRestituisci')) {
                    return;
                }
                const idPrestito =
                    e.target.dataset.idPrestito;
                await restituisciPrestito(idPrestito);
            }
        );
}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
