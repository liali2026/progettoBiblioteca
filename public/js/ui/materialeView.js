/**
 * GESTIONE DELLA dettaglio-materiale.html
 * */
function renderMateriale(materiale) {
    caricaDatiMateriale(materiale);
    aggiornaDisponibilita(materiale);
    aggiornaCopertina(materiale);
    configuraPrestito(materiale);
}


function caricaDatiMateriale(materiale) {

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

    document.getElementById('descrizione').value =
        materiale.descrizione ?? 'Nessuna descrizione disponibile.';
}

function aggiornaDisponibilita(materiale) {
    //gestione della visualizzazione della disponibilità
    const disponibilita = document.getElementById('disponibilita');
    if (materiale.copie_disponibili > 0) {
        disponibilita.innerHTML =
            `<span class="badge bg-success">Disponibile</span>`;
    } else {
        disponibilita.innerHTML =
            `<span class="badge bg-danger">Non disponibile</span>`;
        //document.getElementById('btnPrestito').disabled = true;
    }
}

function aggiornaCopertina(materiale) {

    const img =
        document.getElementById("copertina");

    img.src = materiale.copertina
        ? `/images/covers/${materiale.copertina}`
        : "/images/book-placeholder.png";
}

function configuraPrestito(materiale) {

    document
        .getElementById("prestitoModal")
        .dataset.idLibro =
        materiale.id_libro;
}


function configuraPaginaMateriale(mode) {

    const titoloPagina = document.getElementById("pageTitle");
    const btnPrestito = document.getElementById("btnPrestito");
    const btnSalva = document.getElementById("btnSalva");

    switch (mode) {

        case "view":

            titoloPagina.textContent = "Dettaglio materiale";

            btnPrestito.classList.remove("d-none");
            btnSalva.classList.add("d-none");

            setEditMode(false);

            break;

        case "edit":

            titoloPagina.textContent = "Modifica materiale";

            btnPrestito.classList.add("d-none");
            btnSalva.classList.remove("d-none");
            btnSalva.textContent = "Salva";

            setEditMode(true);

            break;

        case "new":

            titoloPagina.textContent = "Nuovo materiale";

            btnPrestito.classList.add("d-none");
            btnSalva.classList.remove("d-none");
            btnSalva.textContent = "Inserisci";

            resetMateriale();
            setEditMode(true);

            break;
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
        "descrizione"
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

        descrizione:
            document.getElementById("descrizione").value
    };
}


/**
 * GESTIONE DELLA catalogo.html
 * */
//renderPaginazione(data.total, page); -- DA FARE
function renderCatalogo(materiali, context) {

    const tbody = document.getElementById('tabellaMateriali');
    const box = document.getElementById('messaggioPagina');

    box.classList.add('d-none');
    tbody.innerHTML =
        materiali.map(m => `
            <tr>
                <td>${m.titolo}</td>
                <td>${m.autore}</td>
                <td>${m.genere ?? '-'}</td>
                <td>${m.copie_disponibili}</td>
                <td>
                    ${renderAzioni(m, context)}
                </td>
            </tr>
        `).join('');
}

function renderAzioni(materiale, context) {

    let html = `
        <a
            href="/pages/dettaglio-materiale.html?id=${materiale.id_libro}"
            class="btn btn-sm btn-primary">
            Dettagli
        </a>
    `;

    if (context.isAdmin) {

        html += `
            <button
                class="btn btn-sm btn-warning btnModifica"
                data-id-libro="${materiale.id_libro}">
                Modifica
            </button>

            <button
                class="btn btn-sm btn-danger btnElimina"
                data-id-libro="${materiale.id_libro}">
                Elimina
            </button>
        `;
    }

    return html;
}

function resetCatalogo() {
    document.getElementById('tabellaMateriali').innerHTML = '';
}

function resetRicerca() {

    document.getElementById('titolo').value = '';
    document.getElementById('autore').value = '';
    resetCatalogo();

    // reset paginazione + ricerca --DA FARE
    //cercaMateriali(1);
}

export {
    renderMateriale,
    configuraPaginaMateriale,
    getMaterialeForm,
    renderCatalogo,
    resetCatalogo,
    resetRicerca
}