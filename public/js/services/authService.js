import * as AuthApi from '../api/authApi.js';
import * as AuthView from '../views/authView.js';

async function requireLogin() {

    const user = await AuthApi.getCurrentUser();

    if (user) {
        return user;
    }

    const returnUrl = encodeURIComponent(window.location.href);
    console.log("returnUrl "+returnUrl);
    window.location.href =
        `/pages/login.html?returnUrl=${returnUrl}`;

    return null;
}


async function initPage(requireLogin = false, preserveReturnUrl = false) {

    const user = await AuthApi.getCurrentUser();

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

    AuthView.aggiornaNavbar(user, logout);
    return user;

}

async function logout() {

    await AuthApi.logout();

    window.location.href = '/';
}

export {
    initPage,
    requireLogin,
    logout
};