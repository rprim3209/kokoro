# EU Baby / Kind Katalog — Quellenlog

**Retrieval-Datum:** 2026-09-04 (UTC; Nutzerzone Europe/Vienna = UTC+2)  
**User-Agent OBF:** `Kosmetikschrank/0.1 (research)`

## Medizin / Pharma (Rahmen, keine Produktlisten)

| Quelle | URL / Fundstelle | Hinweis |
|---|---|---|
| VO (EG) Nr. 1223/2009 Annex I Part B | EUR-Lex / konsolidierte Fassung | Spezifische Safety Assessment für Produkte intended for children **under 3** |
| EDQM / Council of Europe *Safe cosmetics for young children* 2nd ed. 2023 | EDQM-Publikation; vgl. auch ResAP(2012)1 | Infant = unter 3; Vorsicht Duft/Konservierer |
| AAP / AAD sunscreen guidance | AAP & AAD Verbraucher-/Fachhinweise | Unter 6 Monaten SPF nicht first-line |
| JDD 2020 Ceramide consensus (neonates/infants) | Journal of Drugs in Dermatology 2020 | Richtung fragrance-free mild cleansers/moisturizers; **kein** App-Therapieclaim |
| CosIng | https://ec.europa.eu/growth/tools-databases/cosing/ | Nur Ingredients/Funktionen/Annex-Beschränkungen — **keine** fertigen Baby-Produkte |
| CPNP | — | Geschlossen; keine vollständige EU-Fertigproduktliste öffentlich |

Interne Entscheidungsskizze: `kinder-kategorie.md` (Altersbänder, Flag-Prioritäten).

## Open Beauty Facts

### Facets (Top-Tags; Taxonomie größer als Facet-Top-100)

- Categories facet: `https://world.openbeautyfacts.org/facets/categories.json` und `https://world.openbeautyfacts.org/categories.json?page_size=1000`
- Labels facet: `https://world.openbeautyfacts.org/facets/labels.json`

**Baby-/Kind-Kategorie-Tags mit Counts (Auszug, 2026-09-04):**  
`en:baby-wipes` (105), `fr:bebe` (46), `en:shampoos-for-babies` (33), `en:children-s-toothpastes` (30), `en:shampoos-for-children` (19), `en:baby-shampoo` (14), `en:baby-oil` (13), `en:baby-cream` (9), `en:baby-lotion` (7), `en:baby-powder` (6), `en:baby-wash` (5), `fr:hygiene-pour-bebe`, `fr:soin-bebe`, `nl:babyverzorging`, …

**Nicht verwendet:** `en:baby-foods` (Lebensmittel — falsch für Kosmetik-Katalog).

### Labels (Duft)

- `en:without-perfume` (~110), `en:fragrance-free` (6), `en:synthetic-scent-free` (~50), `en:unscented`, `fr:sans-parfum`  
- Pagination: `https://world.openbeautyfacts.org/cgi/search.pl?action=process&json=1&page_size=100&page=N&tagtype_0=labels&tag_contains_0=contains&tag_0=LABEL`
- Sleep ~0,5 s zwischen Seiten

### Search terms

Zusätzlich: `baby`, `bébé`, `bebe`, Marken-Stichworte (Mustela, Bioderma ABCDerm, Weleda Baby, Hipp Babysanft, Penaten, Bübchen, Uriage, Cetaphil Baby, …).

### Filter / Rohdaten

- EU-Länder client-seitig über `countries_tags` (DE, AT, FR, IT, ES, NL, BE, PL, IE, SE, DK, FI, PT, CZ, HU, GR, RO, …, `european-union`) — analog Erwachsenen-Katalog
- Roh: `obf_raw/baby/obf_baby_raw.json`, `obf_raw/baby/obf_baby_eu.json`
- Nach Qualitätsfilter (Name vorhanden, keine Windeln/Food/Rx-Signale): `eu-baby-kind-katalog.csv`

## Cruelty Free International

