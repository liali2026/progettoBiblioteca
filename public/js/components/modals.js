function getModal(id) {
    const element = document.getElementById(id);
    return bootstrap.Modal.getOrCreateInstance(element);
}

const prestitoModal = {
    inizializza() {
        document
            .getElementById('durataPrestito')
            .addEventListener('change', aggiornaDatePrestito);
        aggiornaDatePrestito();
    },

    apri(libro, utente) {
        document.getElementById('modalTitolo').value = libro.titolo;
        document.getElementById('modalAutore').value = libro.autore;
        document.getElementById('modalUtente').value = utente.email;
        aggiornaDatePrestito();
        getModal('prestitoModal').show();
    },

    chiudi() {
        getModal('prestitoModal').hide();
    },

    getDurata() {
        return Number(document.getElementById('durataPrestito').value);
    }
};

const copieModal = {
    inizializza() {
        getModal('copieModal');
    },

    apri() {
        document.getElementById('nrNuoveCopie').value = 1;
        getModal('copieModal').show();
    },

    chiudi() {
        getModal('copieModal').hide();
    },

    getNumero() {
        const value = Number(
            document.getElementById('nrNuoveCopie').value
        );

        if (!Number.isInteger(value) || value < 1) {
            throw new Error(
                'Il numero di copie deve essere maggiore di zero.'
            );
        }
        return value;
    }
};

function aggiornaDatePrestito() {
    const mesi = Number(
        document.getElementById('durataPrestito').value
    );
    const oggi = new Date();
    const fine = new Date(oggi);
    fine.setMonth(fine.getMonth() + mesi);

    document.getElementById('dataInizio').value =
        oggi.toLocaleDateString('it-IT');
    document.getElementById('dataFine').value =
        fine.toLocaleDateString('it-IT');
}

export {
    prestitoModal,
    copieModal
};
