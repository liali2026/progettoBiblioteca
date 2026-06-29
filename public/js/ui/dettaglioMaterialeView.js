//GESTIONE DEL DOM
function mostraMateriale(libro) {
    
    document.getElementById('titolo').textContent = libro.titolo;
    document.getElementById('autore').textContent = libro.autore;
    document.getElementById('genere').textContent = libro.genere ?? '-';
    document.getElementById('editore').textContent = libro.casa_editrice ?? '-';
    document.getElementById('annoPubblicazione').textContent = libro.anno_pubblicazione ?? '-';
    document.getElementById('isbn').textContent = libro.isbn ?? '-';
    document.getElementById('descrizione').textContent = libro.descrizione ?? 'Nessuna descrizione disponibile.';

    //gestione della visualizzazione della disponibilità
    const disponibilita = document.getElementById('disponibilita');
    if (libro.copie_disponibili > 0) {
        disponibilita.innerHTML =
            `<span class="badge bg-success">Disponibile</span>`;
    } else {
        disponibilita.innerHTML =
            `<span class="badge bg-danger">Non disponibile</span>`;
        //document.getElementById('btnPrestito').disabled = true;
    }

    //copertina libro
    const imgCopertina = document.getElementById('copertina');
    if (libro.copertina) {
        imgCopertina.src = `/images/covers/${libro.copertina}`;
    } else {
        imgCopertina.src = '/images/book-placeholder.png';
    }

    document.getElementById('prestitoModal').dataset.idLibro = libro.id_libro;

    //aggiunta listener per l'apertura della finestra modale per la richiesta di prenotazione del libro
    /*document
        .getElementById('btnPrestito')
        .addEventListener(
            'click',
            () => apriModalPrestito(libro)
        );*/
}


function mostraMessaggio(html, tipo) {
    const box = document.getElementById('messaggioPagina');

    box.className = `alert alert-${tipo}`;

    box.innerHTML = html;

    box.classList.remove('d-none');

    box.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

function mostraMessaggioPrestito(dati) {

    mostraMessaggio(
        `
        <h5>Prestito registrato</h5>
        <p>
            La richiesta è stata registrata con successo. Codice prestito:
        <strong>${dati.idPrestito}</strong>
        </p>
        `,
        'success'
    );

}

function mostraErrore(testo) {

    mostraMessaggio(
        `
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        ${testo}
        `,
        'danger'
    );
}

function nascondiMessaggio() {

    const box = document.getElementById('messaggioPagina');

    box.classList.add('d-none');
    box.innerHTML = '';
}

export {
    mostraMateriale,
    mostraMessaggioPrestito,
    mostraErrore,
    nascondiMessaggio
}