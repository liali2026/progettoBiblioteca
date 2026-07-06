const materialiModel = require('../models/materialiModel');

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
    return await materialiModel.insertItem(materiale);
}

async function updateItem(materiale){

     if (!materiale.id_libro) {
        throw new Error("Identificativo materiale mancante");
    }

    return await materialiModel.updateItem(materiale);
}
async function deleteItem(id){
    return await materialiModel.deleteItem(id);
}

module.exports = {
    search,
    findById,
    getAllGeneri,
    insertItem,
    updateItem,
    deleteItem
};