- Liste: `/workspace/kosmetikschrank/cfi-marken.csv` (Abruf 2026-09-04)
- Große Apotheken-Babylinien (Mustela, Bioderma, Avène, LRP, Weleda, Hipp, Penaten, Sebamed, …) **nicht** CFI
- Baby-relevante CFI-Treffer im Katalog u. a.: Cien, Childs Farm, Lupilu (Brand-Level `flag_cf=yes`, `cf_basis=cfi`)

## Markenseiten (WebFetch / curl, Claims zitiert)

| URL | Verifiziert |
|---|---|
| https://www.eau-thermale-avene.de/alle-produktfamilien/babypflege | Babypflege; Hygiene „parfüm- und seifenfrei“; Feuchtigkeitscreme parfümfrei in Charter-Text |
| https://www.eau-thermale-avene.de/sortiment/baby | Bébé-Sortiment / pädiatrische Kontrolle |
| https://www.weleda.de/baby | Calendula Babypflege; Wundschutzcreme „JETZT AUCH PARFÜMFREI“; Pflegeöl/Gesichtscreme parfümfrei verlinkt |
| https://www.weleda.de/produkt/calendula-gesichtscreme-parfuemfrei-g004246 | „parfümfreie Calendula Gesichtscreme“ Weleda Baby |
| https://www.weleda.de/produkt/calendula-pflegeoel-parfuemfrei-g007528 | Unparfümiertes Calendula-Pflegeöl |
| https://www.mustela.com/products/baume-emollient-stelatopia | Stelatopia Baume dès la naissance; INCI ohne Parfum |
| https://www.mustela.fr/products/creme-emolliente-visage-stelatopia | Sans parfum / 0% PARFUM (Such-/Seitenclaim) |
| https://centrethermal.laroche-posay.fr/fr-FR/SPA-Source | Lipikar Baume AP+M „Sans parfum“; bébé/enfant/adulte |
| https://www.laroche-posay.de/de_DE/… (Lipikar-URLs) | Abruf lieferte SPA/JS-Shell ohne Claim-Text — Claim daher über FR Thermal-Center |
| https://www.penaten.de/ | Baby-Marke; „Ultra Sensitiv (parfümfrei)“, „Sensible Haut (parfümfrei)“ |
| https://www.sebamed.de/produkte/baby-kind/ | Baby & Kind Kategorie; Parfümfrei-Filter trifft auch Erwachsenen-Akut — SKU-weise prüfen |
| https://www.bioderma.com/en/our-products/abcderm | Regional-Gate; ABCDerm Baby/Kind über Apothekenquellen (INCI oft Parfum) |
| https://shop.hipp.de/hipp-babysanft-pflegecreme-75ml.html | Ab 1. Lebenstag; INCI mit Parfum (HTTP 429 zeitweise) |
| Uriage Bébé 1ère Crème | https://www.uriage.fr/produits/1ere-creme-hydratante-uriage — „délicatement parfumée“ → FF=no |

**Drop / nicht als FF+Baby bestätigt in diesem Lauf:** CeraVe Baby DE-Hauptkatalog, Cetaphil Baby DE-Range, Topicrem Bébé (404), ISDIN Baby DE (404), Ducray Dexyane Kids ohne stabile Markenseiten-Bestätigung, Bübchen ohne parfümfrei-SKU.

## Output

- `/workspace/kosmetikschrank/eu-baby-kind-katalog.csv`
- `/workspace/kosmetikschrank/eu-baby-kind-katalog.md`
- `/workspace/kosmetikschrank/eu-baby-kind-katalog-quellen.md` (diese Datei)

## Limitationen (kurz)

- OBF Coverage dünn bei FF-Labels für Baby (~20er-Bereich nach Filter)
- Viele Baby-intended Zeilen **ohne** Parfümfrei-Nachweis (ehrlich als FF=no)
- Keine Garantie aktueller INCI; Verpackung/Markenseite vor Kauf prüfen
- SPF-Zeilen tragen Safety-Note AAP/AAD <6 Monate
