# Verifica del progetto

Data: 22 ottobre 2026.

| Verifica                                                    | Esito                            |
| ----------------------------------------------------------- | -------------------------------- |
| TypeScript strict e controllo import/parametri inutilizzati | Superato                         |
| Test automatici della logica e delle lingue                 | 24 superati                      |
| Expo Doctor                                                 | 20 controlli su 20 superati      |
| Esportazione web di produzione                              | Generata con font e audio locali |
| Esportazione Android                                        | Bundle Hermes e asset generati   |
| Avvio e navigazione nel browser                             | Verificati                       |
| Layout telefono a 390 pixel                                 | Verificato                       |

Il collaudo manuale nel browser comprende: configurazione di 2 e 4 squadre, timer e mazzi, conto alla rovescia, scadenza automatica, risposta corretta, penalità, passaggio, pausa e ripresa, riepilogo con correzione, assegnazione dei punti, passaggio di squadra, vittoria e storico conservato dopo il ricaricamento. La logica con 3 squadre e le altre combinazioni è coperta dai test.

L’ampliamento del database comprende 300 carte per mazzo, 1.800 parole principali uniche e cinque parole vietate distinte per ogni carta. Il test di migrazione verifica l’estensione dei vecchi mazzi senza spostare la carta corrente o perdere i progressi.

Il supporto multilingue include italiano, inglese, spagnolo, tedesco e francese: 1.800 carte per lingua, sempre 300 per mazzo. I controlli verificano ID identici e cinque parole vietate distinte in ogni versione, cataloghi dell’interfaccia completi, parametri dei messaggi e forme plurali. La scelta iniziale usa la lingua del sistema, con ripiego in inglese; una scelta manuale salvata ha precedenza, anche con varianti regionali del dispositivo.

Il collaudo multilingue nel browser comprende cambio lingua, persistenza dopo ricaricamento, aggiornamento delle carte, pausa e carta nascosta all’apertura del selettore durante un turno, conservazione di nomi e punteggi, e leggibilità a 390 pixel. Le traduzioni sono state generate localmente e corrette per ambiguità, nomi geografici e collisioni fra sinonimi; i termini specialistici non hanno ricevuto una revisione professionale completa. Vedi `TRANSLATIONS.md` per la manutenzione.

Le schermate in `preview-desktop.png` e `preview-mobile.png` sono acquisizioni dell’app in esecuzione, non mockup.

Il progetto **non è stato collaudato su hardware Android**. L’esportazione Hermes verifica la compilazione del codice e il confezionamento degli asset; non sostituisce il collaudo nativo. Audio e vibrazione su hardware restano da verificare.

## Verifica dell’APK e permessi Android

L’APK di anteprima compilato tramite EAS il 22 ottobre 2026 (versione 1.0.0, codice 1) è stato scaricato e analizzato staticamente con gli strumenti Android SDK. `apksigner verify --verbose` conferma una firma v2 valida; `aapt dump badging` conferma il pacchetto `it.university.opentaboo`, minimo API 24 e target API 36. Questi controlli non certificano la sicurezza dell’app né spiegano da soli un avviso Play Protect.

Nell’APK originale erano presenti `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE` e `WRITE_EXTERNAL_STORAGE`, non necessari al gioco. La configurazione aggiornata li esclude, insieme ai permessi per microfono e riproduzione multimediale in background già esclusi. L’APK aggiornato è stato compilato con EAS il 22 ottobre 2026 (build `f2c0f326-8f19-4747-bdf5-4f6957a9fec1`), scaricato e verificato: firma valida e certificato identico a quello precedente, pacchetto `it.university.opentaboo`, versione 1.0.0 e codice 1. L’ispezione del manifest conferma l’assenza dei permessi rimossi; restano Internet, stato della rete, audio, vibrazione, wake lock e il permesso interno del ricevitore non esportato. Il collaudo completo della nuova versione sul telefono resta da confermare. Il motivo preciso del precedente blocco Play Protect non è stato identificato.

`npm audit` segnala 15 advisory alti nella catena transitiva degli strumenti Expo/Metro (radici: `braces` e `node-forge`). Non è stato eseguito `audit fix --force`, che propone downgrade incompatibili di Expo e React Native. Il lockfile mantiene le versioni allineate a SDK 58; aggiornare la toolchain quando vengono pubblicate correzioni compatibili.

## APK con mazzi personalizzati · 23 ottobre 2026

