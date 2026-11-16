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

## Livegang (frühestens 1.12.2026)

1. In allen HTML-Dateien die Zeile `<meta name="robots" content="noindex, nofollow">` entfernen.
2. Datei `CNAME` mit Inhalt `hoertinger.de` anlegen.
3. DNS bei INWX auf GitHub Pages setzen, in den Pages-Einstellungen „Enforce HTTPS“ aktivieren.
4. Platzhalter ersetzen: E-Mail (hallo@example.com), Anschrift, Fotos, Artikeltexte.
