<script>
	import { onMount } from 'svelte';
	import { createViewportGate } from '$lib/motion.js';
	import gameOfLifeImgWebP from '$lib/assets/game-of-life.webp';
	import gameOfLifeImgPng from '$lib/assets/game-of-life.png';

	// A LIVE Conway's Game of Life that never settles into a dead or static
	// state. Three things keep it alive indefinitely:
	//   1. A Gosper glider gun that emits a glider every 30 generations.
	//   2. A toroidal (wrap-around) grid so gliders re-enter and collide,
	//      continuously spawning fresh activity instead of drifting off-screen.
	//   3. A stagnation guard: if the population collapses or the board stops
	//      changing (checksum stable for a while), we re-seed with a new gun
	//      plus a random splash.
	//
	// Honours prefers-reduced-motion by falling back to the original static
	// image. Cells are drawn with theme-aware colours and the sim is throttled
	// to ~12fps via requestAnimationFrame.

	let canvas;
	let wrap;
	let reduced = false;

	const CELL = 11; // px per cell
	const STEP_MS = 1000; // one generation per second — a slow, meditative pace

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;

		const ctx = canvas.getContext('2d');
		let cols = 0;
		let rows = 0;
		let grid = new Uint8Array(0);
		let next = new Uint8Array(0);

		let lastChecksum = -1;
		let stableFor = 0;
		let generation = 0;

		const idx = (x, y) => y * cols + x;

		// Standard Gosper glider gun (offsets from a top-left origin).
		const GUN = [
			[0, 4], [0, 5], [1, 4], [1, 5],
			[10, 4], [10, 5], [10, 6], [11, 3], [11, 7], [12, 2], [12, 8], [13, 2], [13, 8],
			[14, 5], [15, 3], [15, 7], [16, 4], [16, 5], [16, 6], [17, 5],
			[20, 2], [20, 3], [20, 4], [21, 2], [21, 3], [21, 4], [22, 1], [22, 5],
			[24, 0], [24, 1], [24, 5], [24, 6],
			[34, 2], [34, 3], [35, 2], [35, 3]
		];

		function stamp(ox, oy, cells) {
			for (const [dx, dy] of cells) {
				const x = ((ox + dx) % cols + cols) % cols;
				const y = ((oy + dy) % rows + rows) % rows;
				grid[idx(x, y)] = 1;
			}
		}

		function randomSplash(density = 0.16) {
			for (let i = 0; i < grid.length; i++) {
				if (Math.random() < density) grid[i] = 1;
			}
		}

		function seed() {
			grid.fill(0);
			randomSplash(0.12);
			// A couple of guns at offset positions guarantee perpetual motion.
			stamp(1, 1, GUN);
			if (cols > 60) stamp(Math.floor(cols / 2), Math.floor(rows / 2), GUN);
			stableFor = 0;
			lastChecksum = -1;
		}

		function resize() {
			const rect = wrap.getBoundingClientRect();
			const w = Math.max(120, Math.floor(rect.width));
			const h = Math.max(120, Math.floor(rect.height));
			canvas.width = w;
			canvas.height = h;
			cols = Math.max(12, Math.ceil(w / CELL));
			rows = Math.max(12, Math.ceil(h / CELL));
			grid = new Uint8Array(cols * rows);
			next = new Uint8Array(cols * rows);
			seed();
		}

		// Live cells use the theme's decorative --viz-node channel instead of a
		// pair of hardcoded hexes, so the sim re-themes with everything else.
		function cellColor() {
			return (
				getComputedStyle(document.documentElement).getPropertyValue('--viz-node').trim() ||
				'#6fe3c4'
			);
		}

		function step() {
			let checksum = 0;
			let population = 0;
			for (let y = 0; y < rows; y++) {
				const yUp = (y - 1 + rows) % rows;
				const yDown = (y + 1) % rows;
				for (let x = 0; x < cols; x++) {
					const xLeft = (x - 1 + cols) % cols;
					const xRight = (x + 1) % cols;
					const n =
						grid[idx(xLeft, yUp)] + grid[idx(x, yUp)] + grid[idx(xRight, yUp)] +
						grid[idx(xLeft, y)] + grid[idx(xRight, y)] +
						grid[idx(xLeft, yDown)] + grid[idx(x, yDown)] + grid[idx(xRight, yDown)];
					const alive = grid[idx(x, y)];
					const live = alive ? n === 2 || n === 3 : n === 3;
					next[idx(x, y)] = live ? 1 : 0;
					if (live) {
						population++;
						checksum = (checksum + (x * 73856093) ^ (y * 19349663)) | 0;
					}
				}
			}
			const tmp = grid;
			grid = next;
			next = tmp;
			generation++;

			// Stagnation / collapse guard.
			if (checksum === lastChecksum) stableFor++;
			else stableFor = 0;
			lastChecksum = checksum;

			if (population < cols * rows * 0.01 || stableFor > 18) {
				// Nudge it back to life without a full reset most of the time.
				stamp(1, 1, GUN);
				randomSplash(0.06);
				stableFor = 0;
			}
		}

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = cellColor();
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					if (grid[idx(x, y)]) {
						ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
					}
				}
			}
		}

		let raf = 0;
		let acc = 0;
		let prev = 0;
		function loop(ts) {
			if (!prev) prev = ts;
			acc += ts - prev;
			prev = ts;
			if (acc >= STEP_MS) {
				acc = 0;
				step();
				draw();
			}
			raf = requestAnimationFrame(loop);
		}

		/*
		 * One generation per second, but the RAF loop still woke the main
		 * thread sixty times a second to find out it had nothing to do — and
		 * it did that whether or not the board was anywhere near the screen.
		 * Park it when off-screen or backgrounded.
		 *
		 * `prev` is cleared on pause so the accumulator does not bank the
		 * entire time the sim was parked and then burst through a pile of
		 * generations the moment it comes back.
		 */
		function startLoop() {
			if (raf) return;
			prev = 0;
			raf = requestAnimationFrame(loop);
		}
		function stopLoop() {
			if (!raf) return;
			cancelAnimationFrame(raf);
			raf = 0;
		}

		const ro = new ResizeObserver(() => resize());
		ro.observe(wrap);
		resize();
		draw();

		const stopGate = createViewportGate(wrap, {
			// The board is a small, in-flow illustration rather than a
			// full-bleed backdrop, and `resize()` re-seeds the simulation, so
			// this one keeps its (cheap) backing store and only gates the loop.
			onNear: () => {},
			onLive: (live) => (live ? startLoop() : stopLoop())
		});

		return () => {
			cancelAnimationFrame(raf);
			raf = 0;
			stopGate();
			ro.disconnect();
		};
	});
</script>

<div class="gol" bind:this={wrap}>
	{#if reduced}
		<picture>
			<source srcset={gameOfLifeImgWebP} type="image/webp" />
			<source srcset={gameOfLifeImgPng} type="image/png" />
			<img src={gameOfLifeImgPng} alt="Conway's Game of Life" width="400" height="350" />
		</picture>
	{:else}
		<canvas bind:this={canvas} role="img" aria-label="Live animation of Conway's Game of Life"></canvas>
	{/if}
</div>

<style>
	.gol {
		width: 100%;
		aspect-ratio: 8 / 7;
		border: 1px solid var(--border);
		border-radius: 16px;
		overflow: hidden;
		background: var(--surface-deep);
	}

	canvas,
	.gol img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
