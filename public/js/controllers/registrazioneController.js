document.getElementById('registerForm').addEventListener('submit',
        async function (event) {

            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const cognome = document.getElementById('cognome').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            //const ruolo = document.getElementById('ruolo').value;

            try {
                const response =  await fetch('/utenti/registrazione',
                        { method: 'POST',
                            headers: {'Content-Type':'application/json'
                            },

                            body: JSON.stringify({
                                nome,
                                cognome,
                                email,
                                password
                            })
                        }
                    );

                const data = await response.json();

                if (response.ok) {
                    document.getElementById('messaggio').innerHTML =
                        `
                        <div class="alert alert-success">
                            Registrazione completata
                        </div>
                        `;

                    setTimeout(() => {
                        window.location.href =
                            '/pages/login.html';
                    }, 1500);

                } else {
                    document.getElementById('messaggio').innerHTML =
                        `<div class="alert alert-danger">
                            ${data.message}
                        </div>
                        `;
                }

            } catch (err) {

                document.getElementById('messaggio').innerHTML =
                    `<div class="alert alert-danger">
                        Errore di connessione
                    </div>
                    `;
            }
        }
    );