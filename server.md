# Lokaler Server

Kleiner Python-Server für die Demo. Er liefert alle Dateien aus diesem Ordner
(z. B. `demo.html`, CSVs) und holt Live-Produkte von dm über die offizielle
Produktsuche.

**Live-dm in der Demo braucht diesen Server.** Ohne ihn fällt die Suche auf den
lokalen Pilot-Cache zurück (oder bleibt leer, je nach Browser).

## Starten

Nichts installieren außer **Python 3**.

1. Doppelklick auf `start-server.bat`  
   **oder** im Ordner: `python server.py`
2. Im Browser öffnen: http://127.0.0.1:8787/demo.html

Fenster offen lassen, solange du die Demo nutzt. Stoppen: Fenster schließen
oder `Strg+C`.

Optionaler Port: `python server.py --port 8787` oder Umgebungsvariable `PORT`.

## Was der Server macht

- `GET /` leitet auf `demo.html` weiter
- Statische Dateien (HTML, CSV, JS, CSS, …)
- `GET /api/dm-search?query=…&pageSize=12` → JSON `{ "products": [ … ] }`
  - zuerst Live-Suche bei dm
  - wenn das scheitert: lokale `dm-pilot-produkte.csv`

Nur lokal (`127.0.0.1`), kein öffentliches Netz.
