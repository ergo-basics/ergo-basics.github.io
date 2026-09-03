<script>
	/*
	 * PinnedScene — the engine behind every immersive DePIN section.
	 *
	 * WHAT IT DOES
	 * ------------
	 * Pins a full-height section with ScrollTrigger and converts the
	 * pinned scroll distance into a normalised `progress` (0 → 1) that
	 * drives two things at once:
	 *
	 *   1. A procedural <canvas> animation, via the `draw` prop. There
	 *      are no frame-sequence assets for this site, so each scene is
	 *      drawn from code and *scrubbed* by scroll — the same feel as a
	 *      scroll-controlled image sequence, at a few KB instead of a
	 *      few MB.
	 *
	 *   2. The caption slot, which receives `progress` so copy can be
	 *      staged beat by beat as the visual builds.
	 *
	 * The canvas also tracks the pointer (`mouse`, in 0–1 scene space)
	 * so scenes can react to the cursor, with a lerp so it glides
	 * instead of snapping.
	 *
	 * GRACEFUL DEGRADATION
	 * --------------------
	 * • prefers-reduced-motion → no pin, no scrub, no RAF. The canvas is
	 *   painted ONCE at its final state (progress = 1) and the caption
	 *   slot renders every beat at full opacity, so the section becomes
	 *   an ordinary illustrated block.
	 * • Compact viewports → still pinned (so the story survives), but
	 *   over a shorter scroll distance, with the caption stacked under
	 *   the canvas rather than floating beside it.
	 * • No JS / prerender → markup renders with `.is-static`, i.e. the
	 *   readable final state. Nothing here depends on JS for content.
	 */

	import { onMount } from 'svelte';
	import { locale, translator, isRTL } from '$lib/i18n/index.js';
	import {
		loadGsap,
		prefersReducedMotion,
		isCompactViewport,
		fitCanvas,
		releaseCanvas,
		createViewportGate,
		onThemeChange,
		cssVar
	} from '$lib/motion.js';

	/** Anchor id for in-page navigation. */
	export let id = undefined;
	/** Small eyebrow label rendered above the caption. */
	export let label = '';
	/** draw(ctx, { width, height, progress, palette, mouse, time, t }) */
	export let draw = () => {};
	/** Scroll distance for the pin, as a multiple of viewport height. */
	export let scrollLength = 2.2;
	/** Caption placement on desktop. */
	export let align = 'left';
	/**
	 * Optional scene-owned state, forwarded to `draw` untouched. Used by
	 * scenes that respond to a control in the caption (the spec scene's
	 * Explore buttons) rather than to scroll alone. Kept opaque here so
	 * PinnedScene never has to know what any one scene means by it.
	 * @type {any}
	 */
	export let state = null;
	/**
	 * Called with the scene's normalised progress on every scroll update.
	 *
	 * The slot already receives `progress`, but a slot prop cannot be read
	 * from the parent's own script, and a scene whose caption opens a mode
	 * (the spec scene's Explore zoom) has to know when the reader has
	 * scrolled out of the beat that owns that mode — otherwise the mode
	 * stays latched over copy it no longer belongs to.
	 * @type {(progress: number) => void}
	 */
	export let onProgress = () => {};

	let root;
	let canvasEl;
	let progress = 0;
	let motion = false;
	// Assigned in onMount; lets the reactive block below repaint the
	// single static frame when `state` changes under reduced motion.
	let requestRender = () => {};

	// `state` is read inside the RAF loop in motion mode, so this only
	// has to do anything when there is no loop running.
	$: state, requestRender();

	onMount(() => {
		const reduced = prefersReducedMotion();
		motion = !reduced;

		let raf = 0;
		let ctx = null;
		let width = 0;
		let height = 0;
		let currentLocale = 'en';
		let palette = readPalette();
		// Scenes paint a handful of words onto the canvas, so they get a
		// plain lookup function rather than a store — this runs inside a
		// RAF loop, where a per-frame subscription would be silly.
		let lookup = translator('en');
		// Pointer in scene space (0–1). Starts centred so the first paint
		// is never lopsided before the user moves the mouse.
		const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
		let start = 0;

		function readPalette() {
			return {
				node: cssVar('--viz-node', '#6fe3c4'),
				link: cssVar('--viz-link', 'rgba(111,227,196,0.4)'),
				grid: cssVar('--viz-grid', 'rgba(255,255,255,0.08)'),
				warm: cssVar('--viz-warm', '#ef9c82'),
				accent: cssVar('--accent', '#ef9c82'),
				accentText: cssVar('--accent-text', '#f2a98f'),
				fontBody: cssVar('--font-body', 'Lato, sans-serif'),
				direction: isRTL(currentLocale) ? 'rtl' : 'ltr',
				surface: cssVar('--surface', '#12302e'),
				surfaceDeep: cssVar('--surface-deep', '#0a1f1e'),
				surfaceDeepRgb: cssVar('--surface-deep-rgb', '10, 31, 30'),
				onSurface: cssVar('--on-surface', '#f2ece6'),
				onSurfaceRgb: cssVar('--on-surface-rgb', '242, 236, 230')
			};
		}

		/*
		 * Allocation state for this scene's canvas.
		 *
		 * `allocated` tracks whether the backing store currently exists.
		 * Everything that would paint checks it first, because a released
		 * canvas is 0x0 and drawing into it is a silent no-op that would
		 * leave the scene blank when it came back.
		 */
		let allocated = false;

		function resize() {
			if (!canvasEl || !allocated) return;
			const fitted = fitCanvas(canvasEl);
			ctx = fitted.ctx;
			width = fitted.width;
			height = fitted.height;
			render();
		}

		function render() {
			if (!ctx || !allocated) return;
			ctx.clearRect(0, 0, width, height);
			draw(ctx, {
				width,
				height,
				progress,
				palette,
				mouse: { x: mouse.x, y: mouse.y, active: mouse.active },
				time: (performance.now() - start) / 1000,
				// Scenes compose their focal point AWAY from the caption, so
				// the visual and the copy never fight for the same pixels.
				align: isRTL(currentLocale)
					? align === 'left'
						? 'right'
						: align === 'right'
							? 'left'
							: align
					: align,
				reduced,
				state,
				t: (key, vars) => lookup(key, vars)
			});
		}

		requestRender = render;
		start = performance.now();

		const stopThemeWatch = onThemeChange(() => {
			palette = readPalette();
			render();
		});
		// Fires immediately with the current locale, then on every switch.
		// The repaint matters most in the reduced-motion path, where the
		// canvas is painted exactly once and would otherwise keep the old
		// language's labels.
		const stopLocaleWatch = locale.subscribe((code) => {
			currentLocale = code;
			lookup = translator(code);
			palette = readPalette();
			render();
		});
		// Observe the canvas itself (not the section): fitCanvas is
		// layout-neutral, so this can't feed back into the section height.
		// Skipped while released, so the 0x0 resize can't churn the loop.
		const ro = new ResizeObserver(() => resize());
		ro.observe(canvasEl);

		/*
		 * Give the canvas its pixels back (and repaint), or hand them to the
		 * browser. `allocate` always paints synchronously, so the scene is
		 * complete the instant it owns a backing store again — the outer
		 * NEAR ring means that happens a full viewport before it is visible.
		 */
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

		// A canvas that has never been sized still carries the spec's default
		// 300x150 backing store. Harmless alone, but this page mounts nine of
		// them, so start every scene at zero and let the gate be the only
		// thing that ever hands out pixels.
		releaseCanvas(canvasEl);

		// --- Reduced motion: single static paint, then we're done. ---
		// Still gated, so an off-screen static scene costs no pixel buffer;
		// re-entry repaints the same final frame (progress = 1).
		if (reduced) {
			progress = 1;
			const stopGate = createViewportGate(canvasEl, {
				onNear: (near) => (near ? allocate() : release()),
				onLive: () => {}
			});
			return () => {
				requestRender = () => {};
				stopGate();
				ro.disconnect();
				stopThemeWatch();
				stopLocaleWatch();
			};
		}

		function onPointerMove(event) {
			// Every scene listens on `window` (the pointer has to be tracked
			// even when it is outside the canvas), so without this guard one
			// mouse move would force a layout read in all nine scenes at once.
			// Only the scene actually being looked at needs the coordinate.
			if (!raf) return;
			const rect = canvasEl.getBoundingClientRect();
			mouse.tx = (event.clientX - rect.left) / Math.max(1, rect.width);
			mouse.ty = (event.clientY - rect.top) / Math.max(1, rect.height);
			mouse.active = true;
		}
		function onPointerLeave() {
			mouse.tx = 0.5;
			mouse.ty = 0.5;
			mouse.active = false;
		}
		window.addEventListener('pointermove', onPointerMove, { passive: true });
		root.addEventListener('pointerleave', onPointerLeave);

		function loop() {
			// Ease the pointer so cursor-reactive scenes glide.
			mouse.x += (mouse.tx - mouse.x) * 0.08;
			mouse.y += (mouse.ty - mouse.y) * 0.08;
			render();
			raf = requestAnimationFrame(loop);
		}

		/*
		 * The scene only animates while it is in (or just outside) the
		 * viewport. Nine scenes used to run nine permanent 60fps loops; now
		 * at most the one being read does, which is the difference between
		 * a page that idles hot and one that idles cold.
		 *
		 * The clock is preserved across pauses rather than reset, so a scene
		 * scrolled away from and back to continues its time-based motion
		 * from where it was instead of snapping back to t=0.
		 */
		let pausedAt = 0;
		function startLoop() {
			if (raf) return;
			if (pausedAt) {
				start += performance.now() - pausedAt;
				pausedAt = 0;
			}
			raf = requestAnimationFrame(loop);
		}
		function stopLoop() {
			if (!raf) return;
			cancelAnimationFrame(raf);
			raf = 0;
			pausedAt = performance.now();
		}

		const stopGate = createViewportGate(canvasEl, {
			onNear: (near) => (near ? allocate() : release()),
			onLive: (live) => (live ? startLoop() : stopLoop())
		});

		let cleanupGsap = () => {};
		let cancelled = false;

		loadGsap().then((bits) => {
			if (!bits || cancelled || !root) return;
			const { gsap, ScrollTrigger } = bits;
			const compact = isCompactViewport();
			const ctxScope = gsap.context(() => {
				ScrollTrigger.create({
					trigger: root,
					start: 'top top',
					end: `+=${Math.round((compact ? scrollLength * 0.7 : scrollLength) * 100)}%`,
					pin: true,
					pinSpacing: true,
					anticipatePin: 1,
					scrub: true,
					invalidateOnRefresh: true,
					onUpdate: (self) => {
						progress = self.progress;
						onProgress(progress);
					}
				});
			}, root);
			cleanupGsap = () => ctxScope.revert();
		});

		return () => {
			cancelled = true;
			requestRender = () => {};
			cancelAnimationFrame(raf);
			raf = 0;
			stopGate();
			window.removeEventListener('pointermove', onPointerMove);
			root.removeEventListener('pointerleave', onPointerLeave);
			ro.disconnect();
			stopThemeWatch();
			stopLocaleWatch();
			cleanupGsap();
			releaseCanvas(canvasEl);
		};
	});
