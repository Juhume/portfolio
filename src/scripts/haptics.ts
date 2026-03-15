/**
 * Global haptic feedback for iOS Safari.
 * Uses the <label> + <input type="checkbox" switch> hack.
 * Only fires on click events (iOS restriction).
 * 
 * Attaches to: buttons, links, interactive elements.
 * Respects prefers-reduced-motion.
 */

let label: HTMLLabelElement | null = null;

function init() {
  if (typeof document === 'undefined') return;
  if (label) return; // already initialized

  // Respect user preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Only on touch devices
  if (!('ontouchstart' in window)) return;

  const id = 'global-haptic-switch';
  label = document.createElement('label');
  label.setAttribute('for', id);
  label.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);pointer-events:none;';
  label.setAttribute('aria-hidden', 'true');

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  input.id = id;
  input.style.cssText = 'all:initial;appearance:auto;';

  label.appendChild(input);
  document.body.appendChild(label);
}

function tick() {
  label?.click();
}

function setup() {
  init();

  // Delegate: any click on a button, link, or [data-haptic] element
  document.addEventListener('click', (e) => {
    if (!label) return;
    const target = e.target as HTMLElement;
    const interactive = target.closest('a, button, [role="tab"], [data-haptic], .theme-toggle, .nav__menu-btn, .lang-switcher__link, .card__link, .cflow-dot');
    if (interactive) tick();
  }, { passive: true });
}

// Run on first load
setup();

// Re-run after Astro View Transitions
document.addEventListener('astro:page-load', () => {
  init();
});
