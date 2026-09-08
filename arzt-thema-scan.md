# Arzt-Thema Scan — Spec (Demo)

**Stand:** 2026-09-08 (Europe/Vienna)  
**App:** Prim's Kosmetikschrank  
**Zweck:** Scan- und Vorschlagsverhalten bei Tag `arzt-thema` (Anzeige: **Arzt-Thema**).  
**Verwandt:** `constraints-v1.md` §4.5, `editorial.md`, `arzt-schiene.md`, `scan-ohne-schrank.md` §7, `verdict-glossar.md`.

---

## 1. Wann gilt der Tag?

| Quelle | Wie |
|---|---|
| Quiz | Unreinheiten-Option **Unterlagerungen** (tiefe, harte, schmerzende Knoten) → Score `arzt-thema` ≥ 1 → Anzeige-Tag **Arzt-Thema** |
| Alias | `zystisch` / zystisch-nodulär = inhaltlich **dasselbe** wie `arzt-thema` (kein eigener Quiz-Chip nötig) |
| Profil | `appState.tags` und/oder Profil-`tags` enthalten `arzt-thema` oder Display **Arzt-Thema** |
| Nicht | Aus leerem Schrank raten; nicht aus „Akne-prone“ allein ableiten |

Kurz: Quiz erkennt das Thema. Die App diagnostiziert nicht.

---

## 2. Was der Scan darf

Bei `arzt-thema` ist Scan **weiter erlaubt** für Basis / Support:

| Kategorie | Scan | Typisches Verdict (Zu dir) |
|---|---|---|
| Reiniger (`cleanser` / `reiniger`) | ja | **passt** möglich (Duft etc. kann **eher nicht**) |
| Creme | ja | **passt** möglich |
| SPF | ja | **passt** möglich |
| Support (z. B. Hyaluron, Panthenol, milde Feuchte) | ja | **passt** möglich |

Layering gegen den Schrank gilt weiter, sobald Produkte drin liegen (Adapalen/Clienzo-Logik unverändert).

---

## 3. Was verboten ist

| Verboten | Warum |
|---|---|
| Active-Upsell-Alternativenlisten (Serum / „stärkere“ Actives) | Produktregel + Editorial |
| „Stärkere“ Actives als Shop-Vorschlag | Kein Serum-Upgrade bei Arzt-Thema |
| Prescribe-Sprache („lass dir X verschreiben“, Iso, Spironolacton, Schema) | `arzt-schiene.md`, `editorial.md` |
| Therapie-/Leitlinien-Protokolle | Non-Goal der App |

Erlaubt bleibt: milde Support-/Reiniger-/SPF-Hinweise (kein Active-Karussell).

---

## 4. Rx nur erkennen (Arzt-Schiene)

- Arzneimittel (z. B. Adapalen, Clienzo/BPO-Kombi) **erkennen** und gegen Kosmetik-Actives im Schrank prüfen.
- **Nicht** verkaufen, **nicht** bewerben, **kein** Rezept-Button.
- INN/Stoffklasse, nicht Shop-Marke (außer Nutzerin hat Packshot selbst gescannt).
- Bestehende Adapalen-/Clienzo-Konfliktregeln bleiben.

---

## 5. Verdict-Copy (kanonisch laut `verdict-glossar.md`)

Ampel: **passt** | **eher nicht** | **Konflikt** (Worst wins über Zu dir / Zum Schrank / Slot).

### Templates bei `arzt-thema`

| Situation | Outcome | 1-Blick-Copy |
|---|---|---|
| Basis: Reiniger / Creme / SPF / Support, kein harter Missmatch | **passt** | `passt – Basispflege ok bei Arzt-Thema.` |
| Basis mit weichem Missmatch (z. B. Duft) | **eher nicht** | `eher nicht – {Grund}; Arzt-Thema: lieber milde Begleitpflege.` |
| Gescannter kosmetischer Active / Serum-Upsell-Pfad | **Konflikt** (oder **eher nicht**, wenn nur weicher Hinweis ohne Shop-Upsell) | `Konflikt – Das ist ein Arzt-Thema, kein Serum-Upgrade.` |
| Active-Alternativen-Tap | — | **kein** Active-Karussell; optional nur Support/Reiniger/SPF |
| Leerer Schrank + Tag | Hinweis | `Arzt-Thema erkannt – kein Serum-Upgrade. Basispflege scannen ok.` |

Pflicht-Disclaimer unter jedem Scan-Verdict:

> **Keine medizinische Therapie – reines Einkaufs- & Layering-Erkennungstool.**

Zusatz bei Tag: Erkennung ≠ Diagnose; kein Active-Upsell.

---

## 6. Abgleich mit bestehenden Specs

| Spec | Alignment |
|---|---|
| `constraints-v1.md` §4.5 | Kein Active-Upsell = Konflikt gegen Upsell-Pfad; Basis-Scan ok; nie Iso/Prescribe |
| `editorial.md` | Vergleichen/erkennen ja; Therapie, Heilversprechen, Rx-Werbung nein |
| `arzt-schiene.md` | Verdict-Zeile „Arzt-Thema, kein Serum-Upgrade“; Rx drin, aber nicht verkauft |
| `scan-ohne-schrank.md` §7 | Tag aus Quiz; Active-Upsell aus; Basis passt möglich; Disclaimer |
| `verdict-glossar.md` | `arzt-thema` + Active-Upsell → **Konflikt**; Basis → **passt** möglich; Disclaimer §8 |

---

## 7. Demo-Implementierung (Kurz)

1. Helper `hasArztThema()` liest Tags (`arzt-thema` / **Arzt-Thema** / Alias zystisch).
2. Bei Tag: Active-Upsell-Listen unterdrücken; Support/Reiniger/SPF dürfen bleiben.
3. Starker kosmetischer Active-Scan → **Konflikt** / **eher nicht** + Arzt-Thema-Copy.
4. Adapalen/Clienzo-Regeln nicht anfassen außer Upsell-Filter.
5. Disclaimer immer sichtbar.

---

*Ende arzt-thema-scan.md – Erkennung, kein Therapy-Protokoll.*
