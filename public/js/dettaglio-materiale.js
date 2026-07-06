import * as Auth from './auth.js';

import * as MaterialiApi from './api/materialiApi.js';
import * as PrestitiApi from './api/prestitiApi.js';

import * as ModalPrestito from './ui/prestitoModalView.js';
import * as View from './ui/dettaglioMaterialeView.js';
import * as CommonLayoutView from './ui/commonLayoutView.js';
import * as MessageView from './ui/messageView.js';

//let materiale = null;

const CONTEXT = {
    mode: "view",
    idLibro: null,
    materiale: null
};


async function caricaMateriale() {
    try {

        MessageView.nascondiMessaggio();

        const idMateriale = CONTEXT.idLibro;
        if (!idMateriale) {
            MessageView.mostraErrore('Identificativo materiale non valido.');
            return;
        }
        CONTEXT.materiale = await MaterialiApi.ricercaById(idMateriale);

        View.mostraMateriale(CONTEXT.materiale, CONTEXT.materiale.copie_disponibili > 0);

    } catch (err) {
        console.error(err);
        MessageView.mostraErrore('Errore durante il caricamento del materiale.');
    }
}

async function insertMateriale() {
    try {

        const materiale = View.getMaterialeForm();

        const risultato =
            await MaterialiApi.insertItem(materiale);

        /*window.location.href =
            `/pages/dettaglio-materiale.html?id=${risultato.idLibro}`;

        MessageView.mostraSuccesso(
            "Materiale inserito correttamente."
        );*/
        sessionStorage.setItem(
            "successMessage",
            "Materiale inserito correttamente."
        );

        window.location.href =
            `/pages/dettaglio-materiale.html?id=${risultato.idLibro}`;

    } catch (err) {
        MessageView.mostraErrore(err.message);
    }
}

async function updateMateriale() {
    try {

        const materiale = View.getMaterialeForm();

        materiale.id_libro = CONTEXT.idLibro;

        await MaterialiApi.updateItem(materiale);

        MessageView.mostraSuccesso(
            "Materiale aggiornato correttamente."
        );

    } catch (err) {
        MessageView.mostraErrore(err.message);
    }
}

function inizializzaContext() {

    const params = new URLSearchParams(window.location.search);

    CONTEXT.mode = params.get("mode") || "view";
    /*CONTEXT.isEdit = CONTEXT.mode === "edit";
    CONTEXT.isNew = CONTEXT.mode === "new";*/

    CONTEXT.idLibro = params.get("id");
}

function mostraMessaggiPendenti() {

    const msg =
        sessionStorage.getItem("successMessage");

    if (!msg) {
        return;
    }

    MessageView.mostraSuccesso(msg);

    sessionStorage.removeItem("successMessage");
}

/**
 * GESTIONE det prestiti
 * */
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

        const idMateriale = CONTEXT.materiale.id_libro; 
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
//

function registraEventi() {

    document
        .getElementById("btnPrestito")
        .addEventListener(
            "click",
            () => apriModalPrestito(CONTEXT.materiale)
        );

    document
        .getElementById("btnConfermaPrestito")
        .addEventListener(
            "click",
            confermaPrestito
        );

    document
        .getElementById("btnSalva")
        .addEventListener(
            "click",
            async () => {

                if (CONTEXT.mode == "new") {
                    await insertMateriale();
                }
                else {
                    await updateMateriale();
                }

            }
        );
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

    inizializzaContext();
    View.configuraPagina(CONTEXT.mode);

    if (CONTEXT.mode === "view" || CONTEXT.mode === "edit") {
        await caricaMateriale();
    }

    mostraMessaggiPendenti();

    ModalPrestito.inizializza();

    registraEventi();
}



document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
