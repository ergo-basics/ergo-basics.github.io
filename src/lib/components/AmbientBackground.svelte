<script>
	/*
	 * Ambient day/night background — a fixed, non-interactive layer that
	 * sits behind all content (pointer-events:none, z-index:-1).
	 *
	 * Reacts purely to <html data-theme>:
	 *   • DARK (default) → a faint, gently twinkling STAR field up top.
	 *   • LIGHT          → a soft, slowly pulsing warm SUN toward top-right.
	 *
	 * Ported from the celaut-project site's AmbientBackground. Very low
	 * opacity / very slow motion so it never competes with content.
	 * Honours prefers-reduced-motion (motion off, static gradients kept).
	 */
</script>

<div class="ambient" aria-hidden="true">
	<div class="ambient-gradient"></div>
	<div class="ambient-sun"></div>
	<div class="ambient-stars"></div>
</div>

<style>
	.ambient {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		overflow: hidden;
	}

	.ambient-gradient,
	.ambient-sun,
	.ambient-stars {
		position: absolute;
		inset: 0;
	}

	/* Base wash — cool star-light glow from the top (dark default). Toned down
	   from 0.20 to 0.14: the dark surface is deeper now, so the old wash read as
	   a blue haze sitting on top of the content instead of behind it. */
	.ambient-gradient {
		background: radial-gradient(130% 90% at 50% -25%, hsl(175 55% 55% / 0.14), transparent 62%);
		animation: ambient-drift 60s ease-in-out infinite alternate;
	}

	/* Sun — LIGHT mode only. Hidden by default (dark). */
	.ambient-sun {
		display: none;
		opacity: 1;
		background:
			radial-gradient(18% 15% at 82% 2%, hsl(38 96% 60% / 0.55), transparent 70%),
			radial-gradient(
				58% 48% at 82% 2%,
				hsl(33 95% 62% / 0.42),
				hsl(20 88% 66% / 0.16) 48%,
				transparent 76%
			);
		animation: ambient-pulse 26s ease-in-out infinite alternate;
	}

	/* Stars — DARK mode (default). Confined to the top ~40%. */
	.ambient-stars {
		display: block;
		opacity: 0.95;
		background-repeat: no-repeat;
		background-image:
			radial-gradient(2px 2px at 8% 11%, hsl(0 0% 100% / 0.95), transparent),
			radial-gradient(1.5px 1.5px at 17% 25%, hsl(0 0% 100% / 0.75), transparent),
			radial-gradient(2px 2px at 23% 7%, hsl(0 0% 100% / 0.9), transparent),
			radial-gradient(1.5px 1.5px at 31% 18%, hsl(0 0% 100% / 0.65), transparent),
			radial-gradient(2.5px 2.5px at 39% 5%, hsl(0 0% 100% / 1), transparent),
			radial-gradient(1.5px 1.5px at 46% 28%, hsl(0 0% 100% / 0.7), transparent),
			radial-gradient(2px 2px at 54% 13%, hsl(0 0% 100% / 0.9), transparent),
			radial-gradient(1.5px 1.5px at 61% 22%, hsl(0 0% 100% / 0.65), transparent),
			radial-gradient(2.5px 2.5px at 68% 9%, hsl(0 0% 100% / 0.95), transparent),
			radial-gradient(1.5px 1.5px at 74% 30%, hsl(0 0% 100% / 0.7), transparent),
			radial-gradient(2px 2px at 82% 15%, hsl(0 0% 100% / 0.9), transparent),
			radial-gradient(1.5px 1.5px at 89% 6%, hsl(0 0% 100% / 0.8), transparent),
			radial-gradient(1.5px 1.5px at 94% 24%, hsl(0 0% 100% / 0.65), transparent),
			radial-gradient(1.5px 1.5px at 4% 33%, hsl(0 0% 100% / 0.6), transparent);
		animation: ambient-twinkle 7s ease-in-out infinite alternate;
	}

	.ambient-stars::after {
		content: '';
		position: absolute;
		inset: 0;
		background-repeat: no-repeat;
		background-image:
			radial-gradient(2px 2px at 13% 17%, hsl(210 70% 92% / 0.85), transparent),
			radial-gradient(2.5px 2.5px at 35% 12%, hsl(0 0% 100% / 0.9), transparent),
			radial-gradient(2px 2px at 58% 6%, hsl(210 70% 92% / 0.7), transparent),
			radial-gradient(2px 2px at 77% 21%, hsl(0 0% 100% / 0.75), transparent),
			radial-gradient(2px 2px at 90% 33%, hsl(210 70% 92% / 0.65), transparent);
		animation: ambient-twinkle-2 9s ease-in-out infinite alternate;
	}

	/* LIGHT mode: reveal the sun, hide the stars, warm the base wash. */
	:global(html[data-theme='light']) .ambient-sun {
		display: block;
	}
	:global(html[data-theme='light']) .ambient-stars {
		display: none;
	}
	:global(html[data-theme='light']) .ambient-gradient {
		background: radial-gradient(130% 90% at 50% -25%, hsl(33 95% 62% / 0.2), transparent 62%);
	}

	@keyframes ambient-drift {
		from {
			transform: translate3d(-1.5%, -1%, 0) scale(1.02);
		}
		to {
			transform: translate3d(1.5%, 1%, 0) scale(1.05);
		}
	}
	@keyframes ambient-pulse {
		from {
			opacity: 0.75;
			transform: scale(1);
		}
		to {
			opacity: 1;
			transform: scale(1.05);
		}
	}
	@keyframes ambient-twinkle {
		from {
			opacity: 0.75;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes ambient-twinkle-2 {
		from {
			opacity: 0.55;
		}
		to {
			opacity: 0.9;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ambient-gradient,
		.ambient-sun,
		.ambient-stars,
		.ambient-stars::after {
			animation: none;
		}
	}
</style>
