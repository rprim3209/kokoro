# EU Jugend / Young-Adult Katalog — Quellenlog

**Retrieval-Datum:** 2026-09-04 (UTC; Nutzerzone Europe/Vienna = UTC+2)  
**User-Agent OBF:** `Kosmetikschrank/0.1 (research)`

## Medizin / Regulatory (Rahmen, keine Produktlisten)

| Quelle | URL / Fundstelle | Hinweis |
|---|---|---|
| AAD Tween/Teen skincare | aad.org Verbraucher-Guides | Einfache Routine: cleanser, moisturizer, SPF; Anti-Aging-Actives für Tweens/Teens meiden |
| FDA Differin (Adapalen 0,1 %) | FDA OTC switch 2016 | US OTC ≥12 — **nicht** DE-Logik |
| DE Adapalen / Clienzo | `clienzo-adapalen.md`, `arzt-schiene.md` | Rx; Katalog = Detect-only, keine Kaufvorschläge |
| IKW Jugendstudie / Markt | `jugend-markt.md` | Stats dort verlinkt — hier nicht duplizieren |
| CosIng | https://ec.europa.eu/growth/tools-databases/cosing/ | Nur Ingredients — keine Fertigprodukte |
| CPNP | — | Geschlossen; keine vollständige EU-Fertigproduktliste |

## Open Beauty Facts

### Facets / Categories

- Labels facet: `https://world.openbeautyfacts.org/facets/labels.json`
- Categories: `https://world.openbeautyfacts.org/facets/categories.json?page_size=1000`
- Teen/Akne-Kategorie in Facet-Top dünn: `en:Acne treatments` (count≈3) — daher Brand-/Textsuche nötig

### Labels abgefragt (Pagination, Sleep ~0,5 s)

- Duft: `en:without-perfume`, `en:fragrance-free`, `en:unscented`, `en:synthetic-scent-free`, `fr:sans-parfum`
- NC: `en:non-comedogenic`, `fr:non-comedogene`, `pt:nao-comedogenico`
- CF: `en:cruelty-free`, `en:leaping-bunny`, `en:not-tested-on-animals`, …

### Search / Brands

Stichworte u. a.: acne, akne, sebium, effaclar, dermopure, niacinamide, salicylic, blemish, CeraVe, Bioderma, La Roche-Posay, Eucerin, Cetaphil, Paula's Choice, The INKEY List, Geek & Gorgeous, The Ordinary, Bubble, SVR Sebiaclear, Mixa, Ducray, Uriage, Avène, Vichy, Cleanance, Keracnyl, Normaderm.

### Filter / Rohdaten

- EU-Länder client-seitig über `countries_tags` (DE, AT, FR, IT, ES, NL, BE, PL, …, `european-union`) — analog andere Kataloge
- Roh: `obf_raw/jugend/obf_jugend_raw.json` (~2703 unique), `obf_raw/jugend/obf_jugend_eu.json` (~1632 EU)
- Fetch-Log: `obf_raw/jugend/fetch_log.json`
- Nach Face/Teen-Qualitätsfilter + Inclusion FF∨NC∨CF: `eu-jugend-katalog.csv`

### OBF-Limitation (ehrlich)

Viele EU-Apotheken-Akne-SKUs (Effaclar Duo, Sébium Global, Cleanance Comedomed, Geek & Gorgeous, The Ordinary Niacinamide, …) sind in OBF **ohne** FF/NC/CF-Labels → erscheinen **nicht** als OBF-Zeile, außer Markenseiten-Verifikation ergänzt Claims.

## Cruelty Free International

- Liste: `/workspace/kosmetikschrank/cfi-marken.csv` (Abruf 2026-09-04)
- Teen-relevante CFI-Treffer im Katalog u. a.: **The INKEY List**, **Cien**, (weitere CF via OBF-Label)
- **Nicht** CFI: CeraVe, Bioderma, La Roche-Posay, Eucerin, Cetaphil, SVR, Ducray, Avène (typische Apothekenmarken)

## Markenseiten (WebFetch / Abruf 2026-09-04) — Claims zitiert

| URL | Verifiziert |
|---|---|
| https://www.cerave.de/hautpflege/reinigung-fuer-gesicht-und-koerper/ausgleichender-reinigungsschaum | Nicht komedogen; parfümfrei / ohne Duftstoffe; INCI Niacinamid+Salicylsäure |
| https://www.cerave.de/hautpflege/gesichtspflege/feuchtigkeitsspendendes-ha-water-gel | nicht komedogen + ohne Duftstoffe/parfümfrei |
| https://www.bioderma.de/unsere-produkte/sebium/gel-moussant | Erwachsene, Teenager; Nicht komedogen; leichter frischer Duft → FF=no |
| https://www.bioderma.de/unsere-produkte/sebium/h2o | Erwachsene, Teenager; Nicht komedogen |
| https://www.bioderma.de/unsere-produkte/photoderm/akn-mat-lsf-30 | Erwachsene, Teenager; Nicht komedogen; „Parfümiert“ → FF=no |
| https://www.eucerin.de/produkte/dermopure-clinical/porenverfeinerndes-reinigungsgel | NC; frei von Duftstoffen; BHA; PZN 19729844 |
| https://www.eucerin.de/produkte/dermopure-clinical/hydra-repair | NC + ohne Duftstoffe |
| https://www.eucerin.de/produkte/dermopure-clinical/klaerendes-tonic | NC + ohne Duftstoffe (Vorbestätigung Flag-Katalog) |
| https://www.eucerin.de/produkte/dermopure-clinical/mat-fluid | NC; FF nicht bestätigt |
| https://www.cetaphil.de/produktkategorie/reinigung/reinigungslotion/7127319.html | duftstofffrei + Nicht komedogen; INCI ohne Parfum |
| https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/feuchtigkeitscreme/1874015.html | Ohne Parfüm + Nicht komedogen |
| https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/tagespflege-mit-hyaluronsäure/14136571.html | NC + ohne Duftstoffe |
| https://www.laroche-posay.fr/gammes/visage/toleriane/toleriane-sensitive-creme.-soin-hydratant-apaisant-protecteur/LRP_128.html | Non comédogène + SANS PARFUM (DE-Direktfetch teils Cloudflare) |
| https://fr.svr.com/collections/filtres-de-zee/products/sebiaclear-gel-moussant-23 | Non comédogène; Adults and teenagers; INCI mit PARFUM → FF=no |

**Versucht, nicht als FF+NC Teen-SKU stabil bestätigt:** LRP Effaclar DE-Produkt-URLs (JS/Cloudflare-Shell ohne Claim-Text im Abruf); Bubble / Indu kaum in OBF; Paula's Choice EU OBF nur Body-BHA ohne Flags; Geek & Gorgeous / The Ordinary ohne OBF-Flags (Retinal A-Game in Rohdaten → bewusst nicht als Teen-Kaufzeile ohne YA-Flag).

## Output

- `/workspace/kosmetikschrank/eu-jugend-katalog.csv`
- `/workspace/kosmetikschrank/eu-jugend-katalog.md`
- `/workspace/kosmetikschrank/eu-jugend-katalog-quellen.md` (diese Datei)

## Limitationen (kurz)

- Keine vollständige EU-Liste; CPNP closed; CosIng ≠ Produkte; OBF incomplete
- NC = Marketing-Claim, kein klinisches Poren-Garantie-Siegel
- Keine inventierten EANs/SKUs
- Formulierungen ändern sich — vor Launch Claims re-checken
