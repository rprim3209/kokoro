# Matrix vs. Code — Abgleich

**Stand:** 2026-09-09 (Europe/Vienna)  
**Quellen Spec:** `konfliktmatrix.md` v0.2, `reiz-budget.md` v0.1, `arzt-thema-scan.md`, `inci-klassifikator.md`  
**Quelle Live:** `js/rules.js` (Laptop LAPTOP-GN96JC39, Desktop\Kosmetikschrank)  
**Kernfunktionen gelesen:** `evaluateCandidate`, `assessZumSchrank`, `assessNightReiz`, `assessDayReiz`, `reizWeightForProduct`, `isRetinoidProduct`, `isBpoProduct`, `assessZuDir`, `calculatePrognosis`

---

## 1. Kurz-Intro

**Prim-Fall = Testfall**, nicht die Produkt-Engine.  
Clienzo AM + Adapalen PM (+ Retinol-Redundanz) ist der Demo-Schrank, an dem die Regeln sichtbar werden.

**Ziel = Klassen-Engine:** Jedes Produkt mit `klassen[]` / Tags soll dieselben Regeln triggern — unabhängig von festen IDs wie `adap`, `clienzo`, `retinol`.

**Ist-Zustand ehrlich:** Die Demo hat schon eine **Hybrid-Engine** — viele Pfade lesen `p.klassen`, aber Prim-IDs sind parallel fest verdrahtet (Fallback + Prognose + Copy). Das ist **kein** reiner Klassen-Engine.

Status-Legende:

| Status | Bedeutung |
|---|---|
| **ALLGEMEIN** | Regel läuft über `klassen` / Tags / `kat` — gilt für beliebige Katalogprodukte mit Flags |
| **HARDCODE** | Regel / Erkennung hängt an Produkt-IDs (`adap`, `clienzo`, `retinol`) oder Prim-Copy |
| **TEILWEISE** | Klassen-Pfad vorhanden, aber ID-Sonderfälle oder nur eine Seite der Regel |
| **FEHLT** | In Spec vorhanden, in `rules.js` kein Code / kein Code-Return |

---

## 2. Tabelle: Matrix-Codes & Regelfamilien

### 2.1 Outcome-Codes (Konfliktmatrix §1)

