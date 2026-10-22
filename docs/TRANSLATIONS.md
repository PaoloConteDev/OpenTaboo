# Lingue e carte

L’app include italiano, inglese, spagnolo, tedesco e francese. Non utilizza servizi di traduzione durante l’esecuzione.

Il primo avvio legge la lingua predefinita del dispositivo tramite `Intl.DateTimeFormat().resolvedOptions().locale`, disponibile in Hermes e nel browser. Il codice accetta le varianti regionali e usa inglese per lingue non supportate o locale non disponibile. Una scelta effettuata dal selettore ha precedenza e viene salvata nella chiave AsyncStorage `@open-taboo/language-v1`, separata dal salvataggio della partita.

Il pulsante con l’icona delle lingue si trova a sinistra dei trofei. La scelta aggiorna menu, regole, mazzi, carte e riepiloghi. Durante un turno, aprire il selettore mette in pausa e nasconde la carta; la ripresa è esplicita. I nomi delle squadre restano come inseriti dall’utente.

## Modificare i testi

`src/i18n/messages.ts` contiene cinque colonne separate da `|||`, nell’ordine italiano, inglese, spagnolo, tedesco e francese. La prima colonna è anche la chiave usata da `t(...)`. I parametri usano `{{0}}`, `{{1}}`, ecc.; `{{0|singolare|plurale}}` sceglie una forma in base al numero.

## Modificare le carte

Le carte italiane sono in `src/data/cards.ts` e `src/data/expansion/`. Le altre lingue sono file JSON in `src/data/locales/`: ogni ID contiene un array con la parola principale seguita dalle cinque parole vietate. Non cambiare gli ID, perché identificano le carte nelle partite salvate. `src/data/localizedCards.ts` restituisce la versione nella lingua selezionata senza modificare la coda di gioco.

Ogni lingua contiene 1.800 carte, 300 per mazzo, per un totale di 9.000 versioni. Le traduzioni sono state preparate con modelli locali e correzioni editoriali di ambiguità, sinonimi e termini specialistici. Non costituiscono una revisione professionale completa; ulteriori correzioni linguistiche possono essere applicate direttamente ai JSON. I modelli, gli strumenti temporanei e i dizionari intermedi non sono necessari per avviare o compilare l’app.

`npm test` verifica le lingue supportate, il ripiego in inglese, la precedenza della scelta manuale, i messaggi parametrizzati, le 300 carte per mazzo, cinque parole vietate distinte e la conservazione dei progressi al cambio lingua.
