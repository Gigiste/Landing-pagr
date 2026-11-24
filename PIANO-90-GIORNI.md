# Piano operativo 90 giorni

Tempo richiesto: circa 1 ora al giorno. Ogni settimana ha **un solo obiettivo misurabile**.

## Settimana 1 – Online e verificabile
- [ ] Compra il dominio (es. partipronto.it) e cambia `sito.nome` / `sito.dominio` in `config.js` se scegli un altro nome.
- [ ] Compila titolare, P.IVA ed email in `config.js` (vedi CONFORMITA.md per la parte fiscale).
- [ ] Pubblica su Cloudflare Pages (README → "Metterlo online").
- [ ] Collega Search Console e Bing Webmaster, invia `sitemap.xml`.
- [ ] Crea Umami Cloud e incolla il Website ID.
- [ ] Crea la newsletter (Brevo o MailerLite) e incolla l'indirizzo del modulo.
**Obiettivo:** sito online su dominio tuo, sitemap inviata.

## Settimana 2 – Programmi di affiliazione
- [ ] Travelpayouts: attiva Saily, DiscoverCars, Welcome Pickups, Ferryhopper (o i disponibili) e GetYourGuide.
- [ ] Heymondo: compila il modulo affiliati.
- [ ] Awin: iscriviti, candidati a seconda assicurazione, Ferryhopper, eSIM alternativa.
- [ ] Wise (o Revolut): programma partner.
- [ ] Amazon.it Affiliati: crea i 3 link degli adattatori (G, A/B, universale).
- [ ] Incolla ogni link in `config.js` con `{subid}` dove il network lo permette, poi `node tools/build.js`.
**Obiettivo:** almeno 6 pulsanti attivi su 12.

## Settimana 3 – Canali di proprietà
- [ ] Canale WhatsApp o Telegram "Allerta viaggi" con link nel footer del sito e nella bio dei social.
- [ ] Imposta la sequenza di benvenuto (5 email) da CONTENUTI.md.
- [ ] Apri profili TikTok, Instagram, YouTube e Pinterest con lo stesso nome del sito.
**Obiettivo:** primi 10 iscritti.

## Settimane 4–6 – Produzione quotidiana
- [ ] 1 video breve al giorno dalla serie "3 cose prima di partire per [Paese]" (script in CONTENUTI.md).
- [ ] 2 pin al giorno su Pinterest (scheda Paese + guida).
- [ ] 3 risposte utili al giorno in gruppi e forum di viaggio.
- [ ] 3 nuove pagine a settimana: isole e città più cercate (Tenerife, Bali, Zanzibar, Sharm el-Sheikh, New York, Tokyo, Mykonos, Santorini, Ibiza, Formentera, Marrakech, Dubai, Londra, Parigi…). Chiedi a Claude: *"aggiungi la scheda di [luogo]"*.
**Obiettivo:** 100 visite organiche a settimana.

## Settimane 7–9 – Momenti di picco e link
- [ ] Imposta un promemoria per ogni sciopero del trasporto aereo annunciato: il giorno prima pubblica pagina + video + messaggio nel canale.
- [ ] Contatta 10 agenzie (già nella lista di MiSpetta) e 10 micro-creator di viaggio proponendo il kit gratuito come risorsa.
- [ ] Scrivi 3 guide "comparative" per le destinazioni che convertono di più (Search Console + pannelli affiliati).
**Obiettivo:** 500 visite organiche a settimana, primi 5 link spontanei.

## Settimane 10–12 – Ottimizza ciò che rende
- [ ] Per ogni pagina: ricavo ÷ visite. Le prime 5 ricevono nuovi contenuti collegati (regola di raddoppio).
- [ ] Programmi con meno di 2 vendite ogni 300 clic → sostituisci con l'alternativa.
- [ ] Ricontrolla tutte le regole d'ingresso, aggiorna `data/paesi.js` e `sito.data_verifica_dati`.
- [ ] Prepara le pagine della stagione successiva con 6–8 settimane di anticipo (in autunno: Thailandia, Maldive, Caraibi, Egitto, Giappone in fiore; in primavera: Grecia, Spagna, Croazia, USA).
**Obiettivo:** 1.000 visite organiche a settimana e primo ricavo ricorrente.

## Ogni mese, per sempre
1. Verifica regole d'ingresso su viaggiaresicuri.it (15 minuti con l'aiuto di Claude).
2. Aggiorna `data_verifica_dati`, rigenera, pubblica.
3. Controlla in Search Console le query con molte impressioni e pochi clic: migliora titolo e descrizione di quelle pagine.
