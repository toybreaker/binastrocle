// astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [sitemap()],
  output: "static",
  image: {
    responsiveStyles: true,
    layout: "constrained",
    // Netlify Image CDN come servizio immagini di Astro: <Picture> non codifica
    // più le varianti al build, ma emette URL /.netlify/images?url=…&w=…; la
    // trasformazione avviene all'edge, una volta sola per variante.
    // Solo il servizio, non l'adapter: il sito resta statico e non guadagna
    // né una funzione SSR né un edge middleware che non servono a nulla.
    service: { entrypoint: "@astrojs/netlify/image-service.js" },
  },
  build: {
    format: "directory",
    inlineStylesheets: "always",
  },
  prefetch: {
    // defaultStrategy: "viewport",
    prefetchAll: true,
  },
  trailingSlash: "never",
  root: "./",
  site: "https://binocle.it",
  outDir: "./dist",
  devToolbar: {
    enabled: false,
  },
  vite: {
      resolve: {
        alias: {
          "@utils": "/src/utils",
        },
      },
      server: {
        fs: {
          deny: ["**/src/_lab/**", "**/_lab/**"],
        },
      },
    },
});
