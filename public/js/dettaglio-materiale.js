async function caricaDettaglioLibro() {

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

        const disponibilita = document.getElementById('disponibilita');
        if (libro.copie_disponibili > 0) {
            disponibilita.innerHTML =
                `<span class="badge bg-success">Disponibile</span>`;
        } else {

            disponibilita.innerHTML =
                `<span class="badge bg-danger">Non disponibile</span>`;

            document.getElementById('btnPrestito').disabled = true;
        }

        const imgCopertina = document.getElementById('copertina');
        if (libro.copertina) {
            imgCopertina.src = `/images/covers/${libro.copertina}`;
        } else {
            imgCopertina.src ='/images/book-placeholder.png';
        }

    } catch (err) {
        console.error(err);
        alert('Errore durante il caricamento del materiale');
    }
}

document.addEventListener(
    'DOMContentLoaded',
    caricaDettaglioLibro
);