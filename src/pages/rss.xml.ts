import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { absolutizeUrls } from '../lib/feed';
import { getPosts } from '../lib/posts';
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/site';

/**
 * 全文入りの RSS。`entry.rendered.html` は画像が `__ASTRO_IMAGE_` のままなので使わず、
 * ページと同じ `render()` の Content を container API で文字列にする（画像は `/_astro/...` に解決される）。
 */
export async function GET(context: APIContext) {
  const site = context.site;
  if (!site) throw new Error('astro.config の site が未設定です');

  const container = await AstroContainer.create();
  const posts = await getPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return {
        title: post.data.title,
        link: post.url,
        pubDate: post.data.date,
        description: post.data.description,
        content: absolutizeUrls(html, site),
      };
    }),
  );

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site,
    items,
    customData: '<language>ja</language>',
  });
}
