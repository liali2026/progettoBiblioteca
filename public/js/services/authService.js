import { auth } from '../api.js';

async function requireLogin() {

    const user = await auth.currentUser();

    if (user) {
        return user;
    }

    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href =
        `/pages/login.html?returnUrl=${returnUrl}`;

    return null;
}


async function initPage(requireLogin = false, preserveReturnUrl = false) {

    const user = await auth.currentUser();

    if (!user && requireLogin) {

        if (preserveReturnUrl) {
            const returnUrl =
                encodeURIComponent(window.location.href);

            window.location.href =
                `/pages/login.html?returnUrl=${returnUrl}`;
        } else {
            window.location.href = '/pages/login.html';
            
        }
        return null;
    }

    aggiornaNavbar(user);
    return user;

}

async function logout() {

    await auth.logout();

    window.location.href = '/';
}

function aggiornaNavbar(user) {
    if (!user) {
        return;
    }

    document.getElementById('divLogInReg')?.classList.add('d-none');
    document.getElementById('divUserLogout')?.classList.remove('d-none');
    document.getElementById('areaPersonaleLink')?.classList.remove('d-none');

    const userLabel = document.getElementById('utenteLoggato');
    if (userLabel) {
        userLabel.textContent = user.email;
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.onclick = logout;
    }
}

export {
    initPage,
    requireLogin,
    logout
};
