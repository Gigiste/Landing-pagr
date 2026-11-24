# Strategia – Affiliate marketing "Kit di partenza" (2026 →)

## 1. La tesi in una frase
Non costruiamo l'ennesimo blog "le 10 migliori eSIM" (nel 2026 quelle risposte le dà l'AI di Google e ChatGPT, e i clic crollano).
Costruiamo **uno strumento** che risponde alla domanda che ogni viaggiatore si fa 1–10 giorni prima di partire:
**"Cosa mi serve per andare lì?"** – e nel rispondere raccomanda i 3–4 acquisti che quel viaggio richiede davvero.

Perché funziona e dura:
| Leva | Perché è difficile da copiare o da spazzare via |
|---|---|
| **Strumento interattivo** | L'AI riassume testi, non sostituisce un calcolo personalizzato. Gli strumenti ricevono link spontanei e citazioni. |
| **Acquisti necessari, non impulsivi** | Assicurazione, eSIM, permessi: chi va negli USA *deve* risolverli. Conversione molto più alta dei prodotti "nice to have". |
| **Onestà come vantaggio** | Diciamo "in Spagna la eSIM non ti serve" e linkiamo l'ESTA ufficiale, non gli intermediari. Questo crea la fiducia che fa convertire i consigli che restano. |
| **Momento dell'acquisto** | L'utente arriva a ridosso della partenza, con la carta in mano. |
| **Pubblico ricorrente** | Chi viaggia lo rifà 2–4 volte l'anno: email e canale lo riportano ogni volta. |
| **Sinergia con MiSpetta** | Stesso pubblico: chi ha avuto un volo in ritardo sta per ripartire, e viceversa. Il kit porta clienti a MiSpetta (margine 100%). |

## 2. Come guadagna (modello)
Ogni scheda Paese e ogni kit generato mostra, nell'ordine di necessità:
1. **Assicurazione viaggio** – commissione più alta per vendita, decisiva fuori UE.
2. **eSIM** – acquisto quasi certo per ogni viaggio extra-UE, ripetuto a ogni viaggio.
3. **Carta multivaluta** – pagata a nuovo cliente (CPA), per Paesi fuori dall'euro.
4. **Tour/ingressi, auto, hotel, traghetti, transfer** – volumi alti, commissioni medie.
5. **MiSpetta** – prodotto tuo, margine pieno.
6. **Amazon** – adattatori di corrente (commissione bassa, ma clic numerosi su Paesi con prese G e A/B).

### Numeri di riferimento (ipotesi prudenti, da verificare con i tuoi dati)
| Visite/mese | Clic affiliati (25%) | Vendite (4% dei clic) | Commissione media | Ricavo/mese |
|---|---|---|---|---|
| 5.000 | 1.250 | 50 | 8 € | ~400 € |
| 20.000 | 5.000 | 200 | 8 € | ~1.600 € |
| 60.000 | 15.000 | 600 | 8 € | ~4.800 € |

Nessuno può garantire questi numeri: servono a capire **quali leve muovere** (visite, % di clic, conversione, commissione media).
La stagionalità è forte (picchi: marzo–agosto e novembre–dicembre); le destinazioni invernali (Thailandia, Maldive, Egitto, Caraibi, Giappone) riempiono i mesi freddi.

## 3. Programmi di affiliazione: dove iscriversi
Le commissioni cambiano spesso e i siti terzi riportano valori diversi: **le percentuali qui sotto sono indicative; vale ciò che vedi nel pannello del programma**.

