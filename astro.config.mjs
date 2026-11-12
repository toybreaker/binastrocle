// astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// In build le varianti le fa la Netlify Image CDN: <Picture> emette URL
// /.netlify/images?url=…&w=… e il build non codifica niente.
// In dev quella rotta non esiste — la serve solo Netlify — quindi si usa il
// servizio di default di Astro (sharp), che genera le varianti on demand e le
// mette nella cache di node_modules/.astro: le immagini si vedono, e non
// serve `netlify dev` né un account Netlify per lavorare in locale.
// Il discriminante è `process.argv` (il comando astro in esecuzione). NON
// `defineConfig(fn => ...)`: in questa versione la funzione non viene chiamata e
// la config torna vuota (sintomo: `Invalid URL` su `new URL(src, Astro.site)`).
// NON `process.env.NODE_ENV`: al momento in cui la config viene caricata non è
// ancora "development", quindi in dev resterebbe attiva la CDN.
const inDev = process.argv.includes("dev");
const servizioCdn = inDev
  ? {}
  : { service: { entrypoint: "@astrojs/netlify/image-service.js" } };

export default defineConfig({
  integrations: [sitemap()],
  output: "static",
  image: {
    responsiveStyles: true,
    layout: "constrained",
    // Solo il servizio, non l'adapter: l'adapter aggiungerebbe una funzione SSR
    // e un edge middleware che a un sito statico non servono (12 s di build
    // contro 1,7 s).
    ...servizioCdn,
  },
  build: {
    format: "directory",
    inlineStylesheets: "always",
  },
  prefetch: {
    // defaultStrategy: "viewport",
    prefetchAll: true,
  },
  // La forma canonica è quella servita da Netlify: con `build.format:
  // 'directory'` il file sta in `<rotta>/index.html` e una richiesta senza
  // barra finale risponde 301. Tenere `never` significava dichiarare in
  // canonical e sitemap 33 URL che poi redirigono: due convenzioni in
  // contraddizione sulla stessa pagina. Con `always` link, canonical, sitemap
  // e URL servite coincidono, e `@astrojs/sitemap` aggiunge la barra da solo.
  trailingSlash: "always",
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
