import type { HTMLAttributes, ReactNode } from 'react';

export type CardSize = 'default' | 'sm' | 'lg';

export type CardVariant = 'default' | 'flat';

export type CardTone = 'default' | 'danger';

export type CardMediaVariant = 'cover' | 'icon';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  size?: CardSize;
  tone?: CardTone;
  variant?: CardVariant;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardHeaderTextProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface CardActionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  variant?: CardMediaVariant;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardFooterActionsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}
