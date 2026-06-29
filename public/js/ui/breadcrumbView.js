export function render(items) {

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