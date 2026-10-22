import classico from './expansion/classico';
import quotidiano from './expansion/quotidiano';
import natura from './expansion/natura';
import spettacolo from './expansion/spettacolo';
import viaggio from './expansion/viaggio';
import extra from './expansion/extra';

export type DeckId = 'classico' | 'quotidiano' | 'natura' | 'spettacolo' | 'viaggio' | 'extra';
export type Card = {
  id: string;
  word: string;
  forbidden: [string, string, string, string, string];
  deck: DeckId;
};
export const DECKS: { id: DeckId; name: string; subtitle: string; color: string; icon: string }[] =
  [
    {
      id: 'classico',
      name: 'Il grande classico',
      subtitle: 'Le parole di sempre. Le risate di tutti.',
      color: '#FFB64C',
      icon: 'sparkles',
    },
    {
      id: 'quotidiano',
      name: 'Vita quotidiana',
      subtitle: 'Le piccole cose, senza le solite parole.',
      color: '#FF817C',
      icon: 'coffee',
    },
    {
      id: 'natura',
      name: 'Un mondo selvaggio',
      subtitle: 'Animali, natura e idee che fioriscono.',
      color: '#A3D7B4',
      icon: 'leaf',
    },
    {
      id: 'spettacolo',
      name: 'Ciak, si gioca!',
      subtitle: 'Musica, sport e cultura pop.',
      color: '#B6A1EF',
      icon: 'clapperboard',
    },
    {
      id: 'viaggio',
      name: 'In giro per il mondo',
      subtitle: 'La prossima destinazione? Il divertimento.',
      color: '#8CCEE1',
      icon: 'compass',
    },
    {
      id: 'extra',
      name: 'Fuori dagli schemi',
      subtitle: 'Un po’ più difficile. Molto più divertente.',
      color: '#F1A8CB',
      icon: 'lightbulb',
    },
  ];

