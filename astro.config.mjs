// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { externalLinks, figure, tableWrap } from './src/lib/markdown.ts';

const site = 'https://harvath.tokyo';

export default defineConfig({
  site,
  integrations: [sitemap()],
  markdown: {
    processor: satteri({
      hastPlugins: [figure, externalLinks(site), tableWrap],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
    },
  },
});
