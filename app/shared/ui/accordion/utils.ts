import type { KeyboardEvent } from 'react';

import { cn } from '@/shared/lib/utils';

import {
  contentClass,
  itemClass,
  panelClass,
  panelClosedClass,
  panelOpenClass,
  rootClass,
  triggerClass,
} from './constants';

export function getRootClassName(className?: string) {
  return cn(rootClass, className);
}

export function getItemClassName(className?: string) {
  return cn(itemClass, className);
}

export function getTriggerClassName(className?: string) {
  return cn(triggerClass, className);
}

export function getPanelClassName(open: boolean) {
  return cn(panelClass, open ? panelOpenClass : panelClosedClass);
}

export function getContentClassName(className?: string) {
  return cn(contentClass, className);
}

export function toOpenValues(value: string | string[] | undefined) {
  if (value == null || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

export function handleAccordionKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  if (
    event.defaultPrevented ||
    (event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'Home' &&
      event.key !== 'End')
  ) {
    return;
  }

  // Only this accordion's own triggers. A nested accordion handles its own keys,
  // and its closed panels are inert, so focus() would silently do nothing there.
  const root = event.currentTarget;
  const triggers = [
    ...root.querySelectorAll<HTMLButtonElement>('[data-slot="accordion-trigger"]:not(:disabled)'),
  ].filter(
    (trigger) =>
      trigger.closest('[data-slot="accordion"]') === root && trigger.closest('[inert]') === null,
  );

  if (triggers.length === 0) {
    return;
  }

  const currentIndex = triggers.findIndex(
    (trigger) => trigger === event.target || trigger.contains(event.target as Node),
  );

  if (currentIndex < 0) {
    return;
  }

  let nextIndex = currentIndex;

  if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = triggers.length - 1;
  } else if (event.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % triggers.length;
  } else {
    nextIndex = currentIndex === 0 ? triggers.length - 1 : currentIndex - 1;
  }

  const next = triggers[nextIndex];

  if (!next) {
    return;
  }

  event.preventDefault();
  next.focus();
}
