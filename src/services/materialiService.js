const materialiModel = require('../models/materialiModel');

async function findAll() {
    return await materialiModel.findAll();
}

module.exports = {
    findAll
};