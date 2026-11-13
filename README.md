# binocle.it

Static site for **Studio Binocle**, Milan — an architecture office working on the adaptive reuse of existing space. Astro 7, built and served by Netlify.

Live: <https://binocle.it>

## Copyright

This repository is public; its contents are not free to use. Photographs © Binocle, all rights reserved. Ask before reusing anything: <now@binocle.it>. Nothing here is licensed by the fact that you can read it.

## Requirements

- **Node 26** — `.nvmrc`; Astro 7 refuses older versions
- **pnpm 10** — pinned in `packageManager`

## Commands

```bash
pnpm install
pnpm run dev --host      # LAN, http://<ip>:4321 — no `--` before --host
pnpm run build           # static output in dist/
pnpm run lint            # biome
pnpm exec astro check    # types in .astro/.ts
```

Ship only when lint, check and build all pass.

## Content

One folder per work in `src/content/works/<slug>/`: `index.md` plus the photographs. The folder name **is** the URL, `/works/<slug>/`. Frontmatter carries `project`, `title`, `description`, `program`, `year`; the first photograph is the cover. Photographs are discovered by glob — the markdown does not reference them.

## Structure

```
src/pages/        index, works/[hash], works/, 404
src/layouts/      Layout.astro
src/components/   Header, Nav, Footer, Profile, Version
src/content/      works/<slug>/index.md + photographs
src/utils/        imageUtils.ts, main.ts
src/styles/       main.css
public/           _redirects, favicons, pdf, robots.txt
```

## Deploy

`main` is production: Netlify builds it on push. Work on a branch and open a pull request — every PR gets a deploy preview to look at. Images are not transformed at build time; the Netlify Image CDN does it on first request.

## More

`AGENTS.md` — toolchain, image pipeline and the traps already paid for.
