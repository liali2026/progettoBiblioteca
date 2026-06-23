const materialiModel = require('../models/materialiModel');

/*async function findAll() {
    return await materialiModel.findAll();
}*/

async function search(titolo, autore){
    return await materialiModel.search(titolo, autore);
}

module.exports = {
    search
};