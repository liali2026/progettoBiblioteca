function mostraMessaggio(html, tipo) {

    const box = document.getElementById('messaggioPagina');

    if (!box) {
        return;
    }

    box.className = `alert alert-${tipo}`;
    box.innerHTML = html;
    box.classList.remove('d-none');

    box.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

function mostraErrore(testo) {

    mostraMessaggio(
        `
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        ${testo}
        `,
        'danger'
    );
}

function mostraSuccesso(testo) {

    mostraMessaggio(
        `
        <i class="bi bi-check-circle-fill me-2"></i>
        ${testo}
        `,
        'success'
    );
}

function mostraInfo(testo) {

    mostraMessaggio(
        `
        <i class="bi bi-info-circle-fill me-2"></i>
        ${testo}
        `,
        'info'
    );
}

function mostraWarning(testo) {

    mostraMessaggio(
        `
        <i class="bi bi-exclamation-circle-fill me-2"></i>
        ${testo}
        `,
        'warning'
    );
}

function nascondiMessaggio() {

    const box = document.getElementById('messaggioPagina');

    if (!box) {
        return;
    }

    box.classList.add('d-none');
    box.innerHTML = '';
}

export {
    mostraErrore,
    mostraSuccesso,
    mostraInfo,
    mostraWarning,
    nascondiMessaggio
}