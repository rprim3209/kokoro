# EU Baby / Kind Katalog — Kosmetikschrank

**Stand:** 2026-09-04 (Europe/Vienna)  
**Scope:** eigene Kategorie, **getrennt** vom Erwachsenen-Gesichts-/Flag-Katalog  
**App-Rolle:** Einkaufshilfe mit Flags — **keine** pädiatrische Beratung, **keine** Therapie

Ausgerichtet an `kinder-kategorie.md`: Altersbänder `baby_0_36m` (EU <3) und optional `kind_3_11`.

---

## 1. Scope & warum unvollständig

- Es gibt **keine** vollständige öffentliche EU-Liste fertiger Baby-/Kinderkosmetik.
- **CPNP** (Cosmetic Products Notification Portal) ist **geschlossen** — kein Scraping/Export für App-Kataloge.
- **CosIng** = nur Inhaltsstoff-Funktionen/Beschränkungen (z. B. Duftstoff-Allergene Annex III), **keine** Enumeration fertiger Baby-Produkte.
- Open Beauty Facts ist **crowd-sourced**, lückenhaft (fehlende Namen, Labels, Länder) und **kein** Behördenregister.
- Markenseiten bestätigen Claims nur **SKU-/Linien-weise**; Formulierungen ändern sich.
- Dieser Katalog = **Stichprobe + verifizierte Linien**, nicht „alle Babyprodukte in der EU“.

---

## 2. Medizinisch-pharmazeutischer Rahmen (Dokumentation)

| Quelle | Relevanz für diesen Katalog |
|---|---|
| **EU VO 1223/2009 Annex I Teil B** | Produkte „intended for use on children under the age of three“ brauchen eine **spezifische** Sicherheitsbewertung — Signal für Flag `flag_under3_intended` / Band `baby_0_36m`. |
| **EDQM / Europarat** *Safe cosmetics for young children* (2. Aufl. 2023) | „Infant“ = **unter 3 Jahre**; Vorsicht u. a. bei Duftstoffen und Konservierern — stützt **Parfümfrei-Priorität**. |
| **AAP / AAD Sonnenschutz** | Unter **6 Monaten** SPF **nicht** first-line (Schatten, Kleidung, Hut). In CSV-Spalte `spf_note` und App-Copy: **kein** SPF-Empfehlungstext für Neonaten. |
| **Pädiatrische Derm-Konsens** (Richtung JDD 2020 Ceramide-Konsens) | Fragrance-free Cleanser/Moisturizer bevorzugt; Ceramide werden diskutiert — **nicht** als Therapie-Claim in der App. |
| **CosIng** | Nur Ingredient-Lookup/Restriktionen; **kann fertige Baby-Produkte nicht auflisten**. |
| **Open Beauty Facts** | Kategorien/Labels (Baby-Kosmetik, without-perfume, …) + EU-Länderfilter client-seitig. |

**Explizit:** Die App ersetzt keinen Kinderarzt/keine Dermatologin. Windelausschlag mit Infektzeichen, therapiebedürftige Neurodermitis, Rx-Lokaltherapeutika → Arzt-Schiene, nicht Katalog-„Heilung“.

---

## 3. Flag-Definitionen (anders als Erwachsenen-Katalog)

| Flag | Baby (`baby_0_36m`) | Kind (`kind_3_11`) | Basis in CSV |
|---|---|---|---|
| **`flag_fragrance_free`** | **Höchste Priorität** | Hoch | OBF-Label (`without-perfume` / `fragrance-free` / …), Namensclaim, oder verifizierte Markenseite |
| **`flag_under3_intended`** | **Hoch** (EU-<3-Signal) | — / unklar | Baby-Kategorie/Name/OBF oder Markenlinie „ab Geburt“ / Babypflege |
| **`flag_cf`** | Optional (ethisch) | Optional | Brand in `cfi-marken.csv` (CFI) |
| **`flag_nc`** | **Niedrig** — nicht als Hauptfilter | Mittel ab Vorpubertät | OBF NC-Label; bei Infants kaum Kernproblem |

