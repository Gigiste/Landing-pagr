// Collaudo: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { costruisci } = require('../tools/build.js');
const PAESI = require('../data/paesi.js');
const Logica = require('../src/assets/logica.js');
const CONFIG = require('../config.js');

function configCompleta() {
  const c = JSON.parse(JSON.stringify(CONFIG));
  for (const k of Object.keys(c.affiliati)) c.affiliati[k].url = 'https://esempio.test/' + k + '?sub_id={subid}';
  c.amazon.adattatore_g = 'https://amzn.to/esempio-g';
  c.newsletter.action = 'https://esempio.test/iscrizione';
  c.umami_website_id = '00000000-0000-0000-0000-000000000000';
  return c;
}
function tuttiIFile(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? tuttiIFile(path.join(dir, d.name)) : [path.join(dir, d.name)]);
}

test('dati dei Paesi completi e coerenti', () => {
  const slug = new Set();
  for (const p of PAESI) {
    for (const campo of ['slug', 'nome', 'bandiera', 'area', 'valuta', 'prese', 'volt', 'emergenza', 'documento', 'sanita', 'note'])
      assert.ok(p[campo] !== undefined && p[campo] !== '', p.slug + ': manca ' + campo);
    assert.match(p.slug, /^[a-z-]+$/, 'slug non valido: ' + p.slug);
    assert.ok(!slug.has(p.slug), 'slug duplicato: ' + p.slug); slug.add(p.slug);
    assert.ok(['ue', 'see', 'extra'].includes(p.area), p.slug + ': area');
    assert.ok(['ue', 'media', 'alta'].includes(p.sanita), p.slug + ': sanita');
    assert.strictEqual(typeof p.roaming, 'boolean', p.slug + ': roaming');
    assert.strictEqual(p.roaming, p.area !== 'extra', p.slug + ': roaming deve valere solo in UE/SEE');
    if (p.permesso) assert.match(p.permesso.url, /^https:\/\//, p.slug + ': url permesso');
  }
  assert.ok(PAESI.length >= 40);
});

test('logica del kit: casi chiave', () => {
  const trova = (s) => PAESI.find((p) => p.slug === s);
  const sez = (p, id, o) => Logica.kit(trova(p), o).find((x) => x.id === id);
  // In UE niente eSIM: è la promessa di onestà del sito
  assert.strictEqual(sez('spagna', 'internet').livello, 'ok');
  assert.deepStrictEqual(sez('spagna', 'internet').aff, []);
  assert.deepStrictEqual(sez('spagna', 'soldi').aff, []);
  // Fuori UE eSIM con giga calcolati
  const usa = sez('stati-uniti', 'internet', { giorni: 10, uso: 'intenso' });
  assert.ok(usa.aff.includes('esim'));
  assert.ok(usa.testo.some((t) => t.includes('25 GB')), 'USA 10 giorni intenso = 25 GB');
  assert.strictEqual(sez('stati-uniti', 'documenti').livello, 'obbligatorio');
  assert.strictEqual(sez('stati-uniti', 'documenti').extra.ufficiale, 'https://esta.cbp.dhs.gov');
  assert.strictEqual(sez('stati-uniti', 'corrente').amazon, 'adattatore_ab');
  assert.strictEqual(sez('regno-unito', 'corrente').amazon, 'adattatore_g');
  assert.strictEqual(sez('francia', 'corrente').livello, 'ok');
  assert.strictEqual(sez('cuba', 'assicurazione').livello, 'obbligatorio');
  assert.ok(sez('cina', 'internet').aff.includes('vpn'));
  assert.ok(sez('grecia', 'posto').aff.includes('traghetti'));
  assert.ok(!sez('giappone', 'posto').aff.includes('traghetti'));
  // Valori fuori scala non rompono il calcolo
  assert.ok(sez('giappone', 'internet', { giorni: 'abc', uso: 'xxx' }).testo.some((t) => t.includes('7 GB')));
});

test('build senza link: nessun pulsante affiliato, nessun redirect', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-'));
  const c = JSON.parse(JSON.stringify(CONFIG));
  for (const k of Object.keys(c.affiliati)) c.affiliati[k].url = '';
  costruisci({ config: c, out });
  const html = tuttiIFile(out).filter((f) => f.endsWith('.html')).map((f) => fs.readFileSync(f, 'utf8')).join('');
  assert.ok(!html.includes('href="/vai/'), 'non devono esserci link /vai/ senza url configurati');
  assert.ok(!html.includes('data-aff='), 'segnaposto data-aff non sostituito');
  assert.ok(!html.includes('{{'), 'segnaposto {{...}} non sostituito');
  assert.ok(!/<div class="pulsanti">\s*<\/div>/.test(html), 'riquadri pulsanti vuoti');
  fs.rmSync(out, { recursive: true, force: true });
});

