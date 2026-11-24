/*
 * Logica del "Kit di partenza": la stessa funzione genera le pagine dei Paesi
 * (in fase di build, con Node) e i risultati dello strumento nel browser.
 * Ogni sezione restituisce: id, titolo, livello, testo (array di frasi), aff (chiavi dei link), extra.
 */
(function (radice) {
  var CONSUMO_GB_GIORNO = { leggero: 0.5, normale: 1, intenso: 2.5 };
  var PRESE_ITALIANE = ['C', 'E', 'F'];

  function serveAdattatore(p) {
    return !p.prese.some(function (x) { return PRESE_ITALIANE.indexOf(x) >= 0; });
  }
  function adattatoreAmazon(p) {
    if (p.prese.indexOf('G') >= 0) return 'adattatore_g';
    if (p.prese.indexOf('A') >= 0 || p.prese.indexOf('B') >= 0) return 'adattatore_ab';
    return 'adattatore_universale';
  }
  function usaEuro(p) { return /^Euro/.test(p.valuta); }

  function kit(p, opz) {
    opz = opz || {};
    var giorni = Math.max(1, Math.min(365, parseInt(opz.giorni, 10) || 7));
    var uso = CONSUMO_GB_GIORNO[opz.uso] ? opz.uso : 'normale';
    var s = [];

    // 1. Documenti
    var doc = { id: 'documenti', titolo: 'Documenti e permessi d’ingresso', livello: p.permesso ? 'obbligatorio' : 'importante',
      testo: ['Documento: ' + p.documento + '.'], aff: [], extra: null };
    if (p.permesso) {
      doc.testo.push('Prima di partire serve: ' + p.permesso.nome + '. Chiedilo solo sul sito ufficiale: i siti intermediari fanno pagare molto di più per lo stesso modulo.');
      doc.extra = { ufficiale: p.permesso.url };
    } else {
      doc.testo.push('Per i cittadini italiani in viaggio turistico non serve un permesso elettronico.');
    }
    doc.testo.push('Le regole cambiano: controlla sempre la scheda del Paese su viaggiaresicuri.it pochi giorni prima di partire.');
    s.push(doc);

    // 2. Assicurazione
    var ass = { id: 'assicurazione', titolo: 'Assicurazione sanitaria di viaggio', aff: ['assicurazione', 'assicurazione_alt'], testo: [] };
    if (p.sanita_obbligatoria) {
      ass.livello = 'obbligatorio';
      ass.testo.push('Per entrare è richiesta un’assicurazione sanitaria: senza puoi essere respinto alla frontiera.');
    } else if (p.sanita === 'ue') {
      ass.livello = 'consigliato';
      ass.testo.push('La Tessera Sanitaria (TEAM) copre le cure necessarie nelle strutture pubbliche, alle stesse condizioni dei residenti.');
      ass.testo.push('Non copre: rimpatrio sanitario, cliniche private, soccorso in montagna, annullamento del viaggio, bagaglio. Per questo una polizza resta utile, soprattutto per famiglie e viaggi lunghi.');
    } else if (p.sanita === 'alta') {
      ass.livello = 'importante';
      ass.testo.push('Qui le cure mediche per i turisti costano moltissimo: un ricovero di pochi giorni può superare le decine di migliaia di euro.');
      ass.testo.push('Scegli un massimale spese mediche molto alto (meglio illimitato) e verifica che includa rimpatrio ed evacuazione.');
    } else {
      ass.livello = 'importante';
      ass.testo.push('La Tessera Sanitaria qui non vale: ogni visita e ogni ricovero si pagano.');
      ass.testo.push('Controlla che la polizza copra spese mediche, rimpatrio e le attività che farai (scooter, immersioni, trekking).');
    }
    s.push(ass);

    // 3. Internet
    var net = { id: 'internet', titolo: 'Internet e telefono', aff: [], testo: [] };
    if (p.roaming) {
      net.livello = 'ok';
      net.testo.push('Ti basta la tua SIM: con il "roaming come a casa" dell’UE usi minuti e giga del tuo piano senza costi extra.');
      net.testo.push('Alcuni piani hanno una soglia di giga utilizzabili all’estero: controllala nell’app del tuo operatore.');
    } else {
      var gb = Math.ceil(giorni * CONSUMO_GB_GIORNO[uso]);
      net.livello = 'consigliato';
      net.aff = ['esim', 'esim_alt'];
      net.testo.push('Qui il roaming del tuo operatore italiano può costare caro. La soluzione più semplice è una eSIM: si compra online, si installa con un QR code e funziona all’atterraggio, senza cambiare SIM.');
      net.testo.push('Per ' + giorni + (giorni === 1 ? ' giorno' : ' giorni') + ' con uso ' + uso + ' ti serve un pacchetto da almeno ' + gb + ' GB.');
      net.testo.push('Prima di comprarla verifica che il tuo telefono supporti le eSIM e non sia bloccato su un operatore.');
      if (p.slug === 'cina') { net.aff.push('vpn'); net.testo.push('In Cina tieni una VPN come piano B, installata PRIMA di partire: dopo non si scarica.'); }
    }
    s.push(net);

    // 4. Prese e corrente
    var corr = { id: 'corrente', titolo: 'Prese e corrente', aff: [], testo: [], amazon: null };
    corr.testo.push('Prese di tipo ' + p.prese.join(', ') + ', tensione ' + p.volt + ' V.');
    if (serveAdattatore(p)) {
      corr.livello = 'importante';
      corr.testo.push('Le spine italiane non entrano: ti serve un adattatore. Compralo prima di partire, in aeroporto costa il triplo.');
      corr.amazon = adattatoreAmazon(p);
    } else {
      corr.livello = 'ok';
      corr.testo.push('Le spine italiane sottili a 2 poli entrano. Per le spine grosse a 3 poli (tipo L) porta un adattatore.');
    }
    if (p.volt < 200) corr.testo.push('Tensione bassa: caricabatterie di telefono e computer funzionano (accettano 100–240 V), phon, piastre e rasoi italiani no.');
    s.push(corr);

    // 5. Soldi
    var soldi = { id: 'soldi', titolo: 'Soldi e pagamenti', aff: [], testo: [] };
    if (usaEuro(p)) {
      soldi.livello = 'ok';
      soldi.testo.push('Si paga in euro: la tua carta funziona come in Italia.');
    } else {
      soldi.livello = 'consigliato';
      soldi.aff = ['carta'];
      soldi.testo.push('Valuta: ' + p.valuta + '. Le carte delle banche italiane spesso applicano commissioni del 1–3% su ogni pagamento e prelievo in valuta estera.');
      soldi.testo.push('Una carta multivaluta ti fa pagare al cambio reale. E rifiuta sempre la "conversione in euro" proposta da POS e bancomat: è il cambio peggiore.');
    }
    s.push(soldi);

    // 6. Emergenze
    s.push({ id: 'emergenze', titolo: 'Numeri utili e sicurezza', livello: 'importante', aff: [],
      testo: ['Emergenze: ' + p.emergenza + '.', 'Registra il viaggio su dovesiamonelmondo.it (servizio gratuito della Farnesina): in caso di crisi ti possono rintracciare.', 'Salva una foto di passaporto e polizza nel telefono e in una email a te stesso.'] });

    // 7. Sul posto
    var posto = { id: 'posto', titolo: 'Una volta arrivato', livello: 'consigliato', aff: ['hotel', 'trasferimenti', 'attivita', 'auto'], testo: [] };
    posto.testo.push('Prenota con cancellazione gratuita: se cambia qualcosa non perdi soldi.');
    posto.testo.push('Ingressi e tour più richiesti vanno prenotati prima: sul posto spesso sono esauriti o costano di più.');
    if (p.traghetti) { posto.aff.splice(1, 0, 'traghetti'); posto.testo.push('Ci si arriva anche in traghetto: confronta orari e prezzi delle compagnie.'); }
    if (p.note && p.note.length) posto.note = p.note.slice();
    s.push(posto);

    // 8. Se il volo va storto
    s.push({ id: 'volo', titolo: 'Se il volo va storto', livello: 'ok', aff: ['rimborso_volo'],
      testo: ['Ritardo all’arrivo di oltre 3 ore, cancellazione o imbarco negato: per i voli in partenza dall’UE (e per quelli in arrivo nell’UE con compagnia europea) possono spettarti da 250 a 600 € a passeggero (Reg. CE 261/2004).', 'Conserva carta d’imbarco e scontrini di pasti e spese.'] });

    return s;
  }

  var api = { kit: kit, serveAdattatore: serveAdattatore, usaEuro: usaEuro, CONSUMO_GB_GIORNO: CONSUMO_GB_GIORNO };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else radice.Logica = api;
})(this);
