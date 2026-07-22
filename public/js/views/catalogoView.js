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
                <td>${m.nr_copie_disponibili}</td>
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
    document.getElementById('anno').value = '';
    document.getElementById('genere').value = '';
    document.getElementById("soloDisponibili").checked = false;

    resetCatalogo();

    // reset paginazione + ricerca --DA FARE
    //cercaMateriali(1);
}

///VERIFICARE FUNZIONE DUPLICATA, presente anche nel dettMateriale!!!!
function caricaGeneri(generi) {

    const select = document.getElementById("genere");

    select.innerHTML = `
        <!--<option value="" selected disabled>-->
        <option value="" selected>
            Qualsiasi genere
        </option>
        ${generi.map(g => `
            <option value="${g.id_genere}">
                ${g.descrizione}
            </option>
        `).join("")}
    `;
}

function configuraPagina(context) {

    //per bibliotecario
    if (context.isAdmin) {
        document
            .getElementById("btnNuovoMateriale")
            .classList.remove("d-none");
    }

    caricaGeneri(context.generi);
}

export {
    renderCatalogo,
    resetCatalogo,
    resetRicerca,
    configuraPagina
}