// Contenuti originali in italiano. Ogni riga: parola principale | cinque parole vietate.
const raw: Record<DeckId, string> = {
  classico: `Pizza|Forno|Mozzarella|Pomodoro|Margherita|Napoli
Gelato|Freddo|Cono|Gusti|Crema|Estate
Orologio|Ora|Polso|Lancette|Tempo|Minuti
Biblioteca|Libri|Leggere|Silenzio|Prestito|Scaffali
Compleanno|Torta|Candeline|Regalo|Festa|Anni
Ombrello|Pioggia|Bagnato|Aprire|Acqua|Manico
Chitarra|Corde|Suonare|Musica|Strumento|Plettro
Astronauta|Spazio|Luna|Razzo|Pianeta|Tuta
Castello|Re|Regina|Torri|Medioevo|Fossato
Cioccolato|Cacao|Dolce|Tavoletta|Latte|Fondente
Arcobaleno|Colori|Pioggia|Sole|Cielo|Sette
Fotografia|Immagine|Scatto|Macchina|Ricordo|Obiettivo
Tesoro|Pirata|Oro|Mappa|Baule|Prezioso
Semaforo|Rosso|Verde|Giallo|Strada|Incrocio
Palloncino|Aria|Gonfiare|Festa|Scoppiare|Elio
Robot|Macchina|Metallo|Programmare|Automatico|Umano
Labirinto|Uscita|Perdersi|Percorso|Minotauro|Dedalo
Specchio|Riflesso|Guardare|Vetro|Immagine|Bagno
Cuscino|Letto|Dormire|Testa|Morbido|Federa
Ponte|Fiume|Attraversare|Collegare|Arco|Sponde
Vulcano|Lava|Eruzione|Montagna|Cratere|Etna
Caramella|Dolce|Zucchero|Bambini|Scartare|Gommosa
Mago|Magia|Bacchetta|Cappello|Coniglio|Trucco
Treno|Binari|Stazione|Vagone|Ferrovia|Locomotiva
Diamante|Pietra|Prezioso|Anello|Brillante|Gioiello
Clessidra|Sabbia|Tempo|Vetro|Scorrere|Girare
Scacchi|Re|Regina|Pedone|Scacchiera|Matto
Aquilone|Vento|Volare|Filo|Cielo|Carta
Bicicletta|Ruote|Pedali|Manubrio|Sella|Catena
Candela|Fiamma|Cera|Luce|Stoppino|Spegnere
Pigiama|Dormire|Notte|Letto|Vestito|Comodo
Zaino|Spalle|Scuola|Libri|Borsa|Spallacci
Fumetto|Disegni|Nuvolette|Storia|Supereroe|Vignette
Valigia|Viaggio|Bagaglio|Vestiti|Aeroporto|Partire
Moneta|Soldi|Euro|Metallo|Pagare|Spiccioli
Puzzle|Pezzi|Incastrare|Immagine|Completare|Gioco
Sirena|Mare|Coda|Pesce|Donna|Canto
Scala|Gradini|Salire|Scendere|Pioli|Piano
Chiave|Porta|Serratura|Aprire|Chiudere|Lucchetto
Microfono|Voce|Cantare|Parlare|Suono|Palco`,
  quotidiano: `Caffè|Tazzina|Espresso|Bar|Caffeina|Moka
Sveglia|Mattina|Suonare|Alzarsi|Dormire|Ora
Lavatrice|Bucato|Vestiti|Detersivo|Cestello|Lavare
Frigorifero|Freddo|Cibo|Cucina|Congelatore|Conservare
Dentista|Denti|Carie|Trapano|Bocca|Medico
Panettiere|Pane|Forno|Farina|Impasto|Negozio
Ascensore|Piani|Salire|Palazzo|Pulsante|Scale
Supermercato|Spesa|Carrello|Cassa|Prodotti|Scaffali
Parrucchiere|Capelli|Tagliare|Forbici|Piega|Salone
Computer|Schermo|Tastiera|Mouse|Internet|Portatile
Telefono|Chiamare|Numero|Cellulare|Messaggio|Squillare
Sapone|Lavare|Mani|Schiuma|Pulito|Profumo
Colazione|Mattina|Latte|Biscotti|Caffè|Cornetto
Divano|Sedersi|Salotto|Cuscini|Televisione|Sofà
Bollette|Pagare|Luce|Gas|Scadenza|Utenze
Postino|Lettere|Posta|Consegnare|Cassetta|Francobollo
Tastiera|Tasti|Scrivere|Computer|Lettere|Invio
Parcheggio|Auto|Posto|Strisce|Sosta|Garage
Quaderno|Scuola|Scrivere|Pagine|Righe|Appunti
Spazzolino|Denti|Dentifricio|Lavare|Bocca|Setole
Forchetta|Posata|Mangiare|Denti|Coltello|Tavola
Doccia|Acqua|Lavarsi|Bagno|Calda|Soffione
Portafoglio|Soldi|Tasca|Carte|Contanti|Documenti
Calzino|Piede|Scarpa|Paio|Lana|Bucato
Telecomando|Televisione|Canale|Pulsante|Volume|Distanza
Ricetta|Ingredienti|Cucinare|Preparazione|Piatto|Dosi
Appuntamento|Incontro|Ora|Luogo|Agenda|Ritardo
Vicino|Casa|Condominio|Abitare|Pianerottolo|Rumore
Finestra|Vetro|Aprire|Casa|Luce|Davanzale
Ventilatore|Aria|Caldo|Pale|Estate|Rinfrescare
Ferro da stiro|Vestiti|Pieghe|Calore|Vapore|Asse
Calendario|Giorni|Mesi|Anno|Data|Settimana
Giornale|Notizie|Leggere|Carta|Quotidiano|Articoli
Cuffie|Musica|Orecchie|Ascoltare|Suono|Auricolari
Rubinetto|Acqua|Lavandino|Aprire|Chiudere|Goccia
Scontrino|Cassa|Acquisto|Prezzo|Carta|Negozio
Scopa|Pulire|Pavimento|Polvere|Manico|Spazzare
Cassonetto|Spazzatura|Rifiuti|Buttare|Raccolta|Differenziata
Pantofole|Casa|Piedi|Scarpe|Comode|Ciabatte
Termometro|Febbre|Temperatura|Misurare|Gradi|Malato`,
  natura: `Girasole|Fiore|Giallo|Sole|Semi|Campo
Delfino|Mare|Mammifero|Nuotare|Salto|Pinna
Farfalla|Ali|Insetto|Bruco|Volare|Colorata
Elefante|Proboscide|Zanne|Grigio|Grande|Africa
Gatto|Miao|Fusa|Felino|Baffi|Zampe
Cane|Abbaiare|Guinzaglio|Cucciolo|Osso|Fedele
Pinguino|Ghiaccio|Antartide|Bianco|Nero|Uccello
Leone|Criniera|Ruggito|Savana|Re|Felino
Tartaruga|Guscio|Lenta|Rettile|Mare|Testuggine
Polpo|Tentacoli|Otto|Mare|Inchiostro|Ventose
Giraffa|Collo|Lungo|Macchie|Savana|Alta
Ape|Miele|Alveare|Pungere|Fiore|Regina
Lupo|Ululare|Branco|Bosco|Cappuccetto|Predatore
Gufo|Notte|Uccello|Occhi|Rapace|Saggio
Serpente|Strisciare|Veleno|Rettile|Squame|Lingua
Canguro|Australia|Marsupio|Saltare|Cucciolo|Zampe
Riccio|Aculei|Pungere|Bosco|Palla|Animale
Squalo|Denti|Mare|Pinna|Predatore|Pesce
Balena|Mare|Grande|Mammifero|Soffio|Oceano
Coccinella|Rosso|Puntini|Insetto|Fortuna|Ali
Cascata|Acqua|Salto|Fiume|Roccia|Cadere
Deserto|Sabbia|Caldo|Dune|Oasi|Cammello
Foresta|Alberi|Bosco|Verde|Piante|Selvaggio
Neve|Bianca|Freddo|Inverno|Fiocchi|Sci
Fulmine|Lampo|Temporale|Cielo|Tuono|Elettricità
Quercia|Albero|Ghiande|Tronco|Foglie|Bosco
Corallo|Mare|Barriera|Rosso|Polipi|Subacqueo
Fungo|Bosco|Cappello|Porcino|Spore|Velenoso
Ragnatela|Ragno|Fili|Insetti|Tessere|Trappola
Conchiglia|Mare|Spiaggia|Guscio|Mollusco|Sabbia
Rosa|Fiore|Spine|Rosso|Petali|Profumo
Luna|Notte|Satellite|Cielo|Piena|Terra
Stella|Cielo|Notte|Luce|Sole|Costellazione
Alba|Sole|Mattina|Sorgere|Orizzonte|Giorno
Tramonto|Sole|Sera|Orizzonte|Rosso|Scendere
Terremoto|Scossa|Terra|Sisma|Magnitudo|Tremare
Ghiacciaio|Ghiaccio|Montagna|Freddo|Sciogliere|Neve
Scoiattolo|Noci|Albero|Coda|Roditore|Ghiande
Fenicottero|Rosa|Uccello|Zampa|Lago|Collo
Camaleonte|Colore|Rettile|Mimetizzarsi|Lingua|Cambiare`,
  spettacolo: `Cinema|Film|Schermo|Popcorn|Sala|Attore
Teatro|Palco|Sipario|Attori|Spettacolo|Pubblico
Concerto|Musica|Cantante|Palco|Pubblico|Biglietto
Calcio|Pallone|Gol|Porta|Squadra|Campo
Basket|Canestro|Palla|Cestino|Pallacanestro|Campo
Tennis|Racchetta|Pallina|Rete|Set|Campo
Pallavolo|Rete|Palla|Schiacciata|Bagher|Squadra
Nuoto|Piscina|Acqua|Vasca|Stile|Bracciata
Sci|Neve|Montagna|Pista|Bastoncini|Discesa
Maratona|Corsa|Chilometri|Atletica|Resistenza|Traguardo
Arbitro|Fischietto|Partita|Cartellino|Regole|Giudice
Portiere|Porta|Parata|Guanti|Gol|Calcio
Pianoforte|Tasti|Musica|Bianco|Nero|Strumento
Batteria|Tamburi|Bacchette|Ritmo|Musica|Piatti
Violino|Arco|Corde|Musica|Spalla|Strumento
DJ|Musica|Dischi|Discoteca|Mixare|Consolle
Karaoke|Cantare|Microfono|Testo|Base|Canzone
Balletto|Danza|Punte|Tutu|Teatro|Classica
Romanzo|Libro|Storia|Scrittore|Leggere|Capitolo
Poesia|Versi|Rima|Poeta|Scrivere|Strofa
Museo|Arte|Quadri|Mostra|Visitare|Opere
Pittura|Colori|Pennello|Tela|Quadro|Dipingere
Scultura|Statua|Marmo|Arte|Scolpire|Pietra
Supereroe|Poteri|Mantello|Salvare|Fumetto|Maschera
Videogioco|Console|Controller|Giocare|Schermo|Livelli
Cartone animato|Disegni|Bambini|Televisione|Animazione|Personaggi
Oscar|Cinema|Premio|Statuetta|Film|Hollywood
Regista|Film|Dirigere|Cinema|Attori|Ciak
Sceneggiatura|Film|Testo|Dialoghi|Scrivere|Scene
Circo|Tendone|Clown|Acrobati|Spettacolo|Pista
Prestigiatore|Magia|Trucchi|Carte|Illusione|Cappello
Olimpiadi|Sport|Medaglia|Giochi|Atleti|Cinque
Podio|Vincitore|Medaglia|Primo|Tre|Premio
Stadio|Tifosi|Partita|Campo|Tribuna|Calcio
Surf|Onde|Tavola|Mare|Equilibrio|Spiaggia
Yoga|Posizioni|Respiro|Meditazione|Tappetino|Flessibilità
Bowling|Birilli|Palla|Pista|Strike|Dieci
Scherma|Spada|Fioretto|Maschera|Duello|Affondo
Fumettista|Disegno|Vignette|Matita|Storie|Nuvolette
Applauso|Mani|Battere|Pubblico|Spettacolo|Bravo`,
  viaggio: `Aeroporto|Aereo|Volo|Bagaglio|Decollo|Terminal
Passaporto|Documento|Viaggio|Frontiera|Identità|Timbro
Venezia|Canali|Gondola|Laguna|San Marco|Acqua
Roma|Colosseo|Capitale|Italia|Pontefice|Impero
Parigi|Francia|Torre Eiffel|Senna|Capitale|Louvre
Londra|Inghilterra|Big Ben|Tamigi|Regno Unito|Capitale
Napoli|Vesuvio|Pizza|Campania|Golfo|Partenope
Firenze|Toscana|Rinascimento|Duomo|Uffizi|Arno
Milano|Duomo|Lombardia|Moda|Scala|Navigli
Pisa|Torre|Pendente|Toscana|Miracoli|Galileo
Campeggio|Tenda|Natura|Sacco a pelo|Vacanza|Roulotte
Hotel|Albergo|Camera|Pernottare|Reception|Stelle
Spiaggia|Mare|Sabbia|Ombrellone|Estate|Lettino
Montagna|Cima|Altezza|Scalare|Neve|Valle
Isola|Mare|Acqua|Terra|Circondata|Arcipelago
Bus|Autobus|Fermata|Passeggeri|Biglietto|Autista
Metropolitana|Sotterraneo|Treno|Città|Stazione|Linea
Traghetto|Nave|Mare|Isola|Porto|Imbarcare
Crociera|Nave|Vacanza|Mare|Porto|Cabina
Bussola|Nord|Orientarsi|Ago|Direzione|Magnetico
Mappa|Cartina|Strade|Percorso|Geografia|Orientarsi
Safari|Africa|Animali|Jeep|Savana|Fotografie
Souvenir|Ricordo|Viaggio|Regalo|Oggetto|Turista
Guida|Turistica|Visitare|Spiegare|Gruppo|Monumenti
Piramide|Egitto|Faraone|Triangolo|Tomba|Deserto
Igloo|Ghiaccio|Casa|Neve|Freddo|Inuit
Pagoda|Tempio|Asia|Tetti|Buddista|Torre
Fiordo|Norvegia|Mare|Insenatura|Montagne|Ghiacciaio
Oasi|Deserto|Acqua|Palme|Sabbia|Verde
Tropici|Caldo|Equatore|Palme|Clima|Latitudine
Autostrada|Auto|Casello|Pedaggio|Corsie|Viaggio
Rotonda|Strada|Circolare|Incrocio|Auto|Precedenza
Taxi|Auto|Tassametro|Autista|Corsa|Pagare
Funivia|Montagna|Cabina|Cavo|Salire|Impianto
Rifugio|Montagna|Escursione|Dormire|Sentiero|Baita
Escursione|Camminare|Sentiero|Natura|Trekking|Zaino
Frontiera|Confine|Paese|Dogana|Passaporto|Stato
Fuso orario|Ora|Viaggio|Differenza|Paesi|Jet lag
Bagaglio|Valigia|Viaggio|Peso|Aereo|Stiva
Prenotazione|Riservare|Hotel|Posto|Data|Conferma`,
  extra: `Nostalgia|Passato|Ricordo|Mancanza|Rimpianto|Tempo
Democrazia|Popolo|Voto|Governo|Elezioni|Politica
Algoritmo|Procedura|Computer|Istruzioni|Calcolo|Sequenza
Gravità|Forza|Cadere|Terra|Newton|Attrazione
Fotosintesi|Piante|Sole|Luce|Clorofilla|Ossigeno
Paradosso|Contraddizione|Logica|Assurdo|Vero|Falso
Metafora|Figura|Retorica|Similitudine|Paragone|Linguaggio
Ironia|Contrario|Scherzo|Dire|Sarcasmo|Umorismo
Empatia|Emozioni|Altro|Comprendere|Sentimenti|Immedesimarsi
Intuizione|Idea|Improvvisa|Capire|Istinto|Lampadina
Equilibrio|Stabilità|Bilancia|Cadere|Peso|Mantenere
Silenzio|Rumore|Suono|Tacere|Parlare|Quiete
Libertà|Libero|Scelta|Prigione|Diritti|Vincoli
Pazienza|Aspettare|Calma|Tempo|Attesa|Sopportare
Coraggio|Paura|Audacia|Eroe|Affrontare|Rischio
Curiosità|Sapere|Scoprire|Domanda|Interesse|Conoscere
Infinito|Fine|Senza|Eterno|Numero|Universo
Orizzonte|Linea|Cielo|Terra|Mare|Lontano
Eco|Suono|Ripetere|Voce|Montagna|Rimbombo
Miraggio|Deserto|Illusione|Acqua|Caldo|Vedere
Déjà vu|Già|Visto|Sensazione|Ricordo|Passato
Utopia|Ideale|Società|Perfetto|Impossibile|Mondo
Rivoluzione|Cambiamento|Rivolta|Popolo|Potere|Francese
Rinascimento|Arte|Firenze|Epoca|Rinascita|Leonardo
Archeologia|Scavi|Antico|Reperti|Storia|Rovine
Filosofia|Pensiero|Sapere|Socrate|Domande|Saggezza
Astronomia|Stelle|Pianeti|Spazio|Telescopio|Universo
Eclissi|Sole|Luna|Ombra|Oscuramento|Allineamento
Atomo|Materia|Nucleo|Elettroni|Particella|Piccolo
Molecola|Atomi|Chimica|Legame|Materia|Composto
Evoluzione|Darwin|Specie|Adattamento|Selezione|Natura
Riciclaggio|Rifiuti|Riutilizzare|Differenziata|Materiali|Ambiente
Energia|Forza|Lavoro|Elettricità|Potenza|Joule
Burocrazia|Uffici|Documenti|Procedure|Stato|Moduli
Inflazione|Prezzi|Aumento|Economia|Denaro|Acquisto
Brevetto|Invenzione|Diritto|Registrare|Esclusiva|Idea
Volontariato|Aiutare|Gratis|Solidarietà|Associazione|Tempo
Sostenibilità|Ambiente|Futuro|Risorse|Ecologia|Pianeta
Resilienza|Difficoltà|Superare|Adattarsi|Forza|Reagire
Serendipità|Scoperta|Caso|Fortuna|Inatteso|Trovare`,
};

const expansions: Record<DeckId, string> = {
  classico,
  quotidiano,
  natura,
  spettacolo,
  viaggio,
  extra,
};

export const CARDS: Card[] = DECKS.flatMap(({ id }) =>
  // Keep the original forty cards first so saved card IDs remain valid.
  `${raw[id]}\n${expansions[id]}`.split('\n').map((line, index) => {
    const [word, ...forbidden] = line.split('|');
    return {
      id: `${id}-${index + 1}`,
      word: word!,
      forbidden: forbidden as Card['forbidden'],
      deck: id,
    };
  }),
);
export const CARD_MAP = new Map(CARDS.map((card) => [card.id, card]));
