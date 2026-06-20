document.getElementById('loginForm').addEventListener('submit',
        async function (event) {

            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response =
                    await fetch('/utenti/login',
                        { method: 'POST',
                            headers: {
                                'Content-Type':
                                    'application/json'
                            },
                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );

                const data = await response.json();

                if (response.ok) {

                    window.location.href = '/pages/home.html';

                } else {

                    document.getElementById('messaggio').innerHTML =
                        `<div class="alert alert-danger">
                            ${data.errore}
                         </div>`;
                }

            } catch (err) {

                document.getElementById('messaggio').innerHTML =
                    `<div class="alert alert-danger">
                        Errore di connessione
                     </div>`;
            }
        }
    );