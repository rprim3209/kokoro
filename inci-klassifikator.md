# INCI-Klassifikator v1

**Stand:** 2026-09-08 (Europe/Vienna)  
**App:** Prim's Kosmetikschrank  
**Zweck:** Roh-INCI → normalisieren → **Klasse** → **Rolle** → Eingang für "Zum Schrank" (Konfliktmatrix) und Produktflags (Duft, Barrierestress).  
**Verwandt:** `actives-whitelist.md`, `konfliktmatrix.md`, `schrank-modell.md`, `constraints-v1.md`, `verdict-glossar.md`, `editorial.md`, `arzt-schiene.md`, `theory-check.md`.

---

## 0. Hard Rules (nicht verhandelbar)

| Darf | Darf nicht |
|---|---|
| Stoffe benennen, Klassen zuordnen, Spur vs Active heuristisch trennen | Therapie, Schema, Dosis-Empfehlung |
| EU CosIng / Annex / SCCS als Regulatorik-Kontext | "behandelt Akne / heilt / klärt Zysten" |
| Evidenzstufe intern markieren | Leitlinie als App-Befehl nachreden |
| Unsicherheit als **offen** lassen | Prozent erfinden, wenn die Dose nichts sagt |
| Derivate getrennt führen (aPAD ≠ Azelain) | Derivate still auf Parent-Active kollabieren |

**Evidenzstufen (intern):** `stark` | `mittel` | `schwach` | `unsicher`  
(Whitelist v0.2 sagt teils **dünn** → hier = **schwach**.)  
Wenn unbekannt → **offen**, nie raten.

**Disclaimer-Pflicht** (wie `verdict-glossar.md` §8):  
*Keine medizinische Therapie – reines Einkaufs- & Layering-Erkennungstool.*

---

## 1. Pipeline: Roh-INCI → Klasse → Rolle → "Zum Schrank"

```
INCI-Rohtext / OCR / Katalog
        │
        ▼
 1. Normalize
    • Trim, Unicode NFC, Groß/Klein → CosIng-kanonisch
    • Synonyme (Nicotinamide → Niacinamide; Benzoyl Peroxide → Benzoyl Peroxide)
    • "Parfum"/"Fragrance"/"Aroma" vereinheitlichen
        │
        ▼
 2. Match gegen Whitelist + Arzt-Schiene + Support-Lexikon
    • Treffer → Klasse + eu_status
    • Kein Treffer → unknown (offen), nicht erfinden
        │
        ▼
 3. Rolle zuweisen (Enum §2)
    • Konzentrations-/Positions-Heuristik (§4)
    • Leave-on vs Rinse-off (§4)
    • Präsentation / Schiene (Kosmetik vs AM) bei Grenzstoffen
        │
        ▼
 4. Produkt-Aggregate
    • classes[] der Actives (nur Rolle = active | not_cosmetic)
    • flags: fragrance, barrier_stress, uv_sensitizer_hint, …
    • schiene: kosmetik | arzneimittel | support | unbekannt
        │
        ▼
 5. Feeds
    • "Zum Schrank" ← Konfliktmatrix auf classes[]
    • "Zu dir" ← Constraints auf flags (Duft, Alcohol Denat., …)
    • Slot-Hinweise ← uv / cleanser / AM-PM-Placement
```

**Mapping zu `schrank-modell.md`:**  
`rolle: primaer_active` ≈ Enum `active`  
`rolle: hilfsstoff_spur` ≈ Enum `spur`  
Die restlichen Rollen (`support`, `uv`, `cleanser`, `not_cosmetic`, `unknown`) ergänzen das Modell für Engine/Flags.

---

## 2. Role-Enum

| Rolle | Bedeutung (einfach) | Matrix? | Typische Beispiele |
|---|---|---|---|
| `active` | Kosmetik-Wirkstoff, der Layering/Redundanz steuern darf | ja | Retinol, AHA/BHA (über Spur), Azelaic Acid, Niacinamide (wenn nicht Spur) |
| `support` | Nützlich, aber kein Krankheits-/Akne-Active | nein (außer Barrierelogik) | Glycerin, HA, Ceramide, Panthenol, Petrolatum |
| `uv` | Sonnenschutz-Filter / UV-Slot | Hinweis (`uv`-Code) | Titanium Dioxide, Zinc Oxide, Ethylhexyl Methoxycinnamate, … |
| `cleanser` | Reiniger-/Surfactant-Kontext (meist rinse-off) | selten | Sodium Laureth Sulfate, Cocamidopropyl Betaine |
| `spur` | Hilfsstoff / Puffer / Konservierer in Spuren → **kein** Active-Alarm | nein | Salicylic Acid hinter Phenoxyethanol; Citric Acid als pH |
| `not_cosmetic` | Arzneimittel / Annex-II-verboten / kein Gesichts-Kosmetikstoff | ja (`not_cosmetic`) | BPO Gesicht, Adapalen, Tretinoin, HQ, Azelaic 15–20 % AM |
| `unknown` | Nicht gematcht oder unklar → **offen** | nein | Botanicals ohne Whitelist-Eintrag |

