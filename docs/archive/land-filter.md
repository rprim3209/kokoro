# Länder-Filter (einfach)

**Stand:** 2026-09-09 (DACH)

## Was passiert?

Am Start wählst du dein **Land** (ISO2, z. B. `AT`). Es wird am **Profil** gespeichert und filtert Katalog / Suche / Beispiele.

## Feld `eu_countries` in `katalog-produkte.csv`

- Beispiele: `FR`, `DE`, `IT`, `AT`, `DE|AT|EU`, `DE;AT;EU`, `FR;DE`
- Trenner: `|` oder `;` (auch Komma/Leerzeichen werden akzeptiert)
- Beim Laden wird daraus `countries: ["DE","AT","EU"]`
- Hinweis: OBF-/Scan-Länder sind oft **wo der Barcode erfasst wurde**, nicht exclusive Verkaufsrechte.

## Matching

Ein Produkt erscheint, wenn:

1. der gewählte Ländercode in `countries` steckt, **oder**
2. `EU` in der Liste steht (= breit verfügbar / „überall“, sobald ein Land gesetzt ist), **oder**
3. du in **DACH** bist und das Produkt ein anderes DACH-Land trägt (siehe unten)

## DACH-Marktgruppe (Filter)

**DACH = gemeinsamer Drogerie-Markt für Filter; keine Garantie jeder Filiale.**

- Gruppe: `AT`, `DE`, `CH` (und `LI`, falls vorhanden)
- Profil **AT** → Produkt passt bei `AT` **oder** `DE` **oder** `CH` **oder** `EU` (ebenso DE↔AT/CH)
- **Nicht** für IT/FR/…: Italien filtert reine DE-only SKUs weiterhin raus (außer `EU`)
- Wir behaupten **nicht**, dass jedes FR-only Produkt in AT liegt

## Leere / unbekannte Länder

- Produkte ohne Land-Angabe gelten als **unklar**
- Standard: **einblenden** mit Badge **Land offen** (damit der Katalog nicht leer wirkt)
- Umschalter in Optionen: „Unklare Herkunft ausblenden“
- Migration `dach1`: alter Default „ausblenden“ wird einmalig auf „einblenden“ gestellt

## Seeds in `catalog.js` ohne Land

Annahme für die DACH-Demo:

- Kern-`DB` (Balea, CeraVe, …): Default **`DE|AT|CH`**
- Offline-`BABY_DB` / `EU_FLAG_CATALOG` ohne Angabe: Default **`EU`** (CSV überschreibt mit echten Codes)
- `TEEN_DB` hat meist schon `countries` als String → wird zu Arrays geparst

Siehe auch `SEED_DEFAULT_COUNTRIES` / `DACH_MARKET_GROUP` in `js/catalog.js`.

## Live dm

Die Live-Suche bleibt der **Deutschland-Shop** (`dm.de`). Bei Land ≠ `DE` erscheint ein ehrlicher Badge:

> Shop: DE — Verfügbarkeit in IT ggf. anders

Der lokale CSV-Filter bleibt ehrlich; Live dm wird nicht versteckt, aber klar gekennzeichnet.

## Keine Therapie

Nur Einkauf & Layering-Hilfe — keine medizinischen Claims.


## Live-Suche

Siehe [eu-drogerien.md](./eu-drogerien.md). Chip folgt Profil-Land (z.B. IT = Live: dm Italia). DE-MCP nie als IT-Lager.
