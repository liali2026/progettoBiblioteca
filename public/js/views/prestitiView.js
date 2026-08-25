import { escapeHtml } from '../components/commonLayout.js';

let STATI = [];

function configuraPagina(CONTEXT) {
    STATI = [
        ...(CONTEXT.stati.prestito || []),
        ...(CONTEXT.stati.prenotazione || [])
    ];
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

    popolaStati(CONTEXT, "1", "ALL"); //popolo inizialmente con PRESTITI sia in corso sia restituiti
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

function renderPrestiti(prestiti, CONTEXT) {

    const tbody = document.getElementById('tabellaPrestiti');

    const box = document.getElementById('messaggioPagina');
    box.classList.add('d-none');

    const isAdmin = CONTEXT?.isAdmin;

    // Aggiorno la testata nello stesso momento in cui
    // aggiorno i dati della tabella
    const tipo = document.getElementById("tipo").value;
    renderTestata(CONTEXT, tipo);

    tbody.innerHTML = prestiti.map(m => {

        let colonneSpecifiche = "";
        let azioni = '<td>-</td>';

        if (Number(m.tipo) === 1) {
            // PRESTITO
            const canReturn =
                ['ATTIVO', 'SCADUTO'].includes(m.stato)
                && m.id_prestito;

            if (canReturn) {
                azioni = `
                        <td>
                            <button
                                class="btn btn-sm btn-warning btnRestituisci"
                                data-id-prestito="${m.id_prestito}">
                                Restituisci
                            </button>
                        </td>
                    `;
            }

            colonneSpecifiche = `
                <td>${formattaData(m.data_inizio)}</td>
                <td>${formattaData(m.data_fine)}</td>
                <td>
                    ${m.data_restituzione
                    ? formattaData(m.data_restituzione)
                    : '-'}
                </td>
                
            `;

        } else {

            // PRENOTAZIONE
            const canCancel =
                m.stato === 'ATTESA'
                && m.id_prestito;

            if (canCancel) {
                azioni = `
                        <td>
                            <button
                                class="btn btn-sm btn-danger btnAnnullaPrenotazione"
                                data-id-prenotazione="${m.id_prestito}">
                                Annulla
                            </button>
                        </td>
                        `;
            }
            colonneSpecifiche = `
                <td>${formattaData(m.data_inizio)}</td>
                <td>
                    ${m.data_restituzione
                    ? formattaData(m.data_restituzione)
                    : '-'}
                </td>
            `;
        }
        return `
                <tr>
                    <td>${escapeHtml(m.titolo)}</td>
                    <td>${escapeHtml(m.autore)}</td>
                    <td>${escapeHtml(m.genere ?? '-')}</td>
                    ${colonneSpecifiche}
                    <td>${badgeStato(m.stato)}</td>
                    ${isAdmin ? `
                        <td>${escapeHtml(m.email)}</td>
                    ` : ''}
                    ${azioni}
                </tr>
            `;

    }).join('');
}

function renderTestata(CONTEXT, tipo) {

    const thead = document.getElementById("testataPrestiti");
    const titolo = document.getElementById("titoloDettagli");

    const isAdmin = CONTEXT?.isAdmin;

    let html = `
        <tr>
            <th>Titolo</th>
            <th>Autore</th>
            <th>Genere</th>
    `;

    if (tipo === "1") {

        // PRESTITI
        titolo.textContent = "Prestiti";

        html += `
            <th>Data Inizio Prestito</th>
            <th>Data Prevista Fine Prestito</th>
            <th>Data Restituzione</th>
            <th>Stato Prestito</th>
        `;

    } else if (tipo === "2") {

        // PRENOTAZIONI
        titolo.textContent = "Prenotazioni";
        html += `
            <th>Data Prenotazione</th>
            <th>Data Chiusura</th>
            <th>Stato Prenotazione</th>
        `;

    }/* else {

        // PRESTITI + PRENOTAZIONI
        titolo.textContent = "Prestiti e Prenotazioni";
        html += `
            <th>Data Inizio Prestito/Prenotazione</th>
            <th>Data Fine Prestito</th>
            <th>Data Restituzione</th>
            <th>Stato</th>
        `;
    }*/

    if (isAdmin) {
        html += `
            <th>Utente</th>
        `;
    }

    html += `
            <th>Azioni</th>
        </tr>
    `;

    thead.innerHTML = html;
}

function resetPrestiti(CONTEXT) {
    document.getElementById('tabellaPrestiti').innerHTML = '';
    //devo resettare anche i titoli delle colonne
    const tipo = document.getElementById("tipo").value;
    renderTestata(CONTEXT, tipo);
}

function resetRicerca() {

    document.getElementById('titolo').value = '';
    document.getElementById('autore').value = '';
    document.getElementById('utente').value = '';
    document.getElementById('tipo').value = '1'; //resetto sui prestiti
    document.getElementById('storico').value = 'ALL';
    document.getElementById('stato').value = 'ALL';
    resetPrestiti();

}

function badgeStato(codice) {

    const stato =
        STATI.find(s => s.codice === codice);

    if (!stato) {
        return codice;
    }

    return `
        <span class="badge ${classeBadge(codice)}">
            ${escapeHtml(stato.descrizione)}
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

function formattaData(data) {
    return data
        ? new Date(data).toLocaleDateString('it-IT')
        : '';
}
