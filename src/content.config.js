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
    program: z.enum(["temporary-structure", "art-space", "patio", "gift", "furniture", "atelier","office","art-installation", "bar", "restaurant", "bookstore", "radio-station", "gallery", "exibition-design"]).optional()
    //images: z.array(z.number()).optional(), // Keep optional for now, will be auto-populated
  }),
});

export const collections = { works };
