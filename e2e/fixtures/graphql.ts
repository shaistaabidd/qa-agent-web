import type { Page, Request, Route } from '@playwright/test';

import { featureFlagsResponse, publicFeatureFlagsResponse } from './featureFlags';

type Variables = Record<string, unknown>;

export type GraphqlHandler = (variables: Variables) => unknown;
export type GraphqlHandlers = Record<string, GraphqlHandler>;

/** Return this from a handler to answer the operation with a GraphQL error. */
export class GraphqlFailure {
  constructor(readonly message: string) {}
}

/** Return this from a handler to drop the connection, as a network failure or an API that is down. */
export class GraphqlAbort {}

export type GraphqlCall = { name: string; variables: Variables };

export type GraphqlMock = {
  callsTo: (name: string) => GraphqlCall[];
  unmocked: string[];
};

export const GRAPHQL_URL = /\/graphql(\?.*)?$/;

export function corsHeaders(request: Request) {
  return {
    'access-control-allow-origin': request.headers().origin ?? '*',
    'access-control-allow-headers':
      request.headers()['access-control-request-headers'] ?? 'authorization, content-type',
    'access-control-allow-methods': 'POST, GET, OPTIONS',
  };
}

/** Answers a CORS preflight; returns true when the request was one and is done. */
async function answerPreflight(route: Route) {
  const request = route.request();
  if (request.method() !== 'OPTIONS') {
    return false;
  }

  await route.fulfill({ headers: corsHeaders(request), status: 204 });
  return true;
}

/** Answered unless a spec passes its own handler: every feature flag on. */
const DEFAULT_HANDLERS: GraphqlHandlers = {
  FetchFeatureFlags: () => featureFlagsResponse(),
  FetchPublicFeatureFlags: () => publicFeatureFlagsResponse(),
};

/**
 * Answers GraphQL operations by name. An operation without a handler gets a plain GraphQL error,
 * which the app shows as a toast without ending the session, and is recorded in `unmocked`.
 * The feature flag queries answer every flag on unless `handlers` overrides them.
 */
export async function mockGraphql(page: Page, specHandlers: GraphqlHandlers): Promise<GraphqlMock> {
  const handlers = { ...DEFAULT_HANDLERS, ...specHandlers };
  const unmocked: string[] = [];
  const calls: GraphqlCall[] = [];

  await page.route(GRAPHQL_URL, async (route) => {
    if (await answerPreflight(route)) {
      return;
    }

    const request = route.request();
    const headers = corsHeaders(request);

    let body: { operationName?: string; variables?: Variables } | null = null;
    try {
      body = request.postDataJSON();
    } catch {
      await route.fallback();
      return;
    }

    const name = body?.operationName ?? '';
    calls.push({ name, variables: body?.variables ?? {} });
    const handler = handlers[name];
    if (!handler) {
      unmocked.push(name);
      await route.fulfill({
        headers,
        json: { data: null, errors: [{ message: `E2E: ${name} is not mocked` }] },
      });
      return;
    }

    const result = handler(body?.variables ?? {});
    if (result instanceof GraphqlAbort) {
      await route.abort('connectionrefused');
      return;
    }

    if (result instanceof GraphqlFailure) {
      await route.fulfill({ headers, json: { data: null, errors: [{ message: result.message }] } });
      return;
    }

    await route.fulfill({ headers, json: { data: result } });
  });

  return { callsTo: (name) => calls.filter((call) => call.name === name), unmocked };
}

/**
 * Answers `FetchPublicFeatureFlags` for a page that mocks nothing else, so signed-out specs do not
 * depend on how the real backend's flags happen to be set. Every other request goes through.
 * `mockGraphql` registers later and so takes over, with the same default.
 */
export async function answerFeatureFlagsByDefault(page: Page) {
  await page.route(GRAPHQL_URL, async (route) => {
    if (await answerPreflight(route)) {
      return;
    }

    const request = route.request();
    let operationName: string | undefined;
    try {
      operationName = request.postDataJSON()?.operationName;
    } catch {
      operationName = undefined;
    }

    if (operationName !== 'FetchPublicFeatureFlags') {
      await route.fallback();
      return;
    }

    await route.fulfill({
      headers: corsHeaders(request),
      json: { data: publicFeatureFlagsResponse() },
    });
  });
}