**Inclusion (mind. eines):** parfümfrei **oder** under-3/Baby-intended **oder** CFI-Marke.  
**Bevorzugt:** parfümfrei **+** baby-intended.  
**Exclude:** Rx-Arzneimittel, Erwachsenen-Actives als „Kids“ (z. B. Retinol Anti-Aging), erfundene SKUs/EANs.

---

## 4. Counts (Abruf 2026-09-04)

- **Katalogzeilen gesamt:** 606
- **Parfümfrei (`flag_fragrance_free=yes`):** 23
- **Under-3 / Baby-intended:** 606
- **Parfümfrei ∧ under-3:** 23
- **CFI (`flag_cf=yes`):** 6
- **NC:** 0 (bewusst selten / niedrige Priorität)
- **Ohne EAN (nur Markenseite, keine inventierte Nummer):** 4
- **OBF babyish EU Rohmenge (vor Qualitätsfilter):** ~659

### Nach `age_band`

| age_band | n |
|---|---:|
| `baby_0_36m` | 570 |
| `kind_3_11` | 36 |

### Nach `category_slot`

| slot | n |
|---|---:|
| `windel` | 167 |
| `creme` | 132 |
| `sonst` | 98 |
| `haar` | 71 |
| `bad` | 70 |
| `spf` | 34 |
| `reiniger` | 34 |

Vollständige Daten: `eu-baby-kind-katalog.csv`.

---

## 5. Beispiele nach Band / Slot

Nur Illustrationszeilen; Filter-Priorität in der App: **parfümfrei zuerst**, dann under-3, CF optional, NC nicht erzwingen.

### `baby_0_36m`

#### Slot `reiniger` (34 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 3560071275075 | Lait de toilette | Carrefour | yes | yes | no | https://world.openbeautyfacts.org/product/3560071275075/lait |
| 3760075070045 | Alphanova Bébé Eau Nettoyante | Alphanova | no | yes | no | https://world.openbeautyfacts.org/product/3760075070045/alph |
| 3401396936190 | Bioderma Lait de toilette ABCDerm | Bioderma | no | yes | no | https://world.openbeautyfacts.org/product/3401396936190/biod |
| 3560071277000 | Eau nettoyante micellaire | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560071277000/eau- |
| 3560071277062 | Lait de toilette hydratant | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560071277062/lait |

#### Slot `creme` (127 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 5060447948674 | Face cream Fragrance Free | Childs cream | yes | yes | yes | https://world.openbeautyfacts.org/product/5060447948674/face |
| 3282770074307 | Crème Hydratante Avène Pédiatril Sterile Cosmetics | Avène Eau Thermale | yes | yes | no | https://www.eau-thermale-avene.de/alle-produktfamilien/babyp |
| 3282779300551 | Crème au Cold Cream Avène Pédiatril | Avène Eau Thermale | yes | yes | no | https://www.eau-thermale-avene.de/alle-produktfamilien/babyp |
| 3337872412998 | Lipikar Baume AP+M | La Roche-Posay | yes | yes | no | https://centrethermal.laroche-posay.fr/fr-FR/SPA-Source |
| — | Crème émolliente visage Stelatopia | Mustela | yes | yes | no | https://www.mustela.fr/products/creme-emolliente-visage-stel |

#### Slot `windel` (167 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 3286011092310 | Crème change | Biolane | yes | yes | no | https://world.openbeautyfacts.org/product/3286011092310/crem |
| 3560070311453 | Lingettes bébé sans parfum 100% coton | Carrefour | yes | yes | no | https://world.openbeautyfacts.org/product/3560070311453/ling |
| — | Calendula Wundschutzcreme parfümfrei | Weleda | yes | yes | no | https://www.weleda.de/baby |
| 26028071 | Lingettes bébé très douces sensitive | Chérubin | yes | yes | no | https://world.openbeautyfacts.org/product/26028071/lingettes |
| 5028270004752 | Baby wipes fragrance free | Dimple | yes | yes | no | https://world.openbeautyfacts.org/product/5028270004752/baby |

