# EU Jugend / Young-Adult Katalog — Kosmetikschrank

**Stand:** 2026-09-04 (Europe/Vienna)
**Für:** Prim · App-Scope Einkaufshilfe mit Flags
**Nicht:** Therapie, Arztersatz, vollständige EU-Produktliste

Ausgerichtet an [`jugend-markt.md`](jugend-markt.md): Profile `tween_teen_basis` (Reiniger, Feuchte, SPF) und `teen_akne` (BHA/BPO/Niacinamid; **Adapalen in DE = Rx**, nur Recognition/Detect — **keine** Kaufvorschläge).

---

## 1. Scope & warum unvollständig

- Es gibt **keine** vollständige öffentliche EU-Liste fertiger Teen-/Akne-Kosmetik.
- **CPNP** ist **geschlossen** — kein Scraping/Export für App-Kataloge.
- **CosIng** = nur Inhaltsstoffe/Funktionen/Annex — **keine** Enumeration fertiger Produkte.
- **Open Beauty Facts** ist crowd-sourced und **lückenhaft** (fehlende Labels bei vielen Apotheken-Akne-Linien: Effaclar, Sébium, Cleanance oft ohne FF/NC/CF-Tags in OBF).
- Markenseiten bestätigen Claims nur **SKU-/Linien-weise**; Formulierungen ändern sich.
- Dieser Katalog = **OBF-Stichprobe (EU-gefiltert) + verifizierte Markenseiten** — nicht „alle Teen-Produkte in der EU“.
- **≠ Baby-Katalog** (`eu-baby-kind-katalog.*`) und **≠ Erwachsenen-Anti-Aging-Stacks**.

---

## 2. Kriterien (Inclusion)

Produkt muss **mindestens eines** erfüllen:

| Flag | Bedeutung | Basis in CSV |
|---|---|---|
| `flag_fragrance_free` | Parfümfrei / without perfume | OBF-Label, Namensclaim oder Markenseite |
| `flag_nc` | Non-comedogenic / nicht komedogen (**Marketing-Claim**) | OBF-Label, Namensclaim oder Markenseite |
| `flag_cf` | Cruelty-free | Brand in `cfi-marken.csv` (CFI) **oder** OBF CF/Leaping-Bunny-Label |

**Bevorzugt:** Gesichts-Skincare für Teens — Akne-Linien, sanfte Reiniger, oil-free/leichte Feuchte, SPF, milde Seren (Niacinamid, HA, kosmetische Azelainsäure-%, BHA).

**Exclude / nicht als Teen-Vorschlag:**
- Anti-Aging-Retinol-Stacks für Minderjährige → `not_for_minors=yes`, `age_band=young_adult`
- Hochstarke AHA-Peels als Default
- Rx-Arzneimittel als Shop-Items (Clienzo, verschreibungspflichtiges Adapalen) — höchstens Detect-Hinweis, siehe `clienzo-adapalen.md` / `arzt-schiene.md`
- Erfundene SKUs/EANs — Markenseiten-Zeilen haben leere `ean`

### Altersbänder

| `age_band` | Bedeutung |
|---|---|
| `tween_teen` | grob 8–17 / Pubertäts-Basispflege |
| `young_adult` | 18–26; mehr Actives erlaubt, Flags bleiben |
| `teen_or_ya_unclear` | unklar, aber Akne/Teen-marktüblich |

### Profile-Slots

`basis_reiniger` · `basis_creme` · `basis_spf` · `akne_reiniger` · `akne_active` · `akne_creme` · `serum` · `sonst`

---

## 3. Medizin / Regulatory (nur Kontext, Markdown)

