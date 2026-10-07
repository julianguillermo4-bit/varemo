import { translations } from './translations.mjs?v=20261007-opening-promo';

const preferenceKey = 'varemo-language';
const supported = new Set(['es', 'en']);
let currentLanguage = 'es';

export function initialLanguage() {
  const requested = new URL(window.location.href).searchParams.get('lang');
  if (supported.has(requested)) return requested;
  try {
    const saved = window.localStorage.getItem(preferenceKey);
    if (supported.has(saved)) return saved;
  } catch { /* Language switching also works when browser storage is unavailable. */ }
  return 'es';
}

export function translate(key) {
  return translations[currentLanguage][key] ?? translations.es[key];
}

export function applyLanguage(language, { remember = false } = {}) {
  currentLanguage = supported.has(language) ? language : 'es';
  document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'es-PA';
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = translate(element.dataset.i18n);
  });
  // Only trusted, authored headings use markup. All other copy is plain text.
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    element.innerHTML = translate(element.dataset.i18nHtml);
  });
  for (const attribute of ['aria-label', 'alt', 'content', 'title']) {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
      element.setAttribute(attribute, translate(element.getAttribute(`data-i18n-${attribute}`)));
    });
  }
  document.querySelector('meta[property="og:locale"]').content = currentLanguage === 'en' ? 'en_US' : 'es_PA';
  const map = document.getElementById('service-area-map');
  if (map) {
    const mapUrl = new URL(map.src);
    if (mapUrl.searchParams.get('hl') !== currentLanguage) {
      mapUrl.searchParams.set('hl', currentLanguage);
      map.src = mapUrl.href;
    }
  }
  document.querySelectorAll('[data-language]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === currentLanguage));
  });
  document.querySelector('.language-switch').hidden = false;
  if (remember) {
    try { window.localStorage.setItem(preferenceKey, currentLanguage); } catch { /* Optional preference. */ }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', currentLanguage);
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    } catch { /* The selected language still works if history changes are restricted. */ }
  }
  return currentLanguage;
}