#### Slot `bad` (64 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 3560071348069 | Gel lavant 2 in 1 | Carrefour | yes | yes | no | https://world.openbeautyfacts.org/product/3560071348069/gel- |
| 3286010097064 | Solide lavant douceur | Biolane | no | yes | no | https://world.openbeautyfacts.org/product/3286010097064/soli |
| 3560071319731 | Gel lavant 2 in 1 | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560071319731/gel- |
| 3245411903237 | Gel lavant Corps et Cheveux | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3245411903237/gel- |
| 3560071276911 | Huile lavante 2 in 1 | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560071276911/huil |

#### Slot `haar` (56 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 3574660536522 | First Touch Shampoo | Natusan | yes | yes | no | https://world.openbeautyfacts.org/product/3574660536522/firs |
| 3401396936541 | Bioderma Shampooing ABCDerm | Bioderma | no | yes | no | https://world.openbeautyfacts.org/product/3401396936541/biod |
| 3286010097057 | Shampooing croûtes de lait à l'avoine apaisant | Biolane | no | yes | no | https://world.openbeautyfacts.org/product/3286010097057/sham |
| 3560071277093 | Shampooing très doux | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560071277093/sham |
| 8431876279559 | Champu camomila my baby | Carrefour Baby | no | yes | no | https://world.openbeautyfacts.org/product/8431876279559/cham |

#### Slot `spf` (32 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 3760075074227 | Spray solaire bébé 100 % naturel* haute protection | Alphanova Sun | yes | yes | no | https://world.openbeautyfacts.org/product/3760075074227/spra |
| 3760075070014 | Lait solaire | Alphanova bébé | no | yes | no | https://world.openbeautyfacts.org/product/3760075070014/lait |
| 3286010096692 | Crème solaire haute protection pour bébé SPF50 | BIOLANE | no | yes | no | https://world.openbeautyfacts.org/product/3286010096692/crem |
| 40623405 | HiPP Babysanft Sonnenschutz | HIPP | no | yes | no | https://world.openbeautyfacts.org/product/40623405/hipp-baby |
| 3282779411189 | Spray Solaire enfant au calendula protecteur SPF50 | Klorane | no | yes | no | https://world.openbeautyfacts.org/product/3282779411189/spra |

#### Slot `sonst` (90 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 3286010076038 | Lait après-soleil Bleu et blanc | BIOLANE | no | yes | no | https://world.openbeautyfacts.org/product/3286010076038/lait |
| 3560071207717 | Baby fresh aloe vera | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560071207717/baby |
| 3560071207359 | Sensitive | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560071207359/sens |
| 3560071172534 | baby | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560071172534/baby |
| 3560070218608 | sérum physiologique | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560070218608/seru |

### `kind_3_11`

#### Slot `creme` (5 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 3700376703044 | Dentifraise bio | Bioseptyl | no | yes | no | https://world.openbeautyfacts.org/product/3700376703044/dent |
| 8720181509803 | Junior 6-13 ans arome menthe | Fluocaril | no | yes | no | https://world.openbeautyfacts.org/product/8720181509803/juni |
| 8720181501814 | Protection caries longue durée | Signal | no | yes | no | https://world.openbeautyfacts.org/product/8720181501814/prot |
| 8717644091777 | Signal Dentifrice Enfants 7+ Ans Menthe Pokémon 75 | Signal | no | yes | no | https://world.openbeautyfacts.org/product/8717644091777/sign |
| 8001090632937 | Junior 6+ Star Wars | oral-b | no | yes | no | https://world.openbeautyfacts.org/product/8001090632937/juni |

#### Slot `bad` (6 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 4056489564300 | Shampooing douche extra doux pêche-abricot | CIEN | no | yes | yes | https://world.openbeautyfacts.org/product/4056489564300/sham |
| 8714789406220 | Tahiti Kids Cheveux et Corps | Colgate-Palmolive | no | yes | no | https://world.openbeautyfacts.org/product/8714789406220/tahi |
| 3263855775333 | Shampooing douche et bain parfum fraise | Leader Price | no | yes | no | https://world.openbeautyfacts.org/product/3263855775333/sham |
| 3517360002577 | Douche & Bain parfum Cola | Léa Nature | no | yes | no | https://world.openbeautyfacts.org/product/3517360002577/cola |
| 3564700193358 | Petit Manava Fruit du dragon | Marque Repère | no | yes | no | https://world.openbeautyfacts.org/product/3564700193358/peti |

