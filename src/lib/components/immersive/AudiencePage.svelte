<script>
	/*
	 * AudiencePage — the single implementation behind /depin,
	 * /developers and /users.
	 *
	 * Those three pages tell different stories with identical machinery:
	 * a topbar, an immersive hero, four scroll-pinned procedural scenes
	 * with three caption beats each, then a grounded article of cards,
	 * numbered steps, an optional trade-off table, sibling-role links
	 * and a closing CTA. They used to be three near-identical files —
	 * around 800 lines apiece, with style blocks that differed only in a
	 * class name and one min-height.
	 *
	 * Now each route supplies only what genuinely differs:
	 *
	 *   • `page`   — which namespace of the dictionary to read from, so
	 *                every word (in every language) comes from i18n.
	 *   • `scenes` — the draw functions and their scroll timings, which
	 *                are layout, not copy.
	 *   • the hrefs, which are structure, not copy.
	 *
	 * Sections render only when the dictionary defines them (/depin has
	 * no trade-off table), so adding or dropping one is a dictionary
	 * edit rather than a markup edit.
	 *
	 * Reduced motion → no pins, no scrubs, one static frame per canvas,
	 * every beat rendered stacked. Same words, plain article.
	 */

	import { onMount } from 'svelte';
	import SiteTopbar from './SiteTopbar.svelte';
	import ImmersiveHero from './ImmersiveHero.svelte';
	import PinnedScene from './PinnedScene.svelte';
	import SceneBeat from './SceneBeat.svelte';
	import SectionIndex from '$lib/components/SectionIndex.svelte';
	import { startSmoothScroll, loadGsap, prefersReducedMotion, scrollTo } from '$lib/motion.js';
	import { t, exists, href } from '$lib/i18n/index.js';

	/** @type {string} Dictionary namespace: 'depin' | 'developers' | 'users'. */
	export let page;
	/**
	 * [{ id, draw, scrollLength, align, beats: [{ from, to, hold }] }]
	 * Copy for each scene is read from `<page>.scenes.<id>`; the beats
	 * array here only carries timings, paired by index.
	 * @type {Array<{ id: string, draw: (ctx: any, frame: any) => void, scrollLength: number, align?: string, beats: Array<{ from: number, to: number, hold?: boolean }> }>}
	 */
	export let scenes = [];
	/** @type {Array<{ href: string, primary?: boolean, external?: boolean }>} Hero buttons, paired by index with `<page>.hero.actions`. */
	export let heroActions = [];
	/** @type {string[]} Role-card links, paired by index with `<page>.roles.items`. */
	export let roleLinks = [];
	/** @type {Array<{ href: string, external?: boolean }>} CTA buttons, paired by index with `<page>.cta.actions`. */
	export let ctaActions = [];
	/**
	 * The beats column is a fixed-height grid so cross-fading captions
	 * never reflow the page. Longest beat wins, and that differs per
	 * page, so the route sets it.
	 */
	export let beatsMinHeight = '16.5em';

	// Optional sections are gated on `$exists` rather than `$t`, so an
	// intentional absence (/depin has no trade-off table) is not reported
	// as a missing translation.

	/*
	 * Section index (the left rail / mobile FAB).
	 *
	 * These pages are as long as the landing page — four pinned scenes
	 * plus up to five grounded blocks — and had no way to see their own
	 * shape or jump within it. The list is derived rather than declared:
	 * every scene, then whichever grounded blocks this page's dictionary
	 * actually defines, in the order they render. That way a route that
	 * gains or loses a block gets the right rail for free, and the rail
	 * can never list an anchor that isn't on the page.
	 *
	 * `groundBlocks` is also what the markup iterates for its ids, so the
	 * two orders are the same order by construction.
	 */
	const GROUND_BLOCKS = [
		'payoff',
		'responsibilities',
		'distribution',
		'steps',
		'tradeoffs',
		'roles',
		'cta'
	];

	$: indexSections = [
		...scenes.map((s) => ({ id: s.id, labelKey: `${page}.index.sections.${s.id}` })),
		...GROUND_BLOCKS.filter((b) => $exists(`${page}.${b}`)).map((b) => ({
			id: b,
			labelKey: `${page}.index.sections.${b}`
		}))
	];

	/** @type {HTMLElement | undefined} */
	let revealRoot;

	onMount(() => {
		let stopScroll = () => {};
		let cleanupGsap = () => {};
		let cancelled = false;

		startSmoothScroll().then((stop) => {
			if (cancelled) stop();
			else stopScroll = stop;
		});

		if (prefersReducedMotion()) return () => {};

		loadGsap().then((bits) => {
			if (!bits || cancelled || !revealRoot) return;
			const { gsap, ScrollTrigger } = bits;
			const scope = gsap.context(() => {
				// Light reveals for the non-pinned sections below the scenes.
				gsap.utils.toArray('[data-reveal]').forEach((el) => {
					gsap.from(el, {
						y: 28,
						opacity: 0,
						duration: 0.7,
						ease: 'power2.out',
						scrollTrigger: { trigger: el, start: 'top 88%' }
					});
				});
				gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
					gsap.from(group.children, {
						y: 26,
						opacity: 0,
						duration: 0.6,
						ease: 'power2.out',
						stagger: 0.07,
						scrollTrigger: { trigger: group, start: 'top 85%' }
					});
				});
			}, revealRoot);

			// Pins are created by child components; one refresh once fonts
			// and images have settled keeps every start/end accurate.
			ScrollTrigger.refresh();
			cleanupGsap = () => scope.revert();
		});

		return () => {
			cancelled = true;
			stopScroll();
			cleanupGsap();
		};
	});

	function toTop(event) {
		event.preventDefault();
		scrollTo(0);
	}
