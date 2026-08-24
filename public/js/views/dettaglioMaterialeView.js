/**
 * GESTIONE DELLA dettaglio-materiale.html
 * */

const CONFIG = {
    view: {
        titolo: "Dettaglio materiale",
        mostraPrestito: true,
        mostraSalva: false,
        testoSalva: "",
        editable: false,
        mostraGestioneCopie: false, //GESTIONE COPIE
        reset: false
    },

    edit: {
        titolo: "Modifica materiale",
        mostraPrestito: false,
        mostraSalva: true,
        testoSalva: "Salva",
        editable: true,
        mostraGestioneCopie: true, //GESTIONE COPIE
        reset: false
    },

    new: {
        titolo: "Nuovo materiale",
        mostraPrestito: false,
        mostraSalva: true,
        testoSalva: "Inserisci",
        editable: true,
        mostraGestioneCopie: false, //GESTIONE COPIE
        reset: true
    }
};

function mostraMateriale(materiale) {
    popolaForm(materiale);
    //mostraDisponibilita(disponibile);
    aggiornaCopertina(materiale);
}


function popolaForm(materiale) {

    document.getElementById('titolo').value =
        materiale.titolo ?? '';

    document.getElementById('autore').value =
        materiale.autore ?? '';

    document.getElementById('genere').value =
        //materiale.genere ?? '-';
        String(materiale.id_genere ?? '');

    document.getElementById('editore').value =
        materiale.casa_editrice ?? '-';

    document.getElementById('annoPubblicazione').value =
        materiale.anno_pubblicazione ?? '-';

    document.getElementById('isbn').value =
        materiale.isbn ?? '-';

    document.getElementById('nrCopie').value =
        materiale.nr_copie_disponibili ?? '-';

    document.getElementById('descrizione').value =
        materiale.descrizione ?? 'Nessuna descrizione disponibile.';
}

function aggiornaCopertina(materiale) {

    const img =
        document.getElementById("copertina");

    img.src = materiale.copertina
        ? `/covers/${materiale.copertina}`
        : "/images/book-placeholder.png";
}

function configuraPagina(mode) {

    const cfg = CONFIG[mode];
    //console.log(cfg);

    document.getElementById("pageTitle").textContent = cfg.titolo;

    document
        .getElementById("btnPrestito")
        .classList.toggle("d-none", !cfg.mostraPrestito);

    const btnSalva =
        document.getElementById("btnSalva");
    btnSalva.classList.toggle("d-none", !cfg.mostraSalva);
    btnSalva.textContent = cfg.testoSalva;

    //GESTIONE COPIE 
    const btnGestisciCopie =
        document.getElementById("btnGestisciCopie");
    btnGestisciCopie.classList.toggle("d-none", !cfg.mostraGestioneCopie);
    //

    setEditMode(cfg.editable, cfg.mostraGestioneCopie); //GESTIONE DELLE COPIE

    if (cfg.reset) {
        resetMateriale();
    }

    abilitaPuliziaErrori();

}

function setEditMode(editable, mostraCopie) {

    [
        "titolo",
        "autore",
        "editore",
        "annoPubblicazione",
        "isbn",
        "descrizione"
    ].forEach(id => {

        const campo = document.getElementById(id);
        campo.readOnly = !editable;
        campo.classList.toggle("bg-body-secondary", !editable);
    });

    const genere = document.getElementById("genere");
    genere.disabled = !editable;
    genere.classList.toggle("bg-body-secondary", !editable);

    document
        .getElementById("load-file")
        .classList.toggle("d-none", !editable);

    //GESTIONE COPIE
    // il campo nrCopie è editabile solo in fase di insert
    const nrCopie = document.getElementById("nrCopie");
    nrCopie.readOnly = (mostraCopie || !editable);
    nrCopie.classList.toggle("bg-body-secondary", mostraCopie || !editable);
}

function resetMateriale() {

    [
        "titolo",
        "autore",
        "genere",
        "editore",
        "annoPubblicazione",
        "isbn",
        "nrCopie",
        "descrizione"
    ].forEach(id => {

        document.getElementById(id).value = "";
    });

    document.getElementById("copertina").src =
        "/images/book-placeholder.png";
}

function getMaterialeForm() {

    return {

        titolo:
            document.getElementById("titolo").value,

        autore:
            document.getElementById("autore").value,

        idGenere:
            document.getElementById("genere").value,

        casaEditrice:
            document.getElementById("editore").value,

        annoPubblicazione:
            document.getElementById("annoPubblicazione").value,

        isbn:
            document.getElementById("isbn").value,

        nrCopie:
            document.getElementById("nrCopie").value,

        descrizione:
            document.getElementById("descrizione").value
    };
}

//in fase di insert/update del materiale per visualizzare i campi
//con presenza di errori
function mostraErrori(errori) {

    errori.forEach(errore => {

        const elemento =
            document.getElementById(errore.campo);

        if (elemento) {
            elemento.classList.add("is-invalid");
        }
    });
}

function pulisciErrori() {

    document
        .querySelectorAll(".is-invalid")
        .forEach(elemento => {

            elemento.classList.remove("is-invalid");
        });
}

function abilitaPuliziaErrori() {

    document
        .querySelectorAll("input, select, textarea")
        .forEach(campo => {

            campo.addEventListener(
                "input",
                () => campo.classList.remove("is-invalid")
            );

            campo.addEventListener(
                "change",
                () => campo.classList.remove("is-invalid")
            );
        });
}

function getFileCopertina() {

    const input =
        document.getElementById("fileCopertina");

    return input.files[0] ?? null;
}

//gestione delle copie
async function mostraCopie(copie, context) {
    const tbody = document.getElementById('tbodyCopie');
    tbody.innerHTML =
        copie.map(m => `
            <tr>
                <td>${m.id_copia}</td>
                <td>${m.stato}</td>
                <td>${m.email ?? '-'}</td>
                <td>${formattaData(m.data_inizio)}</td>
                <td>${formattaData(m.data_fine)}</td>
                <td>
                    ${renderAzioni(m, context)}
                </td>
            </tr>
        `).join('');

}

function renderAzioni(copia, context) {

    let html = "";
    
    if (context.mode ==="edit") {

        html += `
            <button
                class="btn btn-sm btn-danger btnElimina"
                data-id-materiale="${copia.id_libro}"
                data-id-copia="${copia.id_copia}">
                Elimina
            </button>
        `;
    }

    return html;
}
function aggiornaPulsanteCollapse(
    idBottone,
    aperto,
    testoChiuso,
    testoAperto
) {

    const btn = document.getElementById(idBottone);

    btn.classList.toggle("btn-primary", !aperto);
    btn.classList.toggle("btn-secondary", aperto);

    btn.textContent =
        aperto
            ? testoAperto
            : testoChiuso;
}

function mostraDescrizione(mostra) {

    document
        .getElementById("descrizioneContainer")
        .classList.toggle("d-none", !mostra);
}

function formattaData(data) {
    return data
        ? new Date(data).toLocaleDateString('it-IT')
        : '';
}


export {
    mostraMateriale,
    configuraPagina,
    getMaterialeForm,
    mostraErrori,
    pulisciErrori,
    getFileCopertina,
    mostraCopie,
    aggiornaPulsanteCollapse,
    mostraDescrizione
}