La [build EAS `6720e837-00da-46b1-aa05-7a25524adb71`](https://expo.dev/accounts/gleetch/projects/open-taboo/builds/6720e837-00da-46b1-aa05-7a25524adb71), profilo `preview`, è terminata con successo. L’APK è stato scaricato in `artifacts/Open-Taboo-mazzi-custom.apk` (79.028.554 byte). La cartella `artifacts/` è esclusa da Git; il binario non è stato pubblicato in una nuova GitHub Release.

- Pacchetto: `it.university.opentaboo`; versione visualizzata: `1.0.0`; `versionCode`: `1`.
- Firma APK v2 valida, con certificato SHA-256 `717c43336be23455d945c064c8e04d82b6c52a53b39c0f322b04d3ee4da81ec1`, identico all’APK precedente.
- SHA-256 del file APK: `3909d79f31bac8282260582e8e643adf752289f784b0a36202617321250899fd`.
- Il bundle incluso nell’APK contiene il codice e i testi dell’editor dei mazzi personalizzati.
- TypeScript, 29 test automatici, integrità delle carte ed esportazioni web e Android superati prima della build.
- Collaudo nel browser: creazione di più mazzi, colori, selezione combinata, filtro per lingua, persistenza dopo ricaricamento, partita con carte personalizzate, riepilogo e modifica delle carte senza alterare una partita salvata. Editor verificato anche a 390 pixel.

Questa è una build interna dei sorgenti modificati, ancora non committati. La versione numerica non è stata incrementata. Prima di una nuova release pubblica, seguire `RELEASING.md` per versionamento, commit, tag e allegato APK. Installazione e funzionamento su hardware Android restano da verificare.

## Separazione dei mazzi · 23 ottobre 2026

La schermata dei mazzi distingue ora **Mazzi inclusi** e **Mazzi personalizzati**, con **Crea un mazzo** sotto l’elenco personalizzato. Il filtro per lingua e la selezione combinata restano disponibili. Sono stati verificati l’apertura dell’editor dal pulsante spostato, lo stato senza mazzi personalizzati in inglese e il layout desktop e telefono a 390 pixel. TypeScript, tutti i 29 test e la formattazione dei file modificati sono passati; l’esportazione web è riuscita.

La [build EAS `9c750712-2ff5-48ee-815f-40298f1bc9f0`](https://expo.dev/accounts/gleetch/projects/open-taboo/builds/9c750712-2ff5-48ee-815f-40298f1bc9f0) è terminata con successo. Il nuovo APK è in `artifacts/Open-Taboo-mazzi-separati.apk` (79.030.318 byte), con SHA-256 `43e023b32950584c94fb5b74633b9352d10d677c917cd1443276873206da3626`. La firma APK v2 è valida e usa lo stesso certificato della build precedente; pacchetto, versione `1.0.0` e `versionCode` `1` restano invariati. Il bundle dell’APK contiene i nuovi titoli delle sezioni e il messaggio per la sezione vuota.

Il binario non è stato pubblicato su GitHub e non è stato collaudato su hardware Android.

## Preparazione release 1.1.0 · 23 ottobre 2026

La versione dei sorgenti è `1.1.0`, sincronizzata fra `app.json`, `package.json` e i metadati del lockfile. Il codice Android è `2`; `eas.json` usa esplicitamente la gestione locale delle versioni. La schermata delle impostazioni legge la versione da `app.json`. TypeScript e tutti i 29 test sono passati dopo queste modifiche.

La [build EAS `057bed9a-fccb-42aa-9525-1c3af8727506`](https://expo.dev/accounts/gleetch/projects/open-taboo/builds/057bed9a-fccb-42aa-9525-1c3af8727506) è terminata con successo. L’APK da allegare alla release è `artifacts/Open-Taboo-v1.1.0.apk` (79.032.030 byte), con SHA-256 `22ac82f2f569165335aca3fda9801bad0b47905e789c4e8d1a1561ed6a9d9c0f`.

`aapt dump badging` conferma pacchetto `it.university.opentaboo`, versione `1.1.0`, codice `2`, minimo API 24 e target API 36. `apksigner verify --verbose --print-certs` conferma una firma v2 valida e lo stesso certificato delle build precedenti. Il checksum è salvato anche in `artifacts/Open-Taboo-v1.1.0.apk.sha256`.

Sono pronti il changelog 1.1.0 e `RELEASE_NOTES_1.1.0.md`. La procedura per commit, tag, push e pubblicazione su GitHub è in `RELEASING.md`; il collaudo del nuovo APK su hardware Android non è stato registrato.

## APK 1.1.1 compilato in locale · 23 ottobre 2026

L’APK `artifacts/Open-Taboo-v1.1.1.apk` è stato compilato su Windows con Java 21 e Gradle 9.4.1, tramite `gradlew.bat app:assembleRelease`. Il tag `v1.1.1` identifica il commit sorgente `23a6ff30d34455eda41d6ae824e0670fbbfb9324`. La build cloud avviata in precedenza è stata annullata dopo il successo della compilazione locale.

- Pacchetto: `it.university.opentaboo`; versione `1.1.1`; codice Android `3`.
- File: 79.026.750 byte; SHA-256 `a76eb1cc25a4f2a175b2e108f05fc36ee876b944b0abdb07d0ce22d534f7392a`.
- Firma verificata con `apksigner`; certificato SHA-256 `717c43336be23455d945c064c8e04d82b6c52a53b39c0f322b04d3ee4da81ec1`, identico alle release precedenti.
- Il bundle contiene il link GitHub e non contiene più i testi dello storico rimosso. Il manifest non include i permessi esplicitamente bloccati; l’APK non contiene file di firma privati.
- TypeScript e tutti i 29 test sono passati. Impostazioni, icona a ingranaggio e link sono stati verificati nel browser, anche nel layout a 390 pixel.

La prima build locale ha richiesto Gradle 9.4.1 e i componenti Android SDK 37. Un errore di Ninja sui percorsi lunghi è stato risolto impostando `CMAKE_OBJECT_PATH_MAX=240` nella configurazione CMake del progetto Android generato. La build successiva è riuscita, riutilizzando la cache. Le credenziali della firma esistente sono state scaricate con EAS e restano escluse da Git e dagli archivi di build, insieme al progetto Android generato. Non è stato registrato un collaudo su hardware Android.
