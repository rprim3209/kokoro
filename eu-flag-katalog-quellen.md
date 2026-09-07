# EU-Flag-Katalog — Quellenlog

**Retrieval-Datum:** 2026-09-04 (UTC; Nutzerzone Europe/Vienna = UTC+2)

## Open Beauty Facts

- Facet Labels: `https://world.openbeautyfacts.org/facets/labels.json` / `https://world.openbeautyfacts.org/labels.json`
- Search API Pattern: `https://world.openbeautyfacts.org/cgi/search.pl?action=process&json=1&page_size=100&page=N&tagtype_0=labels&tag_contains_0=contains&tag_0=LABEL`
- User-Agent: `Kosmetikschrank/0.1 (research)`
- Labels abgerufen (u. a.): `en:cruelty-free`, `pt:cruelty-free`, `fr:cruelty-free-vegan`, `en:not-tested-on-animals`, `en:without-perfume`, `en:synthetic-scent-free`, `fr:non-comedogene`, `pt:nao-comedogenico`, `en:non-comedogenic`, `en:leaping-bunny`, `en:cruelty-free-international`, `en:fragrance-free`, `en:unscented`
- Rohdaten: `obf_products_eu.json` (320 unique EU-tagged products after country filter)
- EU-Filter client-seitig über `countries_tags` (DE, AT, FR, IT, ES, NL, BE, PL, IE, SE, DK, FI, PT, CZ, HU, GR, RO, …, `european-union`)
- Rate limit: ~0.5–0.8 s Sleep zwischen Seiten
- API-Fehler: keine fatalen; Label-Facet liefert nur Top-100 Tags (vollständige Label-Taxonomie hat count=2453)
- INCI-basiertes Parfümfrei-Screening über alle OBF-Produkte: **nicht** vollständig durchgeführt (nur Label-basiert + Stichproben auf Markenseiten); Methode dokumentiert als bewusst ausgelassen wegen Scope

## Cruelty Free International

- Directory: `https://www.crueltyfreeinternational.org/approved-brands/` — UI zeigt **413** Brands; Pagination/Filter JS; Server-curl → SiteGround Captcha 403/202
- Einzel-Listings (WebFetch, 2026-09-04), u. a.:
  - `…/listing/17/`
  - `…/listing/7th-heaven/` (via Suche bestätigt)
  - `…/listing/aesop/`
  - `…/listing/aldi-uk/`
  - `…/listing/argital/`
  - `…/listing/superdrug/`
  - `…/listing/mua-make-up-academy/`
  - `…/listing/mienna-cosmetics-ltd/`
  - `…/listing/the-inkey-list/`
  - `…/listing/facetheory/`
  - `…/listing/made-of-more/`
  - `…/listing/manufaktura/`
  - `…/listing/oxmantown-skincare/`
  - `…/listing/skin-formulas/`
- Weitere Markennamen aus Directory-Blurb Seite 1 und Prev/Next-Navigation (mit Hinweis im CSV)
- PDF Programme: `https://www.crueltyfreeinternational.org/wp-content/uploads/2026/03/Cruelty-Free-International-Approval-Programme.pdf` (verweist auf Website-Liste, keine CSV)

## CCIC Leaping Bunny (US/CA)

- `https://www.leapingbunny.org/shopping-guide` — Jurisdiktion USA/Kanada; **nicht** 1:1 CFI-EU; nur als Kontext abgerufen

## Hersteller-Markenseiten (NC / parfümfrei)

| URL | Was verifiziert |
|---|---|
| https://www.cerave.de/hautpflege/gesichtspflege/feuchtigkeitsspendendes-ha-water-gel | NC + ohne Duftstoffe/Parfüm |
| https://www.cerave.de/hautpflege/reinigung-fuer-gesicht-und-koerper/ausgleichender-reinigungsschaum | NC + ohne Duftstoffe |
| https://www.bioderma.de/unsere-produkte/sebium/gel-moussant | NC; Duft vorhanden |
| https://www.bioderma.de/unsere-produkte/sebium/h2o | NC |
| https://www.bioderma.de/unsere-produkte/sensibio/h2o | Unparfümiert |
| https://www.eau-thermale-avene.de/p/tolerance-control-creme-3282770138801-0c591b54 | Ohne Duftstoffe; kein NC |
| https://www.eucerin.de/produkte/dermopure-clinical/hydra-repair | NC + ohne Duftstoffe |
| https://www.eucerin.de/produkte/dermopure-clinical/porenverfeinerndes-reinigungsgel | NC + ohne Duftstoffe |
| https://www.eucerin.de/produkte/dermopure-clinical/mat-fluid | NC |
| https://www.eucerin.de/produkte/dermopure-clinical/klaerendes-tonic | NC + ohne Duftstoffe |
| https://www.eucerin.de/produkte/atopicontrol/beruhigende-gesichtscreme | ohne Duftstoffe |
| https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/feuchtigkeitscreme/1874015.html | NC + ohne Parfüm |
| https://www.cetaphil.de/produktkategorie/reinigung/reinigungslotion/7127319.html | NC + duftstofffrei |
| https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/tagespflege-mit-hyaluronsäure/14136571.html | NC + ohne Duftstoffe |
| https://www.vichy.de/alle-produkte/hautpflege/tagescremes/akne/normaderm-anti-age | NC; INCI mit Parfum |
| https://www.laroche-posay.fr/gammes/visage/toleriane/toleriane-sensitive-creme.-soin-hydratant-apaisant-protecteur/LRP_128.html | NC + sans parfum (Cloudflare blockierte Direktfetch; Claim aus Index-Snippet der Marken-URL) |

## Recht / Guidance (Kontext, keine Produktlisten)

- VO (EG) Nr. 1223/2009 Art. 20; VO (EU) Nr. 655/2013 (Claims)
- CosIng = Inhaltsstoffe only
- AAD / EuroGuiDerm = Actives/Therapie, keine NC-Produktregister
- Fulton/Kligman = Ingredient assays
- ISO / Cosmetics Europe Guidance zu fragrance-free vs. odorous molecules

## Output-Dateien

- `/workspace/kosmetikschrank/eu-flag-katalog.md`
- `/workspace/kosmetikschrank/eu-flag-katalog.csv`
- `/workspace/kosmetikschrank/eu-flag-katalog-quellen.md` (diese Datei)
- Hilfsrohdaten: `obf_products_eu.json`, `obf-labels.json`, `eu-flag-katalog-summary.json`
