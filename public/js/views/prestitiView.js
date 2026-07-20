import { formattaData } from '../utils/dateUtils.js';

let STATI = [];

function configuraPagina(CONTEXT) {
    //per bibliotecario
    if (CONTEXT.isAdmin) {
        //visualizzo i campi in più per il bibliotecario
        document
            .querySelectorAll(".role-bibliotecario")
            .forEach(campo => campo.classList.remove("d-none"));

        //nascondo il campo 'Azioni' nella tabella
        document
            .querySelectorAll(".role-utente")
            .forEach(campo => campo.classList.add("d-none"));
    }

    popolaStati(CONTEXT);
}

function popolaStati(CONTEXT, tipoTabella = "ALL", storico = "ALL") {

    const selectStato = document.getElementById("stato");

    let stati = [];

    switch (tipoTabella) {

        case '1'://"PRESTITO":
            stati = CONTEXT.stati.prestito;
            break;

        case '2'://"PRENOTAZIONE":
            stati = CONTEXT.stati.prenotazione;
            break;

        default:
            stati = [
                ...CONTEXT.stati.prestito,
                ...CONTEXT.stati.prenotazione
            ];
    }

     // Filtro storico
    if (storico !== "ALL") {
        stati = stati.filter(s => String(s.storico) === storico);
    }

    selectStato.innerHTML = `
        <option value="ALL">Tutti gli stati</option>
        ${stati.map(s => `
            <option value="${s.codice}">
                ${s.descrizione}
            </option>
        `).join("")}
    `;
}

//renderPaginazione(data.total, page); -- DA FARE
function renderPrestiti(prestiti, CONTEXT) {

    const tbody = document.getElementById('tabellaPrestiti');

    const box = document.getElementById('messaggioPagina');
    box.classList.add('d-none');

    //per bibliotecario
    const isAdmin = CONTEXT?.isAdmin;
    //console.log("isAdmin =", isAdmin, typeof isAdmin);

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
                ${isAdmin ? `
                    <td>${m.email}</td>
                ` : ''}
                ${(!isRestituito /*&& !isAdmin*/) ? `
                    <td>
                        <button
                            class="btn btn-sm btn-warning btnRestituisci"
                            data-id-prestito="${m.id_prestito}">
                            Restituisci
                        </button>
                    </td>
                   ` : ''}
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
    document.getElementById('tipo').value = 'ALL';
    resetPrestiti();

}


/*function badgeStato(stato) {

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
}*/

function badgeStato(codice) {

    const stato =
        STATI.find(s => s.codice === codice);

    if (!stato) {
        return codice;
    }

    return `
        <span class="badge ${classeBadge(codice)}">
            ${stato.descrizione}
        </span>
    `;
}

function classeBadge(codice) {

    switch (codice) {

        case "ATTIVO":
            return "bg-warning text-dark";

        case "RESTITUITO":
            return "bg-success";

        case "SCADUTO":
            return "bg-danger";

        case "ATTESA":
            return "bg-info text-dark";

        case "EVASA":
            return "bg-primary";

        case "ANNULLATA":
            return "bg-secondary";

        default:
            return "bg-light text-dark";
    }
}


export {
    renderPrestiti,
    resetPrestiti,
    resetRicerca,
    configuraPagina,
    popolaStati
}