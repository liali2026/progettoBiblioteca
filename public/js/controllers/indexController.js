import * as Auth from '../services/authService.js';
import * as CommonLayoutView from '../components/commonLayout.js';


async function inizializzaPagina() {

    CommonLayoutView.renderNavbar('home');
    await Auth.initPage(false);
}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
