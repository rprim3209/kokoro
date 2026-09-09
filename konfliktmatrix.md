# Konfliktmatrix v0.2

Stand: 2026-09-04  
Baut auf `actives-whitelist.md` v0.2, `arzt-schiene.md` und `schrank-modell.md` v0.2.  
**Keine Routinen aufdrängen, keine Dosis, kein „mach das so“.** Nur: was die Engine flaggen darf, und warum.

---

## 1. Was die App sagen darf (Codes)

| Code | Status | Nutzertext (Klartext) |
|---|---|---|
| `ok` | 🟢 Passt | Kein bekannter harter Konflikt auf Stoffebene. Passt in deine Routine. |
| `alternate_days` | 🟡 Im Wechsel | **Geht, aber an getrennten Tagen.** (z.B. Peeling-Nacht vs. Retinoid-Nacht). Nicht am selben Abend schichten. |
| `split` | 🟡 Trennen | Nicht in dieselbe Anwendung. Eines morgens, eines abends. |
| `skip_stack` | 🔴 Lieber nicht | Zwei starke Reizstoffe am selben Abend. Risiko für Barriereschaden. |
| `inactivate` | 🔴 Unwirksam | Chemie: einer zerstört oder oxidiert den anderen (z.B. BPO + klassisches Tretinoin). |
| `same_class` | 🔴 Redundant | Gleiche Wirkstoffklasse steht schon da. Mehr Reiz ohne Zusatznutzen. |
| `resistance` | ⚠️ Praxis | Topisches Antibiotikum ohne BPO — Resistenzgefahr, ärztlich klären. |
| `not_cosmetic` | ℹ️ Erkennung | Arzneimittelstoff (Rx/Apotheke). Nur im Schrank erkennen, nie als Kosmetik verkaufen. |
| `begleit_barrier` | 🛡️ Schutz | **Begleitpflege-Alarm:** Du nutzt ein medizinisches Retinoid/BPO; dieses Produkt enthält aggressive Alkohole/Duftstoffe, die deine Barriere stressen. |
| `uv` | ☀️ Hinweis | Macht lichtempfindlicher. Tagsüber zwingend UV-Schutz nötig. |
| `bleach` | 👕 Hinweis | BPO bleicht Textilien und Kissenbezüge. |

---

## 2. Klassen

| Klasse | Typische Stoffe |
|---|---|
| `retinoid_rx` | Adapalen, Tretinoin, Trifaroten, Tazaroten |
| `retinoid_cos` | Retinol, Retinal, Retinyl Acetate/Palmitate |
| `bpo` | Benzoylperoxid (in dieser App immer AM oder Spot) |
| `aha` | Glycolic Acid, Lactic Acid, Mandelic Acid |
| `bha` | Salicylic Acid (über 0,5 % Leave-on) |
| `ascorbic` | Ascorbic Acid (L-AA, pH-abhängig) |
| `niacinamide` | Niacinamide (relevant ab ~3 %) |
| `azelaic` | Azelaic Acid (Kosmetik 10 % oder Rx 15–20 %) |
| `ab_top` | Clindamycin, Erythromycin topisch |
| `clascoterone` | Clascoteron (Winlevi) |
| `barrier_stress` | Alcohol Denat. (weit oben), aggressive ätherische Öle (Citrus, Eukalyptus) |

---

## 3. Regeln (v0.2)

Prio bei Mehrfachtreffern: `not_cosmetic` > `inactivate` > `same_class` > `skip_stack` > `alternate_days` > `begleit_barrier` > `uv` / `bleach`.

