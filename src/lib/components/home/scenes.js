/*
 * src/lib/components/home/scenes.js
 * ------------------------------------------------------------------
 * Procedural canvas scenes for the Ergo Basics landing page.
 *
 * Each scene is a pure function of (ctx, { width, height, progress,
 * palette, mouse, time }) — no image assets, no frame sequences. The
 * scroll position drives `progress`, so scrolling literally scrubs the
 * animation. A few KB of code instead of a few MB of video.
 *
 *   1. boxes  — the eUTXO model: inputs consumed, outputs created, and
 *               a DATA INPUT that is read without being spent.
 *   2. sigma  — Sigma propositions composed with AND / OR / threshold.
 *   3. pow    — permissionless block production vs a coordinated
 *               validator set that has relays to lean on.
 *   4. rent   — storage rent: dormant boxes age, then are collected.
 *   5. credit — Basis / ChainCash: IOU notes moving along trust edges,
 *               anchored by optional on-chain reserves.
 *
 * Everything is drawn from the theme palette so both themes work, and
 * every scene must look correct at progress = 1 — that is the single
 * static frame reduced-motion visitors get.
 */

import { clamp, smoothstep } from '$lib/motion.js';
import {
	rand,
	rgba,
	roundRect,
	backdrop,
	stage,
	packet,
	label
} from '$lib/components/immersive/scene-kit.js';

/** Progress mapped into a sub-window, then smoothed. 0 before, 1 after. */
function phase(progress, from, to) {
	return smoothstep(clamp((progress - from) / Math.max(0.0001, to - from), 0, 1));
}

/* ==================================================================
 * SCENE 1 — BOXES (the eUTXO model)
 *
 * Two input boxes are consumed and two outputs created. A third box
 * sits apart and is only READ: the line to it is dotted, and it is
 * still there when the transaction is done. That distinction — data
 * inputs — is the whole reason Ergo oracles do not fight over a single
 * hot box, so it deserves to be the thing the eye lands on.
 * ================================================================== */
