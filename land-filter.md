# Länder-Filter (einfach)

**Stand:** 2026-09-09

## Was passiert?

Am Start wählst du dein **Land** (ISO2, z. B. `AT`). Es wird am **Profil** gespeichert und filtert Katalog / Suche / Beispiele.

## Feld `eu_countries` in `katalog-produkte.csv`

- Beispiele: `FR`, `DE`, `IT`, `AT`, `DE|AT|EU`, `DE;AT;EU`, `FR;DE`
- Trenner: `|` oder `;` (auch Komma/Leerzeichen werden akzeptiert)
- Beim Laden wird daraus `countries: ["DE","AT","EU"]`

## Matching

Ein Produkt erscheint, wenn:

1. der gewählte Ländercode in `countries` steckt, **oder**
2. `EU` in der Liste steht (= breit verfügbar / „überall“, sobald ein Land gesetzt ist)

## Leere / unbekannte Länder

- Produkte ohne Land-Angabe gelten als **unklar**
- Standard: **ausblenden**, wenn ein Land gesetzt ist (strenger Einkaufs-Helfer)
- Umschalter in Optionen: „Unklare Herkunft ausblenden“
- Wenn eingeblendet: Badge **Land offen**

## Seeds in `catalog.js` ohne Land

Annahme für die DACH-Demo:

- Kern-`DB` (Balea, CeraVe, …): Default **`DE|AT|CH`**
- Offline-`BABY_DB` / `EU_FLAG_CATALOG` ohne Angabe: Default **`EU`** (CSV überschreibt mit echten Codes)
- `TEEN_DB` hat meist schon `countries` als String → wird zu Arrays geparst

Siehe auch `SEED_DEFAULT_COUNTRIES` in `js/catalog.js`.

## Live dm

Die Live-Suche bleibt der **Deutschland-Shop** (`dm.de`). Bei Land ≠ `DE` erscheint ein ehrlicher Badge:

> Shop: DE — Verfügbarkeit in IT ggf. anders

Der lokale CSV-Filter bleibt strikt; Live dm wird nicht versteckt, aber klar gekennzeichnet.

## Keine Therapie

Nur Einkauf & Layering-Hilfe — keine medizinischen Claims.


## Live-Suche

Siehe [eu-drogerien.md](./eu-drogerien.md). Chip folgt Profil-Land (z.B. IT = Live: dm Italia). DE-MCP nie als IT-Lager.
