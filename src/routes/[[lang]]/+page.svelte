<script>
	import { t, href } from '$lib/i18n/index.js';
	import SectionIndex from '$lib/components/SectionIndex.svelte';
	import GoToTop from '$lib/components/GoToTop.svelte';
	$: sections = Object.keys($t('home.index.sections')).map((id) => ({ id, labelKey: `home.index.sections.${id}` }));
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
		<div class="orb orb-a"></div><div class="orb orb-b"></div>
		<div class="hero-inner">
			<p class="eyebrow">{$t('home.hero.eyebrow')}</p>
			<div class="mark" aria-hidden="true"><span>Σ</span></div>
			<h1>{$t('home.hero.title')}</h1>
			<p class="hero-copy">{$t('home.hero.body')}</p>
			<div class="actions"><a class="primary" href={$href('/technology')}>{$t('home.hero.primary')} <span>↗</span></a><a href="#applications">{$t('home.hero.secondary')} <span>↓</span></a></div>
			<p class="note">{$t('home.hero.note')}</p>
		</div>
	</section>

	<div class="ground">
		<section class="block" id="foundations"><p class="eyebrow">{$t('home.foundations.eyebrow')}</p><h2>{$t('home.foundations.title')}</h2><p class="intro">{$t('home.foundations.intro')}</p><div class="grid">{#each $t('home.foundations.cards') as card}<article class="card"><h3>{card.title}</h3><p>{card.text}</p></article>{/each}</div></section>

		<section class="block boxes" id="boxes"><p class="eyebrow">{$t('home.boxes.eyebrow')}</p><h2>{$t('home.boxes.title')}</h2><p class="intro">{$t('home.boxes.intro')}</p><div class="box-visual" aria-hidden="true"><div class="registers">{#each ['R0','R1','R2','R3','R4','R5','R6','R7','R8','R9'] as r, i}<span class:optional={i > 3}>{r}</span>{/each}</div><div class="box-label">ERG · TOKENS · ERGOSCRIPT · DATA</div></div><div class="steps">{#each $t('home.boxes.points') as item}<article><b>{item.n}</b><div><h3>{item.title}</h3><p>{item.text}</p></div></article>{/each}</div></section>

		<section class="block" id="proofs"><p class="eyebrow">{$t('home.proofs.eyebrow')}</p><h2>{$t('home.proofs.title')}</h2><p class="intro">{$t('home.proofs.intro')}</p><blockquote>{$t('home.proofs.quote')}</blockquote><div class="grid">{#each $t('home.proofs.cards') as card}<article class="card"><h3>{card.title}</h3><p>{card.text}</p></article>{/each}</div></section>

		<section class="block" id="sustainability"><p class="eyebrow">{$t('home.sustainability.eyebrow')}</p><h2>{$t('home.sustainability.title')}</h2><p class="intro">{$t('home.sustainability.intro')}</p><div class="grid">{#each $t('home.sustainability.cards') as card}<article class="card"><h3>{card.title}</h3><p>{card.text}</p></article>{/each}</div></section>

		<section class="block" id="economics"><p class="eyebrow">{$t('home.economics.eyebrow')}</p><h2>{$t('home.economics.title')}</h2><p class="intro">{$t('home.economics.intro')}</p><div class="stats">{#each $t('home.economics.stats') as stat}<div><strong>{stat.value}</strong><span>{stat.label}</span></div>{/each}</div><p class="wide-copy">{$t('home.economics.body')}</p></section>

		<section class="block" id="applications"><p class="eyebrow">{$t('home.applications.eyebrow')}</p><h2>{$t('home.applications.title')}</h2><p class="intro">{$t('home.applications.intro')}</p><div class="grid apps">{#each $t('home.applications.cards') as card}<a class="card" href={card.link} target="_blank" rel="noreferrer"><h3>{card.title} <small>↗</small></h3><p>{card.text}</p></a>{/each}</div></section>

		<section class="block" id="community"><p class="eyebrow">{$t('home.community.eyebrow')}</p><h2>{$t('home.community.title')}</h2><p class="intro">{$t('home.community.intro')}</p><div class="grid apps">{#each $t('home.community.cards') as card}<a class="card" href={card.link} target="_blank" rel="noreferrer"><h3>{card.title} <small>↗</small></h3><p>{card.text}</p></a>{/each}</div></section>

		<section class="block manifesto" id="mission"><p class="eyebrow">{$t('home.mission.eyebrow')}</p><h2>{$t('home.mission.title')}</h2><p>{$t('home.mission.body')}</p><div class="actions">{#each $t('home.mission.links') as link}<a href={link.href} target="_blank" rel="noreferrer">{link.label} <span>↗</span></a>{/each}</div></section>

		<section class="block sources" id="sources"><p class="eyebrow">{$t('home.sources.eyebrow')}</p><h2>{$t('home.sources.title')}</h2><p class="intro">{$t('home.sources.body')}</p><div class="source-links">{#each $t('home.sources.links') as link}<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<span aria-hidden="true">↗</span></a>{/each}</div></section>
	</div>
</main>

<GoToTop />

<style>
	:global(body){background:var(--surface)} main{position:relative;z-index:1}.hero{min-height:100svh;display:grid;place-items:center;overflow:hidden;position:relative;padding:80px 24px;background:radial-gradient(circle at 50% 25%,rgba(255,94,24,.12),transparent 42%),linear-gradient(180deg,var(--surface-deep),var(--surface))}.hero-inner{max-width:970px;text-align:center;position:relative;z-index:2}.eyebrow{font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent-text);font-weight:800}.mark{width:86px;height:86px;margin:25px auto;border:2px solid var(--accent);transform:rotate(45deg);display:grid;place-items:center;box-shadow:0 0 55px rgba(255,94,24,.2)}.mark span{font:700 2.7rem var(--font-heading);color:var(--accent-text);transform:rotate(-45deg)}h1{font-size:clamp(3rem,8vw,7.2rem);line-height:.95;letter-spacing:-.045em;margin:0;color:var(--on-surface);max-width:1000px}.hero-copy{max-width:720px;margin:30px auto;color:var(--on-surface-muted);font-size:clamp(1.05rem,2vw,1.35rem)}.actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:30px 0}.actions a{padding:13px 20px;border:1px solid var(--border-strong);border-radius:999px;color:var(--on-surface);text-decoration:none;font-weight:700}.actions a.primary,.actions a:hover{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}.note{font-size:.76rem;color:var(--on-surface-subtle);letter-spacing:.08em;text-transform:uppercase}.ground{max-width:1100px;margin:auto;padding:0 24px 100px}.block{padding:110px 0 20px;border-top:1px solid var(--border)}.block h2{font-size:clamp(2.2rem,5vw,4.6rem);line-height:1.02;letter-spacing:-.035em;max-width:850px;margin:12px 0 22px}.intro{max-width:760px;color:var(--on-surface-muted);font-size:1.1rem}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:44px}.card{background:var(--surface-raised);padding:27px;border:1px solid var(--border);border-top:3px solid var(--accent);border-radius:12px;text-decoration:none;box-shadow:var(--shadow-sm)}.card h3{margin:0 0 12px;color:var(--accent-text);font-size:1.25rem}.card p,.wide-copy{color:var(--on-surface-muted);margin:0}.apps .card{transition:.2s transform,.2s box-shadow}.apps .card:hover{transform:translateY(-5px);box-shadow:var(--shadow-md)}.box-visual{margin:45px 0;background:var(--surface-deep);border:2px solid var(--accent);padding:24px;border-radius:10px;box-shadow:12px 12px 0 var(--accent-soft)}.registers{display:grid;grid-template-columns:repeat(10,1fr);gap:7px}.registers span{display:grid;place-items:center;aspect-ratio:1;border-radius:5px;background:var(--accent);color:var(--on-accent);font-weight:800}.registers span.optional{background:transparent;border:1px dashed var(--accent);color:var(--accent-text)}.box-label{text-align:center;color:var(--on-surface-subtle);font-size:.72rem;letter-spacing:.14em;margin-top:20px}.steps{display:grid;grid-template-columns:1fr 1fr;gap:24px}.steps article{display:flex;gap:17px}.steps b{color:var(--accent-text);font-size:.75rem}.steps h3{margin:0 0 6px}.steps p{color:var(--on-surface-muted);margin:0}blockquote{font:500 clamp(1.35rem,3vw,2rem) var(--font-heading);border-left:4px solid var(--accent);margin:40px 0;padding:10px 0 10px 28px;max-width:820px}.stats{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--border);margin:42px 0}.stats div{padding:25px;border-right:1px solid var(--border)}.stats div:last-child{border:0}.stats strong{display:block;color:var(--accent-text);font:700 clamp(1.6rem,3vw,2.4rem) var(--font-heading)}.stats span{display:block;color:var(--on-surface-subtle);font-size:.82rem;margin-top:5px}.manifesto{background:var(--surface-deep);padding:65px;border-radius:18px;margin-top:100px}.manifesto>p:not(.eyebrow){font:500 clamp(1.25rem,2.5vw,1.75rem) var(--font-heading);color:var(--on-surface-muted);max-width:850px}.source-links{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:30px}.source-links a{display:flex;justify-content:space-between;padding:16px;border-bottom:1px solid var(--border);text-decoration:none;color:var(--on-surface)}.source-links a:hover{color:var(--accent-text)}
	@media(max-width:760px){.grid,.steps,.stats,.source-links{grid-template-columns:1fr}.stats div{border-right:0;border-bottom:1px solid var(--border)}.registers{grid-template-columns:repeat(5,1fr)}.manifesto{padding:34px 24px}.block{padding-top:80px}}
</style>
