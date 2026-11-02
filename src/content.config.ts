import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const DAY_MS = 86_400_000;

const blog = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce
      .date()
      .refine(
        (d) => d.getTime() % DAY_MS === 0,
        'date は YYYY-MM-DD だけ。時刻は書かない',
      ),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
