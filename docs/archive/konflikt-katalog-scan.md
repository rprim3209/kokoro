# Konflikt-Scan: Katalog-Produkte

**Stand:** 2026-09-09 (Europe/Vienna)  
**Quellen:** `js/rules.js` (PAIR_MATRIX + assessNightReiz), `js/catalog.js` (`applyKatalogRows`), `katalog-produkte.csv`, `konfliktmatrix.md`  
**Scope:** Nur Verdict **Konflikt** (rot) zwischen Produkten — keine Soft-Warnungen „eher nicht“, keine Therapie-Claims.

---

## Kurzfassung (einfach)

Die CSV-Datei hat **985 Produkte** (Erwachsen Gesicht: 252, Baby/Kind: 637, Jugend: 96).

**Wichtig:** Beim Einlesen der CSV setzt die App bei Erwachsenen-Produkten `klassen: []` (leere Liste). Baby- und Jugend-Produkte bekommen in `BABY_DB`/`TEEN_DB` gar kein `klassen`-Feld. Die Konflikt-Engine prüft aber genau diese Klassen (`productHasClass` → `retinoid_rx`, `bpo`, `aha`, …).

**Ergebnis für die CSV allein:** **985 / 985 Produkte ohne Klassen-Daten** → **0 produkt-produkt Konflikte** aus der CSV, weil die Engine nichts zu prüfen hat.

Konflikte gibt es nur zwischen den **fest eingebauten Demo-/Seed-Produkten** in `catalog.js` (Adapalen, Clienzo, Epiduo, Retinol, Glykolsäure, BHA, …). Die Name-Heuristik aus dem dm-Live-Pfad wird **nicht** auf `katalog-produkte.csv` angewendet.

---

## a) Welche Klassen-Paare ergeben „Konflikt“?

Aus `PAIR_MATRIX` + Nacht-Stack (`assessNightReiz`), **nur outcome = konflikt**:

| Klassen-Paar | Code | Warum (Layering/Einkauf) |
|---|---|---|
| `bpo` × Tretinoin (`retinoid_rx` + Name) | `inactivate` | BPO oxidiert klassisches Tretinoin |
| `bpo` × `ascorbic` | `inactivate` | BPO oxidiert reine L-Ascorbinsäure |
| `retinoid_rx` × `retinoid_cos` | `same_class` | Gleiche Wirkstoffklasse doppelt |
| `retinoid_rx` × `retinoid_rx` | `same_class` | Zwei medizinische Retinoide |
| `retinoid_cos` × `retinoid_cos` | `same_class` | Zwei kosmetische Retinoide |
| `aha` × `aha` | `same_class` | Zwei AHA-Peelings |
| `retinoid_*` × `aha`/`bha` (gleicher Abend) | `skip_stack` | Zwei starke Reizstoffe am Abend |
| `retinoid_*` × `bpo` (gleicher Abend) | `skip_stack` | Reiz-Stack (nicht Chemie-Zerstörung bei Adapalen) |
| `aha` × `bha` (gleicher Abend) | `skip_stack` | Zwei starke Säuren am Abend |

**Nicht Konflikt (nur „eher nicht“ / Hinweis — hier nicht gezählt):**
`alternate_days` (Retinoid×Säure tagsüber soft), `split` (Vit C×Säure), `resistance` (Antibiotikum ohne BPO), `begleit_barrier`, `bleach`, `uv`.

**Hinweis Scan-Pfad:** In `checkPairRules(..., {slot:null})` feuern die PAIR_MATRIX-`skip_stack`-Regeln mit `ctx.slot === "pm"` nicht. Der rote Stack kommt dann über `assessNightReiz` (hypothetische Abend-Schicht) — das Script zählt diese Fälle mit.

---

## b) Wie viele Katalog-Produkte haben konflikt-relevante Klassen?

### b1) `katalog-produkte.csv` wie die App sie lädt (`applyKatalogRows`)

