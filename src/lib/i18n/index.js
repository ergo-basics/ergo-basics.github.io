/*
 * i18n layer: 'en' | 'es' | 'zh' | 'hi' | 'ru' | 'fr' | 'pt' | 'sw' | 'ja' |
 * 'ar' | 'de' | 'id' | 'ko' | 'ro' | 'tr' | 'uk' | 'vi'.
 *
 * Design constraints this file answers to:
 *
 *   • One copy of every component. Language is data, never a second
 *     template — every user-facing string lives in ./en.js, ./es.js,
 *     ./zh.js, ./hi.js, ./ru.js, ./fr.js, ./pt.js, ./sw.js, ./ja.js,
 *     ./ar.js, ./de.js, ./id.js, ./ko.js, ./ro.js, ./tr.js, ./uk.js and
 *     ./vi.js under the same key, and components read it through `$t`.
 *   • Lazy dictionaries. Only English (`en.js`) is bundled eagerly, as
 *     the universal fallback. Every other dictionary is a separate Vite
 *     chunk, fetched only once that locale is actually selected — so a
 *     visitor who only ever reads English never downloads the other
 *     sixteen. `loadDictionary(code)` fetches-and-caches; `setLocale(code)`
 *     awaits that before flipping the active locale, so `t`/`exists`/
 *     `translator` can stay synchronous everywhere else, on the
 *     invariant that `locale` never changes to a code whose dictionary
 *     isn't cached yet. The one place that invariant has to be upheld
 *     by hand is `[[lang]]/+layout.ts`'s `load()`, which awaits the
 *     route's dictionary before the page renders.
 *   • Optional locale-prefixed routes. English stays unprefixed
 *     (`/depin`); every other locale also has a prerendered `/xx/…`
 *     equivalent (`/es/depin`) purely so a specific language can be
 *     shared or linked to directly — see `withLocale`/`stripLocale`.
 *     The unprefixed routes are untouched: still client-detected from
 *     localStorage / navigator.languages, no URL change.
 *   • Never blank. A key missing from the active locale falls back to
 *     English rather than rendering nothing.
 *   • Adding a language is additive: add its dictionary loader to
 *     `LOADERS`, one entry to `LOCALES`, and its code to the two
 *     `supported` lists in app.html and hooks.server.js. Nothing else —
 *     components, scenes and pages already read every string through
 *     `$t`/`translator`, and every internal link already goes through
 *     `$href`.
 *
 * Resolution order for the *unprefixed* routes' initial locale:
 *   1. explicit saved choice in localStorage ('ergo-lang')
 *   2. the browser's preferred languages (navigator.languages)
 *   3. 'en'
 * A prefixed route (`/es/…`) is authoritative for its own page load and
 * ignores that resolution — see `[[lang]]/+layout.ts`.
 *
 * The resolved code is mirrored onto <html lang="…">/<html dir="…">.
 * For prefixed routes that happens server-side, during prerendering,
 * via hooks.server.js (so crawlers and screen readers get it from the
 * very first byte); for unprefixed routes there is no server-side
 * signal to render from, so an inline script in app.html applies the
 * same client-side resolution before first paint, to avoid a flash.
 *
 * RTL note: Arabic ('ar') is the first right-to-left locale here.
 * `applyLocale` also mirrors `dir="rtl"`/`dir="ltr"` onto <html>, which
 * is what the Unicode Bidi Algorithm needs to correctly order Arabic
 * text mixed with embedded Latin terms (BOX, API…) and numbers. That is
 * a content-correctness fix, not a visual one — no component layout,
 * icon position, or canvas scene composition is mirrored for RTL; that
 * would be a separate, much larger pass across the whole site.
 */

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import en from './en.js';

/** Everything the language switcher needs to render itself. */
export const LOCALES = [
	{ code: 'en', label: 'English', short: 'EN', dir: 'ltr' },
	{ code: 'es', label: 'Español', short: 'ES', dir: 'ltr' }
];

export const DEFAULT_LOCALE = 'en';
const STORAGE_KEY = 'ergo-lang';

const SUPPORTED = new Set(LOCALES.map((l) => l.code));
/** Codes needing dir="rtl" — derived from LOCALES so a future RTL
 *  addition (Hebrew, Persian, Urdu…) only needs its `dir` flag set. */
const RTL_LOCALES = new Set(LOCALES.filter((l) => l.dir === 'rtl').map((l) => l.code));

/**
 * One dynamic-import loader per locale, so each dictionary becomes its
 * own Vite chunk instead of all seventeen landing in the shared bundle.
 * English is imported eagerly above (it's the fallback for every other
 * locale, so there is no meaningful world in which it isn't needed).
 */