**Priorität bei Mehrfach-Tags auf einem INCI-Token:**  
`not_cosmetic` > `active` > `uv` > `cleanser` > `support` > `spur` > `unknown`

Ein Produkt kann mehrere Rollen-Stoffe haben (z. B. Creme: `support` + Duft-Flag; Serum: `active` Retinol + `support` Glycerin).

---

## 3. Klassenliste (aligned Whitelist + Matrix)

Kanonische Klassen-IDs = `konfliktmatrix.md` §2 (+ Ergänzungen für Flags).

### 3.1 Layering-Klassen (steuern Matrix)

| Klasse | Typische INCI | Rolle Default | Hinweis |
|---|---|---|---|
| `retinoid_rx` | Adapalene, Tretinoin, Trifarotene, Tazarotene | `not_cosmetic` | Arzt-Schiene; nicht = Retinol |
| `retinoid_cos` | Retinol, Retinal, Retinyl Acetate, Retinyl Palmitate | `active` | RE-Limits VO (EU) 2024/996 für Retinol/Ester; **Retinal separat** (§5) |
| `bpo` | Benzoyl Peroxide | `not_cosmetic` | Annex III/94 nur Nagel ≤0,7 %; Gesichts-BPO = AM (**stark**) |
| `aha` | Glycolic Acid, Lactic Acid, Mandelic Acid* | `active` / ggf. `spur` | *Mandelsäure = Grenzfall Whitelist E → v1 vorsichtig |
| `bha` | Salicylic Acid | `active` / `spur` | Annex III Leave-on oft max 2 %; Annex V 0,5 % Konservierer |
| `ascorbic` | Ascorbic Acid (L-AA) | `active` | Nur L-AA in diese Klasse; Derivate **nicht** kollabieren (§5) |
| `niacinamide` | Niacinamide | `active` / ggf. `spur` | Matrix: relevant ab ~3 % (Heuristik); Akne-Evidenz **schwach** |
| `azelaic` | Azelaic Acid | `active` oder `not_cosmetic` | Kosmetik vs AM = **Präsentation**, kein magischer %-Schnitt (**mittel**) |
| `ab_top` | Clindamycin, Erythromycin (topisch) | `not_cosmetic` | Resistenz-Flag ohne BPO |
| `clascoterone` | Clascoterone | `not_cosmetic` | Winlevi, EU-Zulassung 17.10.2025 |
| `barrier_stress` | Alcohol Denat. (hoch/früh), aggressive EO | Flag / Soft-Active | Kein Akne-Active; Constraints / `begleit_barrier` |

\* `retinoid` in Matrix-Regeln = Oberbegriff `retinoid_rx` ∪ `retinoid_cos`.

### 3.2 Flag-/Sonderklassen (kein Active-Upsell)

| Klasse / Flag | Trigger INCI | Rolle / Flag | Stärke |
|---|---|---|---|
| `fragrance` | Parfum, Aroma, Fragrance; Annex-III-Duftallergene | Produktflag `fragrance` | **stark** (Kennzeichnung) |
| `alcohol_denat` | Alcohol Denat., Alcohol (wenn früh in Leave-on) | trägt zu `barrier_stress` bei | **mittel** / Positions-Heuristik **unsicher** |
| `hq_banned` | Hydroquinone | `not_cosmetic` | Annex II (**stark**) |
| `arbutin` | Alpha-Arbutin, Arbutin | `active` (PIH-Kontext) | Annex III via 2024/996; **nicht** Hydrochinon |
| `kojic` | Kojic Acid | `active` (PIH) | max 1 % Gesicht/Hände (2024/996) |
| `uv_filter` | mineralische/chemische Filter | `uv` | Slot SPF |
| `support_humectant` | Glycerin, Hyaluronic Acid, … | `support` | — |
| `support_barrier` | Ceramide NP, Panthenol, Dimethicone, Petrolatum | `support` | — |