#### Slot `haar` (15 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 3560070815470 | Démêlant Sprayz | Carrefour | no | yes | no | https://world.openbeautyfacts.org/product/3560070815470/deme |
| 5414971009354 | Shampooing à l'extrait de camomille et bleuet Extr | Belgian Cosmetic Brands | no | yes | no | https://world.openbeautyfacts.org/product/5414971009354/sham |
| 3160920965005 | Shampooing anti poux et lentes | Cars | no | yes | no | https://world.openbeautyfacts.org/product/3160920965005/sham |
| 3222475571121 | Les Tilapins de Casino - Shampooing très doux | Casino | no | yes | no | https://world.openbeautyfacts.org/product/3222475571121/les- |
| 3283950912594 | Shampooing démêlant parfum pomme Kids bio | Cattier | no | yes | no | https://world.openbeautyfacts.org/product/3283950912594/sham |

#### Slot `spf` (2 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 20231460 | Crème solaire enfant FPS50+ | Cien | yes | yes | yes | https://world.openbeautyfacts.org/product/20231460/cien-sun |
| 3506770302001 | Spray protecteur hydratant SPF 30 haute protection | Lovea | no | yes | no | https://world.openbeautyfacts.org/product/3506770302001/spra |

#### Slot `sonst` (8 Zeilen)

| EAN | Name | Marke | FF | U3 | CF | Quelle |
|---|---|---|---|---|---|---|
| 3245678127322 | Auchan bio dentifrice enfants 3-6 ans fraise | Auchan | no | yes | no | https://world.openbeautyfacts.org/product/3245678127322/auch |
| 7046110071519 | Jordan Tandpasta Milde Frambozensmaak 0-5 Jaar 50  | Jordan | no | yes | no | https://world.openbeautyfacts.org/product/7046110071519/jord |
| 7046110075562 | Jordan Tandpasta Milde Fruitsmaak 6-12 Jaar 50 ml | Jordan | no | yes | no | https://world.openbeautyfacts.org/product/7046110075562/jord |
| 7070866038342 | Toothpaste pump Kids 0-5 | Jordan | no | yes | no | https://world.openbeautyfacts.org/product/7070866038342/toot |
| 3564700427828 | Dentamyl junior | Marque Repère | no | yes | no | https://world.openbeautyfacts.org/product/3564700427828/dent |

### Parfümfrei-Beispiele (Prioritätsfilter)

| EAN | Name | Marke | Basis FF | Slot |
|---|---|---|---|---|
| 5060447948674 | Face cream Fragrance Free | Childs cream | name-claim | creme |
| 20231460 | Crème solaire enfant FPS50+ | Cien | obf-label | spf |
| 3560071348069 | Gel lavant 2 in 1 | Carrefour | obf-label | bad |
| 3282779300551 | Crème au Cold Cream Avène Pédiatril | Avène Eau Thermale | brand-page | creme |
| 3282770074307 | Crème Hydratante Avène Pédiatril Sterile Cosmeti | Avène Eau Thermale | brand-page | creme |
| 0062600452306 | Baby Lotion - Coconut Oil Body Moisturizer - Dry | Johnson’s | name-claim | creme |
| 3337872412998 | Lipikar Baume AP+M | La Roche-Posay | brand-page | creme |
| — | Crème émolliente visage Stelatopia | Mustela | brand-page | creme |
| 3504105028947 | Stelatopia | Mustela | brand-page-inci-no-parfum | creme |
| — | Calendula Gesichtscreme parfümfrei | Weleda | brand-page | creme |
| — | Calendula Pflegeöl parfümfrei | Weleda | brand-page | creme |
| 3574660536522 | First Touch Shampoo | Natusan | obf-label | haar |
| 3560071275075 | Lait de toilette | Carrefour | obf-label | reiniger |
| 3760075074227 | Spray solaire bébé 100 % naturel* haute protecti | Alphanova Sun | obf-label | spf |
| 3286011092310 | Crème change | Biolane | obf-label | windel |
| 3560070311453 | Lingettes bébé sans parfum 100% coton | Carrefour | name-claim | windel |
| 26028071 | Lingettes bébé très douces sensitive | Chérubin | obf-label | windel |
| 5028270004752 | Baby wipes fragrance free | Dimple | obf-label | windel |
| 8690510115145 | baby pure fragrance free wipes | hops | name-claim | windel |
| 3450601052316 | Liniment oléo-calcaire | L'arbre vert | obf-label | windel |
| 4015400622413 | Natural clean | P&G | obf-label | windel |
| 4015400621966 | Sensitive | P&G | obf-label | windel |
| — | Calendula Wundschutzcreme parfümfrei | Weleda | brand-page | windel |