| Chiave in config.js | Programma consigliato | Dove | Note indicative |
|---|---|---|---|
| `assicurazione` | Heymondo | heymondo.it → Affiliati (modulo diretto) | Molto conosciuto in Italia, sconto lettori; attribuzione 30 giorni dall'ultimo clic |
| `assicurazione_alt` | una seconda compagnia (es. altra assicurazione con programma su Awin/CJ) | Awin, CJ | Serve un'alternativa se la prima cambia condizioni |
| `esim` | Saily | Travelpayouts o Awin | Fonti terze: 10–15%, cookie 30 giorni o più |
| `esim_alt` | Airalo (o Holafly) | partners.airalo.com / Impact; Holafly diretto | Airalo ~10–12%; Holafly cookie lungo, commissione più bassa |
| `carta` | Wise (o Revolut) | programma partner Wise | Pagamento a nuovo cliente idoneo |
| `attivita` | GetYourGuide (o Civitatis) | partner.getyourguide.com, Awin, CJ | ~7–8%, cookie ~30 giorni |
| `auto` | DiscoverCars | discovercars.com/affiliate o Travelpayouts | Cookie 365 giorni, commissione media dichiarata ~20 $ a prenotazione |
| `hotel` | Booking.com (anche via Stay22) | Booking Affiliate Partner o Stay22 | Stay22 monetizza mappe e link hotel automaticamente |
| `traghetti` | Ferryhopper (o Direct Ferries) | Awin, Travelpayouts | Forte per Grecia, Croazia, Sardegna, Albania, Tunisia |
| `vpn` | NordVPN | programma diretto / network | Utile soprattutto per Cina e Wi-Fi pubblici |
| `trasferimenti` | Welcome Pickups (o Kiwitaxi) | Travelpayouts | Transfer aeroporto |
| `rimborso_volo` | **MiSpetta** | il tuo sito | Margine 100% |
| `amazon.*` | Amazon.it Affiliati | programma-affiliazione.amazon.it | Link diretti (Amazon non ammette redirect che nascondono il link) |

**Ordine consigliato per partire subito:** Travelpayouts (un solo account, molti programmi, approvazione rapida) → Heymondo → Awin → Amazon.
Tip: quando ti iscrivi descrivi il sito come *"strumento gratuito che genera la checklist di viaggio per Paese, con schede su 44 destinazioni"*: le approvazioni arrivano più facilmente a un sito con contenuto già pubblicato, quindi **pubblica prima, iscriviti poi**.

## 4. Traffico qualificato senza pubblicità (in ordine di rendimento)
### A. SEO "a lunga coda" con pagine utili vere (motore principale)
- 44 schede Paese già pronte, ognuna risponde alle ricerche reali: *"serve il passaporto per X"*, *"adattatore prese X"*, *"eSIM X"*, *"roaming X"*, *"assicurazione viaggio X obbligatoria"*, *"numero emergenza X"*.
- Dati strutturati (FAQ, Breadcrumb), sitemap, `llms.txt` per farsi citare da ChatGPT/Perplexity/AI di Google.
- **Espansione** (vedi PIANO-90-GIORNI): isole e città (Tenerife, Bali, Zanzibar, Sharm, New York, Tokyo, Mykonos…), poi pagine "di momento" (scioperi, cambi di regole).
- Regola anti-penalizzazione: **nessuna pagina senza dati specifici utili**. Meglio 60 pagine eccellenti che 600 vuote.

### B. Pagine "notizia" nei giorni di picco
Scioperi del trasporto aereo (calendario del Ministero dei Trasporti), nuove regole d'ingresso (ETA UK, ESTA, cambi di esenzione visto in Thailandia/Cina/Corea), caos aeroporti.
Si pubblica il giorno stesso, con il link al kit e a MiSpetta. Picchi di traffico enormi, a costo zero.

### C. Video brevi senza metterci la faccia (TikTok, Reels, Shorts)
Formato seriale: *"3 cose da fare PRIMA di andare in [Paese]"* – una per Paese = 44 video già scritti dai dati. Script pronti in CONTENUTI.md.
Link in bio → `/paesi/` o al kit. Obiettivo: 1 video al giorno per 60 giorni.

### D. Pinterest (traffico che dura anni)
Un pin "checklist" verticale per Paese e per guida. In Italia Pinterest è usato molto per organizzare i viaggi; un pin continua a portare visite per mesi.

### E. Community (risposte utili, mai spam)
Gruppi Facebook di viaggiatori per destinazione ("Viaggiare in Thailandia", "USA fai da te"…), Reddit, Quora, forum (es. TripAdvisor).
Regola: rispondi alla domanda per intero nel post, link solo come approfondimento e dove il regolamento lo consente. Modelli in CONTENUTI.md.

### F. Pubblico di proprietà (lo protegge dagli algoritmi)
- **Newsletter** (Brevo/MailerLite gratuiti): "checklist + avvisi scioperi e regole d'ingresso". Sequenza di 5 email in CONTENUTI.md.
- **Canale WhatsApp o Telegram** "Allerta viaggi": scioperi, cambi di regole, offerte. Ogni messaggio riporta al sito.

