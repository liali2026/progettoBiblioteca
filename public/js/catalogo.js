import * as Auth from './auth.js';
import * as MaterialiApi from './api/materialiApi.js';
import * as MaterialiView from './ui/materialeView.js';
import * as CommonLayoutView from './ui/commonLayoutView.js';
import * as MessageView from './ui/messageView.js';

let CONTEXT = {
    role: null,
    isAdmin: false
};

async function ricercaMateriali() {
    try {

        const titolo = document.getElementById('titolo').value.toLowerCase().trim();
        const autore = document.getElementById('autore').value.toLowerCase().trim();

        const risultati = await MaterialiApi.ricercabyAutoreTitolo(titolo, autore);

        if (!risultati || risultati.length === 0) {

            MaterialiView.resetCatalogo();
            MessageView.mostraWarning('Nessun materiale trovato con i criteri di ricerca.');

        } else {

            // MaterialiView.renderCatalogo(risultati);
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
    CONTEXT.role = user.ruolo;
    CONTEXT.isAdmin = user.ruolo === "BIBLIOTECARIO";

    if (CONTEXT.isAdmin) {
        document
            .getElementById("btnNuovoMateriale")
            .classList.remove("d-none");

       document
        .getElementById('btnNuovoMateriale')
        .addEventListener('click', ()=> 
            {window.location.href =
                    `/pages/dettaglio-materiale.html?mode=new`;
            });            
    }

    document
        .getElementById('btnRicerca')
        .addEventListener('click', ricercaMateriali);
    document
        .getElementById('btnPulisci')
        .addEventListener('click', resetRicerca);


    document
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
                    const risultato =
                        await MaterialiApi.deleteItem(id);
                        
                    MessageView.mostraSuccesso(
                        risultato.messaggio
                    );

                    await ricercaMateriali();

                } catch (err) {

                    MessageView.mostraErrore(err.message);

                }
            }

        });
}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