</script>

<section
	class="scene"
	class:is-static={!motion}
	class:align-right={align === 'right'}
	class:align-center={align === 'center'}
	bind:this={root}
	{id}
>
	<canvas class="scene-canvas" bind:this={canvasEl} aria-hidden="true"></canvas>

	<div class="scene-copy">
		{#if label}
			<p class="scene-label">{label}</p>
		{/if}
		<slot {progress} static={!motion} reduced={!motion} />
	</div>

	{#if motion}
		<div class="scene-progress" aria-hidden="true">
			<span class="scene-progress-fill" style={`transform: scaleX(${progress});`}></span>
		</div>
	{/if}
</section>

<style>
	.scene {
		position: relative;
		min-height: 100vh;
		min-height: 100svh;
		display: flex;
		align-items: center;
		overflow: hidden;
		background: var(--surface-deep);
		color: var(--on-surface);
	}

	.scene-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		z-index: 0;
	}

	.scene-copy {
		position: relative;
		z-index: 1;
		width: min(560px, 100%);
		margin-inline-start: clamp(24px, 8vw, 120px);
		padding: 32px 0;
	}

	/* A soft radial scrim behind the caption. The canvas is deliberately
	   composed on the opposite side, but nodes drift, so this guarantees
	   the copy always has a clean field to sit on. */
	.scene-copy::before {
		content: '';
		position: absolute;
		inset: -14% -18%;
		z-index: -1;
		background: radial-gradient(
			65% 55% at 40% 50%,
			rgba(var(--surface-deep-rgb), 0.94) 0%,
			rgba(var(--surface-deep-rgb), 0.8) 45%,
			rgba(var(--surface-deep-rgb), 0) 100%
		);
		pointer-events: none;
	}

	.align-right .scene-copy::before {
		background: radial-gradient(
			65% 55% at 60% 50%,
			rgba(var(--surface-deep-rgb), 0.94) 0%,
			rgba(var(--surface-deep-rgb), 0.8) 45%,
			rgba(var(--surface-deep-rgb), 0) 100%
		);
	}

	.is-static .scene-copy::before {
		display: none;
	}

	.align-right .scene-copy {
		margin-inline-start: auto;
		margin-inline-end: clamp(24px, 8vw, 120px);
	}

	.align-center .scene-copy {
		margin-inline-start: auto;
		margin-inline-end: auto;
		text-align: center;
	}

	.scene-label {
		margin: 0 0 14px;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent-text);
	}

	.scene-progress {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		background: var(--border);
		z-index: 2;
	}

	.scene-progress-fill {
		display: block;
		height: 100%;
		width: 100%;
		transform-origin: 0 50%;
		background: var(--accent);
	}

	:global(html[dir='rtl']) .scene-progress-fill {
		transform-origin: 100% 50%;
	}

	/* Static / reduced-motion: normal document flow, canvas becomes a
	   framed illustration above the copy instead of a full bleed. */
	.is-static {
		min-height: 0;
		display: block;
		padding: 64px 0;
	}

	/* Fixed, content-independent height so the canvas can never feed back
	   into the section's own height (see fitCanvas in motion.js). */
	.is-static .scene-canvas {
		position: relative;
		inset: auto;
		height: min(52vh, 420px);
		flex: none;
		border-bottom: 1px solid var(--border);
	}

	.is-static .scene-copy {
		margin: 0 auto;
		padding: 32px clamp(20px, 6vw, 40px) 0;
		width: min(720px, 100%);
	}

	@media (max-width: 820px) {
		.scene {
			align-items: flex-end;
		}

		.scene-copy,
		.align-right .scene-copy,
		.align-center .scene-copy {
			width: 100%;
			margin: 0;
			padding: 20px clamp(18px, 6vw, 28px) 56px;
			/* A scrim keeps the caption readable over a busy canvas on
			   small screens, where copy and visual must share the frame. */
			background: linear-gradient(
				to top,
				rgba(var(--surface-deep-rgb), 0.97) 0%,
				rgba(var(--surface-deep-rgb), 0.92) 55%,
				rgba(var(--surface-deep-rgb), 0) 100%
			);
			text-align: start;
		}

		.is-static .scene-copy {
			background: none;
		}
	}
</style>
