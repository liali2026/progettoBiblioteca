import * as Auth from '../services/authService.js';
import * as Util from '../utils/validationUtils.js';

import {
    materiali as MaterialiApi,
    prestiti as PrestitiApi
} from '../api.js';

import * as CommonLayoutView from '../components/commonLayout.js';
import * as MessageView from '../components/message.js';
import {
    prestitoModal as ModalPrestito,
    copieModal as CopieModal
} from '../components/modals.js';

import * as View from '../views/dettaglioMaterialeView.js';

const CONTEXT = {
    mode: "view",
    idLibro: null,
    materiale: null,
    copieCaricate: false,
    user: null //gestione controllo del bottone di richiesta prestito/restituzione
};

function inizializzaContext() {

    const params = new URLSearchParams(window.location.search);

    CONTEXT.mode = params.get("mode") || "view";
    if (!['view', 'edit', 'new'].includes(CONTEXT.mode)) {
        CONTEXT.mode = 'view';
    }
    CONTEXT.idLibro = params.get("id");
}

async function caricaMateriale() {
    try {

        //MessageView.nascondiMessaggio();

        const idMateriale = CONTEXT.idLibro;
        if (!idMateriale) {
            MessageView.mostraErrore('Identificativo materiale non valido.');
            return;
        }
        CONTEXT.materiale = await MaterialiApi.findById(idMateriale);

        //View.mostraMateriale(CONTEXT.materiale, CONTEXT.materiale.copie_disponibili > 0);
        View.mostraMateriale(CONTEXT.materiale); //gestione controllo del bottone di richiesta prestito/restituzione

    } catch (err) {
        console.error(err);
        MessageView.mostraErrore('Errore durante il caricamento del materiale.');
    }
}

async function salvaMateriale(operazione = "insert") {
    try {
        const formData = new FormData();

        const materiale = View.getMaterialeForm();
        Util.validaMateriale(
            materiale,
            operazione === 'insert'
        );

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
                ? MaterialiApi.insert(formData)
                : MaterialiApi.update(CONTEXT.idLibro, formData));

        sessionStorage.setItem(
            "successMessage",
            operazione === "insert"
                ? "Materiale inserito correttamente."
                : "Materiale aggiornato correttamente."
        );

        window.location.href =
            `/pages/dettaglio-materiale.html?id=${risultato.idLibro}&mode=edit`;

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
 * GESTIONE dei prestiti
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
        const durata = ModalPrestito.getDurata();

        const datiPrestito = await PrestitiApi.create(idMateriale, durata);

        ModalPrestito.chiudi();
        await caricaMateriale();
        if (datiPrestito.esito == "PRESTITO") {
            MessageView.mostraSuccesso(`Prestito registrato con successo.<br>
                                    Codice prestito: <strong>${datiPrestito.id}</strong>
                                    `);
        } else {
            MessageView.mostraSuccesso(`
            Tutte le copie sono attualmente occupate.<br>
            La tua prenotazione è stata inserita in coda.<br>
            Codice prenotazione:
            <strong>${datiPrestito.id}</strong>
                                      `);
        }

    } catch (err) {
        //console.error(err);
        ModalPrestito.chiudi();
        await caricaMateriale();
        MessageView.mostraErrore(err.message);
    }
}
//

/**
 * GESTIONE DELLE COPIE
 * */

async function mostraCopie() {
    let copie = [];
    try {

        copie = await MaterialiApi.copie(CONTEXT.idLibro);
        CONTEXT.copieCaricate = true;
    } catch (err) {
        MessageView.mostraErrore(err.message);
    }
    View.mostraCopie(copie, CONTEXT);
}

async function aggiungiCopie() {
    try {
        const nrCopie = CopieModal.getNumero();

        await MaterialiApi.addCopie(
            CONTEXT.idLibro,
            nrCopie
        );

        CopieModal.chiudi();

        //await mostraCopie();
        const copie = await MaterialiApi.copie(CONTEXT.idLibro);
        View.mostraCopie(copie, CONTEXT);
        CONTEXT.copieCaricate = true;

        await caricaMateriale();
        MessageView.mostraSuccesso(`Copie aggiunte correttamente.`);

    } catch (err) {
        CopieModal.chiudi();
        await caricaMateriale();
        MessageView.mostraErrore(err.message);
    }
}

async function cancellaCopie(idMateriale, idCopia) {
    try {

        const risultato =
            await MaterialiApi.removeCopia(idMateriale, idCopia);

        await caricaMateriale();
        await mostraCopie();
        MessageView.mostraSuccesso(
            risultato.messaggio
        );

    } catch (err) {
        MessageView.mostraErrore(err.message);
    }

}
//

