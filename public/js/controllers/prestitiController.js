import * as Auth from '../services/authService.js';
import * as CommonLayoutView from '../components/commonLayout.js';
import * as MessageView from '../components/message.js';

import * as PrestitiApi from '../api/prestitiApi.js';
import * as PrestitiView from '../views/prestitiView.js';

let CONTEXT = {
    role: null,
    isAdmin: false,
    stati: null
};

function inizializzaContext(user) {

    CONTEXT.role = user?.ruolo || 'UTENTE';
    CONTEXT.isAdmin = CONTEXT.role === 'BIBLIOTECARIO';
}

async function ricercaPrestiti() {
    try {

        const titolo = document.getElementById('titolo').value.toLowerCase().trim();
        const autore = document.getElementById('autore').value.toLowerCase().trim();
        const stato = document.getElementById('stato').value;
        const tipo = document.getElementById('tipo').value;
        
        //gestione del bibliotecario
        const utente = CONTEXT.isAdmin
            ? document.getElementById('utente')?.value?.trim()
            : null;

        const risultati = await PrestitiApi.ricercaPrestiti(titolo, autore, stato, utente, tipo);

        console.log(risultati);

        if (!risultati || risultati.length === 0) {
            PrestitiView.resetPrestiti();
            MessageView.mostraWarning('Nessun dato trovato con i criteri di ricerca.');
        } else {
            PrestitiView.renderPrestiti(risultati, CONTEXT);
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


function registraEventi() {

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
                const idPrestito = e.target.dataset.idPrestito;
                await restituisciPrestito(idPrestito);
            }
        );

    document
    .getElementById("tipo")
    .addEventListener("change", e => {

        PrestitiView.popolaStati(
            CONTEXT,
            e.target.value
        );

    });
}

async function inizializzaPagina() {

    CommonLayoutView.renderNavbar('prestiti');
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

    //true =richiede il login
    const user = await Auth.initPage(true); 

    await inizializzaContext(user);
    CONTEXT.stati = await PrestitiApi.getStati();

    PrestitiView.configuraPagina(CONTEXT);

    registraEventi();

}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
