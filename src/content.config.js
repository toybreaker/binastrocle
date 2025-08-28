
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    layout: z.string(),
    hash: z.string(),
    project: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    images: z.array(z.number()).optional(),
  }),
});

export const collections = { works };