const LOADERS = {
	es: () => import('./es.js')
};

/** @type {Record<string, any>} code -> dictionary, once loaded. */
const cache = { en };
/** @type {Record<string, Promise<any> | undefined>} in-flight loads, so
 *  a second caller for the same locale awaits the first fetch instead
 *  of firing a duplicate one. */
const inFlight = {};

/** @param {unknown} code */
export function isSupported(code) {
	return typeof code === 'string' && SUPPORTED.has(code);
}

/** @param {string} code */
export function isRTL(code) {
	return RTL_LOCALES.has(code);
}

/**
 * Fetch and cache a locale's dictionary. Always resolves — an unknown
 * code or a failed fetch falls back to the already-eager English one,
 * so a flaky network degrades to "wrong language" rather than "broken
 * page".
 * @param {string} code
 * @returns {Promise<any>}
 */
export function loadDictionary(code) {
	if (!isSupported(code)) code = DEFAULT_LOCALE;
	if (cache[code]) return Promise.resolve(cache[code]);
	const pending = inFlight[code];
	if (pending) return pending;

	const loader = /** @type {Record<string, () => Promise<{ default: any }>>} */ (LOADERS)[code];
	inFlight[code] = loader()
		.then((/** @type {{ default: any }} */ mod) => {
			cache[code] = mod.default;
			return cache[code];
		})
		.catch((/** @type {unknown} */ e) => {
			if (browser) console.warn(`[i18n] failed to load "${code}", falling back to English`, e);
			cache[code] = en;
			return cache[code];
		})
		.finally(() => {
			delete inFlight[code];
		});
	return /** @type {Promise<any>} */ (inFlight[code]);
}

/** @returns {string} */
function detectFromEnvironment() {
	if (!browser) return DEFAULT_LOCALE;
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (isSupported(saved)) return /** @type {string} */ (saved);
	} catch (e) {
		/* localStorage may be unavailable (private mode) — fall through */
	}
	const preferred = [navigator.language, ...(navigator.languages || [])];
	for (const tag of preferred) {
		// 'es-AR' and 'es' both resolve to the 'es' dictionary.
		const base = String(tag || '')
			.toLowerCase()
			.split('-')[0];
		if (isSupported(base)) return base;
	}
	return DEFAULT_LOCALE;
}

/**
 * What the unprefixed routes should bootstrap to, resolved from a saved
 * choice or the browser's languages. Exported so `[[lang]]/+layout.ts`
 * can await the right dictionary in `load()` before the page renders,
 * instead of rendering English and flipping a beat later.
 * @returns {string}
 */
export function detectLocale() {
	return detectFromEnvironment();
}

export const locale = writable(DEFAULT_LOCALE);

/**
 * Mirror the active locale onto <html lang> and <html dir>. Client-side
 * only — the prerendered shell for a prefixed route already carries the
 * right attributes from hooks.server.js.
 * @param {string} value
 */
export function applyLocale(value) {
	if (!browser) return;
	document.documentElement.setAttribute('lang', value);
	document.documentElement.setAttribute('dir', isRTL(value) ? 'rtl' : 'ltr');
}

/**
 * Persist a locale as the visitor's remembered choice, for the next
 * time they land on an unprefixed route.
 * @param {string} code
 */
export function persistLocale(code) {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, code);
	} catch (e) {
		/* ignore persistence failure */
	}
}

/**
 * Make `code` the active locale, loading its dictionary first if it
 * isn't cached yet. Async, for call sites that don't already know the
 * dictionary is loaded (the language switcher, the unprefixed routes'
 * client-side bootstrap).
 * @param {string} code
 */
export async function setLocale(code) {
	if (!isSupported(code)) code = DEFAULT_LOCALE;
	await loadDictionary(code);
	commitLocale(code);
}

/**
 * The synchronous half of `setLocale`: persist + activate a locale
 * whose dictionary is *already* cached. This is the only place that
 * should ever call `locale.set(...)`, so the "dictionary is already
 * cached" invariant the rest of this module relies on always holds.
 *
 * Use this (instead of `setLocale`) when a route's `load()` already
 * awaited `loadDictionary` — a prefixed route's `+layout.ts` does
 * exactly that, so its `+layout.svelte` can commit synchronously
 * instead of re-awaiting on the client.
 * @param {string} code
 */
export function commitLocale(code) {
	if (!isSupported(code)) code = DEFAULT_LOCALE;
	if (!cache[code]) {
		// Defensive only — every real call site guarantees this via a
		// prior loadDictionary()/setLocale() await. If it somehow isn't
		// loaded, fall back rather than let `t` silently read English
		// while `locale` claims to be something else.
		code = DEFAULT_LOCALE;
	}
	persistLocale(code);
	locale.set(code);
}

