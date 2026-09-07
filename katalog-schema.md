# Produkt-Tabelle (einfach erklärt)

**Stand:** 2026-09-04

Alle Kategorien (Erwachsen, Baby/Kind, Jugend) stecken jetzt in **einer** Tabelle:  
[`katalog-produkte.csv`](./katalog-produkte.csv)

Die alten Dateien (`eu-flag-katalog-gesicht.csv`, `eu-baby-kind-katalog.csv`, `eu-jugend-katalog.csv`) bleiben als Rohquellen. Neu arbeiten wir mit der gemeinsamen Tabelle.

---

## Was ist eine Zeile?

**Ein Produkt** (eine Tube/Flasche), so gut wir es kennen.

## Spalten (was bedeutet was?)

| Spalte | Einfach gesagt |
|---|---|
| `ean` | Strichcode / Barcode. Leer = wir haben nur Name/Marke (noch keine Nummer). |
| `name` | Produktname |
| `brand` | Marke |
| `katalog` | Welche Liste? `erwachsen_gesicht` · `baby_kind` · `jugend` |
| `age_band` | Altersband (z. B. `baby_0_36m`, `tween_teen`, `erwachsen`) |
| `slot` | Wohin in der Routine? z. B. Reiniger, Creme, SPF, Windel, Akne… |
| `eu_countries` | In welchen Ländern (laut Quelle) gesehen |
| `flag_fragrance_free` | `yes`/`no` — parfümfrei? |
| `flag_nc` | `yes`/`no` — Hersteller sagt „nicht komedogen“? (Marketing, keine Garantie) |
| `flag_cf` | `yes`/`no` — cruelty-free (z. B. CFI)? |
| `flag_under3_intended` | `yes`/`no` — für unter 3 Jahre gedacht? (vor allem Baby) |
| `fragrance_basis` / `nc_basis` / `cf_basis` / `under3_basis` | **Woher** wissen wir das? (OBF, Markenseite, CFI, Name…) |
| `not_for_minors` | `yes` = eher nicht für unter 18 vorschlagen (z. B. Anti-Aging-Retinol) |
| `spf_note` | Hinweis Sonnencreme (z. B. unter 6 Monaten) |
| `source_url` | Link zur Quelle |
| `checked_at` | Wann geprüft (Datum) |
| `notes` | Sonstiges |
| `source_file` | Aus welcher alten Liste die Zeile kam |

## Regeln

1. Mindestens **ein** Flag `yes` (parfümfrei **oder** NC **oder** CF **oder** under-3) — sonst gehört es eher nur in die Scan-Ebene, nicht in Vorschläge.
2. Keine erfundenen EANs.
3. Arzneimittel (z. B. Adapalen Rx, Clienzo) **nicht** als Kaufvorschlag.
4. Vor Launch Claims/Siegel nochmal prüfen (`checked_at`).

## Zählungen jetzt

Siehe unten / Script-Ausgabe beim Erzeugen.

## Nächster Schritt

Shop-Daten (dm / Rossmann) anschließen → mehr EANs, dann Flags nachziehen.

### Aktuelle Zahlen

- Zeilen gesamt: **870**
- Mit EAN: **837**
- Parfümfrei: **157** · NC: **85** · CF: **99** · under-3: **606**
- `baby_kind`: **606**
- `erwachsen_gesicht`: **168**
- `jugend`: **96**
