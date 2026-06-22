let materiali = [];

/**
 * Carica il catalogo dal backend
 */
async function caricaCatalogo() {
    try {
        const response = await fetch('/materiali');
        if (!response.ok) {
            throw new Error(
                'Errore nel caricamento del catalogo'
            );
        }
        materiali = await response.json();
        visualizzaMateriali(materiali);
    } catch (err) {
        console.error(err);
        alert('Errore nel caricamento del catalogo');
    }
}

/**
 * Mostra i materiali nella tabella
 */
function visualizzaMateriali(listaMateriali) {
    const tbody = document.getElementById('tabellaMateriali');
    tbody.innerHTML = '';
    listaMateriali.forEach(materiale => {
        tbody.innerHTML += `
            <tr>
                <td>${materiale.titolo}</td>
                <td>${materiale.autore}</td>
                <td>${materiale.genere}</td>
                <td>${materiale.copie_disponibili}</td>
                <td><a href="/pages/dettaglio-materiale.html?id=${materiale.id_materiale}" class="btn btn-sm btn-primary">Dettaglio</a>
                </td>
            </tr>
        `;
    });

}

/**
 * Ricerca per titolo o autore
 */
function ricercaMateriali() {

    const testoRicerca =
        document.getElementById('campoRicerca').value.toLowerCase().trim();

    const risultati =
        materiali.filter(materiale =>
            materiale.titolo
                .toLowerCase()
                .includes(testoRicerca)
            ||
            materiale.autore
                .toLowerCase()
                .includes(testoRicerca)
        );
    visualizzaMateriali(risultati);
}

/**
 * Event listeners
 */
document.getElementById('btnRicerca').addEventListener('click', ricercaMateriali);
document.getElementById('campoRicerca').addEventListener('keyup', ricercaMateriali);
document.getElementById('logoutButton').addEventListener('click', logout);

/**
 * Avvio pagina
 */
async function inizializzaPagina() {
    await caricaUtente();
    await caricaCatalogo();
}

inizializzaPagina();