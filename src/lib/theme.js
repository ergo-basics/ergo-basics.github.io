// Tiny theme store: 'dark' | 'light'.
//
// Default resolution order:
//   1. explicit saved choice in localStorage ('ergo-theme')
//   2. the OS preference (prefers-color-scheme)
//   3. 'dark' (the site's original look)
//
// The applied theme is mirrored onto <html data-theme="…"> so CSS can
// react purely via the attribute. An inline script in app.html applies
// the same logic before first paint to avoid a flash; this module keeps
// the Svelte side in sync and persists explicit toggles.

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'ergo-theme';

function initialTheme() {
	if (!browser) return 'dark';
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved === 'light' || saved === 'dark') return saved;
	} catch (e) {
		/* localStorage may be unavailable (private mode) — fall through */
	}
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
		return 'light';
	}
	return 'dark';
}

export const theme = writable(initialTheme());

export function applyTheme(value) {
	if (!browser) return;
	document.documentElement.setAttribute('data-theme', value);
}

export function toggleTheme() {
	theme.update((current) => {
		const next = current === 'dark' ? 'light' : 'dark';
		if (browser) {
			try {
				localStorage.setItem(STORAGE_KEY, next);
			} catch (e) {
				/* ignore persistence failure */
			}
		}
		return next;
	});
}
