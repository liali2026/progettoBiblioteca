const materialiModel = require('../models/materialiModel');
const Validation = require('../utils/validationUtils.js');

async function search(titolo, autore){
    return await materialiModel.search(titolo, autore);
}

async function findById(id){
    return await materialiModel.findById(id);
}

async function getAllGeneri(){
    return await materialiModel.getAllGeneri();
}

async function insertItem(materiale){
    //validaMateriale(materiale);
    return await materialiModel.insertItem(materiale);
}

async function updateItem(materiale){

     if (!materiale.idLibro) {
        throw new Error("Identificativo materiale mancante");
    }

    //validaMateriale(materiale);

    return await materialiModel.updateItem(materiale);
}
async function deleteItem(id){
    return await materialiModel.deleteItem(id);
}

function validaMateriale(materiale) {

    const errori = Validation.raccogliErrori(materiale);

    if (errori.length === 0) {
        return;
    }

    throw new Error(
        errori.map(e => e.messaggio).join("\n")
    );
}

module.exports = {
    search,
    findById,
    getAllGeneri,
    insertItem,
    updateItem,
    deleteItem
};