import * as Auth from './auth.js';

async function caricaDettaglioLibro(dati = null) {
    try {
        await Auth.initPage(false);

        const params = new URLSearchParams(window.location.search);
        const idLibro = params.get('id');

        if (!idLibro) {
            alert('Identificativo libro non valido');
            window.location.href = '/pages/catalogo.html';
            return;
        }

        const response = await fetch(`/materiali/${idLibro}`);

        if (!response.ok) {
            throw new Error(
                'Materiale non trovato'
            );
        }

        const libro = await response.json();

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
        document
            .getElementById('btnPrestito')
            .addEventListener(
                'click',
                () => apriModalPrestito(libro)
            );

        if (dati) {
            const box = document.getElementById('messaggioPrestito');

            box.innerHTML = `
                            <h5 class="alert-heading">
                                Prestito registrato
                            </h5>

                            <p>
                                La richiesta è stata registrata con successo.
                            </p>

                            <hr>

                            <p class="mb-0">
                                Codice prestito:
                                <strong>${dati.idPrestito}</strong>
                            </p>
                        `;

            box.classList.remove('d-none');

            box.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

    } catch (err) {
        console.error(err);
        alert('Errore durante il caricamento del materiale');
    }
}

async function apriModalPrestito(libroCorrente) {

    const user = await Auth.getCurrentUser();

    if (!user) {
        //window.location.href ='/pages/login.html'; //dopo il login bisogna ritornare qui
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `/pages/login.html?returnUrl=${returnUrl}`;
        return;
    }

    document.getElementById('modalTitolo').value = libroCorrente.titolo;
    document.getElementById('modalAutore').value = libroCorrente.autore;
    document.getElementById('modalUtente').value = user.email;

    aggiornaDatePrestito();

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                'prestitoModal'
            )
        );

    modal.show();
}

function aggiornaDatePrestito() {
    const mesi = Number(document.getElementById('durataPrestito').value);
    const oggi = new Date();
    const fine = new Date();
    fine.setMonth(fine.getMonth() + mesi);

    document.getElementById('dataInizio').value = oggi.toLocaleDateString('it-IT');
    document.getElementById('dataFine').value = fine.toLocaleDateString('it-IT');
}

async function confermaPrestito() {
    try {
        const idLibro = document.getElementById('prestitoModal').dataset.idLibro;
        const durata = Number(
            document.getElementById('durataPrestito').value
        );
        
        const response =
            await fetch('/prestiti',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idLibro, durataMesi })
                }
            );

        if (!response.ok) {
            const errore = await response.json();
            throw new Error(errore.errore);
        }

        const dati = await response.json();
        /*alert(
            'Prestito inserito correttamente'
        );*/

        //location.reload();
        //chiusura della finestra modale
        const modalElement = document.getElementById('prestitoModal');
         const modal = bootstrap.Modal.getInstance(modalElement);
         modal.hide();
        
        await caricaDettaglioLibro(datiPrestito);

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

document.addEventListener(
    'DOMContentLoaded',
    () => {

        caricaDettaglioLibro();

        document
            .getElementById('durataPrestito')
            .addEventListener(
                'change',
                aggiornaDatePrestito
            );

        document
            .getElementById('btnConfermaPrestito')
            .addEventListener(
                'click',
                confermaPrestito
            );

    }
);