</script>

<svelte:head>
	<title>{$t(`${page}.meta.title`)}</title>
	<meta name="description" content={$t(`${page}.meta.description`)} />
</svelte:head>

<div id="top" class="audience-page" style={`--beats-min-h: ${beatsMinHeight};`}>
	<SiteTopbar title={$t(`${page}.topbarTitle`)} />

	<SectionIndex sections={indexSections} />

	<main>
		<ImmersiveHero
			eyebrow={$t(`${page}.hero.eyebrow`)}
			title={$t(`${page}.hero.title`)}
			tagline={$t(`${page}.hero.tagline`)}
			lede={$t(`${page}.hero.lede`)}
			actions={$t(`${page}.hero.actions`).map((/** @type {string} */ label, /** @type {number} */ i) => ({
				...(heroActions[i] || {}),
				label
			}))}
			stats={$t(`${page}.hero.stats`)}
			firstSceneId={scenes[0]?.id}
		/>

		{#each scenes as scene}
			<PinnedScene
				id={scene.id}
				label={$t(`${page}.scenes.${scene.id}.label`)}
				align={scene.align || 'left'}
				draw={scene.draw}
				scrollLength={scene.scrollLength}
				let:progress
				let:static={isStatic}
			>
				<div class="beats" class:flow={isStatic}>
					{#each scene.beats as timing, i}
						{@const beat = $t(`${page}.scenes.${scene.id}.beats`)[i]}
						{#if beat}
							<SceneBeat
								{progress}
								{isStatic}
								from={timing.from}
								to={timing.to}
								hold={timing.hold}
							>
								<h2>{@html beat.h}</h2>
								<p>{@html beat.p}</p>
								{#if beat.note}<span class="beat-note">{beat.note}</span>{/if}
							</SceneBeat>
						{/if}
					{/each}
				</div>
			</PinnedScene>
		{/each}

		<!-- ================= Grounded content below ================= -->
		<div class="ground" bind:this={revealRoot}>
			{#if $exists(`${page}.payoff`)}
				<section class="block" id="payoff">
					<h2 data-reveal>{$t(`${page}.payoff.heading`)}</h2>
					<div class="grid" data-reveal-group>
						{#each $t(`${page}.payoff.items`) as item}
							<article class="card">
								<h3>{@html item.title}</h3>
								<p>{@html item.body}</p>
							</article>
						{/each}
					</div>
				</section>
			{/if}

			<!-- A plain two-or-more card block with an intro and an optional
			     closing note. /depin uses it for the four node responsibilities
			     the paradigm defines; /developers for how a service spreads. -->
			{#each ['responsibilities', 'distribution'] as key}
				{#if $exists(`${page}.${key}`)}
					<section class="block" id={key}>
						<h2 data-reveal>{$t(`${page}.${key}.heading`)}</h2>
						<p class="block-intro" data-reveal>{@html $t(`${page}.${key}.intro`)}</p>
						<div class="grid" data-reveal-group>
							{#each $t(`${page}.${key}.items`) as item}
								<article class="card">
									<h3>{@html item.title}</h3>
									<p>{@html item.body}</p>
								</article>
							{/each}
						</div>
						{#if $exists(`${page}.${key}.note`)}
							<span class="block-note" data-reveal>{$t(`${page}.${key}.note`)}</span>
						{/if}
					</section>
				{/if}
			{/each}

			{#if $exists(`${page}.steps`)}
				<section class="block" id="steps">
					<h2 data-reveal>{$t(`${page}.steps.heading`)}</h2>
					<ol class="flow" data-reveal-group>
						{#each $t(`${page}.steps.items`) as step, i}
							<li class="flow-step">
								<!-- Numbering is presentation, so it is generated here
								     rather than repeated in every dictionary. -->
								<span class="flow-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
								<div>
									<h3>{@html step.title}</h3>
									<p>{@html step.body}</p>
								</div>
							</li>
						{/each}
					</ol>
				</section>
			{/if}

			{#if $exists(`${page}.tradeoffs`)}
				<section class="block" id="tradeoffs">
					<h2 data-reveal>{$t(`${page}.tradeoffs.heading`)}</h2>
					<p class="block-intro" data-reveal>{@html $t(`${page}.tradeoffs.intro`)}</p>
					<div class="tradeoffs" data-reveal-group>
						{#each $t(`${page}.tradeoffs.items`) as item}
							<article class="tradeoff" class:highlight={item.highlight}>
								<h3>{@html item.label}</h3>
								<p class="good">
									<span class="tag">{$t('common.gains')}</span>{@html item.good}
								</p>
								<p class="bad">
									<span class="tag alt">{$t('common.costs')}</span>{@html item.bad}
								</p>
							</article>
						{/each}
					</div>
				</section>
			{/if}

			{#if $exists(`${page}.roles`)}
				<section class="block" id="roles">
					<h2 data-reveal>{$t(`${page}.roles.heading`)}</h2>
					<p class="block-intro" data-reveal>{@html $t(`${page}.roles.intro`)}</p>
					<div class="roles" data-reveal-group>
						{#each $t(`${page}.roles.items`) as role, i}
							<div class="role">
								<h3>{@html role.title}</h3>
								<p>{@html role.body}</p>
								<!-- The last role on /depin is the reader themselves, so
								     it deliberately has nowhere to go. -->
								{#if role.link && roleLinks[i]}
									<a class="role-link" href={$href(roleLinks[i])}>{role.link}</a>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}

			{#if $exists(`${page}.cta`)}
				<section class="cta" id="cta" data-reveal>
					<h2>{$t(`${page}.cta.heading`)}</h2>
					<p>{@html $t(`${page}.cta.body`)}</p>
					<div class="cta-actions">
						{#each $t(`${page}.cta.actions`) as label, i}
							{@const action = ctaActions[i] || {}}
							<a
								class="btn"
								class:primary={i === 0}
								class:ghost={i !== 0}
								href={$href(action.href)}
								target={action.external ? '_blank' : undefined}
								rel={action.external ? 'noopener noreferrer' : undefined}>{label}</a
							>
						{/each}
					</div>
				</section>
			{/if}
		</div>
	</main>

	<a class="to-top" href="#top" on:click={toTop} aria-label={$t('common.backToTop')}
		>{$t('common.toTop')}</a
	>
</div>

<style>
	.audience-page {
		background-color: var(--surface);
		color: var(--on-surface);
		min-height: 100vh;
		font-family: var(--font-body);
	}

	/*
	 * These pages now carry SectionIndex's fixed rail down the leading
	 * edge. The rail sits ~14px from the edge and grows to ~200px wide
	 * once a label is active, so left-aligned scene captions need a
	 * gutter wider than that or the copy renders under the dots. Only on
	 * desktop: below 1025px the rail is a FAB in the bottom corner, and
	 * below 820px the caption is a full-width scrim anyway.
	 *
	 * `margin-inline-start` rather than `margin-left`, because the rail
	 * is positioned with `inset-inline-start` — both flip together under
	 * dir="rtl".
	 */
	@media (min-width: 1025px) {
		.audience-page :global(.scene:not(.align-right):not(.is-static) .scene-copy) {
			margin-inline-start: clamp(150px, 13vw, 220px);
			width: min(520px, 100%);
		}
	}

	/* Caption beats cross-fade in the same grid cell while pinned; in the
	   static/reduced-motion path they stack as normal blocks. */
	.beats {
		display: grid;
		min-height: var(--beats-min-h, 16.5em);
	}

	.beats.flow {
		display: block;
		min-height: 0;
	}

	.beats.flow :global(.beat + .beat) {
		margin-top: 36px;
	}

	.ground {
		max-width: 1060px;
		margin: 0 auto;
		padding: 24px clamp(20px, 6vw, 24px) 110px;
	}



	.block {
		padding: 72px 0 8px;
		/* Clear the fixed topbar when the section index jumps here. */
		scroll-margin-top: 76px;
	}

	.block h2 {
		font-family: var(--font-heading);
		font-size: clamp(1.6rem, 3.2vw, 2.1rem);
		color: var(--heading);
		margin: 0 0 20px;
		padding-bottom: 10px;
		border-bottom: 2px solid var(--accent);
	}

	.block-intro {
		max-width: 760px;
		margin: 0 0 32px;
		line-height: 1.7;
		color: var(--on-surface-muted);
	}

	/* The same closing pill the scene captions use. */
	.block-note {
		display: inline-block;
		margin-top: 22px;
		padding: 7px 14px;
		border-radius: 999px;
		border: 1px solid var(--border-strong);
		background: rgba(var(--on-surface-rgb), 0.05);
		font-size: 0.86rem;
		color: var(--on-surface-muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 20px;
	}

	.card {
		background-color: var(--surface-raised);
		border: 1px solid var(--border);
		border-top: 3px solid var(--accent);
		border-radius: 12px;
		padding: 26px;
		box-shadow: var(--shadow-sm);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-md);
	}

	.card h3 {
		font-family: var(--font-heading);
		font-size: 1.2rem;
		color: var(--accent-text);
		margin: 0 0 10px;
	}

	.card p {
		margin: 0;
		line-height: 1.65;
		color: var(--on-surface-muted);
	}

	.flow {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 24px;
	}

	.flow-step {
		display: flex;
		align-items: flex-start;
		gap: 20px;
	}

	.flow-num {
		flex-shrink: 0;
		font-family: var(--font-heading);
		font-size: 1.4rem;
		font-weight: 800;
		color: var(--accent-text);
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: 2px solid var(--accent);
	}

	.flow-step h3 {
		font-family: var(--font-heading);
		font-size: 1.2rem;
		color: var(--on-surface);
		margin: 8px 0 6px;
	}

	.flow-step p {
		margin: 0;
		line-height: 1.65;
		color: var(--on-surface-muted);
	}

	/* --- Trade-off comparison --- */
	.tradeoffs {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 20px;
	}

	.tradeoff {
		background-color: var(--surface-raised);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 24px;
	}

	.tradeoff.highlight {
		border-color: var(--accent);
		box-shadow: var(--shadow-md);
	}

	.tradeoff h3 {
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--on-surface);
		margin: 0 0 16px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--border);
	}

	.tradeoff.highlight h3 {
		color: var(--accent-text);
	}

	.tradeoff p {
		margin: 0 0 14px;
		line-height: 1.6;
		font-size: 0.95rem;
		color: var(--on-surface-muted);
	}

	.tradeoff p:last-child {
		margin-bottom: 0;
	}

	.tag {
		display: inline-block;
		margin-right: 8px;
		padding: 2px 9px;
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border: 1px solid var(--accent);
		color: var(--accent-text);
	}

	.tag.alt {
		border-color: var(--border-strong);
		color: var(--on-surface-subtle);
	}

	/* --- Roles --- */
	.roles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 24px;
	}

	.role h3 {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		color: var(--accent-text);
		margin: 0 0 10px;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--border);
	}

	.role p {
		margin: 0;
		line-height: 1.65;
		color: var(--on-surface-muted);
	}

	.role-link {
		display: inline-block;
		margin-top: 12px;
		font-weight: 700;
		color: var(--accent-text);
		text-decoration: none;
		border-bottom: 1px solid var(--accent);
	}

	.role-link:hover {
		color: var(--on-surface);
	}

	/* --- CTA --- */
	.cta {
		margin-top: 72px;
		scroll-margin-top: 76px;
		text-align: center;
		background-color: var(--surface-alt);
		border: 1px solid var(--accent);
		border-radius: 18px;
		padding: 52px 24px;
	}

	.cta h2 {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 3.4vw, 2rem);
		color: var(--on-surface);
		margin: 0 0 12px;
	}

	.cta p {
		margin: 0 auto 28px;
		max-width: 620px;
		color: var(--on-surface-muted);
	}

	.cta-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		justify-content: center;
	}

	.btn {
		display: inline-block;
		padding: 13px 30px;
		border-radius: 9px;
		text-decoration: none;
		font-weight: 700;
		border: 2px solid transparent;
		transition: background-color 0.2s ease, transform 0.2s ease, color 0.2s ease,
			border-color 0.2s ease;
	}

	.btn.primary {
		background-color: var(--accent);
		color: var(--on-accent);
		border-color: var(--accent);
	}

	.btn.primary:hover {
		background-color: var(--accent-hover);
		border-color: var(--accent-hover);
		transform: translateY(-2px);
	}

	.btn.ghost {
		border-color: var(--accent);
		color: var(--accent-text);
	}

	.btn.ghost:hover {
		background-color: var(--accent-soft);
		transform: translateY(-2px);
	}

	/*
	 * Logical inset, not `right`. These pages now carry SectionIndex,
	 * whose mobile FAB is pinned to `inset-inline-start` — so under
	 * dir="rtl" a physical `right` put this control in the same bottom
	 * corner as the FAB and the two overlapped, covering body copy.
	 * `inset-inline-end` flips with the FAB and they stay on opposite
	 * corners in both directions. (GoToTop, the landing page's
	 * equivalent, already did this.)
	 */
	.to-top {
		position: fixed;
		inset-inline-end: 24px;
		bottom: 24px;
		background-color: var(--accent);
		color: var(--on-accent);
		padding: 10px 16px;
		border-radius: 999px;
		font-weight: 700;
		text-decoration: none;
		box-shadow: var(--shadow-md);
		z-index: 30;
		transition: background-color 0.2s ease, transform 0.2s ease;
	}

	.to-top:hover {
		background-color: var(--accent-hover);
		transform: translateY(-2px);
	}

	@media (max-width: 600px) {
		.flow-num {
			width: 46px;
			height: 46px;
			font-size: 1.15rem;
		}
	}

	@media (max-width: 820px) {
		.beats {
			min-height: calc(var(--beats-min-h, 16.5em) - 2em);
		}
	}
</style>