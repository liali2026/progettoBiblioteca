window.Auth = {

    async getCurrentUser() {
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
    },

    /**
     * Logout
     */
    async logout() {
        try {
            await fetch('/utenti/logout', { method: 'POST' });

            //window.location.href = '/pages/login.html';
            window.location.href = '/index.html';

        } catch (err) {
            console.error(err);
        }

    },

    aggiornaLayout(user) {

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
            logoutButton.onclick = Auth.logout;
        }

        const adminSection = document.getElementById('adminSection');
        if (adminSection && user.ruolo === 'BIBLIOTECARIO') {
            document.getElementById('adminSection').style.display = 'block';
        }
    },

    async initPage(requireLogin = false) {
        const user = await this.getCurrentUser();

        if (!user && requireLogin) {
            window.location.href = '/pages/login.html';
            return null;
        }

        this.aggiornaLayout(user);
        return user;

    }
}

