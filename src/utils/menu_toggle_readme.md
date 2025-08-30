# Menu Toggle Utility

TypeScript utility for managing menu and profile visibility states in Astro projects.

## Features

- Toggle menu visibility with smooth state management
- Automatic profile hiding when menu is activated
- DOM-ready state handling
- TypeScript support with proper null safety
- Zero dependencies

## Installation

Place `menuToggle.ts` in your `src/utils/` directory.

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
  import { setupMenuToggle } from '@utils/menuToggle';
  setupMenuToggle();
</script>
```

### Advanced Usage

```astro
<script>
  import { initializeMenuToggle } from '@utils/menuToggle';
  
  // Manual initialization (if you need custom timing)
  document.addEventListener('DOMContentLoaded', () => {
    // Your custom setup code here
    initializeMenuToggle();
  });
</script>
```

## API Reference

### `setupMenuToggle()`

Automatically initializes the menu toggle when DOM is ready.

- **Returns:** `void`
- **Usage:** Call once per page
- **Best for:** Most use cases

### `initializeMenuToggle()`

Directly initializes the menu toggle (assumes DOM is ready).

- **Returns:** `void`
- **Usage:** When you need manual control over initialization timing
- **Best for:** Custom initialization sequences

## Behavior

1. **Menu Toggle:** Clicking `#toggle_works` toggles the `hide` class on `#menu`
2. **Profile Hide:** If profile is showing, it's automatically hidden when menu opens
3. **Body Classes:** 
   - `showing_menu` added/removed when menu toggles
   - `showing_profile` removed when menu opens

## State Flow

```
Initial State: Menu hidden, Profile hidden
     ↓ (click toggle)
Menu Visible: showing_menu class added to body
     ↓ (click toggle again)  
Menu Hidden: showing_menu class removed from body
```

If profile was visible:
```
Profile Visible → Menu Toggle → Profile Hidden + Menu Visible
```

## Troubleshooting

### Menu not toggling
- Verify `#toggle_works` button exists in DOM
- Check browser console for warnings
- Ensure script runs after DOM elements are created

### CSS not applying
- Confirm `.hide`, `.showing_menu`, `.showing_profile` styles are defined
- Check CSS specificity conflicts

### TypeScript errors
- Ensure `@utils/menuToggle` path resolves correctly in `astro.config.mjs`:
```javascript
vite: {
  resolve: {
    alias: {
      "@utils": "/src/utils",
    },
  },
}
```

## Dependencies

- None (uses native DOM APIs)
- Requires: Modern browser with `classList` support (IE10+)

## Browser Support

- Chrome/Edge: ✅ All versions
- Firefox: ✅ All versions  
- Safari: ✅ All versions
- IE: ✅ 10+ (classList support)