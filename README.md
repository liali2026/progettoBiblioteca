# progettoBiblioteca
1. creazione del database: 
    lanciare lo script script_DB.sql per creare il database MySQL e per inserire alcune configurazioni.
    NOTA: 
    Gli utenti possono essere creati dal sito, tramite form di registrazione, ma solo un database administrator può settare il ruolo di BIBLIOTECARIO ad un utente. 
    Per semplicità, negli script di installazione è prevista la creazione di almeno un utente con ruolo BIBLIOTECARIO, con le seguenti credenziali:
     username = john.doe@gmail.com
     password = Progett02026!
    
2. eseguire unzip del file progettoBiblioteca.zip e copiare le cartelle in una installazione standard di Node.js. 
   Il progetto richiede che siano eseguite anche le seguenti installazioni:
   npm install express
   npm install dotenv
   npm install mysql2
   npm install bcrypt
   npm install express-session
   npm install node-cron
   npm install nodemailer

3. rinomina .env.example in .env e configuralo correttamente impostando:
   - la password di connessione al proprio database Mysql
   - un proprio account Google e una password app di 16 caratteri per la gestione del mailer
   - il secret message per il calcolo dell'hash dell'id di sessione
   NOTA: le porte di ascolto per l'application server e per il database server sono rispettivamente la 3000 e la 3306

3. lanciare l'instanza del DB 
   lanciare l'istanza di Node.js
   accedere all'applicazione alla pagina localhost:3000
   Usare l'utente con ruolo BIBLIOTECARIO fornito negli script del DB oppure registrare un nuovo utente e aggiornarne il ruolo coerentemente

Per maggiori dettagli si consulti il manuale "Progetto Biblioteca AL.pdf" allegato al progetto.
