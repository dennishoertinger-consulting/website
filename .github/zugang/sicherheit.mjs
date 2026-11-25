// Fügt beim Veröffentlichen in jede HTML-Seite unter _site/ zwei Sicherheitsregeln für den Browser ein.
// Läuft nur in GitHub Actions (siehe .github/workflows/pages.yml), die Seiten im Repo bleiben unverändert.
// GitHub Pages erlaubt keine eigenen HTTP-Header, deshalb als <meta>-Zeilen direkt nach <meta charset>.
//
// Content-Security-Policy: Der Browser lädt Skripte, Styles, Bilder und Schriften nur von dieser Website.
// Referrer-Policy: Beim Klick auf einen fremden Link erfährt die andere Seite nur die Domain, nicht die Unterseite.
//
// Wird zweimal aufgerufen: vor dem Verschlüsseln (für die eigentlichen Seiten) und danach (für die Code-Seite).
// Kommt ein externer Dienst dazu (z. B. Videos), muss seine Quelle hier in CSP ergänzt werden.

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = '_site';
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  'upgrade-insecure-requests',
].join('; ');
const ZEILEN =
  `<meta http-equiv="Content-Security-Policy" content="${CSP}">` +
  '<meta name="referrer" content="strict-origin-when-cross-origin">';

const files = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : [p];
  });

let n = 0;
for (const f of files(SITE).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;
  const neu = html.replace(/<meta charset=["']?utf-8["']?\s*\/?>/i, (m) => m + ZEILEN);
  if (neu === html) {
    console.error(`Sicherheitsregeln: kein <meta charset> gefunden in ${f}`);
    process.exit(1);
  }
  writeFileSync(f, neu);
  n++;
}
console.log(`Sicherheitsregeln: in ${n} Seiten eingefügt.`);
