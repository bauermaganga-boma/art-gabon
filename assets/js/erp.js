(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY = 'art-erp-demo-v2';
  var STEPS = ['Dossier ouvert', 'Chargement au départ', 'En transit', 'Arrivé', 'En douane', 'Livré'];
  var STAG = ['t-info', 't-info', 't-acc', 't-warn', 't-warn', 't-ok'];
  var MODE = { Maritime: '🚢', Aérien: '✈️', Routier: '🚚' };
  var CUSTOMS = ['À préparer', 'Déposée', 'Liquidée', 'Mainlevée'];
  var FLEET_ST = ['Disponible', 'En mission', 'Maintenance'];
  var INV_ST = ['Brouillon', 'Envoyée', 'Payée'];
  var IMG = { Maritime: 'svc-maritime.jpg', Aérien: 'svc-international.jpg', Routier: 'svc-routier.jpg' };

  var SEED = {
    seq: 436,
    clients: [
      { id: 1, name: 'Société Démo Pétrole', contact: 'Responsable approvisionnement', city: 'Port-Gentil' },
      { id: 2, name: 'Énergie Atlantique (démo)', contact: 'Chef de projet', city: 'Libreville' },
      { id: 3, name: 'Offshore Services (démo)', contact: 'Logisticien base', city: 'Port-Gentil' },
      { id: 4, name: 'Boréal Industries (démo)', contact: 'Acheteur', city: 'Libreville' },
      { id: 5, name: 'Delta Forage (démo)', contact: 'Responsable logistique', city: 'Port-Gentil' }
    ],
    dossiers: [
      { ref: 'ART-26-0412', c: 1, what: 'Tubes de forage — 42 colis', from: 'Houston, USA', to: 'Port-Gentil', mode: 'Maritime', step: 2, eta: '14/10', w: '86 t', val: 7800000, cu: 0, ev: ['02/10 — Navire parti de Houston', '28/09 — Chargement terminé', '25/09 — Dossier ouvert'] },
      { ref: 'ART-26-0418', c: 1, what: 'Pièces de rechange pompes', from: 'Rotterdam, Pays-Bas', to: 'Libreville', mode: 'Aérien', step: 4, eta: '07/10', w: '1,2 t', val: 2400000, cu: 1, ev: ['04/10 — Déclaration déposée', '03/10 — Arrivée à Libreville'] },
      { ref: 'ART-26-0397', c: 1, what: "Conteneur 40' — base vie", from: 'Anvers, Belgique', to: 'Port-Gentil', mode: 'Maritime', step: 5, eta: 'Livré', w: '22 t', val: 4100000, cu: 3, ev: ['29/09 — Livré, bon signé', '27/09 — Sortie de port'] },
      { ref: 'ART-26-0421', c: 1, what: 'Skid hors gabarit', from: 'Libreville', to: 'Port-Gentil', mode: 'Routier', step: 1, eta: '09/10', w: '14 t', val: 3300000, cu: 0, ev: ['04/10 — Chargement en cours'] },
      { ref: 'ART-26-0425', c: 2, what: 'Équipements électriques', from: 'Houston, USA', to: 'Libreville', mode: 'Aérien', step: 2, eta: '08/10', w: '3,4 t', val: 5600000, cu: 0, ev: ['04/10 — Vol en cours'] },
      { ref: 'ART-26-0430', c: 3, what: 'Structure acier', from: 'Port-Gentil', to: 'Plateforme offshore', mode: 'Maritime', step: 0, eta: '12/10', w: '9 t', val: 2900000, cu: 0, ev: ['05/10 — Dossier ouvert'] },
      { ref: 'ART-26-0405', c: 4, what: 'Matériel de chantier', from: 'Dubaï, EAU', to: 'Libreville', mode: 'Maritime', step: 3, eta: '06/10', w: '31 t', val: 6200000, cu: 1, ev: ['05/10 — Navire à quai'] },
      { ref: 'ART-26-0409', c: 5, what: 'Tiges de forage', from: 'Houston, USA', to: 'Port-Gentil', mode: 'Maritime', step: 4, eta: '08/10', w: '58 t', val: 9100000, cu: 2, ev: ['05/10 — Droits liquidés'] },
      { ref: 'ART-26-0388', c: 2, what: 'Transformateurs', from: 'Anvers, Belgique', to: 'Libreville', mode: 'Maritime', step: 5, eta: 'Livré', w: '27 t', val: 8400000, cu: 3, ev: ['26/09 — Livré'] },
      { ref: 'ART-26-0433', c: 3, what: 'Consommables atelier', from: 'Paris, France', to: 'Port-Gentil', mode: 'Aérien', step: 1, eta: '10/10', w: '0,8 t', val: 900000, cu: 0, ev: ['05/10 — Enlèvement planifié'] }
    ],
    fleet: [
      { id: 'T-01', name: 'Tracteur + plateau 40 t', type: 'Camion', st: 1, doss: 'ART-26-0421' },
      { id: 'T-02', name: 'Tracteur + remorque surbaissée', type: 'Camion', st: 0, doss: '' },
      { id: 'C-01', name: 'Chariot élévateur 7 t', type: 'Manutention', st: 1, doss: 'ART-26-0409' },
      { id: 'C-02', name: 'Chariot élévateur 5 t', type: 'Manutention', st: 0, doss: '' },
      { id: 'G-01', name: 'Grue mobile 50 t', type: 'Levage', st: 2, doss: '' },
      { id: 'P-01', name: 'Pick-up de liaison', type: 'Léger', st: 0, doss: '' }
    ],
    stock: [
      { id: 1, doss: 'ART-26-0397', what: 'Palettes bois — base vie', loc: 'Hangar A · A-12', qty: 24, days: 3 },
      { id: 2, doss: 'ART-26-0388', what: 'Transformateurs (en attente site)', loc: 'Hangar B · B-03', qty: 2, days: 9 },
      { id: 3, doss: 'ART-26-0409', what: 'Tiges de forage 9 m', loc: 'Aire extérieure · E-1', qty: 120, days: 2 },
      { id: 4, doss: 'ART-26-0405', what: 'Caisses matériel chantier', loc: 'Hangar A · A-05', qty: 14, days: 1 },
      { id: 5, doss: 'ART-26-0418', what: 'Colis pièces pompes', loc: 'Hangar B · B-11', qty: 6, days: 1 }
    ],
    inv: [
      { no: 'F-26-0187', doss: 'ART-26-0397', c: 1, amt: 4100000, st: 2, date: '29/09' },
      { no: 'F-26-0186', doss: 'ART-26-0388', c: 2, amt: 8400000, st: 1, date: '26/09' },
      { no: 'F-26-0185', doss: 'ART-26-0409', c: 5, amt: 9100000, st: 0, date: '05/10' },
      { no: 'F-26-0184', doss: 'ART-26-0405', c: 4, amt: 6200000, st: 1, date: '03/10' }
    ],
    log: ['Dossier ART-26-0433 ouvert (Paris → Port-Gentil)', 'ART-26-0409 : droits liquidés', 'ART-26-0405 : navire à quai à Libreville', 'Facture F-26-0187 payée par Société Démo Pétrole']
  };

  var S, view = 'dash', filt = { q: '', mode: '', step: '' };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.dossiers) return s; } catch (e) {} return clone(SEED); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  S = load();
  var fcfa = function (n) { return Number(n).toLocaleString('fr-FR') + ' FCFA'; };
  var cl = function (id) { return S.clients.filter(function (c) { return c.id === id; })[0] || { name: '—' }; };
  var dos = function (ref) { return S.dossiers.filter(function (d) { return d.ref === ref; })[0]; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tag = function (t, c) { return '<span class="tag ' + (c || '') + '">' + t + '</span>'; };
  var stTag = function (d) { return tag(STEPS[d.step], STAG[d.step]); };
  var today = function () { var d = new Date(); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2); };
  function toast(t) { var e = $('#toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { e.hidden = true; }, 2600); }
  function logAdd(t) { S.log.unshift(t); S.log = S.log.slice(0, 8); }

  /* ---------- Modules ---------- */
  var M = {};
  M.dash = function () {
    var D = S.dossiers, run = D.filter(function (d) { return d.step < 5; }).length;
    var cust = D.filter(function (d) { return d.step >= 3 && d.step < 5; }).length;
    var due = S.inv.filter(function (i) { return i.st < 2; }).reduce(function (a, i) { return a + i.amt; }, 0);
    var modes = ['Maritime', 'Aérien', 'Routier'], col = ['#f26a1b', '#14181f', '#8d95a3'];
    var cnt = modes.map(function (m) { return D.filter(function (d) { return d.mode === m; }).length; }), tot = cnt.reduce(function (a, b) { return a + b; }, 0) || 1;
    var acc = 0, grad = cnt.map(function (n, i) { var a = acc / tot * 360; acc += n; return col[i] + ' ' + a + 'deg ' + (acc / tot * 360) + 'deg'; }).join(',');
    var months = [['Mai', 38], ['Juin', 46], ['Juil.', 41], ['Août', 52], ['Sept.', 57], ['Oct.', D.length + 36]], mx = 70;
    var late = D.filter(function (d) { return d.step === 3 && d.cu === 0; });
    return '<div class="grid g4">' +
      '<div class="card kpi"><span>Dossiers en cours</span><b>' + run + '</b><small>sur ' + D.length + ' dossiers</small></div>' +
      '<div class="card kpi"><span>Arrivés / en douane</span><b>' + cust + '</b><small class="neg">à surveiller</small></div>' +
      '<div class="card kpi"><span>Factures à encaisser</span><b>' + fcfa(due) + '</b><small class="neg">' + S.inv.filter(function (i) { return i.st < 2; }).length + ' en attente</small></div>' +
      '<div class="card kpi"><span>Véhicules en mission</span><b>' + S.fleet.filter(function (f) { return f.st === 1; }).length + ' / ' + S.fleet.length + '</b><small>flotte ART</small></div></div>' +
      '<div class="grid g2" style="margin-top:18px"><div class="card"><h3>Dossiers ouverts par mois <small style="font-weight:400;color:var(--muted)">(données fictives)</small></h3><div class="bars">' +
      months.map(function (m) { return '<div><b>' + m[1] + '</b><i style="height:' + (m[1] / mx * 100) + '%"></i>' + m[0] + '</div>'; }).join('') + '</div></div>' +
      '<div class="card"><h3>Répartition par mode</h3><div class="donut"><div class="donut__c" style="background:conic-gradient(' + grad + ')"></div><div class="legend">' +
      modes.map(function (m, i) { return '<span style="--c:' + col[i] + '">' + m + ' — ' + cnt[i] + '</span>'; }).join('') + '</div></div></div></div>' +
      '<div class="grid g2" style="margin-top:18px"><div class="card"><h3>Activité récente</h3><ul class="feed">' + S.log.map(function (l) { return '<li><i></i><div>' + esc(l) + '</div></li>'; }).join('') + '</ul></div>' +
      '<div class="card"><h3>Alertes</h3>' + (late.length ? late.map(function (d) { return '<div class="alert">⚠️ <div><b>' + d.ref + '</b> arrivé, déclaration en douane à préparer.</div></div>'; }).join('') : '') +
      S.stock.filter(function (s) { return s.days >= 7; }).map(function (s) { return '<div class="alert">📦 <div><b>' + esc(s.what) + '</b> en entrepôt depuis ' + s.days + ' jours.</div></div>'; }).join('') +
      S.inv.filter(function (i) { return i.st === 0; }).map(function (i) { return '<div class="alert">🧾 <div>Facture <b>' + i.no + '</b> à envoyer.</div></div>'; }).join('') + '</div></div>';
  };

  M.dossiers = function () {
    var rows = S.dossiers.filter(function (d) {
      var q = filt.q.toLowerCase();
      return (!q || (d.ref + d.what + d.from + d.to + cl(d.c).name).toLowerCase().indexOf(q) > -1) && (!filt.mode || d.mode === filt.mode) && (filt.step === '' || d.step === Number(filt.step));
    });
    return '<div class="bar"><input id="f-q" placeholder="Rechercher (référence, client, trajet…)" value="' + esc(filt.q) + '"><select id="f-mode"><option value="">Tous les modes</option>' +
      ['Maritime', 'Aérien', 'Routier'].map(function (m) { return '<option' + (filt.mode === m ? ' selected' : '') + '>' + m + '</option>'; }).join('') + '</select>' +
      '<select id="f-step"><option value="">Toutes les étapes</option>' + STEPS.map(function (s, i) { return '<option value="' + i + '"' + (String(filt.step) === String(i) ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select><span class="sp"></span>' +
      '<button class="btn" data-act="new">+ Nouveau dossier</button></div>' +
      '<div class="tw"><table><thead><tr><th>Dossier</th><th>Client</th><th>Marchandise</th><th>Trajet</th><th>Mode</th><th>Étape</th><th>ETA</th></tr></thead><tbody>' +
      (rows.map(function (d) { return '<tr class="click" data-open="' + d.ref + '"><td class="ref">' + d.ref + '</td><td>' + esc(cl(d.c).name) + '</td><td>' + esc(d.what) + '</td><td>' + esc(d.from) + ' → ' + esc(d.to) + '</td><td>' + MODE[d.mode] + ' ' + d.mode + '</td><td>' + stTag(d) + '</td><td>' + d.eta + '</td></tr>'; }).join('') || '<tr><td colspan="7">Aucun dossier.</td></tr>') + '</tbody></table></div><p class="note">Cliquez sur un dossier pour ouvrir sa fiche : étapes, documents, facture.</p>';
  };

  M.pipeline = function () {
    return '<div class="board">' + STEPS.map(function (s, i) {
      var l = S.dossiers.filter(function (d) { return d.step === i; });
      return '<div class="col"><h4>' + s + '<span>' + l.length + '</span></h4>' + l.map(function (d) { return '<div class="tk" data-open="' + d.ref + '"><b>' + d.ref + '</b><small>' + esc(d.what) + '</small><small>' + MODE[d.mode] + ' ' + esc(d.from) + ' → ' + esc(d.to) + '</small>' + tag(cl(d.c).name.split(' (')[0], '') + '</div>'; }).join('') + '</div>';
    }).join('') + '</div><p class="note">Ouvrez une fiche puis « Avancer l\'étape » : la carte change de colonne.</p>';
  };

  M.douane = function () {
    var list = S.dossiers.filter(function (d) { return d.step >= 1; });
    return '<div class="tw"><table><thead><tr><th>Dossier</th><th>Client</th><th>Régime</th><th class="num">Valeur déclarée</th><th class="num">Droits &amp; taxes (est.)</th><th>Statut déclaration</th><th></th></tr></thead><tbody>' +
      list.map(function (d) { var dr = Math.round(d.val * 0.18); return '<tr><td class="ref">' + d.ref + '</td><td>' + esc(cl(d.c).name) + '</td><td>' + (d.from === 'Libreville' || d.to === 'Plateforme offshore' ? 'Transit national' : 'Mise à la consommation') + '</td><td class="num">' + fcfa(d.val) + '</td><td class="num">' + fcfa(dr) + '</td><td>' + tag(CUSTOMS[d.cu], d.cu === 3 ? 't-ok' : d.cu === 0 ? 't-warn' : 't-info') + '</td><td>' + (d.cu < 3 ? '<button class="btn btn--sm" data-cu="' + d.ref + '">Étape suivante →</button>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div><p class="note">Les montants de droits sont des estimations fictives à titre d\'illustration.</p>';
  };

  M.flotte = function () {
    return '<div class="grid g3">' + S.fleet.map(function (f) {
      var c = f.st === 0 ? 't-ok' : f.st === 1 ? 't-acc' : 't-bad';
      return '<div class="card"><h3>' + f.id + ' ' + tag(FLEET_ST[f.st], c) + '</h3><b>' + esc(f.name) + '</b><p style="color:var(--muted);margin:4px 0 14px">' + f.type + (f.doss ? ' · affecté à ' + f.doss : '') + '</p>' +
        (f.st === 0 ? '<select data-assign="' + f.id + '" style="padding:8px;border:1px solid var(--line);border-radius:8px;width:100%"><option value="">Affecter à un dossier…</option>' + S.dossiers.filter(function (d) { return d.step < 5; }).map(function (d) { return '<option>' + d.ref + '</option>'; }).join('') + '</select>' : '') +
        (f.st === 1 ? '<button class="btn btn--ghost btn--sm" data-free="' + f.id + '">Mission terminée</button>' : '') + (f.st === 2 ? '<button class="btn btn--ghost btn--sm" data-free="' + f.id + '">Remise en service</button>' : '') + '</div>';
    }).join('') + '</div>';
  };

  M.entrepot = function () {
    return '<div class="bar"><span class="sp"></span><button class="btn" data-act="newstock">+ Entrée en stock</button></div><div class="tw"><table><thead><tr><th>Dossier</th><th>Désignation</th><th>Emplacement</th><th class="num">Qté</th><th>Durée</th><th></th></tr></thead><tbody>' +
      S.stock.map(function (s) { return '<tr><td class="ref">' + s.doss + '</td><td>' + esc(s.what) + '</td><td>' + esc(s.loc) + '</td><td class="num">' + s.qty + '</td><td>' + tag(s.days + ' j', s.days >= 7 ? 't-warn' : '') + '</td><td><button class="btn btn--ghost btn--sm" data-out="' + s.id + '">Sortie</button></td></tr>'; }).join('') + '</tbody></table></div>';
  };

  M.factures = function () {
    var tot = S.inv.reduce(function (a, i) { return a + i.amt; }, 0), paid = S.inv.filter(function (i) { return i.st === 2; }).reduce(function (a, i) { return a + i.amt; }, 0);
    return '<div class="grid g3" style="margin-bottom:18px"><div class="card kpi"><span>Facturé</span><b>' + fcfa(tot) + '</b></div><div class="card kpi"><span>Encaissé</span><b>' + fcfa(paid) + '</b></div><div class="card kpi"><span>Reste à encaisser</span><b>' + fcfa(tot - paid) + '</b></div></div>' +
      '<div class="tw"><table><thead><tr><th>Facture</th><th>Dossier</th><th>Client</th><th>Date</th><th class="num">Montant</th><th>Statut</th><th></th></tr></thead><tbody>' +
      S.inv.map(function (i) { return '<tr><td class="ref">' + i.no + '</td><td>' + i.doss + '</td><td>' + esc(cl(i.c).name) + '</td><td>' + i.date + '</td><td class="num">' + fcfa(i.amt) + '</td><td>' + tag(INV_ST[i.st], i.st === 2 ? 't-ok' : i.st === 1 ? 't-warn' : '') + '</td><td>' + (i.st < 2 ? '<button class="btn btn--sm" data-inv="' + i.no + '">' + (i.st === 0 ? 'Envoyer' : 'Marquer payée') + '</button>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div><p class="note">Les factures se créent depuis la fiche d\'un dossier (« Créer la facture »).</p>';
  };

  M.clients = function () {
    return '<div class="tw"><table><thead><tr><th>Client</th><th>Contact</th><th>Ville</th><th class="num">Dossiers</th><th class="num">Encours</th></tr></thead><tbody>' +
      S.clients.map(function (c) { var n = S.dossiers.filter(function (d) { return d.c === c.id; }).length, en = S.inv.filter(function (i) { return i.c === c.id && i.st < 2; }).reduce(function (a, i) { return a + i.amt; }, 0); return '<tr><td class="ref">' + esc(c.name) + '</td><td>' + c.contact + '</td><td>' + c.city + '</td><td class="num">' + n + '</td><td class="num">' + fcfa(en) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  };

  M.portail = function () {
    var id = Number(filt.pc || 1), list = S.dossiers.filter(function (d) { return d.c === id; });
    return '<div class="bar"><b>Voir le portail tel que le voit :</b><select id="f-pc">' + S.clients.map(function (c) { return '<option value="' + c.id + '"' + (c.id === id ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></div>' +
      '<div class="pcards">' + list.map(function (d) { return '<div class="pc"><img src="assets/img/' + IMG[d.mode] + '" alt=""><div><b>' + d.ref + '</b> ' + stTag(d) + '<p>' + esc(d.what) + '</p><small>' + esc(d.from) + ' → ' + esc(d.to) + ' · ETA ' + d.eta + '</small><div class="prog" style="margin-top:12px"><i style="width:' + (d.step / 5 * 100) + '%"></i></div></div></div>'; }).join('') + '</div>' +
      '<p class="note">C\'est la même information que dans l\'ERP, en lecture seule : le client suit ses expéditions sans téléphoner ni écrire. Les mises à jour faites par ART apparaissent ici instantanément.</p>';
  };

  var TITLES = { dash: 'Tableau de bord', dossiers: 'Dossiers de transit', pipeline: 'Suivi des expéditions', douane: 'Douane', flotte: 'Flotte & manutention', entrepot: 'Entrepôt', factures: 'Facturation', clients: 'Clients', portail: 'Portail client' };
  function render() {
    $('#content').innerHTML = M[view]();
    $('#title').textContent = TITLES[view];
    $$('#menu button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.m === view); });
    var q = $('#f-q'); if (q) { q.addEventListener('input', function () { filt.q = q.value; var p = q.selectionStart; render(); var n = $('#f-q'); n.focus(); n.setSelectionRange(p, p); }); }
    var fm = $('#f-mode'); if (fm) fm.addEventListener('change', function () { filt.mode = fm.value; render(); });
    var fs = $('#f-step'); if (fs) fs.addEventListener('change', function () { filt.step = fs.value; render(); });
    var pc = $('#f-pc'); if (pc) pc.addEventListener('change', function () { filt.pc = pc.value; render(); });
    $$('[data-assign]').forEach(function (s) { s.addEventListener('change', function () { if (!s.value) return; var f = S.fleet.filter(function (x) { return x.id === s.dataset.assign; })[0]; f.st = 1; f.doss = s.value; logAdd(f.id + ' affecté à ' + s.value); save(); toast(f.id + ' affecté à ' + s.value); render(); }); });
  }

  /* ---------- Fiche dossier ---------- */
  function docsOf(d) {
    var l = [['Facture proforma', 1]];
    l.push([d.mode === 'Aérien' ? 'Lettre de transport aérien (LTA)' : d.mode === 'Maritime' ? 'Connaissement (B/L)' : 'Lettre de voiture', d.step >= 1]);
    l.push(['Déclaration en douane', d.cu >= 1]); l.push(['Bon de livraison signé', d.step >= 5]);
    return l;
  }
  function openDossier(ref) {
    var d = dos(ref); if (!d) return;
    var inv = S.inv.filter(function (i) { return i.doss === ref; })[0];
    $('#drawer-panel').innerHTML = '<div class="dh"><div><h2>' + d.ref + '</h2>' + stTag(d) + '</div><button class="x" data-close aria-label="Fermer">×</button></div>' +
      '<div class="kv"><div><small>Client</small>' + esc(cl(d.c).name) + '</div><div><small>Mode</small>' + MODE[d.mode] + ' ' + d.mode + '</div><div><small>Marchandise</small>' + esc(d.what) + '</div><div><small>Poids</small>' + d.w + '</div><div><small>Trajet</small>' + esc(d.from) + ' → ' + esc(d.to) + '</div><div><small>ETA</small>' + d.eta + '</div></div>' +
      '<div class="dsec">Avancement</div><ul class="stepper">' + STEPS.map(function (s, i) { return '<li class="' + (i < d.step ? 'done' : i === d.step ? 'now' : 'todo') + '"><i></i>' + s + '</li>'; }).join('') + '</ul>' +
      '<div class="dsec">Documents</div><ul class="dl">' + docsOf(d).map(function (x) { return '<li><span>' + x[0] + '</span>' + (x[1] ? tag('Disponible', 't-ok') : tag('En attente', '')) + '</li>'; }).join('') + '</ul>' +
      '<div class="dsec">Historique</div><ul class="dl">' + d.ev.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>' +
      '<div class="dact">' + (d.step < 5 ? '<button class="btn" data-adv="' + d.ref + '">Avancer l\'étape →</button>' : '') +
      (inv ? '<span class="tag t-ok" style="align-self:center">Facture ' + inv.no + '</span>' : '<button class="btn btn--ghost" data-mkinv="' + d.ref + '">Créer la facture</button>') + '</div>';
    $('#drawer').hidden = false;
  }
  function closeAll() { $('#drawer').hidden = true; $('#modal').hidden = true; }

  /* ---------- Actions ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open],[data-adv],[data-cu],[data-free],[data-out],[data-inv],[data-mkinv],[data-act],[data-close],[data-m]');
    if (!t) return;
    var D = t.dataset;
    if (D.close !== undefined) return closeAll();
    if (D.m) { view = D.m; $('#side').classList.remove('open'); return render(); }
    if (D.open) return openDossier(D.open);
    if (D.adv) {
      var d = dos(D.adv); if (d.step < 5) { d.step++; d.ev.unshift(today() + ' — ' + STEPS[d.step]); if (d.step === 5) d.eta = 'Livré'; if (d.step >= 3 && d.cu === 0 && d.step === 4) d.cu = 1; logAdd(d.ref + ' : ' + STEPS[d.step]); save(); toast(d.ref + ' → ' + STEPS[d.step]); openDossier(d.ref); render(); }
      return;
    }
    if (D.cu) { var x = dos(D.cu); if (x.cu < 3) { x.cu++; logAdd(x.ref + ' : déclaration ' + CUSTOMS[x.cu].toLowerCase()); save(); toast(x.ref + ' — ' + CUSTOMS[x.cu]); render(); } return; }
    if (D.free) { var f = S.fleet.filter(function (v) { return v.id === D.free; })[0]; f.st = 0; f.doss = ''; save(); render(); return; }
    if (D.out) { S.stock = S.stock.filter(function (s) { return String(s.id) !== D.out; }); save(); toast('Sortie de stock enregistrée'); render(); return; }
    if (D.inv) { var i = S.inv.filter(function (v) { return v.no === D.inv; })[0]; i.st++; logAdd('Facture ' + i.no + ' : ' + INV_ST[i.st].toLowerCase()); save(); toast('Facture ' + i.no + ' — ' + INV_ST[i.st]); render(); return; }
    if (D.mkinv) {
      var dd = dos(D.mkinv); var no = 'F-26-' + (188 + S.inv.length - 3);
      S.inv.unshift({ no: no, doss: dd.ref, c: dd.c, amt: Math.round(dd.val * 0.55), st: 0, date: today() }); logAdd('Facture ' + no + ' créée pour ' + dd.ref); save(); toast('Facture ' + no + ' créée (brouillon)'); openDossier(dd.ref); render(); return;
    }
    if (D.act === 'new') return newDossier();
    if (D.act === 'newstock') return newStock();
  });
  function modal(html, onSubmit) { var f = $('#modal-form'); f.innerHTML = html; $('#modal').hidden = false; f.onsubmit = function (e) { e.preventDefault(); onSubmit(new FormData(f)); closeAll(); }; }
  function newDossier() {
    modal('<h3>Nouveau dossier de transit</h3><label class="full">Client<select name="c">' + S.clients.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') + '</select></label>' +
      '<label>Mode<select name="mode"><option>Maritime</option><option>Aérien</option><option>Routier</option></select></label><label>Poids estimé<input name="w" placeholder="Ex. 12 t"></label>' +
      '<label>Origine<input name="from" required placeholder="Houston, USA"></label><label>Destination<input name="to" required placeholder="Port-Gentil"></label>' +
      '<label class="full">Marchandise<input name="what" required placeholder="Ex. équipements de forage"></label>' +
      '<div class="full"><button class="btn" type="submit">Créer le dossier</button> <button class="btn btn--ghost" type="button" data-close>Annuler</button></div>', function (fd) {
        var ref = 'ART-26-0' + (++S.seq);
        S.dossiers.unshift({ ref: ref, c: Number(fd.get('c')), what: fd.get('what'), from: fd.get('from'), to: fd.get('to'), mode: fd.get('mode'), step: 0, eta: '—', w: fd.get('w') || '—', val: 2500000, cu: 0, ev: [today() + ' — Dossier ouvert'] });
        logAdd('Dossier ' + ref + ' ouvert'); save(); toast('Dossier ' + ref + ' créé'); render(); openDossier(ref);
      });
  }
  function newStock() {
    modal('<h3>Entrée en stock</h3><label class="full">Dossier<select name="doss">' + S.dossiers.map(function (d) { return '<option>' + d.ref + '</option>'; }).join('') + '</select></label>' +
      '<label class="full">Désignation<input name="what" required></label><label>Emplacement<input name="loc" value="Hangar A · A-20"></label><label>Quantité<input name="qty" type="number" min="1" value="1"></label>' +
      '<div class="full"><button class="btn" type="submit">Enregistrer</button> <button class="btn btn--ghost" type="button" data-close>Annuler</button></div>', function (fd) {
        S.stock.unshift({ id: Date.now(), doss: fd.get('doss'), what: fd.get('what'), loc: fd.get('loc'), qty: Number(fd.get('qty')) || 1, days: 0 }); save(); toast('Entrée en stock enregistrée'); render();
      });
  }
  $('#reset').addEventListener('click', function () { S = clone(SEED); save(); closeAll(); toast('Démo réinitialisée'); render(); });
  $('#menu-btn').addEventListener('click', function () { $('#side').classList.toggle('open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  if (location.hash && M[location.hash.slice(1)]) view = location.hash.slice(1);
  render();
})();
