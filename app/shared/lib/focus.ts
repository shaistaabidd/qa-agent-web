const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function moveFocus(element: HTMLElement | null | undefined) {
  element?.focus({ focusVisible: true, preventScroll: true });
}

function isFocusable(element: HTMLElement) {
  if (element.tabIndex < 0 || element.hasAttribute('disabled')) {
    return false;
  }

  if (element.getAttribute('aria-hidden') === 'true' || element.closest('[hidden]')) {
    return false;
  }

  const style = getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

function focusableIn(root: Element) {
  const elements: HTMLElement[] = [];

  if (root instanceof HTMLElement && root.matches(FOCUSABLE)) {
    elements.push(root);
  }

  elements.push(...root.querySelectorAll<HTMLElement>(FOCUSABLE));
  return elements.filter(isFocusable);
}

function siblingFocusable(node: Element, direction: 'next' | 'previous') {
  let sibling = direction === 'next' ? node.nextElementSibling : node.previousElementSibling;

  while (sibling) {
    const found = focusableIn(sibling);
    const pick = direction === 'next' ? found[0] : found[found.length - 1];

    if (pick) {
      return pick;
    }

    sibling = direction === 'next' ? sibling.nextElementSibling : sibling.previousElementSibling;
  }

  return null;
}

/** Nearest control that is not inside `node`, searching forward then backward. */
export function findNeighbor(node: HTMLElement) {
  let current: Element | null = node;

  while (current && current !== document.body) {
    const next = siblingFocusable(current, 'next');
    if (next) {
      return next;
    }

    const previous = siblingFocusable(current, 'previous');
    if (previous) {
      return previous;
    }

    current = current.parentElement;
  }

  return null;
}

export function focusNeighbor(node: HTMLElement) {
  moveFocus(findNeighbor(node));
}
