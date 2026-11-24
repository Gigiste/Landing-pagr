# Conformità: cosa è già a posto e cosa devi fare tu

**Non è consulenza legale o fiscale: fai verificare questi punti da un commercialista e, per i testi, da un legale.**

## Già nel sito
| Obbligo | Dove |
|---|---|
| Segnalare i link di affiliazione (Codice del Consumo, linee guida AGCM e AGCOM su pubblicità occulta) | Avviso in fondo a ogni pagina + pagina `legal.html#affiliazioni` + nome del fornitore sul pulsante |
| `rel="sponsored"` sui link a pagamento (indicazioni di Google) | Aggiunto in automatico a ogni link affiliato (verificato dai test) |
| Frase obbligatoria Amazon | "In qualità di Affiliato Amazon, il sito riceve un guadagno dagli acquisti idonei" in `legal.html` |
| Amazon non ammette redirect che nascondono il link | I link Amazon sono diretti, non passano da `/vai/` |
| Privacy (GDPR) | Informativa in `legal.html#privacy`; lo strumento lavora solo nel browser |
| Cookie | Nessun cookie proprio; Umami è senza cookie → niente banner. Se aggiungi Google Analytics, pixel o pubblicità, **serve un banner di consenso** |
| Newsletter | Iscrizione volontaria, link alla privacy; usa il doppio consenso (double opt-in) nelle impostazioni di Brevo/MailerLite |
| Informazioni sanitarie e legali | Avvertenza: informazioni generali, non consulenza; rimando ai siti ufficiali |

## Da fare tu
1. **Dati del titolare** in `config.js` (nome o società, P.IVA, email).
2. **Fisco:** i guadagni da affiliazione, se continuativi, sono di norma attività d'impresa → di solito serve la **partita IVA** (molti usano il regime forfettario). Chiedi al commercialista il codice ATECO corretto e come trattare i compensi da network esteri (Awin, Travelpayouts, Amazon UE). Se pensi di usare la LLC USA di MiSpetta, **chiedi prima**: se vivi in Italia, una società estera gestita dall'Italia può essere considerata residente qui.
3. **Social:** nei post e nei video con link affiliati scrivi in modo chiaro *#adv* o *"link affiliato"*.
4. **Verifica mensile** delle regole d'ingresso: un'informazione superata è il rischio più concreto per la reputazione.
5. Rileggi le condizioni di ciascun programma: alcuni vietano l'uso del loro marchio nel nome del dominio o in campagne sui motori di ricerca.
