import { error } from '@sveltejs/kit';
import { DEFAULT_LOCALE, isSupported, loadDictionary } from '$lib/i18n/index.js';

export const prerender = true;

/**
 * Resolve which locale this page load is for, and make sure its
 * dictionary is already sitting in memory before the page renders —
 * for a prerendered `/es/…` page that means the static HTML comes out
 * in Spanish from the first byte; for a client-side navigation (via
 * the language switcher, or clicking a link across the prefix) it
 * means no flash of the previous language while the chunk fetches.
 *
 * @type {import('./$types').LayoutLoad}
 */
export async function load({ params }) {
	const { lang } = params;
	if (lang && !isSupported(lang)) {
		throw error(404, 'Not found');
	}
	const code = lang || DEFAULT_LOCALE;
	await loadDictionary(code);
	return { lang: code, isPrefixed: Boolean(lang) };
}
