import { LOCALES, withLocale } from '$lib/i18n/index.js';

/*
 * Prerendered at build time (adapter-static requires every route to
 * be), so this is plain XML text baked once — not a live endpoint.
 * Paths and locales are the only two things that can change, and both
 * come from a single source (PAGES below, LOCALES from the i18n
 * module), so adding a page or a language keeps this in sync for free
 * instead of drifting like a hand-written sitemap would.
 */
export const prerender = true;

const ORIGIN = 'https://ergo-basics.github.io';
const PAGES = ['/', '/technology', '/economics', '/applications', '/mission'];

export function GET() {
	const urls = PAGES.flatMap((path) =>
		LOCALES.map((l) => `\t<url>\n\t\t<loc>${ORIGIN}${withLocale(path, l.code)}</loc>\n\t</url>`)
	);
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
