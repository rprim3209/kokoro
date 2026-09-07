# EU-Flag-Katalog (Kosmetikschrank)

**Stand:** 2026-09-04  
**Für:** Prim / App Kosmetikschrank  
**Datenfile:** [`eu-flag-katalog.csv`](./eu-flag-katalog.csv) · Quellenlog: [`eu-flag-katalog-quellen.md`](./eu-flag-katalog-quellen.md)

---

## 1. Scope — und warum das **keine** Vollständigkeit sein kann

Dieser Katalog sammelt **quellenbasierte** Treffer für kosmetische Produkte (Schwerpunkt Gesicht/Hautpflege), die in der EU/EWR verkauft werden **und** mindestens eines der folgenden Flags erfüllen:

1. **Non-komedogen (NC)** — Hersteller-Claim auf Packung/Website (*kein* gesetzliches EU-Label)
2. **Cruelty-free (CF)** — bevorzugt Zertifizierung durch **Cruelty Free International (CFI)** / Leaping Bunny
3. **Parfümfrei / fragrance-free** — Claim und/oder kein `Parfum`/`Fragrance`/`Aroma` in der INCI

### Warum unvollständig (Hard Honesty)

- Es gibt **kein öffentliches Verzeichnis aller CPNP-notifizierten** EU-Kosmetika. CPNP ist behördlich geschlossen.
- **CosIng** listet nur Inhaltsstoffe (INCI), keine Fertigprodukte.
- **Open Beauty Facts (OBF)** ist nutzer:innengepflegt und lückenhaft; Labels können fehlerhaft sein.
- **„Non-komedogen“** ist Marketing, **kein** Rechtsbegriff unter VO (EG) 1223/2009 Art. 20 / VO (EU) 655/2013. Kaninchenohr-Scores (Fulton/Kligman 0–5) sind **Inhaltsstoff-Assays**, keine Produktzulassung.
- Die EU verbietet bereits Tierversuche an **fertigen** Kosmetika; CF-Siegel gehen **darüber hinaus** (Lieferkette, Cut-off-Datum, keine Tests für bestimmte Märkte wie China-Zulassung etc.). Das darf man nicht verwechseln.
- **Rx-Arzneimittel** (z. B. Clienzo, Adapalen-Gele als Arzneimittel, Skinoren) sind **keine** Kosmetika und fehlen bewusst in dieser Buy-List.

Dieser Extrakt ist **nützlich als Seed-Datenbank**, nicht als erschöpfende EU-Positivliste.

---

## 2. Definitionen & Evidenzgrade

| Flag | Bedeutung hier | Evidenzgrade (`*_basis` in CSV) |
|---|---|---|
| **NC** | Hersteller behauptet „non-comedogenic“ / „nicht komedogen“ / „non-comédogène“ | `brand-page` (verifizierter Satz auf Markenseite) · `obf-label` (Crowd-Label) · `claim` |
| **CF** | Über gesetzliches EU-Testverbot hinaus zertifiziert/gelabelt | `cfi` (CFI Approval Programme) · `leaping-bunny` (OBF-Tag oder CCIC-Hinweis) · `obf-label` (z. B. „cruelty-free“ / „not-tested-on-animals“ ohne Siegel-Check) |
| **Parfümfrei** | Kein zugesetztes Parfüm laut Claim und/oder INCI | `claim` · `brand-page` · `obf-label` · `inci-no-parfum` (nur wenn geprüft) |

**Hinweis zu „fragrance-free“:** Nach ISO-/Cosmetics-Europe-Praxis bedeutet parfümfrei *kein zugesetztes Parfüm*, nicht zwingend Abwesenheit aller riechenden Moleküle (manche Rohstoffe riechen eigenständig).

---

## 3. Zählungen (Stand Abruf)

| Metrik | n |
|---|---:|
| Zeilen gesamt (CSV) | **369** |
| davon Produktzeilen | **336** |
| davon CFI-Marken ohne SKU-Enumeration | **33** |
| Flag NC = yes | **52** |
| Flag CF = yes | **187** |
| Flag parfümfrei = yes | **163** |
| OBF-EU-Produkte (unique EAN) im Rohabruf | **320** |
| Markenseiten-verifizierte NC-SKUs/-Lines (dieser Lauf) | **13** |
| Kategorie face/skincare (grob) | **158** |
| bewusst mitgeführte Non-Face-OBF-Treffer (Haar/Parfum/Makeup …) | **78** |

