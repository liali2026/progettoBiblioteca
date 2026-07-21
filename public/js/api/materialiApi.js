//GESTIONE DEI MATERIALI
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

/*async function ricercabyAutoreTitolo(titolo, autore) {
    const params = new URLSearchParams();
    if (titolo) {
        params.append('titolo', titolo);
    }

    if (autore) {
        params.append('autore', autore);
    }

    const response = await fetch(`/materiali?${params.toString()}`);

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }
    return risultato;
}*/

async function ricercaMateriali(titolo, autore, anno, idGenere, soloDisponibili) {
    const params = new URLSearchParams();
    if (titolo) {
        params.append('titolo', titolo);
    }

    if (autore) {
        params.append('autore', autore);
    }

    if (anno) {
        params.append('anno', anno);
    }

    if (idGenere) {
        params.append('idGenere', idGenere);
    }

    if (soloDisponibili) {
        params.append('soloDisponibili', soloDisponibili);
    }

    const response = await fetch(`/materiali?${params.toString()}`);

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }
    return risultato;
}

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

    const dati = await response.json();

    if (!response.ok) {
        const errore = new Error(dati.message);
        errore.dettagli = dati.dettagli;
        throw errore;
    }
    return dati;
}

async function deleteItem(idMateriale) {

    //console.log(idMateriale);
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

//GENERI
async function getAllGeneri() {

    const response = await fetch(`/materiali/generi`);

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }

    return risultato;
}

//GESTIONE DELLE COPIE
async function getCopie(idMateriale) {

    const response = await fetch(`/materiali/admin/${idMateriale}/copies`);

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }

    return risultato;
}

async function addCopie(idMateriale, nrCopie) {

    const response = await fetch(
        `/materiali/admin/${idMateriale}/copies`,
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    idMateriale: idMateriale,
                    nrCopie: nrCopie
                })
        }
    );

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }

    return risultato;
}

async function deleteCopia(idMateriale, idCopia) {

    const response = await fetch(
        `/materiali/admin/${idMateriale}/copies/${idCopia}`,
        {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    idMateriale: idMateriale,
                    idCopia: idCopia
                })
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
    //ricercabyAutoreTitolo,
    ricercaMateriali,
    insertItem,
    updateItem,
    deleteItem,
    getAllGeneri,
    getCopie,
    addCopie,
    deleteCopia
}