export function drawBoxes(ctx, { width, height, progress, palette, mouse, time }) {
	backdrop(ctx, width, height, palette, progress, mouse, 'left');
	const { cx, cy, scale, compact } = stage(width, height, 'left');

	const bw = 132 * scale;
	const bh = 92 * scale;
	const gap = 58 * scale;

	const appear = phase(progress, 0.02, 0.22);
	const spend = phase(progress, 0.3, 0.56);
	const create = phase(progress, 0.46, 0.74);
	const readLink = phase(progress, 0.66, 0.9);

	const inX = cx - bw - gap;
	const outX = cx + gap;
	const rowY = [cy - bh * 0.72, cy + bh * 0.72];

	// ---- the box glyph -------------------------------------------------
	function box(x, y, t, { spent = 0, filled = 1, tag = '' } = {}) {
		if (t <= 0.01) return;
		ctx.save();
		ctx.globalAlpha = t * (1 - spent * 0.82);
		const shrink = 1 - spent * 0.12;
		const w = bw * shrink;
		const h = bh * shrink;
		const bx = x + (bw - w) / 2;
		const by = y + (bh - h) / 2;

		// Body.
		roundRect(ctx, bx, by, w, h, 10 * scale);
		ctx.fillStyle = rgba(palette.surfaceDeepRgb, 0.9);
		ctx.fill();
		ctx.lineWidth = 1.6 * scale;
		ctx.strokeStyle = spent > 0.5 ? rgba(palette.onSurfaceRgb, 0.22) : palette.accent;
		ctx.stroke();

		// Value bar — the ERG the box carries.
		if (filled > 0) {
			roundRect(ctx, bx + 10 * scale, by + 12 * scale, (w - 20 * scale) * filled, 7 * scale, 3 * scale);
			ctx.fillStyle = rgba(palette.onSurfaceRgb, 0.5);
			ctx.fill();
		}

		// Register lanes: R0–R3 mandatory (solid), R4–R9 optional (faint).
		const lane = (w - 20 * scale) / 10;
		for (let i = 0; i < 10; i++) {
			const lit = i < 4 ? 0.6 : 0.2 + 0.32 * Math.max(0, Math.sin(time * 0.7 + i * 0.9));
			ctx.fillStyle = rgba(palette.onSurfaceRgb, lit * 0.55);
			ctx.fillRect(
				bx + 10 * scale + i * lane + lane * 0.16,
				by + h - 20 * scale,
				lane * 0.68,
				8 * scale
			);
		}
		ctx.restore();

		if (tag) label(ctx, tag, x + bw / 2, y - 10 * scale, palette, t * 0.9, 11 * scale);
	}

	// ---- the read-only box, off to one side ---------------------------
	const dataX = compact ? cx - bw / 2 : cx + gap * 0.2;
	const dataY = cy + bh * 2.05;

	// Inputs.
	box(inX, rowY[0], appear, { spent: spend, filled: 0.82, tag: 'INPUT' });
	box(inX, rowY[1], appear, { spent: spend, filled: 0.5 });

	// The transaction node itself.
	const txA = phase(progress, 0.24, 0.44);
	if (txA > 0.01) {
		ctx.save();
		ctx.globalAlpha = txA;
		ctx.beginPath();
		ctx.arc(cx, cy, 15 * scale * (0.7 + 0.3 * txA), 0, Math.PI * 2);
		ctx.fillStyle = palette.accent;
		ctx.fill();
		// A soft pulse so the node reads as "the event", not a dot.
		ctx.globalAlpha = txA * (0.3 + 0.2 * Math.sin(time * 2));
		ctx.beginPath();
		ctx.arc(cx, cy, 26 * scale, 0, Math.PI * 2);
		ctx.strokeStyle = palette.accent;
		ctx.lineWidth = 1.4 * scale;
		ctx.stroke();
		ctx.restore();
		label(ctx, 'TX', cx, cy + 42 * scale, palette, txA * 0.85, 11 * scale);
	}

	// Consuming edges (solid — these boxes are destroyed).
	ctx.save();
	ctx.strokeStyle = rgba(palette.onSurfaceRgb, 0.3 * spend);
	ctx.lineWidth = 1.5 * scale;
	for (const y of rowY) {
		ctx.beginPath();
		ctx.moveTo(inX + bw, y + bh / 2);
		ctx.lineTo(cx - 16 * scale, cy);
		ctx.stroke();
	}
	ctx.restore();
	for (const y of rowY) {
		if (spend > 0.02 && spend < 0.99) {
			packet(ctx, inX + bw, y + bh / 2, cx, cy, spend, palette.accent, 1, 3.4 * scale);
		}
	}

	// Outputs.
	box(outX, rowY[0], create, { filled: 0.66, tag: 'OUTPUT' });
	box(outX, rowY[1], create, { filled: 0.62 });
	ctx.save();
	ctx.strokeStyle = rgba(palette.onSurfaceRgb, 0.3 * create);
	ctx.lineWidth = 1.5 * scale;
	for (const y of rowY) {
		ctx.beginPath();
		ctx.moveTo(cx + 16 * scale, cy);
		ctx.lineTo(outX, y + bh / 2);
		ctx.stroke();
	}
	ctx.restore();

	// The data input: dotted edge, box never dimmed, arrowhead pointing
	// AT the transaction to say the data flows in but the box does not.
	box(dataX, dataY, phase(progress, 0.6, 0.78), { filled: 0.9 });
	if (readLink > 0.01) {
		ctx.save();
		ctx.globalAlpha = readLink;
		ctx.setLineDash([5 * scale, 5 * scale]);
		ctx.lineDashOffset = -time * 22 * scale;
		ctx.strokeStyle = palette.accentText;
		ctx.lineWidth = 1.6 * scale;
		ctx.beginPath();
		ctx.moveTo(dataX + bw / 2, dataY);
		ctx.lineTo(cx, cy + 22 * scale);
		ctx.stroke();
		ctx.restore();
		label(
			ctx,
			'DATA INPUT · READ, NOT SPENT',
			dataX + bw / 2,
			dataY + bh + 22 * scale,
			palette,
			readLink * 0.95,
			11 * scale
		);
	}
}

