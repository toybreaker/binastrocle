// astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [sitemap()],
  output: "static",
  image: {
    responsiveStyles: true,
    layout: "constrained",
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
