import * as NavbarView from './ui/navbarView.js';
import * as Auth from './auth.js';
import * as BreadcrumbView from './ui/breadcrumbView.js';

async function inizializzaPagina() {

    NavbarView.render('home');
    BreadcrumbView.render([
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
