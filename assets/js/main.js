(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var STORE = 'art-connect-demo-v1';

  /* ---------- Menu mobile ---------- */
  var nav = $('#nav'), burger = $('#burger');
  burger.addEventListener('click', function () {
    var o = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- Apparition au défilement ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  $$('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  /* ---------- Visionneuse photos ---------- */
  $$('.g').forEach(function (g) {
    g.addEventListener('click', function () {
      var lb = document.createElement('div'); lb.className = 'lb';
      lb.innerHTML = '<img alt="">'; $('img', lb).src = $('img', g).src;
      lb.addEventListener('click', function () { lb.remove(); });
      document.body.appendChild(lb);
    });
  });

  /* ---------- Données de démonstration (fictives) ---------- */
  var STEPS = ['Dossier ouvert', 'Chargement au départ', 'En transit', 'Arrivée au port / à l\'aéroport', 'Dédouanement', 'Livré'];
  var BADGE = ['Dossier ouvert', 'Au départ', 'En transit', 'Arrivé', 'En douane', 'Livré'];
  var ICON = { Maritime: '🚢', Aérien: '✈️', Routier: '🚚' };
  var SEED = [
    { ref: 'ART-26-0412', client: 'Société Démo Pétrole', what: 'Tubes de forage — 42 colis', from: 'Houston, USA', to: 'Port-Gentil', mode: 'Maritime', step: 2, eta: '+9 jours', ev: ['02/10 — Navire parti de Houston', '28/09 — Chargement terminé, scellés posés', '25/09 — Dossier ouvert, documents reçus'] },
    { ref: 'ART-26-0418', client: 'Société Démo Pétrole', what: 'Pièces de rechange pompes', from: 'Rotterdam, Pays-Bas', to: 'Libreville', mode: 'Aérien', step: 4, eta: '+2 jours', ev: ['04/10 — Déclaration déposée en douane', '03/10 — Arrivée à Libreville', '02/10 — Vol confirmé'] },
    { ref: 'ART-26-0397', client: 'Société Démo Pétrole', what: 'Conteneur 40\' — matériel de base vie', from: 'Anvers, Belgique', to: 'Port-Gentil', mode: 'Maritime', step: 5, eta: 'Livré', ev: ['29/09 — Livré sur site, bon de livraison signé', '27/09 — Sortie de port', '26/09 — Dédouanement terminé'] },
    { ref: 'ART-26-0421', client: 'Société Démo Pétrole', what: 'Skid hors gabarit — 14 t', from: 'Libreville', to: 'Port-Gentil', mode: 'Routier', step: 1, eta: '+4 jours', ev: ['04/10 — Chargement en cours', '03/10 — Plan de levage validé'] },
    { ref: 'ART-26-0425', client: 'Énergie Atlantique (démo)', what: 'Équipements électriques', from: 'Houston, USA', to: 'Libreville', mode: 'Aérien', step: 2, eta: '+3 jours', ev: ['04/10 — Vol en cours', '03/10 — Chargement terminé'] },
    { ref: 'ART-26-0430', client: 'Offshore Services (démo)', what: 'Structure acier — 9 t', from: 'Port-Gentil', to: 'Plateforme offshore', mode: 'Maritime', step: 0, eta: '+7 jours', ev: ['05/10 — Dossier ouvert'] }
  ];
  var CLIENT = 'Société Démo Pétrole';
  var state;
  function load() { try { var s = JSON.parse(localStorage.getItem(STORE)); if (s && s.length === SEED.length) return s; } catch (e) {} return JSON.parse(JSON.stringify(SEED)); }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  state = load();

  function badge(s) { return '<span class="badge b-' + s.step + '">' + BADGE[s.step] + '</span>'; }
  function mine() { return state.filter(function (s) { return s.client === CLIENT; }); }
  function kpiHTML(list, labels) {
    var transit = list.filter(function (s) { return s.step > 0 && s.step < 5; }).length;
    var customs = list.filter(function (s) { return s.step === 4; }).length;
    var done = list.filter(function (s) { return s.step === 5; }).length;
    return '<div class="kpi kpi--accent"><b>' + list.length + '</b><span>' + labels[0] + '</span></div>' +
      '<div class="kpi"><b>' + transit + '</b><span>' + labels[1] + '</span></div>' +
      '<div class="kpi"><b>' + customs + '</b><span>' + labels[2] + '</span></div>' +
      '<div class="kpi"><b>' + done + '</b><span>' + labels[3] + '</span></div>';
  }

  function render() {
    var list = mine();
    $('#kpis').innerHTML = kpiHTML(list, ['Expéditions', 'En cours', 'En douane', 'Livrées']);
    $('#ship-table tbody').innerHTML = list.map(function (s) {
      return '<tr><td class="ref">' + s.ref + '</td><td>' + s.what + '</td><td>' + s.from + ' → ' + s.to + '</td><td>' + ICON[s.mode] + ' ' + s.mode + '</td><td>' + badge(s) + '</td><td><button class="linkbtn" data-track="' + s.ref + '">Suivre</button></td></tr>';
    }).join('');
    $('#refs').innerHTML = list.map(function (s) { return '<option value="' + s.ref + '">'; }).join('');
    $('#kpis-staff').innerHTML = kpiHTML(state, ['Dossiers ouverts', 'En cours', 'En douane', 'Livrés']);
    var f = $('#filters .is-on'); var filt = f ? f.dataset.f : 'all';
    $('#filters').innerHTML = [['all', 'Tous'], ['0-1', 'Au départ'], ['2', 'En transit'], ['3-4', 'Arrivée / douane'], ['5', 'Livrés']].map(function (x) {
      return '<button data-f="' + x[0] + '"' + (x[0] === filt ? ' class="is-on"' : '') + '>' + x[1] + '</button>';
    }).join('');
    var rows = state.filter(function (s) {
      if (filt === 'all') return true; var p = filt.split('-').map(Number); return s.step >= p[0] && s.step <= (p[1] === undefined ? p[0] : p[1]);
    });
    $('#staff-table tbody').innerHTML = rows.map(function (s) {
      return '<tr><td class="ref">' + s.ref + '</td><td>' + s.client + '</td><td>' + s.from + ' → ' + s.to + '</td><td>' + badge(s) + '</td><td>' +
        (s.step < 5 ? '<button class="btn btn--accent sm" data-adv="' + s.ref + '">Avancer l\'étape →</button>' : '<span class="hint">Terminé</span>') + '</td></tr>';
    }).join('');
    renderDocs();
    if (current) showTrack(current, true);
  }

  /* ---------- Suivi ---------- */
  var current = null;
  function showTrack(ref, quiet) {
    var s = state.filter(function (x) { return x.ref.toLowerCase() === String(ref).trim().toLowerCase() && x.client === CLIENT; })[0];
    var out = $('#trackresult');
    if (!s) { current = null; out.innerHTML = '<div class="empty">Aucun dossier trouvé pour « ' + String(ref).replace(/[<>&]/g, '') + ' ». Essayez l\'une des références proposées ci-dessus.</div>'; return; }
    current = s.ref;
    var pct = (s.step / 5) * 100;
    var pts = STEPS.map(function (_, i) { return '<span class="rline__pt' + (i <= s.step ? ' is-done' : '') + '" style="left:calc(14px + (100% - 28px) * ' + (i / 5) + ')"></span>'; }).join('');
    var tl = STEPS.map(function (name, i) {
      var cls = i < s.step ? 'done' : i === s.step ? 'now' : 'todo';
      var note = i === s.step ? '<small>' + (s.ev[0] || '') + '</small>' : '';
      return '<li class="' + cls + '"><i></i><b>' + name + '</b>' + note + '</li>';
    }).join('');
    out.innerHTML = '<div class="tr"><div class="tr__head"><div><h4>' + s.ref + '</h4><p>' + s.what + ' · ' + ICON[s.mode] + ' ' + s.mode + '</p></div><div>' + badge(s) + '<p>Arrivée / livraison estimée : <b>' + s.eta + '</b></p></div></div>' +
      '<div class="tr__route"><div class="rline"><div class="rline__bar"><div class="rline__fill" style="width:' + pct + '%"></div></div>' + pts +
      '<span class="rline__me" style="left:calc(14px + (100% - 28px) * ' + (s.step / 5) + ')">' + ICON[s.mode] + '</span></div>' +
      '<div class="rends"><div>' + s.from + '<small>Départ</small></div><div style="text-align:right">' + s.to + '<small>Destination</small></div></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0" class="trgrid"><ul class="tl">' + tl + '</ul><div style="padding:22px"><b style="color:var(--navy)">Historique</b><ul class="tl" style="padding:12px 0 0">' +
      s.ev.map(function (e) { return '<li class="done"><i></i><span>' + e + '</span></li>'; }).join('') + '</ul></div></div></div>';
    if (!quiet) out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  $('#trackform').addEventListener('submit', function (e) { e.preventDefault(); showTrack($('#trackref').value); });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.dataset.ref) { $('#trackref').value = t.dataset.ref; showTrack(t.dataset.ref); }
    if (t.dataset.track) { switchTab('track'); $('#trackref').value = t.dataset.track; showTrack(t.dataset.track); }
    if (t.dataset.adv) {
      var s = state.filter(function (x) { return x.ref === t.dataset.adv; })[0];
      if (s && s.step < 5) {
        s.step++; var d = new Date(); var stamp = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2);
        s.ev.unshift(stamp + ' — ' + STEPS[s.step] + ' (mis à jour par ART)');
        if (s.step === 5) s.eta = 'Livré';
        save(); render();
      }
    }
    if (t.dataset.f) { $$('#filters button').forEach(function (b) { b.classList.remove('is-on'); }); t.classList.add('is-on'); render(); }
    if (t.id === 'reset-demo') { state = JSON.parse(JSON.stringify(SEED)); current = null; $('#trackresult').innerHTML = ''; save(); render(); }
    if (t.dataset.dl) {
      var blob = new Blob(['Document de démonstration — ART Connect\nDossier : ' + t.dataset.dl + '\nDonnées fictives.'], { type: 'text/plain' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'demo-' + t.dataset.dl.replace(/\W+/g, '-') + '.txt'; a.click();
    }
  });

  /* ---------- Documents ---------- */
  function renderDocs() {
    var out = [];
    mine().forEach(function (s) {
      var d = ['Facture proforma'];
      if (s.step >= 1) d.push(s.mode === 'Aérien' ? 'Lettre de transport aérien (LTA)' : s.mode === 'Maritime' ? 'Connaissement (B/L)' : 'Lettre de voiture');
      if (s.step >= 4) d.push('Déclaration en douane');
      if (s.step >= 5) d.push('Bon de livraison signé');
      d.forEach(function (n) { out.push('<li><span class="ft">PDF</span><div><b>' + n + '</b><small>' + s.ref + ' · ' + s.what + '</small></div><button class="btn sm" data-dl="' + s.ref + ' ' + n + '">Télécharger</button></li>'); });
    });
    $('#doclist').innerHTML = out.join('');
  }

  /* ---------- Onglets / vues ---------- */
  function switchTab(id) {
    $$('.tabs button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.tab === id); });
    $$('.pane').forEach(function (p) { p.classList.toggle('is-on', p.id === 'pane-' + id); });
  }
  $$('.tabs button').forEach(function (b) { b.addEventListener('click', function () { switchTab(b.dataset.tab); }); });
  $$('.switch button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.switch button').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
      $('#view-client').hidden = b.dataset.role !== 'client';
      $('#view-staff').hidden = b.dataset.role !== 'staff';
      render();
    });
  });

  $('#quoteform').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target;
    var ref = 'DEV-26-' + (100 + Math.floor(Math.random() * 900));
    var ok = $('#quoteok'); ok.hidden = false;
    ok.textContent = 'Demande ' + ref + ' enregistrée : ' + f.from.value + ' → ' + f.to.value + ' (' + f.mode.value + '). Dans la version réelle, l\'équipe ART la reçoit aussitôt dans son back-office et répond par e-mail. (Démonstration : rien n\'a été envoyé.)';
    f.reset();
  });

  /* ---------- Contact : ouvre la messagerie ---------- */
  $('#contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target;
    var body = 'Bonjour,\n\n' + f.msg.value + '\n\n' + f.nom.value + (f.fonction.value ? ' — ' + f.fonction.value : '');
    location.href = 'mailto:' + f.dataset.mail + '?subject=' + encodeURIComponent('Proposition ART Connect (portail client)') + '&body=' + encodeURIComponent(body);
  });

  /* ---------- Assistant ---------- */
  var MAIL = 'mailto:contactpog@artgabon.com?subject=' + encodeURIComponent('Question — proposition ART Connect');
  var KB = [
    { k: ['bonjour', 'salut', 'bonsoir', 'hello'], a: 'Bonjour ! Je réponds aux questions sur ART et sur la proposition de portail client. Que souhaitez-vous savoir ?' },
    { k: ['service', 'metier', 'propos', 'faites', 'activite'], a: 'ART propose six services : transport international (aérien, maritime, routier), dédouanement, manutention et transport routier, gestion logistique, transport maritime et consignation, management de projet et conseil.' },
    { k: ['douane', 'dedouan'], a: 'ART prend en charge le dédouanement : constitution des dossiers et formalités. Dans ART Connect, le client voit l\'étape « En douane » et télécharge la déclaration dès qu\'elle est prête.' },
    { k: ['maritime', 'navire', 'bateau', 'consign', 'escale'], a: 'ART assure le transport maritime et la consignation (escales de navires, services portuaires), avec des opérations de levage et de manutention à Port-Gentil.' },
    { k: ['aerien', 'avion', 'vol'], a: 'Le fret aérien fait partie du transport international d\'ART, en import comme en export, avec des partenaires dans plus de 130 pays.' },
    { k: ['petrol', 'oil', 'gas', 'offshore', 'industrie'], a: 'ART est spécialisée dans la logistique de l\'industrie pétrolière : colis lourds, hors gabarit, tubes, équipements, avec des bureaux à Port-Gentil, Libreville et Houston.' },
    { k: ['suivi', 'tracking', 'trouver', 'localis', 'colis', 'expedition', 'elyse'], a: 'Dans la démo, ouvrez l\'onglet « Suivi d\'expédition » du portail et testez ART-26-0412. Chaque dossier affiche sa progression, ses étapes et son historique.' },
    { k: ['portail', 'connect', 'back', 'outil', 'gestion', 'espace'], a: 'ART Connect est le portail proposé : les clients y suivent leurs expéditions, retrouvent leurs documents et demandent des cotations ; l\'équipe ART pilote tous les dossiers depuis un back-office. Essayez la démo, vue client puis vue ART.' },
    { k: ['prix', 'tarif', 'cout', 'budget', 'devis', 'combien'], a: 'Le budget dépend de la source des données de suivi, de l\'hébergement et des modules retenus. Une proposition chiffrée est établie après un premier échange avec ART.' },
    { k: ['delai', 'quand', 'duree', 'temps'], a: 'Une version pilote (suivi + documents) peut être mise en place par étapes : cadrage, maquette validée, pilote, puis déploiement. Le calendrier précis se fixe avec ART.' },
    { k: ['securit', 'donnee', 'confiden', 'acces', 'mot de passe'], a: 'Chaque client n\'accède qu\'à ses propres dossiers, avec un compte personnel. Le niveau de sécurité et l\'hébergement se définissent avec ART lors du cadrage.' },
    { k: ['contact', 'telephone', 'mail', 'adresse', 'joindre', 'appeler', 'ou '], a: 'Port-Gentil : Rue Joséphine Dupré, BP 569, +241 11 56 03 80, contactpog@artgabon.com. Libreville : BP 9391, +241 11 73 79 40, contactlbv@artgabon.com. L\'e-mail est la voie conseillée.' },
    { k: ['bureau', 'houston', 'libreville', 'port-gentil', 'implant'], a: 'ART est présente à Port-Gentil (siège), Libreville et Houston (États-Unis).' },
    { k: ['certif', 'qualite', 'veritas', 'iso'], a: 'ART est certifiée Bureau Veritas pour la qualité de ses procédures de transport et de douane.' },
    { k: ['merci'], a: 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.' }
  ];
  var CHIPS = ['Quels services ?', 'Qu\'est-ce qu\'ART Connect ?', 'Comment suivre un colis ?', 'Quel budget ?', 'Contact'];
  var log = $('#chat-log'), booted = false;
  function add(t, who, html) { var d = document.createElement('div'); d.className = 'msg ' + who; if (html) d.innerHTML = t; else d.textContent = t; log.appendChild(d); log.scrollTop = log.scrollHeight; }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function answer(q) {
    var n = ' ' + norm(q), best = null, bs = 0;
    KB.forEach(function (e) { var sc = 0; e.k.forEach(function (k) { if (n.indexOf(' ' + k) > -1 || (k.length > 4 && n.indexOf(k) > -1)) sc += k.length > 5 ? 2 : 1; }); if (sc > bs) { bs = sc; best = e; } });
    if (best) add(best.a, 'bot');
    else add('Je ne suis qu\'un assistant programmé et je n\'ai pas la réponse. Vous pouvez poser la question à l\'équipe ART par e-mail : <a href="' + MAIL + '">écrire à ART</a>.', 'bot', true);
  }
  function ask(q) { add(q, 'me'); setTimeout(function () { answer(q); }, 250); }
  $('#chat-chips').innerHTML = CHIPS.map(function (c) { return '<button type="button">' + c + '</button>'; }).join('');
  $('#chat-chips').addEventListener('click', function (e) { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });
  $('#chat-form').addEventListener('submit', function (e) { e.preventDefault(); var v = $('#chat-in').value.trim(); if (v) { $('#chat-in').value = ''; ask(v); } });
  $('#chat-fab').addEventListener('click', function () { $('#chat').hidden = false; $('#chat-fab').hidden = true; if (!booted) { booted = true; add('Bonjour ! Je suis l\'assistant de cette proposition. Posez-moi une question ou choisissez un sujet ci-dessous.', 'bot'); } });
  $('#chat-x').addEventListener('click', function () { $('#chat').hidden = true; $('#chat-fab').hidden = false; });

  render();
})();
