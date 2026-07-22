import * as Auth from '../services/authService.js';
import * as MaterialiApi from '../api/materialiApi.js';
import * as MaterialiView from '../views/catalogoView.js';
import * as CommonLayoutView from '../components/commonLayout.js';
import * as MessageView from '../components/message.js';

let CONTEXT = {
    role: null,
    isAdmin: false,
    generi: null
};

function inizializzaContext(user) {
    CONTEXT.role = user?.ruolo ?? "UTENTE";
    CONTEXT.isAdmin = CONTEXT.role === "BIBLIOTECARIO";
}

async function ricercaMateriali() {
    try {

        const titolo = document.getElementById('titolo').value.toLowerCase().trim();
        const autore = document.getElementById('autore').value.toLowerCase().trim();
        const anno = document.getElementById('anno').value.trim();
        const idGenere = document.getElementById('genere').value;
        const soloDisponibili = document.getElementById("soloDisponibili").checked;

        const risultati = await MaterialiApi.ricercaMateriali(titolo, autore, anno, idGenere, soloDisponibili);

        if (!risultati || risultati.length === 0) {
            MaterialiView.resetCatalogo();
            MessageView.mostraWarning('Nessun materiale trovato con i criteri di ricerca.');
        } else {
            MaterialiView.renderCatalogo(risultati, CONTEXT);
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

function inserisciMateriale() {
    window.location.href =
        "/pages/dettaglio-materiale.html?mode=new";
}

function modificaMateriale(idLibro) {

    window.location.href =
        `/pages/dettaglio-materiale.html?id=${idLibro}&mode=edit`;
}

async function eliminaMateriale(idLibro) {

    if (!confirm("Confermi l'eliminazione del materiale?")) {
        return;
    }

    try {
        const risultato = await MaterialiApi.deleteItem(idLibro);
        await ricercaMateriali();
        MessageView.mostraSuccesso(risultato.messaggio);
    } catch (err) {
        MessageView.mostraErrore(err.message);
    }
}

async function gestisciClickTabella(e) {

    const btn = e.target.closest("button");

    if (!btn) {
        return;
    }

    if (btn.classList.contains("btnModifica")) {
        modificaMateriale(btn.dataset.idLibro);
        return;
    }

    if (btn.classList.contains("btnElimina")) {
        await eliminaMateriale(btn.dataset.idLibro);
    }
}

function registraEventi() {
    if (CONTEXT.isAdmin) {
        /*document
            .getElementById('btnNuovoMateriale')
            .addEventListener('click', () => {
                window.location.href =
                    `/pages/dettaglio-materiale.html?mode=new`;
            });*/
        document
            .getElementById("btnNuovoMateriale")
            .addEventListener("click", inserisciMateriale);
    }

    document
        .getElementById('btnRicerca')
        .addEventListener('click', ricercaMateriali);
    document
        .getElementById('btnPulisci')
        .addEventListener('click', resetRicerca);

    document
        .getElementById("tabellaMateriali")
        .addEventListener("click", gestisciClickTabella);

    /*document
        .getElementById("tabellaMateriali")
        .addEventListener("click", async (e) => {

            if (e.target.classList.contains("btnModifica")) {
                const id = e.target.dataset.idLibro;
                window.location.href =
                    `/pages/dettaglio-materiale.html?id=${id}&mode=edit`;
            }

            if (e.target.classList.contains("btnElimina")) {
                if (!confirm("Confermi l'eliminazione del materiale?")) {
                    return;
                }
                try {
                    const id = e.target.dataset.idLibro;
                    //console.log(id);
                    const risultato = await MaterialiApi.deleteItem(id);

                    await ricercaMateriali();

                    MessageView.mostraSuccesso(
                        risultato.messaggio
                    );

                } catch (err) {

                    MessageView.mostraErrore(err.message);

                }
            }

        });*/
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

    const user = await Auth.initPage();

    inizializzaContext(user);
    CONTEXT.generi = await MaterialiApi.getAllGeneri();

    MaterialiView.configuraPagina(CONTEXT);

    registraEventi();
}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
