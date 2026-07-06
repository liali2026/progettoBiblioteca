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
        reset: false
    },

    edit: {
        titolo: "Modifica materiale",
        mostraPrestito: false,
        mostraSalva: true,
        testoSalva: "Salva",
        editable: true,
        reset: false
    },

    new: {
        titolo: "Nuovo materiale",
        mostraPrestito: false,
        mostraSalva: true,
        testoSalva: "Inserisci",
        editable: true,
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
        materiale.genere ?? '-';

    document.getElementById('editore').value =
        materiale.casa_editrice ?? '-';

    document.getElementById('annoPubblicazione').value =
        materiale.anno_pubblicazione ?? '-';

    document.getElementById('isbn').value =
        materiale.isbn ?? '-';

    document.getElementById('disponibilita').value =
        materiale.nr_copie_disponibili ?? '-';

    document.getElementById('descrizione').value =
        materiale.descrizione ?? 'Nessuna descrizione disponibile.';
}

/*function mostraDisponibilita(disponibile) {
    //gestione della visualizzazione della disponibilità
    const disponibilita = document.getElementById('disponibilita');
    disponibilita.innerHTML =
        disponibile
        ? '<span class="badge bg-success">Disponibile</span>'
        : '<span class="badge bg-danger">Non disponibile</span>';
}*/

function aggiornaCopertina(materiale) {

    const img =
        document.getElementById("copertina");

    img.src = materiale.copertina
        ? `/images/covers/${materiale.copertina}`
        : "/images/book-placeholder.png";
}

function caricaGeneri(generi) {

    console.log(generi);
    const select = document.getElementById("genere");

    select.innerHTML =
        generi.map(g =>
            `<option value="${g.id}">${g.descrizione}</option>`
        ).join("");
}

/*function configuraPrestito(materiale) {

    document
        .getElementById("prestitoModal")
        .dataset.idLibro =
        materiale.id_libro;
}*/


function configuraPagina(mode) {

    const cfg = CONFIG[mode];
    console.log(cfg);

    document.getElementById("pageTitle").textContent = cfg.titolo;

    document
        .getElementById("btnPrestito")
        .classList.toggle("d-none", !cfg.mostraPrestito);

    const btnSalva =
        document.getElementById("btnSalva");

    btnSalva.classList.toggle("d-none", !cfg.mostraSalva);

    btnSalva.textContent = cfg.testoSalva;

    setEditMode(cfg.editable);

    if (cfg.reset) {
        resetMateriale();
    }

}

function setEditMode(editable) {

    [
        "titolo",
        "autore",
        "genere",
        "editore",
        "annoPubblicazione",
        "isbn",
        "descrizione",
        "disponibilita"
    ].forEach(id => {

        document
            .getElementById(id)
            .readOnly = !editable;
    });
}

function resetMateriale() {

    [
        "titolo",
        "autore",
        "genere",
        "editore",
        "annoPubblicazione",
        "isbn",
        "descrizione"
    ].forEach(id => {

        document.getElementById(id).value = "";
    });

    document.getElementById("disponibilita").innerHTML =
        '<span class="badge bg-secondary">Nuovo materiale</span>';

    document.getElementById("copertina").src =
        "/images/book-placeholder.png";
}

function getMaterialeForm() {

    return {

        titolo:
            document.getElementById("titolo").value,

        autore:
            document.getElementById("autore").value,

        genere:
            document.getElementById("genere").value,

        casaEditrice:
            document.getElementById("editore").value,

        annoPubblicazione:
            document.getElementById("annoPubblicazione").value,

        isbn:
            document.getElementById("isbn").value,

        nrCopie:
            document.getElementById("disponibilita").value,

        descrizione:
            document.getElementById("descrizione").value
    };
}

export {
    mostraMateriale,
    configuraPagina,
    getMaterialeForm,
    caricaGeneri
}