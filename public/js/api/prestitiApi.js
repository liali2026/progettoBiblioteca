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

async function ricercaAllPrestiti() {

    const response = await fetch('/prestiti/ricercaAllPrestiti');

    if (!response.ok) {
        const errore = await response.json();
        throw new Error(errore.errore);
    }

    return await response.json();
}

export {
    creaPrestito,
    ricercaAllPrestiti
}