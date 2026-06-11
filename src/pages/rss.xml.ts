import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getPublishedPosts } from '../lib/posts';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context: APIContext) {
	const site = context.site;
	if (!site) throw new Error('Set `site` in astro.config.mjs to build the RSS feed.');

	const posts = await getPublishedPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
		})),
	});
}
