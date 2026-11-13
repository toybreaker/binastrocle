// src/utils/main.ts
// Un solo punto di ingresso. Ogni elemento viene legato una volta sola anche se
// initNav() viene chiamata da più componenti: prima la stessa funzione finiva
// registrata tre volte su #toggle_works e il menu funzionava solo perché tre
// toggle si annullano a uno.
//
// I pannelli (menu, profilo) sono uno stato sola: si apre uno, si chiude
// l'altro. Prima erano due funzioni che si toglievano le classi a vicenda, e
// questo rendeva impossibile agganciare il tasto indietro senza effetti
// doppi.

const bound = new WeakSet<HTMLElement>();

type Panel = 'menu' | 'profile';

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

/**
 * Porta il pannello in cima e ci sposta il focus.
 *
 * Serve perché aprendo un pannello `#main` sparisce con `display: none`: il
 * documento si accorcia di colpo, il browser clampa lo scroll e il pannello che
 * stava più in basso finisce *sopra* il bordo superiore. Misurato il 12/11 su un
 * telefono: aperto il profilo dal mini-logo in fondo a un'opera lunga 6 027 px,
 * il pannello si apriva a top −940 px — cioè fuori dallo schermo.
 */
function showPanelTop(panel: Panel): void {
  window.scrollTo({ top: 0, behavior: 'instant' });

  const root = document.getElementById(panel === 'menu' ? 'menu' : 'profile');
  if (!root) {
    return;
  }
  // menu: il primo link, che è anche la prima cosa che si può usare.
  // profilo: il titolo, così lo screen reader annuncia dove siamo.
  const target =
    panel === 'menu'
      ? root.querySelector<HTMLElement>('a')
      : root.querySelector<HTMLElement>('.work_name');
  if (!target) {
    return;
  }
  if (panel === 'profile') {
    target.setAttribute('tabindex', '-1');
  }
  target.focus({ preventScroll: true });
}

/** Apre un pannello, o li chiude tutti con `null`. Idempotente. */
function setPanel(panel: Panel | null): void {
  const menuOpen = panel === 'menu';
  const profileOpen = panel === 'profile';

  document.getElementById('main')?.classList.toggle('hide', menuOpen || profileOpen);
  document.getElementById('menu')?.classList.toggle('hide', !menuOpen);
  document.getElementById('profile')?.classList.toggle('hide', !profileOpen);
  document.body.classList.toggle('showing_menu', menuOpen);
  document.body.classList.toggle('showing_profile', profileOpen);
  syncExpanded();

  if (panel) {
    showPanelTop(panel);
  }
}

function openPanel(panel: Panel): void {
  const alreadyOpen =
    document.body.classList.contains('showing_menu') ||
    document.body.classList.contains('showing_profile');

  setPanel(panel);

  // Una voce di cronologia per pannello aperto: il tasto indietro del telefono
  // chiude il pannello invece di uscire dal sito.
  const entry = panel === 'menu' ? '#opere' : '#profilo';
  if (alreadyOpen) {
    // Passando dal menu al profilo la voce di cronologia è già lì: si sostituisce,
    // altrimenti l'URL direbbe `#opere` mentre a schermo c'è il profilo.
    history.replaceState({ binoclePanel: panel }, '', entry);
  } else {
    history.pushState({ binoclePanel: panel }, '', entry);
  }
}

function closePanel(): void {
  // Se il pannello è stato aperto da qui, la chiusura passa dalla cronologia:
  // così l'URL torna pulito e il tasto avanti lo riapre.
  if (history.state?.binoclePanel) {
    history.back();
    return;
  }
  setPanel(null);
}

function togglePanel(panel: Panel): void {
  const open =
    panel === 'menu'
      ? document.body.classList.contains('showing_menu')
      : document.body.classList.contains('showing_profile');

  if (open) {
    closePanel();
  } else {
    openPanel(panel);
  }
}

export function initNav(): void {
  bind(document.getElementById('toggle_works'), () => togglePanel('menu'));
  bind(document.getElementById('also_toggle_works'), () => togglePanel('menu'));
  bind(document.getElementById('toggle_about_binocle'), () => togglePanel('profile'));
  syncExpanded();

  // Escape chiude il pannello aperto, come una finestra.
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }
    if (
      document.body.classList.contains('showing_menu') ||
      document.body.classList.contains('showing_profile')
    ) {
      closePanel();
    }
  });

  // Il tasto indietro chiude il pannello (la voce di cronologia è stata messa
  // in openPanel). Nessuna chiamata a history qui: si risponde e basta.
  window.addEventListener('popstate', () => {
    if (
      document.body.classList.contains('showing_menu') ||
      document.body.classList.contains('showing_profile')
    ) {
      setPanel(null);
    }
  });
}
