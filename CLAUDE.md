# CLAUDE.md – Website

Einfachst denkbares Setup: statisches HTML/CSS/JS, kein Build, kein npm, kein Framework.
Nichts hinzufügen, was einen Build-Schritt oder Abhängigkeiten braucht.
Einzige Ausnahme: Die Zugangscode-Verschlüsselung läuft nur in GitHub Actions (`.github/`), nicht lokal.

## Arbeitsweise
- Vor jedem Auftrag die wichtigsten Rückfragen gebündelt stellen. Genauigkeit vor Tempo.
- Das Repo ist öffentlich. Jeder Push ist eine Veröffentlichung: erst Inhalt freigeben lassen,
  dann direkt vor dem Push eine ausdrückliche zweite Bestätigung einholen.
- Niemals private Daten (Privatadresse, private E-Mail, Fotos Dritter) committen.
- Datenschutz/DSGVO hat höchste Priorität: keine Cookies, kein Tracking, keine externen Ressourcen.

## Sprache und Inhalt
- Berufsbezeichnung nur „IT Consultant“ / „IT Consulting“.
- Leser mit „du“ ansprechen. Claim: „Make work better.“ CTA überall „Work with me“.
- Ton: Dennis' eigene Sprache, fachlich fundiert, ruhig, keine Buzzwords, kein Werbeton,
  kein Technik-Bashing. Keine Kennzahlen, stattdessen Zitate aus Arbeitszeugnissen.

## Design
- Schwarz-Weiß plus Himmelblau, sonst keine Farben. Kein Liquid Glass.
- Light ist Standard, Night über `prefers-color-scheme`. Breakpoint Desktop ab 900 px.
- Viel Luft, minimal, keine Overlines. Animationen dezent, `prefers-reduced-motion` respektieren.
- Design-Quelle ist eine einzige Datei `Website_Design.svg` (nicht im Repo).

## Technik
- Relative Pfade in allen Seiten (funktioniert lokal, unter Unterordner und mit Domain).
- Ausnahme: `404.html` nutzt absolute Pfade `/`.
- Bis zum Livegang trägt jede Seite `<meta name="robots" content="noindex, nofollow">`.
