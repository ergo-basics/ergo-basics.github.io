<script>
	import { theme, applyTheme, toggleTheme } from '$lib/theme.js';
	import { t } from '$lib/i18n/index.js';

	// Keep <html data-theme> in sync whenever the store changes, and spin
	// the icon 180° per toggle so the sun/moon swap reads as a rotation.
	let rotation = 0;
	$: applyTheme($theme);

	function onClick() {
		toggleTheme();
		rotation += 180;
	}
</script>

<button
	class="theme-toggle"
	on:click={onClick}
	aria-label={$theme === 'dark' ? $t('theme.toLight') : $t('theme.toDark')}
	title={$t('theme.toggle')}
>
	<span class="icon" style={`transform: rotate(${rotation}deg);`}>
		{#if $theme === 'dark'}
			<!-- Moon -->
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		{:else}
			<!-- Sun -->
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
			</svg>
		{/if}
	</span>
</button>

<style>
	.theme-toggle {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--accent-text);
		background: rgba(var(--surface-rgb), 0.82);
		border: 1px solid var(--border-strong);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow: var(--shadow-sm);
		transition: background 0.25s ease, transform 0.2s ease, border-color 0.25s ease,
			color 0.25s ease;
	}

	.theme-toggle:hover {
		transform: scale(1.08);
		background: var(--surface);
		border-color: var(--accent);
	}

	.theme-toggle:focus-visible {
		outline: 2px solid var(--accent-text);
		outline-offset: 3px;
	}

	.icon {
		display: inline-flex;
		transition: transform 700ms ease;
	}

	.icon svg {
		width: 22px;
		height: 22px;
	}
</style>
