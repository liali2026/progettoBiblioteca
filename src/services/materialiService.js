const materialiModel = require('../models/materialiModel');
const Validation = require('../utils/validationUtils.js');

//GESTIONE MATERIALE
async function search(titolo, autore, anno, idGenere, soloDisponibili) {
    if (idGenere === 'ALL'){
        idGenere = null;
    }
    return await materialiModel.search(titolo, autore, anno, idGenere, soloDisponibili);
}

async function findById(id) {
    return await materialiModel.findById(id);
}

async function insertItem(materiale) {
    validaMateriale(materiale);
    return await materialiModel.insertItem(materiale);
}

async function updateItem(materiale) {

    if (!materiale.idLibro) {
        throw new Error("Identificativo materiale mancante");
    }

    validaMateriale(materiale);
    return await materialiModel.updateItem(materiale);
}
async function deleteItem(id) {
    return await materialiModel.deleteItem(id);
}

function validaMateriale(materiale) {

    const errori = controllaDatiMateriale(materiale);
    if (errori.length === 0) {
        return;
    }

    const errore = new Error("Dati materiale non validi");
    errore.dettagli = errori;

    throw errore;
}

function controllaDatiMateriale(materiale) {
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
            messaggio: "Anno di pubblicazione deve essere maggiore del 1450 e non deve essere nel futuro."
        });
    }

    if (!Validation.isPositiveInteger(materiale.nrCopie)) {
        errori.push({
            campo: "nrCopie",
            messaggio: "Il numero copie deve essere maggiore di zero."
        });
    }

    return errori;
}

async function getAllGeneri() {
    return await materialiModel.getAllGeneri();
}

//GESTIONE COPIE
async function getCopie(id) {
    return await materialiModel.getCopie(id);
}

async function addCopie(id, nrCopie) {
    //CONTROLLI DA INSERIRE QUI
    return await materialiModel.addCopie(id, nrCopie);
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