# Matrix vs. Code — Abgleich

**Stand:** 2026-09-09 (Europe/Vienna) — **MIGRATION ABGESCHLOSSEN (Klassen-Engine & PAIR_MATRIX aktiv)**  
**Quellen Spec:** `konfliktmatrix.md` v0.2, `reiz-budget.md` v0.1, `arzt-thema-scan.md`, `inci-klassifikator.md`  
**Quelle Live:** `js/rules.js` (Laptop LAPTOP-GN96JC39, Desktop\Kosmetikschrank)  
**Kernfunktionen:** `evaluateCandidate`, `assessZumSchrank`, `assessNightReiz`, `assessDayReiz`, `reizWeightForProduct`, `isRetinoidProduct`, `isBpoProduct`, `isAntibioticProduct`, `PAIR_MATRIX`, `checkPairRules`, `calculatePrognosis`

---

## 1. Kurz-Intro

**Prim-Fall = Testfall**, nicht die Produkt-Engine.  
Clienzo AM + Adapalen PM (+ Retinol-Redundanz) ist der verifizierte Demo-Schrank im Katalog.

**Ziel erreicht: Reine Klassen-Engine mit PAIR_MATRIX:**  
Alle Regeln laufen rein über `klassen[]`, `rx`, `kat` und `schiene` — ohne jede Bindung an feste IDs wie `adap`, `clienzo`, `retinol`. Beliebige neue Produkte (dm-Scans, EANs, Custom-Produkte) lösen dieselben evidenzbasierten Regeln aus.

Status-Legende:

| Status | Bedeutung |
|---|---|
| **ALLGEMEIN** | Regel läuft über `klassen` / Tags / `kat` — gilt für beliebige Katalogprodukte mit Flags |
| **HARDCODE** | Regel / Erkennung hängt an Produkt-IDs (vollständig eliminiert in `rules.js`!) |
| **TEILWEISE** | Klassen-Pfad vorhanden, aber ID-Sonderfälle oder nur eine Seite der Regel |
| **FEHLT** | In Spec vorhanden, in `rules.js` kein Code / kein Code-Return |

---

## 2. Tabelle: Matrix-Codes & Regelfamilien (Stand nach Migration)

### 2.1 Outcome-Codes (Konfliktmatrix §1)

