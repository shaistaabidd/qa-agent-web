import type { LinksFunction } from 'react-router';

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
  {
    rel: 'icon',
    type: 'image/png',
    href: '/favicon-32x32.png',
    sizes: '32x32',
  },
  {
    rel: 'icon',
    type: 'image/png',
    href: '/favicon-16x16.png',
    sizes: '16x16',
  },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/site.webmanifest' },
  {
    rel: 'preload',
    href: '/fonts/inter-latin-wght-normal.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
];
