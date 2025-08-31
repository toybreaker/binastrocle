# Nav Toggle Utility

TypeScript utility for managing nav and profile visibility states in Astro projects.

## Features

- Toggle nav visibility with smooth state management
- Automatic profile hiding when nav is activated
- DOM-ready state handling
- TypeScript support with proper null safety
- Zero dependencies

## Installation

Place `main.ts` in your `src/utils/` directory.

## Required HTML Structure

```html
<button id="toggle_works">Toggle Menu</button>
<div id="profile" class="hide">Profile Content</div>
<div id="menu" class="hide">Menu Content</div>
```

## Required CSS Classes

```css
.hide {
  display: none;
}

.showing_profile {
  /* Styles when profile is visible */
}

.showing_menu {
  /* Styles when menu is visible */
}
```

## Usage

### Basic Implementation

```astro
---
// src/pages/your-page.astro
import Layout from '@layouts/Layout.astro';
---

<Layout title="Your Page">
  <button id="toggle_works">☰ Menu</button>
  
  <div id="profile" class="hide">
    <h3>User Profile</h3>
    <p>Profile content here</p>
  </div>
  
  <div id="menu" class="hide">
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </div>
</Layout>

<script>
  import { initializeNavToggle } from '@utils/main';
  initializeNavToggle();
</script>
```

### Import Examples

**Import individual functions:**
```astro
---
// Import just the toggle utility
import { toggleClass } from '@utils/main';

// Use in component logic
const element = document.getElementById('myElement');
toggleClass(element, 'active');
---
```

**Import the nav initializer:**
```astro
---
// Import the nav setup function
import { initializeNavToggle } from '@utils/main';

// Initialize manually when needed
initializeNavToggle();
---
```

**Import both functions:**
```astro
---
import { toggleClass, initializeNavToggle } from '@utils/main';

// Use both as needed
toggleClass(someElement, 'hide');
initializeNavToggle();
---
```

### Alternative Path Syntax

If you don't have path aliases set up:

```astro
---
// Relative import from pages directory
import { initializeNavToggle } from '../utils/main';
---

<script>
  // Or in client-side scripts
  import { initializeNavToggle } from '../utils/main';
  initializeNavToggle();
</script>
```

## API Reference

### `toggleClass(element, className)`

Toggles a CSS class on an HTML element.

- **Parameters:**
  - `element: HTMLElement | null` - Target element
  - `className: string` - CSS class name to toggle
- **Returns:** `void`
- **Example:**
  ```typescript
  toggleClass(document.getElementById('menu'), 'hide');
  ```

### `initializeNavToggle()`

Sets up the nav toggle functionality on page load.

- **Parameters:** None
- **Returns:** `void`
- **Usage:** Call once per page
- **Example:**
  ```typescript
  initializeNavToggle();
  ```

## Behavior

1. **Nav Toggle:** Clicking `#toggle_works` toggles the `hide` class on `#menu`
2. **Profile Hide:** If profile is showing, it's automatically hidden when nav opens
3. **Body Classes:** 
   - `showing_menu` added/removed when nav toggles
   - `showing_profile` removed when nav opens

## Path Alias Setup

Add to your `astro.config.mjs`:

```javascript
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@utils": "/src/utils",
      },
    },
  },
});
```

## Troubleshooting

### Nav not toggling
- Verify `#toggle_works` button exists in DOM
- Check browser console for warnings
- Ensure script runs after DOM elements are created

### Import errors
- Confirm path to `src/utils/main.ts` is correct
- Verify path alias configuration in `astro.config.mjs`
- Check file extension (`.ts` not `.js`)

### TypeScript errors
- Ensure proper typing for imported functions
- Verify `tsconfig.json` includes `src/utils/` directory

## Dependencies

- None (uses native DOM APIs)
- Requires: Modern browser with `classList` support (IE10+)

## Browser Support

- Chrome/Edge: ✅ All versions
- Firefox: ✅ All versions  
- Safari: ✅ All versions
- IE: ✅ 10+ (classList support)