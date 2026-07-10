function aggiornaNavbar(user, onLogout) {

    if (!user) {
        return;
    }

    // se utente è loggato, allora:
    // 1. devo nascondere i bottoni di Login e Registrazione
    const divLogInReg = document.getElementById("divLogInReg");
    if (divLogInReg) {
        divLogInReg.classList.add('d-none');
    }

    //2. mostrare l'utente e il bottone di logout
    const divUserLogout = document.getElementById("divUserLogout");
    if (divUserLogout) {

        //mostro il gruppo di utenza e di logout
        divUserLogout.classList.remove('d-none');

        //mostro utente loggato
        const utenteLoggato = document.getElementById('utenteLoggato');
        if (utenteLoggato) {
            utenteLoggato.textContent = user.email;
        }

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.onclick = onLogout;
        }
    }

    //mostro il tasto dell'area personale
    const areaPersonaleLink = document.getElementById('areaPersonaleLink');
    if (areaPersonaleLink) {
        areaPersonaleLink.classList.remove('d-none');
    }

    // non dovrebbe servire più in area-personale.html (non riguarda neanche la navbar..)
    /*const adminSection = document.getElementById('adminSection');
    if (adminSection && user.ruolo === 'BIBLIOTECARIO') {
        //document.getElementById('adminSection').style.display = 'block';
        document.getElementById('adminSection').classList.remove('d-none');
        document.getElementById('userSection').classList.add('d-none');
    }*/
}

export {
    aggiornaNavbar
}