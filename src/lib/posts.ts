// Central data layer for the blog collection. Every page and the RSS feed should
// fetch posts through these helpers so filtering, sorting, and the list of
// non-post entries stay consistent in one place.
import { getCollection, type CollectionEntry } from 'astro:content';

// Re-exported so server-side code can pull tag helpers from the post API, while
// client scripts import them from the dependency-free `./tags` module directly.
export { tagToSlug } from './tags';

export type Post = CollectionEntry<'blog'>;

/**
 * The "About Me" entry lives in the blog collection (so it can reuse the post
 * layout and rendering) but is not a real post: it's excluded from listings and
 * the feed, and surfaced only via the dedicated /about page.
 */
export const ABOUT_POST_ID = 'about-me';

/**
 * Posts tagged "draft" are hidden from the blog index, the landing page, tag
 * clouds, and RSS — but stay reachable by visiting their tag page directly,
 * so a link can be shared for review before the tag is removed.
 */
const DRAFT_TAG = 'draft';

const isDraft = (post: Post): boolean =>
	post.data.tags.some((tag) => tag.toLowerCase() === DRAFT_TAG);

/** Sort comparator: newest published date first. */
export const byPubDateDesc = (a: Post, b: Post): number =>
	b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** All real posts (excluding the About entry), including drafts, newest first. */
async function getAllRealPosts(): Promise<Post[]> {
	const posts = await getCollection('blog');
	return posts.filter((post) => post.id !== ABOUT_POST_ID).sort(byPubDateDesc);
}

/** Real posts excluding drafts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getAllRealPosts();
	return posts.filter((post) => !isDraft(post));
}

/**
 * Unique original (un-slugified) tags across all real posts, including
 * drafts, so the "draft" tag page itself still gets generated.
 */
export async function getAllTags(): Promise<string[]> {
	const posts = await getAllRealPosts();
	return [...new Set(posts.flatMap((post) => post.data.tags))];
}

/**
 * Posts carrying the given original tag, newest first. Looking up the
 * "draft" tag itself is the one case allowed to surface draft posts.
 */
export async function getPostsByTag(originalTag: string): Promise<Post[]> {
	const posts =
		originalTag.toLowerCase() === DRAFT_TAG ? await getAllRealPosts() : await getPublishedPosts();
	return posts.filter((post) => post.data.tags.includes(originalTag));
}
