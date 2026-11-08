# AGENTS.md — binastrocle

Sito statico dello studio Binocle. Astro 7 → Netlify → <https://binocle.it>.
Questo file serve a chi apre il repo senza il contesto di chi c'era prima: leggilo prima di toccare.

## Toolchain

- **Node 26 LTS** (`26.13.0`, nome in codice *Lithium*). `.nvmrc` è in radice: `nvm use` prima di ogni comando.
  Il Node di sistema della macchina può essere più vecchio e Astro 7 **rifiuta di partire** sotto `22.23.4`.
- **pnpm** `10.17.0`, fissato in `packageManager`. Il lockfile è versionato: senza, due deploy dello stesso
  commit divergono.
- Locale: `nvm use && pnpm install`. Non serve altro.

## Comandi

```
pnpm run dev --host        # dev server su http://<ip-lan>:4321 (NON 127.0.0.1: lo studio lavora in rete)
pnpm run build             # build statico in dist/
pnpm run lint              # biome — deve restare 0 errori, 0 warning
pnpm exec astro check      # tipi .astro/.ts — deve restare 0 errori, 0 warning, 0 hint
pnpm run format            # biome format --write ./src
```

Gate prima di consegnare: `lint` + `astro check` + `build` verdi, e i riferimenti agli asset del `dist/`
tutti risolti. Numeri attesi: **33 pagine**, **33 URL** in `sitemap-0.xml`.

`--host` va passato **senza** `--` davanti: con `pnpm run dev -- --host` pnpm passa il `--` letteralmente,
Astro lo legge come fine delle opzioni e il server resta su `127.0.0.1`.

## Struttura

```
src/pages/index.astro            home (la "picture of the day")
src/pages/works/[hash].astro     pagina di un lavoro, generata da getStaticPaths
src/pages/works/index.astro      indice di tutti i lavori (non linkato dal menu)
src/layouts/Layout.astro         head, meta, og, sitemap
src/components/                  Header, Nav, Footer, Profile, Version
src/content/works/<hash>/        index.md + fotografie del lavoro
src/utils/imageUtils.ts          scoperta automatica delle immagini (import.meta.glob)
src/utils/main.ts                unico ingresso JS: initNav() — menu, profilo, tastiera
src/content.config.js            schema della collezione `works`
src/styles/main.css              CSS globale
```

## Contenuti: come si aggiunge un lavoro

1. Cartella `src/content/works/<hash>/`, dove `<hash>` è **anche** lo slug dell'URL (`/works/<hash>`).
2. `index.md` con frontmatter: `layout`, `hash`, `project` (nome mostrato nell'h1), `title` (titolo SEO
   "Binocle - …"), `description`, `program`, `year`. `program` è opzionale; i valori sono kebab-case
   (`exhibition-design`, `office`, `gallery`, `retail`, `art-installation`, …).
3. Fotografie nella stessa cartella: **niente spazi nei nomi**, schema `NOME-01.jpg`, `NOME-02.jpg`… perché
   l'ordine è alfabetico (`localeCompare` in `imageUtils.ts`) e uno spazio diventa `%20` fino all'URL finale.
4. La prima immagine è la copertina: `loading='eager'`, `fetchpriority='high'`. Le altre sono `lazy`.
5. Il markdown non referenzia le immagini: vengono scoperte dal glob. Non serve toccare il codice.

## Immagini: le tre cose che non si toccano

- `<Picture>` deve avere **`width`** esplicito: senza, Astro usa l'originale (fino a 4000 px) come `src` e lo
  copia in `dist/` — è il motivo per cui il sito è passato da 1,2 GB a 700 MB.
- `widths` 640→1920 e `sizes='(min-width: 801px) 90vw, 100vw'`: il contenitore va dal 100% al 90vw (max 1920).
- `formats={['avif','webp']}` con `fallbackFormat='webp'`: elimina il set JPG di fallback che era il 47% del
  peso di `dist/` ed era comunque inutilizzato (le `<source>` hanno sempre precedenza).

**La cache immagini sta in `node_modules/.astro` (1,5 GB).** Build con cache calda: **10 s** (5.561 asset
riusati). Build a freddo: **58 minuti** — misurato l'8/11/2026 su questa macchina: 3.490 s, 33 pagine, 0 asset
riusati, 10.177 riferimenti risolti. Non cancellarla per fare "pulizia".

Il tempo a freddo non lo detta il numero di file ma il codificatore: le varianti per fotografia sono 12
(6 larghezze × avif/webp) contro le 18 di prima, quando esisteva anche il set JPG di fallback, e il build è
comunque più lento. AVIF costa, JPG no.

**Non spostarla fuori da `node_modules`.** `cacheDir: './.astro-cache'` è stato provato: in locale funziona
(la cache è portabile, il build caldo resta a 10 s), ma **peggiora i deploy**. Netlify conserva le
*dipendenze* fra un build e l'altro — cioè `node_modules`, che oggi contiene `.astro` — e non una cartella
custom che nessuno gli ha dichiarato: ogni deploy diventerebbe un build a freddo da un'ora, contro il timeout
di build della piattaforma. Se un giorno serve spostarla, va aggiunto insieme un plugin che la dichiari.

## Deploy

- `main` è **produzione**: Netlify costruisce da lì. Si lavora su un ramo e si apre una PR.
- `netlify.toml` dichiara `NODE_VERSION = 26` (senza, il build remoto si ferma sugli engines di Astro),
  gli header di sicurezza e `Cache-Control: immutable` per `/_astro/*` (i nomi contengono l'hash).
  HSTS non è scritto lì: Netlify lo manda già.
- La CSP è volutamente minima (niente `script-src`): gli stili sono inline per scelta
  (`inlineStylesheets: 'always'`). Non "migliorarla" senza aver capito cosa rompe.

## Trappole già pagate

- `trailingSlash: 'never'`: gli URL corretti sono `/works/nome` **senza** barra finale. In dev la rotta con la
  barra dà 404.
- Astro 7 **scarta gli attributi con valore vuoto**: `alt=''` non arriva nel build e l'`<img>` esce senza `alt`.
  Per le immagini senza didascalia si scrive un alt breve e vero (nome opera + posizione), non vuoto.
- Dopo un `pnpm add`/upgrade il dev server avviato prima risponde 500 su tutto: va ucciso e riavviato
  (`pgrep -af 'astro.mjs dev'`, `rm -f .astro/dev.json`).
- `astro check` richiede `@emnapi/runtime@1.11.3` come devDependency: il peer di `@astrojs/astro2tsx` viene
  risolto a una 2.0.0-beta incompatibile e il check crasha con `bridge.setLastError is not a function`.

## Cosa non si tocca

- `dati/` (archivio dello studio) è in sola lettura; gli output vanno in `artifacts/`.
- La struttura del menu: un solo listener in `src/utils/main.ts` (`initNav()`), idempotente via `WeakSet`.
  I `role='button'` + `tabindex='0'` su logo, mini-logo e immagine della home servono alla tastiera.
