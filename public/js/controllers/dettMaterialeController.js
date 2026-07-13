import * as Auth from '../services/authService.js';
import * as Util from '../utils/validationUtils.js';

import * as MaterialiApi from '../api/materialiApi.js';
import * as PrestitiApi from '../api/prestitiApi.js';

import * as CommonLayoutView from '../components/commonLayout.js';
import * as MessageView from '../components/message.js';
import * as ModalPrestito from '../components/prestitoModal.js';

import * as View from '../views/dettaglioMaterialeView.js';

const CONTEXT = {
    mode: "view",
    idLibro: null,
    materiale: null
};

function inizializzaContext() {

    const params = new URLSearchParams(window.location.search);

    CONTEXT.mode = params.get("mode") || "view";
    CONTEXT.idLibro = params.get("id");
}


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

async function salvaMateriale(operazione = "insert") {
    try {
        const formData = new FormData();

        const materiale = View.getMaterialeForm();
        Util.validaMateriale(materiale);

        if (operazione === "update") {
            materiale.id_libro = CONTEXT.idLibro;
        }

        formData.append(
            "materiale",
            JSON.stringify(materiale)
        );

        const file = View.getFileCopertina();
        if (file) {
            formData.append(
                "copertina",
                file
            );
        }

        const risultato =
            await (operazione === "insert"
                ? MaterialiApi.insertItem(formData)
                : MaterialiApi.updateItem(formData));

        sessionStorage.setItem(
            "successMessage",
            operazione === "insert"
                ? "Materiale inserito correttamente."
                : "Materiale aggiornato correttamente."
        );

        window.location.href =
            `/pages/dettaglio-materiale.html?id=${risultato.idLibro}`;

    } catch (err) {

        if (err.dettagli) {
            View.mostraErrori(err.dettagli);
            const html =
                "<ul><li>" +
                err.dettagli
                    .map(e => e.messaggio)
                    .join("</li><li>") +
                "</li></ul>";

            MessageView.mostraErrore(html);
        } else {
            MessageView.mostraErrore(err.message);
        }
    }
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
                    //await insertMateriale();
                    await salvaMateriale("insert");
                }
                else {
                    //await updateMateriale();
                    await salvaMateriale("update");
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

    //gestione dei generi
    const generi = await MaterialiApi.getAllGeneri();
    View.caricaGeneri(generi);
    //

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