| Thema | Kurz | Quelle |
|---|---|---|
| Teen-Basisroutine | Reinigen → Feuchte → **SPF**; Actives nur bei Bedarf | [AAD](https://www.aad.org/) Tween/Teen skincare guides |
| Adapalen | **US:** Differin OTC ab 12; **DE:** Rx, nicht US-OTC-Logik | FDA Differin 2016; DE Arzt-Schiene |
| Kaufverhalten DE | IKW-Routinen-Stats | bereits in [`jugend-markt.md`](jugend-markt.md) — hier nicht duplizieren |

**App = Einkaufshilfe + Layering-Transparenz, keine Therapieempfehlung.**

---

## 4. Counts (Abruf 2026-09-04)

- **Katalogzeilen gesamt:** 96
- **Parfümfrei (`flag_fragrance_free=yes`):** 51
- **Non-comedogenic Claim (`flag_nc=yes`):** 35
- **CFI/CF (`flag_cf=yes`):** 33
- **FF ∧ NC:** 15
- **≥2 Flags:** 23
- **`not_for_minors=yes` (YA-only / kein Teen-Vorschlag):** 10
- **Ohne EAN (nur Markenseite, keine inventierte Nummer):** 14

### Nach `age_band`

| age_band | n |
|---|---:|
| `teen_or_ya_unclear` | 70 |
| `tween_teen` | 16 |
| `young_adult` | 10 |

### Nach `profile_slot`

| slot | n |
|---|---:|
| `basis_spf` | 34 |
| `basis_creme` | 29 |
| `basis_reiniger` | 14 |
| `akne_reiniger` | 7 |
| `akne_active` | 4 |
| `serum` | 4 |
| `akne_creme` | 3 |
| `sonst` | 1 |

### Combo-Tabelle (Flags)

| FF | NC | CF | n |
|---|---|---|---:|
| yes | no | no | 29 |
| no | no | yes | 25 |
| no | yes | no | 19 |
| yes | yes | no | 15 |
| yes | no | yes | 7 |
| no | yes | yes | 1 |

Vollständige Daten: [`eu-jugend-katalog.csv`](eu-jugend-katalog.csv). Quellenlog: [`eu-jugend-katalog-quellen.md`](eu-jugend-katalog-quellen.md).

---

## 5. Beispiele (Illustrationszeilen)

Priorität in der App: für `tween_teen_basis` eher FF+NC Reiniger/Creme/SPF; für `teen_akne` NC/FF Akne-Slots; CF optional ethisch. **`not_for_minors=yes` nie an Minderjährige vorschlagen.**

### Basis-Reiniger (`tween_teen_basis`)

| Name | Marke | Band | FF | NC | CF | Quelle |
|---|---|---|---|---|---|---|
| CeraVe Ausgleichender Reinigungsschaum | CeraVe | `tween_teen` | yes | yes | no | https://www.cerave.de/hautpflege/reinigung-fuer-gesicht-und-koerper… |
| Cetaphil Sanfte Reinigungslotion | Cetaphil | `tween_teen` | yes | yes | no | https://www.cetaphil.de/produktkategorie/reinigung/reinigungslotion… |
| Nutritive Gel nettoyant surgras | Eau thermale Jonza | `teen_or_ya_unclear` | yes | yes | no | https://world.openbeautyfacts.org/product/3517360003314/nutritive-g… |
| Créaline TS H2O Solution micellaire | Bioderma | `tween_teen` | yes | no | no | https://world.openbeautyfacts.org/product/3401573670053/crealine-ts… |
| Eau micellaire sensitive | Cien | `teen_or_ya_unclear` | no | no | yes | https://world.openbeautyfacts.org/product/20864781/eau-micellaire-s… |
| Micellar water fresh | Cien | `teen_or_ya_unclear` | no | no | yes | https://world.openbeautyfacts.org/product/20864774/micellar-water-f… |

### Basis-Feuchte (`tween_teen_basis`)

| Name | Marke | Band | FF | NC | CF | Quelle |
|---|---|---|---|---|---|---|
| CeraVe Feuchtigkeitsspendendes HA Water Gel | CeraVe | `tween_teen` | yes | yes | no | https://www.cerave.de/hautpflege/gesichtspflege/feuchtigkeitsspende… |
| Cetaphil Feuchtigkeitscreme | Cetaphil | `tween_teen` | yes | yes | no | https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/feucht… |
| Cetaphil Sanfte Tagespflege mit Hyaluronsäure | Cetaphil | `tween_teen` | yes | yes | no | https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/tagesp… |
| La Roche-Posay Toleriane Sensitive Crème | La Roche-Posay | `tween_teen` | yes | yes | no | https://www.laroche-posay.fr/gammes/visage/toleriane/toleriane-sens… |
| Crème riche apaisante pro-tolérance | Mixa | `teen_or_ya_unclear` | yes | yes | no | https://world.openbeautyfacts.org/product/3600550880687/creme-riche… |
| MB dermo cold crème Saint-Gervais Mont Blanc | Rivadis | `teen_or_ya_unclear` | yes | yes | no | https://world.openbeautyfacts.org/product/3361370627073/mb-dermo-co… |

### SPF (`tween_teen_basis`)

| Name | Marke | Band | FF | NC | CF | Quelle |
|---|---|---|---|---|---|---|
| Photoderm MAX SPF 50+ Spray très haute protec | Bioderma | `tween_teen` | yes | yes | no | https://world.openbeautyfacts.org/product/3401353688742/photoderm-m… |
| BB Cream Mon lait d'Ânesse  SPF 10 - 01 beige | Léa Nature | `teen_or_ya_unclear` | yes | yes | no | https://world.openbeautyfacts.org/product/3517360006162/bb-cream-mo… |
| BB Crème Solaire Teinté SPF 50+ | Mixa | `teen_or_ya_unclear` | yes | yes | no | https://world.openbeautyfacts.org/product/3600550362534/bb-creme-so… |
| Kids Active Sun Lotion SPF 50+ | ACO | `teen_or_ya_unclear` | yes | no | no | https://world.openbeautyfacts.org/product/7319861018585/kids-active… |
| Très Haute Protection Spray 50+ SPF | Avène | `teen_or_ya_unclear` | no | yes | no | https://world.openbeautyfacts.org/product/3282779363815/tres-haute-… |
| NIVEA SUN Protect & Sensitive Sun Lotion SPF  | Beiersdorf | `teen_or_ya_unclear` | yes | no | no | https://world.openbeautyfacts.org/product/4005900261038/nivea-sun-p… |

### Akne-Reiniger (`teen_akne`)

| Name | Marke | Band | FF | NC | CF | Quelle |
|---|---|---|---|---|---|---|
| Eucerin DERMOPURE CLINICAL Porenverfeinerndes | Eucerin | `teen_or_ya_unclear` | yes | yes | no | https://www.eucerin.de/produkte/dermopure-clinical/porenverfeinernd… |
| Bioderma Sébium Gel moussant | Bioderma | `tween_teen` | no | yes | no | https://www.bioderma.de/unsere-produkte/sebium/gel-moussant |
| Bioderma Sébium H2O | Bioderma | `tween_teen` | no | yes | no | https://www.bioderma.de/unsere-produkte/sebium/h2o |
| Keracnyl gel moussant visage et corps | Ducray | `teen_or_ya_unclear` | no | yes | no | https://world.openbeautyfacts.org/product/3282770037500/keracnyl-ge… |
| Eucerin DermoPure Cleansing Gel | Eucerin | `teen_or_ya_unclear` | no | yes | no | https://world.openbeautyfacts.org/product/4005800192883/eucerin-der… |
| PureActive Gel nettoyant assainissant | Garnier | `teen_or_ya_unclear` | no | no | yes | https://world.openbeautyfacts.org/product/3215662980011/pureactive-… |

### Akne-Active (`teen_akne`)

| Name | Marke | Band | FF | NC | CF | Quelle |
|---|---|---|---|---|---|---|
| Eucerin DERMOPURE CLINICAL Klärendes Tonic | Eucerin | `teen_or_ya_unclear` | yes | yes | no | https://www.eucerin.de/produkte/dermopure-clinical/klaerendes-tonic |
| Anti-boutons | Bioré | `teen_or_ya_unclear` | no | yes | no | https://world.openbeautyfacts.org/product/5017634247843/anti-bouton… |
| Hautklar | Garnier | `teen_or_ya_unclear` | no | no | yes | https://world.openbeautyfacts.org/product/4084200772901/hautklar-l-… |
| Hydratant teinté protecteur anti-imperfection | Mixa | `teen_or_ya_unclear` | no | yes | no | https://world.openbeautyfacts.org/product/3600550538175/hydratant-t… |

### Akne-Feuchte (`teen_akne`)

| Name | Marke | Band | FF | NC | CF | Quelle |
|---|---|---|---|---|---|---|
| Eucerin DERMOPURE CLINICAL Hydra Repair | Eucerin | `teen_or_ya_unclear` | yes | yes | no | https://www.eucerin.de/produkte/dermopure-clinical/hydra-repair |
| Eucerin DERMOPURE CLINICAL Mat Fluid | Eucerin | `teen_or_ya_unclear` | no | yes | no | https://www.eucerin.de/produkte/dermopure-clinical/mat-fluid |
| Garnier PureActive BHA+ Niacinamide SPF50+ An | Garnier | `teen_or_ya_unclear` | no | no | yes | https://world.openbeautyfacts.org/product/3600542645072360054259782… |

### Seren (vorsichtig; Retinol → YA)

| Name | Marke | Band | FF | NC | CF | Quelle |
|---|---|---|---|---|---|---|
| Vitamina C | Garnier | `teen_or_ya_unclear` | no | no | yes | https://world.openbeautyfacts.org/product/3600542453127/vitamina-c-… |
| Ultimate Slim Sérum 100% Actif Cure Cellulite | Linéance | `teen_or_ya_unclear` | yes | no | no | https://world.openbeautyfacts.org/product/3331300011968/ultimate-sl… |
| Skin Naturals Ultra Lift + Sérum Crème Soin a | Garnier | `young_adult` | no | no | yes | https://world.openbeautyfacts.org/product/3600541144019/skin-natura… |
| Starter retinol serum | The Inkey List | `young_adult` | yes | no | yes | https://world.openbeautyfacts.org/product/5061087560738/starter-ret… |

### Young-Adult / `not_for_minors` (Beispiele — kein Teen-Vorschlag)

| Name | Marke | Slot | Hinweis |
|---|---|---|---|
| Eluage Crème anti-âge restructurant | Avène | `basis_creme` | YA-only / Anti-Aging oder Retinol |
| Crème de jour anti-rides Q10 | Cien | `basis_creme` | YA-only / Anti-Aging oder Retinol |
| Crème de jour anti-âge Gold (Or 1%) | Cien | `basis_creme` | YA-only / Anti-Aging oder Retinol |
| Crème Anti-Rides Nuit Haute Tolérance | Diadermine | `basis_creme` | YA-only / Anti-Aging oder Retinol |
| Miracle Wake Up Crème Anti-Âge défatigant | Garnier | `basis_creme` | YA-only / Anti-Aging oder Retinol |
| Skin Naturals Ultra Lift + Sérum Crème Soin anti-r | Garnier | `serum` | YA-only / Anti-Aging oder Retinol |
| Crème visage anti-âge | Kuomayé Bio | `basis_creme` | YA-only / Anti-Aging oder Retinol |
| Crème visage protectrice SPF 50 anti-rides au Mono | Laboratoires Bioco | `basis_spf` | YA-only / Anti-Aging oder Retinol |

---

## 6. Disclaimer

Einkaufshilfe mit transparenten Flags — **keine** dermatologische Therapie, **keine** Garantie aktueller INCI. Vor Kauf Verpackung/Markenseite prüfen. Bei mittelschwerer/schwerer Akne, Narbenrisiko oder Unsicherheit: **Arzt-Schiene**, nicht Katalog-„Heilung“. Adapalen in Deutschland über die Ärztin/den Arzt, nicht als US-OTC-Analogon.

Siehe auch: [`jugend-markt.md`](jugend-markt.md) · [`arzt-schiene.md`](arzt-schiene.md) · [`clienzo-adapalen.md`](clienzo-adapalen.md) · [`konfliktmatrix.md`](konfliktmatrix.md).
