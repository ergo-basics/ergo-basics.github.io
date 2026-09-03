/*
 * Fills in the `%lang%`/`%dir%` placeholders in app.html from the URL's
 * locale prefix, so a prerendered `/es/…` page carries the right
 * `<html lang="es">` from the very first byte — screen readers and
 * crawlers never see the wrong language, unlike the client-side
 * fallback in app.html's inline script, which only has something to
 * correct *after* JS runs.
 *
 * `adapter-static` prerenders by running the app through this same
 * server pipeline and capturing the output, so this hook applies to
 * every prerendered page too, not just a live server.
 *
 * Keep `SUPPORTED`/`RTL` in step with `LOCALES` in `$lib/i18n/index.js`
 * — duplicated rather than imported because hooks run in a plain
 * Node/edge context before the app's module graph is guaranteed to be
 * the browser-safe subset, and this list is small and rarely changes.
 */

const SUPPORTED = ['en', 'es'];
const RTL = new Set();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const [, first] = event.url.pathname.split('/');
	const lang = SUPPORTED.includes(first) ? first : 'en';
	const dir = RTL.has(lang) ? 'rtl' : 'ltr';

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang).replace('%dir%', dir)
	});
}
