[![Netlify Status](https://api.netlify.com/api/v1/badges/d8e68f78-ce95-415b-b642-674bfc7dff3a/deploy-status)](https://app.netlify.com/projects/binocleastro/deploys)


# [🫵🏼 DONT CLICK ME! ](https://binocleastro.netlify.app)

## 💥 Astro 5+ with "A Piece Of Mind" - Quick Reference

### Project Structure
```
my-astro-site/
├── src/
│   ├── pages/           # Routes - each .astro = a page
│   │   ├── index.astro   # Homepage (/)
│   │   └── about.astro   # About page (/about)
│   ├── layouts/          # Reusable page layouts
│   │   └── Layout.astro
│   ├── components/       # Reusable components
│   │   └── Card.astro
│   ├── styles/          # CSS files (processed by Vite)
│   │   └── global.css
│   └── scripts/         # JS files (processed & optimized by Vite!)
│       └── main.js
├── public/              # Static assets (served as-is, NO processing)
│   ├── favicon.ico
│   └── legacy-libs/     # Old libraries that shouldn't be processed
│       └── jquery.min.js
├── .zed/                # Zed editor settings
│   └── settings.json
├── astro.config.mjs     # Config file (NOT .ts!)
├── package.json
├── pnpm-lock.yaml      # PNPM lock file
└── biome.json          # Biome config (formats JS/CSS)
```

## Core Files

### `astro.config.mjs`
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Keep it simple - no config needed for basic sites
});
```

### `biome.json` (formats JS/CSS, skips .astro)
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": {
    "include": ["src/**/*.js", "src/**/*.css", "*.mjs"],
    "ignore": ["dist", "node_modules", ".astro"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  },
  "overrides": [
    {
      "include": ["*.astro"],
      "formatter": {
        "enabled": false
      },
      "linter": {
        "enabled": false
      }
    }
  ]
}
```

### `.zed/settings.json` (Zed editor config)
```json
{
  "format_on_save": "on",
  "formatter": {
    "language_server": {
      "name": "biome"
    }
  },
  "lsp": {
    "biome": {
      "settings": {
        "require_config_file": true
      }
    }
  }
}
```

### `src/layouts/Layout.astro`
```astro
---
// JavaScript here - NOT TypeScript!
const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <link rel="stylesheet" href="/src/styles/global.css">
</head>
<body>
  <slot /> <!-- Page content goes here -->
  <!-- <script src="/scripts/main.js"></script> -->
</body>
</html>
```

### `src/pages/index.astro`
```astro
---
// JavaScript in the frontmatter
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';

const pageTitle = "Home";
const items = ['First', 'Second', 'Third'];
---

<Layout title={pageTitle}>
  <h1>Welcome</h1>

  <!-- Use JavaScript expressions -->
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>

  <!-- Use components -->
  <Card title="Hello" />

  <!-- Inline scripts if needed -->
  <script>
    console.log('This runs on the client');
  </script>
</Layout>
```

### `src/components/Card.astro`
```astro
---
// Component JavaScript
const { title, href = "#" } = Astro.props;
---

<div class="card">
  <h3>{title}</h3>
  <a href={href}>Learn more →</a>
</div>

<style>
  /* Scoped CSS - only affects THIS component */
  .card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
  }
</style>
```

### `src/styles/global.css`
```css
/* Regular CSS file */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}
```

### `src/scripts/main.js`
```javascript
// JavaScript in src/ gets processed & optimized by Vite!
// You can use ES modules, imports, etc.
import { utils } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Site loaded!');
  utils.init();
});
```

## Key Concepts

### 1. **Astro Components = HTML + JS + CSS**
```astro
---
// JavaScript goes here (runs at build time)
const data = "Hello";
---

<!-- HTML template -->
<div>{data}</div>

<style>
  /* Scoped CSS */
</style>

<script>
  // Client-side JavaScript
</script>
```

### 2. **Import Your Existing JS/CSS**
```astro
---
// Import from src/ for processing
import '../scripts/main.js';
import '../styles/global.css';
---

<!-- For scripts in src/ (processed by Vite) -->
<script src="../scripts/main.js"></script>

<!-- For scripts in public/ (NO processing, needs is:inline) -->
<script is:inline src="/unprocessed-legacy.js"></script>
```

### 3. **Static Assets in `public/` (NO processing)**
```
public/
├── images/logo.png     → /images/logo.png
├── fonts/custom.woff2  → /fonts/custom.woff2
└── libs/jquery.min.js  → /libs/jquery.min.js (already minified)
```

**⚠️ Important:**
- `src/` = Vite processes & optimizes your JS/CSS
- `public/` = Served as-is, no processing at all

### 4. **Dynamic Routes**
```astro
---
// src/pages/blog/[slug].astro
export function getStaticPaths() {
  return [
    { params: { slug: 'post-1' } },
    { params: { slug: 'post-2' } },
  ];
}

const { slug } = Astro.params;
---

<h1>Post: {slug}</h1>
```

## Migration from Jekyll/Static Site

### Quick Start
```bash
# Create new Astro project
pnpm create astro@latest my-site -- --template minimal --no-install --no-git

# Go to project
cd my-site

# Install dependencies
pnpm install

# Install Biome (faster, no Prettier needed)
pnpm add -D @biomejs/biome
pnpm biome init

# Start dev server
pnpm dev
```

### Migration Steps
1. Copy your static files to `public/`
2. Convert HTML files to `.astro` files in `src/pages/`
3. Extract common HTML to `src/layouts/Layout.astro`
4. Keep using your existing JS/CSS - just import them!

### Package Scripts (`package.json`)
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "format": "biome format --write ./src",
    "lint": "biome lint ./src"
  }
}
```

### Before (Jekyll/Static)
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>My Site</h1>
  <script src="script.js"></script>
</body>
</html>
```

### After (Astro)
```astro
---
// src/pages/index.astro
---

<html>
<head>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>My Site</h1>
  <script src="/script.js"></script>
</body>
</html>
```

That's it! Your existing JS and CSS work as-is. No TypeScript needed!
