<script>
	import '../../app.css';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { theme, applyTheme } from '$lib/theme.js';
	import { t, locale, applyLocale, commitLocale, detectLocale, setLocale, stripLocalePrefix } from '$lib/i18n/index.js';
	import { hardResetScroll, killAllScrollTriggers } from '$lib/motion.js';
	import AmbientBackground from '$lib/components/AmbientBackground.svelte';
	import FloatingControls from '$lib/components/FloatingControls.svelte';

	/** @type {import('./$types').LayoutData} */
	export let data;

	/*
	 * `data.lang` comes from +layout.ts's load(), which already awaited
	 * this locale's dictionary — so it's safe to switch synchronously.
	 *
	 * A prefixed route (/es/…) is authoritative: whatever the visitor
	 * had saved before, the URL they followed wins for this page. An
	 * unprefixed route has no locale of its own to be authoritative
	 * about, so it falls back to the existing client-side bootstrap
	 * (saved choice, else browser languages, else English) — unchanged
	 * from before locale-prefixed routes existed.
	 */
	if (data.isPrefixed) {
		commitLocale(data.lang);
	} else if (browser) {
		const initial = detectLocale();
		if (initial !== data.lang) setLocale(initial);
	}

	// Keep <html data-theme> and <html lang>/<html dir> in sync with
	// their stores across every route.
	$: applyTheme($theme);
	$: applyLocale($locale);

	// Moving to different content should land at its top and rebuild its
	// GSAP pins. A locale-only navigation keeps both the current scroll
	// coordinate and the existing pins: only their translated labels and
	// direction change. Back/forward (`popstate`) is left to the browser.
	/** @param {{ from?: { url?: URL } | null, to?: { url?: URL } | null }} nav */
	function changesContent(nav) {
		if (!nav.from?.url || !nav.to?.url) return true;
		return stripLocalePrefix(nav.from.url.pathname) !== stripLocalePrefix(nav.to.url.pathname);
	}

	beforeNavigate((nav) => {
		if (nav.type !== 'popstate' && changesContent(nav)) killAllScrollTriggers();
	});
	afterNavigate((nav) => {
		if (nav.type !== 'popstate' && changesContent(nav)) hardResetScroll();
	});

	// Svelte never interpolates inside a literal script element in the
	// template -- it treats its content as raw text, same as the browser
	// does -- so the JSON has to be built here and injected as a string
	// via @html, with the closing tag split so this source file never
	// spells out the literal closing-script-tag sequence anywhere.
	$: jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				name: 'Ergo Basics',
				url: 'https://ergo-basics.github.io/',
				description: $t('home.meta.description'),
				inLanguage: ['en', 'es']
			},
			{
				'@type': 'Organization',
				name: 'Ergo Basics',
				url: 'https://ergo-basics.github.io/',
				logo: 'https://ergo-basics.github.io/og-image.png',
				sameAs: ['https://github.com/ergo-basics/ergo-basics.github.io']
			}
		]
	});
	$: jsonLdTag = '<script type="application/ld+json">' + jsonLd + '<' + '/script>';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:wght@500;700;800&family=Noto+Naskh+Arabic:wght@500;700;800&family=Noto+Sans+Arabic:wght@400;700&family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@500;700;800&display=swap"
		rel="stylesheet"
	/>
	<!-- Sitewide identity, once, for rich results — per-page facts
	     (title/description/canonical) come from each route's SeoMeta. -->
	{@html jsonLdTag}
</svelte:head>

<AmbientBackground />
<FloatingControls />

<slot />
