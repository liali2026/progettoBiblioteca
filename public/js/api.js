async function request(url, options = {}) {
    const response = await fetch(url, options);
    const isJson = response.headers
        .get('content-type')
        ?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        const error = new Error(data?.message || 'Errore di comunicazione');
        error.status = response.status;
        error.dettagli = data?.dettagli;
        throw error;
    }

    return data;
}

function jsonOptions(method, body) {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
}

const auth = {
    async currentUser() {
        try {
            return await request('/utenti/me');
        } catch (error) {
            if (error.status === 401) {
                return null;
            }
            throw error;
        }
    },

    login(credentials) {
        return request(
            '/utenti/login',
            jsonOptions('POST', credentials)
        );
    },

    register(user) {
        return request(
            '/utenti/registrazione',
            jsonOptions('POST', user)
        );
    },

    logout() {
        return request('/utenti/logout', { method: 'POST' });
    }
};

const materiali = {
    findById(idLibro) {
        return request(`/materiali/${idLibro}`);
    },

    search(filters) {
        const params = new URLSearchParams(
            Object.entries(filters)
                .filter(([, value]) => value !== '' && value !== false)
        );
        return request(`/materiali?${params}`);
    },

    insert(formData) {
        return request('/materiali/admin/insert', {
            method: 'POST',
            body: formData
        });
    },

    update(idLibro, formData) {
        return request(`/materiali/admin/update/${idLibro}`, {
            method: 'PUT',
            body: formData
        });
    },

    remove(idLibro) {
        return request(`/materiali/admin/delete/${idLibro}`, {
            method: 'DELETE'
        });
    },

    generi() {
        return request('/materiali/generi');
    },

    copie(idLibro) {
        return request(`/materiali/admin/${idLibro}/copies`);
    },

    addCopie(idLibro, nrCopie) {
        return request(
            `/materiali/admin/${idLibro}/copies`,
            jsonOptions('POST', { nrCopie })
        );
    },

    removeCopia(idLibro, idCopia) {
        return request(
            `/materiali/admin/${idLibro}/copies/${idCopia}`,
            { method: 'DELETE' }
        );
    }
};

const prestiti = {
    create(idLibro, durataMesi) {
        return request(
            '/prestiti/creaPrestito',
            jsonOptions('POST', { idLibro, durataMesi })
        );
    },

    search(filters) {
        return request(
            '/prestiti/ricercaPrestiti',
            jsonOptions('POST', filters)
        );
    },

    restituisci(idPrestito) {
        return request(
            '/prestiti/restituisciPrestito',
            jsonOptions('POST', { idPrestito })
        );
    },

    annullaPrenotazione(idPrenotazione) {
        return request(
            '/prestiti/annullaPrenotazione',
            jsonOptions('POST', { idPrenotazione })
        );
    },

    stati() {
        return request('/prestiti/config/stati');
    }
};

export {
    auth,
    materiali,
    prestiti
};
