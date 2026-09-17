import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const enlight = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/enlight' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
  }),
});

export const collections = { enlight };