//gestione controllo del bottone di richiesta prestito/restituzione
async function gestisciAzionePrestito() {

    const btn = document.getElementById("btnPrestito");
    const azione = btn.dataset.azione;

    switch (azione) {

        case "prestito":
            await apriModalPrestito(CONTEXT.materiale);
            break;

        case "prenotazione":
            await apriModalPrestito(CONTEXT.materiale);
            break;

        case "restituisci":
            await restituisciLibro();
            break;
    }
}

//gestione controllo del bottone di richiesta prestito/restituzione
async function restituisciLibro() {
    //richiesta di conferma
    const conferma = confirm(
        "Sei sicuro di voler restituire questo libro?"
    );

    if (!conferma) {
        return;
    }
    try {

        const idPrestito =
            CONTEXT.materiale.prestito_utente.id_prestito;

        const risultato =
            await PrestitiApi.restituisci(idPrestito);

        await caricaMateriale();

        MessageView.mostraSuccesso(
            risultato.messaggio
        );

    } catch (err) {

        MessageView.mostraErrore(err.message);
    }
}

function registraEventi() {

    //gestione controllo del bottone di richiesta prestito/restituzione
    /*document
        .getElementById("btnPrestito")
        .addEventListener(
            "click",
            () => apriModalPrestito(CONTEXT.materiale)
        );
        */
    document
        .getElementById("btnPrestito")
        .addEventListener(
            "click",
            gestisciAzionePrestito
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
                    await salvaMateriale("insert");
                }
                else {
                    await salvaMateriale("update");
                }

            }
        );


    //GESTIONE DELLE COPIE
    const collapse = document.getElementById("collapseCopie");
    collapse.addEventListener(
        "show.bs.collapse",
        async () => {
            //modifica il tasto 'Gestisci copie'
            View.aggiornaPulsanteCollapse(
                "btnGestisciCopie",
                true,
                "Gestisci copie",
                "Nascondi copie");

            //collassa il campo descrizione
            View.mostraDescrizione(false);
            //visualizza la tabella dei dati delle copie
            await mostraCopie();
        }
    );

    collapse.addEventListener(
        "hide.bs.collapse",
        () => {
            View.aggiornaPulsanteCollapse(
                "btnGestisciCopie",
                false,
                "Gestisci copie",
                "Nascondi copie");

            View.mostraDescrizione(true);
            MessageView.nascondiMessaggio();
        }
    );

    document.getElementById("btnAggiungiCopia")
        .addEventListener(
            "click",
            CopieModal.apri
        );

    document
        .getElementById("btnConfermaAggiungiCopie")
        .addEventListener(
            "click",
            aggiungiCopie
        );

    document
        .getElementById("tbodyCopie")
        .addEventListener("click", async (e) => {

            if (e.target.classList.contains("btnElimina")) {
                if (!confirm("Confermi l'eliminazione del materiale?")) {
                    return;
                }
                const idMateriale = e.target.dataset.idMateriale;
                const idCopia = e.target.dataset.idCopia;
                await cancellaCopie(idMateriale, idCopia);
            }

        });
}

async function inizializzaPagina() {
    try {

        CommonLayoutView.renderNavbar('catalogo');
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

        inizializzaContext();

        const protectedMode = CONTEXT.mode === 'new'
            || CONTEXT.mode === 'edit';
        const user = await Auth.initPage(protectedMode, true);
        CONTEXT.user = user; //gestione controllo del bottone di richiesta prestito/restituzione

        if (protectedMode && user?.ruolo !== 'BIBLIOTECARIO') {
            MessageView.mostraErrore(
                'Questa funzione è riservata al bibliotecario.'
            );
            return;
        }

        View.configuraPagina(CONTEXT.mode);

        //gestione dei generi
        const generi = await MaterialiApi.generi();
        CommonLayoutView.renderGeneri(
            'genere',
            generi,
            {
                placeholder: 'Seleziona il genere',
                disabled: true
            }
        );
        //

        if (CONTEXT.mode === "view" || CONTEXT.mode === "edit") {
            await caricaMateriale();
        }

        mostraMessaggiPendenti();

        ModalPrestito.inizializza();
        CopieModal.inizializza();

        registraEventi();

    } catch (err) {

        console.error(err);

        MessageView.mostraErrore(
            err.message || "Errore durante il caricamento della pagina."
        );
    }
}



document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
