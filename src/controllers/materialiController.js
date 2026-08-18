const materialiService = require('../services/materialiService');

async function search(req, res) {
    const materiali = await materialiService.search({
        titolo: req.query.titolo,
        autore: req.query.autore,
        isbn: req.query.isbn,
        anno: req.query.anno,
        idGenere: req.query.idGenere,
        soloDisponibili: req.query.soloDisponibili === 'true'
    });
    res.json(materiali);
}

async function findById(req, res) {
    const materiale = await materialiService.findById(req.params.id);
    res.json(materiale);
}

async function insertItem(req, res) {
    const materiale = parseMateriale(req);
    const risultato = await materialiService.insertItem(materiale);

    res.status(201).json({
        ...risultato,
        messaggio: 'Materiale inserito correttamente'
    });
}

async function updateItem(req, res) {
    const materiale = {
        ...parseMateriale(req),
        idLibro: Number(req.params.id)
    };
    const risultato = await materialiService.updateItem(materiale);

    res.json({
        ...risultato,
        messaggio: 'Materiale aggiornato correttamente'
    });
}

async function deleteItem(req, res) {
    const risultato = await materialiService.deleteItem(req.params.id);
    res.json({
        ...risultato,
        messaggio: 'Materiale cancellato correttamente'
    });
}

async function getAllGeneri(req, res) {
    res.json(await materialiService.getAllGeneri());
}

async function getCopie(req, res) {
    res.json(
        await materialiService.getCopie(Number(req.params.idMateriale))
    );
}

async function addCopie(req, res) {
    const risultato = await materialiService.addCopie(
        Number(req.params.idMateriale),
        Number(req.body.nrCopie)
    );
    res.status(201).json({
        ...risultato,
        messaggio: 'Copie inserite correttamente'
    });
}

async function deleteCopia(req, res) {
    const risultato = await materialiService.deleteCopia(
        Number(req.params.idMateriale),
        Number(req.params.idCopia)
    );
    res.json({
        ...risultato,
        messaggio: 'Copia cancellata correttamente'
    });
}

function parseMateriale(req) {
    const materiale = JSON.parse(req.body.materiale);
    if (req.file) {
        materiale.copertina = req.file.filename;
    }
    return materiale;
}

module.exports = {
    search,
    findById,
    insertItem,
    updateItem,
    deleteItem,
    getAllGeneri,
    getCopie,
    addCopie,
    deleteCopia
};
