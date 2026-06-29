import * as Auth from './auth.js';
import * as PrestitiApi from './api/prestitiApi.js';
import * as ModalPrestito from './ui/prestitiModal.js';
import * as View from './ui/dettaglioMaterialeView.js';
import * as NavbarView from './ui/navbarView.js';
import * as BreadcrumbView from './ui/breadcrumbView.js';

let materiale = null;

async function caricaMateriale() {
    try {

        View.nascondiMessaggio();

        const params = new URLSearchParams(window.location.search);
        const idMateriale = params.get('id');

        if (!idMateriale) {
            /*alert('Identificativo libro non valido');
            window.location.href = '/pages/catalogo.html';*/
            View.mostraErrore('Identificativo materiale non valido.');
            return;
        }

        //const libro = await PrestitiApi.ricercaLibro(idLibro);
        materiale = await PrestitiApi.ricercaMateriale(idMateriale);

        View.mostraMateriale(materiale);

    } catch (err) {
        console.error(err);
        View.mostraErrore('Errore durante il caricamento del materiale.');
        //alert('Errore durante il caricamento del materiale');
    }
}

async function apriModalPrestito(materiale) {

    try {
        if (!materiale) {
            return;
        }

        const user = await Auth.requireLogin();
        if (!user) {
            return;
        }

        ModalPrestito.apri(materiale, user);

    } catch (err) {
        console.log(err.message);
        View.mostraErrore(err.message);

    }
}


async function confermaPrestito() {
    try {

        const idMateriale = materiale.id_libro; //document.getElementById('prestitoModal').dataset.idLibro;
        const durata = ModalPrestito.getDurataPrestito();

        const datiPrestito = await PrestitiApi.creaPrestito(idMateriale, durata);

        ModalPrestito.chiudi();
        await caricaMateriale();
        View.mostraMessaggioPrestito(datiPrestito);

    } catch (err) {
        console.error(err);
        ModalPrestito.chiudi();
        await caricaMateriale();
        View.mostraErrore(err.message);
        //alert(err.message);
    }
}


async function inizializzaPagina() {

    NavbarView.render('catalogo'); // da verificare il parametro

    BreadcrumbView.render([
        {
            label: "Home",
            href: "/"
        },
        {
            label: "Catalogo",
            href: "/pages/catalogo.html"
        },
        {
            label: "Dettaglio materiale",
            active: true
        }
    ]);

    await Auth.initPage(false);

    await caricaMateriale();

    ModalPrestito.inizializza();

    document
        .getElementById('btnPrestito')
        .addEventListener(
            'click',
            () => apriModalPrestito(materiale)
        );

    document
        .getElementById('btnConfermaPrestito')
        .addEventListener(
            'click',
            confermaPrestito
        );
}



document.addEventListener(
    'DOMContentLoaded',
    inizializzaPagina
);
