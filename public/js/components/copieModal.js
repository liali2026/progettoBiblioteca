function inizializza() {

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                'copieModal'
            )
        );
}

function apri() {

    const modalElement = document.getElementById('copieModal');
    const modal = bootstrap.Modal.getInstance(modalElement);

    document.getElementById("nrNuoveCopie").value = 1;

    modal.show();
}

function chiudi() {
    const modalElement = document.getElementById('copieModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

function getNumeroCopie() {

    const nrCopie = Number(
        document.getElementById("nrNuoveCopie").value
    );

    if (!Number.isInteger(nrCopie) || nrCopie < 1) {
        throw new Error(
            "Il numero di copie deve essere maggiore di zero."
        );
    }

    return nrCopie;
}


export {
    inizializza,
    apri,
    chiudi,
    getNumeroCopie
};