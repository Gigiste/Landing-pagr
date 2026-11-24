#!/usr/bin/env node
/*
 * Genera il sito statico in public/ partendo da config.js, data/paesi.js e src/.
 * Nessuna dipendenza: basta Node 18 o più recente.
 *   node tools/build.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const RADICE = path.join(__dirname, '..');
const SRC = path.join(RADICE, 'src');
const OUT_PREDEFINITO = path.join(RADICE, 'public');

function carica(rel) {
  const p = path.join(RADICE, rel);
  delete require.cache[require.resolve(p)];
  return require(p);
}

function costruisci(opz) {
  opz = opz || {};
  const CFG = opz.config || carica('config.js');
  const OUT = opz.out || OUT_PREDEFINITO;
  const PAESI = carica('data/paesi.js');
  const Logica = carica('src/assets/logica.js');
  const S = CFG.sito;
  const avvisi = [];

  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const attivo = (k) => !!(CFG.affiliati[k] && CFG.affiliati[k].url);

  // ---------- link affiliati ----------
  function linkAff(chiave, pagina, testo, classe) {
    const a = CFG.affiliati[chiave];
    if (!a) throw new Error('Chiave affiliato sconosciuta: ' + chiave + ' (pagina ' + pagina + ')');
    if (!a.url) return '';
    const etichetta = testo || a.cosa;
    const rel = a.proprio ? 'noopener' : 'sponsored nofollow noopener';
    return '<a class="' + (classe || 'btn') + '" href="/vai/' + chiave + '/' + pagina + '" rel="' + rel + '" target="_blank"' +
      ' data-umami-event="aff-' + chiave + '" data-umami-event-pagina="' + pagina + '">' + esc(etichetta) +
      (a.proprio ? '' : ' <span class="aff-nome">' + esc(a.nome) + '</span>') + '</a>';
  }
  function linkAmazon(chiave, testo) {
    const u = CFG.amazon[chiave];
    if (!u) return '';
    return '<a class="btn btn-sec" href="' + esc(u) + '" rel="sponsored nofollow noopener" target="_blank" data-umami-event="amazon-' + chiave + '">' + esc(testo) + ' <span class="aff-nome">Amazon</span></a>';
  }

  // ---------- layout ----------
  function pagina(o) {
    const url = S.dominio + o.percorso;
    const meta = [];
    if (CFG.google_site_verification) meta.push('<meta name="google-site-verification" content="' + esc(CFG.google_site_verification) + '">');
    if (CFG.bing_site_verification) meta.push('<meta name="msvalidate.01" content="' + esc(CFG.bing_site_verification) + '">');
    if (CFG.pinterest_verification) meta.push('<meta name="p:domain_verify" content="' + esc(CFG.pinterest_verification) + '">');
    const umami = CFG.umami_website_id ? '<script defer src="https://cloud.umami.is/script.js" data-website-id="' + esc(CFG.umami_website_id) + '"></script>' : '';
    const ld = (o.jsonld || []).map((j) => '<script type="application/ld+json">' + JSON.stringify(j).replace(/</g, '\\u003c') + '</script>').join('\n');
    return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.titolo)}</title>
<meta name="description" content="${esc(o.descrizione)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(o.titolo)}">
<meta property="og:description" content="${esc(o.descrizione)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:locale" content="it_IT">
<meta name="theme-color" content="#0f766e">
${meta.join('\n')}
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧳</text></svg>">
<link rel="stylesheet" href="/assets/style.css">
${umami}
${ld}
</head>
<body>
<header class="testata"><div class="contenitore">
  <a class="logo" href="/">🧳 ${esc(S.nome)}</a>
  <nav><a href="/#kit">Kit di partenza</a><a href="/paesi/">Destinazioni</a><a href="/guide/">Guide</a></nav>
</div></header>
<main class="contenitore">
${o.corpo}
</main>
<footer class="piede"><div class="contenitore">
  <p><strong>Trasparenza:</strong> alcuni link sono di affiliazione: se acquisti, ${esc(S.nome)} riceve una commissione, senza costi in più per te. Consigliamo solo servizi che useremmo noi, e diciamo chiaramente quando qualcosa non ti serve.</p>
  <p>Le informazioni su documenti e ingresso sono verificate a ${esc(S.data_verifica_dati)} e possono cambiare: controlla sempre <a href="https://www.viaggiaresicuri.it" rel="noopener" target="_blank">viaggiaresicuri.it</a> prima di partire.</p>
  <p><a href="/legal.html">Note legali, privacy e affiliazioni</a> · <a href="/paesi/">Tutte le destinazioni</a> · <a href="/guide/">Guide</a></p>
  <p>© ${new Date().getFullYear()} ${esc(S.titolare)} · ${esc(S.partita_iva)}</p>
</div></footer>
</body>
</html>
`;
  }

  // ---------- frammenti di src/ ----------
  function leggiFrammento(file) {
    const testo = fs.readFileSync(file, 'utf8');
    const m = testo.match(/^<!--(\{[\s\S]*?\})-->\s*/);
    if (!m) throw new Error('Manca l’intestazione <!--{...}--> in ' + file);
    return { meta: JSON.parse(m[1]), html: testo.slice(m[0].length) };
  }
  function elaboraFrammento(html, idPagina) {
    return html
      .replace(/<a data-aff="([a-z_]+)"(?: data-testo="([^"]*)")?>([\s\S]*?)<\/a>/g, (_, k, __, t) => linkAff(k, idPagina, t.trim()))
      .replace(/<a data-amazon="([a-z_]+)">([\s\S]*?)<\/a>/g, (_, k, t) => linkAmazon(k, t.trim()))
      .replace(/\{\{SITO\}\}/g, esc(S.nome))
      .replace(/\{\{DATA_VERIFICA\}\}/g, esc(S.data_verifica_dati))
      .replace(/\{\{EMAIL\}\}/g, esc(S.email))
      .replace(/\{\{TITOLARE\}\}/g, esc(S.titolare))
      .replace(/\{\{PIVA\}\}/g, esc(S.partita_iva))
      .replace(/\{\{N_PAESI\}\}/g, String(PAESI.length))
      .replace(/\{\{OPZIONI_PAESI\}\}/g, PAESI.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'it'))
        .map((p) => '<option value="' + p.slug + '">' + esc(p.nome) + '</option>').join(''))
      .replace(/\{\{GRIGLIA_PAESI\}\}/g, grigliaPaesi())
      .replace(/\{\{NEWSLETTER\}\}/g, moduloNewsletter(idPagina))
      .replace(/<div class="pulsanti">\s*<\/div>/g, '');
  }
  function grigliaPaesi() {
    return '<ul class="griglia-paesi">' + PAESI.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'it'))
      .map((p) => '<li><a href="/paesi/' + p.slug + '.html"><span class="bandiera">' + p.bandiera + '</span>' + esc(p.nome) + '</a></li>').join('') + '</ul>';
  }
  function moduloNewsletter(idPagina) {
    if (!CFG.newsletter.action) return '';
    return `<section class="riquadro newsletter">
  <h2>Ricevi la checklist e gli avvisi di sciopero</h2>
  <p>Una email quando ci sono scioperi o cambiano le regole d’ingresso dei Paesi più visitati. Niente spam, ti cancelli con un clic.</p>
  <form action="${esc(CFG.newsletter.action)}" method="post" target="_blank" data-umami-event="newsletter" data-umami-event-pagina="${idPagina}">
    <label for="nl-email-${idPagina}">La tua email</label>
    <div class="riga"><input id="nl-email-${idPagina}" type="email" name="${esc(CFG.newsletter.campo_email)}" required autocomplete="email" placeholder="nome@email.it"><button class="btn" type="submit">Iscrivimi</button></div>
    <small>Iscrivendoti accetti la <a href="/legal.html#privacy">privacy</a>.</small>
  </form>
</section>`;
  }

  // ---------- pagine dei Paesi ----------
  const ETICHETTE = { obbligatorio: 'Obbligatorio', importante: 'Importante', consigliato: 'Consigliato', ok: 'Tutto a posto' };
  function sezioneHtml(sez, idPagina) {
    let h = '<section class="sezione liv-' + sez.livello + '" id="' + sez.id + '"><div class="sez-testa"><h2>' + esc(sez.titolo) + '</h2><span class="badge">' + ETICHETTE[sez.livello] + '</span></div>';
    h += sez.testo.map((t) => '<p>' + esc(t) + '</p>').join('');
    if (sez.note) h += '<ul class="note">' + sez.note.map((n) => '<li>' + esc(n) + '</li>').join('') + '</ul>';
    const pulsanti = [];
    if (sez.extra && sez.extra.ufficiale) pulsanti.push('<a class="btn btn-uff" href="' + esc(sez.extra.ufficiale) + '" rel="noopener" target="_blank">Vai al sito ufficiale</a>');
    sez.aff.forEach((k) => { const l = linkAff(k, idPagina, null, k.endsWith('_alt') ? 'btn btn-sec' : 'btn'); if (l) pulsanti.push(l); });
    if (sez.amazon) { const l = linkAmazon(sez.amazon, 'Adattatore consigliato'); if (l) pulsanti.push(l); }
    if (pulsanti.length) h += '<div class="pulsanti">' + pulsanti.join('') + '</div>';
    return h + '</section>';
  }
  function faqPaese(p) {
    const f = [];
    f.push([p.nome + ': che documento serve?', p.documento + '.' + (p.permesso ? ' Serve anche: ' + p.permesso.nome + ', da chiedere solo su ' + p.permesso.url.replace(/^https?:\/\//, '') + '.' : '')]);
    f.push([p.nome + ': serve l’adattatore per le prese?', Logica.serveAdattatore(p) ? 'Sì: le prese sono di tipo ' + p.prese.join(', ') + ' e le spine italiane non entrano.' : 'Di solito no: le prese sono di tipo ' + p.prese.join(', ') + ' e le spine italiane sottili entrano.']);
    f.push([p.nome + ': il roaming è incluso?', p.roaming ? 'Sì, vale il "roaming come a casa" dell’UE, entro le soglie del tuo piano.' : 'No, non valgono le regole UE: conviene una eSIM dati o un’offerta estero del tuo operatore.']);
    f.push([p.nome + ': serve l’assicurazione sanitaria?', p.sanita_obbligatoria ? 'Sì, è richiesta per entrare.' : (p.sanita === 'ue' ? 'Non è obbligatoria: la TEAM copre le cure pubbliche necessarie, ma non rimpatrio, cliniche private e annullamento.' : 'Non è obbligatoria ma è fortemente consigliata: la Tessera Sanitaria non vale e le cure si pagano.')]);
    f.push([p.nome + ': qual è il numero di emergenza?', p.emergenza + '.']);
    return f;
  }
  function paginaPaese(p) {
    const id = 'paese-' + p.slug;
    const sezioni = Logica.kit(p, { giorni: 7, uso: 'normale' });
    const faq = faqPaese(p);
    const riassunto = [
      ['Documento', p.documento],
      ['Permesso', p.permesso ? p.permesso.nome : 'Non serve'],
      ['Prese', p.prese.join(', ') + ' · ' + p.volt + ' V' + (Logica.serveAdattatore(p) ? ' (serve adattatore)' : '')],
      ['Roaming UE', p.roaming ? 'Incluso' : 'Non incluso'],
      ['Valuta', p.valuta],
      ['Emergenze', p.emergenza]
    ];
    const corpo = `<nav class="briciole"><a href="/">Home</a> › <a href="/paesi/">Destinazioni</a> › ${esc(p.nome)}</nav>
<h1>${p.bandiera} ${esc(p.nome)}: cosa serve prima di partire</h1>
<p class="sottotitolo">Documenti, assicurazione, internet, prese e soldi per chi parte dall’Italia. Verificato a ${esc(S.data_verifica_dati)}.</p>
<table class="riassunto"><tbody>${riassunto.map((r) => '<tr><th>' + r[0] + '</th><td>' + esc(r[1]) + '</td></tr>').join('')}</tbody></table>
<p class="cta-kit"><a class="btn" href="/?paese=${p.slug}#kit">Calcola il tuo kit: giorni e consumo dati</a></p>
${sezioni.map((s) => sezioneHtml(s, id)).join('\n')}
${moduloNewsletter(id)}
<section class="faq"><h2>Domande frequenti</h2>${faq.map((q) => '<details><summary>' + esc(q[0]) + '</summary><p>' + esc(q[1]) + '</p></details>').join('')}</section>
<p class="fonte">Fonti: Farnesina – viaggiaresicuri.it, siti ufficiali di immigrazione dei singoli Paesi, Regolamento UE 2022/612 (roaming), Reg. CE 261/2004 (diritti dei passeggeri).</p>`;
    return pagina({
      percorso: '/paesi/' + p.slug + '.html',
      titolo: p.nome + ': documenti, eSIM, assicurazione e prese per il viaggio (' + S.data_verifica_dati + ')',
      descrizione: p.nome + ', cosa serve partendo dall’Italia: ' + p.documento.toLowerCase() + (p.permesso ? ', ' + p.permesso.nome.split(' (')[0] : '') + ', prese ' + p.prese.join('/') + ', roaming ' + (p.roaming ? 'incluso' : 'non incluso') + '. Checklist aggiornata.',
      corpo,
      jsonld: [
        { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((q) => ({ '@type': 'Question', name: q[0], acceptedAnswer: { '@type': 'Answer', text: q[1] } })) },
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: S.dominio + '/' },
          { '@type': 'ListItem', position: 2, name: 'Destinazioni', item: S.dominio + '/paesi/' },
          { '@type': 'ListItem', position: 3, name: p.nome, item: S.dominio + '/paesi/' + p.slug + '.html' }] }
      ]
    });
  }

  // ---------- scrittura ----------
  fs.rmSync(OUT, { recursive: true, force: true });
  const scrivi = (rel, testo) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, testo); };
  const urls = [];

  // risorse statiche
  for (const f of fs.readdirSync(path.join(SRC, 'assets'))) scrivi('assets/' + f, fs.readFileSync(path.join(SRC, 'assets', f)));
  scrivi('assets/dati-kit.js', 'window.KIT = ' + JSON.stringify({
    paesi: PAESI,
    aff: Object.fromEntries(Object.entries(CFG.affiliati).map(([k, v]) => [k, v.url ? { nome: v.nome, cosa: v.cosa, proprio: !!v.proprio } : null])),
    amazon: Object.fromEntries(Object.entries(CFG.amazon).filter(([, v]) => v))
  }) + ';\n');

  // pagine da frammenti (src/*.html e src/guide/*.html)
  const guide = [];
  for (const cartella of ['', 'guide']) {
    const dir = path.join(SRC, cartella);
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html')).sort()) {
      const { meta, html } = leggiFrammento(path.join(dir, f));
      const rel = (cartella ? cartella + '/' : '') + f;
      const percorso = '/' + rel.replace(/(^|\/)index\.html$/, '$1');
      const id = meta.id || (cartella ? 'guida-' : '') + f.replace('.html', '');
      const tit = meta.titolo.replace(/\{\{SITO\}\}/g, S.nome);
      scrivi(rel, pagina({ percorso, titolo: tit, descrizione: meta.descrizione, corpo: elaboraFrammento(html, id), jsonld: meta.jsonld }));
      if (!meta.noindex) urls.push(percorso);
      if (cartella === 'guide' && f !== 'index.html') guide.push({ percorso, titolo: tit, descrizione: meta.descrizione });
    }
  }

  // indice guide (se non esiste un index scritto a mano)
  if (!fs.existsSync(path.join(SRC, 'guide', 'index.html'))) {
    scrivi('guide/index.html', pagina({ percorso: '/guide/', titolo: 'Guide di viaggio pratiche | ' + S.nome, descrizione: 'Guide pratiche per partire senza sorprese: eSIM, assicurazione, permessi d’ingresso, rimborsi per voli in ritardo.',
      corpo: '<h1>Guide pratiche</h1><ul class="lista-guide">' + guide.map((g) => '<li><a href="' + g.percorso + '"><strong>' + esc(g.titolo) + '</strong><span>' + esc(g.descrizione) + '</span></a></li>').join('') + '</ul>' }));
    urls.push('/guide/');
  }

  // pagine Paesi + indice
  for (const p of PAESI) { scrivi('paesi/' + p.slug + '.html', paginaPaese(p)); urls.push('/paesi/' + p.slug + '.html'); }
  scrivi('paesi/index.html', pagina({ percorso: '/paesi/', titolo: 'Cosa serve per viaggiare in ' + PAESI.length + ' Paesi: documenti, eSIM, prese | ' + S.nome,
    descrizione: 'Schede pratiche per ' + PAESI.length + ' destinazioni: documenti, permessi d’ingresso, assicurazione, roaming, prese elettriche e numeri di emergenza.',
    corpo: '<h1>Destinazioni</h1><p class="sottotitolo">Scegli dove vai: trovi documenti, permessi, prese, roaming e cosa comprare (e cosa no) prima di partire.</p>' + grigliaPaesi() }));
  urls.push('/paesi/');

  // redirect dei link affiliati
  const red = ['# Generato da tools/build.js: NON modificare a mano, cambia config.js'];
  for (const [k, v] of Object.entries(CFG.affiliati)) {
    if (!v.url) { avvisi.push('link vuoto: affiliati.' + k + ' (il pulsante non viene mostrato)'); continue; }
    if (!/^https:\/\//.test(v.url)) throw new Error('Il link affiliati.' + k + ' deve iniziare con https://');
    red.push('/vai/' + k + '/:pagina ' + v.url.replace(/\{subid\}/g, ':pagina') + ' 302');
    red.push('/vai/' + k + ' ' + v.url.replace(/\{subid\}/g, 'diretto') + ' 302');
  }
  scrivi('_redirects', red.join('\n') + '\n');
  scrivi('_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/assets/*
  Cache-Control: public, max-age=3600
/vai/*
  X-Robots-Tag: noindex, nofollow
`);
  scrivi('robots.txt', 'User-agent: *\nDisallow: /vai/\nAllow: /\n\nSitemap: ' + S.dominio + '/sitemap.xml\n');
  const oggi = new Date().toISOString().slice(0, 10);
  scrivi('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.filter((u) => u !== '/404.html').map((u) => '  <url><loc>' + S.dominio + u + '</loc><lastmod>' + oggi + '</lastmod></url>').join('\n') + '\n</urlset>\n');
  scrivi('llms.txt', '# ' + S.nome + '\n\n> ' + S.slogan + ' Schede pratiche in italiano per chi parte dall’Italia: documenti, permessi d’ingresso (solo siti ufficiali), assicurazione, eSIM e roaming, prese, valuta, numeri di emergenza. Dati verificati a ' + S.data_verifica_dati + '.\n\n## Destinazioni\n' +
    PAESI.map((p) => '- [' + p.nome + '](' + S.dominio + '/paesi/' + p.slug + '.html)').join('\n') + '\n\n## Guide\n' + guide.map((g) => '- [' + g.titolo + '](' + S.dominio + g.percorso + ')').join('\n') + '\n');

  return { pagine: urls.length, avvisi };
}

if (require.main === module) {
  const r = costruisci();
  r.avvisi.forEach((a) => console.log('  avviso: ' + a));
  console.log('Fatto: ' + r.pagine + ' pagine in public/');
}
module.exports = { costruisci, OUT: OUT_PREDEFINITO };
