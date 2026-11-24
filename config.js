/*
 * ============================================================
 *  KIT DI PARTENZA – IMPOSTAZIONI (l'unico file da modificare)
 * ============================================================
 *  1. Compila i campi tra virgolette.
 *  2. Lancia:  node tools/build.js   (oppure lascia che lo faccia Cloudflare Pages)
 *  3. Il sito in public/ si rigenera: pagine, link, redirect, sitemap.
 *
 *  I link di affiliazione NON compaiono mai in chiaro nelle pagine:
 *  il sito usa /vai/<chiave>/<pagina>, che reindirizza al link qui sotto.
 *  Vantaggi: cambi programma in un minuto senza toccare le pagine, e sai
 *  quale pagina ha generato il click (la pagina finisce nel "subid").
 *
 *  Nel link puoi scrivere {subid}: verrà sostituito con il nome della pagina
 *  (es. paese-giappone, kit-thailandia, guida-esim). Quasi tutti i network lo
 *  supportano (Travelpayouts: &sub_id=  ·  Awin: &clickref=  ·  Impact: &subId1=).
 *  Se lasci un link vuoto, il pulsante non compare: il sito resta pulito
 *  anche prima di essere approvato dai programmi.
 */
module.exports = {

  sito: {
    nome: 'PartiPronto',                       // nome del sito (verifica che il dominio sia libero)
    dominio: 'https://www.partipronto.it',     // senza barra finale
    slogan: 'Tutto quello che ti serve prima di partire, in 2 minuti.',
    email: '[EMAIL DI CONTATTO]',
    titolare: '[NOME E COGNOME o SOCIETÀ]',
    partita_iva: '[P.IVA o numero di registrazione]',
    data_verifica_dati: 'novembre 2026'        // aggiornala ogni volta che ricontrolli data/paesi.js
  },

  // ---- Link di affiliazione (vedi STRATEGIA.md, cap. 3, per dove iscriverti) ----
  affiliati: {
    assicurazione:      { url: '', nome: 'Heymondo',        cosa: 'Assicurazione viaggio con sconto lettori' },
    assicurazione_alt:  { url: '', nome: 'seconda scelta',  cosa: 'Assicurazione viaggio, alternativa' },
    esim:               { url: '', nome: 'Saily',           cosa: 'eSIM dati per l’estero' },
    esim_alt:           { url: '', nome: 'Airalo',          cosa: 'eSIM dati, alternativa' },
    carta:              { url: '', nome: 'Wise',            cosa: 'Carta multivaluta senza ricarichi sul cambio' },
    attivita:           { url: '', nome: 'GetYourGuide',    cosa: 'Tour, ingressi saltafila ed escursioni' },
    auto:               { url: '', nome: 'DiscoverCars',    cosa: 'Confronto noleggio auto' },
    hotel:              { url: '', nome: 'Booking.com',     cosa: 'Hotel e appartamenti' },
    traghetti:          { url: '', nome: 'Ferryhopper',     cosa: 'Confronto traghetti' },
    vpn:                { url: '', nome: 'NordVPN',         cosa: 'VPN per Wi-Fi pubblici e Paesi con censura' },
    trasferimenti:      { url: '', nome: 'Welcome Pickups', cosa: 'Transfer aeroporto–hotel prenotato' },
    // Prodotto tuo: margine pieno. Metti l'indirizzo pubblico di MiSpetta.
    rimborso_volo:      { url: '', nome: 'MiSpetta',        cosa: 'Calcola se ti spettano fino a 600 € per il volo', proprio: true }
  },

  // ---- Amazon (adattatori di corrente ecc.) ----
  // Amazon NON permette di nascondere i link dietro redirect: questi restano diretti.
  // Incolla qui i link "SiteStripe" (amzn.to/...) o completi con il tuo tag.
  amazon: {
    adattatore_g: '',        // adattatore tipo G (Regno Unito, Irlanda, Malta, Emirati…)
    adattatore_ab: '',       // adattatore tipo A/B (USA, Canada, Giappone, Messico…)
    adattatore_universale: ''
  },

  // ---- Raccolta email (Brevo o MailerLite, piano gratuito) ----
  // Crea un modulo "embedded" e incolla qui l'indirizzo dell'attributo action="..." del form.
  // Il campo email deve chiamarsi EMAIL (Brevo) o fields[email] (MailerLite): imposta quello giusto.
  newsletter: {
    action: '',
    campo_email: 'EMAIL'
  },

  // ---- Statistiche senza cookie (niente banner): Umami Cloud, piano gratuito ----
  // Incolla il "Website ID". I click sui pulsanti affiliati vengono contati da soli.
  umami_website_id: '',

  // ---- Verifica proprietà (facoltativi) ----
  google_site_verification: '',
  bing_site_verification: '',
  pinterest_verification: ''
};