### G. Collaborazioni e link spontanei
- MiSpetta ↔ kit: link reciproci (quando vorrai toccare MiSpetta; ora non lo tocchiamo).
- Agenzie di viaggio già contattate per MiSpetta: proponi il kit gratuito come servizio ai loro clienti → link e passaparola.
- Micro-creator di viaggio: offri il kit come risorsa ("linkatelo nelle vostre guide") → link spontanei e autorevolezza.

## 5. Strumenti da collegare (tutti con piano gratuito)
| Strumento | A cosa serve | Costo |
|---|---|---|
| **GitHub** (già collegato) | Codice e storico; io lavoro qui | 0 € |
| **Cloudflare Pages** | Hosting veloce, `_redirects` per i link /vai/, HTTPS | 0 € |
| **Dominio .it** | es. partipronto.it (verifica che sia libero) | ~10 €/anno |
| **Google Search Console + Bing Webmaster** | Indicizzazione, query reali, errori | 0 € |
| **Umami Cloud** | Statistiche senza cookie (niente banner) e conteggio dei clic sui pulsanti | 0 € |
| **Brevo o MailerLite** | Newsletter e sequenza automatica | 0 € fino a migliaia di contatti |
| **Travelpayouts, Awin, Amazon** | Programmi di affiliazione | 0 € |
| **Canva** | Pin, copertine e grafiche dei video | 0 € |
| **CapCut** | Montaggio video brevi con voce sintetica | 0 € |
| **Claude (io)** | Nuove schede, aggiornamento dati, script video, analisi settimanale | — |

Cosa può fare Claude in automatico, se lo chiedi: un'**attività programmata mensile** che ricontrolla le regole d'ingresso e propone le correzioni, e una **settimanale** che produce 3 nuove pagine e 7 script video.
Per gestire il portafoglio una volta in produzione usa la tua skill **portafoglio-affiliate** (cruscotto, regole di stop e di raddoppio).

## 6. Rischi e come sono già gestiti
| Rischio | Contromisura già nel progetto |
|---|---|
| Un programma chiude o taglia le commissioni | Tutti i link passano da `/vai/`: cambi una riga in `config.js` e il sito intero si aggiorna |
| Aggiornamento di Google che taglia il traffico | 6 canali indipendenti, email e canale di proprietà, strumento che riceve link spontanei |
| Informazioni d'ingresso superate | Data di verifica su ogni pagina, link a viaggiaresicuri.it e ai siti ufficiali, controllo mensile |
| Sanzioni per pubblicità non dichiarata | Avviso in ogni pagina, `rel="sponsored"`, frase obbligatoria Amazon (vedi CONFORMITA.md) |
| GDPR e cookie | Statistiche senza cookie, lo strumento non invia dati, newsletter con consenso |
| Pulsanti rotti o link vuoti | Il pulsante compare solo se il link è compilato; i test controllano link interni, `rel` e redirect |
| Dipendenza da un solo prodotto | 12 categorie di affiliazione + prodotto proprio |

## 7. Misure da guardare ogni lunedì
| Metrica | Dove | Obiettivo a 90 giorni | Se manca |
|---|---|---|---|
| Pagine indicizzate | Search Console | ≥ 80% delle pagine | controlla sitemap ed errori |
| Visite organiche/settimana | Search Console / Umami | 1.000+ | più pagine di lunga coda e più pin |
| % visitatori che cliccano un affiliato | Umami (eventi `aff-*`) | ≥ 15% | migliora l'ordine dei pulsanti e i testi |
| Conversione clic → vendita per programma | pannello di ogni network (subid = pagina) | ≥ 3% | sostituisci il programma con l'alternativa |
| Iscritti newsletter/settimana | Brevo/MailerLite | 30+ | sposta il modulo più in alto |

**Regola di stop:** se un programma, dopo 300 clic, ha meno di 2 vendite, sostituiscilo con l'alternativa in `config.js`.
**Regola di raddoppio:** la pagina con più ricavo per visita riceve per prima nuovi contenuti collegati (città, guide, pin, video).
