# Open Taboo

Un party game in italiano per Android, realizzato con **Expo SDK 58, React Native 0.88, React 19.3 e TypeScript**. Progetto universitario indipendente, con grafica, icona, carte e suoni originali.

## Avvio rapido

Richiede Node.js **22.13+ sulla linea 22, 24.3+ sulla linea 24, oppure 26+**, e npm. La prima installazione richiede Internet.

```sh
npm ci
npm start
```

Le dipendenze sono già installate nella cartella di lavoro consegnata: qui puoi eseguire direttamente `npm start`. Usa `npm ci` dopo aver estratto l’archivio su un altro computer.

- **Android:** apri il QR con una versione di **Expo Go compatibile con SDK 58**; oppure premi `a` con un emulatore Android già avviato. Computer e telefono devono raggiungere il server Metro sulla stessa rete.
- **Browser:** esegui `npm run web` oppure premi `w` nella CLI.
- **Porta occupata:** `npm start -- --port 8082`.

### Compatibilità Expo Go al 22 ottobre 2026

SDK 58 è stato pubblicato il 15 ottobre 2026. Le [note ufficiali di Expo](https://expo.dev/changelog/sdk-58) segnalano che Expo Go per SDK 58 arriverà negli store nelle settimane successive. Se il client installato segnala un’incompatibilità, verifica la disponibilità della versione Android corretta su [expo.dev/go](https://expo.dev/go), oppure genera l’APK autonomo con il profilo `preview` descritto sotto. Il progetto usa SDK 58 stabile, senza pacchetti beta.

## Funzioni incluse

- **2–4 squadre**, con nomi modificabili fino a 20 caratteri e un colore per squadra.
- Timer da **30, 45, 60, 90 o 120 secondi**, preceduto da un conto alla rovescia.
- **1, 3, 5 o 7 round**; in ogni round tutte le squadre giocano una volta.
- **1.800 carte italiane originali**, ognuna con parola principale e **5 parole vietate**.
- Sei mazzi da **300 carte ciascuno**, combinabili: Il grande classico, Vita quotidiana, Un mondo selvaggio, Ciak si gioca, In giro per il mondo, Fuori dagli schemi.
- Indovinata **+1**; penalità Taboo di **0, −1 o −2**; penalità passaggio di **0 o −1**.
- Passaggi per turno: **0, 3, 5 o illimitati**.
- Mazzo mescolato con Fisher–Yates: nessuna ripetizione prima dell’esaurimento. Alla fine viene rimescolato. La carta rimasta scoperta a fine turno viene scartata prima della squadra successiva.
- Riepilogo delle carte con **correzione degli esiti prima della conferma** del punteggio.
- Classifica finale, vittorie a pari merito e rivincita con le stesse regole.
- Pausa manuale, **pausa automatica in background**, ripristino della partita con carta nascosta e tempo residuo conservato.
- Salvataggio di preferenze, partita e ultime **20 partite** sul dispositivo tramite AsyncStorage.
- I salvataggi con i vecchi mazzi da 40 carte vengono estesi automaticamente, conservando carta corrente, tempo, esiti e punteggi.
- Animazioni delle carte, **5 suoni originali locali**, vibrazione opzionale e schermo mantenuto acceso durante il turno.
- Interfaccia adattiva per telefono, tablet e browser; viola, corallo, arancione e carte arrotondate.
- Regole, selezione dei mazzi e impostazioni integrate. Nessun account, annuncio o servizio remoto di gioco.

## Offline: sviluppo e app installata

Carte, caratteri Outfit, icone e suoni sono inclusi nel bundle: il gioco non chiama API e non scarica contenuti durante la partita.

**Un APK installato funziona interamente offline**, anche dal primo avvio. La sessione di sviluppo con Expo Go usa Metro e richiede invece il collegamento al computer per caricare il codice. `npx expo start --offline` evita i controlli Internet della CLI, ma non elimina il collegamento locale a Metro.

La versione web è un’anteprima funzionale. Non include un service worker per l’avvio offline a browser chiuso; il requisito offline è implementato nell’app Android installata.

## Generare un APK Android

Il file `eas.json` include un profilo `preview` per un APK installabile senza Expo Go e un profilo `production` per un Android App Bundle.

```sh
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
```

EAS richiede un account Expo e Internet per la compilazione. Al termine scarica l’APK dal link restituito da EAS e installalo sul telefono. La build non è stata inviata a EAS durante la preparazione del progetto.

Per lo sviluppo nativo locale, con Android Studio, JDK e Android SDK configurati:

```sh
npx expo run:android
```

Gli identificativi predefiniti sono `it.university.opentaboo` per Android e iOS. Puoi modificarli in `app.json` prima di distribuire l’app.

## Verifiche e anteprima

```sh
npm run typecheck
npm test
npm run cards:check
npx expo-doctor
npm run export:android
npm run export:web
npm run preview
```

`npm run preview` serve l’esportazione web su [localhost:4173](http://localhost:4173); [localhost:4173/__mobile](http://localhost:4173/__mobile) la mostra in una cornice da telefono di 390 pixel. Il server è limitato all’interfaccia locale.

I test verificano integrità del database, mescolamento, regole di punteggio, limiti dei passaggi, blocco degli input a timer scaduto, equità dei turni con 2–4 squadre, fine partita, correzioni, scarto della carta rimasta e ripristino sicuro dei salvataggi.

L’esportazione Android verifica JavaScript, asset e compilazione Hermes: **non equivale alla compilazione di un APK o a un collaudo su dispositivo fisico**.

Per formattare i sorgenti: `npm run format`. Per rigenerare icone e suoni: `npm run assets`. Gli asset generati sono già presenti e non serve rigenerarli per avviare l’app.

## Struttura

```text
App.tsx                     Navigazione, timer, ciclo di vita e coordinamento della partita
src/
  components/UI.tsx         Componenti visivi, carte e animazioni
  screens/Lobby.tsx         Home, mazzi e regole
  screens/Setup.tsx         Squadre e configurazione
  screens/Match.tsx         Turno, pausa, riepilogo e classifica
  game/engine.ts            Logica pura, separata dall’interfaccia
  data/cards.ts             Metadati, carte iniziali e assemblaggio del database
  data/expansion/           Altre 260 carte originali per ciascuno dei sei mazzi
  hooks/useFeedback.ts      Audio e feedback tattile
  storage.ts                Persistenza serializzata e ripristino
  theme.ts                  Palette e tipografia
assets/                     Icone e cinque effetti WAV
scripts/                    Generazione asset e anteprima locale
tests/engine.test.ts        Test automatici della logica
app.json                    Configurazione Expo e permessi
eas.json                    Profili APK e App Bundle
package-lock.json           Versioni riproducibili delle dipendenze
```

## Personalizzare le carte

Le prime 40 carte di ciascun mazzo si trovano in `src/data/cards.ts`; le altre 260 nei sei file `src/data/expansion/`. Le carte iniziali mantengono gli identificativi della prima versione. Ogni riga contiene sei elementi separati da `|`:

```text
Pizza|Forno|Mozzarella|Pomodoro|Margherita|Napoli
```

Il primo elemento è la parola da indovinare; gli altri cinque sono vietati. Le 1.800 parole principali sono distinte in tutto il database. `npm run cards:check` controlla i file aggiuntivi, i duplicati e le cinque parole vietate; i test verificano anche le carte iniziali e la migrazione dei salvataggi. Per ampliare ulteriormente il database aggiorna i conteggi attesi nei controlli. I conteggi nell’interfaccia sono derivati dai dati.

## Regole e scelte tecniche

Il conteggio usa una scadenza assoluta (`Date.now()`), evitando che il timer rallenti quando un intervallo JavaScript arriva in ritardo. Anche il gestore dei pulsanti controlla la scadenza prima di assegnare un esito. Il punteggio può diventare negativo. Le scritture su storage sono serializzate per preservarne l’ordine; il timer viene salvato circa una volta al secondo e immediatamente al passaggio in background. In caso di chiusura forzata resta quindi possibile una differenza di circa un secondo rispetto all’ultimo fotogramma.

Il controllo delle parole vietate è affidato a una persona, come nel gioco da tavolo. L’app non registra e non richiede il microfono. La carta non risolta alla scadenza non assegna penalità. Gli esiti modificati nel riepilogo valgono per il punteggio definitivo del turno.

## Riferimento e attribuzioni

Direzione visiva ispirata alla [pagina Google Play di Taboo di Marmalade Game Studio](https://play.google.com/store/apps/details?id=com.marmalade.taboo&hl=it). Open Taboo è un’interpretazione didattica autonoma: non usa loghi, fotografie, schermate, suoni o database estratti dall’app ufficiale e non è affiliata a Hasbro o Marmalade Game Studio.

Il carattere **Outfit** è distribuito sotto SIL Open Font License; le icone **Lucide** sotto licenza ISC. Le rispettive licenze sono incluse nei pacchetti npm. Vedi `THIRD_PARTY_NOTICES.md` per i riferimenti.