| Klasse | Anzahl | Beispiele |
|---|---:|---|
| *(leer / keine Klasse)* | **985** | alle CSV-Zeilen |
| `retinoid_rx` | 0 | — |
| `retinoid_cos` | 0 | — |
| `retinoid_rx_tretinoin` | 0 | — |
| `bpo` | 0 | — |
| `aha` | 0 | — |
| `bha` | 0 | — |
| `ascorbic` | 0 | — |
| `azelaic` | 0 | — |
| `ab_top` | 0 | — |
| `barrier_stress` | 0 | — |
| `hq_banned` | 0 | — |
| `niacinamide` | 0 | — |
| `physical_scrub` | 0 | — |

### b2) Seed-Produkte in `catalog.js` (hardcodiert, mit Klassen)

| Klasse | Anzahl | Beispiele |
|---|---:|---|
| `retinoid_rx` | **2** | Arzneimittel (Rx) — Adapalen Gel (0.1%); Arzneimittel (Rx) — Epiduo 0.1% / 2.5% Gel |
| `retinoid_cos` | **1** | The Ordinary — Retinol 0.2% in Squalane |
| `bpo` | **2** | Arzneimittel (Rx) — Clienzo Gel (Clindamycin + BPO); Arzneimittel (Rx) — Epiduo 0.1% / 2.5% Gel |
| `ab_top` | **1** | Arzneimittel (Rx) — Clienzo Gel (Clindamycin + BPO) |
| `aha` | **1** | The Ordinary — Glycolic Acid 7% Toning Solution |
| `bha` | **1** | Paula's Choice — Skin Perfecting 2% BHA Liquid |
| `azelaic` | **3** | Arzneimittel (Rx) — Skinoren 15% / 20% Gel; The Ordinary — Azelaic Acid Suspension 10%; Geek & Gorgeous — aPAD 20% Azelaic Derivat |
| `ascorbic` | **0** | — |
| `niacinamide` | **2** | The Ordinary — Niacinamide 10% + Zinc 1%; Geek & Gorgeous — B-Bomb 10% Niacinamide Serum |
| `barrier_stress` | **1** | Clean Beauty Co. — Glow Miracle Zitrus Peeling-Öl |

Seed-Produkte mit konflikt-relevanten Klassen: **12** von 12 gelisteten Seeds.

---

## c) Konkrete Produkt-Paare mit Verdict „Konflikt“

### c1) Nur CSV (App-Pfad)

**0 Paare** — erwartbar 0, weil keine Klassen gesetzt sind.

### c2) Seed-Produkte (Demo-Katalog in `catalog.js`)

**13 Konflikt-Paare** zwischen Seed-Produkten, gruppiert nach Klassen-Paar:

#### bpo+ab_top × retinoid_rx  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Retinoid und BPO nicht in derselben Abend-Schicht stapeln (Reiz). Chemie Adapalen×BPO ist stabil — Problem ist Reiz, nicht Zerstörung.
- **Beispiele:**
  - Arzneimittel (Rx) — Adapalen Gel (0.1%)  **↔**  Arzneimittel (Rx) — Clienzo Gel (Clindamycin + BPO)

#### retinoid_rx × retinoid_rx+bpo  [same_class]
- **Code:** `same_class`
- **Anzahl Paare:** 1
- **Grund:** Zwei medizinische Retinoide nicht kombinieren — erhöht nur das Schälungs- und Reizrisiko.
- **Beispiele:**
  - Arzneimittel (Rx) — Adapalen Gel (0.1%)  **↔**  Arzneimittel (Rx) — Epiduo 0.1% / 2.5% Gel

#### aha × retinoid_rx  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Zwei starke Reizstoffe am selben Abend (Retinoid + Säure) — Barriererisiko.
- **Beispiele:**
  - Arzneimittel (Rx) — Adapalen Gel (0.1%)  **↔**  The Ordinary — Glycolic Acid 7% Toning Solution

#### bha × retinoid_rx  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Zwei starke Reizstoffe am selben Abend (Retinoid + Säure) — Barriererisiko.
- **Beispiele:**
  - Arzneimittel (Rx) — Adapalen Gel (0.1%)  **↔**  Paula's Choice — Skin Perfecting 2% BHA Liquid

