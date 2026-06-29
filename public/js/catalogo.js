import * as Auth from './auth.js';
import * as NavbarView from './ui/navbarView.js';
import * as BreadcrumbView from './ui/breadcrumbView.js';

let materiali = [];

/**
 * Ricerca per titolo e/o autore
 */

async function ricerca(titolo, autore) {
    try {
        const params = new URLSearchParams();
        if (titolo) {
            params.append('titolo', titolo);
        }

        if (autore) {
            params.append('autore', autore);
        }

        const response = await fetch(`/materiali?${params.toString()}`);
        if (!response.ok) {
            throw new Error(
                'Errore server'
            );
        }

        materiali = await response.json();
        return materiali;

    } catch (err) {

        console.error(err);
        return null;
    }
}

function mostraMessaggio(testo, tipo = 'info') {

    document.getElementById('tabellaMateriali').innerHTML = '';

    const box = document.getElementById('messaggioRisultati');
    box.textContent = testo;
    box.className = `alert alert-${tipo}`;
    box.classList.remove('d-none');
}

function renderCatalogo(materiali) {

    const tbody = document.getElementById('tabellaMateriali');
    const box = document.getElementById('messaggioRisultati');

    // nessun risultato
    if (!materiali || materiali.length === 0) {
        mostraMessaggio('Nessun materiale trovato con i criteri di ricerca.', 'warning');
        return;
    }

    //risultati trovati
    box.classList.add('d-none');
    tbody.innerHTML =
        materiali.map(m => `
            <tr>
                <td>${m.titolo}</td>
                <td>${m.autore}</td>
                <td>${m.genere ?? '-'}</td>
                <td>${m.copie_disponibili}</td>
                <td>
                    <a 
                        href="/pages/dettaglio_materiale.html?id=${m.id_libro}"
                        class="btn btn-sm btn-primary">
                        Dettagli
                    </a>
                </td>
            </tr>
        `).join('');
}


async function ricercaMateriali() {

    const titolo = document.getElementById('titolo').value.toLowerCase().trim();
    const autore = document.getElementById('autore').value.toLowerCase().trim();
    const risultati = await ricerca(titolo, autore);

    if (!risultati) {
        mostraMessaggio('Errore durante il caricamento dei materiali. Riprova più tardi.', 'danger');
    } else {
        renderCatalogo(risultati);
        //renderPaginazione(data.total, page); -- DA FARE
    }
}

function resetRicerca() {

    document.getElementById('titolo').value = '';
    document.getElementById('autore').value = '';

    // reset paginazione + ricerca --DA FARE
    //cercaMateriali(1);
}


/**
 * Event listeners
 */
document.getElementById('btnRicerca').addEventListener('click', ricercaMateriali);
document.getElementById('btnPulisci').addEventListener('click', resetRicerca);

/**
 * Avvio pagina
 */
async function inizializzaPagina() {
    NavbarView.render('home');
    BreadcrumbView.render([
        {
            label: "Home",
            href: "/"
        },
        {
            label: "Catalogo",
            active: true
        }
    ]);

    await Auth.initPage();



}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
