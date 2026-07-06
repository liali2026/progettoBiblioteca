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
    renderCatalogo,
    resetCatalogo,
    resetRicerca
}