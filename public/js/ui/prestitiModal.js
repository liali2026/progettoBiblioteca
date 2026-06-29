export function apri(libro, utente){

    document.getElementById('modalTitolo').value = libro.titolo;
    document.getElementById('modalAutore').value = libro.autore;
    document.getElementById('modalUtente').value = utente.email;

    aggiornaDate();

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                'prestitoModal'
            )
        );

    modal.show();
}

export function chiudi() {
    const modalElement = document.getElementById('prestitoModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

export function getDurataPrestito() {
    return Number(
        document.getElementById('durataPrestito').value
    );
}

export function inizializza() {

    document
        .getElementById('durataPrestito')
        .addEventListener(
            'change',
            aggiornaDate
        );

    aggiornaDate();
}

function aggiornaDate() {
    const mesi = Number(document.getElementById('durataPrestito').value);
    const oggi = new Date();
    const fine = new Date();
    fine.setMonth(fine.getMonth() + mesi);

    document.getElementById('dataInizio').value = oggi.toLocaleDateString('it-IT');
    document.getElementById('dataFine').value = fine.toLocaleDateString('it-IT');
}
