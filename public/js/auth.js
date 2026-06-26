/*window.Auth = {*/

//async getCurrentUser() {
async function getCurrentUser() {
    try {
        const response = await fetch('/utenti/me');

        if (!response.ok) {
            return null;
        }

        const user = await response.json();
        return user;

    } catch (err) {
        console.error(err);
        return null;
    }
}//,

/**
 * Logout
 */
//async logout() {
async function logout() {
    try {
        await fetch('/utenti/logout', { method: 'POST' });

        //window.location.href = '/pages/login.html';
        window.location.href = '/index.html';

    } catch (err) {
        console.error(err);
    }

}//,

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
}//,

//async initPage(requireLogin = false) {
async function initPage(requireLogin = false) {
    //const user = await this.getCurrentUser();
    const user = await getCurrentUser();

    if (!user && requireLogin) {
        window.location.href = '/pages/login.html';
        return null;
    }

    //this.aggiornaLayout(user);
    aggiornaLayout(user);
    return user;

}
//}

export {
    getCurrentUser,
    logout,
    aggiornaLayout,
    initPage
};