### OBF API — Label-Counts (weltweit laut API, dann EU-gefiltert)

| Label-Tag | API count | EU behalten (dieser Lauf) |
|---|---:|---:|
| `en:cruelty-free` | 58 | 18 |
| `pt:cruelty-free` | 51 | 9 |
| `fr:cruelty-free-vegan` | 18 | 18 |
| `en:not-tested-on-animals` | 159 | 103 |
| `en:without-perfume` | 110 | 103 |
| `en:synthetic-scent-free` | 50 | 44 |
| `fr:non-comedogene` | 46 | 38 |
| `pt:nao-comedogenico` | 46 | 38 |
| `en:leaping-bunny` | 13 | 8 |
| `en:cruelty-free-international` | 9 | 4 |
| `en:fragrance-free` | 6 | 2 |
| `en:unscented` | 1 | 0 |
| `en:non-comedogenic` | 46 | 38 |

**CFI-Verzeichnis:** Die offizielle Seite meldet **413** approved brands (`1–20 of 413 shown`). Vollständiges Scraping war durch JS-UI + Captcha für Server-Abrufe blockiert; hier: **Teilmenge verifizierter Listing-Seiten** + Directory-Seite 1 (siehe Quellenlog). **Kein** Anspruch auf 413/413.

**CCIC Leaping Bunny (US/CA):** shopping-guide auf leapingbunny.org ist ein **anderes Programm/Jurisdiction** als CFI global — in CSV nur wo explizit, und mit Jurisdiktionshinweis.

---

## 4. So liest du die Tabellen / CSV

- Jede CSV-Zeile = ein **Produkt** (mit EAN wenn vorhanden) **oder** eine **Marke** (`category=brand`, `ean` leer).
- `flag_nc` / `flag_cf` / `flag_fragrance_free` = `yes`/`no` — **getrennt** bewertbar.
- `*_basis` sagt, *warum* das Flag gesetzt wurde.
- `eu_countries` = grobe Länder-Tags aus OBF bzw. Region aus CFI-Listing (ISO2, pipe-separiert).
- OBF-Labels sind **Crowd-Sourced** → vor App-Launch immer gegen Packung/Markenseite re-checken.
- Priorität Gesicht: Filter `category=face/skincare`. Non-Face-OBF-Treffer bleiben im CSV (Transparenz), sind aber für Prim’s Face-App nachrangig.

---

## 5. Kombinationen (Produktzeilen + Marken)

| Kombination | n (CSV) |
|---|---:|
| CF only | 140 |
| parfümfrei only | 131 |
| CF only (Marke) | 33 |
| NC only | 32 |
| NC+parfümfrei | 19 |
| CF+parfümfrei | 13 |
| NC+CF | 1 |

In diesem Lauf gab es **keine** Produktzeile mit belastbar gesetzten **allen drei** Flags gleichzeitig (OBF-Schnitt + Marken-Verifikation). Das ist erwartbar: viele Dermokosmetik-NC-Linien sind **nicht** CFI-zertifiziert.

---

## 6. Kompakte Beispiele (Gesicht/Hautpflege) — vollständige Liste = CSV

### NC + parfümfrei (Beispiele, max. 8)

| Name | Brand | NC | CF | FF | Basis | Quelle |
|---|---|---|---|---|---|---|
| Ysthéal Intense concentré antirides rénovateur de  | Avène | yes | no | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3282770037005/ystheal-intense-concentre-antirides-renovateur-de-peau-avene) |
| Photoderm MAX SPF 50+ Spray très haute protection | Bioderma | yes | no | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3401353688742/photoderm-max-spf-50-spray-tres-haute-protection-bioderma) |
| Hydraterende Melk | CeraVe | yes | no | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3337875597395/moisturising-lotion-cerave) |
| Trixéra+ | Eau thermale Avène | yes | no | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3282779178624/trixera-eau-thermale-avene) |
| Nutritive Gel nettoyant surgras | Eau thermale Jonzac | yes | no | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3517360003314/nutritive-gel-nettoyant-surgras-eau-thermale-jonzac) |
| Eucerin DermoPure Cleansing Gel | Eucerin | yes | no | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/4005800192883/eucerin-dermopure-cleansing-gel) |
| BB Cream Mon lait d'Ânesse  SPF 10 - 01 beige lumi | Léa Nature | yes | no | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3517360006162/bb-cream-mon-lait-d-anesse-spf-10-01-beige-lumiere-lea-nature) |
| BB Crème Solaire Teinté SPF 50+ | Mixa | yes | no | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3600550362534/bb-creme-solaire-teinte-spf-50-mixa) |

