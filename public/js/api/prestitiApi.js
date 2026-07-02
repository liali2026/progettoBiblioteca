async function creaPrestito(idLibro, durataMesi) {

    const response = await fetch(
        '/prestiti/creaPrestito',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idLibro,
                durataMesi
            })
        }
    );

    if (!response.ok) {
        const errore = await response.json();
        throw new Error(errore.errore);
    }

    return await response.json();
}

//async function ricercaPrestiti(titolo, autore, stato) {
async function ricercaPrestiti(titolo, autore, stato, utente) {

    const response = await fetch(
        '/prestiti/ricercaPrestiti',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titolo,
                autore,
                stato,
                utente //aggiunta per bibliotecario
            })
        });

    if (!response.ok) {
        const errore = await response.json();
        throw new Error(errore.errore);
    }

    return await response.json();
}

async function restituisciPrestito(idPrestito) {
    const response = await fetch(
        '/prestiti/restituisciPrestito',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idPrestito
            })
        }
    );

    if (!response.ok) {
        const errore = await response.json();
        throw new Error(errore.errore);
    }

    return await response.json();
}
export {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito
}