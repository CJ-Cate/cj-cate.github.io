// Pure tag helpers with no server-only imports, so they are safe to import from
// client-side `<script>` blocks (e.g. the header search) as well as from pages.

/** Convert a human tag into a URL-safe slug used for /blog/tag/[tag] routes. */
export const tagToSlug = (tag: string): string =>
	tag
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
