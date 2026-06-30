function renderNavbar(activePage = '') {

    document.getElementById('navbarContainer').innerHTML = `

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="../"><i class="bi bi-house me-2"></i>Home</a>
                <a class="navbar-brand btn" href="/pages/catalogo.html">Catalogo</a>
                <a class="navbar-brand btn d-none" href="/pages/area-personale.html" id="areaPersonaleLink">Area personale</a>

                <div id = "divLogInReg" class="ms-auto">
                    <a href="/pages/login.html" id="loginLink" class="btn btn-outline-light me-2">Login</a>
                    <a href="/pages/registrazione.html" id="registerLink" class="btn btn-primary">Registrati</a>
                </div>
                <div id = "divUserLogout" class="ms-auto d-flex align-items-center d-none">
                    <span id="utenteLoggato" class="text-light me-3"></span>
                    <button id="logoutButton" class="btn btn-outline-light">Logout</button>
                </div>
            </div>
        </nav>
    `;
}

function renderBreadcrumb(items =[]) {

    const html = `
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                ${items.map(item => {

                    if (item.active) {
                        return `
                            <li class="breadcrumb-item active">
                                ${item.label}
                            </li>
                        `;
                    }

                    return `
                        <li class="breadcrumb-item">
                            <a href="${item.href}">
                                ${item.label}
                            </a>
                        </li>
                    `;

                }).join('')}
            </ol>
        </nav>
    `;

    document.getElementById("breadcrumb").innerHTML = html;
}

/*function renderLayout({
    activePage,
    breadcrumb
}) {

    renderNavbar(activePage);
    renderBreadcrumb(breadcrumb);
}*/

export {
    renderNavbar,
    renderBreadcrumb
}