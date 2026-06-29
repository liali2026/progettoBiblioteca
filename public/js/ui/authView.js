function aggiornaLayout(user) {

    if (!user) {
        return;
    }

    const utenteLoggato = document.getElementById('utenteLoggato');
    if (utenteLoggato) {
        utenteLoggato.textContent = user.email;
        utenteLoggato.classList.remove('d-none');
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.classList.remove('d-none');
        //logoutButton.onclick = Auth.logout;
        logoutButton.onclick = logout;
    }

    // se l'utente è loggato rimuovo il bottone di login e di registrazione
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.classList.add('d-none');
    }
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.classList.add('d-none');
    }

    /*se ritorno alla pagina iniziale index.html con utente già loggato abilito
      la visualizzazione del bottone 'Area Personale'
    */
    const areaPersonaleLink = document.getElementById('areaPersonaleLink');
    if (areaPersonaleLink) {
        areaPersonaleLink.classList.remove('d-none');
    }

    const adminSection = document.getElementById('adminSection');
    if (adminSection && user.ruolo === 'BIBLIOTECARIO') {
        document.getElementById('adminSection').style.display = 'block';
    }
}

export {
    aggiornaLayout
}