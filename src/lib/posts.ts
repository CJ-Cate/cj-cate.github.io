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

/** Sort comparator: newest published date first. */
export const byPubDateDesc = (a: Post, b: Post): number =>
	b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** All real posts (excluding the About entry), newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('blog');
	return posts.filter((post) => post.id !== ABOUT_POST_ID).sort(byPubDateDesc);
}

/** Unique original (un-slugified) tags across all published posts. */
export async function getAllTags(): Promise<string[]> {
	const posts = await getPublishedPosts();
	return [...new Set(posts.flatMap((post) => post.data.tags))];
}

/** Published posts carrying the given original tag, newest first. */
export async function getPostsByTag(originalTag: string): Promise<Post[]> {
	const posts = await getPublishedPosts();
	return posts.filter((post) => post.data.tags.includes(originalTag));
}
