/*
 * src/lib/motion.js
 * ------------------------------------------------------------------
 * Shared motion runtime for the site: GSAP + ScrollTrigger + Lenis.
 *
 * WHY A MODULE INSTEAD OF PER-COMPONENT IMPORTS
 * ---------------------------------------------
 * The site is prerendered by adapter-static, so *nothing* touching
 * `window` may run at module top level. Everything here is behind an
 * async loader that is only ever called from `onMount`, which keeps
 * the SSR/prerender pass clean and also code-splits GSAP out of the
 * initial bundle.
 *
 * ACCESSIBILITY
 * -------------
 * `prefersReducedMotion()` is the single gate every scene checks. When
 * it is true we skip GSAP entirely and the markup renders as a plain,
 * fully-visible static layout (each scene component is authored so its
 * "final" state is also its CSS default when `.motion-on` is absent).
 */

import { browser } from '$app/environment';

/** True when the user has asked the OS for less animation. */
export function prefersReducedMotion() {
	if (!browser || typeof window.matchMedia !== 'function') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True for viewports where full-screen pinning is a bad idea. */
export function isCompactViewport() {
	if (!browser) return false;
	return window.matchMedia('(max-width: 820px)').matches;
}

/** @type {Promise<{ gsap: any, ScrollTrigger: any }> | null} */
let gsapPromise = null;

/**
 * Lazily import GSAP + ScrollTrigger exactly once and register the
 * plugin. Resolves to `{ gsap, ScrollTrigger }`, or `null` when we are
 * not in a browser.
 */
export async function loadGsap() {
	if (!browser) return null;
	if (!gsapPromise) {
		gsapPromise = (async () => {
			const [{ gsap }, { ScrollTrigger }] = await Promise.all([
				import('gsap'),
				import('gsap/ScrollTrigger')
			]);
			gsap.registerPlugin(ScrollTrigger);
			return { gsap, ScrollTrigger };
		})();
	}
	return gsapPromise;
}

/** @type {import('lenis').default | null} */
let lenis = null;
let lenisRaf = null;
let lenisRefs = 0;
/** Set by hardResetScroll; consumed when Lenis (re)starts so a late
 *  `new Lenis()` cannot inherit the previous page's scroll offset. */
let pendingTop = false;

/**
 * Start (or join) the shared Lenis smooth-scroll instance and wire it
 * into ScrollTrigger so pinning stays in sync. Returns a teardown
 * function; the instance is only really destroyed when the last
 * consumer releases it.
 *
 * No-ops (returning a no-op teardown) under reduced motion, so the
 * native scroll behaviour is left completely alone.
 */
export async function startSmoothScroll() {
	if (!browser || prefersReducedMotion()) return () => {};

	lenisRefs += 1;

	if (!lenis) {
		const [{ default: Lenis }, gsapBits] = await Promise.all([import('lenis'), loadGsap()]);

		lenis = new Lenis({
			duration: 1.05,
			// Gentle exponential ease-out — glides without feeling laggy.
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			// Native momentum on touch beats an emulated one every time.
			syncTouch: false
		});

		if (pendingTop) {
			window.scrollTo(0, 0);
			lenis.scrollTo(0, { immediate: true, force: true });
			pendingTop = false;
		}

		if (gsapBits) {
			const { gsap, ScrollTrigger } = gsapBits;
			lenis.on('scroll', ScrollTrigger.update);
			// Drive Lenis from GSAP's ticker so both share one RAF loop.
			const tick = (time) => lenis && lenis.raf(time * 1000);
			gsap.ticker.add(tick);
			gsap.ticker.lagSmoothing(0);
			lenisRaf = () => gsap.ticker.remove(tick);
		} else {
			let id = requestAnimationFrame(function loop(time) {
				if (lenis) lenis.raf(time);
				id = requestAnimationFrame(loop);
			});
			lenisRaf = () => cancelAnimationFrame(id);
		}
	}

	return () => {
		lenisRefs = Math.max(0, lenisRefs - 1);
		if (lenisRefs === 0 && lenis) {
			if (lenisRaf) lenisRaf();
			lenisRaf = null;
			lenis.destroy();
			lenis = null;
		}
	};
}

/**
 * Force scroll back to the top and make ScrollTrigger re-measure every
 * pin against the freshly-mounted page.
 *
 * WHY THIS EXISTS
 * ----------------
 * `+page.svelte` unmounts/remounts on every route change, and each one
 * tears down its own Lenis ref and reverts its own GSAP context — but
 * that teardown/setup pair is asynchronous (dynamic imports), so there
 * is a window, right after a client-side navigation, where the browser
 * is still sitting at the PREVIOUS page's scroll offset while the new
 * page's (shorter, not-yet-pinned) DOM has just been inserted. A stray
 * `new Lenis()` reading that stale `scrollY` as its baseline, or a
 * `ScrollTrigger.refresh()` racing the layout before webfonts/images
 * settle, is exactly what makes a destination page open mid-scroll with
 * its pins mis-measured (symptom: the fixed topbar seems to "vanish"
 * until the user scrolls, which is just ScrollTrigger catching up).
 *
 * Called from the root layout's `afterNavigate`, this resets the native
 * scroll position unconditionally and, once GSAP is loaded, refreshes
 * ScrollTrigger twice — immediately and on the next frame — so both the
 * synchronous DOM and any late reflow are accounted for.
 */
export function hardResetScroll() {
	if (!browser) return;
	pendingTop = true;
	window.scrollTo(0, 0);
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
	if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
	if (gsapPromise) {
		gsapPromise.then((bits) => {
			if (!bits) return;
			const { ScrollTrigger } = bits;
			if (typeof ScrollTrigger.clearScrollMemory === 'function') {
				ScrollTrigger.clearScrollMemory('manual');
			}
			window.scrollTo(0, 0);
			if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
			ScrollTrigger.refresh();
			requestAnimationFrame(() => {
				window.scrollTo(0, 0);
				if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
				ScrollTrigger.refresh();
				pendingTop = false;
			});
		});
	}
}

/** Kill leftover pins from the outgoing page so the next route doesn't
 *  inherit pin-spacers or a mid-scene scroll memory. */
export function killAllScrollTriggers() {
	if (!browser || !gsapPromise) return;
	gsapPromise.then((bits) => {
		if (!bits) return;
		bits.ScrollTrigger.getAll().forEach((/** @type {any} */ st) => st.kill());
		if (typeof bits.ScrollTrigger.clearScrollMemory === 'function') {
			bits.ScrollTrigger.clearScrollMemory('manual');
		}
	});
}

/**
 * Restore an exact scroll coordinate after a locale-only navigation.
 * Translated captions can reflow while Svelte updates the route, and
 * ScrollTrigger may rebuild pin spacers from that intermediate layout.
 * Re-applying the coordinate after refresh keeps the same story beat.
 * @param {number} top
 */
export function restoreScrollPosition(top) {
	if (!browser) return;
	const restore = () => {
		window.scrollTo(0, top);
		if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
	};
	restore();
	requestAnimationFrame(() => {
		restore();
		if (gsapPromise) {
			gsapPromise.then((bits) => {
				if (!bits) return;
				bits.ScrollTrigger.refresh();
				restore();
			});
		}
	});
}

/** Scroll to an element/offset through Lenis when it is running. */
export function scrollTo(target, options = {}) {
	if (!browser) return;
	if (lenis && !prefersReducedMotion()) {
		lenis.scrollTo(target, { duration: 1.1, ...options });
		return;
	}
	const el = typeof target === 'string' ? document.querySelector(target) : target;
	if (el && el.scrollIntoView) {
		el.scrollIntoView({
			behavior: prefersReducedMotion() ? 'auto' : 'smooth',
			block: 'start'
		});
	} else if (typeof target === 'number') {
		window.scrollTo({ top: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
	}
}

/**
 * Read a CSS custom property off <html> as a concrete colour string.
 * Canvas can't consume `var(--x)`, so every procedural scene resolves
 * its palette through this — which is also what makes the canvases
 * re-theme correctly when the toggle flips.
 */
export function cssVar(name, fallback = '#000000') {
	if (!browser) return fallback;
	const value = getComputedStyle(document.documentElement).getPropertyValue(name);
	return value ? value.trim() : fallback;
}

/**
 * Observe theme flips on <html data-theme>. Canvas scenes use this to
 * re-resolve their palette instead of baking colours in at mount.
 * Returns a disconnect function.
 */
export function onThemeChange(callback) {
	if (!browser) return () => {};
	const observer = new MutationObserver(() => callback());
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme']
	});
	return () => observer.disconnect();
}

/**
 * Device-pixel budget for a single full-bleed scene canvas.
 *
 * WHY A BUDGET AND NOT A FIXED DPR CAP
 * ------------------------------------
 * A canvas backing store costs `width * height * dpr^2 * 4` bytes, and
 * that memory is invisible to every JS heap profiler — it is not in the
 * heap, it is a raw pixel buffer the compositor holds. A flat
 * `min(dpr, 2)` therefore makes the cost scale with the SQUARE of the
 * viewport: a full-viewport canvas is ~8MB on a 1920x1080 screen at
 * DPR 1, but ~33MB at DPR 2, and ~133MB on a 4K panel at DPR 2. Ten of
 * those is how a line-art page ends up costing hundreds of megabytes.
 *
 * Budgeting *device pixels* instead keeps the cost roughly constant
 * across screen sizes: small viewports still get the full DPR 2 they
 * need to look crisp (a phone is nowhere near the budget), and only
 * large desktop viewports — where the pixel count explodes and the art
 * is a handful of thin strokes anyway — get scaled back.
 *
 * WHY THE BUDGET IS SET WHERE IT IS
 * ---------------------------------
 * 8.3M device pixels is exactly a 1920x1080 viewport at DPR 2. That is
 * deliberate: the common laptop case keeps full retina crispness and is
 * pixel-identical to before this change. A tighter budget was tried and
 * measurably softened the 1px strokes in the line art, which is not a
 * trade worth making — the real win here is the lazy allocation below
 * (one or two live canvases instead of ten), not shaving DPR.
 *
 * Past 1080p the curve bends: 1440p lands near 1.5 and a 4K panel at
 * the 1.25 floor, which is where a flat DPR 2 would otherwise have
 * demanded ~133MB for a single scene. The floor is deliberate too —
 * these are thin strokes and small text, and a true DPR 1 on a retina
 * panel is visibly soft.
 */
const CANVAS_PIXEL_BUDGET = 8_300_000;
const DPR_MIN = 1.25;
const DPR_MAX = 2;

/** Resolve the DPR to use for a canvas of `width` x `height` CSS px. */
export function budgetedDpr(width, height) {
	const deviceDpr = (browser && window.devicePixelRatio) || 1;
	const cssPixels = Math.max(1, width * height);
	// Never scale UP past the real device ratio — that is pure waste.
	const ceiling = Math.min(deviceDpr, DPR_MAX);
	const budgeted = Math.sqrt(CANVAS_PIXEL_BUDGET / cssPixels);
	return Math.max(Math.min(ceiling, DPR_MIN), Math.min(ceiling, budgeted));
}

/**
 * Size a canvas's backing store to its own CSS box at device-pixel-ratio,
 * returning the CSS-pixel dimensions. Keeps every procedural scene crisp
 * on retina without each one re-deriving the same DPR maths.
 *
 * IMPORTANT: this measures the CANVAS, not its parent, and clears any
 * inline sizing before measuring. Measuring the parent and then writing
 * an inline pixel height back onto the canvas creates a feedback loop
 * wherever the canvas participates in its parent's height (which is
 * exactly what the reduced-motion/static scene layout does): the canvas
 * grows the section, the ResizeObserver fires, the canvas grows again,
 * and the page runs away to hundreds of thousands of pixels tall.
 *
 * Letting CSS own the layout box and only writing the backing store
 * keeps sizing one-directional.
 */
export function fitCanvas(canvas) {
	// Drop any previous inline sizing so the box is purely CSS-derived.
	canvas.style.width = '';
	canvas.style.height = '';
	const rect = canvas.getBoundingClientRect();
	const width = Math.max(1, Math.round(rect.width));
	const height = Math.max(1, Math.round(rect.height));
	const dpr = budgetedDpr(width, height);
	const nextW = Math.floor(width * dpr);
	const nextH = Math.floor(height * dpr);
	// Assigning width/height clears the canvas, so only do it on change.
	if (canvas.width !== nextW || canvas.height !== nextH) {
		canvas.width = nextW;
		canvas.height = nextH;
	}
	const ctx = canvas.getContext('2d');
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	return { ctx, width, height };
}

/**
 * Drop a canvas's backing store.
 *
 * Setting the intrinsic width/height to zero is the only way to make a
 * browser hand back the pixel buffer while keeping the element (and its
 * CSS box, and every listener attached to it) exactly where it is. The
 * element still lays out at 100%/100% because that is CSS; only the
 * pixels go away, and `fitCanvas` re-creates them on the way back in.
 */
export function releaseCanvas(canvas) {
	if (!canvas) return;
	if (canvas.width === 0 && canvas.height === 0) return;
	canvas.width = 0;
	canvas.height = 0;
}

/**
 * Two-ring viewport gate for a scene.
 *
 * A page of full-bleed pinned scenes only ever SHOWS one of them, but by
 * default it pays for all of them: every canvas holds a full-viewport
 * pixel buffer forever, and every scene runs its own 60fps RAF loop for
 * the entire visit. Nine tenths of both costs are spent painting pixels
 * nobody can see.
 *
 * This gate gives each scene two concentric rings around the viewport:
 *
 *   NEAR  (±`nearMargin`)  — the canvas keeps/gets its backing store, so
 *                            it is fully painted well before it can be
 *                            seen. Outside this ring the pixels are
 *                            released.
 *   LIVE  (±`liveMargin`)  — the RAF loop runs. Outside it the loop is
 *                            parked, because animating an invisible
 *                            canvas is pure heat.
 *
 * NEAR is the outer ring, so a scene is always allocated and painted
 * before it becomes live, and always live before it is on screen. That
 * ordering is what keeps re-entry from ever flashing an empty canvas.
 *
 * HYSTERESIS
 * ----------
 * NEAR is actually two rings, not one: a scene allocates at
 * `nearMargin` but does not release until it is past `farMargin`. A
 * single boundary would sit exactly where a reader parks the scroll and
 * jitters, and every crossing costs a full-canvas allocation plus a
 * full repaint. The dead zone between the two makes that thrash
 * impossible.
 *
 * `document.visibilityState` is folded into LIVE as well: a backgrounded
 * tab should do exactly zero work. (RAF is already throttled when hidden,
 * but being explicit means we also stop cleanly rather than resuming
 * mid-frame with a stale clock.)
 *
 * @param {HTMLElement} el element to observe
 * @param {{
 *   nearMargin?: string,
 *   liveMargin?: string,
 *   onNear: (near: boolean) => void,
 *   onLive: (live: boolean) => void
 * }} options
 * @returns {() => void} teardown
 */
export function createViewportGate(el, options) {
	/*
	 * LIVE is deliberately tight (a small sliver, not a whole viewport).
	 * A scene is already allocated and fully painted by the NEAR ring long
	 * before it reaches this one, so there is nothing to warm up: starting
	 * the loop the moment the scene actually touches the viewport is both
	 * invisible to the reader and the difference between one animation
	 * running and three.
	 */
	const {
		nearMargin = '120% 0px',
		farMargin = '200% 0px',
		liveMargin = '5% 0px',
		onNear,
		onLive
	} = options;
	if (!browser || !el || typeof IntersectionObserver !== 'function') {
		// No observer support: behave exactly like the old code — always on.
		onNear(true);
		onLive(true);
		return () => {};
	}

	let near = false;
	let inLiveRing = false;
	let live = false;

	const syncLive = () => {
		const next = inLiveRing && document.visibilityState !== 'hidden';
		if (next === live) return;
		live = next;
		onLive(live);
	};

	const setNear = (next) => {
		if (next === near) return;
		near = next;
		onNear(near);
		// Re-assert the live state after an allocation change so a scene
		// that went near+live in the same tick paints before it animates.
		if (near) syncLive();
	};

	// Inner ring: entering it allocates. Leaving it does nothing — that is
	// the far ring's job.
	const nearObserver = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) setNear(true);
		},
		{ rootMargin: nearMargin }
	);

	// Outer ring: leaving it releases. Entering it does nothing.
	const farObserver = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) setNear(false);
		},
		{ rootMargin: farMargin }
	);

	const liveObserver = new IntersectionObserver(
		([entry]) => {
			inLiveRing = entry.isIntersecting;
			syncLive();
		},
		{ rootMargin: liveMargin }
	);

	const onVisibility = () => syncLive();
	document.addEventListener('visibilitychange', onVisibility);

	nearObserver.observe(el);
	farObserver.observe(el);
	liveObserver.observe(el);

	return () => {
		nearObserver.disconnect();
		farObserver.disconnect();
		liveObserver.disconnect();
		document.removeEventListener('visibilitychange', onVisibility);
	};
}

/** Clamp helper used all over the canvas scenes. */
export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Map `t` in [a,b] to [0,1], clamped. Great for staging scene beats. */
export function range(t, a, b) {
	if (b === a) return t >= b ? 1 : 0;
	return clamp((t - a) / (b - a));
}

/** Smoothstep easing for hand-rolled canvas interpolation. */
export function smoothstep(t) {
	const x = clamp(t);
	return x * x * (3 - 2 * x);
}
