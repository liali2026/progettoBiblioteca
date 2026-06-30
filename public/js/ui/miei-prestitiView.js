import { formattaData } from '../utils/dateUtils.js';

//renderPaginazione(data.total, page); -- DA FARE
function renderPrestiti(prestiti) {

    const tbody = document.getElementById('tabellaPrestiti');
    const box = document.getElementById('messaggioPagina');

    box.classList.add('d-none');
    tbody.innerHTML =
        prestiti.map(m => `
            <tr>
                <td>${m.titolo}</td>
                <td>${m.autore}</td>
                <td>${m.genere ?? '-'}</td>
                <td>${formattaData(m.data_inizio)}</td>
                <td>${formattaData(m.data_fine)}</td>
                <td>${formattaData(m.data_restituzione) ?? '-'}</td>
                <td>${m.stato}</td>
                <td>
                    <!--<a 
                        href="/pages/dettaglio_materiale.html?id=${m.id_libro}"
                        class="btn btn-sm btn-primary">
                        Dettagli
                    </a>-->
                </td>
            </tr>
        `).join('');
}

function resetPrestiti(){
    document.getElementById('tabellaPrestiti').innerHTML = '';
}

function resetRicerca() {

    document.getElementById('titolo').value = '';
    document.getElementById('autore').value = '';
    document.getElementById('stato').value = '';
    resetPrestiti();

}

export {
    renderPrestiti,
    resetPrestiti,
    resetRicerca
}