### 3.3 Explizit **nicht** als `active` (Whitelist D/E)

Zinc PCA, Sulfur, Snail, CBD-für-Akne, ätherische Öle als Wirklogik, Kollagen-in-Cream, Bakuchiol/Centella/EGCG/TXA/aPAD → v1: `unknown` oder `support`/`fragrance`-nah, **nicht** hochstufen. Evidenz **offen** / **schwach**.

---

## 4. Konzentration / Spur-Heuristiken

**Ehrlichkeit zuerst:** Ohne deklariertes % und ohne Labor → Schätzung aus INCI-**Reihenfolge** ist **unsicher**. Nie als Fakt verkaufen.

### 4.1 Die 1 %-Regel (EU-INCI)

In der EU werden Inhaltsstoffe ≥ 1 % in absteigender Konzentration gelistet; Stoffe < 1 % dürfen in beliebiger Reihenfolge **danach** stehen (Art. 19 VO 1223/2009).

| Signal | Heuristik | Rolle-Tendenz | Stärke |
|---|---|---|---|
| Stoff **vor** typischen <1 %-Markern | eher ≥1 % | eher `active` (wenn Whitelist) | **mittel** |
| Stoff **hinter** Phenoxyethanol, Ethylhexylglycerin, Carbomer, Xanthan Gum, Disodium EDTA, Tocopherol | oft <1 % | eher `spur` für AHA/BHA/Citric | **mittel** (wie Matrix §4 / Schrank-Modell §3) |
| `%` auf Packung / Katalogfeld vorhanden | exakt nutzen | siehe Schwellen unten | **stark** |
| `%` fehlt | nur Positions-Heuristik | bei Zweifel → `unknown`/`spur`, **kein** harter Konflikt | **unsicher** → **offen** |

### 4.2 Stoff-Schwellen (Regulatorik / Matrix – **keine** Anwendungsempfehlung)

| Stoff | Heuristik für `active` vs `spur` | Quelle | Stärke |
|---|---|---|---|
| Salicylic Acid | Leave-on ≪0,5 % / ans Listenende + Konservierer-Kontext → eher `spur` (Annex V 0,5 % Konservierer). Klar als Peeling/Serum positioniert oder mid-list → `bha`/`active`. Annex III: u. a. max 2 % viele Leave-ons Gesicht | Annex III/V; Matrix | **mittel** |
| Glycolic / Lactic Acid | pH-Puffer ganz hinten → `spur`; Peeling/Serum → `aha`/`active` | Matrix §4 | **mittel** |
| Niacinamide | Matrix: "relevant ab ~3 %". Ohne %: mid/early list Leave-on → `active`; ganz hinten → `spur`/`offen` | Konfliktmatrix | **unsicher** (ohne %) |
| Azelaic Acid | Kein gesetzlicher Kosmetik/%-Schnitt. 15–20 %-AM-Präsentation → `not_cosmetic`. Typische ~10 %-Seren → `azelaic`/`active`, Evidenz Akne für Kosmetik-% **schwach** | Whitelist | **mittel** (Präsentation) |
| Retinol / Retinylester | Leave-on mit Retinol-INCI → `retinoid_cos`/`active` (auch wenn %). Caps: 0,3 % RE Gesicht / 0,05 % Body (2024/996) – nur Regulatorik, kein App-Dosieren | VO 2024/996 | **stark** (Caps) |
| Alcohol Denat. | Position 1–5 in Leave-on → `barrier_stress`-Flag; ganz hinten → schwächer / oft ignorieren | Constraints offene Q; Praxis | **unsicher** |

### 4.3 Leave-on vs Rinse-off

| Produkttyp | Wirkung auf Rolle |
|---|---|
| Leave-on (Serum, Creme, Spot) | Actives und Duftallergene streng werten |
| Rinse-off (Reiniger, Haar) | Surfactants → `cleanser`; viele Actives eher abgeschwächt; Duftschwellen Annex III höher (0,01 % vs 0,001 %) |
| SPF Leave-on | Filter → `uv`; Actives darin trotzdem klassifizieren |

**Honesty limits:**  
- Keine "wirksame Konzentration" behaupten ohne Quellen-% .  
- Spur-Filter verhindert Fehlalarme; er **beweist** keine Unwirksamkeit.  
- CIR-/Marketing-% sind **kein** EU-Gesetz (Whitelist: CIR ≤10 % Glykolsäure ≠ Annex).

