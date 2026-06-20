document.getElementById('logoutButton').addEventListener('click', 
    async () => {
        try {
            await fetch('/utenti/logout',
                {
                    method: 'POST'
                }
            );

            window.location.href = '/pages/login.html';

        } catch (err) {
            console.error(err);
        }
    });


async function caricaUtente() {
    try {
        const response = await fetch('/utenti/me');

        if (!response.ok) {
            window.location.href ='/pages/login.html';
            return;
        }

        const user = await response.json();

        document.getElementById('utenteLoggato').textContent =user.email;

        if (user.ruolo === 'BIBLIOTECARIO') {

            document.getElementById('adminSection').style.display ='block';
        }

    } catch(err) {
        console.error(err);
    }
}

caricaUtente();