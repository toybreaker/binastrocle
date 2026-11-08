// src/utils/main.ts
// Un solo punto di ingresso. Ogni elemento viene legato una volta sola anche se
// initNav() viene chiamata da più componenti: prima la stessa funzione finiva
// registrata tre volte su #toggle_works e il menu funzionava solo perché tre
// toggle si annullano a uno.

const bound = new WeakSet<HTMLElement>();

function bind(el: HTMLElement | null, handler: (event: MouseEvent) => void): void {
  if (!el || bound.has(el)) {
    return;
  }
  bound.add(el);
  el.addEventListener('click', handler);
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
}

function toggleProfile(): void {
  if (document.body.classList.contains('showing_menu')) {
    document.getElementById('menu')?.classList.toggle('hide');
    document.getElementById('main')?.classList.toggle('hide');
    document.body.classList.toggle('showing_menu');
  }
  document.getElementById('profile')?.classList.toggle('hide');
  document.body.classList.toggle('showing_profile');
}

export function initNav(): void {
  bind(document.getElementById('toggle_works'), toggleWorks);
  bind(document.getElementById('also_toggle_works'), toggleWorks);
  bind(document.getElementById('toggle_about_binocle'), toggleProfile);
}
