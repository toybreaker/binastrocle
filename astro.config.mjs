// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  devOptions: {
    sourceMap: true, // <-- ENABLE this to show data-astro-source-file infos !
  },
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
  collections: {
    myDataCollection: {
      directory: "src/content",
      routeByDefault: true,
    },
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
