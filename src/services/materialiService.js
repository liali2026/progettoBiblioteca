const materialiModel = require('../models/materialiModel');

async function search(titolo, autore){
    return await materialiModel.search(titolo, autore);
}

async function findById(id){
    return await materialiModel.findById(id);
}

module.exports = {
    search,
    findById
};