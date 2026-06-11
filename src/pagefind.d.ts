// Pagefind's default UI ships without TypeScript declarations. Declare the slice
// we use (the search.astro entry point) so `astro check` stays clean.
declare module '@pagefind/default-ui' {
	export class PagefindUI {
		constructor(options: {
			element: string | HTMLElement;
			showImages?: boolean;
			[option: string]: unknown;
		});
	}
}
