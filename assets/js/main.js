(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Menu mobile */
  var nav = $('#nav'), burger = $('#burger');
  burger.addEventListener('click', function () { burger.setAttribute('aria-expanded', nav.classList.toggle('open')); });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });

  /* Apparition au défilement */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .1 }) : null;
  $$('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  /* Visionneuse photos */
  $$('.g').forEach(function (g) {
    g.addEventListener('click', function () {
      var lb = document.createElement('div'); lb.className = 'lb';
      lb.innerHTML = '<img alt="">'; $('img', lb).src = $('img', g).src;
      lb.addEventListener('click', function () { lb.remove(); });
      document.body.appendChild(lb);
    });
  });

  /* Contact : ouvre la messagerie */
  $('#contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target;
    var body = 'Bonjour,\n\n' + f.msg.value + '\n\n' + f.nom.value + (f.fonction.value ? ' — ' + f.fonction.value : '');
    location.href = 'mailto:' + f.dataset.mail + '?subject=' + encodeURIComponent('Demande via le site artgabon') + '&body=' + encodeURIComponent(body);
  });

  /* Assistant */
  var MAIL = 'mailto:contactpog@artgabon.com?subject=' + encodeURIComponent('Question depuis le site');
  var KB = [
    { k: ['bonjour', 'salut', 'bonsoir', 'hello'], a: 'Bonjour ! Je réponds à vos questions sur ART et ses services. Que souhaitez-vous savoir ?' },
    { k: ['service', 'metier', 'propos', 'faites', 'activite'], a: 'ART propose six services : transport international (aérien, maritime, routier), dédouanement, manutention et transport routier, gestion logistique, transport maritime et consignation, management de projet et conseil.' },
    { k: ['douane', 'dedouan'], a: 'ART prend en charge le dédouanement. Nos équipes constituent les dossiers et suivent les formalités jusqu\'à la libération des marchandises.' },
    { k: ['maritime', 'navire', 'bateau', 'consign', 'escale'], a: 'ART assure le transport maritime et la consignation (escales de navires, services portuaires), avec des opérations de levage et de manutention à Port-Gentil.' },
    { k: ['aerien', 'avion', 'vol'], a: 'Le fret aérien fait partie du transport international d\'ART, en import comme en export, avec des partenaires dans plus de 130 pays.' },
    { k: ['petrol', 'oil', 'gas', 'offshore', 'industrie'], a: 'ART est spécialisée dans la logistique de l\'industrie pétrolière : colis lourds, hors gabarit, tubes, équipements, avec des bureaux à Port-Gentil, Libreville et Houston.' },
        { k: ['suivi', 'tracking', 'trouver', 'localis', 'colis', 'expedition', 'elyse'], a: 'ART propose un suivi de vos marchandises en temps réel via sa plateforme de tracking. Pour une expédition précise, écrivez-nous avec votre référence.' },
        { k: ['prix', 'tarif', 'cout', 'devis', 'combien'], a: 'Chaque expédition fait l\x27objet d\x27un devis sur mesure. Écrivez-nous par e-mail avec le trajet, la nature et le poids de la marchandise.' },
            { k: ['contact', 'telephone', 'mail', 'adresse', 'joindre', 'appeler', 'ou '], a: 'Port-Gentil : Rue Joséphine Dupré, BP 569, +241 11 56 03 80, contactpog@artgabon.com. Libreville : BP 9391, +241 11 73 79 40, contactlbv@artgabon.com. L\'e-mail est la voie conseillée.' },
    { k: ['bureau', 'houston', 'libreville', 'port-gentil', 'implant'], a: 'ART est présente à Port-Gentil (siège), Libreville et Houston (États-Unis).' },
    { k: ['certif', 'qualite', 'veritas', 'iso'], a: 'ART est certifiée Bureau Veritas pour la qualité de ses procédures de transport et de douane.' },
    { k: ['merci'], a: 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.' }
  ];
  var CHIPS = ['Quels services ?', 'Comment suivre un colis ?', 'Demander un devis', 'Contact'];
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
  $('#chat-fab').addEventListener('click', function () { $('#chat').hidden = false; $('#chat-fab').hidden = true; if (!booted) { booted = true; add('Bonjour ! Je suis l\'assistant d\'ART. Posez-moi une question ou choisissez un sujet ci-dessous.', 'bot'); } });
  $('#chat-x').addEventListener('click', function () { $('#chat').hidden = true; $('#chat-fab').hidden = false; });
})();
