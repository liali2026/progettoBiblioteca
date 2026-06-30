import * as CommonLayoutView from './ui/commonLayoutView.js';
import * as Auth from './auth.js';

async function inizializzaPagina() {

    CommonLayoutView.renderNavbar('home');
    await Auth.initPage(false);
}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
