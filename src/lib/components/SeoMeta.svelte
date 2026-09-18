<script>
	/*
	 * SeoMeta — the one place canonical/hreflang/OG/Twitter tags get
	 * built, so every route (the long-scroll home page and each
	 * TopicPage) emits them the same way instead of re-deriving the
	 * same URL math per page.
	 *
	 * Each locale is self-canonical (points at its own URL, not at
	 * English) — that is what Google's own guidance asks for on
	 * translated pages; hreflang is what actually links the variants
	 * together. `x-default` falls back to the unprefixed (English)
	 * route, matching how `withLocale`/routing already treat English
	 * as the no-prefix default.
	 */
	import { page } from '$app/stores';
	import { locale, LOCALES, withLocale, stripLocalePrefix } from '$lib/i18n/index.js';

	export let title;
	export let description;
	/** Root-relative path to the share image, already sized 1200×630. */
	export let image = '/og-image.png';

	const ORIGIN = 'https://ergo-basics.github.io';
	/** @type {Record<string, string>} */
	const OG_LOCALE = { en: 'en_US', es: 'es_ES' };

	$: path = stripLocalePrefix($page.url.pathname);
	$: canonical = ORIGIN + withLocale(path, $locale);
	$: absoluteImage = ORIGIN + image;
	$: ogLocale = OG_LOCALE[$locale] || 'en_US';
	$: alternateLocales = LOCALES.filter((l) => l.code !== $locale);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="theme-color" content="#171717" />

	<link rel="canonical" href={canonical} />
	{#each LOCALES as l}
		<link rel="alternate" hreflang={l.code} href={ORIGIN + withLocale(path, l.code)} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={ORIGIN + path} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content="Ergo Basics" />
	<meta property="og:image" content={absoluteImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content={ogLocale} />
	{#each alternateLocales as l}
		<meta property="og:locale:alternate" content={OG_LOCALE[l.code] || l.code} />
	{/each}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={absoluteImage} />
</svelte:head>