#### retinoid_cos × retinoid_rx  [same_class]
- **Code:** `same_class`
- **Anzahl Paare:** 1
- **Grund:** Gleiche Wirkstoffklasse (Retinoid) — kosmetisches Retinol neben medizinischem Retinoid bringt mehr Reiz ohne Zusatznutzen.
- **Beispiele:**
  - Arzneimittel (Rx) — Adapalen Gel (0.1%)  **↔**  The Ordinary — Retinol 0.2% in Squalane

#### bpo+ab_top × retinoid_rx+bpo  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Retinoid und BPO nicht in derselben Abend-Schicht stapeln (Reiz). Chemie Adapalen×BPO ist stabil — Problem ist Reiz, nicht Zerstörung.
- **Beispiele:**
  - Arzneimittel (Rx) — Clienzo Gel (Clindamycin + BPO)  **↔**  Arzneimittel (Rx) — Epiduo 0.1% / 2.5% Gel

#### bpo+ab_top × retinoid_cos  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Retinoid und BPO nicht in derselben Abend-Schicht stapeln (Reiz). Chemie Adapalen×BPO ist stabil — Problem ist Reiz, nicht Zerstörung.
- **Beispiele:**
  - Arzneimittel (Rx) — Clienzo Gel (Clindamycin + BPO)  **↔**  The Ordinary — Retinol 0.2% in Squalane

#### aha × retinoid_rx+bpo  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Zwei starke Reizstoffe am selben Abend (Retinoid + Säure) — Barriererisiko.
- **Beispiele:**
  - Arzneimittel (Rx) — Epiduo 0.1% / 2.5% Gel  **↔**  The Ordinary — Glycolic Acid 7% Toning Solution

#### bha × retinoid_rx+bpo  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Zwei starke Reizstoffe am selben Abend (Retinoid + Säure) — Barriererisiko.
- **Beispiele:**
  - Arzneimittel (Rx) — Epiduo 0.1% / 2.5% Gel  **↔**  Paula's Choice — Skin Perfecting 2% BHA Liquid

#### retinoid_cos × retinoid_rx+bpo  [same_class]
- **Code:** `same_class`
- **Anzahl Paare:** 1
- **Grund:** Gleiche Wirkstoffklasse (Retinoid) — kosmetisches Retinol neben medizinischem Retinoid bringt mehr Reiz ohne Zusatznutzen.
- **Beispiele:**
  - Arzneimittel (Rx) — Epiduo 0.1% / 2.5% Gel  **↔**  The Ordinary — Retinol 0.2% in Squalane

#### aha × bha  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Zwei starke Säuren (AHA + BHA) am selben Abend überfordern die Barriere.
- **Beispiele:**
  - The Ordinary — Glycolic Acid 7% Toning Solution  **↔**  Paula's Choice — Skin Perfecting 2% BHA Liquid

#### aha × retinoid_cos  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Zwei starke Reizstoffe am selben Abend (Retinoid + Säure) — Barriererisiko.
- **Beispiele:**
  - The Ordinary — Glycolic Acid 7% Toning Solution  **↔**  The Ordinary — Retinol 0.2% in Squalane

#### bha × retinoid_cos  [skip_stack]
- **Code:** `skip_stack`
- **Anzahl Paare:** 1
- **Grund:** Zwei starke Reizstoffe am selben Abend (Retinoid + Säure) — Barriererisiko.
- **Beispiele:**
  - Paula's Choice — Skin Perfecting 2% BHA Liquid  **↔**  The Ordinary — Retinol 0.2% in Squalane


### c3) Seed + Erwachsen-CSV zusammen (wie Live-DB nach CSV-Load)

**13 Konflikt-Paare** — gleich wie Seed allein (13), weil CSV-Produkte keine Klassen haben und keine neuen Treffer erzeugen.

---

## d) Fehlende Klassen-Daten

