import { PassThrough } from 'node:stream';

import { ApolloProvider } from '@apollo/client/react';
import { createReadableStreamFromReadable } from '@react-router/node';
import { isbot } from 'isbot';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';
import type { EntryContext, HandleErrorFunction, RouterContextProvider } from 'react-router';
import { ServerRouter } from 'react-router';

import { makeClient } from '@/providers/apollo';
import { NonceContext } from '@/shared/lib/nonce';
import { reportError } from '@/shared/lib/reportError';
import { createNonce, securityHeaders } from '@/shared/lib/securityHeaders';

export const streamTimeout = 5_000;

export const handleError: HandleErrorFunction = (error, { request }) => {
  if (!request.signal.aborted) {
    reportError(error);
  }
};

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: RouterContextProvider,
) {
  const nonce = createNonce();
  for (const [name, value] of Object.entries(
    securityHeaders(nonce, import.meta.env.VITE_APP_API_URL),
  )) {
    responseHeaders.set(name, value);
  }

  // https://httpwg.org/specs/rfc9110.html#HEAD
  if (request.method.toUpperCase() === 'HEAD') {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? 'onAllReady' : 'onShellReady';

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    let timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(
      () => abort(),
      streamTimeout + 1000,
    );

    const client = makeClient(request);

    const { pipe, abort } = renderToPipeableStream(
      <NonceContext.Provider value={nonce}>
        <ApolloProvider client={client}>
          <ServerRouter context={routerContext} nonce={nonce} url={request.url} />
        </ApolloProvider>
      </NonceContext.Provider>,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              // Clear the timeout to prevent retaining the closure and memory leak
              clearTimeout(timeoutId);
              timeoutId = undefined;
              callback();
            },
          });
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          pipe(body);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Report streaming render errors after the shell is sent. Earlier
          // errors reject the document request and go through `handleError`.
          if (shellRendered) {
            reportError(error);
          }
        },
      },
    );
  });
}
