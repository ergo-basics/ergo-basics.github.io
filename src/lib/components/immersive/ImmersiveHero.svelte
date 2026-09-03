<script>
	/*
	 * ImmersiveHero — the opener shared by every immersive page
	 * (/depin, /developers, /users). All copy is passed in as props so
	 * the motion behaviour lives in exactly one place.
	 *
	 * Two motion layers, both optional:
	 *   1. A cursor-reactive peer field on <canvas> (drawHeroField).
	 *      Always running when motion is allowed; it is the first signal
	 *      that this page responds to you.
	 *   2. A GSAP scroll timeline that parallaxes the headline, sub-copy
	 *      and stat row at different rates as you leave the hero, so the
	 *      handoff into the first pinned scene feels continuous.
	 *
	 * Under prefers-reduced-motion neither layer runs: the canvas is
	 * painted once and the copy sits still. The DOM is identical either
	 * way, so there is no content behind a motion gate.
	 */

	import { onMount } from 'svelte';
	import { t, href } from '$lib/i18n/index.js';
	import { drawHeroField } from './scene-kit.js';
	import {
		loadGsap,
		prefersReducedMotion,
		fitCanvas,
		releaseCanvas,
		createViewportGate,
		cssVar,
		onThemeChange,
		scrollTo
	} from '$lib/motion.js';

	/** Small uppercase label above the headline. */
	export let eyebrow = '';
	/** The headline itself. */
	export let title = '';
	/** One-line promise under the headline. */
	export let tagline = '';
	/** Supporting paragraph. */
	export let lede = '';
	/** [{ label, href, external?, primary? }] */
	export let actions = [];
	/** [{ value, label }] — the three-up stat row. */
	export let stats = [];
	/** Anchor id of the first pinned scene, for the "see how" jump. */
	export let firstSceneId = '';

	let root;
	let canvasEl;
	let layerTitle;
	let layerSub;
	let layerStats;
	let layerScroll;

	function jumpToFirstScene(event) {
		if (!firstSceneId) return;
		event.preventDefault();
		scrollTo(`#${firstSceneId}`);
	}

	onMount(() => {
		const reduced = prefersReducedMotion();
		let ctx = null;
		let width = 0;
		let height = 0;
		let raf = 0;
		const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
		const start = performance.now();

		let palette = readPalette();
		function readPalette() {
			return {
				node: cssVar('--viz-node', '#6fe3c4'),
				link: cssVar('--viz-link', 'rgba(111,227,196,0.4)'),
				grid: cssVar('--viz-grid', 'rgba(255,255,255,0.08)'),
				warm: cssVar('--viz-warm', '#ef9c82'),
				accent: cssVar('--accent', '#ef9c82'),
				onSurface: cssVar('--on-surface', '#f2ece6'),
				onSurfaceRgb: cssVar('--on-surface-rgb', '242, 236, 230')
			};
		}

		// See PinnedScene: a released canvas is 0x0, so nothing may paint
		// into it until the gate has handed the pixels back.
		let allocated = false;

		function render() {
			if (!ctx || !allocated) return;
			ctx.clearRect(0, 0, width, height);
			drawHeroField(ctx, {
				width,
				height,
				progress: 1,
				palette,
				mouse: { x: mouse.x, y: mouse.y, active: mouse.active },
				time: reduced ? 0 : (performance.now() - start) / 1000
			});
		}

		function resize() {
			if (!canvasEl || !allocated) return;
			const fitted = fitCanvas(canvasEl);
			ctx = fitted.ctx;
			width = fitted.width;
			height = fitted.height;
			render();
		}

		function allocate() {
			if (allocated || !canvasEl) return;
			allocated = true;
			resize();
		}
		function release() {
			if (!allocated || !canvasEl) return;
			allocated = false;
			ctx = null;
			releaseCanvas(canvasEl);
		}

		const ro = new ResizeObserver(() => resize());
		ro.observe(canvasEl);
		const stopThemeWatch = onThemeChange(() => {
			palette = readPalette();
			render();
		});

		if (reduced) {
			const stopGate = createViewportGate(canvasEl, {
				onNear: (near) => (near ? allocate() : release()),
				onLive: () => {}
			});
			return () => {
				stopGate();
				ro.disconnect();
				stopThemeWatch();
			};
		}

		function onPointerMove(event) {
			// Only measure while the hero is actually animating; once it has
			// scrolled away this listener would otherwise force a layout read
			// on every mouse move for a canvas nobody can see.
			if (!raf) return;
			const rect = canvasEl.getBoundingClientRect();
			mouse.tx = (event.clientX - rect.left) / Math.max(1, rect.width);
			mouse.ty = (event.clientY - rect.top) / Math.max(1, rect.height);
			mouse.active = true;
		}
		function onPointerLeave() {
			mouse.active = false;
		}
		window.addEventListener('pointermove', onPointerMove, { passive: true });
		root.addEventListener('pointerleave', onPointerLeave);

		function loop() {
			mouse.x += (mouse.tx - mouse.x) * 0.07;
			mouse.y += (mouse.ty - mouse.y) * 0.07;
			render();
			raf = requestAnimationFrame(loop);
		}

		// The hero is the top of the page, so it is the scene a reader
		// leaves first and comes back to last. Parking its loop on the way
		// out is most of the idle cost of the audience pages.
		function startLoop() {
			if (raf) return;
			raf = requestAnimationFrame(loop);
		}
		function stopLoop() {
			if (!raf) return;
			cancelAnimationFrame(raf);
			raf = 0;
		}

		const stopGate = createViewportGate(canvasEl, {
			onNear: (near) => (near ? allocate() : release()),
			onLive: (live) => (live ? startLoop() : stopLoop())
		});

		let cleanupGsap = () => {};
		let cancelled = false;

		loadGsap().then((bits) => {
			if (!bits || cancelled || !root) return;
			const { gsap } = bits;
			const scope = gsap.context(() => {
				// Entrance. `stats` is optional, so filter out missing layers
				// rather than handing GSAP an undefined target.
				gsap.from([layerTitle, layerSub, layerStats].filter(Boolean), {
					y: 34,
					opacity: 0,
					duration: 0.9,
					ease: 'power3.out',
					stagger: 0.13
				});

				// Depth-ordered parallax on exit.
				gsap
					.timeline({
						scrollTrigger: {
							trigger: root,
							start: 'top top',
							end: 'bottom top',
							scrub: 0.6
						}
					})
					.to(layerTitle, { y: -140, opacity: 0.15, ease: 'none' }, 0)
					.to(layerSub, { y: -90, opacity: 0.1, ease: 'none' }, 0)
					.to(canvasEl, { y: 90, opacity: 0.35, ease: 'none' }, 0);

				if (layerStats) {
					gsap.to(layerStats, {
						y: -50,
						opacity: 0,
						ease: 'none',
						scrollTrigger: {
							trigger: root,
							start: 'top top',
							end: 'bottom top',
							scrub: 0.6
						}
					});
				}

				if (layerScroll) {
					gsap.to(layerScroll, {
						y: 9,
						repeat: -1,
						yoyo: true,
						duration: 1.1,
						ease: 'sine.inOut'
					});
				}
			}, root);
			cleanupGsap = () => scope.revert();
		});

		return () => {
			cancelled = true;
			cancelAnimationFrame(raf);
			raf = 0;
			stopGate();
			window.removeEventListener('pointermove', onPointerMove);
			root.removeEventListener('pointerleave', onPointerLeave);
			ro.disconnect();
			stopThemeWatch();
			cleanupGsap();
			releaseCanvas(canvasEl);
		};
	});
