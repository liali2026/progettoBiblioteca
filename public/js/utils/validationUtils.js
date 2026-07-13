
//validazione ISBN
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


//validazione anno di pubblicazione
function isValidPublicationYear(year) {

    const anno = Number(year);

    if (!Number.isInteger(anno)) {
        return false;
    }

    const annoCorrente = new Date().getFullYear();

    return anno > 0 && anno <= annoCorrente;
}

//obbligatorietà dei campi
function isRequired(value) {
    return value !== null &&
        value !== undefined &&
        String(value).trim() !== "";
}

//controllo sui campi numerici
function isPositiveInteger(value) {

    const numero = Number(value);

    return Number.isInteger(numero) && numero > 0;
}

//validazione dei dati del materiale sia in insert sia in update
function controllaDatiMateriale(materiale) {

    const errori = [];

    if (!isRequired(materiale.titolo)) {
        errori.push({
            campo: "titolo",
            messaggio: "Inserire il titolo."
        });
    }

    if (!isRequired(materiale.autore)) {
        errori.push({
            campo: "autore",
            messaggio: "Inserire l'autore."
        });
    }

    if (!isRequired(materiale.idGenere)) {
        errori.push({
            campo: "genere",
            messaggio: "Selezionare il genere."
        });
    }

    if (!isRequired(materiale.casaEditrice)) {
        errori.push({
            campo: "editore",
            messaggio: "Inserire la casa editrice."
        });
    }

    if (!isValidISBN13(materiale.isbn)) {
        errori.push({
            campo: "isbn",
            messaggio: "ISBN non valido."
        });
    }

    if (!isValidPublicationYear(materiale.annoPubblicazione)) {
        errori.push({
            campo: "annoPubblicazione",
            messaggio: "Anno di pubblicazione deve essere maggiore del 1450 e non deve essere nel futuro."
        });
    }

    if (!isPositiveInteger(materiale.nrCopie)) {
        errori.push({
            campo: "nrCopie",
            messaggio: "Il numero copie deve essere maggiore di zero."
        });
    }

    /*if (errori.length > 0) {

        const messaggio =
            "<ul><li>" +
            errori
                .map(errore => errore.messaggio)
                .join("</li><li>") +
            "</li></ul>";

        const errore = new Error(messaggio);

        // aggiungo gli errori strutturati per la View
        errore.dettagli = errori;

        throw errore;
    }

    return true;*/
    return errori;
}

export async function validaMateriale(materiale){
    function validaMateriale(materiale) {
    
        const errori = controllaDatiMateriale(materiale);
        if (errori.length === 0) {
            return;
        }
    
        const errore = new Error("Dati materiale non validi");
        errore.dettagli = errori;
    
        throw errore;
    }
}