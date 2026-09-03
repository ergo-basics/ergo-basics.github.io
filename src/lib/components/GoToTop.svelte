<script>
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/index.js';

	// Floating "scroll to top" control. Appears once the user has scrolled
	// past roughly one viewport, and glides back to the top on click.
	let visible = false;

	function onScroll() {
		visible = window.scrollY > window.innerHeight * 0.9;
	}

	function toTop() {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
	}

	onMount(() => {
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<button
	class="go-to-top"
	class:visible
	on:click={toTop}
	aria-label={$t('common.backToTop')}
	title={$t('common.backToTop')}
	tabindex={visible ? 0 : -1}
>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path d="M12 19V5" />
		<path d="M5 12l7-7 7 7" />
	</svg>
</button>

<style>
	.go-to-top {
		position: fixed;
		bottom: 24px;
		inset-inline-end: 18px;
		z-index: 55;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--on-accent);
		background: var(--accent);
		border: none;
		box-shadow: var(--shadow-md);
		opacity: 0;
		transform: translateY(16px) scale(0.9);
		pointer-events: none;
		transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s ease;
	}

	.go-to-top.visible {
		opacity: 1;
		transform: translateY(0) scale(1);
		pointer-events: auto;
	}

	.go-to-top:hover {
		background: var(--accent-hover);
		transform: translateY(-2px) scale(1.05);
	}

	.go-to-top:focus-visible {
		outline: 2px solid var(--on-surface);
		outline-offset: 3px;
	}

	.go-to-top svg {
		width: 22px;
		height: 22px;
	}
</style>