</script>

<header class="hero" bind:this={root}>
	<canvas class="hero-canvas" bind:this={canvasEl} aria-hidden="true"></canvas>

	<div class="hero-inner">
		<div bind:this={layerTitle}>
			{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
			<h1>{title}</h1>
			{#if tagline}<p class="tagline">{tagline}</p>{/if}
		</div>

		<div class="lede" bind:this={layerSub}>
			{#if lede}<p>{lede}</p>{/if}
			{#if actions.length}
				<div class="actions">
					{#each actions as a}
						{#if a.external}
							<a
								class="btn"
								class:primary={a.primary}
								class:ghost={!a.primary}
								href={a.href}
								target="_blank"
								rel="noopener noreferrer">{a.label}</a
							>
						{:else if a.href.startsWith('#')}
							<a
								class="btn"
								class:primary={a.primary}
								class:ghost={!a.primary}
								href={a.href}
								on:click={jumpToFirstScene}>{a.label}</a
							>
						{:else}
							<a
								class="btn"
								class:primary={a.primary}
								class:ghost={!a.primary}
								href={$href(a.href)}>{a.label}</a
							>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		{#if stats.length}
			<ul class="stats" bind:this={layerStats}>
				{#each stats as s}
					<li>
						<span class="stat-value">{s.value}</span>
						<span class="stat-label">{s.label}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="scroll-hint" bind:this={layerScroll} aria-hidden="true">
		<span>{$t('common.scroll')}</span>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M12 5v14M5 12l7 7 7-7" />
		</svg>
	</div>
</header>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		min-height: 100svh;
		display: flex;
		align-items: center;
		overflow: hidden;
		background: var(--surface-deep);
		color: var(--on-surface);
	}

	.hero-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		z-index: 0;
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		width: min(1100px, 100%);
		margin: 0 auto;
		padding: 120px clamp(20px, 6vw, 48px) 140px;
	}

	.eyebrow {
		margin: 0 0 14px;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent-text);
	}

	h1 {
		margin: 0;
		font-size: clamp(3rem, 10vw, 6.5rem);
		line-height: 0.98;
		letter-spacing: -0.02em;
		color: var(--on-surface);
	}

	.tagline {
		margin: 14px 0 0;
		font-size: clamp(1.15rem, 3vw, 1.9rem);
		font-weight: 400;
		line-height: 1.3;
		color: var(--accent-text);
		max-width: 20ch;
	}

	.lede {
		margin-top: 30px;
		max-width: 56ch;
	}

	.lede p {
		margin: 0;
		font-size: clamp(1rem, 1.5vw, 1.16rem);
		line-height: 1.7;
		color: var(--on-surface-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 28px;
	}

	.btn {
		display: inline-block;
		padding: 14px 30px;
		border-radius: 10px;
		font-weight: 700;
		text-decoration: none;
		border: 2px solid transparent;
		transition: background-color 0.22s ease, color 0.22s ease, transform 0.22s ease,
			border-color 0.22s ease;
	}

	.btn.primary {
		background: var(--accent);
		color: var(--on-accent);
		border-color: var(--accent);
	}

	.btn.primary:hover {
		background: var(--accent-hover);
		border-color: var(--accent-hover);
		transform: translateY(-2px);
	}

	.btn.ghost {
		color: var(--on-surface);
		border-color: var(--border-strong);
	}

	.btn.ghost:hover {
		border-color: var(--accent);
		color: var(--accent-text);
		transform: translateY(-2px);
	}

	.stats {
		list-style: none;
		margin: 52px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 22px;
		max-width: 860px;
	}

	.stats li {
		padding-top: 16px;
		border-top: 2px solid var(--accent);
	}

	.stat-value {
		display: block;
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 3vw, 2.1rem);
		font-weight: 700;
		color: var(--on-surface);
	}

	.stat-label {
		display: block;
		margin-top: 6px;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--on-surface-muted);
	}

	.scroll-hint {
		position: absolute;
		left: 50%;
		bottom: 26px;
		transform: translateX(-50%);
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--on-surface-subtle);
	}

	.scroll-hint svg {
		width: 18px;
		height: 18px;
	}

	@media (max-width: 820px) {
		.hero-inner {
			padding: 104px clamp(18px, 6vw, 28px) 120px;
		}

		.stats {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.tagline {
			max-width: none;
		}
	}
</style>