| # | A (Kandidat) | B (Schrank) | Code | Nutzer-Erklärung | Quelle |
|---|---|---|---|---|---|
| 1 | `bpo` | Kosmetisches Leave-on | `not_cosmetic` | BPO ist in der EU kein Gesichts-Kosmetikstoff (Annex III/94). | VO 1223/2009 |
| 2 | `hq_banned` | Kosmetik | `not_cosmetic` | Hydrochinon in Kosmetik verboten. | Annex II/1339 |
| 3 | `bpo` | Tretinoin | `inactivate` + `split` | Klassisches Tretinoin wird durch BPO oxidiert/inaktiviert. Nicht zeitgleich. | AAD 2024 |
| 4 | `bpo` (Einzeltube) | Adapalen (Einzeltube) | `skip_stack` | Fertigkombis (Epiduo) sind galenisch stabil. Zwei getrennte Tuben stapeln = extremes Barriererisiko. Besser abwechseln. | EuroGuiDerm 2025; Clienzo SmPC |
| 5 | `ab_top` | ohne `bpo` im Schrank | `resistance` | Topisches Antibiotikum nie als Monotherapie (Resistenzrisiko). | AAD; EuroGuiDerm |
| 6 | `retinoid` | `aha` | `alternate_days` | Nicht am selben Abend schichten. Als Skin Cycling (z.B. Tag 1 Retinoid, Tag 2 AHA) möglich, wenn Barriere stabil. | AAD Irritation |
| 7 | `retinoid` | `bha` | `alternate_days` | Nicht am selben Abend schichten. Besser auf verschiedene Tage verteilen. | AAD Irritation |
| 8 | `retinoid_rx` | `retinoid_cos` | `same_class` | Du hast bereits ein medizinisches Retinoid abends. Zusätzliches Retinol bringt keinen Vorteil, nur Schälung. | Klassen-Logik |
| 9 | `retinoid_rx` | `retinoid_rx` | `same_class` | Zwei Rx-Retinoide nicht kombinieren. | Klassen-Logik |
| 10 | `aha` | `bha` | `skip_stack` | Zwei starke Säuren in einem Schritt überfordern die Barriere. | Klinische Praxis |
| 11 | `aha` | `aha` | `same_class` | Zwei AHA-Produkte doppeln sich nur. | Klassen-Logik |
| 12 | `ascorbic` | `bpo` | `inactivate` + `split` | BPO oxidiert reine L-Ascorbinsäure sofort. Nicht zusammen auftragen (z.B. Vit C morgens, BPO abends). | Pinnell 2001 |
| 13 | `ascorbic` | `aha`/`bha` | `split` | Stark saures Milieu kann reizen. Besser morgens (Vit C) und abends (Säure) trennen. | Pinnell 2001 |
| 14 | `niacinamide` | `retinoid` | `ok` | Vertragen sich gut. Niacinamid unterstützt oft die Barriere gegen Retinoid-Trockenheit. | Shalita; Bissett |
| 15 | `niacinamide` | `ascorbic` | `ok` | In modernen Formulierungen stabil. Kein Inaktivierungs-Verbot. | Kosmetikchemie |
| 16 | `azelaic` | `retinoid` | `ok` / `split` | Azelainsäure ist milder. Morgens Azelain, abends Retinoid ist gängige Praxis. | EuroGuiDerm |
| 17 | `barrier_stress` | `retinoid_rx` / `bpo` | `begleit_barrier` | **Begleitpflege-Warnung:** Trocknet zusätzlich aus. Bei aktiver Rx-Aknetherapie milde, alkoholfreie Produkte wählen. | Begleitpflege-Standard |
| 18 | `retinoid` / Säuren | Sonne | `uv` | Erhöht Lichtempfindlichkeit. Morgens immer Breitband-Sonnenschutz (LSF 30–50). | SCCS; CIR |
| 19 | `bpo` | Textil | `bleach` | BPO bleicht Handtücher und Kleidung. | Produkthinweis |

---

## 4. INCI-Heuristik (Die 1 %-Grenze)

Bevor eine Regel zuschlägt, filtert die Engine Hilfsstoffe:
1. Ist ein Stoff (`bha`, `aha`) nur als pH-Regulator oder Konservierer in Spuren (< 0,5 %) enthalten?
2. Indikator: Steht hinter *Phenoxyethanol*, *Xanthan Gum*, *Carbomer* oder *Disodium EDTA*.
3. Ergebnis: **Kein Konflikt-Alarm**. Die Creme wird als neutraler Support eingestuft.

---

## 5. Begleitpflege-Logik

Wenn im Schrank ein Produkt mit `schiene: arzneimittel` liegt (Adapalen, Clienzo, BPO, Tretinoin):
* Das System schaltet automatisch in den **Begleitpflege-Modus**.
* Das oberste Ziel für alle Kosmetik-Kandidaten ist: **Barriere schützen, Feuchtigkeit sichern, Entzündungen beruhigen**.
* Unnötige Reizstoffe (Alkohol, Peelingkörner, Menthol, Duftbomben) bekommen ein gelbes oder rotes Schutz-Signal.

---

## 6. Schrank-Ansicht (Intra-Cabinet)

Stand: 2026-09-09

Die **Schrank-** und **Eigene-Routine**-Ansicht prüft nicht nur Lücken (SPF, Feuchtigkeit) und Begleitpflege, sondern auch **Klassen-Konflikte zwischen allen Produkten im Profil-Schrank** (AM + alle PM-Modi):

- `same_class`, `skip_stack`, `inactivate` → Ampel **Konflikt** (rot), sichtbar im Prognose-Banner und als Flag auf den Produktkarten
- `alternate_days` / `split` → **eher nicht** / „im Wechsel“ (gelb)
- Klassifizierung der Actives ist **klassen-allgemein** (`retinoid_rx` / `retinoid_cos` / `aha` / `bha` / `bpo` / …) über den gemeinsamen Helper `classifyProductClasses` / `enrichProductClasses` — keine Produkt-ID-Hacks

Editorial unverändert: Shopping- & Layering-Hinweis, keine Therapie, keine Dosis.
