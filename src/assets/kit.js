/* Strumento "Kit di partenza": legge window.KIT (dati-kit.js) e window.Logica (logica.js). */
(function () {
  var K = window.KIT, L = window.Logica;
  var form = document.getElementById('modulo-kit');
  var out = document.getElementById('risultato-kit');
  if (!form || !out || !K || !L) return;
  var ETICHETTE = { obbligatorio: 'Obbligatorio', importante: 'Importante', consigliato: 'Consigliato', ok: 'Tutto a posto' };

  function el(tag, attr, testo) {
    var e = document.createElement(tag);
    for (var k in attr) if (attr[k] != null) e.setAttribute(k, attr[k]);
    if (testo != null) e.textContent = testo;
    return e;
  }
  function pulsanteAff(chiave, pagina, secondario) {
    var a = K.aff[chiave];
    if (!a) return null;
    var b = el('a', { 'class': secondario ? 'btn btn-sec' : 'btn', href: '/vai/' + chiave + '/' + pagina,
      rel: a.proprio ? 'noopener' : 'sponsored nofollow noopener', target: '_blank',
      'data-umami-event': 'aff-' + chiave, 'data-umami-event-pagina': pagina }, a.cosa + ' ');
    if (!a.proprio) b.appendChild(el('span', { 'class': 'aff-nome' }, a.nome));
    return b;
  }

  function mostra(slug, giorni, uso) {
    var p = K.paesi.filter(function (x) { return x.slug === slug; })[0];
    if (!p) return;
    var pagina = 'kit-' + p.slug;
    out.innerHTML = '';
    out.appendChild(el('h2', { 'class': 'titolo-risultato', tabindex: '-1' }, p.bandiera + ' Il tuo kit: ' + p.nome));
    L.kit(p, { giorni: giorni, uso: uso }).forEach(function (s) {
      var sez = el('section', { 'class': 'sezione liv-' + s.livello });
      var testa = el('div', { 'class': 'sez-testa' });
      testa.appendChild(el('h3', null, s.titolo));
      testa.appendChild(el('span', { 'class': 'badge' }, ETICHETTE[s.livello]));
      sez.appendChild(testa);
      s.testo.forEach(function (t) { sez.appendChild(el('p', null, t)); });
      if (s.note) { var ul = el('ul', { 'class': 'note' }); s.note.forEach(function (n) { ul.appendChild(el('li', null, n)); }); sez.appendChild(ul); }
      var bar = el('div', { 'class': 'pulsanti' });
      if (s.extra && s.extra.ufficiale) bar.appendChild(el('a', { 'class': 'btn btn-uff', href: s.extra.ufficiale, rel: 'noopener', target: '_blank' }, 'Vai al sito ufficiale'));
      s.aff.forEach(function (k) { var b = pulsanteAff(k, pagina, /_alt$/.test(k)); if (b) bar.appendChild(b); });
      if (s.amazon && K.amazon[s.amazon]) {
        var am = el('a', { 'class': 'btn btn-sec', href: K.amazon[s.amazon], rel: 'sponsored nofollow noopener', target: '_blank', 'data-umami-event': 'amazon-' + s.amazon }, 'Adattatore consigliato ');
        am.appendChild(el('span', { 'class': 'aff-nome' }, 'Amazon')); bar.appendChild(am);
      }
      if (bar.children.length) sez.appendChild(bar);
      out.appendChild(sez);
    });
    var link = el('p', { 'class': 'cta-kit' });
    link.appendChild(el('a', { href: '/paesi/' + p.slug + '.html' }, 'Scheda completa di ' + p.nome + ' con domande frequenti →'));
    out.appendChild(link);
    var nl = document.getElementById('box-newsletter');
    if (nl) { nl.classList.remove('nascosto'); out.appendChild(nl); }
    out.querySelector('.titolo-risultato').focus();
    try { history.replaceState(null, '', '?paese=' + p.slug + '&giorni=' + giorni + '&uso=' + uso + '#kit'); } catch (e) {}
    if (window.umami && typeof window.umami.track === 'function') window.umami.track('kit-generato', { paese: p.slug });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    mostra(form.paese.value, form.giorni.value, form.uso.value);
  });

  var q = new URLSearchParams(location.search);
  if (q.get('paese')) {
    form.paese.value = q.get('paese');
    if (q.get('giorni')) form.giorni.value = q.get('giorni');
    if (q.get('uso')) form.uso.value = q.get('uso');
    if (form.paese.value) mostra(form.paese.value, form.giorni.value, form.uso.value);
  }
})();
