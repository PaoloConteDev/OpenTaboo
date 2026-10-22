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
