<script>
	/*
	 * SiteTopbar — the fixed bar shared by every immersive page.
	 *
	 * Before this existed each page owned a private "← Back to home"
	 * strip, so there was no way to move between the audience pages
	 * without going via the landing page. Now the three audience routes
	 * (+ the paradigm deep dive) are always one click away, and the
	 * current one is marked with aria-current.
	 *
	 * Deliberately not in +layout.svelte: the landing page has its own
	 * SectionIndex rail and hero, and a second fixed bar there would
	 * fight both of them.
	 */
	import { page } from '$app/stores';
	import { t, href, stripLocalePrefix } from '$lib/i18n/index.js';

	/** Page title shown next to the wordmark. Already translated. */
	export let title = '';
	/**
	 * `fixed` floats the bar over full-bleed canvases (the immersive
	 * pages). `sticky` keeps it in flow, which is what a normal document
	 * page like /paradigm or /install wants.
	 */
	export let position = 'fixed';

	/*
	 * `short` is the label used on narrow phones. The full set of labels
	 * is ~323px wide, which overflows the ~277px the nav actually has at
	 * 390px once the fixed theme toggle's reserved corner is subtracted —
	 * that pushed "Paradigm" off the edge behind a scrollbar-less
	 * overflow, so the last destination was effectively undiscoverable.
	 */
	// Only the destinations live here; both labels come from the
	// dictionary under topbar.links.<key>.
	const links = [
		{ key: 'depin', href: '/depin' },
		{ key: 'developers', href: '/developers' },
		{ key: 'users', href: '/users' },
		{ key: 'paradigm', href: '/paradigm' }
	];

	// Compare against the canonical, unprefixed path — /es/depin and
	// /depin both mark the "depin" nav item active.
	$: current = stripLocalePrefix($page.url.pathname.replace(/\/$/, '') || '/');
</script>

<header class="topbar" class:sticky={position === 'sticky'}>
	<a class="home-link" href={$href('/')}>
		<span aria-hidden="true">←</span>
		<span class="wordmark">CELAUT</span>
	</a>

	{#if title}
		<span class="topbar-title">{title}</span>
	{/if}

	<nav aria-label={$t('topbar.nav')}>
		<ul>
			{#each links as l}
				<li>
					<a
						href={$href(l.href)}
						class:active={current === l.href}
						aria-current={current === l.href ? 'page' : undefined}
						><span class="label-full">{$t(`topbar.links.${l.key}.label`)}</span><span
							class="label-short">{$t(`topbar.links.${l.key}.short`)}</span
						></a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	.topbar {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 12px clamp(14px, 4vw, 24px);
		/* Sits over full-bleed canvases, so it needs its own backing. */
		background-color: rgba(var(--surface-deep-rgb), 0.85);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		color: var(--on-surface);
		border-bottom: 1px solid var(--border);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
	}

	.topbar.sticky {
		position: sticky;
		left: auto;
		right: auto;
		z-index: 10;
		/* In flow it sits on a solid page, so it can be opaque. */
		background-color: var(--surface-deep);
	}

	.home-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--on-surface);
		text-decoration: none;
		font-weight: 700;
		white-space: nowrap;
	}

	.home-link:hover {
		color: var(--accent-text);
	}

	:global(html[dir='rtl']) .home-link span[aria-hidden] {
		display: inline-block;
		transform: scaleX(-1);
	}

	.wordmark {
		font-family: var(--font-heading);
		letter-spacing: 0.08em;
	}

	.topbar-title {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.02rem;
		color: var(--on-surface-muted);
		white-space: nowrap;
	}

	nav {
		margin-inline-start: auto;
		/* The language + theme controls are fixed in the inline-end corner;
		   keep the last link clear of them. */
		padding-inline-end: calc(var(--floating-controls-w) + 12px);
		min-width: 0;
	}

	nav ul {
		list-style: none;
		display: flex;
		align-items: center;
		gap: 4px;
		margin: 0;
		padding: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	nav ul::-webkit-scrollbar {
		display: none;
	}

	nav a {
		display: block;
		padding: 7px 12px;
		border-radius: 8px;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 600;
		white-space: nowrap;
		color: var(--on-surface-muted);
		transition: color 0.2s ease, background-color 0.2s ease;
	}

	nav a:hover {
		color: var(--on-surface);
		background-color: var(--accent-soft);
	}

	nav a.active {
		color: var(--accent-text);
		background-color: var(--accent-soft);
	}

	.label-short {
		display: none;
	}

	@media (max-width: 900px) {
		.topbar-title {
			display: none;
		}
	}

	@media (max-width: 560px) {
		.topbar {
			gap: 10px;
		}

		.home-link .wordmark {
			display: none;
		}

		nav a {
			padding: 7px 7px;
			font-size: 0.84rem;
		}

		.label-full {
			display: none;
		}

		.label-short {
			display: inline;
		}
	}
</style>