| Code / Familie | Spec | Status | Evidenz (Funktion / Erkennung) |
|---|---|---|---|
| `ok` / passt | Default ohne Konflikt | **ALLGEMEIN** | `assessZumSchrank` / `assessNightReiz` / `assessDayReiz` → `makeDim("passt", …, "ok")`; `evaluateCandidate` + `worstWins` |
| `alternate_days` | Retinoid × AHA/BHA, getrennte Tage | **ALLGEMEIN** (Kandidat) / **TEILWEISE** (Slot) | `assessZumSchrank`: `isAcidProduct(candidate) && hasRxRetinoid` → Code `alternate_days`. Slot: `assessSlot` prüft `currentPM.indexOf("adap")` → **HARDCODE** nur Adapalen-ID |
| `split` | z. B. Vit C ↔ BPO / Säuren; Tretinoin↔BPO zeitlich | **FEHLT** | Kein `code: "split"` in `rules.js`. Tageslast nutzt `day_skip_stack` / `day_load`, nicht Matrix-`split` |
| `skip_stack` | Zwei starke Reizstoffe gleiche Schicht | **TEILWEISE** | `assessNightReiz`: Ret+Säure, Ret+BPO, Gewicht≥Schwelle → `skip_stack`. Klassen + ID-Zwang für adap/clienzo/retinol. AHA×BHA nur indirekt über Gewicht, nicht explizit |
| `inactivate` | BPO×Tretinoin; BPO×L-Ascorbic | **FEHLT** | Kommentar in `assessNightReiz`: Adapalen×BPO **nie** inactivate — korrekt. Aber **kein** Pfad liefert jemals `inactivate` (auch nicht für Tretinoin/Ascorbic) |
| `same_class` | Gleiche Wirkstoffklasse doppelt | **TEILWEISE** | Scan: `assessZumSchrank` nur `retinoid_cos`-Kandidat vs. Schrank-Retinoid (klassenfähig). Prognose: `hasAdap && hasRetinol` → **HARDCODE** IDs. Kein `aha×aha`, kein allgemeines `retinoid_rx×retinoid_rx` |
| `resistance` | `ab_top` ohne `bpo` im Schrank | **FEHLT** | Nicht implementiert. `isBpoProduct` zählt sogar `ab_top` **als** BPO — würde Resistenz-Logik verdrehen |
| `not_cosmetic` | BPO/HQ als Kosmetik-Kandidat | **FEHLT** | Kein Code `not_cosmetic`. Rx wird über `candidate.rx` / `schiene` nur bei Upsell-Filter berührt |
| `begleit_barrier` | Barrierestress / Duft neben Rx | **ALLGEMEIN** | `assessZuDir`: Parfüm + Tag `begleitpflege` → `begleit_barrier`; `barrier_stress`-Klasse → Soft-Warnung. `assessZumSchrank`: `ff === false` + Rx/BPO/Tag → `begleit_barrier` |
| `uv` | Lichtempfindlichkeit → LSF | **TEILWEISE** | `calculatePrognosis`: fehlt SPF bei Actives → `eher_nicht`, aber **ohne** Code `uv`. Kein Scan-Code `uv` |
| `bleach` | BPO bleicht Textilien | **FEHLT** | Nirgends in `rules.js` |
| `day_skip_stack` / `day_load` | Reiz-Budget Tag (Spec `reiz-budget`) | **TEILWEISE** | `assessDayReiz`: AM-BPO + PM-Retinoid → `day_skip_stack`; AM+PM heavy → `day_load`. Klassenfähig via Helper, Copy nennt fest „Clienzo…Adapalen“ (**HARDCODE**-Text) |
| `arzt_upsell` | Arzt-Thema: kein Serum-Upsell | **ALLGEMEIN** | `assessZuDir` + `isCosmeticActiveUpsell` (klassen/`kat`/`schiene`); `filterAltsForArztThema`. Spec `arzt-thema-scan.md` weitgehend verdrahtet |
| `noch_nicht` | Leerer Schrank | **ALLGEMEIN** | `assessZumSchrank` + `isCabinetEmptyForLayering` |

### 2.2 Paarregeln Konfliktmatrix §3 (Nummeriert)

| # | Regel Spec | Status | Evidenz |
|---|---|---|---|
| 1 | `bpo` × Kosmetik Leave-on → `not_cosmetic` | **FEHLT** | — |
| 2 | `hq_banned` → `not_cosmetic` | **FEHLT** | — |
| 3 | `bpo` × Tretinoin → `inactivate`+`split` | **FEHLT** | Nur generisches Ret+BPO → `skip_stack` (Reiz), kein Tretinoin-Sonderfall |
| 4 | BPO-Tube × Adapalen-Tube → `skip_stack` | **TEILWEISE** | `assessNightReiz` Ret+BPO → `skip_stack` (klassen + ID). Tageslast: `assessDayReiz` AM-BPO+PM-Ret. Prognose PM: `clienzo`+`adap` **HARDCODE** |
| 5 | `ab_top` ohne BPO → `resistance` | **FEHLT** | — |
| 6–7 | Retinoid × AHA / BHA → `alternate_days` | **ALLGEMEIN** | Nacht oft schon `skip_stack` (strenger als Spec `alternate_days`); Scan-Fallback `alternate_days` in `assessZumSchrank` |
| 8–9 | `retinoid_rx` × `retinoid_cos` / × `retinoid_rx` → `same_class` | **TEILWEISE** | Scan: cos-Kandidat vs. Rx-Schrank ok (klassen). Rx×Rx und Prognose adap+retinol: ID-lastig |
| 10 | AHA × BHA → `skip_stack` | **TEILWEISE** | Kein explizites `hasAHA && hasBHA`; nur Gewichtsschwelle in `assessNightReiz` (`weight >= threshold`) |
| 11 | AHA × AHA → `same_class` | **FEHLT** | — |
| 12 | Ascorbic × BPO → `inactivate`+`split` | **FEHLT** | `ascorbic` nur in `reizWeightForProduct` (Gewicht 1), keine Paarregel |
| 13 | Ascorbic × AHA/BHA → `split` | **FEHLT** | — |
| 14 | Niacinamid × Retinoid → `ok` | **ALLGEMEIN** (implizit) | Kein Alarm = ok; kein eigener Positiv-Code nötig |
| 15 | Niacinamid × Ascorbic → `ok` | **ALLGEMEIN** (implizit) | wie oben |
| 16 | Azelaic × Retinoid → `ok`/`split` | **TEILWEISE** | Kein Alarm (implizit ok); optionales Soft-`eher_nicht` bei barrier laut Spec **fehlt** |
| 17 | `barrier_stress` × Rx/BPO → `begleit_barrier` | **ALLGEMEIN** | `assessZuDir` auf Klasse `barrier_stress` + Tags; Duft-Pfad `begleit_barrier` |
| 18 | Retinoid/Säuren → `uv` | **TEILWEISE** | Nur Prognose SPF-Hinweis, kein Matrix-Code |
| 19 | BPO → `bleach` | **FEHLT** | — |

