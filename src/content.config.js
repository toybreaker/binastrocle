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
    image1: z.string(),
    image2: z.string(),
    image3: z.string(),
    image4: z.string(),
    image5: z.string(),
    image6: z.string(),
    image7: z.string(),
    image8: z.string(),
    image9: z.string(),
    image10: z.string(),
  }),
});

export const collections = { works };