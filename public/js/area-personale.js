import * as Auth from './auth.js';
import * as CommonLayoutView from './ui/commonLayoutView.js';

async function inizializzaPagina() {

    CommonLayoutView.renderNavbar('area-personale');
    CommonLayoutView.renderBreadcrumb([
        {
            label: "Home",
            href: "/"
        },
        {
            label: "Area personale",
            active: true
        }
    ]);
    await Auth.initPage(false);
}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