---

## 6. Marken-Verifikation (Kurz)

| Marke / Linie | Ergebnis |
|---|---|
| **Weleda Baby Calendula parfümfrei** | Bestätigt (Gesichtscreme, Pflegeöl, Wundschutzcreme parfümfrei) — Markenseiten weleda.de |
| **Mustela Stelatopia** | Baby ab Geburt; Visage-Creme sans parfum / 0% PARFUM; Baume-INCI ohne Parfum auf Markenseite |
| **Avène Babypflege** | DE-Seite: Hygiene „parfüm- und seifenfrei“; Baby-Charter; Pédiatril-SKUs in OBF |
| **La Roche-Posay Lipikar Baume AP+M** | FR Thermal-Center-Text: „Sans parfum“, bébé/enfant/adulte; DE-Seite beim Abruf JS-Shell |
| **Bioderma ABCDerm** | Baby/Kind-Linie ab Geburt; **viele SKUs mit Parfum** in INCI → under3 ja, FF nein ohne Label |
| **HiPP Babysanft** | Ab 1. Lebenstag; Pflegecreme-INCI oft **mit Parfum** → under3 ja, FF nein |
| **Penaten** | Baby-Marke; **Ultra Sensitiv / Sensible Haut = parfümfrei** laut Startseite; Klassik vorsichtig |
| **Bübchen** | Oft parfümiert — nur bei nachgewiesenem parfümfrei-SKU |
| **Sebamed Baby & Kind** | Linie vorhanden; FF nur labelbasiert (manche SKUs mit Parfum) |
| **Uriage Bébé** | Baby-intended; 1ère Crème „délicatement parfumée“ → FF nein |
| **CeraVe Baby / Cetaphil Baby / Topicrem / ISDIN / Ducray Kids** | Keine stabile DE-Bestätigung für Katalog-Einschluss als FF+Baby in diesem Lauf — OBF nur wenn klar baby-benannt, ohne erfundene Claims |
| **CFI** | Keine der großen Apotheken-Babylinien (Mustela, Bioderma, Avène, LRP, Weleda, Hipp, …) in `cfi-marken.csv`; Treffer u. a. Cien, Childs Farm, Lupilu |

---

## 7. App-Hinweis (Copy)

> **Einkaufshilfe, keine medizinische Beratung.** Keine Dosierung, keine Diagnose, keine Therapieempfehlung.  
> Bei Säuglingen unter 6 Monaten: Sonnencreme nicht als First-Line vorschlagen.  
> Ceramide/„Barrier“ nur als Inhaltsstoff-Info, nicht als Heilversprechen.  
> Rezeptpflichtige Hautmittel und schwere Hautbilder → ärztlich.

---

## 8. Dateien

- `eu-baby-kind-katalog.csv` — Maschinendaten
- `eu-baby-kind-katalog.md` — dieser Text
- `eu-baby-kind-katalog-quellen.md` — Abruf-URLs
- Roh: `obf_raw/baby/`