---

## 5. Derivat-Policy (map vs do-not-collapse)

**Regel:** Nur kollabieren, wenn (1) CosIng/INN denselben Stoff meint **oder** (2) Whitelist/Matrix explizit dieselbe Klasse setzt **und** Evidenz/Regulatorik übertragbar ist. Sonst: eigene Zeile, oft `unknown`/`support` bis Review.

| INCI / Gruppe | Map auf Klasse? | Rolle | Policy | Evidenz / Reg | Stärke |
|---|---|---|---|---|---|
| **Potassium Azeloyl Diglycinate** (aPAD) | **Nein** ≠ `azelaic` | `unknown` (v1) oder Support-nah | **do-not-collapse** – Whitelist E: ≠ 15 % Azelaic | CosIng skin conditioning; dünne Human-Lage | **schwach** / **offen** |
| Andere Azelaoyl-Derivate | **Nein** | `unknown` | do-not-collapse | — | **offen** |
| Azelaic Acid (Stoff) | `azelaic` | `active` / AM | Parent nur bei exaktem INCI | Whitelist | **mittel** |
| Retinol | `retinoid_cos` | `active` | Parent | 2024/996 RE | **mittel** Aging |
| Retinyl Acetate / Palmitate | `retinoid_cos` | `active` | **map** Klasse, aber **nicht** als "starkes Retinol" hochstufen | dieselben RE-Limits; Evidenz **schwach** | **schwach** |
| Retinal (Retinaldehyde) | `retinoid_cos` | `active` | **map** Klasse Layering; **nicht** unter 2024/996-Eintrag Retinol/Ester raten | CosIng/SCCS beobachten | **mittel–schwach** |
| Retinyl Retinoate | **Nein** (Grenzfall E) | `unknown` | do-not-collapse bis Review | — | **offen** |
| Ascorbic Acid (L-AA) | `ascorbic` | `active` | Parent | Whitelist | **mittel** Ton/Aging |
| Sodium Ascorbyl Phosphate (SAP), Magnesium Ascorbyl Phosphate (MAP), Ascorbyl Glucoside, Ascorbyl Tetraisopalmitate / THD, 3-O-Ethyl Ascorbic Acid | **Nein** ≠ `ascorbic` | `unknown` oder eigene spätere Klasse `ascorbyl_deriv` | **do-not-collapse** – andere Stabilität/pH/Evidenz; kein BPO-`inactivate` wie bei L-AA automatisieren | Whitelist A/E | **schwach** / **offen** |
| Niacinamide ↔ Nicotinamide | `niacinamide` | `active` | **map** (Synonym) | CosIng | **stark** (Name) |
| Salicylic Acid Salze (Sodium Salicylate etc.) | nicht blind `bha` | meist `spur`/`unknown` | do-not-collapse ohne Formulierungskontext | — | **unsicher** |
| Glycolic/Lactic **Salze** (Sodium Lactate, …) | nicht blind `aha` | oft `support`/`spur` | do-not-collapse | — | **unsicher** |
| Alpha-Arbutin / Arbutin | `arbutin` (Flag) | `active` PIH-Kontext | nicht auf Hydrochinon mappen | 2024/996; HQ Annex II | **mittel** |
| Deoxyarbutin | `hq_banned`-nah | `not_cosmetic` | verboten | VO 2021/1099 | **stark** |
| Adapalene | `retinoid_rx` | `not_cosmetic` | nie auf `retinoid_cos` | Arzt-Schiene DE Rx | **stark** |

**Kurzformel für Engine:**  
`collapse_ok` nur bei Synonym-Liste. Derivate → eigene `inci_id`, optional `related_to: azelaic` **ohne** Klassen-Gleichheit.

---

## 6. Duft / Allergen-Erkennung aus INCI

### 6.1 Harte Treffer → Produktflag `fragrance` = true

1. Token **Parfum**, **Fragrance**, **Aroma** (Art. 19: Parfüm-/Aromazusammensetzung).  
2. Einzeldeklaration Annex-III-Duftallergene oberhalb Kennzeichnungsschwelle (wenn auf dem Label → Stoff ist relevant).

**Schwellen Kennzeichnung (VO 1223/2009 Annex III, aktualisiert u. a. durch VO (EU) 2023/1545):**  
- Leave-on: **0,001 %**  
- Rinse-off: **0,01 %**  

