import * as Auth from '../services/authService.js';
import * as CommonLayoutView from '../components/commonLayout.js';

function configuraCard(id, config) {

    document.getElementById(`${id}Card`)
        .classList.toggle("border-success", config.admin);

    document.getElementById(`${id}Titolo`)
        .textContent = config.titolo;

    document.getElementById(`${id}Testo`)
        .textContent = config.testo;

    const link = document.getElementById(`${id}Link`);

    link.href = config.href;
    link.textContent = config.bottone;
    link.className = config.admin
        ? "btn btn-success"
        : "btn btn-primary";
}


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
    //await Auth.initPage(false);
    const user = await Auth.initPage(false);
    const isAdmin = user.ruolo === "BIBLIOTECARIO";


    configuraCard("catalogo", {
        admin: isAdmin,
        titolo: isAdmin ? "Gestione catalogo" : "Catalogo",
        testo: isAdmin
            ? "Consulta, inserisci, modifica o elimina materiali."
            : "Consulta tutti i libri e i materiali disponibili.",
        href: "/pages/catalogo.html?from=area-personale",
        bottone: isAdmin
            ? "Gestisci materiali"
            : "Apri catalogo"
    });

    configuraCard("prestiti", {
        admin: isAdmin,
        titolo: isAdmin ? "Prestiti" : "I miei prestiti",
        testo: isAdmin
            ? "Consulta tutti i prestiti presenti nel sistema."
            : "Visualizza i prestiti attivi e quelli già conclusi.",
        href: "/pages/prestiti.html",
        bottone: isAdmin
            ? "Visualizza prestiti"
            : "Visualizza"
    });


}

document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
