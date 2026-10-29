import { isRouteErrorResponse } from 'react-router';

export type ErrorReporter = (error: unknown) => void;

let reporter: ErrorReporter = (error) => {
  console.error(error);
};

export function setErrorReporter(next: ErrorReporter) {
  reporter = next;
}

export function reportError(error: unknown) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return;
  }

  reporter(error);
}
