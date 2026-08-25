import { auth } from '../api.js';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginForm?.addEventListener('submit', async event => {
    event.preventDefault();

    try {
        await auth.login({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        });

        const returnUrl =
            new URLSearchParams(window.location.search).get('returnUrl');

        window.location.href = safeReturnUrl(returnUrl)
            || '/pages/area-personale.html';
    } catch (error) {
        showError(error.message);
    }
});

function validaPassword(password) {

    if (password.length < 8) {
        return 'La password deve contenere almeno 8 caratteri.';
    }

    if (!/[A-Z]/.test(password)) {
        return 'La password deve contenere almeno una lettera maiuscola.';
    }

    if (!/[a-z]/.test(password)) {
        return 'La password deve contenere almeno una lettera minuscola.';
    }

    if (!/[0-9]/.test(password)) {
        return 'La password deve contenere almeno un numero.';
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        return 'La password deve contenere almeno un carattere speciale.';
    }

    return null;
}

registerForm?.addEventListener('submit', async event => {
    event.preventDefault();

    //controlli anche lato client della password (gli stessi controlli sono replicati sul server)
    const password = document.getElementById('password').value;
    const errorePassword = validaPassword(password);

    if (errorePassword) {
        showError(errorePassword);
        return;
    }

    try {
        await auth.register({
            nome: document.getElementById('nome').value,
            cognome: document.getElementById('cognome').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        });
        window.location.href = '/pages/area-personale.html';
    } catch (error) {
        showError(error.message);
    }
});

function safeReturnUrl(value) {
    if (!value) {
        return null;
    }

    try {
        const url = new URL(value, window.location.origin);
        return url.origin === window.location.origin
            ? `${url.pathname}${url.search}${url.hash}`
            : null;
    } catch {
        return null;
    }
}

function showError(message) {
    document.getElementById('messaggio').innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${message}
        </div>
    `;
}