### 2.3 Reiz-Budget & INCI-Hilfen

| Familie | Spec | Status | Evidenz |
|---|---|---|---|
| Slot-Gewichte Ret/AHA/BHA/BPO = 2 | `reiz-budget` | **ALLGEMEIN** + **HARDCODE**-Extras | `reizWeightForProduct`: heavy/mid aus `klassen`; extra `p.id === "adap"` / `"clienzo"` |
| Nacht-Schwelle ≥3–4 | `reiz-budget` | **ALLGEMEIN** | `assessNightReiz`: `threshold = sharp ? 3 : 4` via Tags begleitpflege/barrier/sensibel |
| Tag AM-schwer + PM-schwer | `reiz-budget` | **ALLGEMEIN** | `assessDayReiz` `amHeavy && pmHeavy` → `day_load` |
| Tag Clienzo-AM + Adapalen-PM | Prim-Beispiel | **TEILWEISE** | Logik klassenfähig (`isBpoProduct`/`isRetinoidProduct`); Copy + ID-Fallbacks Prim-spezifisch |
| `physical_scrub` × Retinoid | `reiz-budget` | **TEILWEISE** | In heavy-Gewichtsliste, **keine** eigene Stack-Regel |
| `alcohol_high` / Fragrance-Schärfung | `reiz-budget` / Constraints | **ALLGEMEIN** | Über `ff`, `barrier_stress`, Tags — nicht als eigene Gewichtspunkte addiert |
| INCI 1 %-Spur-Filter | Matrix §4 / Klassifikator | **FEHLT** | `inciHooksFromProduct` = **STUB** (`stub: true`); kein CosIng-Parser |
| Begleitpflege-Modus auto aus Rx im Schrank | Matrix §5 | **TEILWEISE** | Prognose-Hinweis wenn `hasAdap \|\| hasClienzo` (**HARDCODE**). Tags `begleitpflege` müssen gesetzt sein für scharfe Schwellen — kein Auto-Tag aus beliebiger `retinoid_rx`-Klasse |

### 2.4 ID-Hardcodes (Inventar)

| Stelle | IDs | Wirkung |
|---|---|---|
| `reizWeightForProduct` | `adap`, `clienzo` | Mindestgewicht 2 auch ohne vollständige Klassen |
| `isRetinoidProduct` | `adap`, `retinol` | true vor Klassen-Check |
| `isBpoProduct` | `clienzo` | true vor Klassen-Check; `ab_top` zählt fälschlich mit als „BPO“ |
| `assessNightReiz` | `adap`, `clienzo`, `retinol` | Klassen-Map erzwingen + `ids.indexOf(...)` |
| `assessZumSchrank` | `adap`, `clienzo` | `hasRxRetinoid` / `hasBPO` zuerst per ID |
| `assessSlot` | `adap` | Alternate nur wenn Adapalen in PM |
| `calculatePrognosis` | `adap`, `clienzo`, `retinol` | same_class, PM-Konflikt, Begleitpflege-Hinweis |
| Copy `assessDayReiz` | Text „Clienzo…Adapalen“ | Nutzertext nicht generisch |

