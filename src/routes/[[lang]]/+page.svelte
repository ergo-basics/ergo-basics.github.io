<script>
	/*
	 * Landing page.
	 *
	 * The page alternates between two registers. Above and between the
	 * reading blocks are scroll-pinned procedural canvas scenes, which
	 * carry the ideas that are genuinely easier to see than to read —
	 * a data input being read without being spent, a threshold lighting
	 * only the branches it needs, rent sweeping a field of dormant
	 * boxes. Everything else is an ordinary article of cards.
	 *
	 * Under prefers-reduced-motion PinnedScene drops the pin and the
	 * scrub, paints one final frame, and renders every caption beat
	 * stacked — same words, plain document.
	 */
	import { onMount } from 'svelte';
	import { t, href } from '$lib/i18n/index.js';
	import SectionIndex from '$lib/components/SectionIndex.svelte';
	import GoToTop from '$lib/components/GoToTop.svelte';
	import PinnedScene from '$lib/components/immersive/PinnedScene.svelte';
	import SceneBeat from '$lib/components/immersive/SceneBeat.svelte';
	import { homeScenes } from '$lib/components/home/scenes.js';
	import { startSmoothScroll } from '$lib/motion.js';

	const scene = Object.fromEntries(homeScenes.map((s) => [s.id, s]));

	$: sections = Object.keys($t('home.index.sections')).map((id) => ({
		id,
		labelKey: `home.index.sections.${id}`
	}));

	onMount(() => startSmoothScroll());
</script>

<svelte:head>
	<title>{$t('home.meta.title')}</title>
	<meta name="description" content={$t('home.meta.description')} />
	<meta name="theme-color" content="#171717" />
	<meta property="og:title" content={$t('home.meta.title')} />
	<meta property="og:description" content={$t('home.meta.description')} />
	<meta property="og:type" content="website" />
</svelte:head>

<SectionIndex {sections} />

