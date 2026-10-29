import type { ReactNode } from 'react';

export type AuthLayoutProps = {
  children?: ReactNode;
  className?: string;
};

export type AuthFrameProps = AuthLayoutProps & {
  linkLogo?: boolean;
};

export type AuthHeroPanelProps = {
  className?: string;
};

export type AuthScreenHeaderProps = {
  aside?: ReactNode;
  className?: string;
  description: ReactNode;
  title: string;
};

export type AuthMessagePanelProps = {
  action: ReactNode;
  className?: string;
  description: ReactNode;
  footer?: ReactNode;
  icon: ReactNode;
  notice?: ReactNode;
  title: string;
};
