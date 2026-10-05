(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY = 'art-erp-demo-v3';
  var TVA = 0.18;
  var STEPS = ['Dossier ouvert', 'Chargement au départ', 'En transit', 'Arrivé', 'En douane', 'Livré'];
  var STAG = ['t-info', 't-info', 't-acc', 't-warn', 't-warn', 't-ok'];
  var MODE = { Maritime: '🚢', Aérien: '✈️', Routier: '🚚' };
  var CUSTOMS = ['À préparer', 'Déposée', 'Liquidée', 'Mainlevée'];
  var FLEET_ST = ['Disponible', 'En mission', 'Maintenance'];
  var INV_ST = ['Brouillon', 'Envoyée', 'Payée'];
  var QUO_ST = ['Brouillon', 'Envoyé', 'Accepté', 'Refusé'];
  var IMG = { Maritime: 'svc-maritime.jpg', Aérien: 'svc-international.jpg', Routier: 'svc-routier.jpg' };
  var MONTHS = ['Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.'];
  var CA_HIST = [38.2, 45.6, 41.9, 52.4, 57.8];       // M FCFA, données fictives
  var TON_HIST = [410, 468, 436, 520, 574];           // tonnes, données fictives

  var SEED = {
    seq: 436, qseq: 64,
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
      { no: 'F-26-0187', doss: 'ART-26-0397', c: 1, amt: 2255000, st: 2, date: '29/09' },
      { no: 'F-26-0186', doss: 'ART-26-0388', c: 2, amt: 4620000, st: 1, date: '26/09' },
      { no: 'F-26-0185', doss: 'ART-26-0409', c: 5, amt: 5005000, st: 0, date: '05/10' },
      { no: 'F-26-0184', doss: 'ART-26-0405', c: 4, amt: 3410000, st: 1, date: '03/10' }
    ],
    quotes: [
      { no: 'D-26-0063', c: 2, obj: 'Import transformateurs — Anvers → Libreville', mode: 'Maritime', from: 'Anvers, Belgique', to: 'Libreville', lines: [{ d: 'Fret maritime', q: 1, pu: 3200000 }, { d: 'Dédouanement', q: 1, pu: 850000 }, { d: 'Transport routier jusqu\'au site', q: 1, pu: 600000 }], st: 1, date: '03/10' },
      { no: 'D-26-0062', c: 4, obj: 'Matériel de chantier — Dubaï → Libreville', mode: 'Maritime', from: 'Dubaï, EAU', to: 'Libreville', lines: [{ d: 'Fret maritime', q: 1, pu: 2600000 }, { d: 'Dédouanement', q: 1, pu: 700000 }], st: 2, date: '30/09' },
      { no: 'D-26-0061', c: 5, obj: 'Tiges de forage — Houston → Port-Gentil', mode: 'Maritime', from: 'Houston, USA', to: 'Port-Gentil', lines: [{ d: 'Fret maritime', q: 1, pu: 4100000 }, { d: 'Manutention et levage', q: 1, pu: 1200000 }], st: 2, date: '27/09' },
      { no: 'D-26-0060', c: 3, obj: 'Pièces offshore — Paris → Port-Gentil', mode: 'Aérien', from: 'Paris, France', to: 'Port-Gentil', lines: [{ d: 'Fret aérien', q: 1, pu: 480000 }], st: 3, date: '25/09' }
    ],
    log: ['Dossier ART-26-0433 ouvert (Paris → Port-Gentil)', 'ART-26-0409 : droits liquidés', 'ART-26-0405 : navire à quai à Libreville', 'Facture F-26-0187 payée par Société Démo Pétrole']
  };

  SEED.pseq = 32; SEED.sseq = 19;
  SEED.po = [
    { no: 'BC-26-0032', c: 2, cref: 'EA-PO-1187', q: 'D-26-0063', doss: '', lines: [{ d: 'Fret maritime', q: 1, pu: 3200000 }, { d: 'Dédouanement', q: 1, pu: 850000 }, { d: 'Transport routier jusqu\'au site', q: 1, pu: 600000 }], st: 0, date: '04/10' },
    { no: 'BC-26-0031', c: 4, cref: 'PO-BOR-7741', q: 'D-26-0062', doss: 'ART-26-0405', lines: [{ d: 'Fret maritime', q: 1, pu: 2600000 }, { d: 'Dédouanement', q: 1, pu: 700000 }], st: 1, date: '01/10' },
    { no: 'BC-26-0030', c: 5, cref: 'DF/2209', q: 'D-26-0061', doss: 'ART-26-0409', lines: [{ d: 'Fret maritime', q: 1, pu: 4100000 }, { d: 'Manutention et levage', q: 1, pu: 1200000 }], st: 2, date: '28/09' },
    { no: 'BC-26-0029', c: 1, cref: 'SDP-4410', q: '', doss: 'ART-26-0412', lines: [{ d: 'Transport tubes de forage Houston → Port-Gentil', q: 1, pu: 6400000 }], st: 1, date: '24/09' }
  ];
  SEED.sup = [
    { id: 1, name: 'Atlantic Lines (démo)', type: 'Armateur', city: 'Anvers' },
    { id: 2, name: 'Ogooué Trans (démo)', type: 'Transporteur routier', city: 'Port-Gentil' },
    { id: 3, name: 'Air Cargo Partners (démo)', type: 'Agent aérien', city: 'Paris' },
    { id: 4, name: 'Levage Océan (démo)', type: 'Levage et grutage', city: 'Port-Gentil' },
    { id: 5, name: 'Assurance Marine Gabon (démo)', type: 'Assurance transport', city: 'Libreville' }
  ];
  SEED.spo = [
    { no: 'BF-26-0018', s: 1, doss: 'ART-26-0412', obj: 'Fret maritime Houston → Port-Gentil', amt: 4300000, st: 2, date: '24/09' },
    { no: 'BF-26-0017', s: 2, doss: 'ART-26-0421', obj: 'Transport routier hors gabarit', amt: 1900000, st: 1, date: '03/10' },
    { no: 'BF-26-0016', s: 4, doss: 'ART-26-0409', obj: 'Levage et déchargement tiges de forage', amt: 950000, st: 3, date: '05/10' },
    { no: 'BF-26-0015', s: 3, doss: 'ART-26-0425', obj: 'Fret aérien Houston → Libreville', amt: 2100000, st: 2, date: '02/10' }
  ];
  var SITES = [['Port-Gentil — quai commercial', -0.7138, 8.7772], ['Port-Gentil — hangars ART', -0.7210, 8.7850], ['Cap Lopez — terminal pétrolier', -0.6230, 8.7040], ['Owendo — port', 0.2990, 9.5010], ['Libreville — dépôt ART', 0.4020, 9.4500], ['Base offshore (plateforme)', -1.1, 8.3]];
  var POS0 = { 'T-01': [0.2988, 9.5008, 'Owendo — port', 22], 'T-02': [0.4018, 9.4496, 'Libreville — dépôt ART', 0], 'C-01': [-0.7136, 8.7770, 'Port-Gentil — quai commercial', 6], 'C-02': [-0.7208, 8.7848, 'Port-Gentil — hangars ART', 0], 'G-01': [-0.7182, 8.7831, 'Port-Gentil — atelier', 0], 'P-01': [0.4150, 9.4650, 'Libreville — bureaux ART', 0] };
  SEED.fleet.forEach(function (f) { var p = POS0[f.id]; f.pos = { lat: p[0], lon: p[1], place: p[2], sp: p[3] }; });
  SEED.ships = [{ ref: 'ART-26-0412', name: 'Navire Houston → Port-Gentil (démo)', lat: -0.9, lon: 7.3, sp: 12, st: 'En mer' }, { ref: 'ART-26-0405', name: 'Navire Dubaï → Libreville (démo)', lat: 0.2975, lon: 9.5036, sp: 0, st: 'À quai à Owendo' }];
  SEED.jseq = 17;
  SEED.jobs = [
    { id: 'TR-014', title: 'Déchargement tiges de forage', site: 0, doss: 'ART-26-0409', equip: ['C-01'], st: 1, d0: -1, dur: 3 },
    { id: 'TR-015', title: 'Chargement skid hors gabarit', site: 3, doss: 'ART-26-0421', equip: ['T-01'], st: 1, d0: 0, dur: 4 },
    { id: 'TR-016', title: 'Levage structure acier', site: 1, doss: 'ART-26-0430', equip: ['C-02'], st: 0, d0: 3, dur: 2 },
    { id: 'TR-017', title: 'Réception conteneurs base vie', site: 4, doss: 'ART-26-0405', equip: ['T-02'], st: 0, d0: 5, dur: 2 },
    { id: 'TR-013', title: 'Transfert transformateurs', site: 4, doss: 'ART-26-0388', equip: [], st: 2, d0: -6, dur: 2 }
  ];
  SEED.calls = [
    { ship: 'Navire Houston → Port-Gentil (démo)', ref: 'ART-26-0412', port: 'Port-Gentil', berth: 'Quai 2', eta: 9, etd: 11, ops: 'Déchargement tubes de forage' },
    { ship: 'Navire Dubaï → Libreville (démo)', ref: 'ART-26-0405', port: 'Owendo', berth: 'Quai 5', eta: -1, etd: 1, ops: 'Déchargement matériel de chantier' },
    { ship: 'Navire support offshore (démo)', ref: 'ART-26-0430', port: 'Port-Gentil', berth: 'Quai 1', eta: 4, etd: 5, ops: 'Chargement structure acier' },
    { ship: 'Cargo Anvers → Libreville (démo)', ref: 'ART-26-0388', port: 'Owendo', berth: 'Quai 3', eta: -7, etd: -5, ops: 'Déchargement transformateurs' },
    { ship: 'Barge tubulaires (démo)', ref: 'ART-26-0409', port: 'Port-Gentil', berth: 'Quai 3', eta: -2, etd: 1, ops: 'Déchargement tiges de forage' }
  ];
  var SPO_ST = ['Brouillon', 'Envoyée', 'Confirmée', 'Soldée'];
  var supn = function (id) { var s = S.sup.filter(function (x) { return x.id === id; })[0]; return s ? s.name : '—'; };
  var navs = 0, S, view = 'dash', filt = { q: '', mode: '', step: '' };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.dossiers && s.quotes && s.po && s.spo && s.jobs && s.ships && s.calls) return s; } catch (e) {} return clone(SEED); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  S = load();
  var nf = function (n) { return Number(n).toLocaleString('fr-FR'); };
  var fcfa = function (n) { return nf(n) + ' FCFA'; };
  var pdfn = function (n) { return nf(n).replace(/[  ]/g, ' '); };
  var ttc = function (n) { return Math.round(n * (1 + TVA)); };
  var cl = function (id) { return S.clients.filter(function (c) { return c.id === id; })[0] || { name: '—' }; };
  var dos = function (ref) { return S.dossiers.filter(function (d) { return d.ref === ref; })[0]; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tag = function (t, c) { return '<span class="tag ' + (c || '') + '">' + t + '</span>'; };
  var stTag = function (d) { return tag(STEPS[d.step], STAG[d.step]); };
  var today = function () { var d = new Date(); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); };
  var short = function () { return today().slice(0, 5); };
  var sum = function (a, f) { return a.reduce(function (t, x) { return t + f(x); }, 0); };
  function toast(t) { var e = $('#toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { e.hidden = true; }, 2600); }
  function logAdd(t) { S.log.unshift(t); S.log = S.log.slice(0, 8); }
  function invLines(i) { var h = i.amt; return i.lines || [{ d: 'Transport international — dossier ' + i.doss, q: 1, pu: Math.round(h * 0.6) }, { d: 'Dédouanement et formalités', q: 1, pu: Math.round(h * 0.25) }, { d: 'Manutention et livraison', q: 1, pu: h - Math.round(h * 0.6) - Math.round(h * 0.25) }]; }
  var qHT = function (q) { return sum(q.lines, function (l) { return l.q * l.pu; }); };

  /* ---------- Graphiques SVG ---------- */
  function lineChart(vals, labels, unit) {
    var W = 600, H = 220, pl = 34, pr = 14, pt = 22, pb = 28, mx = Math.max.apply(null, vals) * 1.15, mn = 0;
    var x = function (i) { return pl + i * (W - pl - pr) / (vals.length - 1); }, y = function (v) { return pt + (H - pt - pb) * (1 - (v - mn) / (mx - mn)); };
    var pts = vals.map(function (v, i) { return [x(i), y(v)]; });
    var path = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var area = path + ' L' + x(vals.length - 1) + ' ' + (H - pb) + ' L' + x(0) + ' ' + (H - pb) + ' Z';
    var grid = [0, .5, 1].map(function (f) { var v = mx * f / 1.15; return '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#e7e9ee"/><text x="' + (pl - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + Math.round(v) + '</text>'; }).join('');
    var id = 'g' + Math.floor(Math.random() * 1e6);
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f26a1b" stop-opacity=".35"/><stop offset="1" stop-color="#f26a1b" stop-opacity="0"/></linearGradient></defs>' + grid +
      '<path d="' + area + '" fill="url(#' + id + ')"/><path d="' + path + '" fill="none" stroke="#f26a1b" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
      pts.map(function (p, i) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4.5" fill="#fff" stroke="#f26a1b" stroke-width="2.5"/><text class="v" x="' + p[0] + '" y="' + (p[1] - 10) + '" text-anchor="middle">' + vals[i] + '</text><text x="' + p[0] + '" y="' + (H - 8) + '" text-anchor="middle">' + labels[i] + '</text>'; }).join('') + '</svg>';
  }
  function hbars(items, fmt) {
    var mx = Math.max.apply(null, items.map(function (i) { return i[1]; })) || 1;
    return '<div class="hb">' + items.map(function (i) { return '<div><span>' + esc(i[0]) + '</span><span class="prog"><i style="width:' + (i[1] / mx * 100) + '%"></i></span><b>' + fmt(i[1]) + '</b></div>'; }).join('') + '</div>';
  }
  function ring(pct, label, color) { pct = Math.round(pct); return '<div class="ring"><div class="ring__c" style="background:conic-gradient(' + (color || '#f26a1b') + ' ' + pct * 3.6 + 'deg,#e9ebef 0)"><b>' + pct + '%</b></div><span>' + label + '</span></div>'; }
  function kpi(label, val, small, neg) { return '<div class="card kpi"><span>' + label + '</span><b>' + val + '</b>' + (small ? '<small' + (neg ? ' class="neg"' : '') + '>' + small + '</small>' : '') + '</div>'; }
  var exportBtn = function (what) { return '<button class="btn btn--ghost" data-csv="' + what + '">⬇ Exporter (Excel/CSV)</button>'; };

  /* ---------- Modules ---------- */
  var M = {};
  M.dash = function () {
    var D = S.dossiers, run = D.filter(function (d) { return d.step < 5; }).length;
    var due = sum(S.inv.filter(function (i) { return i.st < 2; }), function (i) { return ttc(i.amt); });
    var ca = (sum(S.dossiers, function (d) { return d.val; }) / 1e6) * 0.55;
    var caSeries = CA_HIST.concat([Math.round(ca * 10) / 10]);
    var tonSeries = TON_HIST.concat([Math.round(sum(D, function (d) { return parseFloat(String(d.w).replace(',', '.')) || 0; }) * 1.1 + 200)]);
    var modes = ['Maritime', 'Aérien', 'Routier'], col = ['#f26a1b', '#14181f', '#8d95a3'];
    var cnt = modes.map(function (m) { return D.filter(function (d) { return d.mode === m; }).length; }), tot = cnt.reduce(function (a, b) { return a + b; }, 0) || 1;
    var acc = 0, grad = cnt.map(function (n, i) { var a = acc / tot * 360; acc += n; return col[i] + ' ' + a + 'deg ' + (acc / tot * 360) + 'deg'; }).join(',');
    var byClient = S.clients.map(function (c) { return [c.name.split(' (')[0], sum(D.filter(function (d) { return d.c === c.id; }), function (d) { return Math.round(d.val * 0.55 / 1000) / 1000; })]; }).sort(function (a, b) { return b[1] - a[1]; });
    var fleetUse = sum(S.fleet, function (f) { return f.st === 1 ? 1 : 0; }) / S.fleet.length * 100;
    var occ = Math.min(100, sum(S.stock, function (s) { return s.qty; }) / 2.2);
    var invoiced = D.filter(function (d) { return S.inv.some(function (i) { return i.doss === d.ref; }); }).length / D.length * 100;
    var late = D.filter(function (d) { return d.step === 3 && d.cu === 0; });
    var qpend = S.quotes.filter(function (q) { return q.st === 1; });
    return '<div class="grid g4">' + kpi('Dossiers en cours', run, 'sur ' + D.length + ' dossiers') + kpi('Chiffre d\'affaires (mois, HT)', nf(Math.round(ca * 10) / 10) + ' M', '▲ +' + Math.round((ca / CA_HIST[4] - 1) * 100) + ' % vs sept.') +
      kpi('Factures à encaisser (TTC)', fcfa(due), S.inv.filter(function (i) { return i.st < 2; }).length + ' en attente', true) + kpi('Devis en attente de réponse', qpend.length, fcfa(sum(qpend, function (q) { return ttc(qHT(q)); })) + ' TTC') + '</div>' +
      '<div class="grid g2 mt"><div class="card"><h3>Chiffre d\'affaires mensuel <small style="font-weight:400;color:var(--muted)">M FCFA · données fictives</small></h3>' + lineChart(caSeries, MONTHS, 'M') + '</div>' +
      '<div class="card"><h3>Répartition par mode</h3><div class="donut"><div class="donut__c" style="background:conic-gradient(' + grad + ')"></div><div class="legend">' + modes.map(function (m, i) { return '<span style="--c:' + col[i] + '">' + m + ' — ' + cnt[i] + ' dossiers</span>'; }).join('') + '</div></div>' +
      '<h3 style="margin-top:22px">Délai moyen de dédouanement</h3><div class="kpi" style="border:0;padding:0"><b>2,8 jours</b><small>▼ −0,4 j vs mois dernier</small></div></div></div>' +
      '<div class="rings">' + ring(94, 'Livraisons dans les délais') + ring(fleetUse, 'Utilisation de la flotte', '#14181f') + ring(occ, 'Occupation de l\'entrepôt', '#8d95a3') + ring(invoiced, 'Dossiers facturés', '#16a34a') + '</div>' +
      '<div class="grid g2 mt"><div class="card"><h3>Tonnage traité <small style="font-weight:400;color:var(--muted)">tonnes · données fictives</small></h3>' + lineChart(tonSeries, MONTHS, 't') + '</div>' +
      '<div class="card"><h3>Chiffre d\'affaires par client <small style="font-weight:400;color:var(--muted)">M FCFA</small></h3>' + hbars(byClient, function (v) { return nf(Math.round(v * 10) / 10); }) + '</div></div>' +
      '<div class="card mt"><h3>Parcours commercial <small style="font-weight:400;color:var(--muted)">du devis à l\'encaissement</small></h3>' + hbars([['Devis émis', S.quotes.length], ['Devis acceptés', S.quotes.filter(function (q) { return q.st === 2; }).length], ['Bons de commande', S.po.length], ['Dossiers ouverts', D.length], ['Factures émises', S.inv.length], ['Factures payées', S.inv.filter(function (i) { return i.st === 2; }).length]], function (v) { return v; }) + '</div>' +
      '<div class="grid g2 mt"><div class="card"><h3>Activité récente</h3><ul class="feed">' + S.log.map(function (l) { return '<li><i></i><div>' + esc(l) + '</div></li>'; }).join('') + '</ul></div>' +
      '<div class="card"><h3>Alertes</h3>' + late.map(function (d) { return '<div class="alert">⚠️ <div><b>' + d.ref + '</b> arrivé, déclaration en douane à préparer.</div></div>'; }).join('') +
      S.stock.filter(function (s) { return s.days >= 7; }).map(function (s) { return '<div class="alert">📦 <div><b>' + esc(s.what) + '</b> en entrepôt depuis ' + s.days + ' jours.</div></div>'; }).join('') +
      S.inv.filter(function (i) { return i.st === 0; }).map(function (i) { return '<div class="alert">🧾 <div>Facture <b>' + i.no + '</b> à envoyer.</div></div>'; }).join('') +
      qpend.map(function (q) { return '<div class="alert">✎ <div>Devis <b>' + q.no + '</b> sans réponse du client.</div></div>'; }).join('') + '</div></div>';
  };

  M.dossiers = function () {
    var D = S.dossiers;
    var rows = D.filter(function (d) {
      var q = filt.q.toLowerCase();
      return (!q || (d.ref + d.what + d.from + d.to + cl(d.c).name).toLowerCase().indexOf(q) > -1) && (!filt.mode || d.mode === filt.mode) && (filt.step === '' || d.step === Number(filt.step));
    });
    return '<div class="sub-kpis">' + kpi('Dossiers', D.length) + kpi('En transit / départ', D.filter(function (d) { return d.step >= 1 && d.step <= 2; }).length) + kpi('Arrivés / en douane', D.filter(function (d) { return d.step >= 3 && d.step <= 4; }).length) + kpi('Livrés', D.filter(function (d) { return d.step === 5; }).length) + '</div>' +
      '<div class="bar"><input id="f-q" placeholder="Rechercher (référence, client, trajet…)" value="' + esc(filt.q) + '"><select id="f-mode"><option value="">Tous les modes</option>' +
      ['Maritime', 'Aérien', 'Routier'].map(function (m) { return '<option' + (filt.mode === m ? ' selected' : '') + '>' + m + '</option>'; }).join('') + '</select>' +
      '<select id="f-step"><option value="">Toutes les étapes</option>' + STEPS.map(function (s, i) { return '<option value="' + i + '"' + (String(filt.step) === String(i) ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select><span class="sp"></span>' +
      exportBtn('dossiers') + '<button class="btn" data-act="new">+ Nouveau dossier</button></div>' +
      '<div class="tw"><table><thead><tr><th>Dossier</th><th>Client</th><th>Marchandise</th><th>Trajet</th><th>Mode</th><th>Étape</th><th>ETA</th></tr></thead><tbody>' +
      (rows.map(function (d) { return '<tr class="click" data-open="' + d.ref + '"><td class="ref">' + d.ref + '</td><td>' + esc(cl(d.c).name) + '</td><td>' + esc(d.what) + '</td><td>' + esc(d.from) + ' → ' + esc(d.to) + '</td><td>' + MODE[d.mode] + ' ' + d.mode + '</td><td>' + stTag(d) + '</td><td>' + d.eta + '</td></tr>'; }).join('') || '<tr><td colspan="7">Aucun dossier.</td></tr>') + '</tbody></table></div><p class="note">Touchez un dossier pour ouvrir sa fiche : étapes, documents, facture, PDF.</p>';
  };

  M.pipeline = function () {
    return '<div class="board">' + STEPS.map(function (s, i) {
      var l = S.dossiers.filter(function (d) { return d.step === i; });
      return '<div class="col"><h4>' + s + '<span>' + l.length + '</span></h4>' + l.map(function (d) { return '<div class="tk" data-open="' + d.ref + '"><b>' + d.ref + '</b><small>' + esc(d.what) + '</small><small>' + MODE[d.mode] + ' ' + esc(d.from) + ' → ' + esc(d.to) + '</small>' + tag(cl(d.c).name.split(' (')[0], '') + '</div>'; }).join('') + '</div>';
    }).join('') + '</div><p class="note">Ouvrez une fiche puis « Avancer l\'étape » : la carte change de colonne.</p>';
  };

  M.devis = function () {
    var Q = S.quotes, acc = Q.filter(function (q) { return q.st === 2; }).length, ans = Q.filter(function (q) { return q.st >= 2; }).length || 1;
    return '<div class="sub-kpis">' + kpi('Devis émis', Q.length) + kpi('En attente de réponse', Q.filter(function (q) { return q.st === 1; }).length) + kpi('Taux d\'acceptation', Math.round(acc / ans * 100) + ' %') + kpi('Montant accepté (TTC)', fcfa(sum(Q.filter(function (q) { return q.st === 2; }), function (q) { return ttc(qHT(q)); }))) + '</div>' +
      '<div class="bar"><span class="sp"></span>' + exportBtn('devis') + '<button class="btn" data-act="newquote">+ Nouveau devis</button></div>' +
      '<div class="tw"><table><thead><tr><th>Devis</th><th>Client</th><th>Objet</th><th>Date</th><th class="num">Total TTC</th><th>Statut</th><th>Actions</th></tr></thead><tbody>' +
      Q.map(function (q) {
        return '<tr><td class="ref">' + q.no + '</td><td>' + esc(cl(q.c).name) + '</td><td>' + esc(q.obj) + '</td><td>' + q.date + '</td><td class="num">' + fcfa(ttc(qHT(q))) + '</td><td>' + tag(QUO_ST[q.st], q.st === 2 ? 't-ok' : q.st === 3 ? 't-bad' : q.st === 1 ? 't-warn' : '') + '</td><td><div class="dacts"><button class="pdf" data-pdfq="' + q.no + '">⬇ PDF</button>' +
          (q.st === 0 ? '<button class="btn btn--sm" data-qs="' + q.no + '|1">Envoyer</button>' : '') + (q.st === 1 ? '<button class="btn btn--sm" data-qs="' + q.no + '|2">Accepté</button><button class="btn btn--ghost btn--sm" data-qs="' + q.no + '|3">Refusé</button>' : '') + '</div></td></tr>';
      }).join('') + '</tbody></table></div><p class="note">Un devis « Accepté » ouvre automatiquement un dossier de transit. Le PDF est généré sur l\'appareil, prêt à envoyer au client.</p>';
  };

  M.factures = function () {
    var I = S.inv, tot = sum(I, function (i) { return ttc(i.amt); }), paid = sum(I.filter(function (i) { return i.st === 2; }), function (i) { return ttc(i.amt); });
    var bars = [['Envoyées', sum(I.filter(function (i) { return i.st === 1; }), function (i) { return ttc(i.amt) / 1e6; })], ['Brouillons', sum(I.filter(function (i) { return i.st === 0; }), function (i) { return ttc(i.amt) / 1e6; })], ['Payées', paid / 1e6]];
    return '<div class="sub-kpis">' + kpi('Facturé (TTC)', fcfa(tot)) + kpi('Encaissé', fcfa(paid), Math.round(paid / (tot || 1) * 100) + ' % du facturé') + kpi('Reste à encaisser', fcfa(tot - paid), '', true) + kpi('TVA collectée (18 %)', fcfa(Math.round(sum(I, function (i) { return i.amt; }) * TVA))) + '</div>' +
      '<div class="grid g2"><div class="card"><h3>Situation des factures <small style="font-weight:400;color:var(--muted)">M FCFA TTC</small></h3>' + hbars(bars, function (v) { return nf(Math.round(v * 10) / 10); }) + '</div><div class="card"><h3>Actions</h3><p style="color:var(--muted);margin-bottom:12px">Créez une facture depuis la fiche d\'un dossier, puis téléchargez-la en PDF pour l\'envoyer au client.</p>' + exportBtn('factures') + '</div></div>' +
      '<div class="tw mt"><table><thead><tr><th>Facture</th><th>Dossier</th><th>Client</th><th>Date</th><th class="num">HT</th><th class="num">TTC</th><th>Statut</th><th>Actions</th></tr></thead><tbody>' +
      I.map(function (i) { return '<tr><td class="ref">' + i.no + '</td><td>' + i.doss + '</td><td>' + esc(cl(i.c).name) + '</td><td>' + i.date + '</td><td class="num">' + fcfa(i.amt) + '</td><td class="num">' + fcfa(ttc(i.amt)) + '</td><td>' + tag(INV_ST[i.st], i.st === 2 ? 't-ok' : i.st === 1 ? 't-warn' : '') + '</td><td><div class="dacts"><button class="pdf" data-pdfi="' + i.no + '">⬇ PDF</button>' + (i.st < 2 ? '<button class="btn btn--sm" data-inv="' + i.no + '">' + (i.st === 0 ? 'Envoyer' : 'Marquer payée') + '</button>' : '') + '</div></td></tr>'; }).join('') + '</tbody></table></div>';
  };

  M.douane = function () {
    var list = S.dossiers.filter(function (d) { return d.step >= 1; });
    var dr = function (d) { return Math.round(d.val * 0.18); };
    return '<div class="sub-kpis">' + kpi('Déclarations suivies', list.length) + kpi('À préparer', list.filter(function (d) { return d.cu === 0; }).length, '', true) + kpi('Mainlevées obtenues', list.filter(function (d) { return d.cu === 3; }).length) + kpi('Droits estimés', fcfa(sum(list, dr))) + '</div>' +
      '<div class="tw"><table><thead><tr><th>Dossier</th><th>Client</th><th>Régime</th><th class="num">Valeur déclarée</th><th class="num">Droits &amp; taxes (est.)</th><th>Déclaration</th><th></th></tr></thead><tbody>' +
      list.map(function (d) { return '<tr><td class="ref">' + d.ref + '</td><td>' + esc(cl(d.c).name) + '</td><td>' + (d.from === 'Libreville' || d.to === 'Plateforme offshore' ? 'Transit national' : 'Mise à la consommation') + '</td><td class="num">' + fcfa(d.val) + '</td><td class="num">' + fcfa(dr(d)) + '</td><td>' + tag(CUSTOMS[d.cu], d.cu === 3 ? 't-ok' : d.cu === 0 ? 't-warn' : 't-info') + '</td><td>' + (d.cu < 3 ? '<button class="btn btn--sm" data-cu="' + d.ref + '">Étape suivante →</button>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div><p class="note">Les montants de droits sont des estimations fictives à titre d\'illustration.</p>';
  };

  M.flotte = function () {
    var F = S.fleet, mis = F.filter(function (f) { return f.st === 1; }).length;
    return '<div class="sub-kpis">' + kpi('Véhicules et engins', F.length) + kpi('En mission', mis, Math.round(mis / F.length * 100) + ' % d\'utilisation') + kpi('Disponibles', F.filter(function (f) { return f.st === 0; }).length) + kpi('En maintenance', F.filter(function (f) { return f.st === 2; }).length, '', true) + '</div>' +
      '<div class="grid g3">' + F.map(function (f) {
        var c = f.st === 0 ? 't-ok' : f.st === 1 ? 't-acc' : 't-bad';
        return '<div class="card"><h3>' + f.id + ' ' + tag(FLEET_ST[f.st], c) + '</h3><b>' + esc(f.name) + '</b><p style="color:var(--muted);margin:4px 0 14px">' + f.type + (f.doss ? ' · affecté à ' + f.doss : '') + '</p><p style="margin:-8px 0 12px;font-size:.84rem">📍 ' + esc(f.pos.place) + ' · <button class="linkbtn" data-geo="eq|' + f.id + '">Voir sur la carte</button></p>' +
          (f.st === 0 ? '<select data-assign="' + f.id + '" style="padding:9px;border:1px solid var(--line);border-radius:8px;width:100%"><option value="">Affecter à un dossier…</option>' + S.dossiers.filter(function (d) { return d.step < 5; }).map(function (d) { return '<option>' + d.ref + '</option>'; }).join('') + '</select>' : '') +
          (f.st === 1 ? '<button class="btn btn--ghost btn--sm" data-free="' + f.id + '">Mission terminée</button>' : '') + (f.st === 2 ? '<button class="btn btn--ghost btn--sm" data-free="' + f.id + '">Remise en service</button>' : '') + '</div>';
      }).join('') + '</div>';
  };

  M.entrepot = function () {
    var T = S.stock, occ = Math.min(100, Math.round(sum(T, function (s) { return s.qty; }) / 2.2));
    return '<div class="sub-kpis">' + kpi('Lignes en stock', T.length) + kpi('Colis / unités', nf(sum(T, function (s) { return s.qty; }))) + kpi('Occupation', occ + ' %') + kpi('Séjour > 7 jours', T.filter(function (s) { return s.days >= 7; }).length, 'à sortir', true) + '</div>' +
      '<div class="bar"><span class="sp"></span>' + exportBtn('stock') + '<button class="btn" data-act="newstock">+ Entrée en stock</button></div><div class="tw"><table><thead><tr><th>Dossier</th><th>Désignation</th><th>Emplacement</th><th class="num">Qté</th><th>Durée</th><th></th></tr></thead><tbody>' +
      T.map(function (s) { return '<tr><td class="ref">' + s.doss + '</td><td>' + esc(s.what) + '</td><td>' + esc(s.loc) + '</td><td class="num">' + s.qty + '</td><td>' + tag(s.days + ' j', s.days >= 7 ? 't-warn' : '') + '</td><td><button class="btn btn--ghost btn--sm" data-out="' + s.id + '">Sortie</button></td></tr>'; }).join('') + '</tbody></table></div>';
  };

  M.clients = function () {
    var by = S.clients.map(function (c) { return [c.name.split(' (')[0], sum(S.dossiers.filter(function (d) { return d.c === c.id; }), function (d) { return d.val * 0.55 / 1e6; })]; });
    return '<div class="grid g2"><div class="card"><h3>Chiffre d\'affaires par client <small style="font-weight:400;color:var(--muted)">M FCFA</small></h3>' + hbars(by, function (v) { return nf(Math.round(v * 10) / 10); }) + '</div>' +
      '<div class="card"><h3>Encours total</h3><div class="kpi" style="border:0;padding:0"><b>' + fcfa(sum(S.inv.filter(function (i) { return i.st < 2; }), function (i) { return ttc(i.amt); })) + '</b><small class="neg">factures non soldées</small></div></div></div>' +
      '<div class="tw mt"><table><thead><tr><th>Client</th><th>Contact</th><th>Ville</th><th class="num">Dossiers</th><th class="num">Encours TTC</th></tr></thead><tbody>' +
      S.clients.map(function (c) { var n = S.dossiers.filter(function (d) { return d.c === c.id; }).length, en = sum(S.inv.filter(function (i) { return i.c === c.id && i.st < 2; }), function (i) { return ttc(i.amt); }); return '<tr><td class="ref">' + esc(c.name) + '</td><td>' + c.contact + '</td><td>' + c.city + '</td><td class="num">' + n + '</td><td class="num">' + fcfa(en) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  };

  M.portail = function () {
    var id = Number(filt.pc || 1), list = S.dossiers.filter(function (d) { return d.c === id; });
    return '<div class="bar"><b>Voir le portail tel que le voit :</b><select id="f-pc">' + S.clients.map(function (c) { return '<option value="' + c.id + '"' + (c.id === id ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></div>' +
      '<div class="pcards">' + list.map(function (d) { return '<div class="pc"><img src="assets/img/' + IMG[d.mode] + '" alt=""><div><b>' + d.ref + '</b> ' + stTag(d) + '<p>' + esc(d.what) + '</p><small>' + esc(d.from) + ' → ' + esc(d.to) + ' · ETA ' + d.eta + '</small><div class="prog" style="margin-top:12px"><i style="width:' + (d.step / 5 * 100) + '%"></i></div></div></div>'; }).join('') + '</div>' +
      '<p class="note">C\'est la même information que dans l\'outil de gestion, en lecture seule : le client suit ses expéditions et télécharge ses documents sans téléphoner. Les mises à jour faites par ART apparaissent ici instantanément.</p>';
  };

  M.bc = function () {
    var tab = filt.bc || 'clients';
    var head = '<div class="bar"><div class="chips" id="bc-tabs"><button data-bctab="clients"' + (tab === 'clients' ? ' class="is-on"' : '') + '>Commandes clients</button><button data-bctab="fournisseurs"' + (tab === 'fournisseurs' ? ' class="is-on"' : '') + '>Commandes fournisseurs</button></div><span class="sp"></span>';
    if (tab === 'clients') {
      var P = S.po;
      return '<div class="sub-kpis">' + kpi('Bons de commande reçus', P.length) + kpi('À valider', P.filter(function (p) { return p.st === 0; }).length, '', true) + kpi('En exécution', P.filter(function (p) { return p.st === 1; }).length) + kpi('Montant total (TTC)', fcfa(sum(P, function (p) { return ttc(sum(p.lines, function (l) { return l.q * l.pu; })); }))) + '</div>' +
        head + exportBtn('bc') + '<button class="btn" data-act="newpo">+ Enregistrer un bon de commande</button></div>' +
        '<div class="tw"><table><thead><tr><th>Bon de commande</th><th>Réf. client</th><th>Client</th><th>Devis</th><th>Date</th><th class="num">Total TTC</th><th>Statut</th><th>Actions</th></tr></thead><tbody>' +
        P.map(function (p) { return '<tr><td class="ref">' + p.no + '</td><td>' + esc(p.cref) + '</td><td>' + esc(cl(p.c).name) + '</td><td>' + (p.q || '—') + '</td><td>' + p.date + '</td><td class="num">' + fcfa(ttc(sum(p.lines, function (l) { return l.q * l.pu; }))) + '</td><td>' + tag(['Reçu', 'Validé', 'Exécuté'][p.st], ['', 't-warn', 't-ok'][p.st]) + '</td><td><div class="dacts"><button class="pdf" data-pdfx="bc|' + p.no + '">⬇ PDF</button>' + (p.st === 0 ? '<button class="btn btn--sm" data-pos="' + p.no + '">Valider → dossier</button>' : '') + (p.st === 1 ? '<button class="btn btn--ghost btn--sm" data-pos="' + p.no + '">Marquer exécuté</button>' : '') + '</div></td></tr>'; }).join('') + '</tbody></table></div>' +
        '<p class="note">Parcours : devis accepté → bon de commande du client → dossier de transit → bon de livraison → facture.</p>';
    }
    var B = S.spo;
    return '<div class="sub-kpis">' + kpi('Commandes émises', B.length) + kpi('En attente de confirmation', B.filter(function (b) { return b.st === 1; }).length, '', true) + kpi('Confirmées', B.filter(function (b) { return b.st === 2; }).length) + kpi('Engagé (HT)', fcfa(sum(B.filter(function (b) { return b.st < 3; }), function (b) { return b.amt; }))) + '</div>' +
      head + exportBtn('bf') + '<button class="btn" data-act="newspo">+ Nouvelle commande fournisseur</button></div>' +
      '<div class="tw"><table><thead><tr><th>Commande</th><th>Fournisseur</th><th>Dossier</th><th>Objet</th><th class="num">Montant HT</th><th>Statut</th><th>Actions</th></tr></thead><tbody>' +
      B.map(function (b) { return '<tr><td class="ref">' + b.no + '</td><td>' + esc(supn(b.s)) + '</td><td>' + b.doss + '</td><td>' + esc(b.obj) + '</td><td class="num">' + fcfa(b.amt) + '</td><td>' + tag(SPO_ST[b.st], b.st === 3 ? 't-ok' : b.st === 2 ? 't-info' : b.st === 1 ? 't-warn' : '') + '</td><td><div class="dacts"><button class="pdf" data-pdfx="bf|' + b.no + '">⬇ PDF</button>' + (b.st < 3 ? '<button class="btn btn--sm" data-sps="' + b.no + '">' + ['Envoyer', 'Confirmée', 'Marquer soldée'][b.st] + '</button>' : '') + '</div></td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="note">Commandes adressées aux armateurs, transporteurs, agents aériens et sociétés de levage qui travaillent avec ART.</p>';
  };

  M.documents = function () {
    var D = S.dossiers;
    return '<p class="note" style="margin:0 0 14px">Centre documentaire : générez en un clic les documents d\'un dossier, en PDF prêt à envoyer. Le bon de livraison est disponible dès l\'arrivée de la marchandise.</p>' +
      '<div class="tw"><table><thead><tr><th>Dossier</th><th>Client</th><th>Marchandise</th><th>Étape</th><th>Documents</th></tr></thead><tbody>' +
      D.map(function (d) { var inv = S.inv.filter(function (i) { return i.doss === d.ref; })[0]; return '<tr><td class="ref">' + d.ref + '</td><td>' + esc(cl(d.c).name) + '</td><td>' + esc(d.what) + '</td><td>' + stTag(d) + '</td><td><div class="dacts"><button class="pdf" data-pdfx="pf|' + d.ref + '">Proforma</button><button class="pdf" data-pdfx="pl|' + d.ref + '">Packing list</button>' + (d.step >= 3 ? '<button class="pdf" data-pdfx="bl|' + d.ref + '">Bon de livraison</button>' : '') + '<button class="pdf" data-pdfd="' + d.ref + '">Fiche dossier</button>' + (inv ? '<button class="pdf" data-pdfi="' + inv.no + '">Facture</button>' : '') + '</div></td></tr>'; }).join('') + '</tbody></table></div>';
  };

  M.fournisseurs = function () {
    return '<div class="sub-kpis">' + kpi('Fournisseurs & sous-traitants', S.sup.length) + kpi('Commandes en cours', S.spo.filter(function (b) { return b.st < 3; }).length) + kpi('Engagé (HT)', fcfa(sum(S.spo.filter(function (b) { return b.st < 3; }), function (b) { return b.amt; }))) + kpi('Payé / soldé', fcfa(sum(S.spo.filter(function (b) { return b.st === 3; }), function (b) { return b.amt; }))) + '</div>' +
      '<div class="tw"><table><thead><tr><th>Fournisseur</th><th>Activité</th><th>Ville</th><th class="num">Commandes</th><th class="num">Engagé HT</th></tr></thead><tbody>' +
      S.sup.map(function (s) { var l = S.spo.filter(function (b) { return b.s === s.id; }); return '<tr><td class="ref">' + esc(s.name) + '</td><td>' + s.type + '</td><td>' + s.city + '</td><td class="num">' + l.length + '</td><td class="num">' + fcfa(sum(l.filter(function (b) { return b.st < 3; }), function (b) { return b.amt; })) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  };

  M.offre = function () {
    var mods = [['Dossiers de transit', 'Ouverture, étapes, historique, documents, par client et par bureau.'], ['Devis', 'Création, envoi, suivi des réponses, PDF aux couleurs d\'ART, conversion en dossier.'], ['Bons de commande', 'Commandes clients et commandes fournisseurs, avec PDF.'], ['Factures', 'Facturation depuis le dossier, TVA, suivi des encaissements, PDF.'], ['Documents', 'Proforma, packing list, bon de livraison, fiche dossier en un clic.'], ['Douane', 'Suivi des déclarations et estimation des droits et taxes.'], ['Flotte & manutention', 'Camions, chariots, grues : affectation aux dossiers, maintenance.'], ['Entrepôt', 'Stock par emplacement, durées de séjour, alertes.'], ['Positions & travaux', 'Carte du matériel, des navires et des chantiers (GPS), planning des interventions.'], ['Fournisseurs', 'Armateurs, transporteurs, agents : commandes et engagements.'], ['Clients & portail', 'Fiches clients, encours, et portail de suivi pour vos clients.'], ['Tableau de bord', 'Courbes, indicateurs, alertes, parcours commercial.'], ['Exports', 'Excel/CSV des dossiers, factures, devis, stock.']];
    var opts = [['Alertes automatiques', 'E-mail ou WhatsApp au client à chaque étape : arrivée, douane, livraison.'], ['Signature électronique', 'Devis, bons de commande et bons de livraison signés sur téléphone.'], ['Géolocalisation du matériel', 'Balises GPS sur camions et engins, ou position envoyée depuis le téléphone du chauffeur.'], ['Application chauffeurs', 'Preuve de livraison avec photo et signature depuis le terrain.'], ['Connexion aux outils existants', 'Reprise des données de suivi actuelles (dont Elyse Web) selon faisabilité.'], ['Assistant intelligent', 'Réponses aux clients à partir de leurs dossiers, 24 h/24.'], ['Version anglaise', 'Interface et documents bilingues FR / EN pour les clients de Houston.'], ['Droits et rôles', 'Accès par bureau et par fonction : exploitation, douane, comptabilité, direction.'], ['Sauvegardes et sécurité', 'Hébergement sécurisé, sauvegardes quotidiennes, journal des actions.']];
    var card = function (x) { return '<div class="card"><h3 style="margin-bottom:6px">' + x[0] + '</h3><p style="color:var(--muted);font-size:.88rem">' + x[1] + '</p></div>'; };
    return '<div class="card" style="border-left:4px solid var(--acc)"><h3>Un outil de gestion complet pour ART</h3><p>De la demande de prix à l\'encaissement, une seule application pour les équipes de Port-Gentil et de Libreville : moins de ressaisies, des documents professionnels en un clic, un suivi clair pour la direction et pour les clients.</p></div>' +
      '<h3 class="ph">Modules inclus</h3><div class="grid g3 stack">' + mods.map(card).join('') + '</div>' +
      '<h3 class="ph">Options à la carte</h3><div class="grid g3 stack">' + opts.map(card).join('') + '</div>' +
      '<h3 class="ph">Mise en place</h3><div class="grid g4" style="grid-template-columns:repeat(4,1fr)">' + [['1 · Cadrage', 'Atelier avec les équipes, reprise de vos modèles de documents.'], ['2 · Paramétrage', 'Vos clients, vos tarifs types, votre logo sur tous les PDF.'], ['3 · Pilote', 'Un bureau et quelques clients volontaires.'], ['4 · Déploiement', 'Formation et ouverture à tous les utilisateurs.']].map(function (x) { return '<div class="card"><h3 style="margin-bottom:6px">' + x[0] + '</h3><p style="color:var(--muted);font-size:.88rem">' + x[1] + '</p></div>'; }).join('') + '</div>' +
      '<div class="card mt"><h3>À préciser avec ART</h3><p>Source des données de suivi, volume d\'utilisateurs, hébergement, modèles de documents existants, options retenues. Ces points fixent le calendrier et le budget : une proposition chiffrée est établie après un premier échange.</p></div>';
  };

  /* ---- Planning ---- */
  var fmtOff = function (o) { var d = new Date(Date.now() + o * 864e5); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2); };
  var dayOff = function (v) { var t = new Date(); t.setHours(0, 0, 0, 0); var d = new Date(v + 'T00:00:00'); return isNaN(d) ? 0 : Math.round((d - t) / 864e5); };
  function gantt(rows, from, n) {
    var cols = 'grid-template-columns:190px repeat(' + n + ',34px)', dn = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    var head = '<div class="gt gt--h" style="' + cols + '"><div class="gl"></div>' + Array.apply(null, Array(n)).map(function (_, i) { var d = new Date(Date.now() + (from + i) * 864e5); return '<div class="gd' + (from + i === 0 ? ' gd--now' : '') + (d.getDay() % 6 === 0 ? ' gd--we' : '') + '"><small>' + dn[d.getDay()] + '</small>' + d.getDate() + '</div>'; }).join('') + '</div>';
    var body = rows.map(function (r) {
      return '<div class="gt" style="' + cols + '"><div class="gl"><b>' + esc(r.label) + '</b><small>' + esc(r.sub || '') + '</small></div><div class="gbg" style="grid-column:2/' + (n + 2) + '"></div><div class="gnow" style="grid-column:' + (0 - from + 2) + '"></div>' +
        r.bars.map(function (b) { var s = Math.max(b.from, from), e = Math.min(b.to, from + n - 1); if (e < s) return ''; return '<div class="gbar ' + (b.cls || '') + '" style="grid-column:' + (s - from + 2) + '/span ' + (e - s + 1) + '" title="' + esc(b.title || b.text) + '">' + esc(b.text) + '</div>'; }).join('') + '</div>';
    }).join('');
    return '<div class="gantt">' + head + body + '</div>';
  }
  var callSt = function (c) { return c.etd < 0 ? 2 : c.eta > 0 ? 0 : 1; };
  M.planning = function () {
    var tab = filt.pl || 'escales';
    var tabs = '<div class="bar"><div class="chips"><button data-pltab="escales"' + (tab === 'escales' ? ' class="is-on"' : '') + '>Escales de navires</button><button data-pltab="materiel"' + (tab === 'materiel' ? ' class="is-on"' : '') + '>Matériel & chantiers</button></div><span class="sp"></span>';
    if (tab === 'escales') {
      var C = S.calls.slice().sort(function (a, b) { return a.eta - b.eta; });
      return '<div class="sub-kpis">' + kpi('Navires attendus', C.filter(function (c) { return callSt(c) === 0; }).length) + kpi('À quai', C.filter(function (c) { return callSt(c) === 1; }).length) + kpi('Partis (7 derniers jours)', C.filter(function (c) { return callSt(c) === 2; }).length) + kpi('Prochaine arrivée', (function () { var n = C.filter(function (c) { return c.eta > 0; })[0]; return n ? fmtOff(n.eta) : '—'; })()) + '</div>' +
        tabs + '<button class="btn" data-act="newcall">+ Annoncer une escale</button></div>' +
        '<div class="card"><h3>Planning des quais <small style="font-weight:400;color:var(--muted)">22 jours</small></h3>' + gantt(C.map(function (c) { return { label: c.ship.replace(' (démo)', ''), sub: c.port + ' · ' + c.berth, bars: [{ from: c.eta, to: c.etd, text: c.ref, cls: ['gbar--wait', 'gbar--on', 'gbar--done'][callSt(c)], title: c.ops }] }; }), -8, 22) + '</div>' +
        '<div class="tw mt"><table><thead><tr><th>Navire</th><th>Dossier</th><th>Port / quai</th><th>ETA</th><th>ETD</th><th>Opérations</th><th>Statut</th></tr></thead><tbody>' +
        C.map(function (c) { var st = callSt(c); return '<tr><td class="ref">' + esc(c.ship) + '</td><td>' + c.ref + '</td><td>' + c.port + ' · ' + c.berth + '</td><td>' + fmtOff(c.eta) + '</td><td>' + fmtOff(c.etd) + '</td><td>' + esc(c.ops) + '</td><td>' + tag(['Attendu', 'À quai', 'Parti'][st], ['t-warn', 't-acc', 't-ok'][st]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    }
    var rows = S.fleet.map(function (f) { return { label: f.id + ' · ' + f.name, sub: f.type + ' · ' + FLEET_ST[f.st], bars: S.jobs.filter(function (j) { return j.equip.indexOf(f.id) > -1; }).map(function (j) { return { from: j.d0, to: j.d0 + j.dur - 1, text: j.title, cls: ['gbar--wait', 'gbar--on', 'gbar--done'][j.st], title: j.id + ' · ' + SITES[j.site][0] }; }).concat(f.st === 2 ? [{ from: -4, to: 2, text: 'Maintenance', cls: 'gbar--bad' }] : []) }; });
    var free = S.jobs.filter(function (j) { return !j.equip.length; });
    if (free.length) rows.push({ label: 'À affecter', sub: 'Chantiers sans matériel', bars: free.map(function (j) { return { from: j.d0, to: j.d0 + j.dur - 1, text: j.title, cls: 'gbar--wait', title: j.id }; }) });
    return '<div class="sub-kpis">' + kpi('Chantiers planifiés', S.jobs.filter(function (j) { return j.st === 0; }).length) + kpi('En cours', S.jobs.filter(function (j) { return j.st === 1; }).length) + kpi('Terminés', S.jobs.filter(function (j) { return j.st === 2; }).length) + kpi('Matériel disponible', S.fleet.filter(function (f) { return f.st === 0; }).length) + '</div>' +
      tabs + '<button class="btn" data-act="newjob">+ Nouveau chantier</button></div>' +
      '<div class="card"><h3>Planning du matériel <small style="font-weight:400;color:var(--muted)">22 jours · orange : en cours · gris : planifié · vert : terminé</small></h3>' + gantt(rows, -6, 22) + '</div><p class="note">Les positions du matériel sont visibles sur la carte « Positions &amp; travaux ».</p>';
  };
  var EMO = { Camion: '🚛', Manutention: '🏗️', Levage: '🏗️', Léger: '🚙' };
  var JOB_ST = ['Planifié', 'En cours', 'Terminé'];
  var ago = function (f) { return f.st === 1 ? 'il y a < 1 min' : 'il y a 12 min'; };
  M.carte = function () {
    var fl = filt.cf || 'all', F = S.fleet, J = S.jobs;
    var chip = function (k, t) { return '<button data-cf="' + k + '"' + (fl === k ? ' class="is-on"' : '') + '>' + t + '</button>'; };
    var eq = F.map(function (f) { return '<div class="gi" data-geo="eq|' + f.id + '"><div><b>' + EMO[f.type] + ' ' + f.id + ' · ' + esc(f.name) + '</b><small>📍 ' + esc(f.pos.place) + ' · ' + (f.st === 1 ? Math.round(f.pos.sp) + ' km/h' : 'à l\'arrêt') + ' · ' + ago(f) + '</small></div>' + tag(FLEET_ST[f.st], f.st === 0 ? 't-ok' : f.st === 1 ? 't-acc' : 't-bad') + '</div>'; }).join('');
    var sh = S.ships.map(function (s) { return '<div class="gi" data-geo="sh|' + s.ref + '"><div><b>🚢 ' + s.ref + '</b><small>' + esc(s.name) + ' · ' + s.st + '</small></div>' + tag(s.sp ? s.sp + ' nds' : 'À quai', 't-info') + '</div>'; }).join('');
    var jb = J.map(function (j) { return '<div class="gi" data-geo="jb|' + j.id + '"><div><b>🛠 ' + j.id + ' · ' + esc(j.title) + '</b><small>📍 ' + SITES[j.site][0] + ' · ' + j.doss + (j.equip.length ? ' · ' + j.equip.join(', ') : ' · matériel à affecter') + '</small></div><div class="dacts">' + tag(JOB_ST[j.st], j.st === 1 ? 't-acc' : j.st === 2 ? 't-ok' : '') + (j.st === 0 ? '<button class="btn btn--sm" data-job="' + j.id + '|1">Démarrer</button>' : '') + (j.st === 1 ? '<button class="btn btn--ghost btn--sm" data-job="' + j.id + '|2">Terminer</button>' : '') + '</div></div>'; }).join('');
    return '<div class="sub-kpis">' + kpi('Matériel géolocalisé', F.length + ' / ' + F.length, 'signal actif') + kpi('En mission', F.filter(function (f) { return f.st === 1; }).length) + kpi('Chantiers en cours', J.filter(function (j) { return j.st === 1; }).length) + kpi('Chantiers planifiés', J.filter(function (j) { return j.st === 0; }).length) + '</div>' +
      '<div class="bar"><div class="chips">' + chip('all', 'Tout') + chip('eq', 'Matériel') + chip('sh', 'Navires') + chip('jb', 'Chantiers') + '</div><span class="sp"></span><button class="btn" data-act="newjob">+ Nouveau chantier</button></div>' +
      '<div class="geo"><div class="geo__map" id="map"></div><div class="geo__list">' + (fl === 'all' || fl === 'eq' ? '<h4>Matériel</h4>' + eq : '') + (fl === 'all' || fl === 'sh' ? '<h4>Navires</h4>' + sh : '') + (fl === 'all' || fl === 'jb' ? '<h4>Chantiers & travaux</h4>' + jb : '') + '</div></div>' +
      '<p class="note">Positions simulées pour la démonstration. En production : balises GPS sur les camions et engins, ou position envoyée depuis le téléphone du chauffeur.</p>';
  };

  /* ---- Carte (Leaflet) ---- */
  var map = null, mk = {}, sim = null;
  function destroyMap() { if (sim) { clearInterval(sim); sim = null; } if (map) { map.remove(); map = null; mk = {}; } }
  function pin(e, cls) { return L.divIcon({ className: 'pin ' + cls, html: '<span>' + e + '</span>', iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -16] }); }
  function popup(kind, id) {
    if (kind === 'eq') { var f = S.fleet.filter(function (x) { return x.id === id; })[0]; return '<b>' + f.id + ' · ' + esc(f.name) + '</b><br>' + FLEET_ST[f.st] + (f.doss ? ' · ' + f.doss : '') + '<br>📍 ' + esc(f.pos.place); }
    if (kind === 'sh') { var s = S.ships.filter(function (x) { return x.ref === id; })[0]; return '<b>' + s.ref + '</b><br>' + esc(s.name) + '<br>' + s.st; }
    var j = S.jobs.filter(function (x) { return x.id === id; })[0]; return '<b>' + j.id + ' · ' + esc(j.title) + '</b><br>' + JOB_ST[j.st] + ' · ' + j.doss + '<br>📍 ' + SITES[j.site][0] + (j.equip.length ? '<br>Matériel : ' + j.equip.join(', ') : '');
  }
  function initMap() {
    destroyMap(); var el = $('#map'); if (!el) return;
    if (!window.L) { el.innerHTML = '<div class="empty" style="padding:30px">Carte indisponible (connexion requise).</div>'; return; }
    var fl = filt.cf || 'all';
    map = L.map(el, { scrollWheelZoom: false }).setView([-0.15, 9.0], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 18 }).addTo(map);
    var pts = [];
    if (fl === 'all' || fl === 'eq') S.fleet.forEach(function (f) { var m = L.marker([f.pos.lat, f.pos.lon], { icon: pin(EMO[f.type], f.st === 1 ? 'pin--on' : f.st === 2 ? 'pin--bad' : '') }).addTo(map).bindPopup(popup('eq', f.id)); mk['eq|' + f.id] = m; pts.push([f.pos.lat, f.pos.lon]); });
    if (fl === 'all' || fl === 'sh') S.ships.forEach(function (s) { var m = L.marker([s.lat, s.lon], { icon: pin('🚢', 'pin--ship') }).addTo(map).bindPopup(popup('sh', s.ref)); mk['sh|' + s.ref] = m; pts.push([s.lat, s.lon]); });
    if (fl === 'all' || fl === 'jb') S.jobs.forEach(function (j) { if (j.st === 2) return; var m = L.marker([SITES[j.site][1], SITES[j.site][2]], { icon: pin('🛠', 'pin--job'), zIndexOffset: -100 }).addTo(map).bindPopup(popup('jb', j.id)); mk['jb|' + j.id] = m; pts.push([SITES[j.site][1], SITES[j.site][2]]); });
    if (pts.length > 1) map.fitBounds(pts, { padding: [30, 30], maxZoom: 9 });
    if (filt.focus && mk[filt.focus]) { var k = filt.focus; filt.focus = null; setTimeout(function () { if (map && mk[k]) { map.setView(mk[k].getLatLng(), 13); mk[k].openPopup(); } }, 200); }
    sim = setInterval(tick, 3500);
  }
  function tick() {
    var changed = false;
    S.fleet.forEach(function (f) { if (f.st !== 1) return; f.pos.lat += (Math.random() - .5) * 0.0012; f.pos.lon += (Math.random() - .5) * 0.0012; f.pos.sp = 12 + Math.random() * 30; if (mk['eq|' + f.id]) mk['eq|' + f.id].setLatLng([f.pos.lat, f.pos.lon]); changed = true; });
    S.ships.forEach(function (s) { if (s.sp && s.lon < 8.45) { s.lon += 0.006; s.lat -= 0.0006; if (mk['sh|' + s.ref]) mk['sh|' + s.ref].setLatLng([s.lat, s.lon]); changed = true; } });
    if (changed) save();
  }
  function focusGeo(key) { if (view !== 'carte') { filt.cf = 'all'; filt.focus = key; go('carte'); } else if (mk[key]) { map.setView(mk[key].getLatLng(), 13); mk[key].openPopup(); } }

  var TITLES = { dash: 'Tableau de bord', dossiers: 'Dossiers de transit', pipeline: 'Suivi des expéditions', planning: 'Planning', carte: 'Positions & travaux', devis: 'Devis', bc: 'Bons de commande', documents: 'Documents', fournisseurs: 'Fournisseurs', offre: 'Notre offre', factures: 'Factures', douane: 'Douane', flotte: 'Flotte & manutention', entrepot: 'Entrepôt', clients: 'Clients', portail: 'Portail client' };
  function render() {
    $('#content').innerHTML = M[view]();
    $('#title').textContent = TITLES[view];
    $$('#menu button,#bottom button[data-m]').forEach(function (b) { b.classList.toggle('is-on', b.dataset.m === view); });
    $('#more').classList.toggle('is-on', ['dash', 'dossiers', 'devis', 'factures'].indexOf(view) < 0);
    $('#back').classList.toggle('show', view !== 'dash');
    if (view === 'carte') initMap(); else destroyMap();
    $$('table').forEach(function (t) { var h = $$('th', t).map(function (x) { return x.textContent; }); $$('tbody tr', t).forEach(function (tr) { $$('td', tr).forEach(function (td, i) { if (h[i]) td.setAttribute('data-l', h[i]); }); }); });
    var q = $('#f-q'); if (q) q.addEventListener('input', function () { filt.q = q.value; var p = q.selectionStart; render(); var n = $('#f-q'); n.focus(); n.setSelectionRange(p, p); });
    var fm = $('#f-mode'); if (fm) fm.addEventListener('change', function () { filt.mode = fm.value; render(); });
    var fs = $('#f-step'); if (fs) fs.addEventListener('change', function () { filt.step = fs.value; render(); });
    var pc = $('#f-pc'); if (pc) pc.addEventListener('change', function () { filt.pc = pc.value; render(); });
    $$('[data-assign]').forEach(function (s) { s.addEventListener('change', function () { if (!s.value) return; var f = S.fleet.filter(function (x) { return x.id === s.dataset.assign; })[0]; f.st = 1; f.doss = s.value; logAdd(f.id + ' affecté à ' + s.value); save(); toast(f.id + ' affecté à ' + s.value); render(); }); });
  }
  function go(v, push) {
    view = v; closeAll(); $('#side').classList.remove('open');
    if (push !== false) { navs++; try { history.pushState({ v: v }, '', '#' + v); } catch (e) {} }
    render(); window.scrollTo(0, 0);
  }

  /* ---------- PDF ---------- */
  var logoData = null;
  (function () { var im = new Image(); im.onload = function () { try { var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0); logoData = { d: c.toDataURL('image/png'), r: im.naturalWidth / im.naturalHeight }; } catch (e) {} }; im.src = 'assets/img/logo.png'; })();
  function makePDF(o) {
    if (!window.jspdf) { toast('Génération PDF indisponible (connexion requise)'); return; }
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210, m = 16, y = 18;
    if (logoData) { var h = 22; doc.addImage(logoData.d, 'PNG', m, y - 4, h * logoData.r, h); }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(20, 24, 31); doc.text('Action Rapide Transit (ART)', W - m, y, { align: 'right' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(105, 115, 130);
    ['Rue Joséphine Dupré — BP 569, Port-Gentil', 'BP 9391, Libreville', 'Tél. +241 11 56 03 80 · +241 11 73 79 40', 'contactpog@artgabon.com · artgabon.com'].forEach(function (t, i) { doc.text(t, W - m, y + 5 + i * 4.3, { align: 'right' }); });
    y = 52; doc.setDrawColor(242, 106, 27); doc.setLineWidth(0.8); doc.line(m, y - 6, W - m, y - 6);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(20, 24, 31); doc.text(o.title, m, y + 4);
    doc.setFontSize(10); doc.setTextColor(242, 106, 27); doc.text('N° ' + o.no, m, y + 11);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 66, 76);
    var ry = y; o.meta.forEach(function (r) { doc.setTextColor(105, 115, 130); doc.text(r[0], W - m - 62, ry); doc.setTextColor(20, 24, 31); doc.text(String(r[1]), W - m, ry, { align: 'right' }); ry += 5.2; });
    y = Math.max(ry, y + 18) + 4;
    doc.setFillColor(245, 243, 240); doc.roundedRect(m, y, 88, 24, 2, 2, 'F');
    doc.setFontSize(8); doc.setTextColor(105, 115, 130); doc.text(o.partyLabel, m + 4, y + 6);
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 24, 31); doc.text(o.party, m + 4, y + 13);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(60, 66, 76); (o.partyLines || []).forEach(function (t, i) { doc.text(t, m + 4, y + 18.5 + i * 4.2); });
    y += 34;
    doc.setFillColor(242, 106, 27); doc.rect(m, y, W - 2 * m, 8, 'F'); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text('Désignation', m + 3, y + 5.4); doc.text('Qté', 128, y + 5.4, { align: 'right' }); if (o.noPrice) { doc.text('Observations', W - m - 3, y + 5.4, { align: 'right' }); } else { doc.text('Prix unitaire', 158, y + 5.4, { align: 'right' }); doc.text('Total HT', W - m - 3, y + 5.4, { align: 'right' }); }
    y += 8; doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 36, 46);
    o.lines.forEach(function (l, i) {
      if (i % 2) { doc.setFillColor(250, 249, 247); doc.rect(m, y, W - 2 * m, 8, 'F'); }
      var t = doc.splitTextToSize(l.d, 96)[0]; doc.text(t, m + 3, y + 5.4); doc.text(String(l.q), 128, y + 5.4, { align: 'right' }); if (o.noPrice) { doc.text(String(l.n || ''), W - m - 3, y + 5.4, { align: 'right' }); } else { doc.text(pdfn(l.pu), 158, y + 5.4, { align: 'right' }); doc.text(pdfn(l.q * l.pu), W - m - 3, y + 5.4, { align: 'right' }); } y += 8;
    });
    doc.setDrawColor(225, 228, 233); doc.setLineWidth(0.3); doc.line(m, y, W - m, y);
    var ht = sum(o.lines, function (l) { return l.q * l.pu; }), tv = Math.round(ht * TVA);
    y += 8; var row = function (a, b, bold) { doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(bold ? 12 : 10); doc.setTextColor(20, 24, 31); doc.text(a, 128, y, { align: 'right' }); doc.text(b, W - m - 3, y, { align: 'right' }); y += bold ? 8 : 6; };
    if (!o.noPrice) { row('Total HT', pdfn(ht) + ' FCFA'); row('TVA 18 %', pdfn(tv) + ' FCFA'); doc.setDrawColor(242, 106, 27); doc.setLineWidth(0.6); doc.line(98, y - 3.5, W - m, y - 3.5); y += 1; row('Total TTC', pdfn(ht + tv) + ' FCFA', true); }
    y += 8; doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(90, 98, 112);
    doc.splitTextToSize(o.notes, W - 2 * m).forEach(function (t) { doc.text(t, m, y); y += 4.6; });
    if (o.sign) { var y2 = Math.max(y + 10, 205); doc.setDrawColor(200, 205, 212); doc.setLineWidth(0.3); doc.rect(m, y2, 82, 34); doc.rect(W - m - 82, y2, 82, 34); doc.setFontSize(8.5); doc.setTextColor(105, 115, 130); doc.text(o.sign[0], m + 3, y2 + 5); doc.text(o.sign[1], W - m - 79, y2 + 5); doc.text('Nom, date et signature', m + 3, y2 + 31); doc.text('Nom, date et signature', W - m - 79, y2 + 31); }
    doc.setFontSize(7.5); doc.setTextColor(150, 157, 168); doc.text('Document de démonstration généré par l\'outil de gestion ART — données fictives, sans valeur contractuelle.', W / 2, 287, { align: 'center' });
    doc.save(o.file); toast('PDF téléchargé : ' + o.file);
  }
  function pdfInvoice(no) {
    var i = S.inv.filter(function (x) { return x.no === no; })[0], c = cl(i.c), d = dos(i.doss) || {};
    makePDF({ title: 'FACTURE', no: i.no, file: 'Facture-' + i.no + '.pdf', meta: [['Date', i.date + (i.date.length < 6 ? '/2026' : '')], ['Dossier', i.doss], ['Trajet', (d.from || '') + ' → ' + (d.to || '')], ['Échéance', '30 jours']], partyLabel: 'FACTURÉ À', party: c.name, partyLines: [c.contact, c.city + ', Gabon'], lines: invLines(i), notes: 'Règlement à 30 jours. Merci de rappeler la référence ' + i.no + ' lors du paiement.' });
  }
  function pdfQuote(no) {
    var q = S.quotes.filter(function (x) { return x.no === no; })[0], c = cl(q.c);
    makePDF({ title: 'DEVIS', no: q.no, file: 'Devis-' + q.no + '.pdf', meta: [['Date', q.date + (q.date.length < 6 ? '/2026' : '')], ['Validité', '30 jours'], ['Trajet', q.from + ' → ' + q.to], ['Mode', q.mode]], partyLabel: 'ADRESSÉ À', party: c.name, partyLines: [c.contact, c.city + ', Gabon'], lines: q.lines, notes: 'Objet : ' + q.obj + '. Devis valable 30 jours. Les droits et taxes de douane, ainsi que les frais de stationnement éventuels, ne sont pas inclus sauf mention contraire.' });
  }
  function pdfDossier(ref) {
    var d = dos(ref), c = cl(d.c);
    makePDF({ title: 'FICHE DOSSIER', no: d.ref, file: 'Dossier-' + d.ref + '.pdf', meta: [['Mode', d.mode], ['Trajet', d.from + ' → ' + d.to], ['Poids', d.w], ['Statut', STEPS[d.step]]], partyLabel: 'CLIENT', party: c.name, partyLines: [c.contact, c.city + ', Gabon'], lines: [{ d: d.what, q: 1, pu: d.val }], notes: 'Historique : ' + d.ev.join(' | ') });
  }
  function pdfx(kind, ref) {
    var d, c;
    if (kind === 'bc') { var p = S.po.filter(function (x) { return x.no === ref; })[0]; c = cl(p.c); return makePDF({ title: 'BON DE COMMANDE', no: p.no, file: 'Bon-de-commande-' + p.no + '.pdf', meta: [['Date', p.date + '/2026'], ['Réf. client', p.cref], ['Devis', p.q || '—'], ['Dossier', p.doss || 'à créer']], partyLabel: 'CLIENT', party: c.name, partyLines: [c.contact, c.city + ', Gabon'], lines: p.lines, notes: 'Bon de commande client enregistré par ART. Conditions : selon devis accepté, paiement à 30 jours.' }); }
    if (kind === 'bf') { var b = S.spo.filter(function (x) { return x.no === ref; })[0], s = S.sup.filter(function (x) { return x.id === b.s; })[0]; return makePDF({ title: 'COMMANDE FOURNISSEUR', no: b.no, file: 'Commande-fournisseur-' + b.no + '.pdf', meta: [['Date', b.date + '/2026'], ['Dossier', b.doss], ['Activité', s.type], ['Statut', SPO_ST[b.st]]], partyLabel: 'FOURNISSEUR', party: s.name, partyLines: [s.type, s.city], lines: [{ d: b.obj, q: 1, pu: b.amt }], notes: 'Merci de confirmer la prise en charge et les délais par retour d\'e-mail en rappelant la référence ' + b.no + '.' }); }
    d = dos(ref); c = cl(d.c);
    var common = { party: c.name, partyLines: [c.contact, c.city + ', Gabon'], meta: [['Dossier', d.ref], ['Trajet', d.from + ' → ' + d.to], ['Mode', d.mode], ['Date', today()]] };
    if (kind === 'bl') return makePDF(Object.assign({ title: 'BON DE LIVRAISON', no: 'BL-26-' + d.ref.slice(-4), file: 'Bon-de-livraison-' + d.ref + '.pdf', partyLabel: 'LIVRÉ À', noPrice: true, sign: ['Remis par ART', 'Reçu par le client'], lines: [{ d: d.what, q: 1, n: d.w }, { d: 'Colis reçus en bon état apparent', q: 1, n: 'Réserves : ______' }], notes: 'Le client reconnaît avoir reçu la marchandise ci-dessus. Toute réserve doit être notée à la livraison.' }, common));
    if (kind === 'pl') return makePDF(Object.assign({ title: 'PACKING LIST', no: 'PL-26-' + d.ref.slice(-4), file: 'Packing-list-' + d.ref + '.pdf', partyLabel: 'DESTINATAIRE', noPrice: true, lines: [{ d: d.what, q: 1, n: 'Poids : ' + d.w }], notes: 'Liste de colisage établie pour le dossier ' + d.ref + '. Détail des colis à compléter à la réception.' }, common));
    if (kind === 'pf') return makePDF(Object.assign({ title: 'FACTURE PROFORMA', no: 'PF-26-' + d.ref.slice(-4), file: 'Proforma-' + d.ref + '.pdf', partyLabel: 'ADRESSÉE À', lines: invLines({ doss: d.ref, amt: Math.round(d.val * 0.55) }), notes: 'Document non comptable, valable pour les formalités de douane et la demande de règlement préalable.' }, common));
  }
  function csv(what) {
    var rows, head;
    if (what === 'dossiers') { head = ['Référence', 'Client', 'Marchandise', 'Origine', 'Destination', 'Mode', 'Étape', 'ETA', 'Poids']; rows = S.dossiers.map(function (d) { return [d.ref, cl(d.c).name, d.what, d.from, d.to, d.mode, STEPS[d.step], d.eta, d.w]; }); }
    if (what === 'factures') { head = ['Facture', 'Dossier', 'Client', 'Date', 'HT', 'TTC', 'Statut']; rows = S.inv.map(function (i) { return [i.no, i.doss, cl(i.c).name, i.date, i.amt, ttc(i.amt), INV_ST[i.st]]; }); }
    if (what === 'devis') { head = ['Devis', 'Client', 'Objet', 'Date', 'HT', 'TTC', 'Statut']; rows = S.quotes.map(function (q) { return [q.no, cl(q.c).name, q.obj, q.date, qHT(q), ttc(qHT(q)), QUO_ST[q.st]]; }); }
    if (what === 'stock') { head = ['Dossier', 'Désignation', 'Emplacement', 'Quantité', 'Jours']; rows = S.stock.map(function (s) { return [s.doss, s.what, s.loc, s.qty, s.days]; }); }
    if (what === 'bc') { head = ['Bon de commande', 'Réf. client', 'Client', 'Devis', 'Date', 'TTC', 'Statut']; rows = S.po.map(function (p) { return [p.no, p.cref, cl(p.c).name, p.q, p.date, ttc(sum(p.lines, function (l) { return l.q * l.pu; })), ['Reçu', 'Validé', 'Exécuté'][p.st]]; }); }
    if (what === 'bf') { head = ['Commande', 'Fournisseur', 'Dossier', 'Objet', 'Montant HT', 'Statut']; rows = S.spo.map(function (b) { return [b.no, supn(b.s), b.doss, b.obj, b.amt, SPO_ST[b.st]]; }); }
    var text = '﻿' + [head].concat(rows).map(function (r) { return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' })); a.download = 'ART-' + what + '.csv'; a.click(); toast('Export téléchargé : ART-' + what + '.csv');
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
    $('#drawer-panel').innerHTML = '<div class="dh"><div><button class="btn btn--ghost btn--sm" data-close style="margin-bottom:10px">← Retour</button><h2>' + d.ref + '</h2>' + stTag(d) + '</div><button class="x" data-close aria-label="Fermer">×</button></div>' +
      '<div class="kv"><div><small>Client</small>' + esc(cl(d.c).name) + '</div><div><small>Mode</small>' + MODE[d.mode] + ' ' + d.mode + '</div><div><small>Marchandise</small>' + esc(d.what) + '</div><div><small>Poids</small>' + d.w + '</div><div><small>Trajet</small>' + esc(d.from) + ' → ' + esc(d.to) + '</div><div><small>ETA</small>' + d.eta + '</div></div>' +
      '<div class="dsec">Avancement</div><ul class="stepper">' + STEPS.map(function (s, i) { return '<li class="' + (i < d.step ? 'done' : i === d.step ? 'now' : 'todo') + '"><i></i>' + s + '</li>'; }).join('') + '</ul>' +
      '<div class="dsec">Documents</div><ul class="dl">' + docsOf(d).map(function (x) { return '<li><span>' + x[0] + '</span>' + (x[1] ? tag('Disponible', 't-ok') : tag('En attente', '')) + '</li>'; }).join('') +
      '<li><span>Fiche dossier (PDF)</span><button class="pdf" data-pdfd="' + d.ref + '">⬇ PDF</button></li><li><span>Facture proforma</span><button class="pdf" data-pdfx="pf|' + d.ref + '">⬇ PDF</button></li><li><span>Packing list</span><button class="pdf" data-pdfx="pl|' + d.ref + '">⬇ PDF</button></li>' + (d.step >= 3 ? '<li><span>Bon de livraison</span><button class="pdf" data-pdfx="bl|' + d.ref + '">⬇ PDF</button></li>' : '') + (inv ? '<li><span>Facture ' + inv.no + ' · ' + INV_ST[inv.st] + '</span><button class="pdf" data-pdfi="' + inv.no + '">⬇ PDF</button></li>' : '') + '</ul>' +
      '<div class="dsec">Historique</div><ul class="dl">' + d.ev.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>' +
      '<div class="dact">' + (d.step < 5 ? '<button class="btn" data-adv="' + d.ref + '">Avancer l\'étape →</button>' : '') + (inv ? '' : '<button class="btn btn--ghost" data-mkinv="' + d.ref + '">Créer la facture</button>') + '</div>';
    $('#drawer').hidden = false;
  }
  function closeAll() { $('#drawer').hidden = true; $('#modal').hidden = true; }

  /* ---------- Actions ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open],[data-adv],[data-cu],[data-free],[data-out],[data-inv],[data-mkinv],[data-act],[data-close],[data-m],[data-pltab],[data-geo],[data-job],[data-cf],[data-pdfx],[data-bctab],[data-pos],[data-sps],[data-pdfi],[data-pdfq],[data-pdfd],[data-csv],[data-qs]');
    if (!t) return;
    var D = t.dataset;
    if (D.close !== undefined) return closeAll();
    if (D.m) return go(D.m);
    if (D.open) return openDossier(D.open);
    if (D.pdfi) return pdfInvoice(D.pdfi);
    if (D.pdfq) return pdfQuote(D.pdfq);
    if (D.pdfd) return pdfDossier(D.pdfd);
    if (D.csv) return csv(D.csv);
    if (D.adv) {
      var d = dos(D.adv); if (d.step < 5) { d.step++; d.ev.unshift(short() + ' — ' + STEPS[d.step]); if (d.step === 5) d.eta = 'Livré'; if (d.step === 4 && d.cu === 0) d.cu = 1; logAdd(d.ref + ' : ' + STEPS[d.step]); save(); toast(d.ref + ' → ' + STEPS[d.step]); openDossier(d.ref); render(); }
      return;
    }
    if (D.cu) { var x = dos(D.cu); if (x.cu < 3) { x.cu++; logAdd(x.ref + ' : déclaration ' + CUSTOMS[x.cu].toLowerCase()); save(); toast(x.ref + ' — ' + CUSTOMS[x.cu]); render(); } return; }
    if (D.free) { var f = S.fleet.filter(function (v) { return v.id === D.free; })[0]; f.st = 0; f.doss = ''; save(); render(); return; }
    if (D.out) { S.stock = S.stock.filter(function (s) { return String(s.id) !== D.out; }); save(); toast('Sortie de stock enregistrée'); render(); return; }
    if (D.inv) { var i = S.inv.filter(function (v) { return v.no === D.inv; })[0]; i.st++; logAdd('Facture ' + i.no + ' : ' + INV_ST[i.st].toLowerCase()); save(); toast('Facture ' + i.no + ' — ' + INV_ST[i.st]); render(); return; }
    if (D.mkinv) {
      var dd = dos(D.mkinv); var no = 'F-26-0' + (188 + S.inv.length - 3);
      S.inv.unshift({ no: no, doss: dd.ref, c: dd.c, amt: Math.round(dd.val * 0.55), st: 0, date: short() }); logAdd('Facture ' + no + ' créée pour ' + dd.ref); save(); toast('Facture ' + no + ' créée (brouillon)'); openDossier(dd.ref); render(); return;
    }
    if (D.qs) {
      var p = D.qs.split('|'), q = S.quotes.filter(function (v) { return v.no === p[0]; })[0]; q.st = Number(p[1]); logAdd('Devis ' + q.no + ' : ' + QUO_ST[q.st].toLowerCase());
      if (q.st === 2) { var ref = 'ART-26-0' + (++S.seq); S.dossiers.unshift({ ref: ref, c: q.c, what: q.obj.split(' — ')[0], from: q.from, to: q.to, mode: q.mode, step: 0, eta: '—', w: '—', val: qHT(q), cu: 0, ev: [short() + ' — Dossier ouvert depuis le devis ' + q.no] }); logAdd('Dossier ' + ref + ' ouvert depuis ' + q.no); toast('Devis accepté — dossier ' + ref + ' créé'); } else toast('Devis ' + q.no + ' — ' + QUO_ST[q.st]);
      save(); render(); return;
    }
    if (D.pdfx) { var px = D.pdfx.split('|'); return pdfx(px[0], px[1]); }
    if (D.pltab) { filt.pl = D.pltab; return render(); }
    if (D.act === 'newcall') return newCall();
    if (D.geo) return focusGeo(D.geo);
    if (D.cf) { filt.cf = D.cf; return render(); }
    if (D.job) {
      var jp = D.job.split('|'), jo = S.jobs.filter(function (v) { return v.id === jp[0]; })[0], si = SITES[jo.site]; jo.st = Number(jp[1]);
      jo.equip.forEach(function (id) { var f = S.fleet.filter(function (v) { return v.id === id; })[0]; if (!f) return; if (jo.st === 1) { f.st = 1; f.doss = jo.doss; f.pos = { lat: si[1] + (Math.random() - .5) * 0.0008, lon: si[2] + (Math.random() - .5) * 0.0008, place: si[0], sp: 0 }; } else { f.st = 0; f.doss = ''; } });
      logAdd('Chantier ' + jo.id + ' : ' + JOB_ST[jo.st].toLowerCase()); save(); toast(jo.id + ' — ' + JOB_ST[jo.st]); render(); return;
    }
    if (D.act === 'newjob') return newJob();
    if (D.bctab) { filt.bc = D.bctab; return render(); }
    if (D.pos) {
      var po = S.po.filter(function (v) { return v.no === D.pos; })[0];
      if (po.st === 0) {
        po.st = 1;
        if (!po.doss) { var qq = S.quotes.filter(function (v) { return v.no === po.q; })[0] || {}; var rf = 'ART-26-0' + (++S.seq); S.dossiers.unshift({ ref: rf, c: po.c, what: (qq.obj || po.lines[0].d).split(' — ')[0], from: qq.from || '—', to: qq.to || '—', mode: qq.mode || 'Maritime', step: 0, eta: '—', w: '—', val: sum(po.lines, function (l) { return l.q * l.pu; }), cu: 0, ev: [short() + ' — Dossier ouvert depuis ' + po.no] }); po.doss = rf; logAdd('Dossier ' + rf + ' ouvert depuis ' + po.no); toast(po.no + ' validé — dossier ' + rf + ' créé'); } else toast(po.no + ' validé');
      } else if (po.st === 1) { po.st = 2; toast(po.no + ' — exécuté'); }
      save(); render(); return;
    }
    if (D.sps) { var sp = S.spo.filter(function (v) { return v.no === D.sps; })[0]; sp.st++; logAdd('Commande ' + sp.no + ' : ' + SPO_ST[sp.st].toLowerCase()); save(); toast(sp.no + ' — ' + SPO_ST[sp.st]); render(); return; }
    if (D.act === 'newpo') return newPo();
    if (D.act === 'newspo') return newSpo();
    if (D.act === 'new') return newDossier();
    if (D.act === 'newstock') return newStock();
    if (D.act === 'newquote') return newQuote();
  });
  function modal(html, onSubmit) { var f = $('#modal-form'); f.innerHTML = html; $('#modal').hidden = false; f.onsubmit = function (e) { e.preventDefault(); onSubmit(new FormData(f)); closeAll(); }; }
  var cancel = '<div class="full"><button class="btn" type="submit">Enregistrer</button> <button class="btn btn--ghost" type="button" data-close>← Annuler</button></div>';
  function newDossier() {
    modal('<h3>Nouveau dossier de transit</h3><label class="full">Client<select name="c">' + S.clients.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') + '</select></label>' +
      '<label>Mode<select name="mode"><option>Maritime</option><option>Aérien</option><option>Routier</option></select></label><label>Poids estimé<input name="w" placeholder="Ex. 12 t"></label>' +
      '<label>Origine<input name="from" required placeholder="Houston, USA"></label><label>Destination<input name="to" required placeholder="Port-Gentil"></label>' +
      '<label class="full">Marchandise<input name="what" required placeholder="Ex. équipements de forage"></label>' + cancel, function (fd) {
        var ref = 'ART-26-0' + (++S.seq);
        S.dossiers.unshift({ ref: ref, c: Number(fd.get('c')), what: fd.get('what'), from: fd.get('from'), to: fd.get('to'), mode: fd.get('mode'), step: 0, eta: '—', w: fd.get('w') || '—', val: 2500000, cu: 0, ev: [short() + ' — Dossier ouvert'] });
        logAdd('Dossier ' + ref + ' ouvert'); save(); toast('Dossier ' + ref + ' créé'); render(); openDossier(ref);
      });
  }
  function newQuote() {
    modal('<h3>Nouveau devis</h3><label class="full">Client<select name="c">' + S.clients.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') + '</select></label>' +
      '<label>Mode<select name="mode"><option>Maritime</option><option>Aérien</option><option>Routier</option></select></label><label>Objet<input name="obj" required placeholder="Ex. Import tubes"></label>' +
      '<label>Origine<input name="from" required></label><label>Destination<input name="to" required></label>' +
      '<div class="lines"><b style="font-size:.82rem">Prestations (prix unitaire en FCFA, HT)</b>' + [1, 2, 3].map(function (n) { return '<div class="ln"><input name="d' + n + '" placeholder="Désignation ' + n + (n === 1 ? ' (ex. Fret maritime)' : '') + '"' + (n === 1 ? ' required' : '') + '><input name="q' + n + '" type="number" min="1" value="1"><input name="p' + n + '" type="number" min="0" placeholder="Prix HT"' + (n === 1 ? ' required' : '') + '></div>'; }).join('') + '</div>' + cancel, function (fd) {
        var lines = []; [1, 2, 3].forEach(function (n) { if (fd.get('d' + n) && Number(fd.get('p' + n)) > 0) lines.push({ d: fd.get('d' + n), q: Number(fd.get('q' + n)) || 1, pu: Number(fd.get('p' + n)) }); });
        var no = 'D-26-' + ('0000' + (++S.qseq)).slice(-4);
        S.quotes.unshift({ no: no, c: Number(fd.get('c')), obj: fd.get('obj') + ' — ' + fd.get('from') + ' → ' + fd.get('to'), mode: fd.get('mode'), from: fd.get('from'), to: fd.get('to'), lines: lines, st: 0, date: short() });
        logAdd('Devis ' + no + ' créé'); save(); toast('Devis ' + no + ' créé — téléchargez le PDF'); render();
      });
  }
  function newCall() {
    modal('<h3>Annoncer une escale</h3><label class="full">Navire<input name="ship" required placeholder="Nom du navire"></label>' +
      '<label>Port<select name="port"><option>Port-Gentil</option><option>Owendo</option><option>Cap Lopez</option></select></label><label>Quai<input name="berth" value="Quai 1"></label>' +
      '<label>ETA<input name="eta" type="date" required></label><label>ETD<input name="etd" type="date" required></label>' +
      '<label>Dossier<select name="ref">' + S.dossiers.map(function (d) { return '<option>' + d.ref + '</option>'; }).join('') + '</select></label><label>Opérations<input name="ops" placeholder="Déchargement…"></label>' + cancel, function (fd) {
        var a = dayOff(fd.get('eta')), b = Math.max(a, dayOff(fd.get('etd')));
        S.calls.push({ ship: fd.get('ship'), ref: fd.get('ref'), port: fd.get('port'), berth: fd.get('berth'), eta: a, etd: b, ops: fd.get('ops') || '—' }); logAdd('Escale annoncée : ' + fd.get('ship')); save(); toast('Escale enregistrée'); render();
      });
  }
  function newJob() {
    modal('<h3>Nouveau chantier / intervention</h3><label class="full">Intitulé<input name="title" required placeholder="Ex. Levage de la structure acier"></label>' +
      '<label>Lieu<select name="site">' + SITES.map(function (s, i) { return '<option value="' + i + '">' + s[0] + '</option>'; }).join('') + '</select></label><label>Dossier<select name="doss">' + S.dossiers.map(function (d) { return '<option>' + d.ref + '</option>'; }).join('') + '</select></label>' +
      '<label>Début<input name="d0" type="date" required></label><label>Durée (jours)<input name="dur" type="number" min="1" value="2"></label><label class="full">Matériel à affecter<select name="eq"><option value="">À affecter plus tard</option>' + S.fleet.filter(function (f) { return f.st === 0; }).map(function (f) { return '<option value="' + f.id + '">' + f.id + ' — ' + esc(f.name) + '</option>'; }).join('') + '</select></label>' + cancel, function (fd) {
        var id = 'TR-0' + (++S.jseq); S.jobs.unshift({ id: id, title: fd.get('title'), site: Number(fd.get('site')), doss: fd.get('doss'), equip: fd.get('eq') ? [fd.get('eq')] : [], st: 0, d0: dayOff(fd.get('d0')), dur: Number(fd.get('dur')) || 1 }); logAdd('Chantier ' + id + ' planifié'); save(); toast(id + ' planifié'); render();
      });
  }
  function newPo() {
    modal('<h3>Enregistrer un bon de commande client</h3><label class="full">Client<select name="c">' + S.clients.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') + '</select></label>' +
      '<label>Référence du client<input name="cref" required placeholder="Ex. PO-2210"></label><label>Devis lié<select name="q"><option value="">Aucun</option>' + S.quotes.map(function (q) { return '<option>' + q.no + '</option>'; }).join('') + '</select></label>' +
      '<div class="lines"><b style="font-size:.82rem">Prestations commandées (prix HT en FCFA)</b>' + [1, 2].map(function (n) { return '<div class="ln"><input name="d' + n + '" placeholder="Désignation ' + n + '"' + (n === 1 ? ' required' : '') + '><input name="q' + n + '" type="number" min="1" value="1"><input name="p' + n + '" type="number" min="0" placeholder="Prix HT"' + (n === 1 ? ' required' : '') + '></div>'; }).join('') + '</div>' + cancel, function (fd) {
        var lines = []; [1, 2].forEach(function (n) { if (fd.get('d' + n) && Number(fd.get('p' + n)) > 0) lines.push({ d: fd.get('d' + n), q: Number(fd.get('q' + n)) || 1, pu: Number(fd.get('p' + n)) }); });
        var no = 'BC-26-' + ('0000' + (++S.pseq)).slice(-4);
        S.po.unshift({ no: no, c: Number(fd.get('c')), cref: fd.get('cref'), q: fd.get('q'), doss: '', lines: lines, st: 0, date: short() }); logAdd('Bon de commande ' + no + ' enregistré'); save(); toast(no + ' enregistré'); render();
      });
  }
  function newSpo() {
    modal('<h3>Nouvelle commande fournisseur</h3><label class="full">Fournisseur<select name="s">' + S.sup.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + ' — ' + s.type + '</option>'; }).join('') + '</select></label>' +
      '<label>Dossier<select name="doss">' + S.dossiers.map(function (d) { return '<option>' + d.ref + '</option>'; }).join('') + '</select></label><label>Montant HT (FCFA)<input name="amt" type="number" min="0" required></label><label class="full">Objet<input name="obj" required placeholder="Ex. Fret maritime Houston → Port-Gentil"></label>' + cancel, function (fd) {
        var no = 'BF-26-' + ('0000' + (++S.sseq)).slice(-4);
        S.spo.unshift({ no: no, s: Number(fd.get('s')), doss: fd.get('doss'), obj: fd.get('obj'), amt: Number(fd.get('amt')) || 0, st: 0, date: short() }); logAdd('Commande fournisseur ' + no + ' créée'); save(); toast(no + ' créée'); render();
      });
  }
  function newStock() {
    modal('<h3>Entrée en stock</h3><label class="full">Dossier<select name="doss">' + S.dossiers.map(function (d) { return '<option>' + d.ref + '</option>'; }).join('') + '</select></label>' +
      '<label class="full">Désignation<input name="what" required></label><label>Emplacement<input name="loc" value="Hangar A · A-20"></label><label>Quantité<input name="qty" type="number" min="1" value="1"></label>' + cancel, function (fd) {
        S.stock.unshift({ id: Date.now(), doss: fd.get('doss'), what: fd.get('what'), loc: fd.get('loc'), qty: Number(fd.get('qty')) || 1, days: 0 }); save(); toast('Entrée en stock enregistrée'); render();
      });
  }

  $('#reset').addEventListener('click', function () { S = clone(SEED); save(); closeAll(); toast('Démo réinitialisée'); render(); });
  $('#menu-btn').addEventListener('click', function () { $('#side').classList.toggle('open'); });
  $('#more').addEventListener('click', function () { $('#side').classList.add('open'); });
  $('#side-bg').addEventListener('click', function () { $('#side').classList.remove('open'); });
  $('#back').addEventListener('click', function () { if (!$('#drawer').hidden || !$('#modal').hidden) return closeAll(); if (navs > 0) { navs--; history.back(); } else go('dash'); });
  window.addEventListener('popstate', function (e) { closeAll(); view = (e.state && e.state.v) || (location.hash && M[location.hash.slice(1)] ? location.hash.slice(1) : 'dash'); render(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  if (location.hash && M[location.hash.slice(1)]) view = location.hash.slice(1);
  try { history.replaceState({ v: view }, '', '#' + view); } catch (e) {}
  render();
})();
