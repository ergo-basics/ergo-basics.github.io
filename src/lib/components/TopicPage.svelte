<script>
	import SiteTopbar from './immersive/SiteTopbar.svelte';
	import { t, href } from '$lib/i18n/index.js';
	/** @type {'technology'|'economics'|'applications'|'mission'} */
	export let topic;
	/** @type {Record<string, string[]>} */
	const map = {
		technology: ['foundations', 'boxes', 'proofs', 'sustainability'],
		economics: ['economics', 'sustainability'],
		applications: ['applications'],
		mission: ['mission', 'sources']
	};
	$: keys = map[topic] || [];
	$: title = $t(`topbar.links.${topic}.label`);
	$: description = $t(`home.${keys[0]}.intro`) || $t(`home.${keys[0]}.body`);
</script>

<svelte:head>
	<title>{title} — Ergo Basics</title>
	<meta name="description" content={description} />
</svelte:head>
<SiteTopbar {title} position="sticky" />
<main>
	<a class="back" href={$href('/')}>← Ergo Basics</a>
	{#each keys as key}
		{@const section = $t(`home.${key}`)}
		<section>
			<p class="eyebrow">{section.eyebrow}</p><h1>{section.title}</h1>
			{#if section.intro}<p class="lead">{section.intro}</p>{/if}
			{#if section.body}<p class="lead">{section.body}</p>{/if}
			{#if section.quote}<blockquote>{section.quote}</blockquote>{/if}
			{#if section.cards}<div class="grid">{#each section.cards as card}<article><h2>{card.title}</h2><p>{card.text}</p>{#if card.link}<a href={card.link} target="_blank" rel="noopener noreferrer">{$t('common.visit')} <span aria-hidden="true">↗</span></a>{/if}</article>{/each}</div>{/if}
			{#if section.points}<div class="grid">{#each section.points as item}<article><small>{item.n}</small><h2>{item.title}</h2><p>{item.text}</p></article>{/each}</div>{/if}
			{#if section.stats}<div class="stats">{#each section.stats as stat}<div><strong>{stat.value}</strong><span>{stat.label}</span></div>{/each}</div>{/if}
			{#if section.links}<div class="links">{#each section.links as link}<a href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>{/each}</div>{/if}
		</section>
	{/each}
</main>

<style>
	main{position:relative;z-index:1;max-width:1050px;margin:auto;padding:50px 24px 100px}.back{color:var(--accent-text);text-decoration:none;font-weight:700}section{padding:80px 0;border-bottom:1px solid var(--border)}.eyebrow{color:var(--accent-text);text-transform:uppercase;letter-spacing:.18em;font-size:.76rem;font-weight:800}h1{font-size:clamp(2.6rem,6vw,5rem);line-height:1;margin:10px 0 25px;max-width:850px}.lead{font-size:1.15rem;color:var(--on-surface-muted);max-width:800px}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:35px}.grid article{background:var(--surface-raised);border:1px solid var(--border);border-top:3px solid var(--accent);border-radius:10px;padding:25px}.grid h2{color:var(--accent-text);margin:0 0 10px}.grid p{color:var(--on-surface-muted)}.grid a,.links a{color:var(--accent-text)}blockquote{font:500 1.5rem var(--font-heading);border-left:4px solid var(--accent);padding-left:22px;margin:35px 0}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:35px}.stats div{padding:20px;background:var(--surface-deep);border-radius:8px}.stats strong{display:block;color:var(--accent-text);font-size:1.8rem}.stats span{font-size:.8rem;color:var(--on-surface-muted)}.links{display:flex;gap:12px;flex-wrap:wrap;margin-top:25px}.links a{padding:12px 16px;border:1px solid var(--border);border-radius:99px;text-decoration:none}@media(max-width:700px){.grid,.stats{grid-template-columns:1fr}}
</style>
