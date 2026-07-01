import * as Auth from './auth.js';
import * as MaterialiApi from './api/materialiApi.js';
import * as MaterialiView from './ui/materialeView.js';
import * as CommonLayoutView from './ui/commonLayoutView.js';
import * as MessageView from './ui/messageView.js';

async function ricercaMateriali() {
    try {

        const titolo = document.getElementById('titolo').value.toLowerCase().trim();
        const autore = document.getElementById('autore').value.toLowerCase().trim();

        const risultati = await MaterialiApi.ricercabyAutoreTitolo(titolo, autore);

        if (!risultati || risultati.length === 0) {

            MaterialiView.resetCatalogo();
            MessageView.mostraWarning('Nessun materiale trovato con i criteri di ricerca.');

        } else {

            MaterialiView.renderCatalogo(risultati);
        }

    } catch (err) {

        console.log(err.message);
        MessageView.mostraErrore(err.message);

    }
}

function resetRicerca() {
    MaterialiView.resetRicerca();
    MessageView.nascondiMessaggio();
}


async function inizializzaPagina() {
    
    CommonLayoutView.renderNavbar('catalogo');
    // posso arrivarci direttamente dalla home (index.html)
    // oppure da area-personale.html
    const from = new URLSearchParams(window.location.search).get('from');
    if (from === 'area-personale') {
        CommonLayoutView.renderBreadcrumb([
            {
                label: "Home",
                href: "/"
            },
            {
                label: "Area personale",
                href: "/pages/area-personale.html"
            },
            {
                label: "Catalogo",
                active: true
            }
        ]);
    } else {
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
    }

    await Auth.initPage();

    document
        .getElementById('btnRicerca')
        .addEventListener('click', ricercaMateriali);
    document
        .getElementById('btnPulisci')
        .addEventListener('click', resetRicerca);
}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
