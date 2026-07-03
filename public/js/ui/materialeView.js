//GESTIONE DEL DOM
function mostraDettaglioMateriale(libro) {

    document.getElementById('titolo').value = libro.titolo ?? ''; //non più textContent
    document.getElementById('autore').value = libro.autore;
    document.getElementById('genere').value = libro.genere ?? '-';
    document.getElementById('editore').value = libro.casa_editrice ?? '-';
    document.getElementById('annoPubblicazione').value = libro.anno_pubblicazione ?? '-';
    document.getElementById('isbn').value = libro.isbn ?? '-';
    document.getElementById('descrizione').value = libro.descrizione ?? 'Nessuna descrizione disponibile.';

    //gestione della visualizzazione della disponibilità
    const disponibilita = document.getElementById('disponibilita');
    if (libro.copie_disponibili > 0) {
        disponibilita.innerHTML =
            `<span class="badge bg-success">Disponibile</span>`;
    } else {
        disponibilita.innerHTML =
            `<span class="badge bg-danger">Non disponibile</span>`;
        //document.getElementById('btnPrestito').disabled = true;
    }

    //copertina libro
    const imgCopertina = document.getElementById('copertina');
    if (libro.copertina) {
        imgCopertina.src = `/images/covers/${libro.copertina}`;
    } else {
        imgCopertina.src = '/images/book-placeholder.png';
    }

    document.getElementById('prestitoModal').dataset.idLibro = libro.id_libro;
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
                    <!--<a 
                        href="/pages/dettaglio-materiale.html?id=${m.id_libro}"
                        class="btn btn-sm btn-primary">
                        Dettagli
                    </a>-->
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
    mostraDettaglioMateriale,
    renderCatalogo,
    resetCatalogo,
    resetRicerca,
    setEditMode,
    resetMateriale,
    getMaterialeForm
}