import { useSyncExternalStore } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'qa-agent-theme';

const listeners = new Set<() => void>();

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function getStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference;
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute('data-theme', resolved);
}

export function setThemePreference(preference: ThemePreference) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can throw in private browsing / disabled-storage contexts; the
    // preference just won't persist across reloads.
  }
  applyTheme(resolveTheme(preference));
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = () => {
    if (getStoredPreference() === 'system') applyTheme(getSystemTheme());
    onChange();
  };
  media.addEventListener('change', onSystemChange);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener('change', onSystemChange);
  };
}

function getSnapshot(): ThemePreference {
  return getStoredPreference();
}

// The server and pre-hydration render always assume 'system' so both paint the same
// markup; the inline script in RootLayout sets the real data-theme before first paint.
function getServerSnapshot(): ThemePreference {
  return 'system';
}

/** Current theme preference ('light' | 'dark' | 'system') plus a setter. */
export function useThemePreference(): [ThemePreference, (preference: ThemePreference) => void] {
  const preference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [preference, setThemePreference];
}

/**
 * Sets `data-theme` on `<html>` before first paint, so there's no light-mode flash
 * for a user who prefers dark. Inlined as a synchronous script in RootLayout's
 * `<head>` — keep this dependency-free since it runs before React and before the
 * app's own bundle loads.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var pref = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    var resolved = pref === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : pref;
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {}
})();
`;