<main>
	<section class="hero" id="top">
		<div class="orb orb-a"></div>
		<div class="orb orb-b"></div>
		<div class="hero-inner">
			<p class="eyebrow">{$t('home.hero.eyebrow')}</p>
			<div class="mark" aria-hidden="true"><span>Σ</span></div>
			<h1>{$t('home.hero.title')}</h1>
			<p class="hero-copy">{$t('home.hero.body')}</p>
			<div class="actions">
				<a class="primary" href={$href('/technology')}>{$t('home.hero.primary')} <span>↗</span></a>
				<a href="#applications">{$t('home.hero.secondary')} <span>↓</span></a>
			</div>
			<p class="note">{$t('home.hero.note')}</p>
		</div>
	</section>

	<!-- ===================== SCENE: boxes ===================== -->
	<PinnedScene
		id="boxes"
		label={$t('home.scenes.boxes.label')}
		align={scene.boxes.align}
		draw={scene.boxes.draw}
		scrollLength={scene.boxes.scrollLength}
		let:progress
		let:isStatic
	>
		<div class="beats">
			{#each $t('home.scenes.boxes.beats') as beat, i}
				<SceneBeat
					{progress}
					{isStatic}
					from={scene.boxes.beats[i].from}
					to={scene.boxes.beats[i].to}
					hold={scene.boxes.beats[i].hold}
				>
					<h2>{beat.h}</h2>
					<p>{@html beat.p}</p>
				</SceneBeat>
			{/each}
		</div>
	</PinnedScene>

	<!-- ===================== SCENE: sigma ===================== -->
	<PinnedScene
		id="sigma"
		label={$t('home.scenes.sigma.label')}
		align={scene.sigma.align}
		draw={scene.sigma.draw}
		scrollLength={scene.sigma.scrollLength}
		let:progress
		let:isStatic
	>
		<div class="beats">
			{#each $t('home.scenes.sigma.beats') as beat, i}
				<SceneBeat
					{progress}
					{isStatic}
					from={scene.sigma.beats[i].from}
					to={scene.sigma.beats[i].to}
					hold={scene.sigma.beats[i].hold}
				>
					<h2>{beat.h}</h2>
					<p>{@html beat.p}</p>
				</SceneBeat>
			{/each}
		</div>
	</PinnedScene>

	<div class="ground">
		<section class="block" id="foundations">
			<p class="eyebrow">{$t('home.foundations.eyebrow')}</p>
			<h2>{$t('home.foundations.title')}</h2>
			<p class="intro">{$t('home.foundations.intro')}</p>
			<div class="grid">
				{#each $t('home.foundations.cards') as card}
					<article class="card"><h3>{card.title}</h3><p>{card.text}</p></article>
				{/each}
			</div>
		</section>

		<section class="block boxes">
			<p class="eyebrow">{$t('home.boxes.eyebrow')}</p>
			<h2>{$t('home.boxes.title')}</h2>
			<p class="intro">{$t('home.boxes.intro')}</p>
			<div class="box-visual" aria-hidden="true">
				<div class="registers">
					{#each ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'] as r, i}
						<span class:optional={i > 3}>{r}</span>
					{/each}
				</div>
				<div class="box-label">ERG · TOKENS · ERGOSCRIPT · DATA</div>
			</div>
			<div class="steps">
				{#each $t('home.boxes.points') as item}
					<article><b>{item.n}</b><div><h3>{item.title}</h3><p>{item.text}</p></div></article>
				{/each}
			</div>
		</section>

		<section class="block">
			<p class="eyebrow">{$t('home.proofs.eyebrow')}</p>
			<h2>{$t('home.proofs.title')}</h2>
			<p class="intro">{$t('home.proofs.intro')}</p>
			<blockquote>{$t('home.proofs.quote')}</blockquote>
			<div class="grid">
				{#each $t('home.proofs.cards') as card}
					<article class="card"><h3>{card.title}</h3><p>{card.text}</p></article>
				{/each}
			</div>
		</section>
	</div>

	<!-- ===================== SCENE: proof of work ===================== -->
	<PinnedScene
		id="pow"
		label={$t('home.scenes.pow.label')}
		align={scene.pow.align}
		draw={scene.pow.draw}
		scrollLength={scene.pow.scrollLength}
		let:progress
		let:isStatic
	>
		<div class="beats">
			{#each $t('home.scenes.pow.beats') as beat, i}
				<SceneBeat
					{progress}
					{isStatic}
					from={scene.pow.beats[i].from}
					to={scene.pow.beats[i].to}
					hold={scene.pow.beats[i].hold}
				>
					<h2>{beat.h}</h2>
					<p>{@html beat.p}</p>
				</SceneBeat>
			{/each}
		</div>
	</PinnedScene>

	<div class="ground">
		<section class="block">
			<p class="eyebrow">{$t('home.pow.eyebrow')}</p>
			<h2>{$t('home.pow.title')}</h2>
			<p class="intro">{$t('home.pow.intro')}</p>
			<div class="grid grid-2">
				{#each $t('home.pow.cards') as card}
					<article class="card"><h3>{card.title}</h3><p>{card.text}</p></article>
				{/each}
			</div>
			<div class="notes">
				<article class="note-card">
					<h3>{$t('home.pow.historyTitle')}</h3>
					<p>{@html $t('home.pow.historyBody')}</p>
				</article>
				<article class="note-card">
					<h3>{$t('home.pow.lithosTitle')}</h3>
					<p>{@html $t('home.pow.lithosBody')}</p>
				</article>
			</div>
		</section>
	</div>

	<!-- ===================== SCENE: storage rent ===================== -->
	<PinnedScene
		id="rent"
		label={$t('home.scenes.rent.label')}
		align={scene.rent.align}
		draw={scene.rent.draw}
		scrollLength={scene.rent.scrollLength}
		let:progress
		let:isStatic
	>
		<div class="beats">
			{#each $t('home.scenes.rent.beats') as beat, i}
				<SceneBeat
					{progress}
					{isStatic}
					from={scene.rent.beats[i].from}
					to={scene.rent.beats[i].to}
					hold={scene.rent.beats[i].hold}
				>
					<h2>{beat.h}</h2>
					<p>{@html beat.p}</p>
				</SceneBeat>
			{/each}
		</div>
	</PinnedScene>

	<div class="ground">
		<section class="block">
			<p class="eyebrow">{$t('home.rent.eyebrow')}</p>
			<h2>{$t('home.rent.title')}</h2>
			<p class="intro">{$t('home.rent.intro')}</p>
			<div class="stats">
				{#each $t('home.rent.stats') as stat}
					<div><strong>{stat.value}</strong><span>{stat.label}</span></div>
				{/each}
			</div>
			<div class="grid">
				{#each $t('home.rent.cards') as card}
					<article class="card"><h3>{card.title}</h3><p>{card.text}</p></article>
				{/each}
			</div>
			<h3 class="sub">{$t('home.rent.eipsTitle')}</h3>
			<div class="source-links">
				{#each $t('home.rent.eips') as link}
					<a href={link.href} target="_blank" rel="noopener noreferrer"
						>{link.label}<span aria-hidden="true">↗</span></a
					>
				{/each}
			</div>
		</section>

		<!-- ===================== Four pillars ===================== -->
		<section class="block pillars" id="pillars">
			<p class="eyebrow">{$t('home.pillars.eyebrow')}</p>
			<h2>{$t('home.pillars.title')}</h2>
			<p class="intro">{$t('home.pillars.intro')}</p>
			<div class="pillar-list">
				{#each $t('home.pillars.items') as item}
					<a class="pillar" href={item.anchor}>
						<b>{item.n}</b>
						<div><h3>{item.title}</h3><p>{item.text}</p></div>
					</a>
				{/each}
			</div>
			<p class="caveat">{$t('home.pillars.note')}</p>
		</section>

		<!-- ===================== Stablecoins ===================== -->
		<section class="block" id="stablecoins">
			<p class="eyebrow">{$t('home.stablecoins.eyebrow')}</p>
			<h2>{$t('home.stablecoins.title')}</h2>
			<p class="intro">{$t('home.stablecoins.intro')}</p>
			<div class="grid grid-2 apps">
				{#each $t('home.stablecoins.cards') as card}
					<a class="card" href={card.link} target="_blank" rel="noopener noreferrer">
						<h3>{card.title} <small>↗</small></h3>
						<span class="status">{card.status}</span>
						<p>{@html card.text}</p>
					</a>
				{/each}
			</div>
			<article class="note-card wide">
				<h3>{$t('home.stablecoins.concernsTitle')}</h3>
				<p>{@html $t('home.stablecoins.concernsBody')}</p>
			</article>
		</section>
	</div>

	<!-- ===================== SCENE: mutual credit ===================== -->
	<PinnedScene
		id="credit"
		label={$t('home.scenes.credit.label')}
		align={scene.credit.align}
		draw={scene.credit.draw}
		scrollLength={scene.credit.scrollLength}
		let:progress
		let:isStatic
	>
		<div class="beats">
			{#each $t('home.scenes.credit.beats') as beat, i}
				<SceneBeat
					{progress}
					{isStatic}
					from={scene.credit.beats[i].from}
					to={scene.credit.beats[i].to}
					hold={scene.credit.beats[i].hold}
				>
					<h2>{beat.h}</h2>
					<p>{@html beat.p}</p>
				</SceneBeat>
			{/each}
		</div>
	</PinnedScene>

	<div class="ground">
		<section class="block">
			<p class="eyebrow">{$t('home.credit.eyebrow')}</p>
			<h2>{$t('home.credit.title')}</h2>
			<p class="intro">{$t('home.credit.intro')}</p>
			<div class="grid grid-2">
				{#each $t('home.credit.cards') as card}
					<article class="card"><h3>{card.title}</h3><p>{@html card.text}</p></article>
				{/each}
			</div>
			<div class="notes">
				<article class="note-card">
					<h3>{$t('home.credit.lineageTitle')}</h3>
					<p>{@html $t('home.credit.lineageBody')}</p>
				</article>
				<article class="note-card warn">
					<h3>{$t('home.credit.statusTitle')}</h3>
					<p>{@html $t('home.credit.statusBody')}</p>
				</article>
			</div>
			<div class="source-links">
				{#each $t('home.credit.links') as link}
					<a href={link.href} target="_blank" rel="noopener noreferrer"
						>{link.label}<span aria-hidden="true">↗</span></a
					>
				{/each}
			</div>
		</section>

		<!-- ===================== kushti's vision ===================== -->
		<section class="block vision" id="vision">
			<p class="eyebrow">{$t('home.vision.eyebrow')}</p>
			<h2>{$t('home.vision.title')}</h2>
			<p class="intro">{$t('home.vision.intro')}</p>

			<article class="note-card wide diagnosis">
				<h3>{$t('home.vision.diagnosis.title')}</h3>
				<p>{$t('home.vision.diagnosis.body')}</p>
			</article>

			<h3 class="sub">{$t('home.vision.tracksTitle')}</h3>
			<div class="pillar-list">
				{#each $t('home.vision.tracks') as item}
					<article class="pillar static">
						<b>{item.n}</b>
						<div><h3>{item.title}</h3><p>{item.text}</p></div>
					</article>
				{/each}
			</div>

			<article class="note-card wide">
				<h3>{$t('home.vision.supportTitle')}</h3>
				<p>{@html $t('home.vision.supportBody')}</p>
			</article>

			<div class="grid grid-2">
				{#each $t('home.vision.cards') as card}
					<article class="card"><h3>{card.title}</h3><p>{card.text}</p></article>
				{/each}
			</div>
		</section>

		<section class="block" id="economics">
			<p class="eyebrow">{$t('home.economics.eyebrow')}</p>
			<h2>{$t('home.economics.title')}</h2>
			<p class="intro">{$t('home.economics.intro')}</p>
			<div class="stats">
				{#each $t('home.economics.stats') as stat}
					<div><strong>{stat.value}</strong><span>{stat.label}</span></div>
				{/each}
			</div>
			<p class="wide-copy">{$t('home.economics.body')}</p>
		</section>

		<section class="block" id="applications">
			<p class="eyebrow">{$t('home.applications.eyebrow')}</p>
			<h2>{$t('home.applications.title')}</h2>
			<p class="intro">{$t('home.applications.intro')}</p>
			<div class="grid apps">
				{#each $t('home.applications.cards') as card}
					<a class="card" href={card.link} target="_blank" rel="noopener noreferrer">
						<h3>{card.title} <small>↗</small></h3>
						<p>{card.text}</p>
					</a>
				{/each}
			</div>
		</section>

		<section class="block" id="community">
			<p class="eyebrow">{$t('home.community.eyebrow')}</p>
			<h2>{$t('home.community.title')}</h2>
			<p class="intro">{$t('home.community.intro')}</p>
			<div class="grid apps">
				{#each $t('home.community.cards') as card}
					<a class="card" href={card.link} target="_blank" rel="noopener noreferrer">
						<h3>{card.title} <small>↗</small></h3>
						<p>{card.text}</p>
					</a>
				{/each}
			</div>
		</section>

		<section class="block manifesto" id="mission">
			<p class="eyebrow">{$t('home.mission.eyebrow')}</p>
			<h2>{$t('home.mission.title')}</h2>
			<p>{$t('home.mission.body')}</p>
			<div class="actions">
				{#each $t('home.mission.links') as link}
					<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span>↗</span></a
					>
				{/each}
			</div>
		</section>

		<section class="block sources" id="sources">
			<p class="eyebrow">{$t('home.sources.eyebrow')}</p>
			<h2>{$t('home.sources.title')}</h2>
			<p class="intro">{$t('home.sources.body')}</p>
			<div class="source-links">
				{#each $t('home.sources.links') as link}
					<a href={link.href} target="_blank" rel="noopener noreferrer"
						>{link.label}<span aria-hidden="true">↗</span></a
					>
				{/each}
			</div>
		</section>
	</div>
</main>

<GoToTop />

<style>
	:global(body) {
		background: var(--surface);
	}
	main {
		position: relative;
		z-index: 1;
	}

	/* ---------- hero ---------- */
	.hero {
		min-height: 100svh;
		display: grid;
		place-items: center;
		overflow: hidden;
		position: relative;
		padding: 80px 24px;
		background:
			radial-gradient(circle at 50% 25%, rgba(255, 94, 24, 0.12), transparent 42%),
			linear-gradient(180deg, var(--surface-deep), var(--surface));
	}
	.hero-inner {
		max-width: 970px;
		text-align: center;
		position: relative;
		z-index: 2;
	}
	.eyebrow {
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent-text);
		font-weight: 800;
	}
	.mark {
		width: 86px;
		height: 86px;
		margin: 25px auto;
		border: 2px solid var(--accent);
		transform: rotate(45deg);
		display: grid;
		place-items: center;
		box-shadow: 0 0 55px rgba(255, 94, 24, 0.2);
	}
	.mark span {
		font: 700 2.7rem var(--font-heading);
		color: var(--accent-text);
		transform: rotate(-45deg);
	}
	h1 {
		font-size: clamp(3rem, 8vw, 7.2rem);
		line-height: 0.95;
		letter-spacing: -0.045em;
		margin: 0;
		color: var(--on-surface);
		max-width: 1000px;
	}
	.hero-copy {
		max-width: 720px;
		margin: 30px auto;
		color: var(--on-surface-muted);
		font-size: clamp(1.05rem, 2vw, 1.35rem);
	}
	.actions {
		display: flex;
		justify-content: center;
		gap: 12px;
		flex-wrap: wrap;
		margin: 30px 0;
	}
	.actions a {
		padding: 13px 20px;
		border: 1px solid var(--border-strong);
		border-radius: 999px;
		color: var(--on-surface);
		text-decoration: none;
		font-weight: 700;
	}
	.actions a.primary,
	.actions a:hover {
		background: var(--accent);
		color: var(--on-accent);
		border-color: var(--accent);
	}
	.note {
		font-size: 0.76rem;
		color: var(--on-surface-subtle);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	/* ---------- scene captions ----------
	   In motion mode the beats stack in one grid cell and cross-fade, so
	   the column needs a reserved height or the page would reflow on
	   every beat change. */
	.beats {
		display: grid;
		min-height: 15.5em;
	}
	.beats :global(h2) {
		font-size: clamp(1.7rem, 3.4vw, 2.6rem);
		line-height: 1.08;
		letter-spacing: -0.03em;
		margin: 0 0 14px;
		color: var(--on-surface);
	}
	.beats :global(p) {
		margin: 0;
		color: var(--on-surface-muted);
		font-size: 1.02rem;
		line-height: 1.65;
	}
	.beats :global(strong) {
		color: var(--accent-text);
	}

	/* ---------- grounded article ---------- */
	.ground {
		max-width: 1100px;
		margin: auto;
		padding: 0 24px 100px;
	}
	.block {
		padding: 110px 0 20px;
		border-top: 1px solid var(--border);
	}
	.block h2 {
		font-size: clamp(2.2rem, 5vw, 4.6rem);
		line-height: 1.02;
		letter-spacing: -0.035em;
		max-width: 850px;
		margin: 12px 0 22px;
	}
	.intro {
		max-width: 760px;
		color: var(--on-surface-muted);
		font-size: 1.1rem;
	}
	h3.sub {
		margin: 54px 0 0;
		font-size: 1.05rem;
		color: var(--on-surface);
		letter-spacing: 0.01em;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
		margin-top: 44px;
	}
	.grid-2 {
		grid-template-columns: repeat(2, 1fr);
	}
	.card {
		background: var(--surface-raised);
		padding: 27px;
		border: 1px solid var(--border);
		border-top: 3px solid var(--accent);
		border-radius: 12px;
		text-decoration: none;
		box-shadow: var(--shadow-sm);
	}
	.card h3 {
		margin: 0 0 12px;
		color: var(--accent-text);
		font-size: 1.25rem;
	}
	.card p,
	.wide-copy {
		color: var(--on-surface-muted);
		margin: 0;
	}
	.card :global(strong) {
		color: var(--on-surface);
	}
	.apps .card {
		transition:
			0.2s transform,
			0.2s box-shadow;
	}
	.apps .card:hover {
		transform: translateY(-5px);
		box-shadow: var(--shadow-md);
	}
	.status {
		display: inline-block;
		margin: 0 0 12px;
		padding: 4px 10px;
		border-radius: 999px;
		background: var(--accent-soft);
		color: var(--accent-text);
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	/* Notes: a quieter card for caveats, history and status honesty. */
	.notes {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 18px;
		margin-top: 18px;
	}
	.note-card {
		background: var(--surface-alt);
		border: 1px solid var(--border);
		border-left: 3px solid var(--border-strong);
		border-radius: 12px;
		padding: 24px;
	}
	.note-card.wide {
		margin-top: 24px;
	}
	.note-card h3 {
		margin: 0 0 10px;
		font-size: 1.05rem;
		color: var(--on-surface);
	}
	.note-card p {
		margin: 0;
		color: var(--on-surface-muted);
		line-height: 1.65;
	}
	.note-card :global(strong) {
		color: var(--accent-text);
	}
	.note-card :global(a) {
		color: var(--accent-text);
	}
	.note-card.warn {
		border-left-color: var(--accent);
	}
	.diagnosis {
		margin-top: 34px;
	}

	/* Numbered progressions: the four pillars and the three tracks. */
	.pillar-list {
		display: grid;
		gap: 14px;
		margin-top: 34px;
	}
	.pillar {
		display: flex;
		gap: 20px;
		padding: 24px;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface-raised);
		text-decoration: none;
		transition:
			0.2s transform,
			0.2s border-color;
	}
	.pillar:not(.static):hover {
		transform: translateX(5px);
		border-color: var(--accent);
	}
	.pillar b {
		color: var(--accent-text);
		font: 700 1.5rem var(--font-heading);
		line-height: 1;
		min-width: 42px;
	}
	.pillar h3 {
		margin: 0 0 8px;
		font-size: 1.15rem;
		color: var(--on-surface);
	}
	.pillar p {
		margin: 0;
		color: var(--on-surface-muted);
	}
	.caveat {
		margin-top: 24px;
		font-size: 0.9rem;
		color: var(--on-surface-subtle);
		max-width: 780px;
	}

	.box-visual {
		margin: 45px 0;
		background: var(--surface-deep);
		border: 2px solid var(--accent);
		padding: 24px;
		border-radius: 10px;
		box-shadow: 12px 12px 0 var(--accent-soft);
	}
	.registers {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 7px;
	}
	.registers span {
		display: grid;
		place-items: center;
		aspect-ratio: 1;
		border-radius: 5px;
		background: var(--accent);
		color: var(--on-accent);
		font-weight: 800;
	}
	.registers span.optional {
		background: transparent;
		border: 1px dashed var(--accent);
		color: var(--accent-text);
	}
	.box-label {
		text-align: center;
		color: var(--on-surface-subtle);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		margin-top: 20px;
	}
	.steps {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}
	.steps article {
		display: flex;
		gap: 17px;
	}
	.steps b {
		color: var(--accent-text);
		font-size: 0.75rem;
	}
	.steps h3 {
		margin: 0 0 6px;
	}
	.steps p {
		color: var(--on-surface-muted);
		margin: 0;
	}
	blockquote {
		font: 500 clamp(1.35rem, 3vw, 2rem) var(--font-heading);
		border-left: 4px solid var(--accent);
		margin: 40px 0;
		padding: 10px 0 10px 28px;
		max-width: 820px;
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border: 1px solid var(--border);
		margin: 42px 0;
	}
	.stats div {
		padding: 25px;
		border-right: 1px solid var(--border);
	}
	.stats div:last-child {
		border: 0;
	}
	.stats strong {
		display: block;
		color: var(--accent-text);
		font: 700 clamp(1.6rem, 3vw, 2.4rem) var(--font-heading);
	}
	.stats span {
		display: block;
		color: var(--on-surface-subtle);
		font-size: 0.82rem;
		margin-top: 5px;
	}
	.manifesto {
		background: var(--surface-deep);
		padding: 65px;
		border-radius: 18px;
		margin-top: 100px;
	}
	.manifesto > p:not(.eyebrow) {
		font: 500 clamp(1.25rem, 2.5vw, 1.75rem) var(--font-heading);
		color: var(--on-surface-muted);
		max-width: 850px;
	}
	.source-links {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 30px;
	}
	.source-links a {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 16px;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		color: var(--on-surface);
	}
	.source-links a:hover {
		color: var(--accent-text);
	}

	@media (max-width: 900px) {
		.grid,
		.grid-2,
		.notes {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 760px) {
		.steps,
		.stats,
		.source-links {
			grid-template-columns: 1fr;
		}
		.stats div {
			border-right: 0;
			border-bottom: 1px solid var(--border);
		}
		.registers {
			grid-template-columns: repeat(5, 1fr);
		}
		.manifesto {
			padding: 34px 24px;
		}
		.block {
			padding-top: 80px;
		}
		.pillar {
			flex-direction: column;
			gap: 10px;
		}
		.beats {
			min-height: 0;
		}
	}
</style>
