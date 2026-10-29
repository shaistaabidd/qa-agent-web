import { createContext, useContext } from 'react';

import type { AccordionType } from './types';

export type AccordionContextValue = {
  disabled: boolean;
  openValues: string[];
  toggle: (value: string) => void;
  type: AccordionType;
};

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('Accordion parts must be used within <Accordion>.');
  }

  return context;
}

export type AccordionItemContextValue = {
  contentId: string;
  disabled: boolean;
  open: boolean;
  toggle: () => void;
  triggerId: string;
  value: string;
};

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within <AccordionItem>.');
  }

  return context;
}