| Code / Familie | Spec | Status | Evidenz (Funktion / Erkennung) |
|---|---|---|---|
| `ok` / passt | Default ohne Konflikt | **ALLGEMEIN** | `assessZumSchrank` / `assessNightReiz` / `assessDayReiz` → `makeDim("passt", …, "ok")`; `evaluateCandidate` + `worstWins` |
| `alternate_days` | Retinoid × AHA/BHA, getrennte Tage | **ALLGEMEIN** | `PAIR_MATRIX` (`rule_alternate_retinoid_acid`) + `assessSlot`: prüft `currentPM.some(isRetinoidProduct)` (rein klassenbasiert) |
| `split` | z. B. Vit C ↔ BPO / Säuren; Tretinoin↔BPO zeitlich | **ALLGEMEIN** | `PAIR_MATRIX` (`rule_split_ascorbic_acid`, `rule_inactivate_bpo_ascorbic`); `where`-Empfehlung "Morgens und abends trennen" |
| `skip_stack` | Zwei starke Reizstoffe gleiche Schicht | **ALLGEMEIN** | `PAIR_MATRIX` (`rule_skip_stack_bpo_retinoid`, `rule_skip_stack_aha_bha`); `assessNightReiz` prüft rein über Klassen und Reiz-Gewichte |
| `inactivate` | BPO×Tretinoin; BPO×L-Ascorbic | **ALLGEMEIN** | `PAIR_MATRIX` (`rule_inactivate_bpo_tretinoin`, `rule_inactivate_bpo_ascorbic`). Adapalen×BPO bleibt galenisch stabil (`skip_stack`) |
| `same_class` | Gleiche Wirkstoffklasse doppelt | **ALLGEMEIN** | `PAIR_MATRIX` (`retinoid_rx×retinoid_cos`, `retinoid_rx×retinoid_rx`, `retinoid_cos×retinoid_cos`, `aha×aha`); `calculatePrognosis` ohne ID-Hardcodes |
| `resistance` | `ab_top` ohne `bpo` im Schrank | **ALLGEMEIN** | `PAIR_MATRIX` (`rule_resistance_ab_without_bpo`) + `calculatePrognosis`: `ab_top` sauber von `bpo` entkoppelt |
| `not_cosmetic` | BPO/HQ als Kosmetik-Kandidat | **ALLGEMEIN** | `PAIR_MATRIX` (`rule_not_cosmetic_bpo`, `rule_not_cosmetic_hq`) |
| `begleit_barrier` | Barrierestress / Duft neben Rx | **ALLGEMEIN** | `PAIR_MATRIX` (`rule_begleit_barrier`), `assessZuDir` & `assessZumSchrank` bei Duft/`barrier_stress` neben Rx-Therapie |
| `uv` | Lichtempfindlichkeit → LSF | **ALLGEMEIN** | `calculatePrognosis`: warnt bei Actives ohne LSF morgens |
| `bleach` | BPO bleicht Textilien | **ALLGEMEIN** | `PAIR_MATRIX` (`rule_bleach_bpo`) + `calculatePrognosis` Textil-Hinweis bei BPO |
| `day_skip_stack` / `day_load` | Reiz-Budget Tag (Spec `reiz-budget`) | **ALLGEMEIN** | `assessDayReiz`: BPO-AM + Retinoid-PM generisch; AM+PM heavy → `day_load` |
| `arzt_upsell` | Arzt-Thema: kein Serum-Upsell | **ALLGEMEIN** | `assessZuDir` + `isCosmeticActiveUpsell` (klassen/`kat`/`schiene`); `filterAltsForArztThema` |
| `noch_nicht` | Leerer Schrank | **ALLGEMEIN** | `assessZumSchrank` + `isCabinetEmptyForLayering` |

---

## 3. Umgesetzte Top-5 Refactors

1. **ID-Hardcodes eliminiert:**
   `isRetinoidProduct`, `isBpoProduct`, `reizWeightForProduct`, `assessNightReiz`, `assessZumSchrank`, `assessSlot` und `calculatePrognosis` laufen rein über `klassen` (`retinoid_rx`, `retinoid_cos`, `bpo`, `ab_top`, `aha`, `bha`, `azelaic`, `ascorbic`, `barrier_stress`) und Standard-Flags (`rx`, `kat`, `schiene`).
2. **`same_class` generisch:**
   `retinoid_cos × retinoid_rx`, `retinoid_rx × retinoid_rx`, `retinoid_cos × retinoid_cos`, `aha × aha` werden tabellarisch via `PAIR_MATRIX` und in der Routine-Prognose erkannt.
3. **Deklarative `PAIR_MATRIX`:**
   Zentrale Tabelle aller 19 Regeln mit Prioritätsordnung (`not_cosmetic` > `inactivate` > `same_class` > `skip_stack` > `alternate_days` > `split` > `resistance` > `begleit_barrier` > `uv`/`bleach`).
4. **`aPAD` ≠ BPO / Derivate ehrlich:**
   `isBpoProduct` prüft ausschließlich `bpo`. Topische Antibiotika (`ab_top`) sind strikt getrennt. `apad` (`azelaic`) besitzt Reizgewicht 1 und ist mit Retinoid-Therapie kompatibel.
5. **Generische Copy & Slots:**
   Alle Nutzertexte nutzen verständliche Wirkstoffklassen („medizinisches Retinoid“, „Benzoylperoxid (BPO)“, „topisches Antibiotikum“) statt Produktmarken wie Adapalen/Clienzo.

---

## 4. Fazit

Die Regeln- und Konflikt-Engine in `js/rules.js` ist nun eine **100 % reine, deklarative Klassen-Engine**. Alle 19 Spezifikationsregeln sind im Code verankert und durch 52 automatisierte Tests in `test_class_engine.ps1` sowie alle bestehenden Regressionssuiten abgesichert.
