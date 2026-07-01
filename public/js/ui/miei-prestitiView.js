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
                <td>${badgeStato(m.stato)}</td>
                <td>
                    <button
                        class="btn btn-sm btn-warning btnRestituisci"
                        data-id-prestito="${m.id_prestito}"
                        ${m.stato === 'RESTITUITO' ? 'disabled' : ''}>
                        Restituisci
                    </button>
                </td>
            </tr>
        `).join('');
}

function resetPrestiti() {
    document.getElementById('tabellaPrestiti').innerHTML = '';
}

function resetRicerca() {

    document.getElementById('titolo').value = '';
    document.getElementById('autore').value = '';
    document.getElementById('stato').value = '';
    resetPrestiti();

}

function badgeStato(stato) {

    switch (stato) {

        case 'SCADUTO':
            return '<span class="badge bg-danger">SCADUTO</span>';

        case 'RESTITUITO':
            return '<span class="badge bg-success">RESTITUITO</span>';

        case 'ATTIVO':
            return '<span class="badge bg-warning text-dark">IN PRESTITO</span>';

        default:
            return stato;
    }
}

export {
    renderPrestiti,
    resetPrestiti,
    resetRicerca
}