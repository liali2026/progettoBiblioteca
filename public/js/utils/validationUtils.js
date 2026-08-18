export function validaMateriale(materiale, requireCopies = true) {
    const errori = [];

    required(errori, materiale.titolo, 'titolo', 'Inserire il titolo.');
    required(errori, materiale.autore, 'autore', "Inserire l'autore.");
    required(errori, materiale.idGenere, 'genere', 'Selezionare il genere.');
    required(
        errori,
        materiale.casaEditrice,
        'editore',
        'Inserire la casa editrice.'
    );

    if (!isValidISBN13(materiale.isbn)) {
        errori.push({
            campo: 'isbn',
            messaggio: 'ISBN non valido.'
        });
    }

    if (!isValidPublicationYear(materiale.annoPubblicazione)) {
        errori.push({
            campo: 'annoPubblicazione',
            messaggio:
                'L’anno di pubblicazione deve essere almeno 1450 e non futuro.'
        });
    }

    if (requireCopies && !isPositiveInteger(materiale.nrCopie)) {
        errori.push({
            campo: 'nrCopie',
            messaggio: 'Il numero copie deve essere maggiore di zero.'
        });
    }

    if (errori.length) {
        const error = new Error('Dati materiale non validi');
        error.dettagli = errori;
        throw error;
    }
}

function required(errori, value, campo, messaggio) {
    if (value === null
        || value === undefined
        || String(value).trim() === '') {
        errori.push({ campo, messaggio });
    }
}

function isValidISBN13(value) {
    const isbn = String(value || '').replaceAll('-', '');
    if (!/^\d{13}$/.test(isbn)) {
        return false;
    }

    const sum = [...isbn.slice(0, 12)].reduce(
        (total, digit, index) =>
            total + Number(digit) * (index % 2 === 0 ? 1 : 3),
        0
    );
    return (10 - (sum % 10)) % 10 === Number(isbn[12]);
}

function isValidPublicationYear(value) {
    const year = Number(value);
    return Number.isInteger(year)
        && year >= 1450
        && year <= new Date().getFullYear();
}

function isPositiveInteger(value) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0;
}
