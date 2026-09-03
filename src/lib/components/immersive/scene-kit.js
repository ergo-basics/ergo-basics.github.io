/*
 * src/lib/components/immersive/scene-kit.js
 * ------------------------------------------------------------------
 * Shared drawing primitives for every procedural canvas scene on the
 * site (/, /depin, /developers, /users).
 *
 * These started life inside the DePIN scene file. Once the home page
 * and the two audience pages got the same treatment they were copied
 * three times over, so they live here instead and every scene module
 * imports from one place.
 *
 * Contract for a scene function:
 *   draw(ctx, { width, height, progress, palette, mouse, time, align })
 * It must be a PURE function of those inputs — no hidden state — so a
 * single paint at progress = 1 is a valid reduced-motion fallback.
 *
 * Colours never get hardcoded: PinnedScene resolves the palette from
 * CSS custom properties at draw time and repaints on theme flips, so
 * every canvas re-themes instantly with the rest of the page.
 */

import { clamp, smoothstep } from '$lib/motion.js';

/** Stable hash-based "random" in [0,1); same input → same output. */
export function rand(i) {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
}

/** `rgba()` from an "r, g, b" triple string plus alpha. */
export function rgba(triple, alpha) {
	return `rgba(${triple}, ${alpha})`;
}

/** Rounded rectangle path (older Safari lacks ctx.roundRect). */
export function roundRect(ctx, x, y, w, h, r) {
	const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + w - radius, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
	ctx.lineTo(x + w, y + h - radius);
	ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
	ctx.lineTo(x + radius, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

/** Faint dot-grid backdrop shared by every scene. */
export function backdrop(ctx, width, height, palette, progress, mouse, align = 'left') {
	const step = 46;
	const px = (mouse.x - 0.5) * 18;
	const py = (mouse.y - 0.5) * 18;
	ctx.save();
	ctx.fillStyle = palette.grid;
	for (let x = -step; x < width + step; x += step) {
		for (let y = -step; y < height + step; y += step) {
			// Parallax the grid slightly toward the cursor for depth.
			ctx.beginPath();
			ctx.arc(x + px, y + py, 1.1, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	// A soft horizon glow behind the focal point, brightening as the
	// scene resolves. Tracks the stage side so it never lights up the
	// area the caption occupies.
	const gx = width * (align === 'right' ? 0.34 : 0.66);
	const glow = ctx.createRadialGradient(
		gx,
		height * 0.5,
		0,
		gx,
		height * 0.5,
		Math.max(width, height) * 0.6
	);
	glow.addColorStop(0, rgba(palette.onSurfaceRgb, 0.05 + 0.05 * smoothstep(progress)));
	glow.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, width, height);
	ctx.restore();
}

/**
 * Layout anchor. The caption occupies one side of the pinned section, so
 * the visual composes into the OTHER side: `align: 'left'` copy → stage
 * on the right, and vice versa. On compact viewports the copy sits in a
 * scrim along the bottom, so the stage centres and rides high instead.
 */
export function stage(width, height, align = 'left') {
	const compact = width < 820;
	return {
		compact,
		cx: compact ? width * 0.5 : width * (align === 'right' ? 0.32 : 0.68),
		cy: compact ? height * 0.3 : height * 0.5,
		scale: Math.min(compact ? width / 460 : width / 1500, height / 760) * (compact ? 1 : 1.3)
	};
}

/**
 * A dot travelling along a segment, used everywhere a scene needs to
 * show "something is flowing from A to B". `k` is 0–1 along the path.
 */
export function packet(ctx, ax, ay, bx, by, k, colour, alpha = 1, radius = 3.2) {
	ctx.save();
	ctx.globalAlpha = alpha * (1 - Math.abs(k - 0.5) * 1.1);
	ctx.fillStyle = colour;
	ctx.beginPath();
	ctx.arc(ax + (bx - ax) * k, ay + (by - ay) * k, radius, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/**
 * Draw a label pinned to a point in the scene. Canvas text is the one
 * place a scene can state a term ("BOX", "microVM") that the caption
 * beside it is talking about, so it is worth having a tidy helper.
 */
export function label(ctx, text, x, y, palette, alpha = 1, size = 12, weight = 700) {
	if (alpha <= 0.01) return;
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.font = `${weight} ${size}px ${palette.fontBody || 'Lato, sans-serif'}`;
	ctx.direction = palette.direction || 'ltr';
	ctx.textAlign = 'center';
	ctx.fillStyle = rgba(palette.onSurfaceRgb, 0.78);
	ctx.fillText(text, x, y);
	ctx.restore();
}

/**
 * The sealed-service glyph: a rounded box whose four edges draw
 * themselves in sequence, then tint and (optionally) get a lock.
 * Both /developers and /users lean on this — a Celaut service *is* a
 * sealed, self-contained box, so it reappears wherever that idea does.
 *
 * `t` 0 → 1 controls the seal.
 */
export function sealedBox(ctx, x, y, w, h, t, palette, { tint = true, scan = 0 } = {}) {
	const s = smoothstep(clamp(t));
	if (s <= 0) return;
	ctx.save();
	ctx.strokeStyle = palette.node;
	ctx.lineWidth = 2.4;
	ctx.lineCap = 'round';
	const edges = [
		[x, y, x + w, y],
		[x + w, y, x + w, y + h],
		[x + w, y + h, x, y + h],
		[x, y + h, x, y]
	];
	edges.forEach((e, i) => {
		const k = clamp((s - i * 0.2) / 0.4);
		if (k <= 0) return;
		ctx.beginPath();
		ctx.moveTo(e[0], e[1]);
		ctx.lineTo(e[0] + (e[2] - e[0]) * k, e[1] + (e[3] - e[1]) * k);
		ctx.stroke();
	});
	if (tint && s > 0.85) {
		ctx.globalAlpha = 0.08;
		ctx.fillStyle = palette.node;
		roundRect(ctx, x, y, w, h, 4);
		ctx.fill();
	}
	if (scan > 0 && s > 0.85) {
		ctx.globalAlpha = 0.32;
		const scanY = y + ((scan * 60) % h);
		ctx.strokeStyle = palette.node;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(x, scanY);
		ctx.lineTo(x + w, scanY);
		ctx.stroke();
	}
	ctx.restore();
}

/*
 * MEMBRANE — the organic body of a service.
 *
 * A Celaut service is a sealed *thing* with a handful of declared
 * openings, which reads far better as a cell than as a rectangle: the
 * README's own framing is biological (cellular automata, "nodes as
 * organisms"). The radius wobbles on two lobes so the body breathes,
 * and `poreAt` reuses the exact same formula, so a channel anchored to
 * an angle stays welded to the edge while it moves.
 */
const MEMBRANE_LOBES = [
	{ k: 3, amp: 0.06, speed: 0.4 },
	{ k: 5, amp: 0.04, speed: -0.3 }
];

/** Radius of the membrane at one angle. Pure in (r, angle, time). */
export function membraneRadius(r, angle, time, wobble = 1) {
	let m = 1;
	for (const l of MEMBRANE_LOBES) m += wobble * l.amp * Math.sin(l.k * angle + time * l.speed);
	return r * m;
}

/**
 * Trace the membrane as a path. `close` 0 → 1 draws a growing arc, so
 * the body can seal itself shut as a scene progresses; at 1 the path is
 * closed and can be filled. The caller decides stroke/fill.
 */
export function membranePath(ctx, cx, cy, r, time, wobble = 1, close = 1) {
	const c = clamp(close);
	const span = Math.PI * 2 * c;
	const steps = Math.max(8, Math.round(140 * c));
	ctx.beginPath();
	for (let i = 0; i <= steps; i++) {
		const a = -Math.PI / 2 + (i / steps) * span;
		const rr = membraneRadius(r, a, time, wobble);
		const x = cx + Math.cos(a) * rr;
		const y = cy + Math.sin(a) * rr;
		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	}
	if (c >= 1) ctx.closePath();
}

/** The point on that membrane at a given angle — where a channel starts. */
export function poreAt(cx, cy, r, angle, time, wobble = 1) {
	const rr = membraneRadius(r, angle, time, wobble);
	return { x: cx + Math.cos(angle) * rr, y: cy + Math.sin(angle) * rr, r: rr };
}

/* ==================================================================
 * HERO — cursor-reactive peer field
 * Not scroll-scrubbed; this one just breathes and follows the pointer,
 * so the very first thing on an immersive page already feels alive.
 * Shared by /depin, /developers and /users.
 * ================================================================== */
export function drawHeroField(ctx, { width, height, palette, mouse, time }) {
	const N = width < 820 ? 26 : 46;
	const mx = mouse.x * width;
	const my = mouse.y * height;
	const pts = [];

	for (let i = 0; i < N; i++) {
		const bx = rand(i) * width;
		const by = rand(i + 100) * height;
		const drift = 18 + rand(i + 200) * 26;
		let x = bx + Math.sin(time * 0.22 + i * 1.3) * drift;
		let y = by + Math.cos(time * 0.19 + i * 0.9) * drift;
		// Nodes lean toward the cursor — the network notices you.
		const dx = mx - x;
		const dy = my - y;
		const d = Math.hypot(dx, dy) || 1;
		if (d < 260) {
			const pull = (1 - d / 260) * 26;
			x += (dx / d) * pull;
			y += (dy / d) * pull;
		}
		pts.push({ x, y, r: 1.6 + rand(i + 300) * 2.4, d });
	}

	// Links between near neighbours.
	ctx.save();
	ctx.lineWidth = 1;
	for (let i = 0; i < N; i++) {
		for (let j = i + 1; j < N; j++) {
			const dx = pts[i].x - pts[j].x;
			const dy = pts[i].y - pts[j].y;
			const d = Math.hypot(dx, dy);
			const max = width < 820 ? 130 : 175;
			if (d > max) continue;
			ctx.globalAlpha = (1 - d / max) * 0.4;
			ctx.strokeStyle = palette.link;
			ctx.beginPath();
			ctx.moveTo(pts[i].x, pts[i].y);
			ctx.lineTo(pts[j].x, pts[j].y);
			ctx.stroke();
		}
	}
	ctx.restore();

	pts.forEach((p, i) => {
		const near = p.d < 260;
		ctx.save();
		ctx.globalAlpha = near ? 0.95 : 0.5;
		ctx.fillStyle = i % 6 === 0 ? palette.accent : palette.node;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.r * (near ? 1.5 : 1), 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	});

	// A halo tracking the cursor, so the reaction is unmistakable.
	if (mouse.active) {
		const g = ctx.createRadialGradient(mx, my, 0, mx, my, 230);
		g.addColorStop(0, rgba(palette.onSurfaceRgb, 0.07));
		g.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.save();
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, width, height);
		ctx.restore();
	}
}