/* ==================================================================
 * SCENE 2 — SIGMA PROPOSITIONS
 *
 * A proof tree assembles: discrete-log leaves at the bottom, combined
 * by OR / AND / threshold nodes. At the end a 2-of-3 threshold lights
 * exactly two branches — the point being that the *policy* is part of
 * the spending condition, not an application-level convention.
 * ================================================================== */
export function drawSigma(ctx, { width, height, progress, palette, mouse, time }) {
	backdrop(ctx, width, height, palette, progress, mouse, 'right');
	const { cx, cy, scale } = stage(width, height, 'right');

	const spread = 116 * scale;
	const leafY = cy + 84 * scale;
	const rootY = cy - 92 * scale;

	const leaves = [-1.5, -0.5, 0.5, 1.5].map((k, i) => ({
		x: cx + k * spread,
		y: leafY,
		i
	}));

	const grow = phase(progress, 0.04, 0.3);
	const join = phase(progress, 0.28, 0.56);
	const rootIn = phase(progress, 0.5, 0.72);
	const thresh = phase(progress, 0.7, 0.94);

	// Which leaves the threshold actually satisfies (2 of 4 here).
	const chosen = [0, 2];

	// Mid nodes pair the leaves up.
	const mids = [
		{ x: (leaves[0].x + leaves[1].x) / 2, y: cy - 6 * scale, kids: [0, 1], op: 'OR' },
		{ x: (leaves[2].x + leaves[3].x) / 2, y: cy - 6 * scale, kids: [2, 3], op: 'AND' }
	];

	// ---- edges ---------------------------------------------------------
	ctx.save();
	ctx.lineWidth = 1.5 * scale;
	for (const m of mids) {
		for (const k of m.kids) {
			const on = thresh > 0.05 && chosen.includes(k);
			ctx.strokeStyle = on
				? rgba(palette.accentTextRgb || palette.onSurfaceRgb, 0.9)
				: rgba(palette.onSurfaceRgb, 0.22 * join);
			if (on) ctx.strokeStyle = palette.accentText;
			ctx.globalAlpha = join;
			ctx.beginPath();
			ctx.moveTo(leaves[k].x, leaves[k].y - 14 * scale);
			ctx.lineTo(m.x, m.y + 14 * scale);
			ctx.stroke();
		}
	}
	ctx.globalAlpha = rootIn;
	ctx.strokeStyle = rgba(palette.onSurfaceRgb, 0.28);
	for (const m of mids) {
		ctx.beginPath();
		ctx.moveTo(m.x, m.y - 14 * scale);
		ctx.lineTo(cx, rootY + 16 * scale);
		ctx.stroke();
	}
	ctx.restore();

	// ---- leaves: discrete-log knowledge proofs -------------------------
	leaves.forEach((l, i) => {
		const t = phase(progress, 0.04 + i * 0.045, 0.26 + i * 0.045);
		if (t <= 0.01) return;
		const lit = thresh > 0.05 && chosen.includes(i);
		ctx.save();
		ctx.globalAlpha = t;
		ctx.beginPath();
		ctx.arc(l.x, l.y, 20 * scale, 0, Math.PI * 2);
		ctx.fillStyle = lit ? palette.accent : rgba(palette.surfaceDeepRgb, 0.92);
		ctx.fill();
		ctx.lineWidth = 1.6 * scale;
		ctx.strokeStyle = lit ? palette.accent : rgba(palette.onSurfaceRgb, 0.34);
		ctx.stroke();
		// A tiny orbiting mark: this leaf is a *proof*, not a static key.
		ctx.globalAlpha = t * 0.8;
		const a = time * 0.9 + i * 1.7;
		ctx.beginPath();
		ctx.arc(l.x + Math.cos(a) * 13 * scale, l.y + Math.sin(a) * 13 * scale, 2.4 * scale, 0, Math.PI * 2);
		ctx.fillStyle = lit ? palette.onAccent || palette.surfaceDeep : palette.accentText;
		ctx.fill();
		ctx.restore();
		label(ctx, `pk${i + 1}`, l.x, l.y + 40 * scale, palette, t * 0.8, 11 * scale);
	});

	// ---- operator nodes ------------------------------------------------
	for (const m of mids) {
		if (join <= 0.02) break;
		ctx.save();
		ctx.globalAlpha = join;
		roundRect(ctx, m.x - 30 * scale, m.y - 14 * scale, 60 * scale, 28 * scale, 8 * scale);
		ctx.fillStyle = rgba(palette.surfaceDeepRgb, 0.95);
		ctx.fill();
		ctx.lineWidth = 1.4 * scale;
		ctx.strokeStyle = rgba(palette.onSurfaceRgb, 0.34);
		ctx.stroke();
		ctx.restore();
		label(ctx, m.op, m.x, m.y + 4 * scale, palette, join, 12 * scale);
	}

	// ---- root: the threshold ------------------------------------------
	if (rootIn > 0.02) {
		ctx.save();
		ctx.globalAlpha = rootIn;
		roundRect(ctx, cx - 52 * scale, rootY - 16 * scale, 104 * scale, 32 * scale, 9 * scale);
		ctx.fillStyle = thresh > 0.4 ? palette.accent : rgba(palette.surfaceDeepRgb, 0.95);
		ctx.fill();
		ctx.lineWidth = 1.6 * scale;
		ctx.strokeStyle = palette.accent;
		ctx.stroke();
		ctx.restore();
		label(ctx, 'atLeast(2)', cx, rootY + 5 * scale, palette, rootIn, 12 * scale);
		label(
			ctx,
			'ONE SPENDING CONDITION',
			cx,
			rootY - 36 * scale,
			palette,
			phase(progress, 0.78, 0.98) * 0.9,
			11 * scale
		);
	}
}

