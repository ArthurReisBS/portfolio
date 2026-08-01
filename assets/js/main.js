/* =========================================================
   Portfólio — Arthur Reis
   Vanilla JS. Sem dependências.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     1. Idioma (PT / EN)
     O HTML carrega os dois idiomas; o CSS mostra só um,
     com base no atributo lang do <html>.
     --------------------------------------------------- */
  var LANGS = { pt: 'pt-BR', en: 'en' };

  var ROLES = {
    pt: [
      'estudante de ciência da computação',
      'desenvolvimento backend em Python e Java',
      'dados e inteligência artificial aplicada',
      'Linux, Raspberry Pi e Arduino',
      'em busca de estágio'
    ],
    en: [
      'computer science student',
      'backend development in Python and Java',
      'data and applied artificial intelligence',
      'Linux, Raspberry Pi and Arduino',
      'seeking an internship'
    ]
  };

  var TITLES = {
    pt: 'Arthur Reis · Ciência da Computação',
    en: 'Arthur Reis · Computer Science'
  };

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'pt';
  }

  function setLang(lang) {
    document.documentElement.lang = LANGS[lang];
    document.title = TITLES[lang];

    var btn = document.getElementById('langToggle');
    if (btn) {
      btn.setAttribute('aria-label',
        lang === 'pt' ? 'Switch to English' : 'Mudar para português');
    }

    try { localStorage.setItem('portfolio-lang', lang); } catch (e) { /* modo privado */ }

    typer.restart(ROLES[lang]);
  }

  /* ---------------------------------------------------
     2. Efeito de digitação no hero
     --------------------------------------------------- */
  var typer = (function () {
    var el = document.getElementById('typed');
    var phrases = [];
    var iPhrase = 0, iChar = 0, deleting = false, timer = null;

    var TYPE_MS = 55, DELETE_MS = 28, HOLD_MS = 1900, GAP_MS = 350;

    function loop() {
      if (!el || !phrases.length) return;
      var full = phrases[iPhrase];

      if (deleting) {
        iChar--;
        el.textContent = full.slice(0, iChar);
        if (iChar <= 0) {
          deleting = false;
          iPhrase = (iPhrase + 1) % phrases.length;
          timer = setTimeout(loop, GAP_MS);
          return;
        }
        timer = setTimeout(loop, DELETE_MS);
        return;
      }

      iChar++;
      el.textContent = full.slice(0, iChar);
      if (iChar >= full.length) {
        deleting = true;
        timer = setTimeout(loop, HOLD_MS);
        return;
      }
      timer = setTimeout(loop, TYPE_MS);
    }

    return {
      restart: function (list) {
        phrases = list || [];
        clearTimeout(timer);
        iPhrase = 0; iChar = 0; deleting = false;
        if (!el) return;

        // sem animação: mostra a primeira frase e para por aqui
        if (reduceMotion) { el.textContent = phrases[0] || ''; return; }

        el.textContent = '';
        timer = setTimeout(loop, 450);
      }
    };
  })();

  /* ---------------------------------------------------
     3. Reveal ao rolar
     --------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i, 4) * 70) + 'ms';
      io.observe(el);
    });
  }

  /* ---------------------------------------------------
     4. Navegação: menu mobile, seção ativa, sombra do topo
     --------------------------------------------------- */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    var topbar = document.querySelector('.topbar');

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (topbar) {
      var onScroll = function () {
        topbar.classList.toggle('is-stuck', window.scrollY > 8);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // link ativo conforme a seção visível
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__menu a[href^="#"]'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------
     5. Boot
     --------------------------------------------------- */
  function init() {
    // Padrão é português; só troca se o visitante já escolheu inglês antes.
    var saved = null;
    try { saved = localStorage.getItem('portfolio-lang'); } catch (e) { /* ignora */ }
    setLang(saved === 'en' ? 'en' : 'pt');

    var langBtn = document.getElementById('langToggle');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        setLang(currentLang() === 'pt' ? 'en' : 'pt');
      });
    }

    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    initNav();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
