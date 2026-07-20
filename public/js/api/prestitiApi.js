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

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }

    return risultato;
}

async function ricercaPrestiti(titolo, autore, stato, utente, tipo, storico) {

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
                utente, //aggiunta per bibliotecario
                tipo, //gestione delle prenotazioni
                storico
            })
        });

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }

    return risultato;
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

    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }

    return risultato;
}

async function getStati() {

    const response = await fetch(`/prestiti/config/stati`);
    const risultato = await response.json();

    if (!response.ok) {
        throw new Error(risultato.message);
    }
    return risultato;
}

export {
    creaPrestito,
    ricercaPrestiti,
    restituisciPrestito,
    getStati
}