test('build con tutti i link: redirect, rel sponsored, link interni validi', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-'));
  const c = configCompleta();
  const r = costruisci({ config: c, out });
  assert.deepStrictEqual(r.avvisi, []);

  const red = fs.readFileSync(path.join(out, '_redirects'), 'utf8');
  for (const k of Object.keys(c.affiliati)) {
    assert.ok(red.includes('/vai/' + k + '/:pagina https://esempio.test/' + k + '?sub_id=:pagina 302'), 'redirect con subid per ' + k);
    assert.ok(red.includes('/vai/' + k + ' https://esempio.test/' + k + '?sub_id=diretto 302'), 'redirect diretto per ' + k);
  }

  const files = tuttiIFile(out).filter((f) => f.endsWith('.html'));
  assert.strictEqual(files.filter((f) => f.includes(path.sep + 'paesi' + path.sep)).length, PAESI.length + 1);
  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    const nome = path.relative(out, f);
    assert.ok(!html.includes('{{') && !html.includes('data-aff='), nome + ': segnaposto rimasti');
    assert.match(html, /<title>[^<]{10,}<\/title>/, nome + ': title');
    assert.match(html, /<meta name="description" content="[^"]{30,}">/, nome + ': description');
    // ogni link affiliato è marcato
    for (const m of html.matchAll(/<a [^>]*href="\/vai\/([a-z_]+)\/[^"]+"[^>]*>/g)) {
      const proprio = c.affiliati[m[1]].proprio;
      assert.ok(proprio ? /rel="noopener"/.test(m[0]) : /rel="sponsored nofollow noopener"/.test(m[0]), nome + ': rel mancante su ' + m[1]);
    }
    for (const m of html.matchAll(/href="(https:\/\/amzn[^"]+)"[^>]*/g)) assert.match(m[0], /sponsored/, nome + ': Amazon senza sponsored');
    // link interni esistono
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const u = m[1];
      if (u.startsWith('/vai/')) continue;
      const dest = path.join(out, u.endsWith('/') ? u + 'index.html' : u);
      assert.ok(fs.existsSync(dest), nome + ': link interrotto ' + u);
    }
    for (const m of html.matchAll(/src="(\/[^"]+)"/g)) assert.ok(fs.existsSync(path.join(out, m[1])), nome + ': script mancante ' + m[1]);
  }
  const sitemap = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('404'));
  assert.ok(sitemap.includes('/paesi/giappone.html'));
  assert.match(fs.readFileSync(path.join(out, 'robots.txt'), 'utf8'), /Disallow: \/vai\//);
  fs.rmSync(out, { recursive: true, force: true });
});

test('config.js: tutti i link compilati sono https', () => {
  for (const [k, v] of Object.entries(CONFIG.affiliati)) if (v.url) assert.match(v.url, /^https:\/\//, k);
  for (const [k, v] of Object.entries(CONFIG.amazon)) if (v) assert.match(v, /^https:\/\//, k);
});

test('public/ è aggiornata rispetto ai sorgenti', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-'));
  costruisci({ out });
  const pub = path.join(__dirname, '..', 'public');
  const norm = (t) => t.replace(/<lastmod>[^<]+<\/lastmod>/g, '').replace(/© \d{4}/g, '');
  for (const f of tuttiIFile(out)) {
    const rel = path.relative(out, f);
    const p = path.join(pub, rel);
    assert.ok(fs.existsSync(p), 'manca public/' + rel + ': lancia node tools/build.js');
    assert.strictEqual(norm(fs.readFileSync(p, 'utf8')), norm(fs.readFileSync(f, 'utf8')), 'public/' + rel + ' non aggiornato: lancia node tools/build.js');
  }
  fs.rmSync(out, { recursive: true, force: true });
});