Liste erweitert (Übergang: neue Inverkehrbringung ab **31.07.2026**, Abverkauf bis **31.07.2028**). Engine v1: Token-Match gegen bekannte INCI-Namen; vollständige 80+-Liste als Datenfile nachziehen (nicht hardcoden in Spec-Prosa).

### 6.2 Beispiele klassischer Annex-III-Namen (nicht exhaustiv)

Limonene, Linalool, Citral, Citronellol, Geraniol, Eugenol, Coumarin, Cinnamal, Cinnamyl Alcohol, Benzyl Alcohol*, Benzyl Salicylate, Benzyl Benzoate, Isoeugenol, Hydroxycitronellal, Hexyl Cinnamal, Butylphenyl Methylpropional (Lilial – inzwischen Annex-II-Verbot beachten), Evernia Prunastri/Furfuracea Extract, …

\* Benzyl Alcohol kann auch Konservierer sein → Flag "duftrelevant möglich", nicht automatisch Allergie-Diagnose.

### 6.3 Ätherische Öle / "Fragrance oils"

INCI wie *Citrus Limon Peel Oil*, *Eucalyptus Globulus Leaf Oil*, *Mentha Piperita Oil*:  
→ Flag `fragrance` und/oder Beitrag zu `barrier_stress` (Matrix: Citrus, Eukalyptus).  
**Nicht** als Active.

### 6.4 Was Duft-Flag steuert (nicht hier entscheiden, nur liefern)

Siehe `constraints-v1.md` / `verdict-glossar.md`:  
- `sensibel` + Duft Leave-on → **eher nicht**  
- `profil_baby` + Parfüm → **Konflikt**  
- Nie: "Du hast eine Duftallergie" nur aus INCI

`flag_fragrance_free` im Katalog nur wenn Quelle klar (OBF/Marke) – INCI ohne Parfum/Allergene ist **Hinweis**, kein Siegel.

---

## 7. Was man aus INCI **allein nie** schließen darf

| Inferieren verboten | Warum |
|---|---|
| Komedogenitäts-Score 0–5 / "verstopft Poren" | Kaninchenohr; Whitelist/Constraints: **kein** Kriterium; NC-Claim = Herstellerangabe |
| Allergie-**Diagnose** ("du verträgst X nicht") | INCI = Deklaration, kein Patch-Test; IFSI: sensitiv ≠ immunologische Allergie |
| Therapiewirkung / Heilversprechen | Editorial / Glossar Hard Rules |
| Exakte %-Konzentration ohne Angabe | Nur Reihenfolge-Heuristik, **offen** bei Zweifel |
| "Non-comedogenic weil kein Öl X" | Unreguliert, unseriös |
| Fitzpatrick / Phototyp aus INCI | irrelevant |
| aPAD = klinische Azelainsäure-Äquivalenz | do-not-collapse |
| SAP/MAP = L-Ascorbinsäure für `inactivate` mit BPO | Chemie/Evidenz nicht 1:1 |
| BPO-Gesichtsserum = erlaubte Kosmetik | Annex III/94; immer AM-Pfad |
| Rx empfehlen / Marken bewerben | Arzt-Schiene: erkennen, nicht verkaufen |

---

## 8. Anbindung an Verdict-Glossar / Ampel

Klassen und Rollen sind **Inputs**; Outcomes kommen aus Glossar + Matrix:

| Klassifikator-Output | Dimension | Typische Codes / Outcomes |
|---|---|---|
| `active` Klassen im Kandidat vs Schrank | **Zum Schrank** | `ok`, `alternate_days`, `split`, `skip_stack`, `same_class`, `inactivate`, … → passt / eher nicht / Konflikt |
| `not_cosmetic` | Zum Schrank | `not_cosmetic` → Kauf als Gesichts-Kosmetik = **Konflikt**; reine Erkennung Rx im Schrank = Info |
| `barrier_stress` / Alcohol Denat. / EO | Zu dir (+ Begleitpflege) | `begleit_barrier` / eher nicht bei `sensibel`/`barrier`/`begleitpflege` |
| `fragrance`-Flag | Zu dir | eher nicht (`sensibel`); Konflikt (`profil_baby`) |
| `uv` / Retinoide+Säuren | Slot / Hinweis | Code `uv` → eher nicht wenn SPF-Slot fehlt; allein selten Konflikt |
| `spur` | — | **kein** Matrix-Treffer (verhindert False Positive) |
| `unknown` | — | kein Active-Claim; optional "Stoff nicht in Whitelist" intern |

