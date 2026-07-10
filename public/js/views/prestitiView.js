import { formattaData } from '../utils/dateUtils.js';

//renderPaginazione(data.total, page); -- DA FARE
function renderPrestiti(prestiti, CONTEXT) {

    const tbody = document.getElementById('tabellaPrestiti');
    const box = document.getElementById('messaggioPagina');

    //per bibliotecario
    const isAdmin = CONTEXT?.isAdmin;

    box.classList.add('d-none');
    tbody.innerHTML =
         prestiti.map(m => {

            const isRestituito = m.stato === 'RESTITUITO';

            return `
            <tr>
                <td>${m.titolo}</td>
                <td>${m.autore}</td>
                <td>${m.genere ?? '-'}</td>
                <td>${formattaData(m.data_inizio)}</td>
                <td>${formattaData(m.data_fine)}</td>
                <td>${m.data_restituzione ? formattaData(m.data_restituzione) : '-'}</td>
                <td>${badgeStato(m.stato)}</td>
                 <td>
                    ${(!isRestituito && !isAdmin) ? `
                        <button
                            class="btn btn-sm btn-warning btnRestituisci"
                            data-id-prestito="${m.id_prestito}">
                            Restituisci
                        </button>
                    ` : ''}
                </td>
            </tr>
         `;
    }).join('');
}

function resetPrestiti() {
    document.getElementById('tabellaPrestiti').innerHTML = '';
}

function resetRicerca() {

    document.getElementById('titolo').value = '';
    document.getElementById('autore').value = '';
    document.getElementById('stato').value = 'ALL';
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