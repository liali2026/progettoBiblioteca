function isValidISBN13(isbn) {

    isbn = isbn.replaceAll("-", "");

    //controllo che siano 13 numeri con regex (inizio stringa + 13 numeri + fine stringa)
    if (!/^\d{13}$/.test(isbn))
        return false;

    let somma = 0;

    //le cifre vengono moltiplicate in alternativa per 1 e per 3
    //i prodotti vengono sommati
    for (let i = 0; i < 12; i++) {

        const n = Number(isbn[i]);

        somma += (i % 2 === 0)
            ? n
            : n * 3;
    }

    //calcolo del check digit
    const check =
        (10 - (somma % 10)) % 10;

    //confronto il check digit con l'ultima cifra
    return check === Number(isbn[12]);
}


function isValidPublicationYear(year) {

    const anno = Number(year);

    if (!Number.isInteger(anno)) {
        return false;
    }

    const annoCorrente = new Date().getFullYear();

    return anno > 0 && anno <= annoCorrente;
}

function isRequired(value) {
    return value !== null &&
        value !== undefined &&
        String(value).trim() !== "";
}

function isPositiveInteger(value) {

    const numero = Number(value);

    return Number.isInteger(numero) && numero > 0;
}

//raccoglie tutti gli errori fatti dall'utente in fase di insert/update di un materiale
function raccogliErrori(materiale) {
    const errori = [];

    if (!isRequired(materiale.titolo)) {
        errori.push("Inserire il titolo.");
    }

    if (!isRequired(materiale.autore)) {
        errori.push("Inserire l'autore.");
    }

    if (!isRequired(materiale.genere)) {
        errori.push("Inserire il genere.");
    }

    if (!isRequired(materiale.casaEditrice)) {
        errori.push("Inserire l'editore.");
    }

    if (!isValidISBN13(materiale.isbn)) {
        errori.push("ISBN non valido");
    }

    if (!isValidPublicationYear(materiale.annoPubblicazione)) {
        errori.push("Anno di pubblicazione deve essere maggiore del 1450 e non deve essere nel futuro.");
    }

    if (!isPositiveInteger(materiale.nrCopie)) {
        errori.push("Il numero di copie deve essere maggiore di zero.");
    }

   return errori;
}

module.exports ={
    isRequired,
    isValidISBN13,
    isValidPublicationYear,
    isPositiveInteger,
    raccogliErrori
}

