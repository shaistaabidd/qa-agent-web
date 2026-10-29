const stack: symbol[] = [];

/** Registers an open overlay. Only the most recent one should answer Escape and Tab. */
export function pushOverlay() {
  const token = Symbol('overlay');
  stack.push(token);

  return {
    isTop: () => stack[stack.length - 1] === token,
    remove: () => {
      const index = stack.indexOf(token);

      if (index !== -1) {
        stack.splice(index, 1);
      }
    },
  };
}

const TRANSIENT_FOCUS_SELECTOR = '[role="menu"], [role="listbox"], [role="dialog"]';

const INTERACTIVE_SELECTOR =
  'button, a[href], input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])';

let lastStableFocus: HTMLElement | null = null;

function rememberStable(target: EventTarget | null, closest: boolean) {
  if (!(target instanceof HTMLElement) || target === document.body) {
    return;
  }

  const element = closest ? target.closest<HTMLElement>(INTERACTIVE_SELECTOR) : target;

  if (element && !element.closest(TRANSIENT_FOCUS_SELECTOR)) {
    lastStableFocus = element;
  }
}

if (typeof document !== 'undefined') {
  // A dialog opened from a menu item finds focus on the menu item, which is gone by the time the
  // dialog closes. A menu trigger may not take focus on click, so pointer presses count too.
  document.addEventListener('focusin', (event) => rememberStable(event.target, false), true);
  document.addEventListener('pointerdown', (event) => rememberStable(event.target, true), true);
}

/** The element to give focus back to when the active element is a transient one. */
export function resolveReturnFocus(active: Element | null) {
  if (
    active instanceof HTMLElement &&
    active !== document.body &&
    !active.closest('[role="menu"], [role="listbox"]')
  ) {
    return active;
  }

  return lastStableFocus?.isConnected ? lastStableFocus : null;
}

const deferredEscapes = new WeakSet<Event>();

/** A layer that cannot answer Escape (a Radix sheet under another overlay) calls this before `preventDefault()` so the top overlay still treats the key as unclaimed. */
export function deferEscape(event: Event) {
  deferredEscapes.add(event);
}

export function isEscapeDeferred(event: Event) {
  return deferredEscapes.has(event);
}

const inertCounts = new Map<Element, number>();
const inertOriginal = new Map<Element, boolean>();

const OVERLAY_PORTAL_SELECTOR = '[data-slot="dialog-portal"], [data-slot="drawer-portal"]';

function isOverlayPortalRoot(element: Element) {
  return (
    element.matches(OVERLAY_PORTAL_SELECTOR) ||
    element.querySelector('[aria-modal="true"]') !== null
  );
}

/** Marks every other child of `<body>` inert so focus and clicks cannot reach the page behind a modal. Children with `data-inert-ignore` (the toaster) and other modal portal roots stay as they are. */
export function inertSiblingsOf(portalRoot: Element) {
  const marked: Element[] = [];

  for (const element of document.body.children) {
    if (
      element === portalRoot ||
      element.tagName === 'SCRIPT' ||
      element.hasAttribute('data-inert-ignore') ||
      isOverlayPortalRoot(element)
    ) {
      continue;
    }

    const count = inertCounts.get(element) ?? 0;

    if (count === 0) {
      inertOriginal.set(element, element.hasAttribute('inert'));
      element.setAttribute('inert', '');
    }

    inertCounts.set(element, count + 1);
    marked.push(element);
  }

  return () => {
    for (const element of marked) {
      const count = (inertCounts.get(element) ?? 1) - 1;

      if (count > 0) {
        inertCounts.set(element, count);
        continue;
      }

      inertCounts.delete(element);

      if (!inertOriginal.get(element)) {
        element.removeAttribute('inert');
      }

      inertOriginal.delete(element);
    }
  };
}

/** The direct child of `<body>` that holds `node`. */
export function bodyChildOf(node: Element) {
  let current: Element | null = node;

  while (current && current.parentElement !== document.body) {
    current = current.parentElement;
  }

  return current;
}
