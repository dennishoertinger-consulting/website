# Website Dennis Hörtinger – IT Consulting

Make work better.

Reine HTML/CSS/JS-Seite. Kein Build, keine Abhängigkeiten, kein Framework.
Gehostet auf GitHub Pages, Domain hoertinger.de (DNS bei INWX).

## Aufbau

```
index.html              Startseite
leistungen/ projekte/ ueber-mich/ notizen/ impressum/   Unterseiten (je index.html)
notizen/<artikel>/      Artikel
404.html                Fehlerseite
assets/css/style.css    alle Styles, Farben als Tokens oben in :root
assets/js/main.js       Menü, Switch, Karussell, „Mehr lesen“, Einblenden
assets/fonts/           Inter (selbst gehostet, Lizenz liegt bei)
assets/logos/  assets/fotos/
favicon.svg
```

## Ändern

Texte direkt in der jeweiligen `index.html` ändern, speichern, committen.
Nach dem Push ist die Änderung nach etwa einer Minute online.

Lokal ansehen: Ordner im Terminal öffnen und `python3 -m http.server 8000`,
dann http://localhost:8000.

## Regeln

- Keine Cookies, kein Tracking, keine externen Dienste (keine Google Fonts, keine CDNs).
- Design: Schwarz-Weiß plus Himmelblau, Light Standard, Night über Systemeinstellung.
- Vorlage des Designs: `Website_Design.svg` (liegt bewusst nicht im Repo).

## Zugangscode (bis zum Livegang)

Bei jedem Push auf `main` veröffentlicht `.github/workflows/pages.yml` die Seite auf GitHub Pages.
Ist das Secret `ZUGANGSCODE` gesetzt, werden dabei alle HTML-Seiten mit StatiCrypt (AES-256) verschlüsselt.
Besucher sehen dann nur „Bald online.“ mit einem Code-Feld; der Code bleibt 30 Tage gemerkt.
Das passiert nur in der veröffentlichten Kopie, im Repo bleibt alles reines HTML.

- Entschlüsseln geht nur über https.
- Bilder, Logos, CSS und JS sind nicht verschlüsselt.
- Code ändern: Secret ändern, dann unter Actions „Veröffentlichen (GitHub Pages)“ neu starten.
- Skript und Vorlage der Code-Seite: `.github/zugang/`.

## Livegang (frühestens 1.12.2026)

1. In allen HTML-Dateien die Zeile `<meta name="robots" content="noindex, nofollow">` entfernen.
2. Secret `ZUGANGSCODE` löschen und den Workflow neu starten.
3. Platzhalter ersetzen: E-Mail (hallo@example.com), Anschrift, Fotos, Artikeltexte.

Domain: in Settings → Pages als `www.hoertinger.de` eingetragen, „Enforce HTTPS“ an.
DNS bei INWX: `www` CNAME `dennishoertinger-consulting.github.io`, `hoertinger.de` A-Records 185.199.108.153 bis 185.199.111.153.
