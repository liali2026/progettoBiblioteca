import {
    escapeHtml,
    renderGeneri
} from '../components/commonLayout.js';
function renderCatalogo(materiali, context) {

    const tbody = document.getElementById('tabellaMateriali');
    const box = document.getElementById('messaggioPagina');

    box.classList.add('d-none');
    tbody.innerHTML =
        materiali.map(m => `
            <tr>
                <td>${escapeHtml(m.titolo)}</td>
                <td>${escapeHtml(m.autore)}</td>
                <td>${escapeHtml(m.genere ?? '-')}</td>
                <td>${escapeHtml(m.anno_pubblicazione)}</td>
                <td>${escapeHtml(m.isbn)}</td>
                <td>${m.nr_copie_disponibili}</td>
                <td>
                    ${renderAzioni(m, context)}
                </td>
            </tr>
        `).join('');
}

function renderAzioni(materiale, context) {
    //let html ="";
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
    /*} else {
        html = `
        <a
            href="/pages/dettaglio-materiale.html?id=${materiale.id_libro}"
            class="btn btn-sm btn-primary">
            Dettagli
        </a>
    `;*/
    }

    return html;
}

function resetCatalogo() {
    document.getElementById('tabellaMateriali').innerHTML = '';
}

function resetRicerca() {

    document.getElementById('titolo').value = '';
    document.getElementById('autore').value = '';
    document.getElementById('anno').value = '';
    document.getElementById('genere').value = '';
    document.getElementById('isbn').value = '';
    document.getElementById("soloDisponibili").value = 'ALL';

    resetCatalogo();

}

function configuraPagina(context) {

    //per bibliotecario
    if (context.isAdmin) {
        document
            .getElementById("btnNuovoMateriale")
            .classList.remove("d-none");
    }

    renderGeneri('genere', context.generi);
}

export {
    renderCatalogo,
    resetCatalogo,
    resetRicerca,
    configuraPagina
}