**Worst wins** über Zu dir / Zum Schrank / Slot bleibt in `verdict-glossar.md` §3.  
Dieser Klassifikator **setzt keine Ampel** – er liefert nur saubere Klassen/Rollen/Flags.

---

## 9. Offene Fragen / v1 out of scope

### Offen (Prim / Pharmazie)

1. Alcohol Denat.: harte Positionsgrenze (z. B. Top-5) vs. nur mit `barrier`/`begleitpflege`? (constraints §8.8)  
2. Niacinamid ohne %: ab welcher Listenposition `active`?  
3. Retinal: SCCS/CosIng-Status beobachten – bleibt kosmetisch?  
4. Soll `ascorbyl_deriv` eigene Matrix-Zeilen bekommen oder dauerhaft außerhalb `ascorbic`/`inactivate`?  
5. aPAD: dauerhaft `unknown` oder eigene Weich-Klasse ohne Azelaic-Evidenz-Transfer?  
6. Mandelsäure / Bakuchiol / TXA / Centella: Whitelist-E Review bevor Active  
7. Vollständige Annex-III-Allergen-Tabelle (2023/1545) als Maschinenliste  
8. Tagesreiz-Budget (Clienzo AM + Adapalen PM) – eigenes Spec `reiz-budget.md`, nicht INCI allein

### v1 bewusst nicht

- OCR-Qualitätsmodell / Packungs-%-Extraktion ML  
- Komedogenitäts-DB, "fungal acne"-Listen  
- Therapiepfade, Tele-Derm, Rx-Ads  
- Baby-Engine-Vertiefung (nur Flags liefern, Regeln in kinder-Specs)  
- Alle Botanicals whitelisten  
- pH aus INCI raten

---

## 10. Mini-Beispiele (Engine-Denke)

| Produkt-Signal | Klassen / Rollen | Erwartung |
|---|---|---|
| "Retinol 0,3 %" Serum Leave-on | `retinoid_cos` / `active` | Matrix vs AHA/BHA/Rx-Retinoid |
| Creme: … Phenoxyethanol, Salicylic Acid, … | `bha` / `spur` | kein BHA-Konflikt |
| "Azelaic Acid Suspension 10 %" | `azelaic` / `active`, schiene kosmetik | ok/split mit Retinoid möglich |
| Skinoren-ähnliche 20 %-AM-Packung | `azelaic` / `not_cosmetic` | erkennen, nicht als Serum verkaufen |
| Serum mit Potassium Azeloyl Diglycinate | kein `azelaic` | kein Azelaic-same_class |
| Adapalen-Gel im Schrank | `retinoid_rx` / `not_cosmetic` | same_class vs Retinol-Serum |
| BPO-Spot DE Apotheke | `bpo` / `not_cosmetic` | nie Kosmetik-Upsell; bleach/inactivate Flags |
| Leave-on mit Parfum + Linalool | flag `fragrance` | Zu-dir eher nicht bei sensibel |
| SPF 50 Creme | `uv` + supports | Slot UV; Actives extra prüfen |

---

## 11. Quellen (Kern)

| Thema | Quelle | Stärke |
|---|---|---|
| INCI-Reihenfolge / ≥1 % | VO (EG) 1223/2009 Art. 19 | **stark** |
| CosIng Namen/Funktionen | EC CosIng | **stark** (Namen) |
| Retinol/Ester, Kojic, Arbutin Caps | VO (EU) 2024/996; SCCS | **stark** (Caps) |
| Salicylsäure | Annex III/V; SCCS; VO 2019/1966 | **stark** |
| BPO nur Nagel in Kosmetik | Annex III/94 | **stark** |
| Hydrochinon / Deoxyarbutin | Annex II; VO 2021/1099 | **stark** |
| Duftallergene Kennzeichnung | Annex III; VO (EU) 2023/1545; SCCS | **stark** |
| Actives-Evidenzrahmen | `actives-whitelist.md` (AAD/EuroGuiDerm als Quelle, nicht App-Text) | je Stoff |
| Layering-Codes | `konfliktmatrix.md` | — |
| Ampel-Sprache | `verdict-glossar.md` | — |

---

*Ende inci-klassifikator.md – Stoffe ehrlich klassifizieren, nichts therapieren, Unsicherheit offen lassen.*
