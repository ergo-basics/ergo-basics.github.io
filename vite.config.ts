import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/*
 * ergo-basics.github.io is an ORGANISATION Pages site, so it is served
 * from the domain root (https://ergo-basics.github.io/) rather than
 * from a /<repo>/ subpath. Base stays '/' in every environment.
 */
export default defineConfig({
	plugins: [sveltekit()]
});