**Ja — massiv:** 985/985 CSV-Produkte (100.0 %) haben keine Layering-Klassen. Die Konflikt-Engine kann sie **nicht** gegeneinander oder gegen Seed-Actives auf Stoffklassen-Ebene prüfen.

Was die App aktuell macht:

1. `applyKatalogRows` (CSV) → `klassen: []`, `schiene: "support"`
2. Name-/INCI-Klassifikation für CSV: **nicht verdrahtet** (INCI-Parser laut Spec Stub)
3. Name-Heuristik existiert nur für **dm-Live** / **dm-Pilot** (`normalizeDmProduct`)

### Zusatz (nicht App-CSV-Pfad): Name-Heuristik wie dm auf CSV-Namen

Wenn man die dm-Heuristik auf CSV-**Namen** anwendet (nur Analyse, nicht live):

| Heuristik-Klasse | Anzahl in CSV-Namen | Beispiele |
|---|---:|---|
| `bha` | 2 | Garnier — Garnier Salicylic Fresh & Matte Hydrating Sorbet Cream; Garnier Skin Active — Reinigungsschaum Salicylic Cleanser, 250 ml |
| `aha` | 1 | NØ cosmetics — Peeling Cleanser AHA / PHA, 125 ml |
| `retinoid` | 2 | The Inkey List — Starter retinol serum; The Inkey List — Starter retinol serum |
| `azelaic` | 0 | — |
| `ascorbic` | 0 | — |
| `niacinamide` | 0 | — |
| `uv` | 157 | (ohne Marke) — Garnier Ambre Solaire Kids Sensitive Expert+ SPF50+ Zonnemelk; (ohne Marke) — NAIF 100 ml BABY & KIND Mineralische Sonnencreme 50: HOHER SCHUTZ 0% PARFÜM; (ohne Marke) — Naïf BABY & KIND Mineralische Sonnencreme 50 HOHER SCHUTZ 0% PARFÜM |
| `humectant` | 8 | Eucerin — Eucerin DERMOPURE CLINICAL Klärendes Tonic; Garnier — Brightening serum; TandheM — Pro-Aging Essential Face Serum (30 ml) |
| `support` | 815 | (ohne Marke) — Aderma - Primalba Bébé Gel Lavant Douceur; (ohne Marke) — Baby dentifricio; (ohne Marke) — baby duschgel |

**Bug/Gap:** dm setzt `klassen: ["retinoid"]`, rules.js prüft aber `retinoid_cos` / `retinoid_rx`. Ohne Remap: **2** Heuristik-Konfliktpaare; mit Remap `retinoid`→`retinoid_cos`: **5** Paare.

Beispiele Heuristik-Paare (nach Remap, max. 15):
- **bha × retinoid_cos  [skip_stack]** — 2 Paare; z. B. The Inkey List — Starter retinol serum ↔ Garnier — Garnier Salicylic Fresh & Matte Hydrating Sorbet Cream
- **aha × bha  [skip_stack]** — 2 Paare; z. B. Garnier — Garnier Salicylic Fresh & Matte Hydrating Sorbet Cream ↔ NØ cosmetics — Peeling Cleanser AHA / PHA, 125 ml
- **aha × retinoid_cos  [skip_stack]** — 1 Paare; z. B. The Inkey List — Starter retinol serum ↔ NØ cosmetics — Peeling Cleanser AHA / PHA, 125 ml

---

## Schlüsselzahlen

| Kennzahl | Wert |
|---|---:|
| CSV-Produkte gesamt | 985 |
| davon ohne Klassen (App-Pfad) | 985 |
| Konflikt-Paare CSV allein | 0 |
| Seed-Produkte mit Konflikt-Klassen | 12 |
| Konflikt-Paare Seed | 13 |
| Konflikt-Paare Seed+CSV | 13 |
| Heuristik-Treffer Klassen (roh/mit Remap Paare) | 2 / 5 |

---

*Disclaimer: Keine Therapie — reines Einkaufs- & Layering-Erkennungstool. Keine erfundenen medizinischen Claims.*
