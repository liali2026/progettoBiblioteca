import * as Auth from './auth.js';
import * as MaterialiApi from './api/materialiApi.js';
import * as PrestitiApi from './api/prestitiApi.js';
import * as ModalPrestito from './ui/prestitoModalView.js';
import * as View from './ui/materialeView.js';
import * as CommonLayoutView from './ui/commonLayoutView.js';
import * as MessageView from './ui/messageView.js';

let materiale = null;

async function caricaMateriale() {
    try {

        MessageView.nascondiMessaggio();

        const params = new URLSearchParams(window.location.search);
        const idMateriale = params.get('id');

        if (!idMateriale) {
            MessageView.mostraErrore('Identificativo materiale non valido.');
            return;
        }

        materiale = await MaterialiApi.ricercaById(idMateriale);

        View.mostraDettaglioMateriale(materiale);

    } catch (err) {
        console.error(err);
        MessageView.mostraErrore('Errore durante il caricamento del materiale.');
    }
}

async function apriModalPrestito(materiale) {

    try {
        if (!materiale) {
            return;
        }

        const user = await Auth.requireLogin();
        if (!user) {
            return;
        }

        ModalPrestito.apri(materiale, user);

    } catch (err) {
        console.log(err.message);
        MessageView.mostraErrore(err.message);

    }
}


async function confermaPrestito() {
    try {

        const idMateriale = materiale.id_libro; //document.getElementById('prestitoModal').dataset.idLibro;
        const durata = ModalPrestito.getDurataPrestito();

        const datiPrestito = await PrestitiApi.creaPrestito(idMateriale, durata);

        ModalPrestito.chiudi();
        await caricaMateriale();
        MessageView.mostraSuccesso(`Prestito registrato con successo.<br>
                                    Codice prestito: <strong>${datiPrestito.idPrestito}</strong>
                                    `);

    } catch (err) {
        console.error(err);
        ModalPrestito.chiudi();
        await caricaMateriale();
        MessageView.mostraErrore(err.message);
    }
}


async function inizializzaPagina() {

    CommonLayoutView.renderNavbar('catalogo'); // da verificare il parametro

    CommonLayoutView.renderBreadcrumb([
        {
            label: "Home",
            href: "/"
        },
        {
            label: "Catalogo",
            href: "/pages/catalogo.html"
        },
        {
            label: "Dettaglio materiale",
            active: true
        }
    ]);

    await Auth.initPage(false);

    await caricaMateriale();

    ModalPrestito.inizializza();

    document
        .getElementById('btnPrestito')
        .addEventListener(
            'click',
            () => apriModalPrestito(materiale)
        );

    document
        .getElementById('btnConfermaPrestito')
        .addEventListener(
            'click',
            confermaPrestito
        );
}



document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
