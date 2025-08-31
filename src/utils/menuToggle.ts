// src/utils/menuToggle.ts

/**
 * Toggle menu visibility and handle profile/menu state
 */
export function initializeMenuToggle(): void {
  const toggleButton = document.getElementById('toggle_works');
  const profileElement = document.getElementById('profile');
  const menuElement = document.getElementById('menu');

  if (!toggleButton) {
    console.warn('Toggle button with id "toggle_works" not found');
    return;
  }

  toggleButton.addEventListener('click', () => {
    // If profile is showing, hide it first
    if (document.body.classList.contains('showing_profile')) {
      profileElement?.classList.add('hide');
      document.body.classList.remove('showing_profile');
    }

    // Toggle menu visibility
    menuElement?.classList.toggle('hide');
    document.body.classList.toggle('showing_menu');
  });
}

/**
 * Initialize menu toggle when DOM is ready
 */
export function setupMenuToggle(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMenuToggle);
  } else {
    initializeMenuToggle();
  }
}