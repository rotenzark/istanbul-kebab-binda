/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'istanbul-kebab-binda',
    /* niente WhatsApp finché non confermano: il cellulare (chiamata) */
    whatsapp: {
      number: '',
      message: '',
      ids: [],
    },
    /* Google (29/9/2026): tutti i giorni 11–00 */
    hours: {
      0: [['11:00', '24:00']],
      1: [['11:00', '24:00']],
      2: [['11:00', '24:00']],
      3: [['11:00', '24:00']],
      4: [['11:00', '24:00']],
      5: [['11:00', '24:00']],
      6: [['11:00', '24:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Istanbul, kebap and pizza: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.pane": "Made here",
      "n.menu": "The menu",
      "n.casa": "Delivery",
      "n.dentro": "The place",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.arrivare": "How to get there",
      "t.indicazioni": "Directions",
      "h.sopra": "Via Binda 28, on the corner of Via Ettore Ponti · Milan",
      "h.titolo": "kebap and pizza.",
      "h.testo": "Every day from 11 am to midnight. They make the bread, the flatbreads and the pizza right there, in front of you; and if you don’t feel like going out, they bring it to your door.",
      "h.chi": "from a review on Google",
      "h.google": "on Google, 287 reviews",
      "p.titolo": "Rolled out here",
      "p.desc": "A floured board: a long, thin rolling pin rolls out a ball of dough in five passes, then the dough bakes and turns golden. Bread, flatbread or pizza, the way they make them.",
      "p.d0": "Bread: round and thick, for the kebap sandwich.",
      "p.d1": "Flatbread: wide and thin, to wrap the kebap.",
      "p.d2": "Pizza: the tomato, the mozzarella, the crust that puffs up.",
      "p.modi": "What to roll out",
      "p.b0": "Bread",
      "p.b1": "Flatbread",
      "p.b2": "Pizza",
      "f.etichetta": "Made here",
      "f.titolo": "They make the bread here",
      "f.sotto": "Customers have been writing it for years: the sandwich bread, the flatbreads and the pizza are made on the spot, and while you wait you can watch them being rolled out.",
      "a.pane": "A kebap sandwich in round bread, with tomato, red onion and lettuce, in paper on a wooden tray.",
      "f.pane": "In the bread",
      "f.panet": "The sandwich: kebap in the round bread, with lettuce, tomato, onion and their own sauces.",
      "a.piadina": "A flatbread wrap in foil, fries and a sachet of sauce on a tray, at a table outside.",
      "f.piadina": "In the flatbread",
      "f.piadinat": "Kebap wrapped in the thin flatbread, to eat there or take away, with fries.",
      "a.pizza": "A pizza seen from above with ham, mushrooms, peppers, olives and frankfurters.",
      "f.pizza": "On the pizza",
      "f.pizzat": "Lots of pizzas, from the classics to the kebab pizza: the dough is theirs, the crust puffs up in the oven.",
      "u.etichetta": "The menu",
      "u.titolo": "How you want it",
      "u.kebap": "Kebap",
      "u.kebapv": "in the bread, in the flatbread, on a plate, or on a pizza",
      "u.falafel": "Falafel",
      "u.falafelv": "for those who don’t eat meat, in the bread or the flatbread too",
      "u.pizze": "Pizzas",
      "u.pizzev": "lots of them, from the classics to their own, meat-free ones too",
      "u.menu": "Meal deals",
      "u.menuv": "kebap with fries and a drink",
      "u.dolci": "Sweets",
      "u.dolciv": "baklava and traditional Turkish sweets",
      "u.nota": "The price list is in the shop; to order, delivery included, call +39 347 821 4018.",
      "a.panino2": "Two kebap sandwiches on trays, with red sauce, red cabbage and lettuce.",
      "a.cono": "A sandwich in a paper cone, with meat, white sauce, lettuce and avocado.",
      "a.tonno": "A tuna and red onion pizza seen up close, with a golden crust.",
      "c.etichetta": "Delivery",
      "c.titolo": "They bring it to you",
      "c.testo": "You call, you order, and the kebap or the pizza arrives at your door still hot: the neighbourhood’s customers say so. Every day, until midnight.",
      "c.chiama": "Order by phone",
      "l.etichetta": "The place",
      "l.titolo": "On the corner, under the sign",
      "l.sotto": "Recently renovated: black marble, light wood, tables to eat in; in summer, little tables outside on the pavement. By day the letters are orange, at night they light up.",
      "a.notte": "The place at night: the sign reading istanbul kebap e pizza lit up yellow on black panels, the window with the sketch of Istanbul, the door open onto the counter, the tables outside.",
      "c.notte": "At night, with the sign lit up.",
      "a.sala": "The room: light wooden tables, black metal chairs, black marble on the walls and a striped panel.",
      "c.sala": "Inside, black marble and light wood.",
      "a.giorno": "The place by day: black panels with orange letters on the grey stone, the sketch with the word istanbul on the window.",
      "c.giorno": "By day, the orange letters.",
      "d.etichetta": "Reviews",
      "d.titolo": "Like home",
      "d.google": "on Google, 287 reviews",
      "d.g2m": "Google, 2 months ago",
      "d.g1a": "Google, a year ago",
      "d.g3a": "Google, 3 years ago",
      "d.g2a": "Google, 2 years ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […]. The line at the top comes from another review on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "From 11 am to midnight, every day",
      "o.quadrante": "The 24 hours of the day: lit up, the slice from 11 am to midnight.",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.mappa": "Map: Istanbul Turkish Kebab, Via Ambrogio Binda 28, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Ambrogio Binda 28, 20143 Milan, on the corner of Via Ettore Ponti",
      "o.bus": "By bus",
      "o.busv": "The 74 and the NM2 night bus about 90 metres away, the 47 about 130",
      "o.metro": "By metro",
      "o.metrov": "M2 Romolo or Famagosta, about a kilometre away",
      "o.tel": "Phone",
      "q.etichetta": "Questions",
      "q.titolo": "Before you order",
      "q.1": "Do you deliver?",
      "q.1r": "Yes: call +39 347 821 4018. For the delivery area and times, ask on the phone.",
      "q.2": "Are you open on Sundays?",
      "q.2r": "Yes, every day from 11 am to midnight.",
      "q.3": "Do you make the bread yourselves?",
      "q.3r": "The sandwich bread, the flatbreads and the pizza are made on the spot: customers have been saying so for years.",
      "q.4": "Is there anything without meat?",
      "q.4r": "The falafel, and the pizzas without meat.",
      "q.5": "Can I eat there?",
      "q.5r": "Yes: there are tables inside and, in summer, little tables outside on the pavement.",
      "q.6": "How do I get there?",
      "q.6r": "Via Ambrogio Binda 28, on the corner of Via Ettore Ponti: bus 74 and the NM2 night bus stop about 90 metres away, the 47 about 130; M2 Romolo and M2 Famagosta are about a kilometre away.",
      "f2.orario": "Every day from 11 am to midnight · home delivery",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are by customers, from the Google listing; hours and reviews from Google (September 2026). We drew the board and the bread ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ ISTANBUL — «Kebap e pizza.» ══════════
     La pagina è la loro insegna di notte: il nero dei pannelli, il giallo delle lettere accese, l'arancio del giorno.
     la FIRMA — «steso qui»: su un tagliere infarinato un oklava (il mattarello lungo e sottile turco) stende una pallina di pasta in
     cinque passate, giù e su (la pasta si allarga, un po' ovale mentre il mattarello passa, tonda fra una passata e l'altra); il
     mattarello torna sotto il tagliere e la pasta cuoce: prende colore e le macchie una alla volta. Tre impasti: Pane, Piadina, Pizza.
     Lo stato è M (l'impasto), A (le passate, 0…5), B (la cottura, 0…1), V (servito: la pasta scivola via a destra) e il mattarello
     (x, y). Senza JS e alla fine: M = pane, A = 5, B = 1, V = 0, il mattarello a riposo (l'HTML). L'attesa (classe nell'head): la
     pallina cruda (A = 0, B = 0) nello stesso posto. Scegliere un impasto: quello di prima si serve e arriva una pallina nuova (se è
     ancora una pallina, niente da servire); lo stesso a pane fatto: se ne serve uno e se ne stende un altro. Reduced-motion: tutto
     subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,440],"centro":{"x":280,"y":207},"riposo":{"x":280,"y":418},"pallina":36,"tempi":{"inizio":300,"vola":320,"passata":440,"rientra":360,"cuoci":1300,"servi":380,"pausa":120,"passataV":330,"cuociV":1000,"passate":5,"sale":0.18,"salsa":0.2,"servito":320,"ovale":0.12,"stretto":0.06,"margine":10},"impasti":[{"nome":"Pane","R":118,"macchie":[{"t":0.3},{"t":0.344},{"t":0.389},{"t":0.433},{"t":0.478},{"t":0.522},{"t":0.567},{"t":0.611},{"t":0.656},{"t":0.5},{"t":0.514},{"t":0.527},{"t":0.541},{"t":0.555},{"t":0.568},{"t":0.582},{"t":0.595},{"t":0.609},{"t":0.623},{"t":0.636},{"t":0.65},{"t":0.664},{"t":0.677},{"t":0.691},{"t":0.705},{"t":0.718},{"t":0.732},{"t":0.745},{"t":0.759},{"t":0.773},{"t":0.786}]},{"nome":"Piadina","R":160,"macchie":[{"t":0.2},{"t":0.216},{"t":0.232},{"t":0.247},{"t":0.263},{"t":0.279},{"t":0.295},{"t":0.311},{"t":0.326},{"t":0.342},{"t":0.358},{"t":0.374},{"t":0.389},{"t":0.405},{"t":0.421},{"t":0.437},{"t":0.453},{"t":0.468},{"t":0.484},{"t":0.5},{"t":0.516},{"t":0.532},{"t":0.547},{"t":0.563},{"t":0.579},{"t":0.595},{"t":0.611},{"t":0.626},{"t":0.642},{"t":0.658},{"t":0.674},{"t":0.689},{"t":0.705},{"t":0.721},{"t":0.737},{"t":0.753},{"t":0.768},{"t":0.784}]},{"nome":"Pizza","R":148,"macchie":[{"t":0.22},{"t":0.242},{"t":0.264},{"t":0.287},{"t":0.309},{"t":0.331},{"t":0.353},{"t":0.376},{"t":0.398},{"t":0.45},{"t":0.469},{"t":0.489},{"t":0.508},{"t":0.528},{"t":0.547},{"t":0.567},{"t":0.586},{"t":0.606},{"t":0.625},{"t":0.644},{"t":0.664},{"t":0.683},{"t":0.703},{"t":0.722},{"t":0.742},{"t":0.761},{"t":0.781}]}]};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraT = prendi('tagliere'), svgT = prendi('tagliereSvg'), oklavaT = prendi('tagliereOklava'), leggiT = prendi('tagliereLeggi');
  var BOTTONI = [].slice.call(document.querySelectorAll('.tagliere__modi button[data-impasto]'));
  var TT = DATI.tempi, RIP = DATI.riposo, CT = DATI.centro, IMP = DATI.impasti, R0 = DATI.pallina;
  var PASTE = IMP.map(function (I, k) {
    var g = prendi('pasta' + k);
    return { g: g, corpo: g.querySelector('.pasta__corpo'), ombra: g.querySelector('.pasta__ombra'), cotta: g.querySelector('.pasta__cotta'), salsa: g.querySelector('.pasta__salsa'),
      macchie: [].slice.call(g.querySelectorAll('.macchia')).sort(function (a, b) { return +a.getAttribute('data-i') - +b.getAttribute('data-i'); }) };
  });
  var faseT = 'fatta', modoT = '', rafT = 0, guardiaT = 0, larghezzaAvvioT = 0, corseT = 0, pianoT = null;
  var MT = 0, AT = TT.passate, BT = 1, VT = 0, XT = RIP.x, YT = RIP.y;
  var destinazioneT = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  /* la forma della pasta dopo A passate: il raggio cresce (tanto all'inizio, poco alla fine), ovale mentre il mattarello passa */
  function formaT(m, a) {
    var R = IMP[m].R, A = Math.max(0, Math.min(TT.passate, a)), k = Math.floor(A), fr = A >= TT.passate ? 0 : A - k;
    var rc = R0 + (R - R0) * (1 - Math.pow(1 - A / TT.passate, 1.6)), sn = Math.sin(Math.PI * fr);
    return { rx: rc * (1 - TT.stretto * sn), ry: rc * (1 + TT.ovale * sn), k: k, fr: fr };
  }
  /* il mattarello durante la passata k alla frazione u: giù nelle passate pari, su nelle dispari, da un bordo all'altro */
  function mattarelloT(m, k, u) {
    var f = formaT(m, k + u), dir = k % 2 === 0 ? 1 : -1, bordo = f.ry + TT.margine;
    return [CT.x, CT.y + dir * (-bordo + 2 * bordo * u)];
  }
  function opac(el, o) {
    if (!el) return;
    if (o >= 1) el.removeAttribute('opacity'); else el.setAttribute('opacity', o <= 0 ? '0' : String(r3(o)));
  }
  function finaleT(P, k) {
    var R = String(IMP[k].R);
    P.g.removeAttribute('transform'); P.g.removeAttribute('opacity');
    [P.corpo, P.ombra].forEach(function (el) { el.setAttribute('rx', R); el.setAttribute('ry', R); });
    opac(P.cotta, 1); opac(P.salsa, 1); P.macchie.forEach(function (el) { opac(el, 1); });
  }
  function annunciaT(m) {
    var el = document.querySelector('.tagliere__d[data-m="' + m + '"]');
    if (leggiT) leggiT.textContent = el ? el.textContent : '';
  }
  /* il disegno dello stato: allo stato finale nessun attributo in più di quelli dell'HTML */
  function disegnaT(m, a, b, v, x, y) {
    if (m !== MT || figuraT.getAttribute('data-impasto') !== String(m)) {
      MT = m;
      figuraT.setAttribute('data-impasto', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-impasto') === m)); });
    }
    AT = a; BT = b; VT = v; XT = x; YT = y;
    PASTE.forEach(function (P, k) {
      if (k !== m) { finaleT(P, k); return; }
      if (v <= 0) { P.g.removeAttribute('transform'); P.g.removeAttribute('opacity'); }
      else { P.g.setAttribute('transform', 'translate(' + r3(TT.servito * v) + ' 0)'); P.g.setAttribute('opacity', String(r3(1 - v))); }
      if (a >= TT.passate) { [P.corpo, P.ombra].forEach(function (el) { el.setAttribute('rx', String(IMP[k].R)); el.setAttribute('ry', String(IMP[k].R)); }); }
      else { var f = formaT(k, a); [P.corpo, P.ombra].forEach(function (el) { el.setAttribute('rx', String(r3(f.rx))); el.setAttribute('ry', String(r3(f.ry))); }); }
      opac(P.cotta, b);
      opac(P.salsa, c01(b / TT.salsa));
      P.macchie.forEach(function (el, i) { opac(el, c01((b - IMP[k].macchie[i].t) / TT.sale)); });
    });
    if (Math.abs(x - RIP.x) < 1e-9 && Math.abs(y - RIP.y) < 1e-9) oklavaT.setAttribute('transform', 'translate(' + RIP.x + ' ' + RIP.y + ')');
    else oklavaT.setAttribute('transform', 'translate(' + r3(x) + ' ' + r3(y) + ')');
  }
  /* un piano: tratti { da, a, tipo ('ferma' | 'vola' | 'passa' | 'cuoci' | 'servi'), m, k, a0, b0, v0, x0, y0, x1, y1, curva } */
  function fotogrammaT(t) {
    var P = pianoT.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var u = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](u), pt;
    if (cur.tipo === 'passa') { pt = mattarelloT(cur.m, cur.k, u); disegnaT(cur.m, cur.k + u, 0, 0, pt[0], pt[1]); return; }
    if (cur.tipo === 'cuoci') { disegnaT(cur.m, TT.passate, u, 0, RIP.x, RIP.y); return; }
    if (cur.tipo === 'servi') { disegnaT(cur.m, cur.a0, cur.b0, cur.v0 + (1 - cur.v0) * e, cur.x0 + (cur.x1 - cur.x0) * e, cur.y0 + (cur.y1 - cur.y0) * e); return; }
    if (cur.tipo === 'ferma') { disegnaT(cur.m, cur.a0, cur.b0, cur.v0, cur.x0, cur.y0); return; }
    disegnaT(cur.m, cur.a0, cur.b0, cur.v0, cur.x0 + (cur.x1 - cur.x0) * e, cur.y0 + (cur.y1 - cur.y0) * e);
  }
  /* stendere e cuocere l'impasto m da una pallina, col mattarello che parte da (x0, y0) */
  function pianoStendi(t, m, veloce, x0, y0) {
    var P = [], passata = veloce ? TT.passataV : TT.passata, cuoci = veloce ? TT.cuociV : TT.cuoci;
    var su = mattarelloT(m, 0, 0);
    P.push({ da: t, a: t + TT.vola, tipo: 'vola', m: m, a0: 0, b0: 0, v0: 0, x0: x0, y0: y0, x1: su[0], y1: su[1], curva: 'dolce' }); t += TT.vola;
    for (var k = 0; k < TT.passate; k++) { P.push({ da: t, a: t + passata, tipo: 'passa', m: m, k: k, curva: 'lineare' }); t += passata; }
    var giu = mattarelloT(m, TT.passate - 1, 1);
    P.push({ da: t, a: t + TT.rientra, tipo: 'vola', m: m, a0: TT.passate, b0: 0, v0: 0, x0: giu[0], y0: giu[1], x1: RIP.x, y1: RIP.y, curva: 'dolce' }); t += TT.rientra;
    P.push({ da: t, a: t + cuoci, tipo: 'cuoci', m: m, curva: 'lineare' }); t += cuoci;
    return { piano: P, fine: t };
  }
  function sorvegliaT() { clearTimeout(guardiaT); guardiaT = setTimeout(chiudiT, 1500); }
  function chiudiT() {
    cancelAnimationFrame(rafT); rafT = 0;
    clearTimeout(guardiaT);
    disegnaT(destinazioneT.m, TT.passate, 1, 0, RIP.x, RIP.y);
    if (figuraT) figuraT.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseT = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): il tagliere si ferma dov'è (#244); dall'attesa lo stato è la pallina cruda */
  function fermaT() {
    cancelAnimationFrame(rafT); rafT = 0;
    clearTimeout(guardiaT);
    if (root.classList.contains('firma-attesa')) { disegnaT(MT, 0, 0, 0, RIP.x, RIP.y); root.classList.remove('firma-attesa'); }
    else disegnaT(MT, AT, BT, VT, XT, YT);
    if (figuraT) figuraT.setAttribute('data-firma', 'fatta');
    faseT = 'fatta';
  }
  function avviaT(modo, piano) {
    cancelAnimationFrame(rafT); rafT = 0;
    modoT = modo; pianoT = piano;
    root.classList.remove('firma-attesa');
    faseT = 'corre'; if (figuraT) figuraT.setAttribute('data-firma', 'corre');
    larghezzaAvvioT = window.innerWidth;
    var t0 = null, corsa = ++corseT;
    function fotogramma(ts) {
      rafT = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseT !== 'corre' || corsa !== corseT) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaT(t);
      if (t >= pianoT.fine) { chiudiT(); return; }
      sorvegliaT();
      rafT = requestAnimationFrame(fotogramma);
    }
    sorvegliaT();
    rafT = requestAnimationFrame(fotogramma);
  }
  function avviaIntroT() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la pallina cruda, il mattarello a riposo */
    disegnaT(0, 0, 0, 0, RIP.x, RIP.y);
    destinazioneT = { m: 0 };
    var resto = pianoStendi(TT.inizio, 0, false, RIP.x, RIP.y);
    avviaT('intro', { piano: [{ da: 0, a: TT.inizio, tipo: 'ferma', m: 0, a0: 0, b0: 0, v0: 0, x0: RIP.x, y0: RIP.y, curva: 'lineare' }].concat(resto.piano), fine: resto.fine });
  }
  /* il gesto: scegliere un impasto. Se è quello che si sta già stendendo, niente; altrimenti il tagliere si ferma dov'è, quello che
     c'è si serve (scivola via, e il mattarello torna a riposo) e sul tagliere arriva una pallina nuova da stendere. */
  function sceltaT(m) {
    if (faseT === 'corre' && destinazioneT.m === m) return;
    if (faseT === 'corre' || root.classList.contains('firma-attesa')) fermaT();
    destinazioneT = { m: m };
    annunciaT(m);
    if (reducedMotion) { chiudiT(); return; }
    var P = [], t = 0;
    if (AT > 0 || BT > 0 || VT > 0) { P.push({ da: 0, a: TT.servi, tipo: 'servi', m: MT, a0: AT, b0: BT, v0: VT, x0: XT, y0: YT, x1: RIP.x, y1: RIP.y, curva: 'dolce' }); t = TT.servi; }
    else if (XT !== RIP.x || YT !== RIP.y) { P.push({ da: 0, a: TT.servi, tipo: 'vola', m: MT, a0: 0, b0: 0, v0: 0, x0: XT, y0: YT, x1: RIP.x, y1: RIP.y, curva: 'dolce' }); t = TT.servi; }
    P.push({ da: t, a: t + TT.pausa, tipo: 'ferma', m: m, a0: 0, b0: 0, v0: 0, x0: RIP.x, y0: RIP.y, curva: 'lineare' }); t += TT.pausa;
    var resto = pianoStendi(t, m, true, RIP.x, RIP.y);
    avviaT('stendi', { piano: P.concat(resto.piano), fine: resto.fine });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche accanto alla settimana */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* il tagliere è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alto della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaT() { var r = svgT.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraT && svgT && oklavaT && BOTTONI.length === IMP.length && PASTE.length === IMP.length) {
    try { clearTimeout(window.__attesaTagliere); } catch (e) {}
    window.__tagliere = {
      stato: function () {
        return { fase: faseT, modo: modoT, corse: corseT, m: MT, a: AT, b: BT, v: VT, x: XT, y: YT, meta: destinazioneT.m };
      },
      tempi: TT,
    };
    var daFareT = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraT = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaT();
    /* perché la firma è partita o no (lo legge il check) */
    window.__tagliere.avvio = { daFare: daFareT, ancora: !!ancoraT, inVista: inVista, top: svgT.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareT || ancoraT) chiudiT();
    else if (inVista) avviaIntroT();
    else if ('IntersectionObserver' in window) {
      /* il tagliere sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora resta la pallina cruda */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioT = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioT.disconnect();
        if (faseT === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroT();
      }, { threshold: soglie });
      ioT.observe(svgT);
      window.__tagliere.avvio.aspetta = true;
    } else chiudiT();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseT !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioT) <= 1) return;
      chiudiT();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaT(+b.getAttribute('data-impasto')); }); });
  }
})();
