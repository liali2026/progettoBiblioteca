CREATE DATABASE IF NOT EXISTS biblioteca
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE biblioteca;

-- Eliminazione delle viste
DROP VIEW IF EXISTS vista_catalogo_libri;
DROP VIEW IF EXISTS vista_copie;
DROP VIEW IF EXISTS vista_prelievi;
DROP VIEW IF EXISTS vista_prestiti;

-- Eliminazione delle tabelle
DROP TABLE IF EXISTS notifiche_prestiti;
DROP TABLE IF EXISTS prestiti;
DROP TABLE IF EXISTS copie;
DROP TABLE IF EXISTS prenotazioni;
DROP TABLE IF EXISTS libri;
DROP TABLE IF EXISTS utenti;
DROP TABLE IF EXISTS generi;
DROP TABLE IF EXISTS configurazioni;

-- Creazione tabelle
CREATE TABLE `configurazioni` (
  `id_configurazione` int NOT NULL AUTO_INCREMENT,
  `categoria` varchar(50) NOT NULL,
  `codice` varchar(50) NOT NULL,
  `descrizione` varchar(100) NOT NULL,
  `ordine` int NOT NULL DEFAULT '0',
  `attivo` tinyint(1) NOT NULL DEFAULT '1',
  `storico` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_configurazione`),
  UNIQUE KEY `categoria` (`categoria`,`codice`)
)  ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;
  
CREATE TABLE `generi` (
  `id_genere` varchar(50) NOT NULL,
  `descrizione` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_genere`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;
  
CREATE TABLE `utenti` (
  `id_utente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `ruolo` enum('BIBLIOTECARIO','UTENTE')  NOT NULL,
  PRIMARY KEY (`id_utente`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;  
  
CREATE TABLE `libri` (
  `id_libro` int NOT NULL AUTO_INCREMENT,
  `isbn` varchar(20) NOT NULL,
  `titolo` varchar(255) NOT NULL,
  `autore` varchar(255) NOT NULL,
  `casa_editrice` varchar(255) DEFAULT NULL,
  `anno_pubblicazione` year DEFAULT NULL,
  `id_genere` varchar(50) NOT NULL,
  `copertina` varchar(255) DEFAULT NULL,
  `descrizione` text,
  `attivo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_libro`),
  UNIQUE KEY `isbn_UNIQUE` (`isbn`,`attivo`),
  KEY `id_genere` (`id_genere`),
  CONSTRAINT `libri_ibfk_1` FOREIGN KEY (`id_genere`) REFERENCES `generi` (`id_genere`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;  

CREATE TABLE `copie` (
  `id_copia` int NOT NULL,
  `id_libro` int NOT NULL,
  `stato` enum('DISPONIBILE','PRESTITO') DEFAULT 'DISPONIBILE',
  `attivo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_copia`,`id_libro`),
  KEY `id_libro` (`id_libro`),
  CONSTRAINT `copie_ibfk_1` FOREIGN KEY (`id_libro`) REFERENCES `libri` (`id_libro`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

CREATE TABLE `prenotazioni` (
  `id_prenotazione` int NOT NULL AUTO_INCREMENT,
  `id_libro` int NOT NULL,
  `id_utente` int NOT NULL,
  `data_prenotazione` date NOT NULL,
  `durata_prestito` int NOT NULL,
  `priorita` int NOT NULL DEFAULT '0',
  `st_prenotazione` enum('ATTESA','ANNULLATA','EVASA','SCADUTA') DEFAULT 'ATTESA',
  `data_chiusura` datetime DEFAULT NULL,
  PRIMARY KEY (`id_prenotazione`),
  FOREIGN KEY (id_libro) REFERENCES libri(id_libro),
  FOREIGN KEY (id_utente) REFERENCES utenti(id_utente)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;


CREATE TABLE `prestiti` (
  `id_prestito` int NOT NULL AUTO_INCREMENT,
  `id_libro` int NOT NULL,
  `id_copia` int NOT NULL,
  `id_utente` int NOT NULL,
  `data_inizio` date NOT NULL,
  `data_fine` date NOT NULL,
  `data_restituzione` date DEFAULT NULL,
  `stato` enum('ATTIVO','RESTITUITO','SCADUTO') DEFAULT NULL,
  PRIMARY KEY (`id_prestito`),
  KEY `id_utente` (`id_utente`),
  KEY `id_copia` (`id_copia`,`id_libro`),
  CONSTRAINT `prestiti_ibfk_2` FOREIGN KEY (`id_utente`) REFERENCES `utenti` (`id_utente`),
  CONSTRAINT `prestiti_ibfk_3` FOREIGN KEY (`id_copia`, `id_libro`) REFERENCES `copie` (`id_copia`, `id_libro`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;


CREATE TABLE `notifiche_prestiti` (
  `id_notifica` int NOT NULL AUTO_INCREMENT,
  `id_prestito` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `data_invio` datetime DEFAULT NULL,
  PRIMARY KEY (`id_notifica`),
  UNIQUE KEY `id_prestito` (`id_prestito`,`tipo`),
  CONSTRAINT `notifiche_prestiti_ibfk_1` FOREIGN KEY (`id_prestito`) REFERENCES `prestiti` (`id_prestito`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;



-- creazione viste
CREATE OR REPLACE VIEW `vista_catalogo_libri` AS
    SELECT 
        `l`.`id_libro` AS `id_libro`,
        `l`.`isbn` AS `isbn`,
        `l`.`titolo` AS `titolo`,
        `l`.`autore` AS `autore`,
        `l`.`casa_editrice` AS `casa_editrice`,
        `l`.`anno_pubblicazione` AS `anno_pubblicazione`,
        `l`.`id_genere` AS `id_genere`,
        `g`.`descrizione` AS `genere`,
        `l`.`copertina` AS `copertina`,
        `l`.`descrizione` AS `descrizione`,
        COUNT(`c`.`id_copia`) AS `nr_copie_disponibili`
    FROM
        ((`libri` `l`
        JOIN `generi` `g` ON ((`l`.`id_genere` = `g`.`id_genere`)))
        LEFT JOIN `copie` `c` ON (((`l`.`id_libro` = `c`.`id_libro`)
            AND (`c`.`stato` = 'DISPONIBILE')
            AND (`c`.`attivo` = 1))))
    WHERE
        (`l`.`attivo` = 1)
    GROUP BY `l`.`id_libro` , `l`.`isbn` , `l`.`titolo` , `l`.`autore` , `l`.`casa_editrice` , 
			`l`.`anno_pubblicazione` , `l`.`id_genere` , `g`.`descrizione` , `l`.`copertina` , `l`.`descrizione`;
    
CREATE OR REPLACE VIEW `vista_copie` AS
    SELECT 
        `c`.`id_copia` AS `id_copia`,
        `c`.`id_libro` AS `id_libro`,
        `c`.`stato` AS `stato`,
        `c`.`attivo` AS `attivo`,
        `p`.`id_prestito` AS `id_prestito`,
        `p`.`data_inizio` AS `data_inizio`,
        `p`.`data_fine` AS `data_fine`,
        `p`.`stato` AS `stato_prestito`,
        `u`.`email` AS `email`
    FROM
        ((`copie` `c`
        LEFT JOIN `prestiti` `p` ON (((`c`.`id_copia` = `p`.`id_copia`)
            AND (`c`.`id_libro` = `p`.`id_libro`)
            AND (`p`.`stato` <> 'RESTITUITO'))))
        LEFT JOIN `utenti` `u` ON ((`p`.`id_utente` = `u`.`id_utente`)))
    WHERE
        (`c`.`attivo` = 1)
    ORDER BY `c`.`id_copia`;
    
CREATE OR REPLACE VIEW `vista_prelievi` AS
    SELECT 
        `p`.`id_prestito` AS `id_prestito`,
        `p`.`id_utente` AS `id_utente`,
        `u`.`email` AS `email`,
        `p`.`id_copia` AS `id_copia`,
        `l`.`id_libro` AS `id_libro`,
        `l`.`titolo` AS `titolo`,
        `l`.`autore` AS `autore`,
        `l`.`id_genere` AS `id_genere`,
        `g`.`descrizione` AS `genere`,
        `p`.`data_inizio` AS `data_inizio`,
        `p`.`data_fine` AS `data_fine`,
        `p`.`data_restituzione` AS `data_restituzione`,
        `p`.`stato` AS `stato`,
        1 AS `tipo`,
        `co`.`storico` AS `isStorico`
    FROM
        (((((`prestiti` `p`
        JOIN `copie` `c` ON (((`p`.`id_copia` = `c`.`id_copia`)
            AND (`p`.`id_libro` = `c`.`id_libro`))))
        JOIN `libri` `l` ON ((`c`.`id_libro` = `l`.`id_libro`)))
        JOIN `generi` `g` ON ((`g`.`id_genere` = `l`.`id_genere`)))
        JOIN `utenti` `u` ON ((`p`.`id_utente` = `u`.`id_utente`)))
        JOIN `configurazioni` `co` ON (((`p`.`stato` = `co`.`codice`)
            AND (`co`.`categoria` = 'STATO_PRESTITO')))) 
    UNION ALL SELECT 
        `p`.`id_prenotazione` AS `id_prestito`,
        `p`.`id_utente` AS `id_utente`,
        `u`.`email` AS `email`,
        NULL AS `id_copia`,
        `p`.`id_libro` AS `id_libro`,
        `l`.`titolo` AS `titolo`,
        `l`.`autore` AS `autore`,
        `l`.`id_genere` AS `id_genere`,
        `g`.`descrizione` AS `genere`,
        `p`.`data_prenotazione` AS `data_inizio`,
        NULL AS `data_fine`,
        NULL AS `data_restituzione`,
        `p`.`st_prenotazione` AS `stato`,
        2 AS `tipo`,
        `co`.`storico` AS `isStorico`
    FROM
        ((((`prenotazioni` `p`
        JOIN `libri` `l` ON ((`p`.`id_libro` = `l`.`id_libro`)))
        JOIN `generi` `g` ON ((`g`.`id_genere` = `l`.`id_genere`)))
        JOIN `utenti` `u` ON ((`p`.`id_utente` = `u`.`id_utente`)))
        JOIN `configurazioni` `co` ON (((`p`.`st_prenotazione` = `co`.`codice`)
            AND (`co`.`categoria` = 'STATO_PRENOTAZIONE'))));
            
CREATE OR REPLACE VIEW `vista_prestiti` AS
    SELECT 
        `p`.`id_prestito` AS `id_prestito`,
        `p`.`id_utente` AS `id_utente`,
        `u`.`email` AS `email`,
        `p`.`id_copia` AS `id_copia`,
        `l`.`id_libro` AS `id_libro`,
        `l`.`titolo` AS `titolo`,
        `l`.`autore` AS `autore`,
        `l`.`id_genere` AS `id_genere`,
        `g`.`descrizione` AS `genere`,
        `p`.`data_inizio` AS `data_inizio`,
        `p`.`data_fine` AS `data_fine`,
        `p`.`data_restituzione` AS `data_restituzione`,
        `p`.`stato` AS `stato`,
        1 AS `tipo`,
        `co`.`storico` AS `isStorico`
    FROM
        (((((`prestiti` `p`
        JOIN `copie` `c` ON (((`p`.`id_copia` = `c`.`id_copia`)
            AND (`p`.`id_libro` = `c`.`id_libro`))))
        JOIN `libri` `l` ON ((`c`.`id_libro` = `l`.`id_libro`)))
        JOIN `generi` `g` ON ((`g`.`id_genere` = `l`.`id_genere`)))
        JOIN `utenti` `u` ON ((`p`.`id_utente` = `u`.`id_utente`)))
        JOIN `configurazioni` `co` ON (((`co`.`categoria` = 'STATO_PRESTITO')
            AND (`p`.`stato` = `co`.`codice`)))) 
    UNION ALL SELECT 
        `p`.`id_prenotazione` AS `id_prestito`,
        `p`.`id_utente` AS `id_utente`,
        `u`.`email` AS `email`,
        NULL AS `id_copia`,
        `p`.`id_libro` AS `id_libro`,
        `l`.`titolo` AS `titolo`,
        `l`.`autore` AS `autore`,
        `l`.`id_genere` AS `id_genere`,
        `g`.`descrizione` AS `genere`,
        `p`.`data_prenotazione` AS `data_inizio`,
        NULL AS `data_fine`,
        `p`.`data_chiusura` AS `data_restituzione`,
        `p`.`st_prenotazione` AS `stato`,
        2 AS `tipo`,
        `co`.`storico` AS `isStorico`
    FROM
        ((((`prenotazioni` `p`
        JOIN `libri` `l` ON ((`p`.`id_libro` = `l`.`id_libro`)))
        JOIN `generi` `g` ON ((`g`.`id_genere` = `l`.`id_genere`)))
        JOIN `utenti` `u` ON ((`p`.`id_utente` = `u`.`id_utente`)))
        JOIN `configurazioni` `co` ON (((`co`.`categoria` = 'STATO_PRENOTAZIONE')
            AND (`p`.`st_prenotazione` = `co`.`codice`))));

-- inserimento dati di configurazione
INSERT INTO configurazioni
(id_configurazione, categoria, codice, descrizione, ordine, attivo, storico)
VALUES
(1, 'STATO_PRESTITO', 'ATTIVO', 'Attivo', 1, 1, 0),
(2, 'STATO_PRESTITO', 'SCADUTO', 'Scaduto', 2, 1, 0),
(3, 'STATO_PRESTITO', 'RESTITUITO', 'Restituito', 3, 1, 1),
(4, 'STATO_PRENOTAZIONE', 'ATTESA', 'In attesa', 1, 1, 0),
(5, 'STATO_PRENOTAZIONE', 'ANNULLATA', 'Annullata', 3, 1, 1),
(6, 'STATO_PRENOTAZIONE', 'EVASA', 'Evasa', 2, 1, 1),
(7, 'RUOLO', 'UTENTE', 'Utente', 1, 1, 0),
(8, 'RUOLO', 'BIBLIOTECARIO', 'Bibliotecario', 2, 1, 0),
(9, 'NOTIFICA_PRESTITO', 'SCADENZA_PRESTITO', 'In scadenza', 1, 1, 0),
(10, 'NOTIFICA_PRESTITO', 'PRESTITO_SCADUTO', 'Scaduto', 2, 1, 0),
(11, 'NOTIFICA_PRESTITO', 'PRENOTAZIONE_EVASA', 'Prenotazione evasa', 0, 1, 0);


INSERT INTO generi (id_genere, descrizione)
VALUES
    ('FAS', 'fantasy'),
    ('FAZ', 'fantascienza'),
    ('MAN', 'manuale'),
    ('ROM', 'romanzo');
    
-- utente con ruolo BIBLIOTECARIO
insert into utenti(nome, cognome, email, password_hash,ruolo) values (
'John', 'Doe', 'john.doe@gmail.com', '$2b$10$ZzBwGEQ.b2TgCwCALarZX.9Zug7zGYLE1NCAX1aLAyo.tplOBKkEO', 'BIBLIOTECARIO');   

-- inserimento di alcuni libri
insert into libri (isbn, titolo, autore, casa_editrice,anno_pubblicazione,id_genere,copertina, descrizione,attivo)
values
( '9788806219420', 'Odissea. Testo greco a fronte', 'Omero', 'Einaudi', 2014, 'ROM', '6940aa04-383f-49ee-b7ec-30898131a9bb.jpg', 'Durante il ritorno dalla guerra di Troia, un destino crudele prende a bersagliare Odisseo (Ulisse, per i latini) e i suoi compagni: la loro patria, l\'isola di Itaca, pare allontanarsi per sempre, il viaggio sembra impossibile. Lucido e ostinato, pronto a tutto, Odisseo ricorda, previene e si oppone alla sorte, pur di approdare al porto natale e riprendere in pugno il proprio mondo. Ma quel mondo è cambiato, ed è cambiato anche lui. Prefazione di Fausto Codino.', '1'),
( '9788806271305', 'Il sole nelle pozzanghere', 'Matteo Bussola', 'Feltrinelli', 2026, 'ROM', '4f06ede7-2089-4834-97ac-1f7486bfe6bb.jpg', 'Ogni oggetto custodisce una storia. Ci ha visti amare, piangere, stringerci a qualcuno, restare soli. Gli oggetti che ci sono appartenuti sanno chi siamo stati o chi siamo, e se potessero parlare racconterebbero la verità su di noi. Forse per questo, a volte, ce ne sbarazziamo. Ma c\'è un signore capace di ascoltarli. Di sentire, nella loro voce, il concerto del mondo. È lui il protagonista di questo romanzo.\n\nDelicato e struggente, Il sole nelle pozzanghere racconta il nostro bisogno di legami, il bisogno che ognuno di noi ha degli altri per restare vivo.\n\n\n«Il signor Pi, in effetti, non aggiusta quasi nulla. Dice che sistemare tutto è un modo elegante per far tacere il passato. Al massimo pulisce, spolvera, accomoda, riporta alla luce. Come si fa con i ricordi quando smettono di far male. La gente del quartiere lo chiama “il vecchio delle cose rotte”. Ma sanno che lui, in realtà, ripara persone».\n\nIl signor Pi apre sempre alle otto e dieci del mattino, mai alle otto in punto, perché dice che le cose importanti hanno bisogno di qualche minuto di ritardo per farsi desiderare. Il suo negozio sta in una via piccola, laterale, e sull’insegna c’è scritto solo «Rigattiere». Il mestiere del signor Pi è recuperare oggetti usati, rotti o difettosi, per rimetterli in circolo: e sí, per lui è una cosa importante. Perché sa che ciascuno di questi oggetti porta con sé un carico affettivo, la traccia delle famiglie, delle stanze in cui ha vissuto, delle relazioni cui ha partecipato, come dono, scenario, o come semplice testimone: cucine, orologi, cartelle, chitarre, orecchini… Sa che questi oggetti contengono sogni, desideri realizzati oppure no, amori finiti, parenti perduti, una memoria che non si può cancellare. Sa che, in fondo, tutti siamo «la storia abbandonata di qualcun altro». Quando tocca quelle cose, al signor Pi sembra di sentire la storia che racchiudono. Ed ecco che in questo romanzo fiabesco eppure pieno di vita vera – pieno di tutte le nostre vite, che leggendo riconosciamo – si dipana un universo variegato di voci e personaggi, che davanti al suo bancone si incrociano, intrecciandosi. Il negozio diventa cosí un luogo per le seconde occasioni. Non soltanto per gli oggetti, ma anche per coloro che, con i propri rimpianti e ferite, lo frequentano. Compreso il signor Pi.', '1'),
('9788838938511', 'Gli arancini di Montalbano', 'A. Camilleri', 'Sellerio editore', 2018, 'ROM', 'b58589e9-2137-41e8-8dd5-f777dd3ec7ff.jpg', 'Venti racconti si dispiegano l’un dietro l’altro: in un crescendo di estri imprevedibili, e di complicazioni drammatiche, secondo un disegno di inesausto diletto che in ogni singola trama si disvela con la levità e la sottigliezza di un giocar di scene «stramme» dentro l’unità di luogo dell’arena vigatese, non senza tuttavia una qualche malinconica trasferta del primo attore. Tutto è elusivo a Vigàta, e stravagante. Vi predomina una logica che sembra sgangherata. Una coppia di vecchi attori prova la scena estrema della propria morte, a turno sul letto e sulla sedia della veglia. Una congiura di scippatori tenderebbe «alla desertificazione delle chiese», sparando a salve, di buon mattino, su vecchiette insonni o su bigotte che corrono alla prima messa. Del complotto comunista è convinto l’ottuso cronista di «Televigàta». E Montalbano, per spiegare al questore Bonetti-Alderighi la non «valenza tragica» degli attentati, fa ricorso alla semiologia di Roland Barthes fatto passare per «criminologo francese». L’ignoranza fantastica del questore è riluttante. Non si lascia persuadere da quel «Marthes», come lui lo chiama. L’innocenza fragorosamente rustica e la logica scompaginata di Catarella danno prove strabilianti. Il centralinista vuole essere coinvolto nelle indagini. A Vigàta è stata uccisa una prostituta vecchia. Catarella ha visto un telefilm su un tale che, per vendicarsi della madre malafemmina, è diventato un serial killer di prostitute. E si convince d’avere risolto il caso. Entra nell’ufficio di Montalbano. Chiude a chiave la porta dietro di sé. Ha un’«ariata» di segreto cospiratore. Spara: l’omicida è «un clienti della bottana che è figliu di bottana». Eppure un caso lo risolve davvero. È lui a scoprire il «porco maiale» che si è approfittato di una povera giovane mentalmente instabile. Montalbano è un esperto di quei geroglifici che sono i particolari minuti, da tutti trascurati, una mosca, per esempio, presa in pugno da un imputato durante il processo. Lui è il solo che sa decifrarli. Gli piacciono «assà» i Racconti di Pietroburgo di Gogol’, con la loro immaginativa. E visionariamente gogoliana è la telefonata che Montalbano fa al suo autore, per proibirgli di destinargli storie truculente. Il commissario arriva a farsi scrittore di frodo. Entra in due racconti di Camilleri e, dentro le tracce avviate, si scrive da solo, in forma di lettere, le relazioni di due sue indagini: fra l’altro condotte a distanza, basandosi solo sulla scienza della deduzione e dell’analisi. Montalbano merita alla fine, dopo una serie di virtuosi trucchi, di festeggiare il capodanno alla mensa pingue della cameriera Adelina: abbandonandosi alla ghiottoneria languorosa e sensuale di un eccelso mangiatore di arancini. La raccolta Gli arancini di Montalbano è stata pubblicata la prima volta dalla Mondadori, nel 1999.   Salvatore Silvano Nigro', '1'),
('9788807885136', 'Lo zen e la cerimonia del tè', 'Kakuzo Okakura', 'Universale Economica Feltrinelli', 2014, 'ROM', '26a21702-7422-47f0-b520-faafdc519ff1.jpg', 'Opera di una personalità complessa (Okakura fu al contempo un grande studioso dell\'Oriente, un messia autorevole e autoritario e un poeta), \"The Book of Tea\" (1906) fu scritto in inglese per un pubblico occidentale. Okakura volle spiegare i caratteri dell\'orientalità attraverso il simbolo del tè: parla della sua storia e della sua importanza, ne descrive la cerimonia quasi religiosa, fatta di una ritualità e di norme precise, che sanciscono la sottomissione del presente agli avi e al passato. Nella riproduzione di una cerimonia esattamente come si svolgeva nell\'antichità si manifesta infatti quell\'obbedienza tipicamente giapponese all\'autorità degli antenati che non può essere mai contestata o contraddetta. Con uno scritto di Everett Bleiler.', '1');



insert into copie
values
('1', '1', 'DISPONIBILE', '1'),
('1', '2', 'DISPONIBILE', '1'),
('2', '2', 'DISPONIBILE', '1'),
('1', '3', 'DISPONIBILE', '1'),
('2', '3', 'DISPONIBILE', '1'),
('3', '3', 'DISPONIBILE', '1'),
('4', '3', 'DISPONIBILE', '1'),
('1', '4', 'DISPONIBILE', '1');