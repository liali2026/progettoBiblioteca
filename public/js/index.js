async function verificaSessione() {
    try {
        const response =
            await fetch('/utenti/me');

        if (!response.ok) {
            return;
        }

        document.getElementById('loginLink').classList.add('d-none');
        document.getElementById('registerLink').classList.add('d-none');
        document.getElementById('homeLink').classList.remove('d-none');

    } catch(err) {
        console.error(err);

    }

}

/*function ricercaRapida() {
    const testo =document.getElementById('ricerca').value.trim();
    window.location.href =`/pages/catalogo.html?search=${encodeURIComponent(testo)}`;
}

document.getElementById('btnRicerca').addEventListener('click', ricercaRapida);*/

verificaSessione();