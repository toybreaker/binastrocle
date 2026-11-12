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
pnpm run build             # astro check + build statico in dist/ (il gate gira, non solo il build)
pnpm run lint              # biome — deve restare 0 errori, 0 warning
pnpm exec astro check      # tipi .astro/.ts — deve restare 0 errori, 0 warning, 0 hint
pnpm run format            # biome format --write ./src
```

Gate prima di consegnare: `lint` + `astro check` + `build` verdi, e i riferimenti agli asset del `dist/`
tutti risolti. Numeri attesi: **33 pagine**, **33 URL** in `sitemap-0.xml` (tutte con la barra finale).

I redirect dei vecchi slug Jekyll stanno in `public/_redirects`, che Netlify legge a ogni deploy: sono 14
percorsi in due forme (con e senza barra) perché Netlify normalizza la barra solo dopo aver cercato una regola.

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

## Immagini: si trasformano all'edge, non al build

Le varianti le genera la **Netlify Image CDN**, non il build. `<Picture>` emette URL:

```
/.netlify/images?url=_astro%2FNOME-01-1920.jpg&fm=avif&w=1668&h=1112&fit=cover 1668w
```

Il file che sta in `dist/_astro` è **l'originale**, uno per foto: 446 file, `dist` 343 MB (prima 1,2 GB,
con 6.467 file). La trasformazione avviene alla prima richiesta di quella variante e poi resta in cache
all'edge. Configurazione, in `astro.config.mjs`:

```js
image: { service: { entrypoint: "@astrojs/netlify/image-service.js" } }
```

**Solo il servizio, non l'adapter.** Con `adapter: netlify()` il build genererebbe anche una funzione SSR
e un edge middleware (`.netlify/v1/functions`, `.netlify/v1/edge-functions`) che a un sito statico non
servono: provato, e scartato. Con il solo servizio il build non crea `.netlify/` e chiude in **1,70 s**
(era 12,36 s col set di varianti codificate).

**Non reintrodurre la codifica al build.** Prima della CDN le varianti si producevano nel build (derivata
a 1920, `avif`+`webp`, niente JPG): 5.561 varianti, **58 minuti a freddo** contro i **15 minuti** che
Netlify concede. La PR #14 è morta esattamente così, e la stessa ricodifica sarebbe toccata al primo
deploy di produzione, perché cambiare formati e larghezze invalida ogni variante in cache. Se servono
immagini diverse si cambiano i parametri di `<Picture>`: ora sono gratis.

**In locale le immagini si vedono**: la config sceglie il servizio in base al comando in esecuzione —
`astro dev` usa il servizio di default di Astro (sharp, varianti on demand in `node_modules/.astro`,
URL `/_image?href=…`), `astro build` usa la CDN (URL `/.netlify/images`). Non serve `netlify dev` né un
account Netlify.

Il discriminante è `process.argv[2]` / `includes("dev")`. Due trappole, già pagate:

- `defineConfig(({ command }) => ({…}))` **non funziona in questo progetto**: la funzione non viene
  chiamata, la config resta vuota e il build muore con `Invalid URL` su `new URL(src, Astro.site)`.
  Forma a oggetto, sempre.
- `process.env.NODE_ENV` non è ancora `development` quando la config viene caricata: funzionerebbe in
  build ma non in dev, e in dev resterebbe attiva la CDN.

**`astro preview` invece resta senza immagini**: serve il `dist/` già costruito, dove gli URL puntano
alla CDN che in locale non esiste. Per vedere le immagini o si usa `astro dev`, o il deploy preview.


**Larghezze in uso**: opere 640→1920 con `sizes='(min-width: 801px) 90vw, 100vw'`; profilo 320→960.
Anche `og:image` passa dalla CDN, con URL assoluto su `site` (`https://binocle.it/...`) — quindi su un
deploy preview dà 404, ed è corretto: punta alla produzione.

**La cache immagini in `node_modules/.astro` (1,5 GB) adesso è inerte**: con la CDN non si codifica più
niente. Si può lasciare dov'è; serve solo se si tornasse indietro.

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

- `trailingSlash: 'always'`: gli URL corretti sono `/works/nome/` **con** la barra finale, perché è la forma
  che Netlify serve (`build.format: 'directory'`); senza barra risponde 301. Canonical, sitemap e link interni
  devono avere tutti la barra — `@astrojs/sitemap` la aggiunge da solo, `Nav.astro` e `works/index.astro`
  la scrivono a mano negli `href`. Fino al 12/11/2026 era `'never'` e le 33 URL della sitemap dichiaravano una
  forma che il server reindirizzava: se ricompare un 301 su un URL del sito, il primo posto da guardare è qui.
  In dev la rotta **senza** barra ora è quella che non risponde.
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
