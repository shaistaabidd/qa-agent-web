import type { SyntheticEvent } from 'react';
import { useMemo, useState } from 'react';

const FRAME_HEAD =
  "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'\">" +
  '<base target="_blank">' +
  '<style>html,body{margin:0}body{padding:12px}</style>';
const MAX_FRAME_HEIGHT = 480;
const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

const TAG_BODY = `(?:[^>"']|"[^"]*"|'[^']*')*`;
const META_HTTP_EQUIV = new RegExp(`<meta\\b${TAG_BODY}\\bhttp-equiv${TAG_BODY}>`, 'gi');
const BASE_TAG = new RegExp(`<base\\b${TAG_BODY}>`, 'gi');

/** Meta refresh and base can redirect or re-point the frame, and the CSP does not stop either. */
function stripNavigationTags(html: string) {
  return html.replace(META_HTTP_EQUIV, '').replace(BASE_TAG, '');
}

function toSrcDoc(html: string) {
  return `<!doctype html><html><head><meta charset="utf-8">${FRAME_HEAD}</head><body>${stripNavigationTags(html)}</body></html>`;
}

function isSafeHref(href: string) {
  try {
    return SAFE_LINK_PROTOCOLS.has(new URL(href, 'about:blank').protocol);
  } catch {
    return false;
  }
}

export function EmailLogHtmlFrame({ html }: { html: string }) {
  const [height, setHeight] = useState(MAX_FRAME_HEIGHT);
  const srcDoc = useMemo(() => toSrcDoc(html), [html]);

  function handleLoad(event: SyntheticEvent<HTMLIFrameElement>) {
    const doc = event.currentTarget.contentDocument;
    if (!doc) {
      return;
    }

    doc.querySelectorAll('meta[http-equiv], base').forEach((node) => node.remove());
    doc.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href !== null && !isSafeHref(href)) {
        link.removeAttribute('href');
      }
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('target', '_blank');
    });
    setHeight(Math.min(Math.ceil(doc.body.getBoundingClientRect().height), MAX_FRAME_HEIGHT));
  }

  return (
    <iframe
      className="w-full rounded-[8px] border border-low bg-surface-white"
      onLoad={handleLoad}
      referrerPolicy="no-referrer"
      sandbox="allow-same-origin allow-popups"
      srcDoc={srcDoc}
      style={{ height }}
      title="Email body"
    />
  );
}
