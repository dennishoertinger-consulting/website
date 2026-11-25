# Website Dennis Hörtinger – IT Consulting

make work better_

Reine HTML/CSS/JS-Seite. Kein Build, keine Abhängigkeiten, kein Framework.
Gehostet auf GitHub Pages, Domain hoertinger.de (DNS bei INWX).

## Aufbau

```
index.html              Startseite
leistungen/ projekte/ ueber-mich/ notizen/ impressum/   Unterseiten (je index.html)
notizen/<artikel>/      Artikel
404.html                Fehlerseite
assets/css/style.css    alle Styles, Farben als Tokens oben in :root
assets/js/main.js       Menü, Menüleiste, Tabs, Zitate, Tippen, „Mehr lesen“, Einblenden
assets/fonts/           Geist, Geist Mono, Space Grotesk (selbst gehostet, Lizenzen liegen bei)
assets/logos/  assets/fotos/
favicon.svg
```

## Ändern

Texte direkt in der jeweiligen `index.html` ändern, speichern, committen.
Nach dem Push ist die Änderung nach etwa einer Minute online.

Lokal ansehen: Ordner im Terminal öffnen und `python3 -m http.server 8000`,
dann http://localhost:8000.

## Regeln

- Keine externen Dienste (keine Google Fonts, keine CDNs). Ausnahme: Google Analytics 4 (Mess-ID in assets/js/main.js),
  lädt erst nach Zustimmung im Hinweis; Erlaubnis in der CSP in .github/zugang/sicherheit.mjs.
- Design nach CI Version 13: Eisgrau, Weiß, Schwarz, Klein-Blau nur für Claim, Cursor und Links. Light Standard, Night über Systemeinstellung.
- Vorlage: CI-Übergabe und Entwurf (liegen bewusst nicht im Repo).

## Zugangscode (bis zum Livegang)

Bei jedem Push auf `main` veröffentlicht `.github/workflows/pages.yml` die Seite auf GitHub Pages.
Dabei werden alle HTML-Seiten mit dem Secret `ZUGANGSCODE` per StatiCrypt (AES-256) verschlüsselt. Fehlt das Secret, bricht die Veröffentlichung ab.
Besucher sehen dann nur „Bald online.“ mit einem Code-Feld; der Code bleibt 30 Tage gemerkt.
Das passiert nur in der veröffentlichten Kopie, im Repo bleibt alles reines HTML.

- Entschlüsseln geht nur über https.
- Bilder, Logos, CSS und JS sind nicht verschlüsselt.
- Code ändern: Secret ändern, dann unter Actions „Veröffentlichen (GitHub Pages)“ neu starten.
- Skript und Vorlage der Code-Seite: `.github/zugang/`.

## Livegang (frühestens 1.12.2026)

1. Die Zeile `<meta name="robots" content="noindex, nofollow">` entfernen, aber nur in den Seiten mit dem Kommentar „Bis zum Livegang“.
   Bleibt stehen: `404.html` und Artikel mit dem Kommentar „Artikel noch nicht fertig“ (erst löschen, wenn Text und Datum stehen, dann in `sitemap.xml` eintragen).
2. Actions-Variable `OHNE_ZUGANGSCODE` mit Wert `ja` anlegen, Secret `ZUGANGSCODE` löschen und den Workflow neu starten.
3. Platzhalter ersetzen: E-Mail (hallo@example.com), Anschrift, Fotos, Artikeltexte.

Domain: in Settings → Pages als `www.hoertinger.de` eingetragen, „Enforce HTTPS“ an.
DNS bei INWX: `www` CNAME `dennishoertinger-consulting.github.io`, `hoertinger.de` A-Records 185.199.108.153 bis 185.199.111.153.

## Suchmaschinen (SEO)

- Jede Seite hat Titel, Beschreibung, `canonical` und Open-Graph-Angaben mit absoluter Adresse `https://www.hoertinger.de/…`
  (nur diese Angaben sind absolut, Links und Bilder bleiben relativ).
- Vorschaubild beim Teilen: `assets/fotos/vorschau-teilen.jpg` (1200×630). App-Symbol: `assets/fotos/logo-dh.png`.
- Strukturierte Daten (schema.org, JSON-LD) nur auf der Startseite: Website, Dienstleistung, Person.
- `robots.txt` erlaubt alles und nennt `sitemap.xml`. Neue Seite: in `sitemap.xml` eintragen.
- Beschreibungen höchstens etwa 155 Zeichen, Titel etwa 60.