/* ==================================================================
 * SCENE 3 — PROOF OF WORK, AND WHAT IT DOESN'T NEED
 *
 * Left: a scatter of independent miners, each hashing on its own, one
 * of them finding a block. Nothing connects them but the network.
 * Right: the same job done by a known validator set that has to route
 * through relays — every extra hop drawn as a place a message can be
 * held. The scene never says "PoS is bad"; it just draws the topology.
 * ================================================================== */
export function drawPow(ctx, { width, height, progress, palette, mouse, time }) {
	backdrop(ctx, width, height, palette, progress, mouse, 'left');
	const { cx, cy, scale, compact } = stage(width, height, 'left');

	const miners = phase(progress, 0.03, 0.24);
	const hashing = phase(progress, 0.18, 0.44);
	const found = phase(progress, 0.42, 0.6);
	const compare = phase(progress, 0.6, 0.82);
	const chokeIn = phase(progress, 0.76, 0.96);

	const colGap = compact ? 0 : 210 * scale;
	const leftX = compact ? cx : cx - colGap;
	const topY = cy - 118 * scale;

	// ---- independent miners -------------------------------------------
	const N = 11;
	for (let i = 0; i < N; i++) {
		const t = phase(progress, 0.03 + i * 0.014, 0.2 + i * 0.014);
		if (t <= 0.01) continue;
		const a = (i / N) * Math.PI * 2 + 0.4;
		const r = (58 + rand(i) * 52) * scale;
		const x = leftX + Math.cos(a) * r;
		const y = topY + 118 * scale + Math.sin(a) * r * 0.72;
		const winner = i === 4;

		ctx.save();
		ctx.globalAlpha = t;
		ctx.beginPath();
		ctx.arc(x, y, (winner ? 11 : 7.5) * scale, 0, Math.PI * 2);
		ctx.fillStyle = winner && found > 0.3 ? palette.accent : rgba(palette.onSurfaceRgb, 0.42);
		ctx.fill();

		// Hash attempts: a jitter ring that speeds up while they work.
		if (hashing > 0.05 && !(winner && found > 0.5)) {
			ctx.globalAlpha = t * hashing * 0.55;
			const j = time * 5 + i * 2.1;
			ctx.beginPath();
			ctx.arc(
				x + Math.cos(j) * 12 * scale,
				y + Math.sin(j * 1.3) * 12 * scale,
				1.9 * scale,
				0,
				Math.PI * 2
			);
			ctx.strokeStyle = palette.accentText;
			ctx.lineWidth = 1.2 * scale;
			ctx.stroke();
		}
		ctx.restore();

		// The winner simply announces — no permission asked of anyone.
		if (winner && found > 0.05) {
			ctx.save();
			ctx.globalAlpha = found * (0.5 - 0.3 * Math.sin(time * 2.4));
			ctx.beginPath();
			ctx.arc(x, y, (18 + found * 26) * scale, 0, Math.PI * 2);
			ctx.strokeStyle = palette.accent;
			ctx.lineWidth = 1.5 * scale;
			ctx.stroke();
			ctx.restore();
		}
	}
	label(
		ctx,
		'ANYONE MAY PRODUCE A BLOCK',
		leftX,
		topY + 262 * scale,
		palette,
		miners * 0.95,
		11 * scale
	);

	if (compact || compare <= 0.02) return;

	// ---- the coordinated alternative ----------------------------------
	const rightX = cx + colGap;
	ctx.save();
	ctx.globalAlpha = compare;

	// A registry row: a known, enumerable set.
	const M = 7;
	for (let i = 0; i < M; i++) {
		const x = rightX + (i - (M - 1) / 2) * 30 * scale;
		const y = topY + 44 * scale;
		roundRect(ctx, x - 9 * scale, y - 12 * scale, 18 * scale, 24 * scale, 4 * scale);
		ctx.fillStyle = rgba(palette.onSurfaceRgb, 0.3);
		ctx.fill();
	}
	ctx.restore();
	label(ctx, 'KNOWN VALIDATOR SET', rightX, topY + 12 * scale, palette, compare * 0.9, 11 * scale);

	// Relay hops — each one an extra party in the path.
	const hops = [
		{ y: topY + 128 * scale, name: 'RELAY' },
		{ y: topY + 196 * scale, name: 'BUILDER' }
	];
	hops.forEach((h, i) => {
		const t = phase(progress, 0.66 + i * 0.07, 0.86 + i * 0.07);
		if (t <= 0.02) return;
		ctx.save();
		ctx.globalAlpha = t;
		roundRect(ctx, rightX - 62 * scale, h.y - 15 * scale, 124 * scale, 30 * scale, 8 * scale);
		ctx.fillStyle = rgba(palette.surfaceDeepRgb, 0.95);
		ctx.fill();
		ctx.lineWidth = 1.4 * scale;
		ctx.strokeStyle = rgba(palette.onSurfaceRgb, 0.32);
		ctx.stroke();
		ctx.restore();
		label(ctx, h.name, rightX, h.y + 4 * scale, palette, t, 11 * scale);
	});

	// The funnel: everything must pass through.
	ctx.save();
	ctx.globalAlpha = compare * 0.5;
	ctx.strokeStyle = rgba(palette.onSurfaceRgb, 0.3);
	ctx.lineWidth = 1.4 * scale;
	ctx.beginPath();
	ctx.moveTo(rightX, topY + 60 * scale);
	ctx.lineTo(rightX, topY + 240 * scale);
	ctx.stroke();
	ctx.restore();

	if (chokeIn > 0.02) {
		for (const h of hops) {
			ctx.save();
			ctx.globalAlpha = chokeIn * (0.45 + 0.3 * Math.sin(time * 2 + h.y));
			ctx.beginPath();
			ctx.arc(rightX + 78 * scale, h.y, 5 * scale, 0, Math.PI * 2);
			ctx.fillStyle = palette.accentText;
			ctx.fill();
			ctx.restore();
		}
		label(
			ctx,
			'EACH HOP IS A POINT OF CONTROL',
			rightX,
			topY + 262 * scale,
			palette,
			chokeIn * 0.95,
			11 * scale
		);
	}
}

