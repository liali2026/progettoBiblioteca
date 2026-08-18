const materialiModel = require('../models/materialiModel');
const Validation = require('../utils/validationUtils.js');

//GESTIONE MATERIALE
async function search(filters) {
    if (filters.idGenere === 'ALL') {
        filters.idGenere = null;
    }
    return materialiModel.search(filters);
}

async function findById(id) {
    const materiale = await materialiModel.findById(id);
    if (!materiale) {
        throw new Error('Materiale non trovato');
    }
    return materiale;
}

async function insertItem(materiale) {
    validaMateriale(materiale, true);
    return materialiModel.insertItem(materiale);
}

async function updateItem(materiale) {

    if (!materiale.idLibro) {
        throw new Error("Identificativo materiale mancante");
    }

    validaMateriale(materiale, false);
    return materialiModel.updateItem(materiale);
}
async function deleteItem(id) {
    return materialiModel.deleteItem(id);
}

function validaMateriale(materiale, requireCopies) {

    const errori = controllaDatiMateriale(materiale, requireCopies);
    if (errori.length === 0) {
        return;
    }

    const errore = new Error("Dati materiale non validi");
    errore.dettagli = errori;

    throw errore;
}

function controllaDatiMateriale(materiale, requireCopies) {
    const errori = [];

    if (!Validation.isRequired(materiale.titolo)) {
        errori.push({
            campo: "titolo",
            messaggio: "Inserire il titolo."
        });
    }

    if (!Validation.isRequired(materiale.autore)) {
        errori.push({
            campo: "autore",
            messaggio: "Inserire l'autore."
        });
    }

    if (!Validation.isRequired(materiale.idGenere)) {
        errori.push({
            campo: "genere",
            messaggio: "Selezionare il genere."
        });
    }

    if (!Validation.isRequired(materiale.casaEditrice)) {
        errori.push({
            campo: "editore",
            messaggio: "Inserire la casa editrice."
        });
    }

    if (!Validation.isValidISBN13(materiale.isbn)) {
        errori.push({
            campo: "isbn",
            messaggio: "ISBN non valido."
        });
    }

    if (!Validation.isValidPublicationYear(materiale.annoPubblicazione)) {
        errori.push({
            campo: "annoPubblicazione",
            messaggio: "L'anno di pubblicazione deve essere almeno 1450 e non futuro."
        });
    }

    if (requireCopies && !Validation.isPositiveInteger(materiale.nrCopie)) {
        errori.push({
            campo: "nrCopie",
            messaggio: "Il numero copie deve essere maggiore di zero."
        });
    }

    return errori;
}

async function getAllGeneri() {
    return materialiModel.getAllGeneri();
}

//GESTIONE COPIE
async function getCopie(id) {
    return materialiModel.getCopie(id);
}

async function addCopie(id, nrCopie) {
    if (!Validation.isPositiveInteger(nrCopie)) {
        throw new Error('Il numero di copie deve essere maggiore di zero.');
    }
    return materialiModel.addCopie(id, nrCopie);
}

async function deleteCopia(idMateriale, idCopia) {

    const copia = await materialiModel.findCopia(
        idMateriale,
        idCopia
    );

    if (!copia) {
        throw new Error("Copia non trovata.");
    }

    if (copia.stato !== "DISPONIBILE") {
        throw new Error(
            "Impossibile eliminare una copia attualmente in prestito."
        );
    }

    return await materialiModel.deleteCopia(idMateriale, idCopia);
    
}

module.exports = {
    search,
    findById,
    getAllGeneri,
    getCopie,
    insertItem,
    updateItem,
    deleteItem,
    addCopie,
    deleteCopia
};