/**
 * Walk a dotted key path. Returns undefined rather than throwing.
 * @param {any} dict
 * @param {string[]} path
 * @returns {any}
 */
function resolve(dict, path) {
	let node = dict;
	for (const part of path) {
		if (node === null || typeof node !== 'object') return undefined;
		node = node[part];
	}
	return node;
}

/**
 * `{name}` placeholders, for the handful of strings that need them.
 * @param {string} text
 * @param {Record<string, unknown>} vars
 */
function interpolate(text, vars) {
	return text.replace(/\{(\w+)\}/g, (/** @type {string} */ match, /** @type {string} */ name) =>
		Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
	);
}

/**
 * Build the lookup function for a locale.
 *
 * Exported on its own because the canvas scenes need a plain function
 * they can call inside a requestAnimationFrame loop, where subscribing
 * to a store per frame would be silly. Synchronous — relies on `code`'s
 * dictionary already being in `cache` (true for anything reached via
 * `setLocale`).
 *
 * A value may be a string, an array or an object — the dictionaries
 * hold whole card lists, so `t('home.principles.items')` returns the
 * array and the component just iterates it.
 *
 * @param {string} code
 */
export function translator(code) {
	const primary = cache[code] || cache[DEFAULT_LOCALE];
	const fallback = cache[DEFAULT_LOCALE];

	/**
	 * @param {string} key dotted path into the dictionary
	 * @param {Record<string, unknown>} [vars] `{name}` placeholder values
	 * @returns {any} string, array or object, depending on the key
	 */
	return function t(key, vars) {
		const path = String(key).split('.');
		let value = resolve(primary, path);
		if (value === undefined) value = resolve(fallback, path);
		if (value === undefined) {
			if (browser) console.warn(`[i18n] missing key: ${key}`);
			return key;
		}
		if (typeof value === 'string' && vars) return interpolate(value, vars);
		return value;
	};
}

/** The store components actually use: `$t('some.key')`. */
export const t = derived(locale, translator);

/**
 * `$exists('some.key')` — is this key defined in the active locale (or
 * in the English fallback)?
 *
 * Sections that are genuinely optional (/depin has no trade-off table)
 * are gated on this rather than on `$t`, which treats a missing key as
 * a mistake and warns about it.
 */
export const exists = derived(locale, (/** @type {string} */ code) => {
	const primary = cache[code] || cache[DEFAULT_LOCALE];
	return (/** @type {string} */ key) => {
		const path = String(key).split('.');
		return resolve(primary, path) !== undefined || resolve(cache[DEFAULT_LOCALE], path) !== undefined;
	};
});

/**
 * Prefix a root-relative path with a locale, for a shareable link in
 * that language — `withLocale('/depin', 'es')` → `/es/depin`. A no-op
 * for anything that isn't a root-relative path (external URLs, in-page
 * `#anchors`) and for the default locale, which stays unprefixed.
 *
 * No trailing slash on the home path (`/es`, not `/es/`): the site
 * prerenders with SvelteKit's default `trailingSlash: 'never'`, so the
 * home page under a locale lands in the flat file `es.html`, not
 * `es/index.html` — a trailing slash there is a route static hosts
 * (GitHub Pages included) won't resolve to it.
 * @param {string} path
 * @param {string} code
 */
export function withLocale(path, code) {
	if (typeof path !== 'string' || !path.startsWith('/')) return path;
	if (!code || code === DEFAULT_LOCALE) return path;
	return path === '/' ? `/${code}` : `/${code}${path}`;
}

/**
 * The inverse of `withLocale`: strip a leading `/es/…` (etc.) prefix
 * back down to the canonical unprefixed path, e.g. for comparing the
 * current URL against a nav item's plain `href`, or for recomputing a
 * link when the locale changes.
 * @param {string} pathname
 */
export function stripLocalePrefix(pathname) {
	if (typeof pathname !== 'string') return '/';
	const parts = pathname.split('/');
	if (parts[1] && SUPPORTED.has(parts[1])) {
		const rest = '/' + parts.slice(2).join('/');
		return rest.length > 1 ? rest.replace(/\/$/, '') : '/';
	}
	return pathname || '/';
}

/**
 * Store version of `withLocale`, for use as `$href('/depin')` in
 * templates — mirrors the existing `$t('some.key')` pattern so
 * components read it the same way.
 */
export const href = derived(locale, (code) => (/** @type {string} */ path) => withLocale(path, code));
