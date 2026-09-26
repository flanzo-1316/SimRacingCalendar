# 🏁 SimRacing Calendar

Un calendario settimanale unico per tutti i campionati di **sim racing F1**: ogni settimana in cui la Formula 1 reale corre su un circuito, tutti i campionati sim dovrebbero allenarsi sullo stesso tracciato.

## Perché

- **Community diverse, stesso circuito**: amici che corrono in campionati sim diversi possono allenarsi insieme nella stessa settimana.
- **Meno tempo, più campionati**: chi ha poco tempo ma vuole correre in più campionati non deve imparare due tracciati diversi nella stessa settimana.

L'obiettivo è che le varie community di sim racing aderiscano a questo calendario condiviso.

## Come funziona

Il sito mostra, settimana per settimana, il circuito assegnato in base al calendario ufficiale F1 2026. La settimana corrente viene evidenziata automaticamente.

## Aggiornare il calendario

I dati vivono in [`data/calendar-2026.json`](data/calendar-2026.json). Per modificarli:

1. Modifica il file JSON (round, nome GP, circuito, località, data di gara).
2. Fai commit e push: GitHub Pages si aggiorna automaticamente.

## Sviluppo locale

Il progetto è HTML/CSS/JS statico, senza build step. Basta servire la cartella con un qualsiasi server statico, ad esempio:

```bash
python3 -m http.server 8080
```

poi apri `http://localhost:8080`.

## Deploy

Pubblicato tramite GitHub Pages dal branch `main`.