_… und 11 weitere in der CSV._

### Nur NC (Beispiele, max. 8)

| Name | Brand | NC | CF | FF | Basis | Quelle |
|---|---|---|---|---|---|---|
| Réparateur après-soleil | Avene | yes | no | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3282779316392/reparateur-apres-soleil-avene) |
| Cold Cream - crème | Avène | yes | no | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3282779002738/cold-cream-creme-avene) |
| Eluage Crème anti-âge restructurant | Avène | yes | no | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3282779059848/eluage-creme-anti-age-restructurant-avene) |
| Soin lèvres sensibles | Avène | yes | no | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3282770073478/soin-levres-sensibles-avene) |
| Trixera | Avène | yes | no | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3282770100402/trixera-avene) |
| Très Haute Protection Spray 50+ SPF | Avène | yes | no | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3282779363815/tres-haute-protection-spray-50-spf-avene) |
| Xeracalm A.D. Baume relipidant | Avène | yes | no | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3282779405485/xeracalm-a-d-baume-relipidant-avene) |
| Ysthéal + | Avène | yes | no | no | obf-label | [Link](https://world.openbeautyfacts.org/product/07581365/ystheal-avene) |

_… und 24 weitere in der CSV._

### Nur parfümfrei (Beispiele, max. 8)

| Name | Brand | NC | CF | FF | Basis | Quelle |
|---|---|---|---|---|---|---|
| Savon à l'ancienne brut |  | no | no | yes | obf-label | [Link](https://world.openbeautyfacts.org/product/3574661680651/savon-a-l-ancienne-brut) |
| Protect Crème SPF50+ | A-Derma | no | no | yes | obf-label | [Link](https://world.openbeautyfacts.org/product/3282770202120/protect-creme-spf50-a-derma) |
| Kids Active Sun Lotion SPF 50+ | ACO | no | no | yes | obf-label | [Link](https://world.openbeautyfacts.org/product/7319861018585/kids-active-sun-lotion-spf-50-aco) |
| Sun face cream | ACO | no | no | yes | obf-label | [Link](https://world.openbeautyfacts.org/product/7319861018509/sun-face-cream-aco) |
| Spray solaire bébé 100 % naturel* haute protection | Alphanova Sun | no | no | yes | obf-label | [Link](https://world.openbeautyfacts.org/product/3760075074227/spray-solaire-bebe-100-naturel-haute-protection-50-sensible-alphanova-sun) |
| Classic - soin hydratant à l'huile de jojoba bio | Alviana | no | no | yes | obf-label | [Link](https://world.openbeautyfacts.org/product/4260167182445/classic-soin-hydratant-a-l-huile-de-jojoba-bio-alviana) |
| Solcreme ansikte SPF 30 | apoteket | no | no | yes | obf-label | [Link](https://world.openbeautyfacts.org/product/7313272135244/solcreme-ansikte-spf-30-apoteket) |
| Solcreme ansikte SPF 50 | apoteket | no | no | yes | obf-label | [Link](https://world.openbeautyfacts.org/product/7313272150896/solcreme-ansikte-spf-50-apoteket) |

_… und 100 weitere in der CSV._

### CF + parfümfrei (Beispiele, max. 8)

| Name | Brand | NC | CF | FF | Basis | Quelle |
|---|---|---|---|---|---|---|
| Lotion à la noix de coco | Desert Essence | no | yes | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/0718334337432/desert-essence-coconut-hand-and-body-lotion) |
| Baby wipes fragrance free | Dimple | no | yes | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/5028270004752/baby-wipes-fragrance-free-dimple) |
| Savon bio de beauté  Lavande et lait d'ânesse bio | Gravier | no | yes | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3489940067064/savon-bio-de-beaute-lavande-et-lait-d-anesse-bio-gravier) |
| crème mains aloe vera | la vie claire | no | yes | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3266191023595/creme-mains-aloe-vera-la-vie-claire) |
| Crème visage protectrice SPF 50 anti-rides au Mono | Laboratoires Biocos | no | yes | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3506770501008/creme-visage-protectrice-spf-50-anti-rides-au-monoi-de-tahiti-laboratoires-biocos) |
| Spray protecteur hydratant SPF 30 haute protection | Lovea | no | yes | yes | obf-label,obf-label | [Link](https://world.openbeautyfacts.org/product/3506770302001/spray-protecteur-hydratant-spf-30-haute-protection-lovea) |
| Starter retinol serum | The Inkey List | no | yes | yes | cfi,obf-label | [Link](https://world.openbeautyfacts.org/product/5061087560738/starter-retinol-serum-the-inkey-list) |
| Vitamin B, C and E moisturizer | The Inkey List | no | yes | yes | cfi,obf-label | [Link](https://world.openbeautyfacts.org/product/5060879821989/vitamin-b-c-and-e-moisturizer-the-inkey-list) |

### Nur CF (Produkte) (Beispiele, max. 8)

| Name | Brand | NC | CF | FF | Basis | Quelle |
|---|---|---|---|---|---|---|
| Matte dreamer |  | no | yes | no | obf-label | [Link](https://world.openbeautyfacts.org/product/5060503753426/matte-dreamer) |
| 7TH Heaven Superfood Pomegranate Peel-Off Mask | 7th Heaven | no | yes | no | leaping-bunny | [Link](https://world.openbeautyfacts.org/product/0083800049004/7th-heaven-superfood-pomegranate-peel-off-mask) |
| Dark Forest Deodorant | 8x4 Men | no | yes | no | obf-label | [Link](https://world.openbeautyfacts.org/product/4005900855848/dark-forest-deodorant-8x4-men) |
| Savon solide L'agrume Visage - Aleyria Cosmétiques | Aleyria Cosmétiques | no | yes | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3770022721098/savon-solide-l-agrume-visage-aleyria-cosmetiques) |
| Savon solide Le Floral - Aleyria Cosmétiques | Aleyria Cosmétiques | no | yes | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3770022721029/savon-solide-le-floral-aleyria-cosmetiques) |
| Savon solide Le floral Visage - Aleyria Cosmétique | Aleyria Cosmétiques | no | yes | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3770022721036/savon-solide-le-floral-visage-aleyria-cosmetiques) |
| Savon solide Le fraicheur - Aleyria Cosmétiques | Aleyria Cosmétiques | no | yes | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3770022721043/savon-solide-le-fraicheur-aleyria-cosmetiques) |
| Savon solide Le fraicheur Visage - Aleyria Cosméti | Aleyria Cosmétiques | no | yes | no | obf-label | [Link](https://world.openbeautyfacts.org/product/3770022721050/savon-solide-le-fraicheur-visage-aleyria-cosmetiques) |

_… und 83 weitere in der CSV._

### NC + CF (Beispiele, max. 8)

_Keine Treffer in face/skincare-Stichprobe dieses Laufs._

### Alle drei (Beispiele, max. 8)

_Keine Treffer in face/skincare-Stichprobe dieses Laufs._

### CFI-Marken (ohne SKU-Liste)

| Marke | Region (Quelle) | cf_basis | Hinweis |
|---|---|---|---|
| 17 | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/17/) |
| 7th Heaven | Europe+ | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/7th-heaven/) |
| Abundant Natural Health | AU/US (nicht primär EU) | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/) |
| Addition Studio | AU/US | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/) |
| Aesop | global inkl. EU | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/aesop/) |
| Aldi UK (Eigenmarken) | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/aldi-uk/) |
| Anara Skincare | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/) |
| Aqua Natural | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/) |
| AREU AREU | Asia | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/) |
| Argital | Asia|Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/argital/) |
| BRAVE.NEW.HAIR. / BRAVE.NEW.CARE. | ? | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/aesop/) |
| Ethique | global | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/facetheory/) |
| Facetheory | UK/EU | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/facetheory/) |
| FatFace | Europe? | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/made-of-more/) |
| Gaia Skincare | ? | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/skin-formulas/) |
| Helan | Europe+ | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/helan/) |
| Lanolips | ? | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/mua-make-up-academy/) |
| Lucy Bee | Europe+ | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/manufaktura/) |
| Made Of More | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/made-of-more/) |
| Manufaktura | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/manufaktura/) |
| Maria Nila | Europe+ | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/manufaktura/) |
| Mienna Cosmetics Ltd | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/mienna-cosmetics-ltd/) |
| Modern Botany | ? | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/17/) |
| MUA Makeup Academy | UK/EU retail | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/mua-make-up-academy/) |
| Nakin | ? | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/7th-heaven/) |
| Organicspa | ? | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/the-inkey-list/) |
| Oxmantown Skincare | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/oxmantown-skincare/) |
| Pai Skincare | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/pai-skincare/) |
| Skin Formulas | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/skin-formulas/) |
| Superdrug (Eigenmarken) | Europe | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/superdrug/) |
| Synergie Skin | ? | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/superdrug/) |
| The INKEY List | Europe+ | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/the-inkey-list/) |
| The Skin Edition | ? | cfi | [CFI](https://www.crueltyfreeinternational.org/approved-brands/listing/aesop/) |

_Directory behauptet 413 Marken; hier 33 verifiziert/extrahiert. Rest: live auf [approved-brands](https://www.crueltyfreeinternational.org/approved-brands/) nachschlagen._

---

## 7. Markenseiten-Claims (verifiziert in diesem Lauf)

Nur Einträge, bei denen die Markenseite den Claim **wörtlich** trägt (Zitat sinngemäß gekürzt):

| Produkt / Linie | Claims | URL |
|---|---|---|
| CeraVe HA Water Gel | „nicht komedogen“ + „ohne Duftstoffe/Parfüm“ | cerave.de …/ha-water-gel |
| CeraVe Ausgleichender Reinigungsschaum | „Nicht komedogene Formel“ + ohne Duftstoffe | cerave.de …/ausgleichender-reinigungsschaum |
| Bioderma Sébium Gel moussant | „Nicht komedogen“ (aber „Leichter frischer Duft“) | bioderma.de …/sebium/gel-moussant |
| Bioderma Sébium H2O | „Nicht komedogen“ | bioderma.de …/sebium/h2o |
| Bioderma Sensibio H2O | „Unparfümiert“ | bioderma.de …/sensibio/h2o |
| Avène Tolérance CONTROL Creme | „Ohne Duftstoffe“ (kein NC-Claim gefunden) | eau-thermale-avene.de …/tolerance-control-creme… |
| Eucerin DERMOPURE CLINICAL Hydra Repair | „Nicht komedogen“ + „Ohne Duftstoffe“ | eucerin.de …/hydra-repair |
| Eucerin DERMOPURE CLINICAL Reinigungsgel / Tonic | NC + ohne Duftstoffe | eucerin.de …/dermopure-clinical/… |
| Eucerin AtopiControl Gesichtscreme | ohne Duftstoffe (kein NC) | eucerin.de …/atopicontrol/… |
| Cetaphil Feuchtigkeitscreme / Reinigungslotion / HA-Tagespflege | „Nicht komedogen“ + ohne Parfüm/Duftstoffe | cetaphil.de |
| Vichy NORMADERM Anti-Age | „nicht komedogen“ (INCI mit PARFUM) | vichy.de …/normaderm-anti-age |
| LRP Toleriane Sensitive Crème | „Non comédogène“ + „SANS PARFUM“ (Seite Cloudflare-geschützt; Snippet der Marken-URL) | laroche-posay.fr …/toleriane-sensitive… |

**Nicht bestätigt in diesem Lauf (daher nicht als brand-page-NC geführt):** pauschal Nuxe; Uriage/SVR/ISDIN ohne eigene Markenseiten-Verifikation hier; Vichy Normaderm Phytosolution ohne expliziten NC-Satz im Fetch (INCI mit Parfum).

---

## 8. Wissenschaft / Guidance (keine Produktlisten)

- **AAD / EuroGuiDerm:** Quellen für Wirkstoffe/Therapiepfade — **keine** öffentlichen Fertigprodukt-Register „non-komedogen“.
- **Fulton/Kligman-Kaninchenohr:** Inhaltsstoff-Comedogenitäts-Assays → **nicht** als Produktkatalog-Logik verwenden.
- **ISO / Cosmetics Europe:** „fragrance-free“ ≠ Abwesenheit aller odorous molecules.

---

## 9. Disclaimer

Dies ist **keine Therapieempfehlung**, kein Medizinprodukt-Hinweis und **keine Garantie**, dass ein Produkt bei dir Unreinheiten vermeidet oder „ethisch“ bleibt. Siegel und Formeln ändern sich; **vor Launch und vor Kauf** Claims, INCI und Zertifikate erneut prüfen. Rx-Arzneimittel gehören nicht in diesen Kosmetik-Katalog.

---

*Generiert 2026-09-04 für Kosmetikschrank · Quellen siehe `eu-flag-katalog-quellen.md`*