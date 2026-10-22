# Verifica del progetto

Data: 22 ottobre 2026.

| Verifica                                                    | Esito                            |
| ----------------------------------------------------------- | -------------------------------- |
| TypeScript strict e controllo import/parametri inutilizzati | Superato                         |
| Test automatici della logica                                | 15 superati                      |
| Expo Doctor                                                 | 20 controlli su 20 superati      |
| Esportazione web di produzione                              | Generata con font e audio locali |
| Esportazione Android                                        | Bundle Hermes e asset generati   |
| Avvio e navigazione nel browser                             | Verificati                       |
| Layout telefono a 390 pixel                                 | Verificato                       |

Il collaudo manuale nel browser comprende: configurazione di 2 e 4 squadre, timer e mazzi, conto alla rovescia, scadenza automatica, risposta corretta, penalità, passaggio, pausa e ripresa, riepilogo con correzione, assegnazione dei punti, passaggio di squadra, vittoria e storico conservato dopo il ricaricamento. La logica con 3 squadre e le altre combinazioni è coperta dai test.

L’ampliamento del database comprende 300 carte per mazzo, 1.800 parole principali uniche e cinque parole vietate distinte per ogni carta. Il test di migrazione verifica l’estensione dei vecchi mazzi senza spostare la carta corrente o perdere i progressi.

Le schermate in `preview-desktop.png` e `preview-mobile.png` sono acquisizioni dell’app in esecuzione, non mockup.

Non era collegato un telefono Android e non era configurato un emulatore: il progetto **non è stato collaudato su hardware Android** e non è stato compilato un APK. L’esportazione Hermes verifica la compilazione del codice e il confezionamento degli asset; non sostituisce il collaudo nativo. Audio e vibrazione su hardware restano da verificare con il client Expo compatibile o con una build APK.

`npm audit` segnala 15 advisory alti nella catena transitiva degli strumenti Expo/Metro (radici: `braces` e `node-forge`). Non è stato eseguito `audit fix --force`, che propone downgrade incompatibili di Expo e React Native. Il lockfile mantiene le versioni allineate a SDK 58; aggiornare la toolchain quando vengono pubblicate correzioni compatibili.
