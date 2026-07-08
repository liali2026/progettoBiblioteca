async function ricercaById(idLibro) {

    const response = await fetch(`/materiali/${idLibro}`);

    /*if (!response.ok) {
        throw new Error('Errore server database: verificare che sia attivo');
    }

    return await response.json();*/
    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }

    return risultato;
}


async function ricercabyAutoreTitolo(titolo, autore) {
    const params = new URLSearchParams();
    if (titolo) {
        params.append('titolo', titolo);
    }

    if (autore) {
        params.append('autore', autore);
    }

    const response = await fetch(`/materiali?${params.toString()}`);

    /*if (!response.ok) {
        throw new Error('Errore server database: verificare che sia attivo');
    }

    return await response.json();*/
    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }
    return risultato;
}

async function getAllGeneri() {

    const response = await fetch(`/materiali/generi`);

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }

    return risultato;
}

/*async function insertItem(materiale) {
    const response = await fetch
        (`/materiali/admin/insert`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(materiale)
            }
        );

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }
    return risultato;
}*/

// gestione dell'immagine della copertina
async function insertItem(formData) {
    const response = await fetch
        (`/materiali/admin/insert`,
            {
                method: "POST",
                body: formData
            }
        );

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }
    return risultato;
}

/*async function updateItem(materiale) {

    const idMateriale = materiale.id_libro;

    const response = await fetch(
        `/materiali/admin/update/${idMateriale}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(materiale)
        }
    );

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }
    return risultato;
}*/

async function updateItem(formData) {

    const idMateriale = JSON.parse(formData.get("materiale")).id_libro;
    //console.log(idMateriale);

    const response = await fetch(
        `/materiali/admin/update/${idMateriale}`,
        {
            method: "PUT",
            body: formData
        }
    );

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }
    return risultato;
}

async function deleteItem(idMateriale) {

    console.log(idMateriale);
    const response = await fetch(
        `/materiali/admin/delete/${idMateriale}`,
        {
            method: "DELETE"
        }
    );

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }
    return risultato;
}

export {
    ricercaById,
    ricercabyAutoreTitolo,
    getAllGeneri,
    insertItem,
    updateItem,
    deleteItem
}