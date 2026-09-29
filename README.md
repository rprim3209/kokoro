# KoKoRo Webapp

Aktueller Einstieg: **index.html**. Die App organisiert lokale Profile, Morgen-/Abendroutinen und regelbasierte Kombinationshinweise auf Deutsch und Englisch. Sie ist nicht klinisch validiert.

## Lokal entwickeln

Aus diesem Ordner:

```sh
python -m pip install -r requirements.txt
python run.py --port 8793
```

Dann http://127.0.0.1:8793/index.html öffnen. Für die reine Oberfläche funktioniert statisches HTTP-Hosting; Online-Barcodes benötigen die API. Ein Doppelklick über `file://` lädt CSV-Dateien nicht zuverlässig.

Endnutzer öffnen später eine gehostete HTTPS-Adresse und starten keinen eigenen Server. Für Hosting `api:app` bereitstellen, `KOKORO_ALLOWED_HOSTS` setzen und HTTPS konfigurieren. Ein Deployment ist noch nicht erfolgt.

## Struktur

- `index.html`, `manifest.webmanifest`: Einstieg und App-Metadaten.
- `js/`, `css/`, `icons/`: Oberfläche und Logik.
- `data/`: die zwei tatsächlich geladenen CSV-Kataloge. Der Hauptkatalog umfasst derzeit 1010 Zeilen; das bedeutet nicht 1010 eindeutige, verifizierte Rezepturen.
- `api.py`, `run.py`, `requirements.txt`: unterstützter Server mit expliziter Dateifreigabe.
- `tests/`: automatisierte Prüfungen.
Alte Serverstarter, historische Konzepte, doppelte Einstiegseiten und überholte Testkopien wurden entfernt. Es gibt nur eine vollständige Einstiegseite.

## Verhalten und Grenzen

Das aktive Profil steht zuerst; nur dieses zeigt ein Lösch-×. Produktdetails zeigen vorhandene INCI-Listen getrennt von Wirkstoffangaben. Fehlende Listen werden nicht erfunden. Alternativen vergleichen Kategorie und erfasste Wirkstoffe unter Berücksichtigung hinterlegter Profilwünsche; sie belegen keine identische Wirkung.

Grün bedeutet: kein Treffer in den hinterlegten Wirkstoffregeln. Es bedeutet keine garantierte Verträglichkeit. Rot muss einen konkreten Grund nennen. Vollständige Rezepturen, individuelle Allergien und reale Hautreaktionen werden nicht umfassend beurteilt.

Profile und Routinen bleiben im Browser. Unbekannte Barcodes können bei Open Beauty Facts nachgeschlagen werden; `KOKORO_LIVE_SEARCH=0` deaktiviert das. Es gibt keine zugesicherte Live-dm-Suche, Preisaktualität oder Verfügbarkeitsprüfung.

## Prüfen

```sh
node --test tests/*.test.cjs
python -m pytest tests/test_api.py
```

Für Python-Tests zusätzlich `pytest` installieren.
