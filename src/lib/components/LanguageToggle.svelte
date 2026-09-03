<script>
	/*
	 * LanguageToggle — the entry point into every locale.
	 *
	 * With two languages this used to be a single tap: show the code of
	 * the OTHER language, tap to switch to it. With three (and room for
	 * more), that stops working — there is no single "other" to jump to
	 * — so this is now a small menu button instead: the same 44px circle
	 * as the theme control beside it, opening a short list of every
	 * locale on click.
	 *
	 * The button itself always shows the ACTIVE language's short code,
	 * not "what you'd switch to" (that was the old toggle's logic) —
	 * with a menu, the button is a label for what's open, and the menu
	 * items are the actions.
	 */
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { restoreScrollPosition } from '$lib/motion.js';
	import {
		locale,
		setLocale,
		applyLocale,
		LOCALES,
		t,
		withLocale,
		stripLocalePrefix
	} from '$lib/i18n/index.js';

	// Keep <html lang> in sync with the store across every route.
	$: applyLocale($locale);
	$: current = LOCALES.find((l) => l.code === $locale) || LOCALES[0];
	// CJK short codes (中文, 日本語) are drawn in full-width glyphs, which
	// read too big at the Latin short-code size in the same 44px circle —
	// and a 3-glyph code needs to shrink further than a 2-glyph one to
	// keep fitting. Detected by script rather than a hardcoded language
	// list, so any future CJK addition sizes itself correctly for free.
	$: isCJK = /[぀-ヿ㐀-鿿豈-﫿ｦ-ﾟ]/.test(current.short);
	$: codeLength = [...current.short].length;

	let open = false;
	/** @type {HTMLElement | undefined} */
	let root;

	function toggle() {
		open = !open;
	}

	// Picking a language does two things: it becomes the active locale
	// right away (so the page re-renders in it immediately, same as
	// before), AND it navigates to that language's shareable URL — the
	// unprefixed path for English, `/es/…` etc. for everything else.
	// `setLocale` is awaited first so the destination's dictionary is
	// already cached by the time `goto` triggers that route's `load()`.
	async function pick(/** @type {string} */ code) {
		open = false;
		if (code === $locale) return;
		const scrollPosition = window.scrollY;
		await setLocale(code);
		const bare = stripLocalePrefix($page.url.pathname);
		await goto(withLocale(bare, code) + $page.url.search + $page.url.hash, { noScroll: true });
		restoreScrollPosition(scrollPosition);
	}

	function onKeydown(/** @type {KeyboardEvent} */ event) {
		if (event.key === 'Escape') open = false;
	}

	// Close on any click outside the control, same pattern as a native
	// <select> — no backdrop, no focus trap needed for a 3-item list.
	function onWindowClick(/** @type {MouseEvent} */ event) {
		if (open && root && !root.contains(/** @type {Node} */ (event.target))) open = false;
	}
</script>

<svelte:window on:click={onWindowClick} on:keydown={onKeydown} />

<div class="lang-control" bind:this={root}>
	<button
		class="lang-toggle"
		on:click={toggle}
		aria-label={$t('common.switchLanguage')}
		aria-haspopup="menu"
		aria-expanded={open}
		title={$t('common.languageLabel')}
	>
		<span
			class="code"
			class:wide={isCJK && codeLength === 2}
			class:wider={isCJK && codeLength >= 3}>{current.short}</span
		>
	</button>

	{#if open}
		<ul class="lang-menu" role="menu">
			{#each LOCALES as l}
				<li role="none">
					<button
						role="menuitemradio"
						aria-checked={l.code === $locale}
						class:active={l.code === $locale}
						lang={l.code}
						dir={l.dir || 'ltr'}
						on:click={() => pick(l.code)}
					>
						{l.label}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.lang-control {
		position: relative;
	}

	.lang-toggle {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--accent-text);
		background: rgba(var(--surface-rgb), 0.82);
		border: 1px solid var(--border-strong);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow: var(--shadow-sm);
		transition: background 0.25s ease, transform 0.2s ease, border-color 0.25s ease,
			color 0.25s ease;
	}

	.lang-toggle:hover {
		transform: scale(1.08);
		background: var(--surface);
		border-color: var(--accent);
	}

	.lang-toggle:focus-visible {
		outline: 2px solid var(--accent-text);
		outline-offset: 3px;
	}

	.code {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.86rem;
		letter-spacing: 0.06em;
	}

	.code.wide {
		font-size: 0.72rem;
		letter-spacing: 0;
	}

	/* A 3-glyph CJK code (日本語) needs to shrink further than a 2-glyph
	   one (中文) to keep fitting inside the same 44px circle. */
	.code.wider {
		font-size: 0.56rem;
		letter-spacing: -0.02em;
	}

	.lang-menu {
		position: absolute;
		top: calc(100% + 8px);
		inset-inline-end: 0;
		min-width: 128px;
		margin: 0;
		padding: 6px;
		list-style: none;
		background: var(--surface);
		border: 1px solid var(--border-strong);
		border-radius: 12px;
		box-shadow: var(--shadow-md);
		z-index: 61;
	}

	.lang-menu button {
		width: 100%;
		display: block;
		text-align: start;
		padding: 8px 10px;
		border-radius: 8px;
		border: none;
		background: none;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: 0.92rem;
		color: var(--on-surface);
		transition: background-color 0.15s ease, color 0.15s ease;
	}

	.lang-menu button:hover {
		background-color: var(--accent-soft);
	}

	.lang-menu button.active {
		color: var(--accent-text);
		font-weight: 700;
	}
</style>
