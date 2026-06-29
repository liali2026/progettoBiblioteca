async function getCurrentUser() {

    const response = await fetch('/utenti/me');

    if (!response.ok) {
        return null;
    }

    const user = await response.json();
    return user;
}

async function logout() {

    await fetch('/utenti/logout',
        { method: 'POST' }
    );
}

export {
    getCurrentUser,
    logout
}