/* ==================================================================
 * SCENE 4 — STORAGE RENT
 *
 * A field of boxes. A four-year sweep passes across it; boxes that are
 * never touched fade toward dormancy, and once the sweep reaches them
 * the miner collects. Value visibly leaves the dormant box and returns
 * to the network — rent as garbage collection that pays for itself.
 * ================================================================== */
export function drawRent(ctx, { width, height, progress, palette, mouse, time }) {
	backdrop(ctx, width, height, palette, progress, mouse, 'right');
	const { cx, cy, scale, compact } = stage(width, height, 'right');

	const cols = compact ? 4 : 6;
	const rows = 4;
	const bw = 52 * scale;
	const bh = 38 * scale;
	const gx = 20 * scale;
	const gy = 22 * scale;
	const fieldW = cols * bw + (cols - 1) * gx;
	const fieldH = rows * bh + (rows - 1) * gy;
	const ox = cx - fieldW / 2;
	const oy = cy - fieldH / 2 - 10 * scale;

	const appear = phase(progress, 0.02, 0.24);
	const age = phase(progress, 0.22, 0.66);
	const sweep = phase(progress, 0.5, 0.88);
	const collect = phase(progress, 0.62, 0.94);

	// The sweep line is the clock: everything left of it has had its
	// four years counted.
	const sweepX = ox - 30 * scale + sweep * (fieldW + 60 * scale);

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const i = r * cols + c;
			const t = phase(progress, 0.02 + i * 0.006, 0.2 + i * 0.006);
			if (t <= 0.01) continue;
			const x = ox + c * (bw + gx);
			const y = oy + r * (bh + gy);

			// Roughly a third of the field stays active (someone spends
			// them); the rest go dormant. Deterministic per index.
			const active = rand(i * 3.7) > 0.62;
			const dormancy = active ? 0 : age;
			const collected = !active && sweepX > x + bw ? collect : 0;

			ctx.save();
			ctx.globalAlpha = t * (1 - collected * 0.75);
			roundRect(ctx, x, y, bw, bh, 6 * scale);
			ctx.fillStyle = rgba(palette.surfaceDeepRgb, 0.9);
			ctx.fill();
			ctx.lineWidth = 1.4 * scale;
			ctx.strokeStyle = collected
				? rgba(palette.onSurfaceRgb, 0.18)
				: active
					? palette.accent
					: rgba(palette.onSurfaceRgb, 0.2 + 0.3 * (1 - dormancy));
			ctx.stroke();

			// Value inside the box, drained once rent is collected.
			const val = (1 - collected) * (active ? 1 : 1 - dormancy * 0.35);
			if (val > 0.02) {
				ctx.fillStyle = rgba(palette.onSurfaceRgb, active ? 0.5 : 0.3);
				ctx.fillRect(x + 8 * scale, y + bh / 2 - 3 * scale, (bw - 16 * scale) * val, 6 * scale);
			}
			ctx.restore();

			// Rent leaving the box, heading for the miner.
			if (collected > 0.05 && collected < 0.98) {
				packet(
					ctx,
					x + bw / 2,
					y + bh / 2,
					cx,
					oy + fieldH + 62 * scale,
					collected,
					palette.accent,
					0.9,
					2.6 * scale
				);
			}
		}
	}

	// The four-year sweep line.
	if (sweep > 0.02 && sweep < 0.995) {
		ctx.save();
		ctx.globalAlpha = 0.8;
		ctx.strokeStyle = palette.accentText;
		ctx.lineWidth = 1.8 * scale;
		ctx.setLineDash([6 * scale, 6 * scale]);
		ctx.beginPath();
		ctx.moveTo(sweepX, oy - 26 * scale);
		ctx.lineTo(sweepX, oy + fieldH + 26 * scale);
		ctx.stroke();
		ctx.restore();
		label(ctx, '4 YEARS', sweepX, oy - 36 * scale, palette, 0.95, 11 * scale);
	}

	// The collector.
	if (collect > 0.05) {
		const my = oy + fieldH + 62 * scale;
		ctx.save();
		ctx.globalAlpha = collect;
		ctx.beginPath();
		ctx.arc(cx, my, 13 * scale, 0, Math.PI * 2);
		ctx.fillStyle = palette.accent;
		ctx.fill();
		ctx.restore();
		label(ctx, 'RENT → MINER', cx, my + 34 * scale, palette, collect * 0.95, 11 * scale);
	}

	label(
		ctx,
		'UNTOUCHED STATE IS NOT FREE',
		cx,
		oy - 62 * scale,
		palette,
		appear * 0.9,
		11 * scale
	);
}

