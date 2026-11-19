import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    hash: z.string(),
    project: z.string(),
    title: z.string(),
    // Un testo solo, e si legge in pagina: la description e' il paragrafo
    // d'apertura dell'opera e la stessa stringa va in <meta name="description">,
    // og:description, twitter:description e JSON-LD. Va scritta come prosa
    // (frase compiuta, senza "..." in coda) perche' prima di tutto la leggono
    // le persone. Nessun limite di lunghezza: Google dichiara di non averne, e
    // taglia lo snippet alla larghezza del dispositivo. Oggi il campo va da 80
    // a 316 caratteri.
    description: z.string(),
    year: z.number(),
    // Data del lavoro, opzionale: serve solo a ordinare due opere dello stesso
    // anno (la più recente prima). Formato YYYY-MM o YYYY-MM-DD, fra apici.
    // Chi non ce l'ha resta dopo quelli datati, in ordine alfabetico: le opere
    // vecchie non vanno ristrutturate per riempire il campo.
    date: z.string().optional(),
    program: z.string().or(z.array(z.string())).optional()
    //images: z.array(z.number()).optional(), // Keep optional for now, will be auto-populated
  }),
});

export const collections = { works };
