# CLAUDE.md – Website

Einfachst denkbares Setup: statisches HTML/CSS/JS, kein Build, kein npm, kein Framework.
Nichts hinzufügen, was einen Build-Schritt oder Abhängigkeiten braucht.
Einzige Ausnahme: Die Zugangscode-Verschlüsselung läuft nur in GitHub Actions (`.github/`), nicht lokal.

## Arbeitsweise
- Vor jedem Auftrag die wichtigsten Rückfragen gebündelt stellen. Genauigkeit vor Tempo.
- Das Repo ist öffentlich. Jeder Push ist eine Veröffentlichung: erst Inhalt freigeben lassen,
  dann direkt vor dem Push eine ausdrückliche zweite Bestätigung einholen.
- Niemals private Daten (Privatadresse, private E-Mail, Fotos Dritter) committen.
- Datenschutz/DSGVO hat höchste Priorität: keine externen Ressourcen. Einzige Ausnahme: Google Analytics 4,
  lädt nur nach Einwilligung im Hinweis (Entscheidung Dennis, 25.11.2026). Ohne Zustimmung keine Cookies, kein Tracking.

## Sprache und Inhalt
- Berufsbezeichnung nur „IT Consultant“ / „IT Consulting“.
- Leser mit „du“ ansprechen. Claim: „make work better_“. CTA überall „Work with me“.
- Ton: Dennis' eigene Sprache, fachlich fundiert, ruhig, keine Buzzwords, kein Werbeton,
  kein Technik-Bashing. Keine Kennzahlen, stattdessen Zitate aus Arbeitszeugnissen.

## Design
- Maßgeblich ist die CI (Version 13, 25.11.2026). Tokens oben in `assets/css/style.css`.
- Farben: Eisgrau #EFF2F5 (Seitengrund), Weiß (Kacheln), Schwarz (Text, primäre Buttons, Kontakt, Projekt-Kacheln),
  Schiefer #56606B (Nebentext), Linie #D9DEE4. Klein-Blau #0000FF nur für Claim „better“, Unterstrich-Cursor und Links („Mehr“).
  Keine Verläufe, keine Pillen, keine blauen Buttons, keine Kreise. Radien nur 10 (Buttons), 12 (Karten), 16 (Menüleiste).
- Schrift (selbst gehostet in `assets/fonts/`): Space Grotesk 700 nur Claim, Geist für alles andere, Geist Mono nur kleine Beschriftungen.
- Light ist Standard, Night über `prefers-color-scheme` (Werte aus der CI). Breakpoint Desktop ab 900 px.
- Viel Luft, minimal, keine Overlines. Schatten nur an der Menüleiste beim Scrollen.
- Bewegung: „better“ wird getippt, Cursor blinkt dauerhaft; Abschnittsüberschriften tippen sich beim Scrollen.
  Bei `prefers-reduced-motion` steht alles sofort.

## Technik
- Relative Pfade in allen Seiten (funktioniert lokal, unter Unterordner und mit Domain).
- Ausnahme: `404.html` nutzt absolute Pfade `/`.
- Bis zum Livegang trägt jede Seite `<meta name="robots" content="noindex, nofollow">`.
