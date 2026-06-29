// GESTIONE DELLE CHIAMATE HTTP
async function ricercaMateriale(idLibro) {

    const response = await fetch(`/materiali/${idLibro}`);

    if (!response.ok) {
        throw new Error(
            'Materiale non trovato'
        );
    }

    return await response.json();
}

async function creaPrestito(idLibro, durataMesi) {

    const response = await fetch(
        '/prestiti',
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

export {
    ricercaMateriale,
    creaPrestito
}