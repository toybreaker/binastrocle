// src/utils/main.ts
// Un solo punto di ingresso. Ogni elemento viene legato una volta sola anche se
// initNav() viene chiamata da più componenti: prima la stessa funzione finiva
// registrata tre volte su #toggle_works e il menu funzionava solo perché tre
// toggle si annullano a uno.

const bound = new WeakSet<HTMLElement>();

/**
 * Lega un controllo a un click e ai tasti che un bottone deve accettare.
 * I tre elementi nel markup sono div/span con role="button" e tabindex="0":
 * senza questo, da tastiera non si apre niente.
 */
function bind(el: HTMLElement | null, handler: () => void): void {
  if (!el || bound.has(el)) {
    return;
  }
  bound.add(el);
  el.addEventListener('click', handler);
  el.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // lo Spazio fa scorrere la pagina: qui deve solo attivare il controllo
      event.preventDefault();
      handler();
    }
  });
}

/** Lo stato dei pannelli vive sulle classi del body: qui lo si rispecchia in aria. */
function syncExpanded(): void {
  const menuOpen = document.body.classList.contains('showing_menu');
  const profileOpen = document.body.classList.contains('showing_profile');

  document.getElementById('toggle_works')?.setAttribute('aria-expanded', String(menuOpen));
  document.getElementById('also_toggle_works')?.setAttribute('aria-expanded', String(menuOpen));
  document
    .getElementById('toggle_about_binocle')
    ?.setAttribute('aria-expanded', String(profileOpen));
}

/* Toggle dei pannelli: main/menu/profile si alternano, il body porta lo stato */
function toggleWorks(): void {
  if (document.body.classList.contains('showing_profile')) {
    document.getElementById('profile')?.classList.toggle('hide');
    document.body.classList.toggle('showing_profile');
  }
  document.getElementById('main')?.classList.toggle('hide');
  document.getElementById('menu')?.classList.toggle('hide');
  document.body.classList.toggle('showing_menu');
  syncExpanded();
}

function toggleProfile(): void {
  if (document.body.classList.contains('showing_menu')) {
    document.getElementById('menu')?.classList.toggle('hide');
    document.getElementById('main')?.classList.toggle('hide');
    document.body.classList.toggle('showing_menu');
  }
  document.getElementById('profile')?.classList.toggle('hide');
  document.body.classList.toggle('showing_profile');
  syncExpanded();
}

export function initNav(): void {
  bind(document.getElementById('toggle_works'), toggleWorks);
  bind(document.getElementById('also_toggle_works'), toggleWorks);
  bind(document.getElementById('toggle_about_binocle'), toggleProfile);
  syncExpanded();
}
