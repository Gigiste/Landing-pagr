# PartiPronto – Kit di partenza (affiliate marketing viaggi)

Sito che risponde alla domanda **"Cosa mi serve per partire per X?"** e guadagna con le affiliazioni sugli acquisti che quel viaggio richiede davvero: assicurazione, eSIM, carta multivaluta, tour, auto, hotel, traghetti. In più porta clienti a MiSpetta.

- **Strumento interattivo** (home): destinazione + giorni + uso di internet → kit personalizzato con giga calcolati, documenti, permessi (solo siti ufficiali), prese, soldi, emergenze.
- **44 schede Paese** generate dai dati, con domande frequenti e dati strutturati per Google e per le AI.
- **5 guide** che portano agli acquisti: eSIM, assicurazione, permessi d'ingresso, pagamenti all'estero, voli in ritardo.
- **Link di affiliazione centralizzati**: tutti in `config.js`, mai in chiaro nelle pagine (`/vai/<chiave>/<pagina>`). Il nome della pagina finisce nel subid, così sai quale pagina vende.
- **Nessun cookie, nessun banner**; trasparenza sulle affiliazioni in ogni pagina.

## Documenti
| File | Contenuto |
|---|---|
| **STRATEGIA.md** | Perché questa nicchia, modello di guadagno, programmi a cui iscriversi, traffico senza pubblicità, strumenti, rischi, metriche |
| **PIANO-90-GIORNI.md** | Cosa fare settimana per settimana |
| **CONTENUTI.md** | Script video, pin, risposte per i gruppi, sequenza email, canale |
| **CONFORMITA.md** | Trasparenza, privacy, Amazon, fisco: cosa è fatto e cosa devi fare tu |

## Come si modifica
1. **Impostazioni e link:** solo `config.js`.
2. **Destinazioni:** `data/paesi.js` (aggiungi un oggetto e hai una nuova pagina).
3. **Guide e pagine:** `src/` (frammenti HTML; `<a data-aff="esim">testo</a>` diventa un pulsante affiliato).
4. Rigenera: `node tools/build.js` → tutto finisce in `public/`.
5. Collaudo: `node --test tests/*.test.js` (dati, logica, link interni, `rel="sponsored"`, redirect, `public/` aggiornata).

## Metterlo online (Cloudflare Pages, gratis)
1. dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** → scegli questo repository.
2. Impostazioni di build: **Build command** `node tools/build.js` · **Build output directory** `public`.
3. **Custom domains** → aggiungi il tuo dominio.
4. Ogni modifica salvata su GitHub ripubblica il sito da sola.

Funziona anche su Netlify (stessa build e stessa cartella; `_redirects` e `_headers` sono compatibili).

## Struttura
```
config.js            impostazioni e link di affiliazione (l'unico file da toccare di solito)
data/paesi.js        44 destinazioni: documenti, permessi, prese, roaming, sanità, note
src/                 pagine (home, note legali, 404) e guide
src/assets/          grafica, logica del kit (usata sia in build sia nel browser), strumento
tools/build.js       generatore del sito, nessuna dipendenza
tests/               collaudo automatico
public/              sito generato, pronto da pubblicare
```

Nota: il file `Index. html.` è il vecchio modello vuoto del repository; non viene usato e si può cancellare.
