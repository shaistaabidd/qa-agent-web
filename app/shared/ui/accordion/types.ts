import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export const ACCORDION_TYPES = ['single', 'multiple'] as const;

export type AccordionType = (typeof ACCORDION_TYPES)[number];

type AccordionRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>;

export interface AccordionSingleProps extends AccordionRootProps {
  children: ReactNode;
  collapsible?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  type?: 'single';
  value?: string;
}

export interface AccordionMultipleProps extends AccordionRootProps {
  children: ReactNode;
  collapsible?: boolean;
  defaultValue?: string[];
  disabled?: boolean;
  onValueChange?: (value: string[]) => void;
  type: 'multiple';
  value?: string[];
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  disabled?: boolean;
  value: string;
}

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
