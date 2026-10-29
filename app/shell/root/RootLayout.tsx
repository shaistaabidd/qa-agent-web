import { ApolloHydrationHelper } from '@apollo/client-integration-react-router';
import type { ReactNode } from 'react';
import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';

import { useNonce } from '@/shared/lib/nonce';
import { themeInitScript } from '@/shared/lib/theme';
import { Toaster } from '@/shared/ui/toast';

type RootLayoutProps = {
  children: ReactNode;
};

export function RootLayout({ children }: RootLayoutProps) {
  const nonce = useNonce();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} nonce={nonce} />
        <Meta />
        <Links />
      </head>
      <body>
        <ApolloHydrationHelper>{children}</ApolloHydrationHelper>
        <div data-inert-ignore>
          <Toaster />
        </div>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