/* ==================================================================
 * SCENE 5 — MUTUAL CREDIT (ChainCash / Basis)
 *
 * A note is issued by one peer and passes along a trust graph. Each
 * holder co-signs, so the ring of signatures around it thickens as it
 * travels — the note is backed by everyone who has accepted it. Two
 * peers additionally anchor to on-chain reserves, which is the
 * "optional reserves reduce trust" part of the design.
 * ================================================================== */
export function drawCredit(ctx, { width, height, progress, palette, mouse, time }) {
	backdrop(ctx, width, height, palette, progress, mouse, 'left');
	const { cx, cy, scale } = stage(width, height, 'left');

	const R = 118 * scale;
	const peers = [0, 1, 2, 3, 4].map((i) => {
		const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
		return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R * 0.86, i };
	});

	const net = phase(progress, 0.03, 0.24);
	const issue = phase(progress, 0.22, 0.4);
	const travel = phase(progress, 0.36, 0.76);
	const reserves = phase(progress, 0.64, 0.9);

	// Trust edges.
	ctx.save();
	ctx.globalAlpha = net * 0.55;
	ctx.strokeStyle = palette.link;
	ctx.lineWidth = 1.3 * scale;
	for (let i = 0; i < peers.length; i++) {
		const a = peers[i];
		const b = peers[(i + 1) % peers.length];
		ctx.beginPath();
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.stroke();
	}
	ctx.restore();

	// How far the note has travelled around the ring.
	const legs = peers.length - 1;
	const walked = travel * legs;
	const leg = Math.min(legs - 1, Math.floor(walked));
	const k = walked - leg;
	const from = peers[leg];
	const to = peers[leg + 1];
	// Signatures accumulated so far = every peer that has held it.
	const signatures = issue > 0.5 ? 1 + leg + (k > 0.5 ? 1 : 0) : 0;

	// Peers.
	peers.forEach((p, i) => {
		const t = phase(progress, 0.03 + i * 0.03, 0.22 + i * 0.03);
		if (t <= 0.01) return;
		const held = signatures > i;
		ctx.save();
		ctx.globalAlpha = t;
		ctx.beginPath();
		ctx.arc(p.x, p.y, 16 * scale, 0, Math.PI * 2);
		ctx.fillStyle = held ? palette.accent : rgba(palette.surfaceDeepRgb, 0.94);
		ctx.fill();
		ctx.lineWidth = 1.6 * scale;
		ctx.strokeStyle = held ? palette.accent : rgba(palette.onSurfaceRgb, 0.34);
		ctx.stroke();
		ctx.restore();
	});

	// Reserve anchors under two of the peers.
	if (reserves > 0.02) {
		for (const idx of [1, 3]) {
			const p = peers[idx];
			const ry = p.y + 46 * scale;
			ctx.save();
			ctx.globalAlpha = reserves;
			ctx.setLineDash([4 * scale, 4 * scale]);
			ctx.strokeStyle = rgba(palette.onSurfaceRgb, 0.34);
			ctx.lineWidth = 1.3 * scale;
			ctx.beginPath();
			ctx.moveTo(p.x, p.y + 18 * scale);
			ctx.lineTo(p.x, ry - 12 * scale);
			ctx.stroke();
			ctx.setLineDash([]);
			roundRect(ctx, p.x - 26 * scale, ry - 12 * scale, 52 * scale, 24 * scale, 6 * scale);
			ctx.fillStyle = rgba(palette.surfaceDeepRgb, 0.95);
			ctx.fill();
			ctx.strokeStyle = palette.accentText;
			ctx.stroke();
			ctx.restore();
			label(ctx, 'RESERVE', p.x, ry + 3 * scale, palette, reserves * 0.9, 9.5 * scale);
		}
	}

	// The note in flight, with a ring per signature.
	if (issue > 0.05) {
		const nx = travel <= 0.001 ? peers[0].x : from.x + (to.x - from.x) * k;
		const ny = travel <= 0.001 ? peers[0].y : from.y + (to.y - from.y) * k;
		ctx.save();
		ctx.globalAlpha = issue;
		roundRect(ctx, nx - 21 * scale, ny - 14 * scale, 42 * scale, 28 * scale, 5 * scale);
		ctx.fillStyle = palette.accent;
		ctx.fill();
		ctx.restore();
		label(ctx, 'IOU', nx, ny + 4 * scale, palette, issue, 11 * scale);

		for (let s = 0; s < signatures; s++) {
			ctx.save();
			ctx.globalAlpha = 0.42 - s * 0.05;
			ctx.beginPath();
			ctx.arc(nx, ny, (24 + s * 7) * scale, 0, Math.PI * 2);
			ctx.strokeStyle = palette.accentText;
			ctx.lineWidth = 1.3 * scale;
			ctx.stroke();
			ctx.restore();
		}
	}

	label(
		ctx,
		'EACH HOLDER CO-SIGNS · BACKING GROWS',
		cx,
		cy + R * 0.86 + 96 * scale,
		palette,
		phase(progress, 0.5, 0.8) * 0.95,
		11 * scale
	);
}