---

## 3. Was schon für **beliebige** Produkte mit `klassen` funktioniert

Nicht nur Prim-Schrank — sobald Katalogeinträge `klassen` (und ggf. `ff`/`kat`/`schiene`/`rx`) tragen:

1. **Nacht `skip_stack`:** Retinoid-Klasse + AHA/BHA-Klasse in derselben PM-Liste (`assessNightReiz`).
2. **Nacht `skip_stack`:** Retinoid-Klasse + BPO-Klasse (Reiz, nicht Chemie-Zerstörung).
3. **Nacht-Reizbudget:** Summe `reizWeightForProduct` ≥ 3 (bei begleitpflege/barrier/sensibel) bzw. ≥ 4.
4. **Tag `day_skip_stack`:** AM mit BPO-Klasse + PM mit Retinoid-Klasse (`assessDayReiz`) — Outcome eher_nicht, bei begleitpflege+barrier/sensibel → konflikt.
5. **Tag `day_load`:** AM und PM beide Gewicht ≥ 2.
6. **`same_class` (Scan):** Kandidat mit `retinoid_cos`, Schrank hat Retinoid (über Klasse oder Helper).
7. **`alternate_days` (Scan):** Kandidat AHA/BHA, Schrank hat Retinoid.
8. **`begleit_barrier` / Barrierestress:** Parfüm (`ff === false`) oder Klasse `barrier_stress` + passende Tags.
9. **Arzt-Thema:** `isCosmeticActiveUpsell` blockiert Serum/Active-Upsell klassen-/kat-basiert; Basis bleibt scannbar.
10. **Leerer Schrank:** `Zum Schrank = noch nicht`, Zu-dir/Slot weiter — profilagnostisch.
11. **Worst-wins** über Zu dir / Zum Schrank / Slot in `evaluateCandidate`.

**Grenzen:** Ohne `klassen` am Produkt greifen nur die Prim-ID-Fallbacks (`adap`/`clienzo`/`retinol`). Neue Rx-Retinoide ohne ID-Sonderfall und ohne `klassen` bleiben unsichtbar. INCI-Rohtext allein tut **nichts** (Parser-Stub).

---

## 4. Prioritäten: Top-5 Refactors Richtung Klassen-Engine

1. **ID-Fallbacks entfernen / nur Bootstrap:** `isRetinoidProduct` / `isBpoProduct` / `reizWeightForProduct` / `assessNightReiz` nur noch über `klassen` (und `rx`/`schiene`). Prim-Produkte müssen korrekte `klassen` im Katalog haben — dann stirbt Hardcode.
2. **`same_class` generisch:** Mengen-Schnitt der Active-Klassen (retinoid_*, aha, bha, …) Kandidat↔Schrank; Prognose nicht mehr `hasAdap && hasRetinol`.
3. **Paarregeln nach Matrix-Prio verdrahten:** fehlende Codes `inactivate`, `split`, `resistance`, `not_cosmetic` als klassenbasierte Tabelle (nicht Copy-Paste Prim). Adapalen×BPO weiter **kein** inactivate.
4. **`isBpoProduct` korrigieren:** `ab_top` ≠ BPO; separat `hasClass(bpo)` und Resistenz-Regel `ab_top && !bpo`.
5. **Tages-/Nacht-Copy & Slot generisch:** „Clienzo/Adapalen“-Strings → Stoffklassen-Namen; `assessSlot` Alternate an Retinoid-Klasse statt `indexOf("adap")`. Bonus: Auto-`begleitpflege` wenn Schrank `retinoid_rx`/`bpo`/`schiene:arzneimittel` enthält.

---

## 5. Fazit (eine Zeile)

Die Live-Engine ist eine **brauchbare Hybrid**: Klassen-Reizbudget und einige Paare gelten schon schrankweit — aber Prognose, Slot und mehrere Matrix-Codes sind noch **Prim-ID-Demo**, und `inactivate` / `split` / `resistance` / `not_cosmetic` / `bleach` / INCI-Spur **fehlen**. Prim testet die Richtung; die Klassen-Engine ist noch nicht fertig.
