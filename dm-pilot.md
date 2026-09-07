# dm-Pilot (einfach erklärt)

**Stand:** 2026-09-04

## Was ist das?

Ein **erster Test**: Produktdaten von **dm** holen. dm hat eine offizielle Produktsuche für Programme.

## Ergebnis

Datei: [`dm-pilot-produkte.csv`](./dm-pilot-produkte.csv) (ohne Kleidung/Textil-Müll aus Baby-Suche)

| | Zahl |
|---|---:|
| Produkte im Pilot (bereinigt) | **187** |
| Davon laut dm parfümfrei | **114** |
| Schon in unserer Haupttabelle (EAN) | **2** |
| Neu in Haupttabelle übernommen (mit Flag) | **115** |

## Was dm gut liefert

- Name, Marke, Preis, Link
- Barcode (**EAN**) und dm-Nummer (**DAN**)
- Flag **parfümfrei**

## Was noch fehlt

- **Nicht komedogen** liefert die Suche nicht → bleibt erst `no`
- **Cruelty-free** kommt so nicht → später mit `cfi-marken.csv` verknüpfen
- Pro Suche nur ca. 15 Treffer → **Pilot**, nicht der ganze Shop

## Rossmann

Kein offener Produktkatalog für Apps. Deshalb nur **dm**.

## Haupttabelle

[`katalog-produkte.csv`](./katalog-produkte.csv) · Erklärung: [`katalog-schema.md`](./katalog-schema.md)
