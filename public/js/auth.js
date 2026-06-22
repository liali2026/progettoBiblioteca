/**
 * 
 * caricaUtente (se serve il login viene indicato dal parametro priv, di default a false)
 */
async function caricaUtente(priv = false) {
    try {
        const response = await fetch('/utenti/me');

        if (!response.ok) {
            if (priv) {
                window.location.href = '/pages/login.html';
            }
            return;
        }

        //se è necessaria una pagina privata (ed è stato effettuato il login), si prosegue
        const user = await response.json();
        document.getElementById('utenteLoggato').textContent = user.email;
        document.getElementById('utenteLoggato').classList.remove('d-none');
        document.getElementById('logoutButton').classList.remove('d-none');

        if (user.ruolo === 'BIBLIOTECARIO') {
            document.getElementById('adminSection').style.display = 'block';
        }

        //per gestire anche il bottone di logout in tutte le pagine
        const logoutButton = document.getElementById('logoutButton');

        if (logoutButton) {
            logoutButton.classList.remove('d-none');
            logoutButton.onclick = logout;
        }

    } catch (err) {
        console.error(err);
    }
}


/**
 * Logout
 */
async function logout() {
    try {
        await fetch('/utenti/logout', { method: 'POST' });

        //window.location.href = '/pages/login.html';
        window.location.href = '/index.html';

    } catch (err) {
        console.error(err);
    }

}