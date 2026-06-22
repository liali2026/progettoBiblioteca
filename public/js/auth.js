/**
 * 
 * caricaUtente (per funzionalità private)
 */
async function caricaUtentePriv() {
    try {
        const response = await fetch('/utenti/me');

        if (!response.ok) {
            window.location.href ='/pages/login.html';
            return;
        }

        const user = await response.json();
        document.getElementById('utenteLoggato').textContent =user.email;
        if (user.ruolo === 'BIBLIOTECARIO') {
            document.getElementById('adminSection').style.display ='block';
        }

    } catch(err) {
        console.error(err);
    }
}


/**
 * 
 * caricaUtente (per funzionalità pubbliche)
 */
async function caricaUtentePub() {
    try {
        const response = await fetch('/utenti/me');
        if (!response.ok) {
            return;
        }
        const user = await response.json();
        document.getElementById('utenteLoggato').textContent = user.email;
        document.getElementById('utenteLoggato').classList.remove('d-none');
        document.getElementById('logoutButton').classList.remove('d-none');
    } catch (err) {
        console.error(err);
        window.location.href = '/pages/login.html';
    }
}


/**
 * Logout
 */
async function logout() {
    try {
        await fetch('/utenti/logout', { method: 'POST' });

        window.location.href = '/pages/login.html';

    } catch (err) {
        console.error(err);
    }

}