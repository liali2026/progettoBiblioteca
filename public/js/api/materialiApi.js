async function ricercaById(idLibro) {

    const response = await fetch(`/materiali/${idLibro}`);

    if (!response.ok) {
        throw new Error('Errore server database: verificare che sia attivo');
    }

    return await response.json();
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
    if (!response.ok) {
        throw new Error('Errore server database: verificare che sia attivo');
    }

    return await response.json();
}

async function deleteMateriale(){
    
}

export {
    ricercaById,
    ricercabyAutoreTitolo
}