/**
 * Scene table for the landing page. `beats` carry only timings; the
 * words come from the dictionary under `home.scenes.<id>.beats[n]`.
 */
export const homeScenes = [
	{
		id: 'boxes',
		draw: drawBoxes,
		scrollLength: 2.6,
		align: 'left',
		beats: [
			{ from: 0.0, to: 0.34 },
			{ from: 0.32, to: 0.64 },
			{ from: 0.62, to: 1.0, hold: true }
		]
	},
	{
		id: 'sigma',
		draw: drawSigma,
		scrollLength: 2.4,
		align: 'right',
		beats: [
			{ from: 0.0, to: 0.36 },
			{ from: 0.34, to: 0.68 },
			{ from: 0.66, to: 1.0, hold: true }
		]
	},
	{
		id: 'pow',
		draw: drawPow,
		scrollLength: 2.6,
		align: 'left',
		beats: [
			{ from: 0.0, to: 0.34 },
			{ from: 0.32, to: 0.66 },
			{ from: 0.64, to: 1.0, hold: true }
		]
	},
	{
		id: 'rent',
		draw: drawRent,
		scrollLength: 2.4,
		align: 'right',
		beats: [
			{ from: 0.0, to: 0.36 },
			{ from: 0.34, to: 0.68 },
			{ from: 0.66, to: 1.0, hold: true }
		]
	},
	{
		id: 'credit',
		draw: drawCredit,
		scrollLength: 2.6,
		align: 'left',
		beats: [
			{ from: 0.0, to: 0.34 },
			{ from: 0.32, to: 0.66 },
			{ from: 0.64, to: 1.0, hold: true }
		]
	}
];
