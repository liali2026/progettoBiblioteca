import * as Auth from './auth.js';
import * as CommonLayoutView from './ui/commonLayoutView.js';
import * as MessageView from './ui/messageView.js';

import * as PrestitiApi from './api/prestitiApi.js';
import * as PrestitiView from './ui/miei-prestitiView.js';

async function ricercaPrestiti() {
    try {

        const titolo = document.getElementById('titolo').value.toLowerCase().trim();
        const autore = document.getElementById('autore').value.toLowerCase().trim();

        //const risultati = await PrestitiApi.ricercaAllPrestiti(titolo, autore);
        const risultati = await PrestitiApi.ricercaAllPrestiti();
        console.log(risultati);

        if (!risultati || risultati.length === 0) {

            PrestitiView.resetPrestiti();
            MessageView.mostraWarning('Nessun materiale trovato con i criteri di ricerca.');

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


async function inizializzaPagina() {
    CommonLayoutView.renderNavbar('catalogo');
    CommonLayoutView.renderBreadcrumb([
        {
            label: "Home",
            href: "/"
        },
        {
            label: "Catalogo",
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
}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
