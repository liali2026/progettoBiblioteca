import * as Auth from './auth.js';
import * as MaterialiApi from './api/materialiApi.js';
import * as PrestitiApi from './api/prestitiApi.js';
import * as ModalPrestito from './ui/prestitoModalView.js';
import * as View from './ui/materialeView.js';
import * as CommonLayoutView from './ui/commonLayoutView.js';
import * as MessageView from './ui/messageView.js';

let materiale = null;

const CONTEXT = {
    mode: "view",
    isEdit: false,
    isNew: false,
    idLibro: null
};

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
    CONTEXT.isEdit = CONTEXT.mode === "edit";
    CONTEXT.isNew = CONTEXT.mode === "new";

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

function registraEventi() {

    document
        .getElementById("btnPrestito")
        .addEventListener(
            "click",
            () => apriModalPrestito(materiale)
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

                if (CONTEXT.isNew) {
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

     if (!CONTEXT.isNew) {
        await caricaMateriale();
    }

    View.configuraPaginaMateriale();
    mostraMessaggiPendenti();

    ModalPrestito.inizializza();

    registraEventi();

    /*const params = new URLSearchParams(window.location.search);

    CONTEXT.mode = params.get("mode") || "view";
    CONTEXT.isEdit = CONTEXT.mode === "edit";
    CONTEXT.isNew = CONTEXT.mode === "new";
    CONTEXT.idLibro = params.get("id");

    if (!CONTEXT.isNew) {
        await caricaMateriale();
    }

    if (CONTEXT.isEdit) {

        View.setEditMode(true);

        document
            .getElementById("btnPrestito")
            .classList.add("d-none");

        document
            .getElementById("btnSalva")
            .classList.remove("d-none");

        document.getElementById("btnSalva").textContent =
            CONTEXT.isNew ? "Inserisci" : "Salva";

    }
    else if (CONTEXT.isNew) {

        View.resetMateriale();
        View.setEditMode(true);

        document
            .getElementById("btnPrestito")
            .classList.add("d-none");

        document
            .getElementById("btnSalva")
            .classList.remove("d-none");

        document.getElementById("btnSalva").textContent =
            CONTEXT.isNew ? "Inserisci" : "Salva";
    }

    switch (CONTEXT.mode) {
        case "view":
            document.getElementById("pageTitle").textContent = "Dettaglio materiale";
            break;

        case "edit":
            document.getElementById("pageTitle").textContent = "Modifica materiale";
            break;

        case "new":
            document.getElementById("pageTitle").textContent = "Nuovo materiale";
            break;
    }

    //gestione messaggio nel caso di inserimento nuovo libro
    const msg =
        sessionStorage.getItem("successMessage");

    if (msg) {

        MessageView.mostraSuccesso(msg);
        sessionStorage.removeItem("successMessage");
    }

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

    document
        .getElementById("btnSalva")
        .addEventListener("click", async () => {

            if (CONTEXT.isNew) {
                await insertMateriale();
            } else {
                await updateMateriale();
            }

        });*/
}



document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
