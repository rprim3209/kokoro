// ==========================================
// Catalog & Database Module
// Contains default databases, Live dm integration, and CSV synchronization
// ==========================================

// Catalog Database with accurate classes, pharmacy truths, and local DACH alternatives
const DB = {
  water: { id:"water", name:"Nur lauwarmes Wasser", brand:"Routine", kat:"reiniger", schiene:"support", klassen:[], shape:"glass", c:"#dbeaf5", wirk:"Milde Reinigung", nc:true, ff:true, cf:true },
  ceraveWash: { id:"ceraveWash", name:"Hydrating Cleanser", brand:"CeraVe", kat:"reiniger", schiene:"support", klassen:[], shape:"pump", c:"#89bfe3", wirk:"Ceramide + Hyaluron", nc:true, ff:true, cf:false, store:"dm / Apotheke (~11 €)" },
  baleaWash: { id:"baleaWash", name:"Ultra Sensitive Waschgel", brand:"Balea Med", kat:"reiniger", schiene:"support", klassen:[], shape:"tube", c:"#76a9c7", wirk:"Parfümfrei & Tensid-mild", nc:true, ff:true, cf:false, store:"dm (~2,45 €)" },
  
  ha: { id:"ha", name:"Hyaluronic Acid Serum", brand:"Good Molecules", kat:"serum", schiene:"support", klassen:["humectant"], shape:"serum", c:"#6aa8c9", wirk:"Hyaluron Feuchte", nc:true, ff:true, cf:true, cf_basis:"Leaping Bunny", store:"Online / Import (~12 €)" },
  
  aza: { id:"aza", name:"Azelaic Acid Suspension 10%", brand:"The Ordinary", kat:"serum", schiene:"kosmetik", klassen:["azelaic"], shape:"serum", c:"#d9c488", wirk:"Azelainsäure 10%", nc:true, ff:true, cf:true, cf_basis:"Leaping Bunny", store:"Douglas / dm (~12 €)", pih:true, truth:"10% Azelain ist mild keratolytisch und rötungsmindernd. Keine 15-20% Rx-Wirkung, aber gut verträglich." },
  apad: { id:"apad", name:"aPAD 20% Azelaic Derivat", brand:"Geek & Gorgeous", kat:"serum", schiene:"kosmetik", klassen:["azelaic"], shape:"serum", c:"#d4bf7b", wirk:"PAD (Azelain-Derivat)", nc:true, ff:true, cf:true, cf_basis:"Cruelty-Free", store:"dm / Online (~10,50 €)", pih:true, truth:"Evidenzbasierter Tyrosinasehemmer: Reduziert post-inflammatorische Hyperpigmentierung (PIH) sanft ohne Barriere-Stress." },

  adap: { id:"adap", name:"Adapalen Gel (0.1%)", brand:"Arzneimittel (Rx)", kat:"active", schiene:"arzneimittel", klassen:["retinoid_rx"], shape:"tube", c:"#58408a", wirk:"Adapalen (Rx-Retinoid)", rx:true, nc:true, ff:true, store:"Nur auf Rezept", truth:"Photostabil, stark gegen Komedonen. Nicht mit frei gestapeltem BPO oder starken Säuren kombinieren!" },
  clienzo: { id:"clienzo", name:"Clienzo Gel (Clindamycin + BPO)", brand:"Arzneimittel (Rx)", kat:"spot", schiene:"arzneimittel", klassen:["ab_top","bpo"], shape:"tube", c:"#3d5a80", wirk:"BPO 5% + Clinda 1%", rx:true, nc:true, ff:true, store:"Nur auf Rezept", truth:"Feste Galenik gegen Papeln/Pusteln. Bleicht Kissen. Wechsel mit Adapalen schont die Barriere." },

  purito: { id:"purito", name:"Mighty Bamboo Panthenol Cream", brand:"Purito", kat:"creme", schiene:"support", klassen:["support"], shape:"jar", c:"#bad19f", wirk:"10% Panthenol", nc:true, ff:true, cf:true, cf_basis:"PETA Vegan & Cruelty-Free", store:"EU-Shop (~18 €)", truth:"Hervorragende Begleitpflege bei Retinoid-Trockenheit." },
  baleaCreme: { id:"baleaCreme", name:"Ultra Sensitive Intensivcreme", brand:"Balea Med", kat:"creme", schiene:"support", klassen:["support"], shape:"jar", c:"#a4c8a8", wirk:"Cica + Panthenol", nc:true, ff:true, cf:false, store:"dm (~3,95 €)", truth:"Sehr gutes Reizarmut-Profil für unter 4 €." },
  ceraveMoist: { id:"ceraveMoist", name:"Feuchtigkeitsspendende Creme", brand:"CeraVe", kat:"creme", schiene:"support", klassen:["support"], shape:"jar", c:"#8ec4e6", wirk:"3 Ceramide + MVE", nc:true, ff:true, cf:false, store:"dm / Apotheke (~12 €)" },
  sebium: { id:"sebium", name:"Sébium Hydra Begleitpflege", brand:"Bioderma", kat:"creme", schiene:"support", klassen:["support"], shape:"jar", c:"#8fc9c0", wirk:"Akne-Begleitpflege", nc:true, ff:true, cf:false, store:"Apotheke (~16 €)" },

  anthelios: { id:"anthelios", name:"Anthelios UVMune 400 LSF 50+", brand:"La Roche-Posay", kat:"spf", schiene:"support", klassen:["uv"], shape:"tube", c:"#e6c86e", wirk:"Mexoryl 400 UV-Schutz", nc:true, ff:true, cf:false, no_white_cast:true, store:"Apotheke (~19 €)", truth:"Sehr hohe Breitband-Absorption bis 400nm (Ultra-lange UVA-Strahlen). Zieht rückstandslos ohne Grauschleier ein." },
  antheliosTinted: { id:"antheliosTinted", name:"Anthelios UVMune 400 Getöntes Fluid LSF 50+", brand:"La Roche-Posay", kat:"spf", schiene:"support", klassen:["uv"], shape:"tube", c:"#d4a359", wirk:"Mexoryl 400 + Eisenoxide", nc:true, ff:true, cf:false, iron_ox:true, no_white_cast:true, pih:true, countries:["DE","AT","FR","EU"], store:"Apotheke (~21 € · DE, AT, EU)", truth:"Enthält Eisenoxide (CI 77491, 77492, 77499) für nachgewiesenen Schutz vor sichtbarem Licht (HEV / Blue Light) — dermatologischer Goldstandard zur Vorbeugung von Melasma und PIH.", notes:"Empfohlen von AAD & EADV bei Fitzpatrick IV–VI zur Vermeidung sichtlicht-induzierter Hyperpigmentierung." },
  baleaSpf: { id:"baleaSpf", name:"Ultra Sensitive Sonnenfluid LSF 50+", brand:"Balea Med", kat:"spf", schiene:"support", klassen:["uv"], shape:"tube", c:"#ecd37b", wirk:"EU Breitbandfilter", nc:true, ff:true, cf:false, no_white_cast:true, store:"dm (~5,95 €)", truth:"Sehr leichtes, transparentes Fluid ohne Weißeln / White-Cast. Reizarm & parfümfrei." },

  // Additional DACH Drugstore & Pharmacy Staples
  isanaWash: { id:"isanaWash", name:"Pure Reinigungsschaum", brand:"Isana", kat:"reiniger", schiene:"support", klassen:[], shape:"pump", c:"#7ebbc4", wirk:"Milde Tenside", nc:true, ff:true, cf:false, store:"Rossmann (~2,95 €)", truth:"Günstig, reizarm und ohne Parfüm." },
  isanaCreme: { id:"isanaCreme", name:"Pure Feuchtigkeitscreme", brand:"Isana", kat:"creme", schiene:"support", klassen:["support"], shape:"tube", c:"#99c2b4", wirk:"Niacinamid + Panthenol", nc:true, ff:true, cf:false, store:"Rossmann (~3,95 €)", truth:"Leichte Formulierung, perfekt als unkomplizierte Basispflege." },
  mixaPanthenol: { id:"mixaPanthenol", name:"Panthenol Comfort SOS Creme", brand:"Mixa", kat:"creme", schiene:"support", klassen:["support"], shape:"jar", c:"#7da8cc", wirk:"13% Glycerin + Panthenol", nc:true, ff:true, cf:false, store:"dm / Rossmann (~6,95 €)", truth:"Hervorragend zur Regeneration einer gestressten Barriere." },
  noHydrator: { id:"noHydrator", name:"120h Liquid Hydrator", brand:"Nø Cosmetics", kat:"serum", schiene:"support", klassen:["humectant"], shape:"pump", c:"#6bb5a3", wirk:"Panthenol + Ectoin", nc:true, ff:true, cf:true, cf_basis:"PETA Approved", store:"dm / Rossmann (~9,95 €)", truth:"Spendet tiefenwirksam Feuchtigkeit ohne die Poren zu belasten." },
  bbomb: { id:"bbomb", name:"B-Bomb 10% Niacinamide Serum", brand:"Geek & Gorgeous", kat:"serum", schiene:"kosmetik", klassen:["niacinamide"], shape:"serum", c:"#b5b89a", wirk:"Niacinamid 10% + Zink", nc:true, ff:true, cf:true, cf_basis:"Cruelty-Free", store:"dm / Online (~8,50 €)", pih:true, truth:"Sehr leichte Textur, hemmt den Melanosomen-Transfer und reduziert post-inflammatorische Flecken (PIH)." },
  skinoren: { id:"skinoren", name:"Skinoren 15% / 20% Gel", brand:"Arzneimittel (Rx)", kat:"active", schiene:"arzneimittel", klassen:["azelaic"], shape:"tube", c:"#c2a759", wirk:"Azelainsäure 15–20%", rx:true, nc:true, ff:true, pih:true, store:"Nur auf Rezept", truth:"Medizinische Azelainsäure ist stark antientzündlich und hemmt Pickelmale (PIH). Sehr gut verträglich." },
  epiduo: { id:"epiduo", name:"Epiduo 0.1% / 2.5% Gel", brand:"Arzneimittel (Rx)", kat:"active", schiene:"arzneimittel", klassen:["retinoid_rx", "bpo"], shape:"tube", c:"#4a3c6d", wirk:"Adapalen + BPO Kombi", rx:true, nc:true, ff:true, store:"Nur auf Rezept", truth:"Leitlinien-Goldstandard: Kombiniert Porenregulierung mit antibakteriellem BPO in einer formulierten Galenik." },

  // Candidates for scanning simulation
  glycolic: { id:"glycolic", name:"Glycolic Acid 7% Toning Solution", brand:"The Ordinary", kat:"serum", schiene:"kosmetik", klassen:["aha"], shape:"serum", c:"#e07a68", wirk:"AHA Glykolsäure 7%", ff:true, cf:true, cf_basis:"Leaping Bunny", store:"Douglas / dm (~14 €)", truth:"7% Glykol peelt intensiv und senkt den pH. Zusammen mit Adapalen am selben Abend droht Barriereschaden. Bei PIH-Neigung Vorsicht vor Rebound-Hyperpigmentierung!" },
  bha: { id:"bha", name:"Skin Perfecting 2% BHA Liquid", brand:"Paula's Choice", kat:"serum", schiene:"kosmetik", klassen:["bha"], shape:"serum", c:"#3d7b56", wirk:"Salicylsäure 2%", nc:true, ff:true, cf:true, cf_basis:"Leaping Bunny", store:"Douglas / Online (~39 €)", truth:"Dringt fettlöslich in die Pore ein. Nicht am selben Abend wie Adapalen schichten! Als Skin Cycling an Säure-Abenden hervorragend." },
  retinol: { id:"retinol", name:"Retinol 0.2% in Squalane", brand:"The Ordinary", kat:"serum", schiene:"kosmetik", klassen:["retinoid_cos"], shape:"serum", c:"#c8a268", wirk:"Kosmetisches Retinol", ff:true, cf:true, cf_basis:"Leaping Bunny", store:"dm / Online (~9 €)", truth:"Du nutzt bereits Adapalen (Rx). Ein zusätzliches kosmetisches Retinol bringt null Mehrwert, sondern schält nur die Haut ab." },
  nia10: { id:"nia10", name:"Niacinamide 10% + Zinc 1%", brand:"The Ordinary", kat:"serum", schiene:"kosmetik", klassen:["niacinamide"], shape:"serum", c:"#e3e1cb", wirk:"Niacinamid 10%", ff:true, cf:true, cf_basis:"Leaping Bunny", pih:true, store:"dm (~7 €)", truth:"Wissenschaftliche Studien zeigen Wirksamkeit bei 2–5%. 10% hemmt Melanin-Transfer gegen Pickelmale, kann bei empfindlicher Haut aber vorübergehend Rötungen triggern." },
  cleanGlow: { id:"cleanGlow", name:"Glow Miracle Zitrus Peeling-Öl", brand:"Clean Beauty Co.", kat:"serum", schiene:"kosmetik", klassen:["barrier_stress"], shape:"serum", c:"#e69f43", wirk:"Ätherische Öle & Duftstoffe", ff:false, nc:false, cf:true, store:"Douglas (~24 €)", truth:"Enthält Limonene, Linalool und Zitrusöle. Bei aktiver Adapalen-Therapie ein garantierter Reiz-Trigger für deine Barriere!" }
};

// EU-Flag-Katalog Gesicht (168 Produkte aus eu-flag-katalog-gesicht.csv)
const EU_FLAG_CATALOG = {
  "bioderma_s_bium_gel_moussant": { id: "bioderma_s_bium_gel_moussant", name: "Sébium Gel moussant", brand: "Bioderma", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "pump", c: "#7ebbc4", wirk: "Zink + Kupfersulfat", nc: true, cf: null, ff: false, ean: "", store: "Apotheke / Handel (DE, AT, FR, EU)", url: "https://www.bioderma.de/unsere-produkte/sebium/gel-moussant", notes: "Claim: 'Nicht komedogen'; Seite sagt auch 'Leichter frischer Duft' → nicht parfümfrei" },
  "bioderma_s_bium_h2o": { id: "bioderma_s_bium_h2o", name: "Sébium H2O", brand: "Bioderma", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#89bfe3", wirk: "Mizellen + Zinkgluconat", nc: true, cf: null, ff: null, ean: "", store: "Apotheke / Handel (DE, AT, FR, EU)", url: "https://www.bioderma.de/unsere-produkte/sebium/h2o", notes: "Claim: 'Nicht komedogen'" },
  "cerave_ausgleichender_reinigungssch": { id: "cerave_ausgleichender_reinigungssch", name: "Ausgleichender Reinigungsschaum", brand: "CeraVe", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "pump", c: "#76a9c7", wirk: "3 Ceramide + Niacinamid", nc: true, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.cerave.de/hautpflege/reinigung-fuer-gesicht-und-koerper/ausgleichender-reinigungsschaum", notes: "Claim: 'Nicht komedogene Formel' + 'ohne Duftstoffe oder Parabene'" },
  "cerave_feuchtigkeitsspendendes_ha_w": { id: "cerave_feuchtigkeitsspendendes_ha_w", name: "Feuchtigkeitsspendendes HA Water Gel", brand: "CeraVe", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#99c2b4", wirk: "Hyaluron + 3 Ceramide", nc: true, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.cerave.de/hautpflege/gesichtspflege/feuchtigkeitsspendendes-ha-water-gel", notes: "Claim: 'nicht komedogen … und ohne Duftstoffe' / 'ohne Parfüm'; INCI ohne Parfum/Fragrance geprüft auf Produktseite" },
  "cetaphil_feuchtigkeitscreme": { id: "cetaphil_feuchtigkeitscreme", name: "Feuchtigkeitscreme", brand: "Cetaphil", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#7da8cc", wirk: "Niacinamid + Panthenol", nc: true, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/feuchtigkeitscreme/1874015.html", notes: "Claim: 'Nicht komedogen' + 'Ohne Parfüm'; INCI ohne Parfum" },
  "cetaphil_sanfte_reinigungslotion": { id: "cetaphil_sanfte_reinigungslotion", name: "Sanfte Reinigungslotion", brand: "Cetaphil", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#9ad2cb", wirk: "Milde Tenside + Glycerin", nc: true, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.cetaphil.de/produktkategorie/reinigung/reinigungslotion/7127319.html", notes: "Claim: 'Nicht komedogen' + 'duftstofffreie Reinigungslotion'" },
  "cetaphil_sanfte_tagespflege_mit_hyalu": { id: "cetaphil_sanfte_tagespflege_mit_hyalu", name: "Sanfte Tagespflege mit Hyaluronsäure", brand: "Cetaphil", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hyaluronsäure + Glycerin", nc: true, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/tagespflege-mit-hyalurons%C3%A4ure/14136571.html", notes: "Claim: 'Nicht komedogen' + 'Ohne Duftstoffe'" },
  "eucerin_dermopure_clinical_hydra_rep": { id: "eucerin_dermopure_clinical_hydra_rep", name: "DERMOPURE CLINICAL Hydra Repair", brand: "Eucerin", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Ceramide + SymSitive", nc: true, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.eucerin.de/produkte/dermopure-clinical/hydra-repair", notes: "Claim: 'Nicht komedogen' + 'Ohne Duftstoffe'" },
  "eucerin_dermopure_clinical_kl_rendes": { id: "eucerin_dermopure_clinical_kl_rendes", name: "DERMOPURE CLINICAL Klärendes Tonic", brand: "Eucerin", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#76a9c7", wirk: "2% Milchsäure (Lactic Acid)", nc: true, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.eucerin.de/produkte/dermopure-clinical/klaerendes-tonic", notes: "Claim: 'Nicht komedogen' + 'Ohne Duftstoffe'" },
  "eucerin_dermopure_clinical_mat_fluid": { id: "eucerin_dermopure_clinical_mat_fluid", name: "DERMOPURE CLINICAL Mat Fluid", brand: "Eucerin", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#99c2b4", wirk: "Salicylsäure + Carnitin", nc: true, cf: null, ff: false, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.eucerin.de/produkte/dermopure-clinical/mat-fluid", notes: "Claim: 'Nicht komedogen'; Parfümfrei nicht in Fetch bestätigt → FF=no" },
  "eucerin_dermopure_clinical_porenverf": { id: "eucerin_dermopure_clinical_porenverf", name: "DERMOPURE CLINICAL Porenverfeinerndes Reinigungsgel", brand: "Eucerin", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#82c4ba", wirk: "6% Ampho-Tenside", nc: true, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.eucerin.de/produkte/dermopure-clinical/porenverfeinerndes-reinigungsgel", notes: "Claim: 'Nicht komedogen'; 'Frei von Duftstoffen'" },
  "la_roche_posay_toleriane_sensitive_cr_me": { id: "la_roche_posay_toleriane_sensitive_cr_me", name: "Toleriane Sensitive Crème", brand: "La Roche-Posay", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Prebiotika + Niacinamid", nc: true, cf: null, ff: true, ean: "", store: "La Roche-Posay · FR, DE, AT, EU", url: "https://www.laroche-posay.fr/gammes/visage/toleriane/toleriane-sensitive-creme.-soin-hydratant-apaisant-protecteur/LRP_128.html", notes: "Claim laut Markenseite (Snippet): 'Non comédogène' + 'SANS PARFUM'; Direktabruf Cloudflare-blockiert — vor Launch Seite erneut öffnen" },
  "vichy_normaderm_anti_age": { id: "vichy_normaderm_anti_age", name: "NORMADERM Anti-Age", brand: "Vichy", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "LHA + Glykolsäure + Vit C", nc: true, cf: null, ff: false, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.vichy.de/alle-produkte/hautpflege/tagescremes/akne/normaderm-anti-age", notes: "Claim: 'nicht komedogen'; INCI enthält PARFUM/FRAGRANCE → FF=no" },
  "ean_0083800049004": { id: "ean_0083800049004", name: "Superfood Pomegranate Peel-Off Mask", brand: "7th Heaven", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "0083800049004", store: "7th Heaven · NL", url: "https://world.openbeautyfacts.org/product/0083800049004/7th-heaven-superfood-pomegranate-peel-off-mask", notes: "OBF-Label crowd-sourced; Siegel vor Launch re-checken" },
  "ean_3282770202120": { id: "ean_3282770202120", name: "Protect Crème SPF50+", brand: "A-Derma", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#f2c974", wirk: "Barriestolide + SPF 50+", nc: null, cf: null, ff: true, ean: "3282770202120", store: "A-Derma · FR", url: "https://world.openbeautyfacts.org/product/3282770202120/protect-creme-spf50-a-derma", notes: "" },
  "ean_7319861018585": { id: "ean_7319861018585", name: "Kids Active Sun Lotion SPF 50+", brand: "ACO", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#e5be62", wirk: "Breitband-Filter SPF 50+", nc: null, cf: null, ff: true, ean: "7319861018585", store: "ACO · SE", url: "https://world.openbeautyfacts.org/product/7319861018585/kids-active-sun-lotion-spf-50-aco", notes: "" },
  "ean_7319861018509": { id: "ean_7319861018509", name: "Sun face cream", brand: "ACO", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Triple Moist Complex SPF 50", nc: null, cf: null, ff: true, ean: "7319861018509", store: "ACO · NL, SE", url: "https://world.openbeautyfacts.org/product/7319861018509/sun-face-cream-aco", notes: "" },
  "ean_3770022721098": { id: "ean_3770022721098", name: "Savon solide L'agrume Visage - Aleyria Cosmétiques", brand: "Aleyria Cosmétiques", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#9ad2cb", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3770022721098", store: "Aleyria Cosmétiques · FR", url: "https://world.openbeautyfacts.org/product/3770022721098/savon-solide-l-agrume-visage-aleyria-cosmetiques", notes: "" },
  "ean_3770022721036": { id: "ean_3770022721036", name: "Savon solide Le floral Visage - Aleyria Cosmétiques", brand: "Aleyria Cosmétiques", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#7ebbc4", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3770022721036", store: "Aleyria Cosmétiques · FR", url: "https://world.openbeautyfacts.org/product/3770022721036/savon-solide-le-floral-visage-aleyria-cosmetiques", notes: "" },
  "ean_3770022721050": { id: "ean_3770022721050", name: "Savon solide Le fraicheur Visage - Aleyria Cosmétiques", brand: "Aleyria Cosmétiques", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#89bfe3", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3770022721050", store: "Aleyria Cosmétiques · FR", url: "https://world.openbeautyfacts.org/product/3770022721050/savon-solide-le-fraicheur-visage-aleyria-cosmetiques", notes: "" },
  "ean_3770022721012": { id: "ean_3770022721012", name: "Savon solide Le Naturel Visage- Aleyria Cosmétiques", brand: "Aleyria Cosmétiques", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#76a9c7", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3770022721012", store: "Aleyria Cosmétiques · FR", url: "https://world.openbeautyfacts.org/product/3770022721012/savon-solide-le-naturel-visage-aleyria-cosmetiques", notes: "" },
  "ean_3770022721074": { id: "ean_3770022721074", name: "Savon solide Le Provençal Visage - Aleyria Cosmétiques", brand: "Aleyria Cosmétiques", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#a3ccd9", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3770022721074", store: "Aleyria Cosmétiques · FR", url: "https://world.openbeautyfacts.org/product/3770022721074/savon-solide-le-provencal-visage-aleyria-cosmetiques", notes: "" },
  "ean_3760075074227": { id: "ean_3760075074227", name: "Spray solaire bébé 100 % naturel* haute protection - 50 sensible", brand: "Alphanova Sun", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "3760075074227", store: "Alphanova Sun · FR", url: "https://world.openbeautyfacts.org/product/3760075074227/spray-solaire-bebe-100-naturel-haute-protection-50-sensible-alphanova-sun", notes: "" },
  "ean_7313272135244": { id: "ean_7313272135244", name: "Solcreme ansikte SPF 30", brand: "apoteket", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#f0cf70", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "7313272135244", store: "apoteket · SE", url: "https://world.openbeautyfacts.org/product/7313272135244/solcreme-ansikte-spf-30-apoteket", notes: "" },
  "ean_7313272150896": { id: "ean_7313272150896", name: "Solcreme ansikte SPF 50", brand: "apoteket", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ecd37b", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "7313272150896", store: "apoteket · SE", url: "https://world.openbeautyfacts.org/product/7313272150896/solcreme-ansikte-spf-50-apoteket", notes: "" },
  "ean_7313272153712": { id: "ean_7313272153712", name: "Solfluid ansikte", brand: "apoteket", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "7313272153712", store: "apoteket · SE", url: "https://world.openbeautyfacts.org/product/7313272153712/solfluid-ansikte-apoteket", notes: "" },
  "ean_7313272135268": { id: "ean_7313272135268", name: "Sollotion högt skydd SPF 30", brand: "apoteket", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#f2c974", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "7313272135268", store: "apoteket · SE", url: "https://world.openbeautyfacts.org/product/7313272135268/sollotion-hogt-skydd-spf-30-apoteket", notes: "" },
  "ean_7313272139747": { id: "ean_7313272139747", name: "Sollotion SPF 30", brand: "apoteket", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#e5be62", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "7313272139747", store: "apoteket · SE", url: "https://world.openbeautyfacts.org/product/7313272139747/sollotion-spf-30-apoteket", notes: "" },
  "ean_7313272150940": { id: "ean_7313272150940", name: "Solspray SPF 30", brand: "apoteket", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "7313272150940", store: "apoteket · SE", url: "https://world.openbeautyfacts.org/product/7313272150940/solspray-spf-30-apoteket", notes: "" },
  "ean_8436024790016": { id: "ean_8436024790016", name: "Gel aloe Vera puro", brand: "Atlantia", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "8436024790016", store: "Atlantia · ES", url: "https://world.openbeautyfacts.org/product/8436024790016/gel-aloe-vera-puro-atlantia", notes: "" },
  "ean_3282779316392": { id: "ean_3282779316392", name: "Réparateur après-soleil", brand: "Avene", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3282779316392", store: "Avene · FR", url: "https://world.openbeautyfacts.org/product/3282779316392/reparateur-apres-soleil-avene", notes: "" },
  "ean_3282770138801": { id: "ean_3282770138801", name: "Tolérance CONTROL Creme", brand: "Avène", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Ohne Duftstoffe", nc: null, cf: null, ff: true, ean: "3282770138801", store: "Avène · DE, AT, FR, EU", url: "https://www.eau-thermale-avene.de/p/tolerance-control-creme-3282770138801-0c591b54", notes: "Claim: 'Ohne Duftstoffe'; INCI ohne Parfum/Fragrance auf Markenseite; kein NC-Claim gefunden → NC=no" },
  "ean_3282779002738": { id: "ean_3282779002738", name: "Cold Cream - crème", brand: "Avène", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3282779002738", store: "Avène · FR", url: "https://world.openbeautyfacts.org/product/3282779002738/cold-cream-creme-avene", notes: "" },
  "ean_3282779059848": { id: "ean_3282779059848", name: "Eluage Crème anti-âge restructurant", brand: "Avène", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3282779059848", store: "Avène · FR", url: "https://world.openbeautyfacts.org/product/3282779059848/eluage-creme-anti-age-restructurant-avene", notes: "" },
  "ean_3282770073478": { id: "ean_3282770073478", name: "Soin lèvres sensibles", brand: "Avène", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#7da8cc", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3282770073478", store: "Avène · FR", url: "https://world.openbeautyfacts.org/product/3282770073478/soin-levres-sensibles-avene", notes: "" },
  "ean_3282770100402": { id: "ean_3282770100402", name: "Trixera", brand: "Avène", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3282770100402", store: "Avène · FR", url: "https://world.openbeautyfacts.org/product/3282770100402/trixera-avene", notes: "" },
  "ean_3282779363815": { id: "ean_3282779363815", name: "Très Haute Protection Spray 50+ SPF", brand: "Avène", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ecd37b", wirk: "Breitband UV-Schutz", nc: true, cf: null, ff: null, ean: "3282779363815", store: "Avène · FR", url: "https://world.openbeautyfacts.org/product/3282779363815/tres-haute-protection-spray-50-spf-avene", notes: "" },
  "ean_3282779405485": { id: "ean_3282779405485", name: "Xeracalm A.D. Baume relipidant", brand: "Avène", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3282779405485", store: "Avène · FR", url: "https://world.openbeautyfacts.org/product/3282779405485/xeracalm-a-d-baume-relipidant-avene", notes: "" },
  "ean_07581365": { id: "ean_07581365", name: "Ysthéal +", brand: "Avène", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "07581365", store: "Avène · FR", url: "https://world.openbeautyfacts.org/product/07581365/ystheal-avene", notes: "" },
  "ean_3282770037005": { id: "ean_3282770037005", name: "Ysthéal Intense concentré antirides rénovateur de peau", brand: "Avène", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#d9c488", wirk: "Retinaldehyd + Pre-Tocopheryl", nc: true, cf: null, ff: true, ean: "3282770037005", store: "Avène · FR", url: "https://world.openbeautyfacts.org/product/3282770037005/ystheal-intense-concentre-antirides-renovateur-de-peau-avene", notes: "" },
  "ean_4005900261038": { id: "ean_4005900261038", name: "NIVEA SUN Protect & Sensitive Sun Lotion SPF 30", brand: "Beiersdorf", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "4005900261038", store: "Beiersdorf · SE", url: "https://world.openbeautyfacts.org/product/4005900261038/nivea-sun-protect-sensitive-sun-lotion-spf-30-beiersdorf", notes: "" },
  "ean_4005900127365": { id: "ean_4005900127365", name: "Protect & Sensitive 50", brand: "Beiersdorf", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "4005900127365", store: "Beiersdorf · FR", url: "https://world.openbeautyfacts.org/product/4005900127365/protect-sensitive-50-beiersdorf", notes: "" },
  "ean_8480010207170": { id: "ean_8480010207170", name: "Natural Crema de Manos", brand: "Belle", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "8480010207170", store: "Belle · ES", url: "https://world.openbeautyfacts.org/product/8480010207170/natural-crema-de-manos-belle", notes: "" },
  "ean_6414504296106": { id: "ean_6414504296106", name: "Suihkusaippua", brand: "Berner", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "6414504296106", store: "Berner · FI", url: "https://world.openbeautyfacts.org/product/6414504296106/suihkusaippua-berner", notes: "" },
  "ean_3329310002113": { id: "ean_3329310002113", name: "Masque visage purifiant Argile verte", brand: "Biocos", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3329310002113", store: "Biocos · FR", url: "https://world.openbeautyfacts.org/product/3329310002113/masque-visage-purifiant-argile-verte-biocos", notes: "" },
  "bioderma_sensibio_h2o": { id: "bioderma_sensibio_h2o", name: "Sensibio H2O", brand: "Bioderma", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#a3ccd9", wirk: "Mizellen-Technologie (reizarm)", nc: null, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, FR, EU)", url: "https://www.bioderma.de/unsere-produkte/sensibio/h2o", notes: "Claim: 'Unparfümiert'" },
  "ean_3401573670053": { id: "ean_3401573670053", name: "Créaline TS H2O Solution micellaire", brand: "Bioderma", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#82c4ba", wirk: "Mizellenwasser für trockene Haut", nc: null, cf: null, ff: true, ean: "3401573670053", store: "Bioderma · FR", url: "https://world.openbeautyfacts.org/product/3401573670053/crealine-ts-h2o-solution-micellaire-bioderma", notes: "" },
  "ean_3401353688513": { id: "ean_3401353688513", name: "Photoderm Bronz SPF 50+", brand: "Bioderma", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#f0cf70", wirk: "Cellular Protection SPF 50+", nc: true, cf: null, ff: null, ean: "3401353688513", store: "Bioderma · FR", url: "https://world.openbeautyfacts.org/product/3401353688513/photoderm-bronz-spf-50-bioderma", notes: "" },
  "ean_3401353688742": { id: "ean_3401353688742", name: "Photoderm MAX SPF 50+ Spray très haute protection", brand: "Bioderma", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ecd37b", wirk: "Cellular Bioprotection SPF 50+", nc: true, cf: null, ff: true, ean: "3401353688742", store: "Bioderma · FR", url: "https://world.openbeautyfacts.org/product/3401353688742/photoderm-max-spf-50-spray-tres-haute-protection-bioderma", notes: "" },
  "ean_5017634247843": { id: "ean_5017634247843", name: "Anti-boutons", brand: "Bioré", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "5017634247843", store: "Bioré · FR", url: "https://world.openbeautyfacts.org/product/5017634247843/anti-boutons-biore", notes: "" },
  "ean_5028197417574": { id: "ean_5028197417574", name: "Canneberge givrée - lotion scintillante", brand: "Body Shop", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "5028197417574", store: "Body Shop · FR", url: "https://world.openbeautyfacts.org/product/5028197417574/canneberge-givree-lotion-scintillante-body-shop", notes: "" },
  "ean_5028197417482": { id: "ean_5028197417482", name: "Canneberge givrée beurre corporel", brand: "Body Shop", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "5028197417482", store: "Body Shop · FR", url: "https://world.openbeautyfacts.org/product/5028197417482/canneberge-givree-beurre-corporel-body-shop", notes: "" },
  "ean_5028197417871": { id: "ean_5028197417871", name: "Canneberge givrée exfoliant au sucre", brand: "Body Shop", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#7da8cc", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "5028197417871", store: "Body Shop · FR", url: "https://world.openbeautyfacts.org/product/5028197417871/canneberge-givree-exfoliant-au-sucre-body-shop", notes: "" },
  "ean_3052503155104": { id: "ean_3052503155104", name: "Air mat la nouvelle matité indétectable - ivoire rosé", brand: "Bourjois", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3052503155104", store: "Bourjois · FR", url: "https://world.openbeautyfacts.org/product/3052503155104/air-mat-la-nouvelle-matite-indetectable-ivoire-rose-bourjois", notes: "" },
  "ean_9313880201001": { id: "ean_9313880201001", name: "Loose powder 04 Medium to dark", brand: "Bys", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "9313880201001", store: "Bys · FR", url: "https://world.openbeautyfacts.org/product/9313880201001/loose-powder-04-medium-to-dark-bys", notes: "" },
  "ean_3337875597449": { id: "ean_3337875597449", name: "Hydraterende Gezichtscrème", brand: "CeraVe", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3337875597449", store: "CeraVe · NL", url: "https://world.openbeautyfacts.org/product/3337875597449/facial-moisturising-lotion-cerave", notes: "" },
  "ean_3337875597395": { id: "ean_3337875597395", name: "Hydraterende Melk", brand: "CeraVe", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: true, ean: "3337875597395", store: "CeraVe · IE, NL", url: "https://world.openbeautyfacts.org/product/3337875597395/moisturising-lotion-cerave", notes: "" },
  "ean_3337875598996": { id: "ean_3337875598996", name: "moisturising cream", brand: "CeraVe", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3337875598996", store: "CeraVe · FR, RO", url: "https://world.openbeautyfacts.org/product/3337875598996/moisturising-cream-cerave", notes: "" },
  "ean_20231460": { id: "ean_20231460", name: "Crème solaire enfant FPS50+", brand: "Cien", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "20231460", store: "Cien · ES, FR, NL", url: "https://world.openbeautyfacts.org/product/20231460/cien-sun", notes: "" },
  "ean_3329310012495": { id: "ean_3329310012495", name: "Pâte d'argile", brand: "Copar", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3329310012495", store: "Copar · FR", url: "https://world.openbeautyfacts.org/product/3329310012495/pate-d-argile-copar", notes: "" },
  "ean_3257984523521": { id: "ean_3257984523521", name: "Les Soins Eau micellaire Peaux Sensibles", brand: "Cora", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#7ebbc4", wirk: "Milde Gesichtsreinigung", nc: null, cf: null, ff: true, ean: "3257984523521", store: "Cora · FR", url: "https://world.openbeautyfacts.org/product/3257984523521/les-soins-eau-micellaire-peaux-sensibles-cora", notes: "" },
  "ean_0870223028675": { id: "ean_0870223028675", name: "Nettoyant Corporel Hydratant Huile de Macadamia", brand: "Daily Defense", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#89bfe3", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "0870223028675", store: "Daily Defense · FR", url: "https://world.openbeautyfacts.org/product/0870223028675/nettoyant-corporel-hydratant-huile-de-macadamia-daily-defense", notes: "" },
  "ean_3560070848898": { id: "ean_3560070848898", name: "SensilianeSun lait protecteur 50+", brand: "Dermato Science", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3560070848898", store: "Dermato Science · FR", url: "https://world.openbeautyfacts.org/product/3560070848898/sensilianesun-lait-protecteur-50-dermato-science", notes: "" },
  "ean_0718334337432": { id: "ean_0718334337432", name: "Lotion à la noix de coco", brand: "Desert Essence", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: true, ean: "0718334337432", store: "Desert Essence · FR", url: "https://world.openbeautyfacts.org/product/0718334337432/desert-essence-coconut-hand-and-body-lotion", notes: "" },
  "ean_3178040694149": { id: "ean_3178040694149", name: "Crème Anti-Rides Nuit Haute Tolérance", brand: "Diadermine", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#7da8cc", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3178040694149", store: "Diadermine · FR", url: "https://world.openbeautyfacts.org/product/3178040694149/creme-anti-rides-nuit-haute-tolerance-henkel", notes: "" },
  "ean_3178040694156": { id: "ean_3178040694156", name: "Lotion micellaire démaquillante Haute Tolérance", brand: "Diadermine", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#9ad2cb", wirk: "Milde Gesichtsreinigung", nc: null, cf: null, ff: true, ean: "3178040694156", store: "Diadermine · FR", url: "https://world.openbeautyfacts.org/product/3178040694156/lotion-micellaire-demaquillante-haute-tolerance-henkel", notes: "" },
  "ean_8711700784245": { id: "ean_8711700784245", name: "Lait pour le corps Deep Care Complex", brand: "Dove", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "8711700784245", store: "Dove · FR", url: "https://world.openbeautyfacts.org/product/8711700784245/lait-pour-le-corps-deep-care-complex-unilever", notes: "" },
  "ean_4020829005037": { id: "ean_4020829005037", name: "Crème de jour fluide", brand: "Dr. Hauschka", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "4020829005037", store: "Dr. Hauschka · FR", url: "https://world.openbeautyfacts.org/product/4020829005037/creme-de-jour-fluide-dr-hauschka", notes: "" },
  "ean_3282770037500": { id: "ean_3282770037500", name: "Keracnyl gel moussant visage et corps", brand: "Ducray", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "pump", c: "#76a9c7", wirk: "Milde Gesichtsreinigung", nc: true, cf: null, ff: null, ean: "3282770037500", store: "Ducray · FR", url: "https://world.openbeautyfacts.org/product/3282770037500/keracnyl-gel-moussant-visage-et-corps-ducray", notes: "" },
  "ean_3287570131014": { id: "ean_3287570131014", name: "Huile de massage aux huiles essentielles", brand: "Durance", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#d9c488", wirk: "Pflegendes Gesichtskonzentrat", nc: null, cf: true, ff: null, ean: "3287570131014", store: "Durance · FR", url: "https://world.openbeautyfacts.org/product/3287570131014/huile-de-massage-aux-huiles-essentielles-durance", notes: "" },
  "ean_09162008": { id: "ean_09162008", name: "play massage douceur", brand: "Durex", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#7da8cc", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "09162008", store: "Durex · FR", url: "https://world.openbeautyfacts.org/product/09162008/durex-play-massage-douceur", notes: "" },
  "ean_3282779178624": { id: "ean_3282779178624", name: "Trixéra+", brand: "Eau thermale Avène", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: true, ean: "3282779178624", store: "Eau thermale Avène · FR", url: "https://world.openbeautyfacts.org/product/3282779178624/trixera-eau-thermale-avene", notes: "" },
  "ean_3517360003314": { id: "ean_3517360003314", name: "Nutritive Gel nettoyant surgras", brand: "Eau thermale Jonzac", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#7ebbc4", wirk: "Milde Gesichtsreinigung", nc: true, cf: null, ff: true, ean: "3517360003314", store: "Eau thermale Jonzac · FR", url: "https://world.openbeautyfacts.org/product/3517360003314/nutritive-gel-nettoyant-surgras-eau-thermale-jonzac", notes: "" },
  "ean_3517360025750": { id: "ean_3517360025750", name: "Reactive CONTROL, Crème miraculeuse HAUTE TOLERANCE", brand: "EAU THERMALE JONZAC", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3517360025750", store: "EAU THERMALE JONZAC · FR", url: "https://world.openbeautyfacts.org/product/3517360025750/reactive-control-creme-miraculeuse-haute-tolerance-eau-thermale-jonzac", notes: "" },
  "ean_3517360001419": { id: "ean_3517360001419", name: "REhydrate Lait corps réhydratant", brand: "Eau thermale Jonzac", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3517360001419", store: "Eau thermale Jonzac · FR", url: "https://world.openbeautyfacts.org/product/3517360001419/rehydrate-lait-corps-rehydratant-eau-thermale-jonzac", notes: "" },
  "ean_4033981742054": { id: "ean_4033981742054", name: "Opalovací krém SPF 15 bio", brand: "Eco cosmetics", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#e5be62", wirk: "Breitband UV-Schutz", nc: null, cf: true, ff: null, ean: "4033981742054", store: "Eco cosmetics · CZ", url: "https://world.openbeautyfacts.org/product/4033981742054/opalovaci-krem-spf-15-bio-eco-cosmetics", notes: "" },
  "ean_3045204804181": { id: "ean_3045204804181", name: "Naturals", brand: "Ecran Sun", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "3045204804181", store: "Ecran Sun · FR", url: "https://world.openbeautyfacts.org/product/3045204804181/naturals-ecran-sun", notes: "" },
  "ean_7350113020048": { id: "ean_7350113020048", name: "All Glow‘d Up Vegan Sugar Scrub", brand: "Estrid", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "7350113020048", store: "Estrid · DE, FI, NL, SE", url: "https://world.openbeautyfacts.org/product/7350113020048/all-glow-d-up-vegan-sugar-scrub-estrid", notes: "" },
  "eucerin_atopicontrol_beruhigende_ges": { id: "eucerin_atopicontrol_beruhigende_ges", name: "AtopiControl Beruhigende Gesichtscreme", brand: "Eucerin", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "", store: "Apotheke / Handel (DE, AT, EU)", url: "https://www.eucerin.de/produkte/atopicontrol/beruhigende-gesichtscreme", notes: "Claim: frei von Duftstoffen; kein NC-Claim auf Seite gefunden" },
  "ean_4005800192883": { id: "ean_4005800192883", name: "DermoPure Cleansing Gel", brand: "Eucerin", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#89bfe3", wirk: "Salicylsäure + Tenside", nc: true, cf: null, ff: true, ean: "4005800192883", store: "Eucerin · BE, DE, FR, NL", url: "https://world.openbeautyfacts.org/product/4005800192883/eucerin-dermopure-cleansing-gel", notes: "" },
  "ean_8436008569799": { id: "ean_8436008569799", name: "(ohne Namen)", brand: "Fleurymer", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "8436008569799", store: "Fleurymer · ES", url: "https://world.openbeautyfacts.org/product/8436008569799/fleurymer", notes: "" },
  "ean_3516170022751": { id: "ean_3516170022751", name: "Crème mains de Provence Essence d'amande", brand: "Florame", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3516170022751", store: "Florame · FR", url: "https://world.openbeautyfacts.org/product/3516170022751/creme-mains-de-provence-essence-d-amande-florame", notes: "" },
  "ean_8470001549990": { id: "ean_8470001549990", name: "Gel Cream 30 SPF", brand: "Fotoprotector ISDIN", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: true, cf: null, ff: null, ean: "8470001549990", store: "Fotoprotector ISDIN · ES", url: "https://world.openbeautyfacts.org/product/8470001549990/fotoprotector-isdin-gel-cream-30-spf", notes: "" },
  "ean_3600542433266": { id: "ean_3600542433266", name: "Brightening serum", brand: "Garnier", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#c2ba95", wirk: "Vitamin C + Niacinamid", nc: null, cf: true, ff: null, ean: "3600542433266", store: "Garnier · IE", url: "https://world.openbeautyfacts.org/product/3600542433266/brightening-serum-garnier", notes: "OBF-Label crowd-sourced; Siegel vor Launch re-checken" },
  "ean_3600541729476": { id: "ean_3600541729476", name: "Micellar Cleansing Water", brand: "Garnier", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#7ebbc4", wirk: "Mizellen-Technologie", nc: null, cf: null, ff: true, ean: "3600541729476", store: "Garnier · FR", url: "https://world.openbeautyfacts.org/product/3600541729476/micellar-cleansing-water-l-oreal", notes: "" },
  "ean_3600541738508": { id: "ean_3600541738508", name: "Miracle Wake Up Crème Anti-Âge défatigant", brand: "Garnier", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3600541738508", store: "Garnier · FR", url: "https://world.openbeautyfacts.org/product/3600541738508/miracle-wake-up-creme-anti-age-defatigant-l-oreal", notes: "" },
  "ean_3600530171972": { id: "ean_3600530171972", name: "Dream Mat Mousse 48 Beige ensoleillé", brand: "Gemey", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "pump", c: "#76a9c7", wirk: "Milde Gesichtsreinigung", nc: true, cf: null, ff: null, ean: "3600530171972", store: "Gemey · FR", url: "https://world.openbeautyfacts.org/product/3600530171972/dream-mat-mousse-48-beige-ensoleille-gemey", notes: "" },
  "ean_3600530523641": { id: "ean_3600530523641", name: "Dream Satin Fluide Sable", brand: "Gemey Maybelline", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3600530523641", store: "Gemey Maybelline · FR", url: "https://world.openbeautyfacts.org/product/3600530523641/dream-satin-fluide-sable-gemey-maybelline", notes: "" },
  "ean_3701154720093": { id: "ean_3701154720093", name: "Nettoyant Visage", brand: "Horace", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#82c4ba", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3701154720093", store: "Horace · FR", url: "https://world.openbeautyfacts.org/product/3701154720093/nettoyant-visage-horace", notes: "" },
  "ean_0682223020111": { id: "ean_0682223020111", name: "Black Protein Booster Eye Rescue", brand: "Jack", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#c2ba95", wirk: "Pflegendes Gesichtskonzentrat", nc: null, cf: true, ff: null, ean: "0682223020111", store: "Jack · NL", url: "https://world.openbeautyfacts.org/product/0682223020111/jack-black-protein-booster-eye-rescue", notes: "" },
  "ean_4000196031976": { id: "ean_4000196031976", name: "Hand & Nagelcreme", brand: "Kamill", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "4000196031976", store: "Kamill · DE", url: "https://world.openbeautyfacts.org/product/4000196031976/hand-nagelcreme-kamill", notes: "" },
  "ean_3760171121023": { id: "ean_3760171121023", name: "Crème visage anti-âge", brand: "Kuomayé Bio", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760171121023", store: "Kuomayé Bio · FR", url: "https://world.openbeautyfacts.org/product/3760171121023/creme-visage-anti-age-kuomaye-bio", notes: "" },
  "ean_3600523461103": { id: "ean_3600523461103", name: "Eau biphase micellaire", brand: "L'Oréal", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#76a9c7", wirk: "Milde Gesichtsreinigung", nc: null, cf: null, ff: true, ean: "3600523461103", store: "L'Oréal · FR", url: "https://world.openbeautyfacts.org/product/3600523461103/eau-biphase-micellaire-l-oreal", notes: "" },
  "ean_3600522838876": { id: "ean_3600522838876", name: "Accord Parfait fond de teint unifiant sur-mesure Lin", brand: "L'Oréal Paris", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3600522838876", store: "L'Oréal Paris · FR", url: "https://world.openbeautyfacts.org/product/3600522838876/accord-parfait-fond-de-teint-unifiant-sur-mesure-lin-l-oreal", notes: "" },
  "ean_3600522365884": { id: "ean_3600522365884", name: "Solution Micellaire", brand: "L'Oréal Paris", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#82c4ba", wirk: "Milde Gesichtsreinigung", nc: null, cf: null, ff: true, ean: "3600522365884", store: "L'Oréal Paris · FR", url: "https://world.openbeautyfacts.org/product/3600522365884/solution-micellaire-l-oreal", notes: "" },
  "ean_3337872414145": { id: "ean_3337872414145", name: "Cicaplast Mains", brand: "La Roche Posay", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3337872414145", store: "La Roche Posay · FR", url: "https://world.openbeautyfacts.org/product/3337872414145/cicaplast-mains-la-roche-posay", notes: "" },
  "ean_3337872418570": { id: "ean_3337872418570", name: "Lipikar Baume AP+", brand: "La Roche-Posay", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3337872418570", store: "La Roche-Posay · FR", url: "https://world.openbeautyfacts.org/product/3337872418570/lipikar-ap-m-triple-repair-moisturizing-cream-la-roche-posay", notes: "" },
  "ean_3266191023595": { id: "ean_3266191023595", name: "crème mains aloe vera", brand: "la vie claire", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: true, ean: "3266191023595", store: "la vie claire · FR", url: "https://world.openbeautyfacts.org/product/3266191023595/creme-mains-aloe-vera-la-vie-claire", notes: "" },
  "ean_3506770501008": { id: "ean_3506770501008", name: "Crème visage protectrice SPF 50 anti-rides au Monoï de Tahiti", brand: "Laboratoires Biocos", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#f2c974", wirk: "Breitband UV-Schutz", nc: null, cf: true, ff: true, ean: "3506770501008", store: "Laboratoires Biocos · FR", url: "https://world.openbeautyfacts.org/product/3506770501008/creme-visage-protectrice-spf-50-anti-rides-au-monoi-de-tahiti-laboratoires-biocos", notes: "" },
  "ean_4021457614134": { id: "ean_4021457614134", name: "Baume à lèvres au jojoba bio et à l'amande bio", brand: "Lavera", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "4021457614134", store: "Lavera · FR", url: "https://world.openbeautyfacts.org/product/4021457614134/baume-a-levres-au-jojoba-bio-et-a-l-amande-bio-lavera", notes: "" },
  "ean_3549620003093": { id: "ean_3549620003093", name: "Baume à lèvres à l'huile d'argan anti-âge", brand: "Le Petit Olivier", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#7da8cc", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3549620003093", store: "Le Petit Olivier · FR", url: "https://world.openbeautyfacts.org/product/3549620003093/baume-a-levres-a-l-huile-d-argan-anti-age-le-petit-olivier", notes: "" },
  "ean_3549629000024": { id: "ean_3549629000024", name: "Crème mains hydratante Huile d'olive", brand: "Le Petit Olivier", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3549629000024", store: "Le Petit Olivier · FR", url: "https://world.openbeautyfacts.org/product/3549629000024/creme-mains-hydratante-huile-d-olive-le-petit-olivier", notes: "" },
  "ean_3549620020335": { id: "ean_3549620020335", name: "Huile sèche Karité et amande douce", brand: "Le Petit Olivier", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#6bb5a3", wirk: "Pflegendes Gesichtskonzentrat", nc: null, cf: true, ff: null, ean: "3549620020335", store: "Le Petit Olivier · FR", url: "https://world.openbeautyfacts.org/product/3549620020335/huile-seche-karite-et-amande-douce-le-petit-olivier", notes: "" },
  "ean_3331300011968": { id: "ean_3331300011968", name: "Ultimate Slim Sérum 100% Actif Cure Cellulite Rebelle", brand: "Linéance", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#b5b89a", wirk: "Pflegendes Gesichtskonzentrat", nc: null, cf: null, ff: true, ean: "3331300011968", store: "Linéance · FR", url: "https://world.openbeautyfacts.org/product/3331300011968/ultimate-slim-serum-100-actif-cure-cellulite-rebelle-lineance", notes: "" },
  "ean_7350069280176": { id: "ean_7350069280176", name: "Rosehip oil", brand: "Loelle", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#6aa8c9", wirk: "Reines Hagebuttenkernöl", nc: null, cf: true, ff: null, ean: "7350069280176", store: "Loelle · SE", url: "https://world.openbeautyfacts.org/product/7350069280176/rosehip-oil-loelle", notes: "" },
  "ean_3506770302001": { id: "ean_3506770302001", name: "Spray protecteur hydratant SPF 30 haute protection", brand: "Lovea", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#e5be62", wirk: "Breitband UV-Schutz", nc: null, cf: true, ff: true, ean: "3506770302001", store: "Lovea · FR", url: "https://world.openbeautyfacts.org/product/3506770302001/spray-protecteur-hydratant-spf-30-haute-protection-lovea", notes: "" },
  "ean_3517360006162": { id: "ean_3517360006162", name: "BB Cream Mon lait d'Ânesse  SPF 10 - 01 beige lumière", brand: "Léa Nature", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: true, cf: null, ff: true, ean: "3517360006162", store: "Léa Nature · FR", url: "https://world.openbeautyfacts.org/product/3517360006162/bb-cream-mon-lait-d-anesse-spf-10-01-beige-lumiere-lea-nature", notes: "" },
  "ean_3517360005998": { id: "ean_3517360005998", name: "BB cream texture légère perfecteur de teint - 01 beige nude", brand: "Léa Nature", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3517360005998", store: "Léa Nature · FR", url: "https://world.openbeautyfacts.org/product/3517360005998/bb-cream-texture-legere-perfecteur-de-teint-01-beige-nude-lea-nature", notes: "" },
  "ean_3517360008685": { id: "ean_3517360008685", name: "Précieux Argan Eau micellaire anti-âge", brand: "Léa Nature", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "glass", c: "#7ebbc4", wirk: "Milde Gesichtsreinigung", nc: null, cf: null, ff: true, ean: "3517360008685", store: "Léa Nature · FR", url: "https://world.openbeautyfacts.org/product/3517360008685/precieux-argan-eau-micellaire-anti-age-lea-nature", notes: "" },
  "ean_3478821003680": { id: "ean_3478821003680", name: "Précieux argan Huile de bain et massage", brand: "Léa Nature", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#b5b89a", wirk: "Pflegendes Gesichtskonzentrat", nc: null, cf: null, ff: true, ean: "3478821003680", store: "Léa Nature · FR", url: "https://world.openbeautyfacts.org/product/3478821003680/precieux-argan-huile-de-bain-et-massage-lea-nature", notes: "" },
  "ean_8591113028446": { id: "ean_8591113028446", name: "Original Home Spa Beer Cosmetics", brand: "Manufaktura", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "8591113028446", store: "Manufaktura · CZ", url: "https://world.openbeautyfacts.org/product/8591113028446/original-home-spa-beer-cosmetics-manufaktura", notes: "OBF-Label crowd-sourced; Siegel vor Launch re-checken" },
  "ean_5719806324900": { id: "ean_5719806324900", name: "Læbebalsam", brand: "Matas", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "5719806324900", store: "Matas · DK", url: "https://world.openbeautyfacts.org/product/5719806324900/laebebalsam-matas", notes: "" },
  "ean_3600530512232": { id: "ean_3600530512232", name: "Pure Sun Mineral Bronze Shimmer Powder 02 Soleil Hâlé", brand: "Maybelline", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "3600530512232", store: "Maybelline · FR", url: "https://world.openbeautyfacts.org/product/3600530512232/pure-sun-mineral-bronze-shimmer-powder-02-soleil-hale-l-oreal", notes: "" },
  "ean_3600530625987": { id: "ean_3600530625987", name: "SuperStay 24h fond de teint stretch beige éclat", brand: "Maybelline", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3600530625987", store: "Maybelline · FR", url: "https://world.openbeautyfacts.org/product/3600530625987/superstay-24h-fond-de-teint-stretch-beige-eclat-l-oreal", notes: "" },
  "ean_3600550362534": { id: "ean_3600550362534", name: "BB Crème Solaire Teinté SPF 50+", brand: "Mixa", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ecd37b", wirk: "Mineralische Filter + Tönung", nc: true, cf: null, ff: true, ean: "3600550362534", store: "Mixa · FR", url: "https://world.openbeautyfacts.org/product/3600550362534/bb-creme-solaire-teinte-spf-50-mixa", notes: "" },
  "ean_3600550880687": { id: "ean_3600550880687", name: "Crème riche apaisante pro-tolérance", brand: "Mixa", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: true, ean: "3600550880687", store: "Mixa · FR", url: "https://world.openbeautyfacts.org/product/3600550880687/creme-riche-apaisante-pro-tolerance-mixa", notes: "" },
  "ean_3600550538175": { id: "ean_3600550538175", name: "Hydratant teinté protecteur anti-imperfections Dermo Defense", brand: "Mixa", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3600550538175", store: "Mixa · FR", url: "https://world.openbeautyfacts.org/product/3600550538175/hydratant-teinte-protecteur-anti-imperfections-dermo-defense-mixa", notes: "" },
  "ean_3600550199338": { id: "ean_3600550199338", name: "Lait corps nutritif protecteur", brand: "Mixa", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3600550199338", store: "Mixa · FR", url: "https://world.openbeautyfacts.org/product/3600550199338/lait-corps-nutritif-protecteur-mixa", notes: "" },
  "ean_3600550216592": { id: "ean_3600550216592", name: "Lait Solaire Tolérance Optimale SPF50", brand: "Mixa", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Hypoallergener Breitbandschutz", nc: null, cf: null, ff: true, ean: "3600550216592", store: "Mixa · FR", url: "https://world.openbeautyfacts.org/product/3600550216592/lait-solaire-tolerance-optimale-spf-50-enfants-et-adulte-peau-sensible-mixa", notes: "" },
  "ean_3600550164008": { id: "ean_3600550164008", name: "Soin protecteur regénérant Thé vert + Vigne rouge régénérante", brand: "Mixa", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3600550164008", store: "Mixa · FR", url: "https://world.openbeautyfacts.org/product/3600550164008/soin-protecteur-regenerant-the-vert-vigne-rouge-regenerante-mixa", notes: "" },
  "ean_4006000128689": { id: "ean_4006000128689", name: "2in1 primer daily UV serum SPF 50+", brand: "Nivea Sun", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ecd37b", wirk: "Primer + LSF 50+ Schutz", nc: null, cf: null, ff: true, ean: "4006000128689", store: "Nivea Sun · SE", url: "https://world.openbeautyfacts.org/product/4006000128689/2in1-primer-daily-uv-serum-spf-50-nivea-sun", notes: "" },
  "ean_4005900601902": { id: "ean_4005900601902", name: "UV Face SPF 50 Sensitive", brand: "Nivea Sun", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#e6c86e", wirk: "Ultra Spectrum Protection", nc: null, cf: null, ff: true, ean: "4005900601902", store: "Nivea Sun · SE", url: "https://world.openbeautyfacts.org/product/4005900601902/uv-face-spf-50-sensitive-nivea-sun", notes: "" },
  "ean_3760214630208": { id: "ean_3760214630208", name: "L'Expert", brand: "Omum", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760214630208", store: "Omum · FR", url: "https://world.openbeautyfacts.org/product/3760214630208/l-expert-omum", notes: "" },
  "ean_30096189": { id: "ean_30096189", name: "La Confidente", brand: "Omum", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "30096189", store: "Omum · FR", url: "https://world.openbeautyfacts.org/product/30096189/la-confidente-omum", notes: "" },
  "ean_3760214630017": { id: "ean_3760214630017", name: "La Surdouée", brand: "Omum", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#7da8cc", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760214630017", store: "Omum · FR", url: "https://world.openbeautyfacts.org/product/3760214630017/la-surdouee-omum", notes: "" },
  "ean_3760214630024": { id: "ean_3760214630024", name: "Le Bienfaiteur", brand: "Omum", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760214630024", store: "Omum · FR", url: "https://world.openbeautyfacts.org/product/3760214630024/le-bienfaiteur-omum", notes: "" },
  "ean_3760214630178": { id: "ean_3760214630178", name: "Le Coach fermeté", brand: "Omum", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760214630178", store: "Omum · FR", url: "https://world.openbeautyfacts.org/product/3760214630178/le-coach-fermete-omum", notes: "" },
  "ean_3760214630185": { id: "ean_3760214630185", name: "Ma Jolie Peau", brand: "Omum", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760214630185", store: "Omum · FR", url: "https://world.openbeautyfacts.org/product/3760214630185/ma-jolie-peau-omum", notes: "" },
  "ean_3770002306062": { id: "ean_3770002306062", name: "Comme à la plage Crème bonne mine hydratante et autobronzante", brand: "Pulpe de vie", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3770002306062", store: "Pulpe de vie · FR", url: "https://world.openbeautyfacts.org/product/3770002306062/comme-a-la-plage-creme-bonne-mine-hydratante-et-autobronzante-pulpe-de-vie", notes: "" },
  "ean_3607349796754": { id: "ean_3607349796754", name: "BB Cream matte - 001 claire", brand: "Rimmel", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3607349796754", store: "Rimmel · FR", url: "https://world.openbeautyfacts.org/product/3607349796754/bb-cream-matte-001-claire-rimmel", notes: "" },
  "ean_3607343730341": { id: "ean_3607343730341", name: "BB cream radiance 9 en 1 SPF 20 - 001 claire", brand: "Rimmel", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: true, cf: null, ff: null, ean: "3607343730341", store: "Rimmel · FR", url: "https://world.openbeautyfacts.org/product/3607343730341/bb-cream-radiance-9-en-1-spf-20-001-claire-rimmel", notes: "" },
  "ean_3361370627073": { id: "ean_3361370627073", name: "MB dermo cold crème Saint-Gervais Mont Blanc", brand: "Rivadis", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: true, ean: "3361370627073", store: "Rivadis · FR", url: "https://world.openbeautyfacts.org/product/3361370627073/mb-dermo-cold-creme-saint-gervais-mont-blanc-rivadis", notes: "" },
  "ean_3517360016970": { id: "ean_3517360016970", name: "Hydra Aloé Vera", brand: "So Bio Etic", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3517360016970", store: "So Bio Etic · FR, SE", url: "https://world.openbeautyfacts.org/product/3517360016970/hydra-aloe-vera-so-bio-etic", notes: "" },
  "ean_3770020070006": { id: "ean_3770020070006", name: "L'incontournable savon au lait de chèvre parfum amande", brand: "Soin Amalthée", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#89bfe3", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3770020070006", store: "Soin Amalthée · FR", url: "https://world.openbeautyfacts.org/product/3770020070006/l-incontournable-savon-au-lait-de-chevre-parfum-amande-soin-amalthee", notes: "" },
  "ean_3770020070020": { id: "ean_3770020070020", name: "L'incontournable savon au lait de chèvre parfum rose", brand: "Soin Amalthée", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#76a9c7", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3770020070020", store: "Soin Amalthée · FR", url: "https://world.openbeautyfacts.org/product/3770020070020/l-incontournable-savon-au-lait-de-chevre-parfum-rose-soin-amalthee", notes: "" },
  "ean_3770020070013": { id: "ean_3770020070013", name: "L'incontournable savon au lait de chèvre parfum thé", brand: "Soin Amalthée", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#a3ccd9", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3770020070013", store: "Soin Amalthée · FR", url: "https://world.openbeautyfacts.org/product/3770020070013/l-incontournable-savon-au-lait-de-chevre-parfum-the-soin-amalthee", notes: "" },
  "ean_4066447814958": { id: "ean_4066447814958", name: "Crema solare 50+ spray", brand: "Sun dance", kat: "spf", schiene: "support", klassen: ["uv"], shape: "tube", c: "#ffd97d", wirk: "Breitband UV-Schutz", nc: null, cf: null, ff: true, ean: "4066447814958", store: "Sun dance · AT, DE, IT", url: "https://world.openbeautyfacts.org/product/4066447814958/crema-solare-50-spray-dm", notes: "" },
  "ean_3401344502200": { id: "ean_3401344502200", name: "Cicavit+ Crème", brand: "SVR", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3401344502200", store: "SVR · FR", url: "https://world.openbeautyfacts.org/product/3401344502200/cicavit-creme-svr", notes: "" },
  "ean_3401381381691": { id: "ean_3401381381691", name: "Topialyse - Crème Émolliente", brand: "SVR", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3401381381691", store: "SVR · FR", url: "https://world.openbeautyfacts.org/product/3401381381691/topialyse-creme-emolliente-svr", notes: "" },
  "ean_5600829361105": { id: "ean_5600829361105", name: "Active Botanical Eye Contour (15ml)", brand: "TandheM", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "5600829361105", store: "TandheM · PT", url: "https://world.openbeautyfacts.org/product/5600829361105/active-botanical-eye-contour-15ml-tandhem-neurocosmetics", notes: "" },
  "ean_5600829361099": { id: "ean_5600829361099", name: "Pro-Aging Essential Face Serum (30 ml)", brand: "TandheM", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#6aa8c9", wirk: "Pflegendes Gesichtskonzentrat", nc: null, cf: true, ff: null, ean: "5600829361099", store: "TandheM · PT", url: "https://world.openbeautyfacts.org/product/5600829361099/pro-aging-essential-face-serum-30-ml-tandhem-neurocosmetics", notes: "" },
  "ean_5061087560738": { id: "ean_5061087560738", name: "Starter retinol serum", brand: "The Inkey List", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#d9c488", wirk: "0.5% RetiStar + Squalane", nc: null, cf: true, ff: true, ean: "5061087560738", store: "The Inkey List · NL", url: "https://world.openbeautyfacts.org/product/5061087560738/starter-retinol-serum-the-inkey-list", notes: "OBF-Label crowd-sourced; Siegel vor Launch re-checken" },
  "ean_5060879821989": { id: "ean_5060879821989", name: "Vitamin B, C and E moisturizer", brand: "The Inkey List", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#7da8cc", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: true, ean: "5060879821989", store: "The Inkey List · NL", url: "https://world.openbeautyfacts.org/product/5060879821989/vitamin-b-c-and-e-moisturizer-the-inkey-list", notes: "OBF-Label crowd-sourced; Siegel vor Launch re-checken" },
  "ean_3504750011028": { id: "ean_3504750011028", name: "monoï tiki tahiti", brand: "tiare", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3504750011028", store: "tiare · FR", url: "https://world.openbeautyfacts.org/product/3504750011028/monoi-tiki-tahiti-tiare", notes: "" },
  "ean_3661434006968": { id: "ean_3661434006968", name: "Xemose - Baume Oléo-Apaisant Anti-Grattage", brand: "Uriage", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3661434006968", store: "Uriage · BE, FR", url: "https://world.openbeautyfacts.org/product/3661434006968/xemose-baume-oleo-apaisant-anti-grattage-uriage", notes: "" },
  "ean_3596200064432": { id: "ean_3596200064432", name: "Contour des Yeux hydratant", brand: "Weleda", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3596200064432", store: "Weleda · FR", url: "https://world.openbeautyfacts.org/product/3596200064432/contour-des-yeux-hydratant-weleda", notes: "" },
  "ean_3596206332825": { id: "ean_3596206332825", name: "Crème au calendula", brand: "Weleda", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3596206332825", store: "Weleda · FR", url: "https://world.openbeautyfacts.org/product/3596206332825/creme-au-calendula-weleda", notes: "" },
  "ean_3596200064425": { id: "ean_3596200064425", name: "Fluide hydratant 24h", brand: "Weleda", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3596200064425", store: "Weleda · FR", url: "https://world.openbeautyfacts.org/product/3596200064425/fluide-hydratant-24h-weleda", notes: "" },
  "ean_3401360192539": { id: "ean_3401360192539", name: "Fluide matifiant", brand: "Weleda", kat: "creme", schiene: "support", klassen: ["support"], shape: "tube", c: "#7da8cc", wirk: "Hautbarriere-Pflege", nc: true, cf: null, ff: null, ean: "3401360192539", store: "Weleda · FR", url: "https://world.openbeautyfacts.org/product/3401360192539/fluide-matifiant-weleda", notes: "" },
  "ean_3596202092938": { id: "ean_3596202092938", name: "Iris Crème de jour hydratante", brand: "Weleda", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3596202092938", store: "Weleda · FR", url: "https://world.openbeautyfacts.org/product/3596202092938/iris-creme-de-jour-hydratante-weleda", notes: "" },
  "ean_3660005548890": { id: "ean_3660005548890", name: "Pur Bleuet", brand: "Yves Rocher", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "3660005548890", store: "Yves Rocher · FR", url: "https://world.openbeautyfacts.org/product/3660005548890/pur-bleuet-yves-rocher", notes: "" },
  "ean_8710444217408": { id: "ean_8710444217408", name: "Suncare", brand: "Zenova", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: null, ff: true, ean: "8710444217408", store: "Zenova · FR", url: "https://world.openbeautyfacts.org/product/8710444217408/suncare-zenova", notes: "" },
  "ean_3760354680255": { id: "ean_3760354680255", name: "Baume de tamanu", brand: "Zenzitude", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760354680255", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680255/baume-de-tamanu-zenzitude", notes: "" },
  "ean_3760354680293": { id: "ean_3760354680293", name: "beurre de karité bio", brand: "Zenzitude", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#99c2b4", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760354680293", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680293/beurre-de-karite-bio-zenzitude", notes: "" },
  "ean_3760354680286": { id: "ean_3760354680286", name: "beurre de karité bio", brand: "Zenzitude", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#7da8cc", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760354680286", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680286/beurre-de-karite-bio-zenzitude", notes: "" },
  "ean_3760354680095": { id: "ean_3760354680095", name: "bougie de massage fleur de tiaré", brand: "Zenzitude", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#b3d9c9", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760354680095", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680095/bougie-de-massage-fleur-de-tiare-zenzitude", notes: "" },
  "ean_3760354680101": { id: "ean_3760354680101", name: "Bougie de massage pomme d'amour", brand: "Zenzitude", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#bad19f", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760354680101", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680101/bougie-de-massage-pomme-d-amour-zenzitude", notes: "" },
  "ean_3760354680118": { id: "ean_3760354680118", name: "bougie de massage vanille tonka", brand: "Zenzitude", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760354680118", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680118/bougie-de-massage-vanille-tonka-zenzitude", notes: "" },
  "ean_3760354680279": { id: "ean_3760354680279", name: "Coffret occitan", brand: "Zenzitude", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#8ec4e6", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760354680279", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680279/coffret-occitan-zenzitude", notes: "" },
  "ean_3760354680163": { id: "ean_3760354680163", name: "huile de chanvre bio", brand: "Zenzitude", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#d9c488", wirk: "Pflegendes Gesichtskonzentrat", nc: null, cf: true, ff: null, ean: "3760354680163", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680163/huile-de-chanvre-bio-zenzitude", notes: "" },
  "ean_3760354680132": { id: "ean_3760354680132", name: "huile de tamanu", brand: "Zenzitude", kat: "serum", schiene: "support", klassen: ["humectant"], shape: "serum", c: "#8ec7b0", wirk: "Pflegendes Gesichtskonzentrat", nc: null, cf: true, ff: null, ean: "3760354680132", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680132/huile-de-tamanu-zenzitude", notes: "" },
  "ean_3760354680019": { id: "ean_3760354680019", name: "huile démaquillante passion", brand: "Zenzitude", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#9ad2cb", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3760354680019", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680019/huile-demaquillante-passion-zenzitude", notes: "" },
  "ean_3760354680248": { id: "ean_3760354680248", name: "huile démaquillante vanille", brand: "Zenzitude", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#7ebbc4", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3760354680248", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680248/huile-demaquillante-vanille-zenzitude", notes: "" },
  "ean_3760354680231": { id: "ean_3760354680231", name: "Macérât de calendula", brand: "Zenzitude", kat: "creme", schiene: "support", klassen: ["support"], shape: "jar", c: "#a4c8a8", wirk: "Hautbarriere-Pflege", nc: null, cf: true, ff: null, ean: "3760354680231", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680231/macerat-de-calendula-zenzitude", notes: "" },
  "ean_3760354680323": { id: "ean_3760354680323", name: "savon cléananas", brand: "Zenzitude", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#76a9c7", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3760354680323", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680323/savon-cleananas-zenzitude", notes: "" },
  "ean_3760354680347": { id: "ean_3760354680347", name: "Savon exfoliant", brand: "Zenzitude", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#a3ccd9", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3760354680347", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680347/savon-exfoliant-zenzitude", notes: "" },
  "ean_3760354680309": { id: "ean_3760354680309", name: "Savon tamanu", brand: "Zenzitude", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#82c4ba", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3760354680309", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680309/savon-tamanu-zenzitude", notes: "" },
  "ean_3760354680316": { id: "ean_3760354680316", name: "Savon zenzitude", brand: "Zenzitude", kat: "reiniger", schiene: "support", klassen: ["support"], shape: "tube", c: "#9ad2cb", wirk: "Milde Gesichtsreinigung", nc: null, cf: true, ff: null, ean: "3760354680316", store: "Zenzitude · FR", url: "https://world.openbeautyfacts.org/product/3760354680316/savon-zenzitude", notes: "" },
};

Object.assign(DB, EU_FLAG_CATALOG);

// 413 Cruelty Free International (CFI) Leaping Bunny Marken
const CFI_BRANDS = new Set([
  "#newgen",
  "17",
  "7th heaven",
  "a little something",
  "abundant natural health",
  "academy of colour",
  "adaptology",
  "addition studio",
  "aesop",
  "aldi",
  "almora botanica",
  "alter/native by suma",
  "alucia organics",
  "amarás",
  "anara skincare",
  "anko",
  "aqua natural",
  "ar ocean",
  "areu areu",
  "argital",
  "arithmos",
  "arkive",
  "aromatherapy associates",
  "asperox",
  "asperox-sparx",
  "astonish",
  "atelier rebul",
  "atikha",
  "aurelia london",
  "aveda",
  "avon",
  "awake organics",
  "b skincare",
  "b.o.b.",
  "bakel srl",
  "bali body",
  "balm balm",
  "batch",
  "bath house",
  "beautiful brows & lashes",
  "beauty favours",
  "beauty kitchen",
  "beauty without cruelty",
  "bed intentions",
  "being",
  "bel rebel",
  "bellapierre cosmetics",
  "benefit",
  "bio-d",
  "biohygiene",
  "biolage",
  "bioleon",
  "biolet",
  "biologi",
  "blur london",
  "bmt",
  "boots",
  "botanica slavica",
  "botanico vida skincare",
  "botanics",
  "boucleme",
  "boundary",
  "brave.new.hair., brave.new.care.",
  "bulldog skincare",
  "by sarah london",
  "byellie",
  "byk beauty",
  "byron bay skincare",
  "callen olive",
  "cellis",
  "celui by anisa sojka",
  "cenoura & bronze",
  "cherish",
  "childs farm",
  "cien",
  "clemence organics",
  "coco and lola",
  "co-op",
  "copper & black",
  "covergirl",
  "cowshed",
  "cozium",
  "cranbourn",
  "cult candy cosmetics",
  "cultivator natural products",
  "cultured",
  "curl jar",
  "cycle",
  "cyzone",
  "daise",
  "dentalux",
  "dermacare",
  "dial",
  "dianne caine australia",
  "ditto balms",
  "d'las",
  "doussy",
  "down to earth",
  "dr heald",
  "dr jackson's",
  "dr sam's",
  "duo",
  "earth conscious",
  "earth sense",
  "earthy nail polish",
  "ecoleaf by suma",
  "ecozone",
  "elegance",
  "emma hardie",
  "epiderma",
  "esika",
  "esspire",
  "eternal skincare",
  "ethique",
  "eudora",
  "evdaimonia",
  "every&one",
  "evolve organic beauty",
  "evre",
  "fab brows",
  "facetheory",
  "faith in nature",
  "fatface",
  "fill refill co.",
  "filter by molly-mae",
  "finice",
  "floralys",
  "florentine",
  "forest & shore",
  "formil",
  "formulae prescott",
  "fresh & dry",
  "fria",
  "fria 1000 giorni",
  "fria easy",
  "fria k-beauty inspired",
  "friendly soap",
  "fuarain skincare",
  "furtastic",
  "fushi",
  "fussy",
  "gaia skincare",
  "garnier",
  "gatineau",
  "gel.it.up by giup",
  "gender neutral",
  "genglo",
  "ghs direct",
  "gingingers",
  "girls with attitude",
  "glow for it",
  "glow hub",
  "goats of the gorge",
  "good bubble",
  "good one",
  "green wave",
  "greenscents",
  "hair by sam mcknight",
  "handmade naturals",
  "hanna sillitoe",
  "hannah natural",
  "happy anne",
  "helan",
  "herbal elea",
  "hershesons",
  "hiip",
  "hownd",
  "i+m naturkosmetik berlin",
  "icom",
  "incia",
  "ineos",
  "inhana skincare",
  "inlight beauty & wellness",
  "iren shizen",
  "itreatskin",
  "je suis vert",
  "jeuneora",
  "john lewis & partners",
  "julie clarke candles",
  "juvenate skincare",
  "kadalys",
  "kash beauty",
  "kativa",
  "katoa botanicals",
  "kids stuff",
  "kireyna",
  "kmart",
  "koné care",
  "kotanical",
  "kurl kitchen",
  "kvitok",
  "kyushi",
  "la cosmetica srl",
  "labbok",
  "lacura",
  "lanolips",
  "l'bel",
  "leeukopf laboratories",
  "lefay spa cosmetic line “tra suoni e colori”",
  "lemon myrtle",
  "lerana",
  "l'erbolario società benefit srl",
  "levrana",
  "lidl gb",
  "lidl ireland & lidl northern ireland",
  "lipstains gold",
  "little heroes",
  "little soap company",
  "liz earle",
  "lock stock & barrel",
  "london copyright",
  "look fabulous forever",
  "love ethical beauty",
  "love katie",
  "love pets",
  "lucy bee",
  "lumity",
  "lupilu",
  "made for life organics",
  "made of more",
  "magic lips",
  "magnum guardex",
  "mancave",
  "manhattan",
  "manufaktura",
  "maria nila",
  "mark birch trichlogist",
  "marks & spencer",
  "maroqueen",
  "mazel",
  "mazillo",
  "mendittorosa",
  "mervue natural skincare",
  "micky day",
  "mielev",
  "mienna cosmetics ltd",
  "miniml",
  "miss organics",
  "modern botany",
  "molton brown",
  "monange",
  "monday haircare",
  "morrisons",
  "moss & adams",
  "mother nailture",
  "mother's earth",
  "mua makeup academy",
  "mum&you",
  "nakin",
  "nala's baby",
  "natroma",
  "natura",
  "natural by nature oils",
  "naturally tiwa skincare",
  "nature's divine",
  "neal & wolf",
  "neal's yard remedies",
  "nex environment",
  "nice",
  "nimonths+",
  "noughty",
  "nourish london",
  "novaretin",
  "nsfa beauty",
  "nunaia",
  "nursem",
  "nutmeg",
  "o boticário",
  "o.u.i",
  "obvs skincare",
  "oio lab",
  "okiki skincare",
  "omorovicza",
  "organic skin australia",
  "organicspa",
  "oxx",
  "p.louise",
  "pai skincare",
  "paixao",
  "paladone",
  "pamoja",
  "parla",
  "penneys",
  "people of the earth",
  "perfect girl",
  "peros",
  "phb ethical beauty",
  "philosophy",
  "phoenix crown",
  "pike's pouches",
  "planted skincare",
  "poppin' yang",
  "primark",
  "primavera life",
  "pura vie",
  "pure argan co",
  "pure chemistry",
  "pure project",
  "purearth",
  "purextracts",
  "pyykkiarkki",
  "quem disse, berenice",
  "raven botanicals",
  "rebul",
  "refy",
  "rhug wild beauty",
  "rimmel london",
  "risqué",
  "rspca",
  "s'able labs",
  "sacred",
  "safeway",
  "sainsburys",
  "saira",
  "salt of the earth",
  "samaya ayurveda",
  "sanctum",
  "sansin",
  "santaverde",
  "sarafumi",
  "sbtrct skincare",
  "scott & lawson",
  "sculpted by aimee",
  "seeds of colour",
  "seniha skincare",
  "sensapur",
  "sensatia",
  "sensilait",
  "seresilk",
  "shades of london",
  "shedid & parrish",
  "sheglam",
  "silvan skincare",
  "siskyn skincare oils",
  "siveno",
  "skin deep",
  "skin formulas",
  "smol products",
  "soak sunday",
  "soap & glory",
  "soap valley",
  "soaphoria",
  "soft & delicate",
  "softy",
  "soho skin",
  "solitaire uk ltd",
  "soluclean",
  "solupak",
  "st. moriz",
  "stardrops",
  "stereo",
  "strange luxury",
  "studio gel",
  "studio milligram",
  "subtle energies",
  "sue marsh",
  "sugar coated",
  "sukin skincare",
  "sundae",
  "superdrug",
  "swypes",
  "synergie skin",
  "syorell",
  "system nature",
  "tanorganic",
  "temko cosmetics",
  "that good hair",
  "the australian natural soap company",
  "the barberia",
  "the body shop",
  "the cheeky panda",
  "the cocoon original vietnam",
  "the east to west lifestyle co©",
  "the gel crew",
  "the good one",
  "the handmade soap company",
  "the honest midwife",
  "the inkey list",
  "the konjac sponge co",
  "the natural deodorant co.",
  "the natural soapworks",
  "the pink stuff",
  "the powder shampoo",
  "the skin edition",
  "thermitek ltd",
  "throda skincare",
  "tootilab",
  "trigwell cosmetics",
  "tropic skincare",
  "true",
  "true alchemy",
  "tulita",
  "ukviat",
  "ultra glow",
  "ultraceuticals",
  "uniq made",
  "unique boutique",
  "upcircle beauty",
  "vegantan",
  "viridian nutrition",
  "vult",
  "w5",
  "waitrose",
  "wild",
  "wild science lab",
  "wildsmith skin",
  "wildwash",
  "wizz",
  "yes! nurse",
  "yom beauty",
  "young epure",
  "zoya goes pretty",
  "zuvi"
]);


function isBrandCrueltyFree(brandName) {
  if (!brandName) return false;
  const b = brandName.toLowerCase().trim();
  if (CFI_BRANDS.has(b)) return true;
  if (b === "the body shop" || b === "body shop") return true;
  if (b === "rimmel" || b === "rimmel london") return true;
  if (b === "the ordinary" || b === "paula's choice" || b === "purito" || b === "nø cosmetics" || b === "geek & gorgeous" || b === "good molecules") return true;
  return false;
}

// Automatische Verifizierung aller Produkte gegen das CFI-Verzeichnis (413 Marken)
Object.keys(DB).forEach(id => {
  const p = DB[id];
  if (p && isBrandCrueltyFree(p.brand)) {
    p.cf = true;
    if (!p.cf_basis) p.cf_basis = "CFI Leaping Bunny (genehmigte Marke)";
  }
});

// ==========================================
// EU Baby- und Kind-Katalog (606 Produkte)
// Quellen: eu-baby-kind-katalog.csv / kinder-kategorie.md
// Separate Kategorie: Baby (<3) und Kind (3-11) - keine Vermischung mit Erwachsenen-DB
// ==========================================
const BABY_DB = {
  "b_ean_5060447948674": { id:"b_ean_5060447948674", name:"Face cream Fragrance Free", brand:"Childs cream", slot:"creme", age:"baby_0_36m", ean:"5060447948674", ff:true, u3:true, cf:true, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5060447948674/face-cream-fragrance-free-childs-cream", notes:"" },
  "b_ean_20231460": { id:"b_ean_20231460", name:"Crème solaire enfant FPS50+", brand:"Cien", slot:"spf", age:"kind_3_11", ean:"20231460", ff:true, u3: false, cf:true, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/20231460/cien-sun", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3560071348069": { id:"b_ean_3560071348069", name:"Gel lavant 2 in 1", brand:"Carrefour", slot:"bad", age:"baby_0_36m", ean:"3560071348069", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071348069/gel-lavant-2-in-1-carrefour-bebe", notes:"" },
  "b_ean_3282779300551": { id:"b_ean_3282779300551", name:"Crème au Cold Cream Avène Pédiatril", brand:"Avène Eau Thermale", slot:"creme", age:"baby_0_36m", ean:"3282779300551", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://www.eau-thermale-avene.de/alle-produktfamilien/babypflege", notes:"Avène Babypflege-Charter: Hygiene parfüm-/seifenfrei (DE Markenseite)." },
  "b_ean_3282770074307": { id:"b_ean_3282770074307", name:"Crème Hydratante Avène Pédiatril Sterile Cosmetics", brand:"Avène Eau Thermale", slot:"creme", age:"baby_0_36m", ean:"3282770074307", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://www.eau-thermale-avene.de/alle-produktfamilien/babypflege", notes:"Avène Babypflege-Charter: Hygiene parfüm-/seifenfrei (DE Markenseite)." },
  "b_ean_0062600452306": { id:"b_ean_0062600452306", name:"Baby Lotion - Coconut Oil Body Moisturizer - Dry Skin - Baby Skin Care Product, Fragrance Free", brand:"Johnson’s", slot:"creme", age:"baby_0_36m", ean:"0062600452306", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/0062600452306/baby-lotion-coconut-oil-body-moisturizer-dry-skin-baby-skin-care-product-fragrance-free-johnson-s", notes:"OBF-Name endet mit „Fragrance Free“; Coconut Oil = Inhaltsstoff, nicht Duftclaim. EU-countries laut OBF prüfen." },
  "b_ean_3337872412998": { id:"b_ean_3337872412998", name:"Lipikar Baume AP+M", brand:"La Roche-Posay", slot:"creme", age:"baby_0_36m", ean:"3337872412998", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://centrethermal.laroche-posay.fr/fr-FR/SPA-Source", notes:"LRP Thermal Center: Lipikar Baume AP+M „Sans parfum“; bébé/enfant/adulte. DE-Seite JS-shell. Keine Therapie. CFI: nein." },
  "b_item_8": { id:"b_item_8", name:"Crème émolliente visage Stelatopia", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://www.mustela.fr/products/creme-emolliente-visage-stelatopia", notes:"Markenseite: sans parfum / 0% PARFUM; dès la naissance. Keine Therapie. CFI: nein." },
  "b_ean_3504105028947": { id:"b_ean_3504105028947", name:"Stelatopia", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"3504105028947", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://www.mustela.com/products/baume-emollient-stelatopia", notes:"Mustela Stelatopia Baume: dès la naissance (hors néonatologie); INCI Markenseite ohne Parfum." },
  "b_item_10": { id:"b_item_10", name:"Calendula Gesichtscreme parfümfrei", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://www.weleda.de/produkt/calendula-gesichtscreme-parfuemfrei-g004246", notes:"Markenseite: parfümfreie Calendula Gesichtscreme Weleda Baby. CFI: nein." },
  "b_item_11": { id:"b_item_11", name:"Calendula Pflegeöl parfümfrei", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://www.weleda.de/produkt/calendula-pflegeoel-parfuemfrei-g007528", notes:"Markenseite: unparfümiertes Calendula-Pflegeöl für Babypflege. CFI: nein." },
  "b_ean_3574660536522": { id:"b_ean_3574660536522", name:"First Touch Shampoo", brand:"Natusan", slot:"haar", age:"baby_0_36m", ean:"3574660536522", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660536522/first-touch-shampoo-natusan", notes:"" },
  "b_ean_3560071275075": { id:"b_ean_3560071275075", name:"Lait de toilette", brand:"Carrefour", slot:"reiniger", age:"baby_0_36m", ean:"3560071275075", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071275075/lait-de-toilette-carrefour-baby-bio", notes:"" },
  "b_ean_3760075074227": { id:"b_ean_3760075074227", name:"Spray solaire bébé 100 % naturel* haute protection - 50 sensible", brand:"Alphanova Sun", slot:"spf", age:"baby_0_36m", ean:"3760075074227", ff:true, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3760075074227/spray-solaire-bebe-100-naturel-haute-protection-50-sensible-alphanova-sun", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3286011092310": { id:"b_ean_3286011092310", name:"Crème change", brand:"Biolane", slot:"windel", age:"baby_0_36m", ean:"3286011092310", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3286011092310/creme-change-biolane", notes:"" },
  "b_ean_3560070311453": { id:"b_ean_3560070311453", name:"Lingettes bébé sans parfum 100% coton", brand:"Carrefour", slot:"windel", age:"baby_0_36m", ean:"3560070311453", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560070311453/lingettes-bebe-sans-parfum-100-coton-carrefour", notes:"" },
  "b_ean_26028071": { id:"b_ean_26028071", name:"Lingettes bébé très douces sensitive", brand:"Chérubin", slot:"windel", age:"baby_0_36m", ean:"26028071", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/26028071/lingettes-bebe-tres-douces-sensitive-cherubin", notes:"" },
  "b_ean_5028270004752": { id:"b_ean_5028270004752", name:"Baby wipes fragrance free", brand:"Dimple", slot:"windel", age:"baby_0_36m", ean:"5028270004752", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5028270004752/baby-wipes-fragrance-free-dimple", notes:"" },
  "b_ean_8690510115145": { id:"b_ean_8690510115145", name:"baby pure fragrance free wipes", brand:"hops", slot:"windel", age:"baby_0_36m", ean:"8690510115145", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8690510115145/baby-pure-fragrance-free-wipes-hops", notes:"" },
  "b_ean_3450601052316": { id:"b_ean_3450601052316", name:"Liniment oléo-calcaire", brand:"L'arbre vert", slot:"windel", age:"baby_0_36m", ean:"3450601052316", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3450601052316/liniment-oleo-calcaire-l-arbre-vert-bebe", notes:"" },
  "b_ean_4015400622413": { id:"b_ean_4015400622413", name:"Natural clean", brand:"P&G", slot:"windel", age:"baby_0_36m", ean:"4015400622413", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4015400622413/natural-clean-p-g", notes:"" },
  "b_ean_4015400621966": { id:"b_ean_4015400621966", name:"Sensitive", brand:"P&G", slot:"windel", age:"baby_0_36m", ean:"4015400621966", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4015400621966/sensitive-p-g", notes:"" },
  "b_item_23": { id:"b_item_23", name:"Calendula Wundschutzcreme parfümfrei", brand:"Weleda", slot:"windel", age:"baby_0_36m", ean:"", ff:true, u3:true, cf: null, nc: null, spfNote:"", url:"https://www.weleda.de/baby", notes:"Weleda Baby: Wundschutzcreme auch parfümfrei; von Geburt. Nicht Rx. CFI: nein." },
  "b_ean_3506770302001": { id:"b_ean_3506770302001", name:"Spray protecteur hydratant SPF 30 haute protection", brand:"Lovea", slot:"spf", age:"kind_3_11", ean:"3506770302001", ff: null, u3: false, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3506770302001/spray-protecteur-hydratant-spf-30-haute-protection-lovea", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy. Lovea: nur synthetic-scent-free (schwach) — FF für Baby-Katalog nicht gesetzt." },
  "b_ean_4061459916355": { id:"b_ean_4061459916355", name:"Baby & Kids Sensitive Sun Lotion", brand:"Lacura", slot:"creme", age:"baby_0_36m", ean:"4061459916355", ff: null, u3:true, cf:true, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4061459916355/baby-kids-sensitive-sun-lotion-lacura", notes:"" },
  "b_ean_4335619041042": { id:"b_ean_4335619041042", name:"Lingettes bébé", brand:"Lupilu", slot:"windel", age:"baby_0_36m", ean:"4335619041042", ff: null, u3:true, cf:true, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4335619041042/lingettes-bebe-lupilu", notes:"" },
  "b_ean_40879918": { id:"b_ean_40879918", name:"Lingettes pour bébés", brand:"Lupilu sensitive", slot:"windel", age:"baby_0_36m", ean:"40879918", ff: null, u3:true, cf:true, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/40879918/lingettes-pour-bebes-lupilu-sensitive", notes:"" },
  "b_ean_4056489564300": { id:"b_ean_4056489564300", name:"Shampooing douche extra doux pêche-abricot", brand:"CIEN", slot:"bad", age:"kind_3_11", ean:"4056489564300", ff: null, u3: false, cf:true, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4056489564300/shampooing-douche-extra-doux-peche-abricot-cien", notes:"" },
  "b_ean_3282779309110": { id:"b_ean_3282779309110", name:"Aderma - Primalba Bébé Gel Lavant Douceur", brand:"Marke unbekannt", slot:"bad", age:"baby_0_36m", ean:"3282779309110", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779309110/aderma-primalba-bebe-gel-lavant-douceur", notes:"" },
  "b_ean_8713769500293": { id:"b_ean_8713769500293", name:"Dermo Care L.O.L. Surprise! Bad & Douche", brand:"Marke unbekannt", slot:"bad", age:"baby_0_36m", ean:"8713769500293", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8713769500293/dermo-care-l-o-l-surprise-bad-douche", notes:"" },
  "b_ean_8713769500743": { id:"b_ean_8713769500743", name:"Dermo Care My Little Pony Bad & Douche", brand:"Marke unbekannt", slot:"bad", age:"baby_0_36m", ean:"8713769500743", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8713769500743/dermo-care-my-little-pony-bad-douche", notes:"" },
  "b_ean_3574669908535": { id:"b_ean_3574669908535", name:"John's", brand:"Marke unbekannt", slot:"bad", age:"baby_0_36m", ean:"3574669908535", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574669908535/john-s", notes:"" },
  "b_ean_3574661172484": { id:"b_ean_3574661172484", name:"JOHNSONS Baby Bath 500ml", brand:"Marke unbekannt", slot:"bad", age:"baby_0_36m", ean:"3574661172484", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661172484/johnsons-baby-bath-500ml", notes:"" },
  "b_ean_8720181537851": { id:"b_ean_8720181537851", name:"Neutral 0% Baby Bath, Wash & Shampoo", brand:"Marke unbekannt", slot:"bad", age:"baby_0_36m", ean:"8720181537851", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720181537851/neutral-0-baby-bath-wash-shampoo", notes:"" },
  "b_ean_5410091778620": { id:"b_ean_5410091778620", name:"Schwarzkopf Kids Shampoo & Douchegel", brand:"Marke unbekannt", slot:"bad", age:"baby_0_36m", ean:"5410091778620", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5410091778620/schwarzkopf-kids-shampoo-douchegel", notes:"" },
  "b_ean_4066447524062": { id:"b_ean_4066447524062", name:"Alverde Baby njrgujuća kupka", brand:"Alverde", slot:"bad", age:"baby_0_36m", ean:"4066447524062", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4066447524062/alverde-baby-njrgujuća-kupka", notes:"" },
  "b_ean_3596710313389": { id:"b_ean_3596710313389", name:"Gel lavant corps & cheveux Camomille", brand:"Auchan", slot:"bad", age:"baby_0_36m", ean:"3596710313389", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710313389/gel-lavant-corps-cheveux-camomille-auchan", notes:"" },
  "b_ean_3245678704332": { id:"b_ean_3245678704332", name:"Gel lavant corps et cheveux aux extraits de calendula et de camomille", brand:"Auchan", slot:"bad", age:"baby_0_36m", ean:"3245678704332", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678704332/gel-lavant-corps-et-cheveux-aux-extraits-de-calendula-et-de-camomille-auchan", notes:"" },
  "b_ean_3245678041277": { id:"b_ean_3245678041277", name:"Gel lavant doux corps et cheveux à l'extrait d'aloe vera bio", brand:"Auchan Baby Bio", slot:"bad", age:"baby_0_36m", ean:"3245678041277", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678041277/gel-lavant-doux-corps-et-cheveux-a-l-extrait-d-aloe-vera-bio-auchan-baby-bio", notes:"" },
  "b_ean_3574661523521": { id:"b_ean_3574661523521", name:"Power Shower", brand:"bebe", slot:"bad", age:"baby_0_36m", ean:"3574661523521", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661523521/power-shower-bebe", notes:"" },
  "b_ean_5900516653170": { id:"b_ean_5900516653170", name:"Bain moussant", brand:"Bella Baby Happy", slot:"bad", age:"baby_0_36m", ean:"5900516653170", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900516653170/bain-moussant-bella-baby", notes:"" },
  "b_ean_3286010097064": { id:"b_ean_3286010097064", name:"Solide lavant douceur", brand:"Biolane", slot:"bad", age:"baby_0_36m", ean:"3286010097064", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3286010097064/solide-lavant-douceur-biolane", notes:"" },
  "b_ean_5900931033083": { id:"b_ean_5900931033083", name:"Bar Soap", brand:"Bobini Baby", slot:"bad", age:"baby_0_36m", ean:"5900931033083", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900931033083/bar-soap-bobini-baby", notes:"" },
  "b_ean_3350033362147": { id:"b_ean_3350033362147", name:"Gel lavant corps et cheveux", brand:"Bout'chou", slot:"bad", age:"baby_0_36m", ean:"3350033362147", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3350033362147/gel-lavant-corps-et-cheveux-bout-chou", notes:"" },
  "b_ean_3350033186309": { id:"b_ean_3350033186309", name:"gel lavant corps et cheveux pour bébé", brand:"Bout'chou", slot:"bad", age:"baby_0_36m", ean:"3350033186309", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3350033186309/gel-lavant-corps-et-cheveux-pour-bebe-bout-chou", notes:"" },
  "b_ean_3600550300628": { id:"b_ean_3600550300628", name:"Thermal Peaux Sensibles Gel lavant hydratant", brand:"Bébé Cadum", slot:"bad", age:"baby_0_36m", ean:"3600550300628", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550300628/thermal-peaux-sensibles-gel-lavant-hydratant-bebe-cadum", notes:"" },
  "b_ean_3600550976700": { id:"b_ean_3600550976700", name:"bébé Cadillac gel lavant", brand:"Cadum", slot:"bad", age:"baby_0_36m", ean:"3600550976700", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550976700/bebe-cadillac-gel-lavant-cadum", notes:"" },
  "b_ean_3560071319731": { id:"b_ean_3560071319731", name:"Gel lavant 2 in 1", brand:"Carrefour", slot:"bad", age:"baby_0_36m", ean:"3560071319731", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071319731/gel-lavant-2-in-1-carrefour", notes:"" },
  "b_ean_3245411903237": { id:"b_ean_3245411903237", name:"Gel lavant Corps et Cheveux", brand:"Carrefour", slot:"bad", age:"baby_0_36m", ean:"3245411903237", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245411903237/gel-lavant-corps-et-cheveux-carrefour", notes:"" },
  "b_ean_3560071276911": { id:"b_ean_3560071276911", name:"Huile lavante 2 in 1", brand:"Carrefour", slot:"bad", age:"baby_0_36m", ean:"3560071276911", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071276911/huile-lavante-2-in-1-carrefour", notes:"" },
  "b_ean_5407005691625": { id:"b_ean_5407005691625", name:"Gel lavant corps & cheveux", brand:"Ceres Pharma", slot:"bad", age:"baby_0_36m", ean:"5407005691625", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5407005691625/gel-lavant-corps-cheveux-nosko", notes:"" },
  "b_ean_8058664129386": { id:"b_ean_8058664129386", name:"Bath and shower gel Baby Moments Kids", brand:"chicco", slot:"bad", age:"baby_0_36m", ean:"8058664129386", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8058664129386/bath-and-shower-gel-baby-moments-kids-chicco", notes:"" },
  "b_ean_3010351760123": { id:"b_ean_3010351760123", name:"savon bébé", brand:"cigalbio", slot:"bad", age:"baby_0_36m", ean:"3010351760123", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3010351760123/savon-bebe-cigalbio", notes:"" },
  "b_ean_3468080080027": { id:"b_ean_3468080080027", name:"Corine de Farme Amandelbloesem Wasgel", brand:"Corine", slot:"bad", age:"baby_0_36m", ean:"3468080080027", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080080027/corine-de-farme-amandelbloesem-wasgel", notes:"" },
  "b_ean_3468080083387": { id:"b_ean_3468080083387", name:"Corine de Farme Hair & Body Cleansing Gel", brand:"Corine", slot:"bad", age:"baby_0_36m", ean:"3468080083387", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080083387/corine-de-farme-hair-body-cleansing-gel", notes:"" },
  "b_ean_3468080150874": { id:"b_ean_3468080150874", name:"Corine de Farme Vaiana 3-in-1 Douchegel", brand:"Corine de Farme", slot:"bad", age:"baby_0_36m", ean:"3468080150874", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080150874/gel-douche-3-en-1-corine-de-farme", notes:"" },
  "b_ean_3468080082533": { id:"b_ean_3468080082533", name:"Gel douche bébé Micellaire Corps et Cheveux Bio", brand:"Corine de farme", slot:"bad", age:"baby_0_36m", ean:"3468080082533", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080082533/gel-douche-bebe-micellaire-corps-et-cheveux-bio-corine-de-farme", notes:"" },
  "b_ean_3468080115934": { id:"b_ean_3468080115934", name:"Gel lavant douceur", brand:"Corine de Farme", slot:"bad", age:"baby_0_36m", ean:"3468080115934", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080115934/gel-lavant-douceur-corine-de-farme", notes:"" },
  "b_ean_3468080082007": { id:"b_ean_3468080082007", name:"Savon Surgras extra-doux bio", brand:"Corine de Farme Baby", slot:"bad", age:"baby_0_36m", ean:"3468080082007", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080082007/savon-surgras-extra-doux-bio-corine-de-farme-baby", notes:"" },
  "b_ean_3468080150973": { id:"b_ean_3468080150973", name:"Corine de Farme Lilo & Stitch 3-in-1 Douchegel", brand:"Corinne de Farme", slot:"bad", age:"baby_0_36m", ean:"3468080150973", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080150973/corine-de-farme-lilo-stitch-3-in-1-douchegel-corinne-de-farme", notes:"" },
  "b_ean_5709954024333": { id:"b_ean_5709954024333", name:"Baby Shampoo/Bath", brand:"Derma", slot:"bad", age:"baby_0_36m", ean:"5709954024333", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5709954024333/baby-shampoo-bath-derma", notes:"" },
  "b_ean_4062300419346": { id:"b_ean_4062300419346", name:"Gel douche corps cheveux famille", brand:"Hipp Babysanft", slot:"bad", age:"baby_0_36m", ean:"4062300419346", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4062300419346/gel-douche-corps-cheveux-famille-hipp-babysanft", notes:"HiPP Babysanft oft ab 1. Lebenstag; viele SKUs mit Parfum in INCI → FF nur bei Label." },
  "b_ean_3250391966806": { id:"b_ean_3250391966806", name:"Gel lavant corps & cheveux", brand:"Intermarché", slot:"bad", age:"baby_0_36m", ean:"3250391966806", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3250391966806/gel-lavant-corps-cheveux-intermarche", notes:"" },
  "b_ean_6291100760442": { id:"b_ean_6291100760442", name:"Baby soap", brand:"Johnson & Johnson", slot:"bad", age:"baby_0_36m", ean:"6291100760442", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/6291100760442/baby-soap-johnson-johnson", notes:"" },
  "b_ean_3282779338721": { id:"b_ean_3282779338721", name:"Klorane Bebe Gentle Foaming Gel Body And Hair 2X500ML (bath)", brand:"Klorane", slot:"bad", age:"baby_0_36m", ean:"3282779338721", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779338721/klorane-bebe-gentle-foaming-gel-body-and-hair-2x500ml-bath", notes:"" },
  "b_ean_3282779326919": { id:"b_ean_3282779326919", name:"Klorane Bébé Savon surgras très doux", brand:"Klorane", slot:"bad", age:"baby_0_36m", ean:"3282779326919", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779326919/klorane-bebe-savon-surgras-tres-doux", notes:"" },
  "b_ean_3282779326834": { id:"b_ean_3282779326834", name:"Gel douceur moussant", brand:"Klorane Bébé", slot:"bad", age:"baby_0_36m", ean:"3282779326834", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779326834/gel-douceur-moussant-klorane-bebe", notes:"" },
  "b_ean_3450601052330": { id:"b_ean_3450601052330", name:"Gel lavant Corps & Cheveux", brand:"L'arbre vert", slot:"bad", age:"baby_0_36m", ean:"3450601052330", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3450601052330/gel-lavant-corps-cheveux-l-arbre-vert-bebe", notes:"" },
  "b_ean_3600550806847": { id:"b_ean_3600550806847", name:"Crème lavante protectrice bain & douche", brand:"LASCAD", slot:"bad", age:"baby_0_36m", ean:"3600550806847", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550806847/creme-lavante-protectrice-bain-douche-l-oreal", notes:"" },
  "b_ean_3770012829797": { id:"b_ean_3770012829797", name:"Poudre Soin Végetale 2 En 1 Recharge", brand:"Le Bébé Français Bio", slot:"bad", age:"baby_0_36m", ean:"3770012829797", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3770012829797/poudre-soin-vegetale-2-en-1-recharge-le-bebe-francais-bio", notes:"" },
  "b_ean_3549620080001": { id:"b_ean_3549620080001", name:"Gel lavant douceur Corps & Cheveux", brand:"Le Petit Olivier", slot:"bad", age:"baby_0_36m", ean:"3549620080001", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3549620080001/gel-lavant-douceur-corps-cheveux-le-petit-olivier", notes:"" },
  "b_ean_3574661870175": { id:"b_ean_3574661870175", name:"Gel lavant doux Amande douce", brand:"Le tout petit marseillais bébé", slot:"bad", age:"baby_0_36m", ean:"3574661870175", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661870175/gel-lavant-doux-amande-douce-le-tout-petit-marseillais-bebe", notes:"" },
  "b_ean_3574661870168": { id:"b_ean_3574661870168", name:"Gel lavant doux Calendula", brand:"Le tout petit marseillais bébé", slot:"bad", age:"baby_0_36m", ean:"3574661870168", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661870168/gel-lavant-doux-calendula-le-tout-petit-marseillais-bebe", notes:"" },
  "b_ean_3263855776217": { id:"b_ean_3263855776217", name:"Bébé Gel lavant", brand:"Leader Price", slot:"bad", age:"baby_0_36m", ean:"3263855776217", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3263855776217/bebe-gel-lavant-leader-price", notes:"" },
  "b_ean_3263855774114": { id:"b_ean_3263855774114", name:"Bébé Gel lavant corps & cheveux", brand:"Leader Price", slot:"bad", age:"baby_0_36m", ean:"3263855774114", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3263855774114/bebe-gel-lavant-corps-cheveux-leader-price", notes:"" },
  "b_ean_3517360000269": { id:"b_ean_3517360000269", name:"So'Bio Etic Baby' Gel Lavant", brand:"Léa Nature", slot:"bad", age:"baby_0_36m", ean:"3517360000269", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360000269/so-bio-etic-baby-gel-lavant-lea-nature", notes:"" },
  "b_ean_3564700701096": { id:"b_ean_3564700701096", name:"Gel lavant 2 en 1 Bio", brand:"Marque Repère", slot:"bad", age:"baby_0_36m", ean:"3564700701096", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3564700701096/gel-lavant-2-en-1-bio-marque-repere", notes:"" },
  "b_ean_3600550806281": { id:"b_ean_3600550806281", name:"Bain de confort lavant Cold Cream", brand:"Mixa", slot:"bad", age:"baby_0_36m", ean:"3600550806281", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550806281/bain-de-confort-lavant-cold-cream-mixa", notes:"" },
  "b_ean_3600551039848": { id:"b_ean_3600551039848", name:"Bébé - Gel lavant corps et cheveux", brand:"Mixa", slot:"bad", age:"baby_0_36m", ean:"3600551039848", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600551039848/bebe-gel-lavant-corps-et-cheveux-mixa", notes:"" },
  "b_ean_3350033527065": { id:"b_ean_3350033527065", name:"Le gel lavant sans savon", brand:"Monoprix", slot:"bad", age:"baby_0_36m", ean:"3350033527065", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3350033527065/le-gel-lavant-sans-savon-monoprix-bebe", notes:"" },
  "b_ean_3504105028374": { id:"b_ean_3504105028374", name:"Gel lavant doux", brand:"Mustela", slot:"bad", age:"baby_0_36m", ean:"3504105028374", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105028374/gel-lavant-doux-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_3504105024567": { id:"b_ean_3504105024567", name:"Savon surgras au Cold Cream nutri-protecteur", brand:"Mustela", slot:"bad", age:"baby_0_36m", ean:"3504105024567", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105024567/savon-surgras-au-cold-cream-nutri-protecteur-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_80058045": { id:"b_ean_80058045", name:"Baby shampoo & bath", brand:"Nivea", slot:"bad", age:"baby_0_36m", ean:"80058045", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/80058045/baby-shampoo-bath-nivea", notes:"" },
  "b_ean_42236498": { id:"b_ean_42236498", name:"Gel lavant douceur corps & cheveux baby", brand:"Nivea", slot:"bad", age:"baby_0_36m", ean:"42236498", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/42236498/gel-lavant-douceur-corps-cheveux-baby-nivea", notes:"" },
  "b_ean_4005808805648": { id:"b_ean_4005808805648", name:"Gel lavant douceur corps & cheveux Nourisson et bébés", brand:"Nivea", slot:"bad", age:"baby_0_36m", ean:"4005808805648", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005808805648/gel-lavant-douceur-corps-cheveux-nourisson-et-bebes-nivea", notes:"" },
  "b_ean_4005808361182": { id:"b_ean_4005808361182", name:"SHAMPOOING & BAIN HAPPY BATH", brand:"Nivea Baby", slot:"bad", age:"baby_0_36m", ean:"4005808361182", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005808361182/shampooing-bain-happy-bath-nivea-baby", notes:"" },
  "b_ean_4005808379828": { id:"b_ean_4005808379828", name:"SHAMPOOING & BAIN HAPPY BATH", brand:"Nivea Baby", slot:"bad", age:"baby_0_36m", ean:"4005808379828", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005808379828/shampooing-bain-happy-bath-nivea-baby", notes:"" },
  "b_ean_3700593603875": { id:"b_ean_3700593603875", name:"Lessive bébé", brand:"Persadon", slot:"bad", age:"baby_0_36m", ean:"3700593603875", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3700593603875/lessive-bebe-persadon", notes:"" },
  "b_ean_3256221674286": { id:"b_ean_3256221674286", name:"Gel lavant corps et cheveux", brand:"U", slot:"bad", age:"baby_0_36m", ean:"3256221674286", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3256221674286/gel-lavant-corps-et-cheveux-u", notes:"" },
  "b_ean_3596209937119": { id:"b_ean_3596209937119", name:"Weleda Bébé Calendula - Bain Crème", brand:"Weleda", slot:"bad", age:"baby_0_36m", ean:"3596209937119", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596209937119/weleda-bebe-calendula-bain-creme", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_8721317738180": { id:"b_ean_8721317738180", name:"Zwitsal Baby & Kids Bath Care Set", brand:"Zwitsal", slot:"bad", age:"baby_0_36m", ean:"8721317738180", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8721317738180/zwitsal-baby-kids-bath-care-set", notes:"" },
  "b_ean_8002849914175": { id:"b_ean_8002849914175", name:"Baby dentifricio", brand:"Marke unbekannt", slot:"creme", age:"baby_0_36m", ean:"8002849914175", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8002849914175/baby-dentifricio", notes:"" },
  "b_ean_3663395018141": { id:"b_ean_3663395018141", name:"Crème nuit bebe", brand:"Marke unbekannt", slot:"creme", age:"baby_0_36m", ean:"3663395018141", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3663395018141/creme-nuit-bebe", notes:"" },
  "b_ean_3574660420951": { id:"b_ean_3574660420951", name:"Johnson's baby lotion", brand:"Marke unbekannt", slot:"creme", age:"baby_0_36m", ean:"3574660420951", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660420951/johnson-s-baby-lotion", notes:"" },
  "b_ean_4021457612956": { id:"b_ean_4021457612956", name:"Lavera Baby u. Kinder Pflegecreme", brand:"Marke unbekannt", slot:"creme", age:"baby_0_36m", ean:"4021457612956", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4021457612956/lavera-baby-u-kinder-pflegecreme", notes:"" },
  "b_ean_4021457604975": { id:"b_ean_4021457604975", name:"Lavera Baby u. Kinder Windschutzcreme", brand:"Marke unbekannt", slot:"creme", age:"baby_0_36m", ean:"4021457604975", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4021457604975/lavera-baby-u-kinder-windschutzcreme", notes:"" },
  "b_ean_4005900190369": { id:"b_ean_4005900190369", name:"nivea baby", brand:"Marke unbekannt", slot:"creme", age:"baby_0_36m", ean:"4005900190369", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005900190369/nivea-baby", notes:"" },
  "b_ean_8011502005747": { id:"b_ean_8011502005747", name:"Salviettine Baby Laura Baumer Ricar.72 PZ.", brand:"Marke unbekannt", slot:"creme", age:"baby_0_36m", ean:"8011502005747", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8011502005747/salviettine-baby-laura-baumer-ricar-72-pz", notes:"" },
  "b_ean_8711218979102": { id:"b_ean_8711218979102", name:"Sudocrem Multi-Expert Zinkzalf", brand:"Marke unbekannt", slot:"creme", age:"baby_0_36m", ean:"8711218979102", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711218979102/sudocrem-multi-expert-zinkzalf", notes:"" },
  "b_ean_8711218979133": { id:"b_ean_8711218979133", name:"Sudocrem Multi-Expert Zinkzalf", brand:"Marke unbekannt", slot:"creme", age:"baby_0_36m", ean:"8711218979133", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711218979133/sudocrem-multi-expert-zinkzalf", notes:"" },
  "b_ean_3596710519507": { id:"b_ean_3596710519507", name:"Carrés à langer x10", brand:"Auchan Baby", slot:"creme", age:"baby_0_36m", ean:"3596710519507", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710519507/carres-a-langer-x10-auchan-baby", notes:"" },
  "b_ean_3596710421084": { id:"b_ean_3596710421084", name:"Gant de toilette jetable", brand:"Auchan Baby", slot:"creme", age:"baby_0_36m", ean:"3596710421084", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710421084/gant-de-toilette-jetable-auchan-baby", notes:"" },
  "b_ean_3245678041284": { id:"b_ean_3245678041284", name:"Crème hydratante visage et corps à l'extrait de calendula bio", brand:"Auchan Baby Bio", slot:"creme", age:"baby_0_36m", ean:"3245678041284", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678041284/creme-hydratante-visage-et-corps-a-l-extrait-de-calendula-bio-auchan-baby-bio", notes:"" },
  "b_ean_0381371019410": { id:"b_ean_0381371019410", name:"daily moisture lotion", brand:"Aveeno baby", slot:"creme", age:"baby_0_36m", ean:"0381371019410", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/0381371019410/daily-moisture-lotion-aveeno-baby", notes:"" },
  "b_ean_5391510478072": { id:"b_ean_5391510478072", name:"Baby Pure Moisturising Lotion", brand:"Baby Pure", slot:"creme", age:"baby_0_36m", ean:"5391510478072", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5391510478072/baby-pure-moisturising-lotion", notes:"" },
  "b_ean_4047196066232": { id:"b_ean_4047196066232", name:"Powder with jojoba oil & alantoin", brand:"Babydream", slot:"creme", age:"baby_0_36m", ean:"4047196066232", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4047196066232/powder-with-jojoba-oil-alantoin-babydream", notes:"" },
  "b_ean_4068134030948": { id:"b_ean_4068134030948", name:"Wind- und Wetterbalsam", brand:"Babydream", slot:"creme", age:"baby_0_36m", ean:"4068134030948", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4068134030948/wind-und-wetterbalsam-babydream", notes:"" },
  "b_ean_5900017097961": { id:"b_ean_5900017097961", name:"Oliwka hipoalergiczna", brand:"Bambino", slot:"creme", age:"baby_0_36m", ean:"5900017097961", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900017097961/oliwka-hipoalergiczna-bambino", notes:"" },
  "b_ean_4270002383401": { id:"b_ean_4270002383401", name:"Baby Lotion", brand:"Baybies Pure Green Cosmetics", slot:"creme", age:"baby_0_36m", ean:"4270002383401", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4270002383401/baby-lotion-baybies-pure-green-cosmetics", notes:"" },
  "b_ean_4064273150059": { id:"b_ean_4064273150059", name:"Bepanthen cream", brand:"Bayer", slot:"creme", age:"baby_0_36m", ean:"4064273150059", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4064273150059/bepanthen-cream-bayer", notes:"" },
  "b_ean_3574660401523": { id:"b_ean_3574660401523", name:"3in1 shake and clean augen make-up entferner lotion", brand:"bebe", slot:"creme", age:"baby_0_36m", ean:"3574660401523", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660401523/3in1-shake-and-clean-augen-make-up-entferner-lotion-bebe", notes:"" },
  "b_ean_3574661690513": { id:"b_ean_3574661690513", name:"gesichtscreme", brand:"bebe", slot:"creme", age:"baby_0_36m", ean:"3574661690513", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661690513/gesichtscreme-bebe", notes:"" },
  "b_ean_3574661604145": { id:"b_ean_3574661604145", name:"Handcreme", brand:"bebe", slot:"creme", age:"baby_0_36m", ean:"3574661604145", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661604145/handcreme-bebe", notes:"" },
  "b_ean_3574660653533": { id:"b_ean_3574660653533", name:"Baume hydratant protecteur", brand:"Bebe Biafine", slot:"creme", age:"baby_0_36m", ean:"3574660653533", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660653533/baume-hydratant-protecteur-bebe-biafine", notes:"" },
  "b_ean_3574660618488": { id:"b_ean_3574660618488", name:"Crème lavante cheveux et corps", brand:"Bebe Biafine", slot:"creme", age:"baby_0_36m", ean:"3574660618488", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660618488/creme-lavante-cheveux-et-corps-bebe-biafine", notes:"" },
  "b_ean_8715342041261": { id:"b_ean_8715342041261", name:"Body Milk Calendula", brand:"Bebilild", slot:"creme", age:"baby_0_36m", ean:"8715342041261", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8715342041261/body-milk-calendula-bebilild", notes:"" },
  "b_ean_3401528543739": { id:"b_ean_3401528543739", name:"Crème Minérale bébé", brand:"Bepanthen Soleil", slot:"creme", age:"baby_0_36m", ean:"3401528543739", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401528543739/creme-minerale-bebe-bepanthen-soleil", notes:"" },
  "b_ean_4337185820649": { id:"b_ean_4337185820649", name:"Baby soft cream", brand:"bevola", slot:"creme", age:"baby_0_36m", ean:"4337185820649", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4337185820649/baby-soft-cream-bevola", notes:"" },
  "b_ean_4011609011904": { id:"b_ean_4011609011904", name:"Baby oil", brand:"Bevola baby", slot:"creme", age:"baby_0_36m", ean:"4011609011904", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4011609011904/baby-oil-bevola-baby", notes:"" },
  "b_ean_3401347169653": { id:"b_ean_3401347169653", name:"ABCDerm crème raffermissante", brand:"Bioderma", slot:"creme", age:"baby_0_36m", ean:"3401347169653", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401347169653/abcderm-creme-raffermissante-bioderma", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3401396935889": { id:"b_ean_3401396935889", name:"Bioderma Cold Cream - Crème corps nourrissante ABCDerm", brand:"Bioderma", slot:"creme", age:"baby_0_36m", ean:"3401396935889", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401396935889/bioderma-cold-cream-creme-corps-nourrissante-abcderm", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3401397163847": { id:"b_ean_3401397163847", name:"Bioderma Cold Cream - Crème lavante ABCDerm", brand:"Bioderma", slot:"creme", age:"baby_0_36m", ean:"3401397163847", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401397163847/bioderma-cold-cream-creme-lavante-abcderm", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3401396935711": { id:"b_ean_3401396935711", name:"Bioderma Cold Cream - Crème Visage ABCDerm", brand:"Bioderma", slot:"creme", age:"baby_0_36m", ean:"3401396935711", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401396935711/bioderma-cold-cream-creme-visage-abcderm", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3401396936480": { id:"b_ean_3401396936480", name:"Bioderma Huile Douceur ABCDerm", brand:"Bioderma", slot:"creme", age:"baby_0_36m", ean:"3401396936480", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401396936480/bioderma-huile-douceur-abcderm", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3401345569585": { id:"b_ean_3401345569585", name:"Bioderma Hydratant - Lait Douceur ABCDerm", brand:"Bioderma", slot:"creme", age:"baby_0_36m", ean:"3401345569585", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401345569585/bioderma-hydratant-lait-douceur-abcderm", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3401577538663": { id:"b_ean_3401577538663", name:"Bioderma Péri-Oral ABCDerm", brand:"Bioderma", slot:"creme", age:"baby_0_36m", ean:"3401577538663", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401577538663/bioderma-peri-oral-abcderm", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_4311596611461": { id:"b_ean_4311596611461", name:"Baby Pflegecreme", brand:"Blütezeit", slot:"creme", age:"baby_0_36m", ean:"4311596611461", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4311596611461/baby-pflegecreme-blutezeit", notes:"" },
  "b_ean_7613035379978": { id:"b_ean_7613035379978", name:"Baby Öl", brand:"Bübchen", slot:"creme", age:"baby_0_36m", ean:"7613035379978", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7613035379978/baby-ol-bubchen", notes:"Bübchen häufig parfümiert." },
  "b_ean_3560071276942": { id:"b_ean_3560071276942", name:"Huile d'amande douce 100% naturelle", brand:"Carrefour", slot:"creme", age:"baby_0_36m", ean:"3560071276942", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071276942/huile-d-amande-douce-100-naturelle-carrefour", notes:"" },
  "b_ean_3560070276202": { id:"b_ean_3560070276202", name:"Huile d’amande douce", brand:"Carrefour", slot:"creme", age:"baby_0_36m", ean:"3560070276202", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560070276202/huile-d-amande-douce-carrefour", notes:"" },
  "b_ean_8431876279597": { id:"b_ean_8431876279597", name:"Crema cambio pañal my baby", brand:"Carrefour Baby", slot:"creme", age:"baby_0_36m", ean:"8431876279597", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8431876279597/crema-cambio-panal-my-baby-carrefour-baby", notes:"" },
  "b_ean_8431876279627": { id:"b_ean_8431876279627", name:"Leche emoliente para pieles con tendencia atopica my baby", brand:"Carrefour Baby", slot:"creme", age:"baby_0_36m", ean:"8431876279627", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8431876279627/leche-emoliente-para-pieles-con-tendencia-atopica-my-baby-carrefour-baby", notes:"" },
  "b_ean_8431876279573": { id:"b_ean_8431876279573", name:"Locion hidratante cara y cuerpo con aceite de almendra my baby", brand:"Carrefour Baby", slot:"creme", age:"baby_0_36m", ean:"8431876279573", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8431876279573/locion-hidratante-cara-y-cuerpo-con-aceite-de-almendra-my-baby-carrefour-baby", notes:"" },
  "b_ean_3283950919203": { id:"b_ean_3283950919203", name:"Cattier Bébé Crème Hydratante Hypoallergénique", brand:"Cattier", slot:"creme", age:"baby_0_36m", ean:"3283950919203", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3283950919203/cattier-bebe-creme-hydratante-hypoallergenique", notes:"" },
  "b_ean_3298839232083": { id:"b_ean_3298839232083", name:"Eau de senteur pour bébé", brand:"Christine Arbel", slot:"creme", age:"baby_0_36m", ean:"3298839232083", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3298839232083/eau-de-senteur-pour-bebe-christine-arbel", notes:"" },
  "b_ean_3760123181549": { id:"b_ean_3760123181549", name:"Lait Hydratant Bébé Miel De Manuka - 200 ML - Comptoirs & Compagnies", brand:"Comptoirs et compagnies", slot:"creme", age:"baby_0_36m", ean:"3760123181549", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3760123181549/lait-hydratant-bebe-miel-de-manuka-200-ml-comptoirs-compagnies-comptoirs-et-compagnies", notes:"" },
  "b_ean_8001120829894": { id:"b_ean_8001120829894", name:"Dentifricio anticarie", brand:"Coop", slot:"creme", age:"baby_0_36m", ean:"8001120829894", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8001120829894/dentifricio-anticarie-coop", notes:"" },
  "b_ean_3245678703892": { id:"b_ean_3245678703892", name:"Cosmia b - lait corps et massage - pour une douce nuit avec de l'extrait de camomille hydratant - bébé - 500 ml", brand:"Cosmia Baby", slot:"creme", age:"baby_0_36m", ean:"3245678703892", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678703892/cosmia-b-lait-corps-et-massage-pour-une-douce-nuit-avec-de-l-extrait-de-camomille-hydratant-bebe-500-ml-cosmia-baby", notes:"" },
  "b_ean_3245678704479": { id:"b_ean_3245678704479", name:"Huile nourrissante de massage", brand:"Cosmia Baby", slot:"creme", age:"baby_0_36m", ean:"3245678704479", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678704479/huile-nourrissante-de-massage-cosmia-baby", notes:"" },
  "b_ean_3245678704431": { id:"b_ean_3245678704431", name:"Lait nettoyant", brand:"Cosmia Baby", slot:"creme", age:"baby_0_36m", ean:"3245678704431", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678704431/lait-nettoyant-cosmia-baby", notes:"" },
  "b_ean_5709954024371": { id:"b_ean_5709954024371", name:"Body Baby oil", brand:"Derma Eco", slot:"creme", age:"baby_0_36m", ean:"5709954024371", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5709954024371/body-baby-oil-derma-eco", notes:"" },
  "b_ean_8710447362945": { id:"b_ean_8710447362945", name:"Sensitive Skin Care Lotion", brand:"Dove", slot:"creme", age:"baby_0_36m", ean:"8710447362945", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8710447362945/sensitive-skin-care-lotion-unilever", notes:"" },
  "b_ean_8002330128357": { id:"b_ean_8002330128357", name:"baby salviettine sensitive", brand:"Esselunga", slot:"creme", age:"baby_0_36m", ean:"8002330128357", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8002330128357/baby-salviettine-sensitive-esselunga", notes:"" },
  "b_ean_8017596119001": { id:"b_ean_8017596119001", name:"hello Baby", brand:"eurospin", slot:"creme", age:"baby_0_36m", ean:"8017596119001", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8017596119001/hello-baby-eurospin", notes:"" },
  "b_ean_3504108012950": { id:"b_ean_3504108012950", name:"Cold cream bébé", brand:"Expanscience", slot:"creme", age:"baby_0_36m", ean:"3504108012950", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504108012950/cold-cream-bebe-expanscience", notes:"" },
  "b_ean_3504105035501": { id:"b_ean_3504105035501", name:"Hydra Bebe Lotion", brand:"Expanscience", slot:"creme", age:"baby_0_36m", ean:"3504105035501", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105035501/hydra-bebe-lotion-expanscience", notes:"" },
  "b_ean_3504108012936": { id:"b_ean_3504108012936", name:"Hydra Bébé Crème visage", brand:"Expanscience", slot:"creme", age:"baby_0_36m", ean:"3504108012936", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504108012936/hydra-bebe-creme-visage-expanscience", notes:"" },
  "b_ean_3401528521096": { id:"b_ean_3401528521096", name:"Baume pectoral bébé", brand:"Gifrer", slot:"creme", age:"baby_0_36m", ean:"3401528521096", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401528521096/gifrer-baume-pectoral", notes:"" },
  "b_ean_5904006380232": { id:"b_ean_5904006380232", name:"Face & body Hypoallergenic Cream", brand:"Hagi baby", slot:"creme", age:"baby_0_36m", ean:"5904006380232", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5904006380232/face-body-hypoallergenic-cream-hagi-baby", notes:"" },
  "b_ean_4062300422537": { id:"b_ean_4062300422537", name:"Baby Oil", brand:"Hipp", slot:"creme", age:"baby_0_36m", ean:"4062300422537", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4062300422537/baby-oil-hipp", notes:"HiPP Babysanft oft ab 1. Lebenstag; viele SKUs mit Parfum in INCI → FF nur bei Label." },
  "b_ean_44562300422544": { id:"b_ean_44562300422544", name:"Cream", brand:"Hipp Babysanft", slot:"creme", age:"baby_0_36m", ean:"44562300422544", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/44562300422544/cream-hipp-babysanft", notes:"HiPP Babysanft oft ab 1. Lebenstag; viele SKUs mit Parfum in INCI → FF nur bei Label." },
  "b_ean_7318690137542": { id:"b_ean_7318690137542", name:"Baby Zinksalva", brand:"ICA", slot:"creme", age:"baby_0_36m", ean:"7318690137542", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7318690137542/baby-zinksalva-ica", notes:"" },
  "b_ean_3574660057706": { id:"b_ean_3574660057706", name:"Johnson baby oil", brand:"Johnson", slot:"creme", age:"baby_0_36m", ean:"3574660057706", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660057706/johnson-baby-oil", notes:"" },
  "b_ean_53574660291162": { id:"b_ean_53574660291162", name:"Baby Oil", brand:"Johnson & Johnson", slot:"creme", age:"baby_0_36m", ean:"53574660291162", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/53574660291162/baby-oil-johnson-johnson", notes:"" },
  "b_ean_3574661198514": { id:"b_ean_3574661198514", name:"anti-pickel Feuchtigkeitscreme", brand:"Johnson & Johnson SBF", slot:"creme", age:"baby_0_36m", ean:"3574661198514", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661198514/anti-pickel-feuchtigkeitscreme-johnson-johnson-sbf", notes:"" },
  "b_ean_3574660587524": { id:"b_ean_3574660587524", name:"Baby oil", brand:"Johnson’s", slot:"creme", age:"baby_0_36m", ean:"3574660587524", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660587524/baby-oil-johnson-s", notes:"" },
  "b_ean_3574661428093": { id:"b_ean_3574661428093", name:"Face & body lotion", brand:"Johnson’s", slot:"creme", age:"baby_0_36m", ean:"3574661428093", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661428093/face-body-lotion-johnson-s", notes:"" },
  "b_ean_3282779327046": { id:"b_ean_3282779327046", name:"Klorane Bébé Baume apaisant et réparateur", brand:"Klorane", slot:"creme", age:"baby_0_36m", ean:"3282779327046", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779327046/klorane-bebe-baume-apaisant-et-reparateur", notes:"" },
  "b_ean_3282770055023": { id:"b_ean_3282770055023", name:"Klorane Bébé Crème hydratante Physio Calenduline", brand:"Klorane", slot:"creme", age:"baby_0_36m", ean:"3282770055023", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282770055023/klorane-bebe-creme-hydratante-physio-calenduline", notes:"" },
  "b_ean_3282779393232": { id:"b_ean_3282779393232", name:"Klorane Bébé Moisturizing Lotion 500 Ml.", brand:"Klorane", slot:"creme", age:"baby_0_36m", ean:"3282779393232", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779393232/klorane-bebe-moisturizing-lotion-500-ml", notes:"" },
  "b_ean_3282770038798": { id:"b_ean_3282770038798", name:"Crème lavante nourrissante cold cream", brand:"Klorane Bébé", slot:"creme", age:"baby_0_36m", ean:"3282770038798", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282770038798/creme-lavante-nourrissante-cold-cream-klorane-bebe", notes:"" },
  "b_ean_3282779005623": { id:"b_ean_3282779005623", name:"L'eau de bébé", brand:"Klorane Bébé", slot:"creme", age:"baby_0_36m", ean:"3282779005623", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779005623/l-eau-de-bebe-klorane-bebe", notes:"" },
  "b_ean_3282779326988": { id:"b_ean_3282779326988", name:"Poudre de toilette protectrice", brand:"Klorane Bébé", slot:"creme", age:"baby_0_36m", ean:"3282779326988", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779326988/poudre-de-toilette-protectrice-klorane-bebe", notes:"" },
  "b_ean_8717931600149": { id:"b_ean_8717931600149", name:"Lala's Baby Regular Vaseline", brand:"Lala's", slot:"creme", age:"baby_0_36m", ean:"8717931600149", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8717931600149/lala-s-baby-regular-vaseline", notes:"" },
  "b_ean_3058325050054": { id:"b_ean_3058325050054", name:"Crème hydratante protectrice", brand:"LASCAD", slot:"creme", age:"baby_0_36m", ean:"3058325050054", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3058325050054/creme-hydratante-protectrice-l-oreal", notes:"" },
  "b_ean_3600550848359": { id:"b_ean_3600550848359", name:"Crème hydratante protectrice pour le visage et le corps", brand:"LASCAD", slot:"creme", age:"baby_0_36m", ean:"3600550848359", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550848359/creme-hydratante-protectrice-pour-le-visage-et-le-corps-l-oreal", notes:"" },
  "b_ean_3564700685211": { id:"b_ean_3564700685211", name:"Crème hydratante visage & corps", brand:"Marque Repère", slot:"creme", age:"baby_0_36m", ean:"3564700685211", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3564700685211/creme-hydratante-visage-corps-marque-repere", notes:"" },
  "b_ean_3564700701058": { id:"b_ean_3564700701058", name:"Crème hydratante visage et corps", brand:"Marque Repère", slot:"creme", age:"baby_0_36m", ean:"3564700701058", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3564700701058/creme-hydratante-visage-corps-marque-repere", notes:"" },
  "b_ean_3600531070281": { id:"b_ean_3600531070281", name:"Baby Lips Electro Strike a Rose", brand:"Maybelline", slot:"creme", age:"baby_0_36m", ean:"3600531070281", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600531070281/baby-lips-electro-strike-a-rose-l-oreal", notes:"" },
  "b_ean_3600551153254": { id:"b_ean_3600551153254", name:"Mixa Panthenol Comfort Kalmerende Bodylotion", brand:"Mixa", slot:"creme", age:"baby_0_36m", ean:"3600551153254", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600551153254/mixa-panthenol-comfort-kalmerende-bodylotion", notes:"" },
  "b_ean_3600550921045": { id:"b_ean_3600550921045", name:"Mixa Bébé Huile lavante apaisante Atopiance", brand:"mixa bébé", slot:"creme", age:"baby_0_36m", ean:"3600550921045", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550921045/mixa-bebe-huile-lavante-apaisante-atopiance", notes:"" },
  "b_ean_3350034013659": { id:"b_ean_3350034013659", name:"Crème hydratante visage & corps bio", brand:"Monoprix", slot:"creme", age:"baby_0_36m", ean:"3350034013659", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3350034013659/creme-hydratante-visage-corps-bio-monoprix-bebe", notes:"" },
  "b_ean_3350033527089": { id:"b_ean_3350033527089", name:"La crème hydratante", brand:"Monoprix", slot:"creme", age:"baby_0_36m", ean:"3350033527089", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3350033527089/la-creme-hydratante-monoprix-bebe", notes:"" },
  "b_ean_3504105029982": { id:"b_ean_3504105029982", name:"Crème hydratante apaisante visage", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"3504105029982", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105029982/creme-hydratante-apaisante-visage-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_3504105028671": { id:"b_ean_3504105028671", name:"Crème nourrissante au cold cream", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"3504105028671", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105028671/creme-nourrissante-au-cold-cream-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_3504105035969": { id:"b_ean_3504105035969", name:"Crème visage bébé Mustela", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"3504105035969", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105035969/creme-visage-bebe-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_3504105028527": { id:"b_ean_3504105028527", name:"Hydra Bébé Lait Corps", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"3504105028527", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105028527/hydra-bebe-lait-corps-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_3504105035631": { id:"b_ean_3504105035631", name:"Mustela hydra", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"3504105035631", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105035631/mustela-hydra", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_3504105028282": { id:"b_ean_3504105028282", name:"Mustela Hydra Bébé Crème Visage", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"3504105028282", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105028282/mustela-hydra-bebe-creme-visage", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_3504105034412": { id:"b_ean_3504105034412", name:"Soin Croûtes de lait", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"3504105034412", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105034412/soin-croutes-de-lait-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_3504105028312": { id:"b_ean_3504105028312", name:"Stick nourrissant au cold cream", brand:"Mustela", slot:"creme", age:"baby_0_36m", ean:"3504105028312", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105028312/stick-nourrissant-au-cold-cream-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_8717953117328": { id:"b_ean_8717953117328", name:"Naïf Baby & Kids Verzachtende Bodylotion", brand:"Naïf", slot:"creme", age:"baby_0_36m", ean:"8717953117328", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8717953117328/naif-baby-kids-verzachtende-bodylotion", notes:"" },
  "b_ean_4005808705276": { id:"b_ean_4005808705276", name:"Nivea Baby Eau Douce Nettoyante", brand:"Nivea", slot:"creme", age:"baby_0_36m", ean:"4005808705276", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005808705276/nivea-baby-eau-douce-nettoyante", notes:"" },
  "b_ean_0590017090542": { id:"b_ean_0590017090542", name:"Baby Oil", brand:"Nivea Baby", slot:"creme", age:"baby_0_36m", ean:"0590017090542", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/0590017090542/baby-oil-nivea-baby", notes:"" },
  "b_ean_9005800369549": { id:"b_ean_9005800369549", name:"Face & body soft cream", brand:"Nivea baby", slot:"creme", age:"baby_0_36m", ean:"9005800369549", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/9005800369549/face-body-soft-cream-nivea-baby", notes:"" },
  "b_ean_4006000034249": { id:"b_ean_4006000034249", name:"Gute Nacht Lotion", brand:"Nivea Baby", slot:"creme", age:"baby_0_36m", ean:"4006000034249", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4006000034249/gute-nacht-lotion-nivea-baby", notes:"" },
  "b_ean_5900017090344": { id:"b_ean_5900017090344", name:"Moisturizing lotion", brand:"Nivea baby", slot:"creme", age:"baby_0_36m", ean:"5900017090344", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900017090344/moisturizing-lotion-nivea-baby", notes:"" },
  "b_ean_4005808364190": { id:"b_ean_4005808364190", name:"Huile douceur", brand:"Nivéa baby", slot:"creme", age:"baby_0_36m", ean:"4005808364190", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005808364190/huile-douceur-nivea-baby", notes:"" },
  "b_ean_8011502007390": { id:"b_ean_8011502007390", name:"Baby naturali", brand:"O-PAC", slot:"creme", age:"baby_0_36m", ean:"8011502007390", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8011502007390/baby-naturali-o-pac", notes:"" },
  "b_ean_5900116093215": { id:"b_ean_5900116093215", name:"Cream for cradle cap", brand:"Oillan baby", slot:"creme", age:"baby_0_36m", ean:"5900116093215", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900116093215/cream-for-cradle-cap-oillan-baby", notes:"" },
  "b_ean_3574661491066": { id:"b_ean_3574661491066", name:"Penaten Creme", brand:"Penaten", slot:"creme", age:"baby_0_36m", ean:"3574661491066", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661491066/penaten-creme", notes:"Penaten: Markenseite Ultra Sensitiv/Sensible Haut = parfümfrei; Klassik oft parfümiert." },
  "b_ean_3574661691626": { id:"b_ean_3574661691626", name:"natursanft Massage- & Pflegeöl", brand:"Penaten (Johnson & Johnson)", slot:"creme", age:"baby_0_36m", ean:"3574661691626", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661691626/natursanft-massage-pflegeol-penaten-johnson-johnson", notes:"Penaten: Markenseite Ultra Sensitiv/Sensible Haut = parfümfrei; Klassik oft parfümiert." },
  "b_ean_3251241047584": { id:"b_ean_3251241047584", name:"Huile pour bébé idéale massage", brand:"Prim'age", slot:"creme", age:"baby_0_36m", ean:"3251241047584", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3251241047584/huile-pour-bebe-ideale-massage-prim-age", notes:"" },
  "b_ean_9782253122111": { id:"b_ean_9782253122111", name:"Doliprane bebe", brand:"Sanofi", slot:"creme", age:"baby_0_36m", ean:"9782253122111", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/9782253122111/doliprane-bebe-sanofi", notes:"" },
  "b_ean_8710522350256": { id:"b_ean_8710522350256", name:"Signal Dentifrice Enfants Baby 0-3 Ans Fraise 3x50ml", brand:"Signal", slot:"creme", age:"baby_0_36m", ean:"8710522350256", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8710522350256/signal-dentifrice-enfants-baby-0-3-ans-fraise-3x50ml-unilever", notes:"" },
  "b_ean_3517360019476": { id:"b_ean_3517360019476", name:"crème hydratante protectrice bio", brand:"so'bio", slot:"creme", age:"baby_0_36m", ean:"3517360019476", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360019476/creme-hydratante-protectrice-bio-so-bio", notes:"" },
  "b_ean_8711218979126": { id:"b_ean_8711218979126", name:"Sudocrem Multi expert", brand:"Sudocrem", slot:"creme", age:"baby_0_36m", ean:"8711218979126", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711218979126/sudocrem-multi-expert", notes:"" },
  "b_ean_20294786": { id:"b_ean_20294786", name:"Toujours - Sensitive Baby - Feuchttücher FüR Lidl", brand:"Toujours", slot:"creme", age:"baby_0_36m", ean:"20294786", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/20294786/toujours-sensitive-baby-feuchttucher-fur-lidl", notes:"" },
  "b_ean_4001638096539": { id:"b_ean_4001638096539", name:"Baby Body Lotion", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"4001638096539", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4001638096539/baby-body-lotion-weleda", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_4001638096829": { id:"b_ean_4001638096829", name:"Baby body lotion", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"4001638096829", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4001638096829/baby-body-lotion-weleda", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_3596204358506": { id:"b_ean_3596204358506", name:"Weleda Baby Calendula Bodymilk", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"3596204358506", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596204358506/weleda-baby-calendula-bodymilk", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_4001638096614": { id:"b_ean_4001638096614", name:"Weleda Baby calendula gezichtscrème", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"4001638096614", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4001638096614/weleda-baby-calendula-gezichtscreme", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_3596204358520": { id:"b_ean_3596204358520", name:"Weleda Bébé Calendula - Crème protectrice Visage", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"3596204358520", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596204358520/weleda-bebe-calendula-creme-protectrice-visage", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_3596204519990": { id:"b_ean_3596204519990", name:"Weleda Bébé Huile de Massage Ventre de Bébé", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"3596204519990", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596204519990/weleda-bebe-huile-de-massage-ventre-de-bebe", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_3596209656003": { id:"b_ean_3596209656003", name:"Weleda Bébé Huile de toilette au Calendula", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"3596209656003", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596209656003/weleda-bebe-huile-de-toilette-au-calendula", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_4001638096560": { id:"b_ean_4001638096560", name:"Weleda Calendula verzorgende olie", brand:"Weleda", slot:"creme", age:"baby_0_36m", ean:"4001638096560", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4001638096560/weleda-calendula-verzorgende-olie", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_8720181649646": { id:"b_ean_8720181649646", name:"Zwitsal Baby zachte crème", brand:"Zwitsal", slot:"creme", age:"baby_0_36m", ean:"8720181649646", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720181649646/zwitsal-baby-zachte-creme", notes:"" },
  "b_ean_8720181649196": { id:"b_ean_8720181649196", name:"Zwitsal Conditioner", brand:"Zwitsal", slot:"creme", age:"baby_0_36m", ean:"8720181649196", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720181649196/zwitsal-conditioner", notes:"" },
  "b_ean_7501022103173": { id:"b_ean_7501022103173", name:"baby shampoo", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"7501022103173", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7501022103173/baby-shampoo", notes:"" },
  "b_ean_8713769500286": { id:"b_ean_8713769500286", name:"Dermo Care L.O.L. Surprise! Shampoo", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"8713769500286", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8713769500286/dermo-care-l-o-l-surprise-shampoo", notes:"" },
  "b_ean_8713769500729": { id:"b_ean_8713769500729", name:"Dermo Care My Little Pony Shampoo", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"8713769500729", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8713769500729/dermo-care-my-little-pony-shampoo", notes:"" },
  "b_ean_3600542460439": { id:"b_ean_3600542460439", name:"Garnier Loving Blends Kids Abrikoos 2-in-1 Shampoo & Conditioner", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"3600542460439", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600542460439/garnier-loving-blends-kids-abrikoos-2-in-1-shampoo-conditioner", notes:"" },
  "b_ean_3600542463379": { id:"b_ean_3600542463379", name:"Garnier Loving Blends Kids Milde Haver 2-in-1 Shampoo & Conditioner", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"3600542463379", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600542463379/garnier-loving-blends-kids-milde-haver-2-in-1-shampoo-conditioner", notes:"" },
  "b_ean_7790010915199": { id:"b_ean_7790010915199", name:"Gohmso's baby shampoo", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"7790010915199", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7790010915199/gohmso-s-baby-shampoo", notes:"" },
  "b_ean_3574661069456": { id:"b_ean_3574661069456", name:"johnsons baby shampo", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"3574661069456", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661069456/johnsons-baby-shampo", notes:"" },
  "b_ean_3574660500837": { id:"b_ean_3574660500837", name:"JOHNSONS Baby Shampoo 300ml", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"3574660500837", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660500837/johnsons-baby-shampoo-300ml", notes:"" },
  "b_ean_3574660520286": { id:"b_ean_3574660520286", name:"Penaten Baby Bad&Shampoo", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"3574660520286", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660520286/penaten-baby-bad-shampoo", notes:"" },
  "b_ean_3574661790442": { id:"b_ean_3574661790442", name:"petite marseillais", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"3574661790442", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661790442/petite-marseillais", notes:"" },
  "b_ean_5410091778606": { id:"b_ean_5410091778606", name:"Schwarzkopf Kids Shampoo & Conditioner", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"5410091778606", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5410091778606/schwarzkopf-kids-shampoo-conditioner", notes:"" },
  "b_ean_7702277074663": { id:"b_ean_7702277074663", name:"shampoo bebe cuidado", brand:"Marke unbekannt", slot:"haar", age:"baby_0_36m", ean:"7702277074663", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7702277074663/shampoo-bebe-cuidado", notes:"" },
  "b_ean_3596710313419": { id:"b_ean_3596710313419", name:"Shampooing très doux", brand:"Auchan", slot:"haar", age:"baby_0_36m", ean:"3596710313419", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710313419/shampooing-tres-doux-auchan", notes:"" },
  "b_ean_4047196052631": { id:"b_ean_4047196052631", name:"Szampon do włosów", brand:"Babydream", slot:"haar", age:"baby_0_36m", ean:"4047196052631", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4047196052631/szampon-do-włosow-babydream", notes:"" },
  "b_ean_5900057010166": { id:"b_ean_5900057010166", name:"Shampoo for children", brand:"Bambi", slot:"haar", age:"baby_0_36m", ean:"5900057010166", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900057010166/shampoo-for-children-bambi", notes:"" },
  "b_ean_3401396936541": { id:"b_ean_3401396936541", name:"Bioderma Shampooing ABCDerm", brand:"Bioderma", slot:"haar", age:"baby_0_36m", ean:"3401396936541", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401396936541/bioderma-shampooing-abcderm", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3286010097057": { id:"b_ean_3286010097057", name:"Shampooing croûtes de lait à l'avoine apaisant", brand:"Biolane", slot:"haar", age:"baby_0_36m", ean:"3286010097057", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3286010097057/shampooing-croutes-de-lait-a-l-avoine-apaisant-biolane", notes:"" },
  "b_ean_8710624289799": { id:"b_ean_8710624289799", name:"Bonbébé shampoo baby", brand:"Bonbébé", slot:"haar", age:"baby_0_36m", ean:"8710624289799", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8710624289799/bonbebe-shampoo-baby", notes:"" },
  "b_ean_4065331000064": { id:"b_ean_4065331000064", name:"Baby Shampoo", brand:"Bübchen", slot:"haar", age:"baby_0_36m", ean:"4065331000064", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4065331000064/baby-shampoo-bubchen", notes:"Bübchen häufig parfümiert." },
  "b_ean_3560071277093": { id:"b_ean_3560071277093", name:"Shampooing très doux", brand:"Carrefour", slot:"haar", age:"baby_0_36m", ean:"3560071277093", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071277093/shampooing-tres-doux-carrefour", notes:"" },
  "b_ean_8431876279559": { id:"b_ean_8431876279559", name:"Champu camomila my baby", brand:"Carrefour Baby", slot:"haar", age:"baby_0_36m", ean:"8431876279559", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8431876279559/champu-camomila-my-baby-carrefour-baby", notes:"" },
  "b_ean_3257980578938": { id:"b_ean_3257980578938", name:"Shampooing très doux, extra doux", brand:"Cora", slot:"haar", age:"baby_0_36m", ean:"3257980578938", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3257980578938/shampooing-tres-doux-extra-doux-cora", notes:"" },
  "b_ean_3468080081444": { id:"b_ean_3468080081444", name:"Baby bio organic shampoo", brand:"Corine de Farme", slot:"haar", age:"baby_0_36m", ean:"3468080081444", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080081444/baby-bio-organic-shampoo-corine-de-farme", notes:"" },
  "b_ean_3600542503136": { id:"b_ean_3600542503136", name:"Botanic Therapy Shampoo & Detangler", brand:"Garnier", slot:"haar", age:"baby_0_36m", ean:"3600542503136", ff: null, u3:true, cf:true, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600542503136/botanic-therapy-shampoo-detangler-garnier", notes:"" },
  "b_ean_4062300373211": { id:"b_ean_4062300373211", name:"Baby Shampoo", brand:"Hipp", slot:"haar", age:"baby_0_36m", ean:"4062300373211", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4062300373211/baby-shampoo-hipp", notes:"HiPP Babysanft oft ab 1. Lebenstag; viele SKUs mit Parfum in INCI → FF nur bei Label." },
  "b_ean_3574661213187": { id:"b_ean_3574661213187", name:"Baby shampoo gotas de brillo", brand:"Johnson's", slot:"haar", age:"baby_0_36m", ean:"3574661213187", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661213187/baby-shampoo-gotas-de-brillo-johnson-s", notes:"" },
  "b_ean_5601182015001": { id:"b_ean_5601182015001", name:"Shampoo", brand:"Johnson's Baby", slot:"haar", age:"baby_0_36m", ean:"5601182015001", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5601182015001/shampoo-johnson-s-baby", notes:"" },
  "b_ean_3574669907866": { id:"b_ean_3574669907866", name:"Baby Shampoo", brand:"Johnson’s", slot:"haar", age:"baby_0_36m", ean:"3574669907866", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574669907866/baby-shampoo-johnson-s", notes:"" },
  "b_ean_3574669907385": { id:"b_ean_3574669907385", name:"Johnson’s baby shampoo", brand:"Johnson’s", slot:"haar", age:"baby_0_36m", ean:"3574669907385", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574669907385/johnson-s-baby-shampoo", notes:"" },
  "b_ean_8718452724307": { id:"b_ean_8718452724307", name:"Jumbo Baby Shampoo 300 ml", brand:"JUMBO", slot:"haar", age:"baby_0_36m", ean:"8718452724307", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8718452724307/jumbo-baby-shampoo-300-ml", notes:"" },
  "b_ean_4335896491806": { id:"b_ean_4335896491806", name:"Baby mildes Shampoo", brand:"K Classic", slot:"haar", age:"baby_0_36m", ean:"4335896491806", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4335896491806/baby-mildes-shampoo-k-classic", notes:"" },
  "b_ean_3282779326865": { id:"b_ean_3282779326865", name:"Klorane Bébé Shampooing doux démêlant", brand:"Klorane", slot:"haar", age:"baby_0_36m", ean:"3282779326865", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779326865/klorane-bebe-shampooing-doux-demelant", notes:"" },
  "b_ean_8720674306209": { id:"b_ean_8720674306209", name:"shampoo baby's", brand:"Kruidvat", slot:"haar", age:"baby_0_36m", ean:"8720674306209", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720674306209/shampoo-baby-s-kruidvat", notes:"" },
  "b_ean_3263855774213": { id:"b_ean_3263855774213", name:"Bébé Shampooing très doux", brand:"Leader Price", slot:"haar", age:"baby_0_36m", ean:"3263855774213", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3263855774213/bebe-shampooing-tres-doux-leader-price", notes:"" },
  "b_ean_3600550079227": { id:"b_ean_3600550079227", name:"Shampooing très doux (+20% gratuit)", brand:"Mixa", slot:"haar", age:"baby_0_36m", ean:"3600550079227", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550079227/shampooing-tres-doux-20-gratuit-mixa", notes:"" },
  "b_ean_5600551154459": { id:"b_ean_5600551154459", name:"Micellar Shampoo", brand:"Mixa Baby", slot:"haar", age:"baby_0_36m", ean:"5600551154459", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5600551154459/micellar-shampoo-mixa-baby", notes:"" },
  "b_ean_3600550367188": { id:"b_ean_3600550367188", name:"Soap-free Surgras", brand:"Mixa Baby", slot:"haar", age:"baby_0_36m", ean:"3600550367188", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550367188/soap-free-surgras-mixa-baby", notes:"" },
  "b_ean_3600550136401": { id:"b_ean_3600550136401", name:"Mixa Bébé Shampoing Tres Doux, Ne Pique Pas Les Yeux", brand:"Mixa bébé", slot:"haar", age:"baby_0_36m", ean:"3600550136401", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550136401/mixa-bebe-shampoing-tres-doux-ne-pique-pas-les-yeux", notes:"" },
  "b_ean_3600550235784": { id:"b_ean_3600550235784", name:"Shampoing - cheveux fragiles", brand:"Mixa bébé", slot:"haar", age:"baby_0_36m", ean:"3600550235784", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550235784/shampoing-cheveux-fragiles-mixa-bebe", notes:"" },
  "b_ean_3600551119915": { id:"b_ean_3600551119915", name:"Shampoing très doux", brand:"Mixa bébé", slot:"haar", age:"baby_0_36m", ean:"3600551119915", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600551119915/shampoing-tres-doux-mixa-bebe", notes:"" },
  "b_ean_3600551119816": { id:"b_ean_3600551119816", name:"Shampoing très doux démêlant karité pur + huile de jojoba", brand:"Mixa Bébé", slot:"haar", age:"baby_0_36m", ean:"3600551119816", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600551119816/shampoing-tres-doux-demelant-karite-pur-huile-de-jojoba-mixa-bebe", notes:"" },
  "b_ean_3600551119809": { id:"b_ean_3600551119809", name:"Shampooing très doux", brand:"Mixa Bébé", slot:"haar", age:"baby_0_36m", ean:"3600551119809", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600551119809/shampooing-tres-doux-mixa-bebe", notes:"" },
  "b_ean_8720254710556": { id:"b_ean_8720254710556", name:"Naïf Baby & kids nourishing shampoo", brand:"Naïf", slot:"haar", age:"baby_0_36m", ean:"8720254710556", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720254710556/naif-baby-kids-nourishing-shampoo", notes:"" },
  "b_ean_8720254710594": { id:"b_ean_8720254710594", name:"Naïf Baby & kids nourishing shampoo refill", brand:"Naïf", slot:"haar", age:"baby_0_36m", ean:"8720254710594", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720254710594/naif-baby-kids-nourishing-shampoo-refill", notes:"" },
  "b_ean_3250391906611": { id:"b_ean_3250391906611", name:"Shampooing doux", brand:"Netto", slot:"haar", age:"baby_0_36m", ean:"3250391906611", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3250391906611/shampooing-doux-netto", notes:"" },
  "b_ean_4005900260857": { id:"b_ean_4005900260857", name:"Baby Shampooing Extra Doux", brand:"Nivea", slot:"haar", age:"baby_0_36m", ean:"4005900260857", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005900260857/baby-shampooing-extra-doux-nivea", notes:"" },
  "b_ean_4006000034201": { id:"b_ean_4006000034201", name:"Kopf bis Fuß Bad & Shampoo", brand:"Nivea Baby", slot:"haar", age:"baby_0_36m", ean:"4006000034201", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4006000034201/kopf-bis-fuss-bad-shampoo-nivea-baby", notes:"" },
  "b_ean_3574661474915": { id:"b_ean_3574661474915", name:"Baby Shampoo", brand:"Penaten", slot:"haar", age:"baby_0_36m", ean:"3574661474915", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661474915/baby-shampoo-penaten", notes:"Penaten: Markenseite Ultra Sensitiv/Sensible Haut = parfümfrei; Klassik oft parfümiert." },
  "b_ean_3250392927189": { id:"b_ean_3250392927189", name:"Gel lavant corps et cheveux", brand:"Pommette", slot:"haar", age:"baby_0_36m", ean:"3250392927189", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3250392927189/gel-lavant-corps-et-cheveux-pommette", notes:"" },
  "b_ean_6009523601811": { id:"b_ean_6009523601811", name:"Special Baby Shampoo", brand:"Purity", slot:"haar", age:"baby_0_36m", ean:"6009523601811", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/6009523601811/special-baby-shampoo-purity", notes:"" },
  "b_ean_3256224043997": { id:"b_ean_3256224043997", name:"Shampooing doux", brand:"U", slot:"haar", age:"baby_0_36m", ean:"3256224043997", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3256224043997/shampooing-doux-u", notes:"" },
  "b_ean_3661434002076": { id:"b_ean_3661434002076", name:"1er Shampoing Extra Doux", brand:"Uriage", slot:"haar", age:"baby_0_36m", ean:"3661434002076", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3661434002076/uriage-1er-shampooing", notes:"Uriage Bébé 1ère Crème laut Marke parfümiert — FF=no." },
  "b_ean_4001638096515": { id:"b_ean_4001638096515", name:"Weleda Baby calendula haar- en bodyshampoo", brand:"Weleda", slot:"haar", age:"baby_0_36m", ean:"4001638096515", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4001638096515/baby-calendula-waschlotion-shampoo-weleda", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_3800232739757": { id:"b_ean_3800232739757", name:"Natural baby shampoo & body wash", brand:"Wooden spoon", slot:"haar", age:"baby_0_36m", ean:"3800232739757", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3800232739757/natural-baby-shampoo-body-wash-wooden-spoon", notes:"" },
  "b_ean_8712561405737": { id:"b_ean_8712561405737", name:"Baby shampoo", brand:"Zwitsal", slot:"haar", age:"baby_0_36m", ean:"8712561405737", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8712561405737/baby-shampoo-zwitsal", notes:"" },
  "b_ean_3760075070045": { id:"b_ean_3760075070045", name:"Alphanova Bébé Eau Nettoyante", brand:"Alphanova", slot:"reiniger", age:"baby_0_36m", ean:"3760075070045", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3760075070045/alphanova-bebe-eau-nettoyante", notes:"" },
  "b_ean_3596710368280": { id:"b_ean_3596710368280", name:"Lait de toilette baby camomille", brand:"Auchan", slot:"reiniger", age:"baby_0_36m", ean:"3596710368280", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710368280/lait-de-toilette-baby-camomille-auchan", notes:"" },
  "b_ean_3245678704400": { id:"b_ean_3245678704400", name:"Eau nettoyante", brand:"Auchan Baby", slot:"reiniger", age:"baby_0_36m", ean:"3245678704400", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678704400/eau-nettoyante-auchan-baby", notes:"" },
  "b_ean_3596710510979": { id:"b_ean_3596710510979", name:"Eau nettoyante visage et corps à l'extrait de calendula", brand:"Auchan Baby", slot:"reiniger", age:"baby_0_36m", ean:"3596710510979", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710510979/eau-nettoyante-visage-et-corps-a-l-extrait-de-calendula-auchan-baby", notes:"" },
  "b_ean_3245678041314": { id:"b_ean_3245678041314", name:"Auchan baby cosmos bio - eau nettoyante micellaire - sans rincage visage et corps - bébé - 492 ml", brand:"Auchan Baby Bio", slot:"reiniger", age:"baby_0_36m", ean:"3245678041314", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678041314/auchan-baby-cosmos-bio-eau-nettoyante-micellaire-sans-rincage-visage-et-corps-bebe-492-ml-auchan-baby-bio", notes:"" },
  "b_ean_3574660618440": { id:"b_ean_3574660618440", name:"Eau nettoyante", brand:"Bebe Biafine", slot:"reiniger", age:"baby_0_36m", ean:"3574660618440", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660618440/eau-nettoyante-bebe-biafine", notes:"" },
  "b_ean_3574660651249": { id:"b_ean_3574660651249", name:"Lait de toilette", brand:"Bebe Biafine", slot:"reiniger", age:"baby_0_36m", ean:"3574660651249", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660651249/lait-de-toilette-bebe-biafine", notes:"" },
  "b_ean_3401396936190": { id:"b_ean_3401396936190", name:"Bioderma Lait de toilette ABCDerm", brand:"Bioderma", slot:"reiniger", age:"baby_0_36m", ean:"3401396936190", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401396936190/bioderma-lait-de-toilette-abcderm", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3350033362123": { id:"b_ean_3350033362123", name:"Eau nettoyante", brand:"Bout'chou", slot:"reiniger", age:"baby_0_36m", ean:"3350033362123", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3350033362123/eau-nettoyante-bout-chou", notes:"" },
  "b_ean_3600551055022": { id:"b_ean_3600551055022", name:"Eau nettoyante", brand:"Bébé Cadum", slot:"reiniger", age:"baby_0_36m", ean:"3600551055022", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600551055022/eau-nettoyante-bebe-cadum", notes:"" },
  "b_ean_3760099594367": { id:"b_ean_3760099594367", name:"Bébé Cadum Lait de Toilette Nettoyant et Hydratant", brand:"Cadum", slot:"reiniger", age:"baby_0_36m", ean:"3760099594367", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3760099594367/bebe-cadum-lait-de-toilette-nettoyant-et-hydratant", notes:"" },
  "b_ean_3760099593216": { id:"b_ean_3760099593216", name:"Cadum Bebe Lait De Toilette Hydratant Bio Sans Rinçage. FL Pompe", brand:"Cadum", slot:"reiniger", age:"baby_0_36m", ean:"3760099593216", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3760099593216/cadum-bebe-lait-de-toilette-hydratant-bio-sans-rincage-fl-pompe", notes:"" },
  "b_ean_3560071277000": { id:"b_ean_3560071277000", name:"Eau nettoyante micellaire", brand:"Carrefour", slot:"reiniger", age:"baby_0_36m", ean:"3560071277000", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071277000/eau-nettoyante-micellaire-carrefour", notes:"" },
  "b_ean_3560071277062": { id:"b_ean_3560071277062", name:"Lait de toilette hydratant", brand:"Carrefour", slot:"reiniger", age:"baby_0_36m", ean:"3560071277062", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071277062/lait-de-toilette-hydratant-carrefour-baby", notes:"" },
  "b_ean_3245411903114": { id:"b_ean_3245411903114", name:"Lait de toilette hydratant", brand:"Carrefour", slot:"reiniger", age:"baby_0_36m", ean:"3245411903114", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245411903114/lait-de-toilette-hydratant-carrefour", notes:"" },
  "b_ean_3245678704394": { id:"b_ean_3245678704394", name:"Cosmia b - eau nettoyante - à l'huile d'amande douce - bébé - 250ml", brand:"Cosmia Baby", slot:"reiniger", age:"baby_0_36m", ean:"3245678704394", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678704394/cosmia-b-eau-nettoyante-a-l-huile-d-amande-douce-bebe-250ml-cosmia-baby", notes:"" },
  "b_ean_3450970024600": { id:"b_ean_3450970024600", name:"Lait de toilette bébé", brand:"Eco+", slot:"reiniger", age:"baby_0_36m", ean:"3450970024600", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3450970024600/lait-de-toilette-bebe-eco", notes:"" },
  "b_ean_3504108010574": { id:"b_ean_3504108010574", name:"Lait de toilette", brand:"Expanscience", slot:"reiniger", age:"baby_0_36m", ean:"3504108010574", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504108010574/lait-de-toilette-expanscience", notes:"" },
  "b_ean_3282770023855": { id:"b_ean_3282770023855", name:"Lait de toilette protecteur sans rinçage", brand:"Klorane Bébé", slot:"reiniger", age:"baby_0_36m", ean:"3282770023855", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282770023855/lait-de-toilette-protecteur-sans-rincage-klorane-bebe", notes:"" },
  "b_ean_3770000717143": { id:"b_ean_3770000717143", name:"Mon petit La Rosée Lait de toilette nettoyant huile amande bébé", brand:"LA ROSEE", slot:"reiniger", age:"baby_0_36m", ean:"3770000717143", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3770000717143/mon-petit-la-rosee-lait-de-toilette-nettoyant-huile-amande-bebe", notes:"" },
  "b_ean_3700668700225": { id:"b_ean_3700668700225", name:"Eau nettoyante hypoallergénique", brand:"Love & Green", slot:"reiniger", age:"baby_0_36m", ean:"3700668700225", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3700668700225/eau-nettoyante-hypoallergenique-love-green", notes:"" },
  "b_ean_3517360000320": { id:"b_ean_3517360000320", name:"So'Bio Etic Baby' Eau Nettoyante Visage & Corps", brand:"Léa Nature", slot:"reiniger", age:"baby_0_36m", ean:"3517360000320", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360000320/so-bio-etic-baby-eau-nettoyante-visage-corps-lea-nature", notes:"" },
  "b_ean_3600551119922": { id:"b_ean_3600551119922", name:"Lait de toilette très doux", brand:"Mixa", slot:"reiniger", age:"baby_0_36m", ean:"3600551119922", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600551119922/lait-de-toilette-tres-doux-mixa", notes:"" },
  "b_ean_3600551136806": { id:"b_ean_3600551136806", name:"Mixa bébé au lait de toilette", brand:"MIXA", slot:"reiniger", age:"baby_0_36m", ean:"3600551136806", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600551136806/mixa-bebe-au-lait-de-toilette", notes:"" },
  "b_ean_3058320006001": { id:"b_ean_3058320006001", name:"Lait de toilette très doux Vitamine E Huile d'amande douce", brand:"Mixa Bébé", slot:"reiniger", age:"baby_0_36m", ean:"3058320006001", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3058320006001/lait-de-toilette-tres-doux-vitamine-e-huile-d-amande-douce-mixa-bebe", notes:"" },
  "b_ean_3600550454147": { id:"b_ean_3600550454147", name:"Mixa Bébé Lait de Toilette très Doux", brand:"Mixa Bébé", slot:"reiniger", age:"baby_0_36m", ean:"3600550454147", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550454147/mixa-bebe-lait-de-toilette-tres-doux", notes:"" },
  "b_ean_3350033527041": { id:"b_ean_3350033527041", name:"L'eau nettoyante", brand:"Monoprix", slot:"reiniger", age:"baby_0_36m", ean:"3350033527041", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3350033527041/l-eau-nettoyante-monoprix-bebe", notes:"" },
  "b_ean_3350033527027": { id:"b_ean_3350033527027", name:"Le lait de toilette Douceur à l'extrait de fleur de coton", brand:"Monoprix", slot:"reiniger", age:"baby_0_36m", ean:"3350033527027", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3350033527027/le-lait-de-toilette-douceur-a-l-extrait-de-fleur-de-coton-monoprix-bebe", notes:"" },
  "b_ean_4005808244416": { id:"b_ean_4005808244416", name:"Lait de toilette nourrissant Pure & sensitive", brand:"Nivea", slot:"reiniger", age:"baby_0_36m", ean:"4005808244416", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005808244416/lait-de-toilette-nourrissant-pure-sensitive-nivea", notes:"" },
  "b_ean_4005808364077": { id:"b_ean_4005808364077", name:"Nivea Baby Lait de toilette sans rinçage", brand:"Nivea", slot:"reiniger", age:"baby_0_36m", ean:"4005808364077", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005808364077/nivea-baby-lait-de-toilette-sans-rincage", notes:"" },
  "b_ean_4005900488404": { id:"b_ean_4005900488404", name:"Eau micellaire nettoyante", brand:"Nivea baby", slot:"reiniger", age:"baby_0_36m", ean:"4005900488404", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005900488404/eau-micellaire-nettoyante-nivea-baby", notes:"" },
  "b_ean_3250391966950": { id:"b_ean_3250391966950", name:"Lait de toilette bebe", brand:"Pommette", slot:"reiniger", age:"baby_0_36m", ean:"3250391966950", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3250391966950/lait-de-toilette-bebe-pommette", notes:"" },
  "b_ean_3661434000416": { id:"b_ean_3661434000416", name:"Uriage Bébé - 1ère Eau Nettoyante", brand:"Uriage", slot:"reiniger", age:"baby_0_36m", ean:"3661434000416", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3661434000416/uriage-bebe-1ere-eau-nettoyante", notes:"Uriage Bébé 1ère Crème laut Marke parfümiert — FF=no." },
  "b_ean_4305615968766": { id:"b_ean_4305615968766", name:"baby duschgel", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"4305615968766", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4305615968766/baby-duschgel", notes:"" },
  "b_ean_4533213040984": { id:"b_ean_4533213040984", name:"Baby Foot Masque Chaussette Pour Les Pieds Liberta", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"4533213040984", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4533213040984/baby-foot-masque-chaussette-pour-les-pieds-liberta", notes:"" },
  "b_ean_5310001200398": { id:"b_ean_5310001200398", name:"baby powder", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"5310001200398", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5310001200398/baby-powder", notes:"" },
  "b_ean_3574661322018": { id:"b_ean_3574661322018", name:"Bebe", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"3574661322018", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661322018/bebe", notes:"" },
  "b_ean_3574661155586": { id:"b_ean_3574661155586", name:"Bebe classic", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"3574661155586", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661155586/bebe-classic", notes:"" },
  "b_ean_3574661690483": { id:"b_ean_3574661690483", name:"bebe Waschgel", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"3574661690483", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661690483/bebe-waschgel", notes:"" },
  "b_ean_00634200": { id:"b_ean_00634200", name:"bebe young care Traube Smoothie duschgel", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"00634200", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/00634200/bebe-young-care-traube-smoothie-duschgel", notes:"" },
  "b_ean_7702661491007": { id:"b_ean_7702661491007", name:"colonia cero de bebe", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"7702661491007", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7702661491007/colonia-cero-de-bebe", notes:"" },
  "b_ean_5010622008518": { id:"b_ean_5010622008518", name:"Dentifrice fluoré bébé 0-2 ans", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"5010622008518", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5010622008518/dentifrice-fluore-bebe-0-2-ans", notes:"" },
  "b_ean_8431876272420": { id:"b_ean_8431876272420", name:"esponja Bebe Dermo", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"8431876272420", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8431876272420/esponja-bebe-dermo", notes:"" },
  "b_ean_4059729447371": { id:"b_ean_4059729447371", name:"Essence Baby Got Blush 20 Blushin' Berry Liquid Blush", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"4059729447371", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4059729447371/essence-baby-got-blush-20-blushin-berry-liquid-blush", notes:"" },
  "b_ean_3574660025415": { id:"b_ean_3574660025415", name:"gohnsons baby powder", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"3574660025415", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660025415/gohnsons-baby-powder", notes:"" },
  "b_ean_4062300445543": { id:"b_ean_4062300445543", name:"HiPP ULTRA HYGIENE SENSITIV BABYSANFT SIEGEL FEUCHTTÜCHER", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"4062300445543", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4062300445543/hipp-ultra-hygiene-sensitiv-babysanft-siegel-feuchttucher", notes:"" },
  "b_ean_4262401739750": { id:"b_ean_4262401739750", name:"Jean &Len OHNE GEDØNS* Sensitiver Sofortschutz für sehr empfindliche Haut BABY& KIDS NNE 50+ — E", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"4262401739750", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4262401739750/jean-len-ohne-gedøns-sensitiver-sofortschutz-fur-sehr-empfindliche-haut-baby-kids-nne-50-e", notes:"" },
  "b_ean_8410207116008": { id:"b_ean_8410207116008", name:"johnson's baby", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"8410207116008", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8410207116008/johnson-s-baby", notes:"" },
  "b_ean_3574660711929": { id:"b_ean_3574660711929", name:"JOHNSONS Baby Conditioner 500ml", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"3574660711929", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660711929/johnsons-baby-conditioner-500ml", notes:"" },
  "b_ean_8717333639174": { id:"b_ean_8717333639174", name:"Kruidvat Mama Protection Kraamverband", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"8717333639174", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8717333639174/kruidvat-mama-protection-kraamverband", notes:"" },
  "b_ean_8594008876573": { id:"b_ean_8594008876573", name:"Linteo Baby", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"8594008876573", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8594008876573/linteo-baby", notes:"" },
  "b_ean_4770001003008": { id:"b_ean_4770001003008", name:"margarita baby", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"4770001003008", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4770001003008/margarita-baby", notes:"" },
  "b_ean_6135150000373": { id:"b_ean_6135150000373", name:"Maxi bébé", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"6135150000373", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/6135150000373/maxi-bebe", notes:"" },
  "b_ean_30146754": { id:"b_ean_30146754", name:"Maybelline New York SuperStay Teddy Tint 25 Baby Tee Lippenstift", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"30146754", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/30146754/maybelline-new-york-superstay-teddy-tint-25-baby-tee-lippenstift", notes:"" },
  "b_ean_7501044205381": { id:"b_ean_7501044205381", name:"olormax talco hipoalergenico baby", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"7501044205381", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7501044205381/olormax-talco-hipoalergenico-baby", notes:"" },
  "b_ean_4820023360075": { id:"b_ean_4820023360075", name:"Seife baby", brand:"Marke unbekannt", slot:"sonst", age:"baby_0_36m", ean:"4820023360075", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4820023360075/seife-baby", notes:"" },
  "b_ean_8029408103412": { id:"b_ean_8029408103412", name:"Baby gel de baño", brand:"Aqua Farma", slot:"sonst", age:"baby_0_36m", ean:"8029408103412", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8029408103412/baby-gel-de-bano-aqua-farma", notes:"" },
  "b_ean_8001841119946": { id:"b_ean_8001841119946", name:"Baby Ariel", brand:"Ariel", slot:"sonst", age:"baby_0_36m", ean:"8001841119946", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8001841119946/baby-ariel", notes:"" },
  "b_ean_8411582230549": { id:"b_ean_8411582230549", name:"Suavizante hipoalergénico baby", brand:"Asevi", slot:"sonst", age:"baby_0_36m", ean:"8411582230549", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8411582230549/suavizante-hipoalergenico-baby-asevi", notes:"" },
  "b_ean_3596710421138": { id:"b_ean_3596710421138", name:"Gel gingival première dent", brand:"Auchan", slot:"sonst", age:"baby_0_36m", ean:"3596710421138", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710421138/gel-gingival-premiere-dent-auchan", notes:"" },
  "b_ean_3596710313891": { id:"b_ean_3596710313891", name:"Talc baby peaux délicates", brand:"Auchan", slot:"sonst", age:"baby_0_36m", ean:"3596710313891", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710313891/talc-baby-peaux-delicates-auchan", notes:"" },
  "b_ean_3596710329571": { id:"b_ean_3596710329571", name:"Auchan Batonnets Baby X50", brand:"Auchan Baby", slot:"sonst", age:"baby_0_36m", ean:"3596710329571", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710329571/auchan-batonnets-baby-x50-auchan-baby", notes:"" },
  "b_ean_4066447710281": { id:"b_ean_4066447710281", name:"Duschgel Baby", brand:"balea", slot:"sonst", age:"baby_0_36m", ean:"4066447710281", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4066447710281/duschgel-baby-balea", notes:"" },
  "b_ean_3400935940179": { id:"b_ean_3400935940179", name:"Bepanthen Pommade", brand:"Bayer", slot:"sonst", age:"baby_0_36m", ean:"3400935940179", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3400935940179/bepanthen-pommade-bayer", notes:"" },
  "b_ean_3574661407227": { id:"b_ean_3574661407227", name:"bebe 5in1 Erfrischende Reinigungstücher", brand:"bebe", slot:"sonst", age:"baby_0_36m", ean:"3574661407227", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661407227/bebe-5in1-erfrischende-reinigungstucher", notes:"" },
  "b_ean_3574661340623": { id:"b_ean_3574661340623", name:"bebe Lupenrein", brand:"bebe", slot:"sonst", age:"baby_0_36m", ean:"3574661340623", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661340623/bebe-lupenrein", notes:"" },
  "b_ean_3574661384344": { id:"b_ean_3574661384344", name:"bebe Vollgeschmeidig", brand:"bebe", slot:"sonst", age:"baby_0_36m", ean:"3574661384344", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661384344/bebe-vollgeschmeidig", notes:"" },
  "b_ean_3574661671741": { id:"b_ean_3574661671741", name:"Kosmetik Reinigungstücher extra sanft", brand:"bebe", slot:"sonst", age:"baby_0_36m", ean:"3574661671741", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661671741/kosmetik-reinigungstucher-extra-sanft-bebe", notes:"" },
  "b_ean_3574661824390": { id:"b_ean_3574661824390", name:"milde Reinigungstücher", brand:"bebe", slot:"sonst", age:"baby_0_36m", ean:"3574661824390", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661824390/milde-reinigungstucher-bebe", notes:"" },
  "b_ean_3574661406497": { id:"b_ean_3574661406497", name:"Reinigungstücher", brand:"Bebe", slot:"sonst", age:"baby_0_36m", ean:"3574661406497", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661406497/reinigungstucher-bebe", notes:"" },
  "b_ean_3574661407258": { id:"b_ean_3574661407258", name:"Reinigungstücher", brand:"Bebe", slot:"sonst", age:"baby_0_36m", ean:"3574661407258", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661407258/reinigungstucher-bebe", notes:"" },
  "b_ean_3574661261096": { id:"b_ean_3574661261096", name:"Soft & lovely", brand:"Bebe Young Care", slot:"sonst", age:"baby_0_36m", ean:"3574661261096", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661261096/soft-lovely-bebe-young-care", notes:"" },
  "b_ean_4046871005917": { id:"b_ean_4046871005917", name:"Baby", brand:"Bel", slot:"sonst", age:"baby_0_36m", ean:"4046871005917", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4046871005917/baby-bel", notes:"" },
  "b_ean_8010047115089": { id:"b_ean_8010047115089", name:"Baby", brand:"Bema", slot:"sonst", age:"baby_0_36m", ean:"8010047115089", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8010047115089/baby-bema", notes:"" },
  "b_ean_3286010076038": { id:"b_ean_3286010076038", name:"Lait après-soleil Bleu et blanc", brand:"BIOLANE", slot:"sonst", age:"baby_0_36m", ean:"3286010076038", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3286010076038/lait-apres-soleil-bleu-et-blanc-biolane", notes:"" },
  "b_ean_00342632": { id:"b_ean_00342632", name:"Bébé", brand:"Bébé", slot:"sonst", age:"baby_0_36m", ean:"00342632", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/00342632/bebe", notes:"" },
  "b_ean_3560071172534": { id:"b_ean_3560071172534", name:"baby", brand:"Carrefour", slot:"sonst", age:"baby_0_36m", ean:"3560071172534", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071172534/baby-carrefour", notes:"" },
  "b_ean_3560071207717": { id:"b_ean_3560071207717", name:"Baby fresh aloe vera", brand:"Carrefour", slot:"sonst", age:"baby_0_36m", ean:"3560071207717", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071207717/baby-fresh-aloe-vera-carrefour", notes:"" },
  "b_ean_3560071207359": { id:"b_ean_3560071207359", name:"Sensitive", brand:"Carrefour", slot:"sonst", age:"baby_0_36m", ean:"3560071207359", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071207359/sensitive-carrefour", notes:"" },
  "b_ean_3560070218608": { id:"b_ean_3560070218608", name:"sérum physiologique", brand:"Carrefour", slot:"sonst", age:"baby_0_36m", ean:"3560070218608", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560070218608/serum-physiologique-carrefour", notes:"" },
  "b_ean_8431876279610": { id:"b_ean_8431876279610", name:"Gel champú para pieles tendencia atópica my baby", brand:"Carrefour Baby", slot:"sonst", age:"baby_0_36m", ean:"8431876279610", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8431876279610/gel-champu-para-pieles-tendencia-atopica-my-baby-carrefour-baby", notes:"" },
  "b_ean_8431876279566": { id:"b_ean_8431876279566", name:"Gel de baño aloe vera my baby", brand:"Carrefour Baby", slot:"sonst", age:"baby_0_36m", ean:"8431876279566", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8431876279566/gel-de-bano-aloe-vera-my-baby-carrefour-baby", notes:"" },
  "b_ean_8431876279603": { id:"b_ean_8431876279603", name:"Talco my baby", brand:"Carrefour Baby", slot:"sonst", age:"baby_0_36m", ean:"8431876279603", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8431876279603/talco-my-baby-carrefour-baby", notes:"" },
  "b_ean_8718951551992": { id:"b_ean_8718951551992", name:"Adoucissant Concentré 3D Fleurs Blanches et Noix", brand:"Coco SOUPLINE", slot:"sonst", age:"baby_0_36m", ean:"8718951551992", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8718951551992/adoucissant-concentre-3d-fleurs-blanches-et-noix-coco-soupline", notes:"" },
  "b_ean_3245678703885": { id:"b_ean_3245678703885", name:"Sérum physiologique", brand:"Cosmia Baby", slot:"sonst", age:"baby_0_36m", ean:"3245678703885", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678703885/serum-physiologique-cosmia-baby", notes:"" },
  "b_ean_3245678704448": { id:"b_ean_3245678704448", name:"Talc en poudre", brand:"Cosmia Baby", slot:"sonst", age:"baby_0_36m", ean:"3245678704448", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678704448/talc-en-poudre-cosmia-baby", notes:"" },
  "b_ean_8710522420713": { id:"b_ean_8710522420713", name:"Baby gel de ducha", brand:"Dove", slot:"sonst", age:"baby_0_36m", ean:"8710522420713", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8710522420713/baby-gel-de-ducha-unilever", notes:"" },
  "b_ean_7340083492488": { id:"b_ean_7340083492488", name:"Baby våtservetter", brand:"Eldorado", slot:"sonst", age:"baby_0_36m", ean:"7340083492488", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7340083492488/baby-vatservetter-eldorado", notes:"" },
  "b_ean_4059729447395": { id:"b_ean_4059729447395", name:"Essence Baby Got Blush 30 Dusty Rose Liquid Blush", brand:"Essence", slot:"sonst", age:"baby_0_36m", ean:"4059729447395", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4059729447395/essence-baby-got-blush-30-dusty-rose-liquid-blush", notes:"" },
  "b_ean_4059729521347": { id:"b_ean_4059729521347", name:"Essence Baby Got Bronze 10 Golden Hour Shimmering Bronzer", brand:"Essence", slot:"sonst", age:"baby_0_36m", ean:"4059729521347", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4059729521347/essence-baby-got-bronze-10-golden-hour-shimmering-bronzer", notes:"" },
  "b_ean_4059729521354": { id:"b_ean_4059729521354", name:"Essence Baby Got Bronze 20 Holiday Glow Shimmering Bronzer", brand:"Essence", slot:"sonst", age:"baby_0_36m", ean:"4059729521354", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4059729521354/essence-baby-got-bronze-20-holiday-glow-shimmering-bronzer", notes:"" },
  "b_ean_4001499946288": { id:"b_ean_4001499946288", name:"Baby Spül-Reiniger", brand:"Frosch", slot:"sonst", age:"baby_0_36m", ean:"4001499946288", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4001499946288/baby-spul-reiniger-frosch", notes:"" },
  "b_ean_7501022150412": { id:"b_ean_7501022150412", name:"Racimos de oro jabon de bebe", brand:"Grisi", slot:"sonst", age:"baby_0_36m", ean:"7501022150412", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7501022150412/racimos-de-oro-jabon-de-bebe-ricitos-de-oro", notes:"" },
  "b_ean_5029053582306": { id:"b_ean_5029053582306", name:"Drynites Sous-vêtements de nuit absorbants pour filles 8-13 ans (30-48kg)", brand:"HUGGIES", slot:"sonst", age:"baby_0_36m", ean:"5029053582306", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5029053582306/drynites-sous-vetements-de-nuit-absorbants-pour-filles-8-13-ans-30-48kg-huggies", notes:"" },
  "b_ean_8470003924801": { id:"b_ean_8470003924801", name:"Nutraisdin, baby gel champú", brand:"ISDIN", slot:"sonst", age:"baby_0_36m", ean:"8470003924801", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8470003924801/nutraisdin-baby-gel-champu-isdin", notes:"" },
  "b_ean_3574661728216": { id:"b_ean_3574661728216", name:"Johnson’s baby powder", brand:"Johnson & Johnson", slot:"sonst", age:"baby_0_36m", ean:"3574661728216", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661728216/johnson-s-baby-powder-johnson-johnson", notes:"" },
  "b_ean_3574661520476": { id:"b_ean_3574661520476", name:"Camomila", brand:"Johnson's Baby", slot:"sonst", age:"baby_0_36m", ean:"3574661520476", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661520476/camomila-johnson-s-baby", notes:"" },
  "b_ean_3574661520469": { id:"b_ean_3574661520469", name:"Champú", brand:"Johnson's Baby", slot:"sonst", age:"baby_0_36m", ean:"3574661520469", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661520469/champu-johnson-s-baby", notes:"" },
  "b_ean_8540661520469": { id:"b_ean_8540661520469", name:"Champú", brand:"Johnson's Baby", slot:"sonst", age:"baby_0_36m", ean:"8540661520469", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8540661520469/champu-johnson-s-baby", notes:"" },
  "b_ean_7702031169536": { id:"b_ean_7702031169536", name:"Crema liquida avena", brand:"Johnson's Baby", slot:"sonst", age:"baby_0_36m", ean:"7702031169536", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7702031169536/crema-liquida-avena-johnson-s-baby", notes:"" },
  "b_ean_3574660348071": { id:"b_ean_3574660348071", name:"Dulces sueños baño para bebé", brand:"Johnson’s", slot:"sonst", age:"baby_0_36m", ean:"3574660348071", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660348071/dulces-suenos-bano-para-bebe-johnson-s", notes:"" },
  "b_ean_3605970586287": { id:"b_ean_3605970586287", name:"Baby Lío Balm", brand:"Kiehl's", slot:"sonst", age:"baby_0_36m", ean:"3605970586287", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3605970586287/baby-lio-balm-l-oreal", notes:"" },
  "b_ean_5900095002789": { id:"b_ean_5900095002789", name:"Baby cotton buds Baby Sensitive", brand:"Kindii", slot:"sonst", age:"baby_0_36m", ean:"5900095002789", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900095002789/baby-cotton-buds-baby-sensitive-kindii", notes:"" },
  "b_ean_8850002006553": { id:"b_ean_8850002006553", name:"Baby Powder White", brand:"Kodomo", slot:"sonst", age:"baby_0_36m", ean:"8850002006553", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8850002006553/baby-powder-white-kodomo", notes:"" },
  "b_ean_3178041334433": { id:"b_ean_3178041334433", name:"Bébé", brand:"Le Chat", slot:"sonst", age:"baby_0_36m", ean:"3178041334433", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3178041334433/bebe-henkel", notes:"" },
  "b_ean_3549620080018": { id:"b_ean_3549620080018", name:"Baby Organic", brand:"Le Petit Olivier", slot:"sonst", age:"baby_0_36m", ean:"3549620080018", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3549620080018/baby-organic-le-petit-olivier", notes:"" },
  "b_ean_3263855778518": { id:"b_ean_3263855778518", name:"Bébé Sérum physiologique yeux et nez", brand:"Leader Price", slot:"sonst", age:"baby_0_36m", ean:"3263855778518", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3263855778518/bebe-serum-physiologique-yeux-et-nez-leader-price", notes:"" },
  "b_ean_5425011750419": { id:"b_ean_5425011750419", name:"Talc pour bébé", brand:"Les Bébés d Alpha", slot:"sonst", age:"baby_0_36m", ean:"5425011750419", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5425011750419/talc-pour-bebe-les-bebes-d-alpha", notes:"" },
  "b_ean_20182359": { id:"b_ean_20182359", name:"Carrés de coton", brand:"Lidl", slot:"sonst", age:"baby_0_36m", ean:"20182359", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/20182359/carres-de-coton-lidl", notes:"" },
  "b_ean_3564700045305": { id:"b_ean_3564700045305", name:"Eau de mer physiologique stérile bébé", brand:"Marque Repère", slot:"sonst", age:"baby_0_36m", ean:"3564700045305", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3564700045305/eau-de-mer-physiologique-sterile-bebe-marque-repere", notes:"" },
  "b_ean_7613312330333": { id:"b_ean_7613312330333", name:"Puder", brand:"milette Baby care", slot:"sonst", age:"baby_0_36m", ean:"7613312330333", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7613312330333/puder-milette-baby-care", notes:"" },
  "b_ean_3600550944242": { id:"b_ean_3600550944242", name:"Mixa bébé à l'eau minérale naturelle", brand:"Mixa", slot:"sonst", age:"baby_0_36m", ean:"3600550944242", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550944242/mixa-bebe-a-l-eau-minerale-naturelle", notes:"" },
  "b_ean_9005800369495": { id:"b_ean_9005800369495", name:"Nivea baby care", brand:"Nivea", slot:"sonst", age:"baby_0_36m", ean:"9005800369495", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/9005800369495/nivea-baby-care", notes:"" },
  "b_ean_4005900273994": { id:"b_ean_4005900273994", name:"Nivea Baby Lait Nettoyant", brand:"Nivea", slot:"sonst", age:"baby_0_36m", ean:"4005900273994", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005900273994/nivea-baby-lait-nettoyant", notes:"" },
  "b_ean_3245678703908": { id:"b_ean_3245678703908", name:"Maxi carrés bébé", brand:"Pouce", slot:"sonst", age:"baby_0_36m", ean:"3245678703908", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678703908/maxi-carres-bebe-pouce", notes:"" },
  "b_ean_8718951647527": { id:"b_ean_8718951647527", name:"Zero Baby & Kids Corps & Cheveux", brand:"Sanex", slot:"sonst", age:"baby_0_36m", ean:"8718951647527", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8718951647527/zero-baby-kids-corps-cheveux-sanex", notes:"" },
  "b_ean_8480017132222": { id:"b_ean_8480017132222", name:"Baby baño espuma", brand:"Sebamed", slot:"sonst", age:"baby_0_36m", ean:"8480017132222", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8480017132222/baby-bano-espuma-sebamed", notes:"Sebamed Baby & Kind; FF nur mit Label (manche SKUs mit Parfum)." },
  "b_ean_8710447384671": { id:"b_ean_8710447384671", name:"Skip Lessive Liquide Sensitive Peaux Sensibles & Bébés 2,8l 56 Lavages", brand:"Skip", slot:"sonst", age:"baby_0_36m", ean:"8710447384671", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8710447384671/skip-lessive-liquide-sensitive-peaux-sensibles-bebes-2-8l-56-lavages", notes:"" },
  "b_ean_9100000824017": { id:"b_ean_9100000824017", name:"Pretty Baby Feuchte Waschlappen", brand:"Spar", slot:"sonst", age:"baby_0_36m", ean:"9100000824017", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/9100000824017/pretty-baby-feuchte-waschlappen-spar", notes:"" },
  "b_ean_8003510022557": { id:"b_ean_8003510022557", name:"Splend'Or Baby Shampo", brand:"Splend'Or", slot:"sonst", age:"baby_0_36m", ean:"8003510022557", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8003510022557/splend-or-baby-shampo", notes:"" },
  "b_ean_5907502687423": { id:"b_ean_5907502687423", name:"Soothing Baby Powder", brand:"Sylveco dla dzieci", slot:"sonst", age:"baby_0_36m", ean:"5907502687423", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5907502687423/soothing-baby-powder-sylveco-dla-dzieci", notes:"" },
  "b_ean_3661434000546": { id:"b_ean_3661434000546", name:"1er Sérum physiologique naturel", brand:"Uriage", slot:"sonst", age:"baby_0_36m", ean:"3661434000546", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3661434000546/1er-serum-physiologique-naturel-uriage", notes:"Uriage Bébé 1ère Crème laut Marke parfümiert — FF=no." },
  "b_ean_8720181770500": { id:"b_ean_8720181770500", name:"Zwitsal Baby & Kids Mini Geschenkset", brand:"Zwitsal", slot:"sonst", age:"baby_0_36m", ean:"8720181770500", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720181770500/zwitsal-baby-kids-mini-geschenkset", notes:"" },
  "b_ean_3600542520805": { id:"b_ean_3600542520805", name:"Garnier Ambre Solaire Kids Sensitive Expert+ SPF50+ Zonnemelk", brand:"Marke unbekannt", slot:"spf", age:"baby_0_36m", ean:"3600542520805", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3600542520805/garnier-ambre-solaire-kids-sensitive-expert-spf50-zonnemelk", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_8721008611044": { id:"b_ean_8721008611044", name:"NAIF 100 ml BABY & KIND Mineralische Sonnencreme 50: HOHER SCHUTZ 0% PARFÜM", brand:"Marke unbekannt", slot:"spf", age:"baby_0_36m", ean:"8721008611044", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/8721008611044/naif-100-ml-baby-kind-mineralische-sonnencreme-50-hoher-schutz-0-parfum", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_8721008611075": { id:"b_ean_8721008611075", name:"Naïf BABY & KIND Mineralische Sonnencreme 50 HOHER SCHUTZ 0% PARFÜM", brand:"Marke unbekannt", slot:"spf", age:"baby_0_36m", ean:"8721008611075", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/8721008611075/naif-baby-kind-mineralische-sonnencreme-50-hoher-schutz-0-parfum", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3700343046082": { id:"b_ean_3700343046082", name:"Crème solaire bébé spf 50+", brand:"Acroelle", slot:"spf", age:"baby_0_36m", ean:"3700343046082", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3700343046082/creme-solaire-bebe-spf-50-acroelle", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3760075070878": { id:"b_ean_3760075070878", name:"spray solaire haute protection 50 bebe", brand:"alphanova", slot:"spf", age:"baby_0_36m", ean:"3760075070878", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3760075070878/spray-solaire-haute-protection-50-bebe-alphanova", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3760075070014": { id:"b_ean_3760075070014", name:"Lait solaire", brand:"Alphanova bébé", slot:"spf", age:"baby_0_36m", ean:"3760075070014", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3760075070014/lait-solaire-alphanova-bebe", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_4066447579628": { id:"b_ean_4066447579628", name:"Sonnencreme", brand:"baby love", slot:"spf", age:"baby_0_36m", ean:"4066447579628", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/4066447579628/sonnencreme-baby-love", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3760319342822": { id:"b_ean_3760319342822", name:"Lait solaire bébés & enfants SPF50+", brand:"Babytika", slot:"spf", age:"baby_0_36m", ean:"3760319342822", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3760319342822/lait-solaire-bebes-enfants-spf50-babytika", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3760319342839": { id:"b_ean_3760319342839", name:"Pinceau solaire bébés & enfants SPF50+", brand:"Babytika", slot:"spf", age:"baby_0_36m", ean:"3760319342839", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3760319342839/pinceau-solaire-bebes-enfants-spf50-babytika", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3286010096692": { id:"b_ean_3286010096692", name:"Crème solaire haute protection pour bébé SPF50", brand:"BIOLANE", slot:"spf", age:"baby_0_36m", ean:"3286010096692", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3286010096692/creme-solaire-haute-protection-pour-bebe-spf50-biolane", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_8029041109147": { id:"b_ean_8029041109147", name:"Defence sun baby & kid 50+", brand:"Bionike", slot:"spf", age:"baby_0_36m", ean:"8029041109147", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/8029041109147/defence-sun-baby-kid-50-bionike", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_5425001841660": { id:"b_ean_5425001841660", name:"Lait solaire Baby & Kids SPF 50+", brand:"Biosolis", slot:"spf", age:"baby_0_36m", ean:"5425001841660", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/5425001841660/lait-solaire-baby-kids-spf-50-biosolis", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_4033981732079": { id:"b_ean_4033981732079", name:"Crème Solaire Baby & Kids SPF 45", brand:"Eco Cosmetics", slot:"spf", age:"baby_0_36m", ean:"4033981732079", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/4033981732079/creme-solaire-baby-kids-spf-45-eco-cosmetics", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_4033981732086": { id:"b_ean_4033981732086", name:"Crème Solaire Baby & Kids SPF 50+", brand:"Eco Cosmetics", slot:"spf", age:"baby_0_36m", ean:"4033981732086", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/4033981732086/creme-solaire-baby-kids-spf-50-eco-cosmetics", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_4033981732581": { id:"b_ean_4033981732581", name:"Crème Solaire Neutre Baby SPF 50+", brand:"Eco Cosmetics", slot:"spf", age:"baby_0_36m", ean:"4033981732581", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/4033981732581/creme-solaire-neutre-baby-spf-50-eco-cosmetics", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_8710198441609": { id:"b_ean_8710198441609", name:"Etos Sensitive baby & kids lotion SPF 50+", brand:"Etos", slot:"spf", age:"baby_0_36m", ean:"8710198441609", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/8710198441609/etos-sensitive-baby-kids-lotion-spf-50", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_40623405": { id:"b_ean_40623405", name:"HiPP Babysanft Sonnenschutz", brand:"HIPP", slot:"spf", age:"baby_0_36m", ean:"40623405", ff:false, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/40623405/hipp-babysanft-sonnenschutz", notes:"HiPP Babysanft oft ab 1. Lebenstag; viele SKUs mit Parfum in INCI → FF nur bei Label.; SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3282779411189": { id:"b_ean_3282779411189", name:"Spray Solaire enfant au calendula protecteur SPF50+ visage et corps", brand:"Klorane", slot:"spf", age:"baby_0_36m", ean:"3282779411189", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3282779411189/spray-solaire-enfant-au-calendula-protecteur-spf50-visage-et-corps-klorane", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3337872419904": { id:"b_ean_3337872419904", name:"Anthelios SPF 50+ Dermo-Pediatrics Lait Bebe", brand:"La Roche-Posay", slot:"spf", age:"baby_0_36m", ean:"3337872419904", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3337872419904/anthelios-spf-50-dermo-pediatrics-lait-bebe-la-roche-posay", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3600550920765": { id:"b_ean_3600550920765", name:"Lait Solaire Protection Bebe 1ères Vacances Spf50+", brand:"Mixa Solaire", slot:"spf", age:"baby_0_36m", ean:"3600550920765", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3600550920765/lait-solaire-protection-bebe-1eres-vacances-spf50-mixa-solaire", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3504105024390": { id:"b_ean_3504105024390", name:"Lait solaire très haute protection SPF50+", brand:"Mustela", slot:"spf", age:"baby_0_36m", ean:"3504105024390", ff:false, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3504105024390/lait-solaire-tres-haute-protection-spf50-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren.; SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3504105026202": { id:"b_ean_3504105026202", name:"Lait solaire très haute protection spécial visage SPF50+", brand:"Mustela", slot:"spf", age:"baby_0_36m", ean:"3504105026202", ff:false, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3504105026202/lait-solaire-tres-haute-protection-special-visage-spf50-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren.; SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3504105031541": { id:"b_ean_3504105031541", name:"Spray lait solaire très haute protection SPF 50+ waterproof", brand:"Mustela", slot:"spf", age:"baby_0_36m", ean:"3504105031541", ff:false, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3504105031541/spray-lait-solaire-tres-haute-protection-spf-50-waterproof-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren.; SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3504105033217": { id:"b_ean_3504105033217", name:"Spray solaire haute protection bébé enfant", brand:"Mustela", slot:"spf", age:"baby_0_36m", ean:"3504105033217", ff:false, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/3504105033217/spray-solaire-haute-protection-bebe-enfant-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren.; SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_4005900246592": { id:"b_ean_4005900246592", name:"Baby sun Crème solaire très haute protection FPS 50+", brand:"Nivea", slot:"spf", age:"baby_0_36m", ean:"4005900246592", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/4005900246592/baby-sun-creme-solaire-tres-haute-protection-fps-50-nivea", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_4005900001191": { id:"b_ean_4005900001191", name:"Baby Sun lait solaire FPS 50+", brand:"Nivea", slot:"spf", age:"baby_0_36m", ean:"4005900001191", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/4005900001191/baby-sun-lait-solaire-fps-50-nivea", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_9005800261041": { id:"b_ean_9005800261041", name:"Baby sun protection cream", brand:"Nivea", slot:"spf", age:"baby_0_36m", ean:"9005800261041", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/9005800261041/baby-sun-protection-cream-nivea", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_0400590091195": { id:"b_ean_0400590091195", name:"Crème solaire Spray Bébé Enfant Corps Visage Spf 50+ Très Haute Protection Peau Sensible Sun", brand:"Nivea", slot:"spf", age:"baby_0_36m", ean:"0400590091195", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/0400590091195/creme-solaire-spray-bebe-enfant-corps-visage-spf-50-tres-haute-protection-peau-sensible-sun-nivea", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_0400590059751": { id:"b_ean_0400590059751", name:"Crème solaire Spray Bébé Enfant Spf 50+ Haute Protection Peau Sensible", brand:"Nivea", slot:"spf", age:"baby_0_36m", ean:"0400590059751", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/0400590059751/creme-solaire-spray-bebe-enfant-spf-50-haute-protection-peau-sensible-sun-nivea", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_4005900911957": { id:"b_ean_4005900911957", name:"Baby & kids sensitive protect 50+", brand:"Nivea sun", slot:"spf", age:"baby_0_36m", ean:"4005900911957", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/4005900911957/baby-kids-sensitive-protect-50-nivea-sun", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_5701943100882": { id:"b_ean_5701943100882", name:"P20 Kids SPF50+ Zonnebrandcrème", brand:"Riemann", slot:"spf", age:"baby_0_36m", ean:"5701943100882", ff: null, u3:true, cf: null, nc: null, spfNote:"AAP/AAD: unter 6 Monaten SPF nicht first-line", url:"https://world.openbeautyfacts.org/product/5701943100882/p20-kids-spf50-zonnebrandcreme-riemann", notes:"SAFETY NOTE unter 6 Mon.: Schatten/Kleidung first-line, kein SPF-First für Neonaten in App-Copy." },
  "b_ean_3564700386941": { id:"b_ean_3564700386941", name:"Lingettes Bébé Mots D'enfants, Sensitives Recharge x63", brand:"Marke unbekannt", slot:"windel", age:"baby_0_36m", ean:"3564700386941", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3564700386941/lingettes-bebe-mots-d-enfants-sensitives-recharge-x63", notes:"" },
  "b_ean_3283950920766": { id:"b_ean_3283950920766", name:"Lingettes nettoyantes bebe", brand:"Marke unbekannt", slot:"windel", age:"baby_0_36m", ean:"3283950920766", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3283950920766/lingettes-nettoyantes-bebe", notes:"" },
  "b_ean_5099514000212": { id:"b_ean_5099514000212", name:"Waterwipes Baby Wipes 60", brand:"A-Derma", slot:"windel", age:"baby_0_36m", ean:"5099514000212", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5099514000212/waterwipes-baby-wipes-60-a-derma", notes:"" },
  "b_ean_3700343045054": { id:"b_ean_3700343045054", name:"Liniment Apaisant", brand:"Acorelle Bébé", slot:"windel", age:"baby_0_36m", ean:"3700343045054", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3700343045054/liniment-apaisant-acorelle-bebe", notes:"" },
  "b_ean_8711868004773": { id:"b_ean_8711868004773", name:"Lingettes bébé sensitive", brand:"Action", slot:"windel", age:"baby_0_36m", ean:"8711868004773", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711868004773/lingettes-bebe-sensitive-action", notes:"" },
  "b_ean_3760075070694": { id:"b_ean_3760075070694", name:"Bio-Liniment", brand:"Alphanova Bébé", slot:"windel", age:"baby_0_36m", ean:"3760075070694", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3760075070694/bio-liniment-alphanova-bebe", notes:"" },
  "b_ean_8001090603296": { id:"b_ean_8001090603296", name:"Lingettes", brand:"Aqua", slot:"windel", age:"baby_0_36m", ean:"8001090603296", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8001090603296/lingettes-aqua", notes:"" },
  "b_ean_3596710394111": { id:"b_ean_3596710394111", name:"Auchan Baby Liniment oléo calcaire", brand:"Auchan", slot:"windel", age:"baby_0_36m", ean:"3596710394111", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710394111/auchan-baby-liniment-oleo-calcaire", notes:"" },
  "b_ean_3596710327720": { id:"b_ean_3596710327720", name:"Lingettes débarbouillantes sans rinçage parfum fruité", brand:"Auchan", slot:"windel", age:"baby_0_36m", ean:"3596710327720", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710327720/lingettes-debarbouillantes-sans-rincage-parfum-fruite-auchan", notes:"" },
  "b_ean_3245678691458": { id:"b_ean_3245678691458", name:"Lingettes sensitives à l'extrait de camomille", brand:"Auchan", slot:"windel", age:"baby_0_36m", ean:"3245678691458", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691458/lingettes-sensitives-a-l-extrait-de-camomille-auchan", notes:"" },
  "b_ean_3596710520558": { id:"b_ean_3596710520558", name:"Lingettes", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710520558", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710520558/lingettes-auchan-baby", notes:"" },
  "b_ean_3596710520510": { id:"b_ean_3596710520510", name:"Lingettes fraîcheur", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710520510", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710520510/lingettes-fraicheur-auchan-baby", notes:"" },
  "b_ean_3596710520527": { id:"b_ean_3596710520527", name:"Lingettes fraîcheur", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710520527", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710520527/lingettes-fraicheur-auchan-baby", notes:"" },
  "b_ean_3596710535286": { id:"b_ean_3596710535286", name:"Lingettes fraîcheur", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710535286", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710535286/lingettes-fraicheur-auchan-baby", notes:"" },
  "b_ean_3596710535293": { id:"b_ean_3596710535293", name:"Lingettes fraîcheur", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710535293", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710535293/lingettes-fraicheur-auchan-baby", notes:"" },
  "b_ean_3596710520534": { id:"b_ean_3596710520534", name:"Lingettes sensitives", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710520534", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710520534/lingettes-sensitives-auchan-baby", notes:"" },
  "b_ean_3596710520541": { id:"b_ean_3596710520541", name:"Lingettes sensitives", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710520541", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710520541/lingettes-sensitives-auchan-baby", notes:"" },
  "b_ean_3596710520572": { id:"b_ean_3596710520572", name:"Lingettes visage et mains", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710520572", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710520572/lingettes-visage-et-mains-auchan-baby", notes:"" },
  "b_ean_3596710520565": { id:"b_ean_3596710520565", name:"Lingettes à l'eau", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710520565", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710520565/lingettes-a-l-eau-auchan-baby", notes:"" },
  "b_ean_3596710532933": { id:"b_ean_3596710532933", name:"Lingettes à l'eau", brand:"Auchan Baby", slot:"windel", age:"baby_0_36m", ean:"3596710532933", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710532933/lingettes-a-l-eau-auchan-baby", notes:"" },
  "b_ean_3596710520589": { id:"b_ean_3596710520589", name:"Lingettes nettoyantes", brand:"Auchan Baby Bio", slot:"windel", age:"baby_0_36m", ean:"3596710520589", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710520589/lingettes-nettoyantes-auchan-baby-bio", notes:"" },
  "b_ean_3245678041291": { id:"b_ean_3245678041291", name:"Liniment oléo calcaire à l'huile d'olive vierge bio", brand:"Auchan Baby Bio", slot:"windel", age:"baby_0_36m", ean:"3245678041291", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678041291/liniment-oleo-calcaire-a-l-huile-d-olive-vierge-bio-auchan-baby-bio", notes:"" },
  "b_ean_3574661478067": { id:"b_ean_3574661478067", name:"Aveeno baby", brand:"Aveeno", slot:"windel", age:"baby_0_36m", ean:"3574661478067", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661478067/aveeno-baby", notes:"" },
  "b_ean_8014002000748": { id:"b_ean_8014002000748", name:"Toallitas bebé", brand:"Baby Lindo", slot:"windel", age:"baby_0_36m", ean:"8014002000748", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8014002000748/toallitas-bebe-baby-lindo", notes:"" },
  "b_ean_5903111218423": { id:"b_ean_5903111218423", name:"Silk soft baby wipes", brand:"Baby Wipes", slot:"windel", age:"baby_0_36m", ean:"5903111218423", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5903111218423/silk-soft-baby-wipes", notes:"" },
  "b_ean_4305615745022": { id:"b_ean_4305615745022", name:"Baby wipes", brand:"Babydream", slot:"windel", age:"baby_0_36m", ean:"4305615745022", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4305615745022/baby-wipes-babydream", notes:"" },
  "b_ean_4068134128843": { id:"b_ean_4068134128843", name:"Baby wipes", brand:"Babydream", slot:"windel", age:"baby_0_36m", ean:"4068134128843", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4068134128843/baby-wipes-babydream", notes:"" },
  "b_ean_4305615544014": { id:"b_ean_4305615544014", name:"Babydream extra sensitiv Feuchttücher", brand:"Babydream", slot:"windel", age:"baby_0_36m", ean:"4305615544014", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4305615544014/babydream-extra-sensitiv-feuchttucher", notes:"" },
  "b_ean_5900017095332": { id:"b_ean_5900017095332", name:"Baby wipes", brand:"Bambino", slot:"windel", age:"baby_0_36m", ean:"5900017095332", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900017095332/baby-wipes-bambino", notes:"" },
  "b_ean_3401562576519": { id:"b_ean_3401562576519", name:"Bepanthen Protect", brand:"Bayer", slot:"windel", age:"baby_0_36m", ean:"3401562576519", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401562576519/bepanthen-protect-bayer", notes:"" },
  "b_ean_3574660653571": { id:"b_ean_3574660653571", name:"Pommade de change", brand:"Bebe Biafine", slot:"windel", age:"baby_0_36m", ean:"3574660653571", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574660653571/pommade-de-change-bebe-biafine", notes:"" },
  "b_ean_3800144806301": { id:"b_ean_3800144806301", name:"Мокри кърпи", brand:"bebo", slot:"windel", age:"baby_0_36m", ean:"3800144806301", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3800144806301/мокри-кърпи-bebo", notes:"" },
  "b_ean_4002857031264": { id:"b_ean_4002857031264", name:"Baby wipes", brand:"Bevola", slot:"windel", age:"baby_0_36m", ean:"4002857031264", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4002857031264/baby-wipes-bevola", notes:"" },
  "b_ean_3660992005482": { id:"b_ean_3660992005482", name:"Lingettes pour bébé épaisses 80 pièces", brand:"Bien Vu!", slot:"windel", age:"baby_0_36m", ean:"3660992005482", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3660992005482/lingettes-pour-bebe-epaisses-80-pieces-bien-vu", notes:"" },
  "b_ean_3401599487697": { id:"b_ean_3401599487697", name:"Bioderma Abcderm Lingettes Nettoyantes Visage Et Corps. BT", brand:"Bioderma", slot:"windel", age:"baby_0_36m", ean:"3401599487697", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401599487697/bioderma-abcderm-lingettes-nettoyantes-visage-et-corps-bt", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3401396924944": { id:"b_ean_3401396924944", name:"Bioderma Change Intensif ABCDerm", brand:"Bioderma", slot:"windel", age:"baby_0_36m", ean:"3401396924944", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401396924944/bioderma-change-intensif-abcderm", notes:"ABCDerm Baby/Kind ab Geburt; mehrere SKUs mit Parfum in INCI." },
  "b_ean_3286010097071": { id:"b_ean_3286010097071", name:"Baume de change au liniment oléo-calcaire", brand:"Biolane", slot:"windel", age:"baby_0_36m", ean:"3286010097071", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3286010097071/baume-de-change-au-liniment-oleo-calcaire-biolane", notes:"" },
  "b_ean_3265660399100": { id:"b_ean_3265660399100", name:"lingette bébé", brand:"bocoton", slot:"windel", age:"baby_0_36m", ean:"3265660399100", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3265660399100/lingette-bebe-bocoton", notes:"" },
  "b_ean_8718989021191": { id:"b_ean_8718989021191", name:"Bonbébé toeten boeners", brand:"Bonbébé", slot:"windel", age:"baby_0_36m", ean:"8718989021191", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8718989021191/bonbebe-toeten-boeners", notes:"" },
  "b_ean_3760172444107": { id:"b_ean_3760172444107", name:"Liniment Bébé Stabilisé Hypoallergénique", brand:"Born to Bio", slot:"windel", age:"baby_0_36m", ean:"3760172444107", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3760172444107/liniment-bebe-stabilise-hypoallergenique-born-to-bio", notes:"" },
  "b_ean_3489940068047": { id:"b_ean_3489940068047", name:"Crème pour le change", brand:"Bébé Bio", slot:"windel", age:"baby_0_36m", ean:"3489940068047", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3489940068047/creme-pour-le-change-bebe-bio", notes:"" },
  "b_ean_3600550995480": { id:"b_ean_3600550995480", name:"liniment traditionnel", brand:"bébé cadum", slot:"windel", age:"baby_0_36m", ean:"3600550995480", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550995480/liniment-traditionnel-bebe-cadum", notes:"" },
  "b_ean_3700970204145": { id:"b_ean_3700970204145", name:"Liniment Oléo-Calcaire sans rinçage", brand:"Bébé Smart", slot:"windel", age:"baby_0_36m", ean:"3700970204145", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3700970204145/liniment-oleo-calcaire-sans-rincage-bebe-smart", notes:"" },
  "b_ean_3700970204152": { id:"b_ean_3700970204152", name:"Liniment Oléo-calcaire sans rinçage", brand:"Bébé Smart", slot:"windel", age:"baby_0_36m", ean:"3700970204152", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3700970204152/liniment-oleo-calcaire-sans-rincage-bebe-smart", notes:"" },
  "b_ean_8431876069952": { id:"b_ean_8431876069952", name:"Baby Lingette Bebe Eco Recharge Rectangulaire 72ctnettoyant Et Adoucissant Epaisse Aloe Vera", brand:"Carrefour", slot:"windel", age:"baby_0_36m", ean:"8431876069952", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8431876069952/baby-lingette-bebe-eco-recharge-rectangulaire-72ctnettoyant-et-adoucissant-epaisse-aloe-vera-carrefour", notes:"" },
  "b_ean_3560071212193": { id:"b_ean_3560071212193", name:"lingettes 100 % coton bio Carrefour Baby", brand:"Carrefour", slot:"windel", age:"baby_0_36m", ean:"3560071212193", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071212193/lingettes-100-coton-bio-carrefour-baby", notes:"" },
  "b_ean_3560071105686": { id:"b_ean_3560071105686", name:"Lingettes épaisses Sensitive (lot x2 paquets)", brand:"Carrefour", slot:"windel", age:"baby_0_36m", ean:"3560071105686", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071105686/lingettes-epaisses-sensitive-lot-x2-paquets-carrefour", notes:"" },
  "b_ean_3560070999385": { id:"b_ean_3560070999385", name:"Liniment Oleo Calcaire", brand:"Carrefour Baby", slot:"windel", age:"baby_0_36m", ean:"3560070999385", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560070999385/liniment-oleo-calcaire-carrefour-baby", notes:"" },
  "b_ean_3760001762532": { id:"b_ean_3760001762532", name:"Liniment oléo-calcaire à l'huile d'olive bio pour bébé", brand:"CARRYBOO", slot:"windel", age:"baby_0_36m", ean:"3760001762532", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3760001762532/liniment-oleo-calcaire-a-l-huile-d-olive-bio-pour-bebe-carryboo", notes:"" },
  "b_ean_3222475981784": { id:"b_ean_3222475981784", name:"Lingettes Sensitive pour bébé - Lait à l'extrait d'Aloe Vera", brand:"Casino", slot:"windel", age:"baby_0_36m", ean:"3222475981784", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3222475981784/lingettes-sensitive-pour-bebe-lait-a-l-extrait-d-aloe-vera-casino", notes:"" },
  "b_ean_3283950919166": { id:"b_ean_3283950919166", name:"Cattier Bébé Liniment Lait Crème Pour Le Change", brand:"Cattier", slot:"windel", age:"baby_0_36m", ean:"3283950919166", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3283950919166/cattier-bebe-liniment-lait-creme-pour-le-change", notes:"" },
  "b_ean_3283950915038": { id:"b_ean_3283950915038", name:"Crème protectrice bebe pour le change abricot", brand:"Cattier", slot:"windel", age:"baby_0_36m", ean:"3283950915038", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3283950915038/creme-protectrice-bebe-pour-le-change-abricot-cattier", notes:"" },
  "b_ean_3770006053047": { id:"b_ean_3770006053047", name:"Liniment oléo-calcaire", brand:"Charlotte Baby Bio", slot:"windel", age:"baby_0_36m", ean:"3770006053047", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3770006053047/liniment-oleo-calcaire-charlotte-baby-bio", notes:"" },
  "b_ean_2006050132355": { id:"b_ean_2006050132355", name:"Lingettes bébé à l'eau", brand:"CHERUBIN", slot:"windel", age:"baby_0_36m", ean:"2006050132355", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/2006050132355/lingettes-bebe-a-l-eau-cherubin", notes:"" },
  "b_ean_8414807544650": { id:"b_ean_8414807544650", name:"Cremosas", brand:"Consum", slot:"windel", age:"baby_0_36m", ean:"8414807544650", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8414807544650/cremosas-consum", notes:"" },
  "b_ean_8414807544629": { id:"b_ean_8414807544629", name:"Toallitas aloe vera", brand:"Consum", slot:"windel", age:"baby_0_36m", ean:"8414807544629", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8414807544629/toallitas-aloe-vera-consum", notes:"" },
  "b_ean_3468080081116": { id:"b_ean_3468080081116", name:"Corine de Farme Liniment Calcium Balsem", brand:"Corine", slot:"windel", age:"baby_0_36m", ean:"3468080081116", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080081116/corine-de-farme-liniment-calcium-balsem", notes:"" },
  "b_ean_3468080082588": { id:"b_ean_3468080082588", name:"Crème change apaisante peaux sensibles", brand:"Corine de Farme", slot:"windel", age:"baby_0_36m", ean:"3468080082588", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080082588/creme-change-apaisante-peaux-sensibles-corine-de-farme-baby", notes:"" },
  "b_ean_3468080106543": { id:"b_ean_3468080106543", name:"Lingettes Sensitive Au Calendula Bio Bébé Avec Dévidoir", brand:"Corine De Farme", slot:"windel", age:"baby_0_36m", ean:"3468080106543", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080106543/lingettes-sensitive-au-calendula-bio-bebe-avec-devidoir-corine-de-farme", notes:"" },
  "b_ean_3468080081628": { id:"b_ean_3468080081628", name:"Lingettes nettoyantes pour bébé", brand:"Corinne de Farme", slot:"windel", age:"baby_0_36m", ean:"3468080081628", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3468080081628/lingettes-nettoyantes-pour-bebe-corinne-de-farme", notes:"" },
  "b_ean_3245678707579": { id:"b_ean_3245678707579", name:"Auchan baby- liniment oléo-calcaire - a l'huile d'olive - dès la naissance sauf prématurés bébé - 500 ml", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678707579", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678707579/auchan-baby-liniment-oleo-calcaire-a-l-huile-d-olive-des-la-naissance-sauf-prematures-bebe-500-ml-cosmia-baby", notes:"" },
  "b_ean_3245678691427": { id:"b_ean_3245678691427", name:"Lingettes fraîcheur", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691427", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691427/lingettes-fraicheur-cosmia-baby", notes:"" },
  "b_ean_3245678691441": { id:"b_ean_3245678691441", name:"Lingettes fraîcheur", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691441", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691441/lingettes-fraicheur-cosmia-baby", notes:"" },
  "b_ean_3245678691434": { id:"b_ean_3245678691434", name:"Lingettes fraîcheur", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691434", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691434/lingettes-fraicheur-cosmia-baby", notes:"" },
  "b_ean_3245678691489": { id:"b_ean_3245678691489", name:"Lingettes nettoyantes à l'aloe vera bio", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691489", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691489/lingettes-nettoyantes-a-l-aloe-vera-bio-cosmia-baby", notes:"" },
  "b_ean_3245678691496": { id:"b_ean_3245678691496", name:"Lingettes nettoyantes à l'huile d'olive", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691496", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691496/lingettes-nettoyantes-a-l-huile-d-olive-cosmia-baby", notes:"" },
  "b_ean_3245678691502": { id:"b_ean_3245678691502", name:"Lingettes nouveau-né à l'extrait de calendula", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691502", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691502/lingettes-nouveau-ne-a-l-extrait-de-calendula-cosmia-baby", notes:"" },
  "b_ean_3245678691519": { id:"b_ean_3245678691519", name:"Lingettes papier toilette", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691519", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691519/lingettes-papier-toilette-cosmia-baby", notes:"" },
  "b_ean_3245678691526": { id:"b_ean_3245678691526", name:"Lingettes papier toilette", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691526", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691526/lingettes-papier-toilette-cosmia-baby", notes:"" },
  "b_ean_3245678691465": { id:"b_ean_3245678691465", name:"Lingettes sensitives à l'extrait de camomille", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691465", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691465/lingettes-sensitives-a-l-extrait-de-camomille-cosmia-baby", notes:"" },
  "b_ean_3245678691472": { id:"b_ean_3245678691472", name:"Lingettes visage et mains à l'huile d'amande douce", brand:"Cosmia Baby", slot:"windel", age:"baby_0_36m", ean:"3245678691472", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691472/lingettes-visage-et-mains-a-l-huile-d-amande-douce-cosmia-baby", notes:"" },
  "b_ean_8480000794277": { id:"b_ean_8480000794277", name:"Toallitas bebé frescas y perfumadas", brand:"Deliplus", slot:"windel", age:"baby_0_36m", ean:"8480000794277", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8480000794277/toallitas-bebe-frescas-y-perfumadas-deliplus", notes:"" },
  "b_ean_3401520672673": { id:"b_ean_3401520672673", name:"Liniment oléo calcaire stabilité", brand:"Dermactive Bébé", slot:"windel", age:"baby_0_36m", ean:"3401520672673", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401520672673/liniment-oleo-calcaire-stabilite-dermactive-bebe", notes:"" },
  "b_ean_8001300820642": { id:"b_ean_8001300820642", name:"Bebè salviettine detergenti corpo", brand:"Despar", slot:"windel", age:"baby_0_36m", ean:"8001300820642", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8001300820642/bebe-salviettine-detergenti-corpo-despar", notes:"" },
  "b_ean_3700763501581": { id:"b_ean_3700763501581", name:"Lingettes nettoyantes", brand:"Dodie", slot:"windel", age:"baby_0_36m", ean:"3700763501581", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3700763501581/lingettes-nettoyantes-douceur-dermo-apaisantes-dodie", notes:"" },
  "b_ean_3380380064722": { id:"b_ean_3380380064722", name:"Beauté & Hygiène / Change Bébé / Liniment", brand:"Douce Nature", slot:"windel", age:"baby_0_36m", ean:"3380380064722", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3380380064722/beaute-hygiene-change-bebe-liniment-douce-nature", notes:"" },
  "b_ean_6422876000603": { id:"b_ean_6422876000603", name:"Doctor wipes aloe vera", brand:"Europack media", slot:"windel", age:"baby_0_36m", ean:"6422876000603", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/6422876000603/doctor-wipes-aloe-vera-europack-media", notes:"" },
  "b_ean_3489940068085": { id:"b_ean_3489940068085", name:"BEBE BIO Liniment oléo calcaire", brand:"GRAVIER BEBE BIO", slot:"windel", age:"baby_0_36m", ean:"3489940068085", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3489940068085/bebe-bio-liniment-oleo-calcaire-gravier-bebe-bio", notes:"" },
  "b_ean_3489940068078": { id:"b_ean_3489940068078", name:"BEBE BIO Liniment oléo calcaire", brand:"Gravier Bébé Bio", slot:"windel", age:"baby_0_36m", ean:"3489940068078", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3489940068078/bebe-bio-liniment-oleo-calcaire-gravier-bebe-bio", notes:"" },
  "b_ean_8718537561247": { id:"b_ean_8718537561247", name:"Baby wipes with 99.4% water", brand:"HEMA", slot:"windel", age:"baby_0_36m", ean:"8718537561247", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8718537561247/baby-wipes-with-99-4-water-hema", notes:"" },
  "b_ean_40623474": { id:"b_ean_40623474", name:"GESICHT & HÄNDE Ultra-Sensitiv", brand:"HiPP", slot:"windel", age:"baby_0_36m", ean:"40623474", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/40623474/gesicht-hande-ultra-sensitiv-hipp", notes:"HiPP Babysanft oft ab 1. Lebenstag; viele SKUs mit Parfum in INCI → FF nur bei Label." },
  "b_ean_5029053550237": { id:"b_ean_5029053550237", name:"Everyday", brand:"Huggies", slot:"windel", age:"baby_0_36m", ean:"5029053550237", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5029053550237/everyday-huggies", notes:"" },
  "b_ean_5029053585543": { id:"b_ean_5029053585543", name:"Extra Care Sensitive Wipes", brand:"Huggies", slot:"windel", age:"baby_0_36m", ean:"5029053585543", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5029053585543/extra-care-sensitive-wipes-huggies", notes:"" },
  "b_ean_5029053550152": { id:"b_ean_5029053550152", name:"Lingettes Natural Care with Aloe Vera", brand:"Huggies", slot:"windel", age:"baby_0_36m", ean:"5029053550152", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5029053550152/huggies-green-wips", notes:"" },
  "b_ean_5029053550039": { id:"b_ean_5029053550039", name:"linguettes HUGGIES pure", brand:"Huggies", slot:"windel", age:"baby_0_36m", ean:"5029053550039", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5029053550039/linguettes-huggies-pure", notes:"" },
  "b_ean_5029053582238": { id:"b_ean_5029053582238", name:"Simply Clean", brand:"Huggies", slot:"windel", age:"baby_0_36m", ean:"5029053582238", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5029053582238/huggies", notes:"" },
  "b_ean_8480012004814": { id:"b_ean_8480012004814", name:"Toallitas húmedas baby", brand:"IFA", slot:"windel", age:"baby_0_36m", ean:"8480012004814", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8480012004814/toallitas-humedas-baby-ummia", notes:"" },
  "b_ean_3410280029177": { id:"b_ean_3410280029177", name:"Lingettes bébé", brand:"Intermarché", slot:"windel", age:"baby_0_36m", ean:"3410280029177", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3410280029177/lingettes-bebe-intermarche", notes:"" },
  "b_ean_5744004980238": { id:"b_ean_5744004980238", name:"Baby wipes", brand:"Jelp", slot:"windel", age:"baby_0_36m", ean:"5744004980238", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5744004980238/baby-wipes-jelp", notes:"" },
  "b_ean_5025404004497": { id:"b_ean_5025404004497", name:"Lingettes toilette fesses bébé", brand:"KANDOO", slot:"windel", age:"baby_0_36m", ean:"5025404004497", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5025404004497/lingettes-toilette-fesses-bebe-kandoo", notes:"" },
  "b_ean_53900095034940": { id:"b_ean_53900095034940", name:"Baby wipes", brand:"Kindii", slot:"windel", age:"baby_0_36m", ean:"53900095034940", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/53900095034940/baby-wipes-kindii", notes:"" },
  "b_ean_5900095035107": { id:"b_ean_5900095035107", name:"Wet wipes for infants and babies", brand:"Kindii", slot:"windel", age:"baby_0_36m", ean:"5900095035107", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900095035107/wet-wipes-for-infants-and-babies-kindii", notes:"" },
  "b_ean_5900095033530": { id:"b_ean_5900095033530", name:"Wet wipes for infants and babies", brand:"Kindii", slot:"windel", age:"baby_0_36m", ean:"5900095033530", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900095033530/wet-wipes-for-infants-and-babies-kindii", notes:"" },
  "b_ean_3282779326940": { id:"b_ean_3282779326940", name:"Klorane Bébé Crème protectrice pour le change", brand:"Klorane", slot:"windel", age:"baby_0_36m", ean:"3282779326940", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779326940/klorane-bebe-creme-protectrice-pour-le-change", notes:"" },
  "b_ean_3282779317337": { id:"b_ean_3282779317337", name:"Klorane Bébé Eryteal Liniment", brand:"Klorane", slot:"windel", age:"baby_0_36m", ean:"3282779317337", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779317337/klorane-bebe-eryteal-liniment", notes:"" },
  "b_ean_3282779053266": { id:"b_ean_3282779053266", name:"Klorane Bébé Eryteal Pommade", brand:"Klorane", slot:"windel", age:"baby_0_36m", ean:"3282779053266", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779053266/klorane-bebe-eryteal-pommade", notes:"" },
  "b_ean_3282779327039": { id:"b_ean_3282779327039", name:"Klorane Bébé Lingettes nettoyantes douceur au lait de toilette", brand:"Klorane", slot:"windel", age:"baby_0_36m", ean:"3282779327039", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3282779327039/klorane-bebe-lingettes-nettoyantes-douceur-au-lait-de-toilette", notes:"" },
  "b_ean_3770000717150": { id:"b_ean_3770000717150", name:"Mon petit la rosée Liniment 100% naturel huile olive bébé", brand:"LA ROSEE", slot:"windel", age:"baby_0_36m", ean:"3770000717150", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3770000717150/mon-petit-la-rosee-liniment-100-naturel-huile-olive-bebe", notes:"" },
  "b_ean_3664696005021": { id:"b_ean_3664696005021", name:"INSTANT BEBE Liniment oléocalcaire", brand:"Laboratoire Giphar", slot:"windel", age:"baby_0_36m", ean:"3664696005021", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3664696005021/instant-bebe-liniment-oleocalcaire-laboratoire-giphar", notes:"" },
  "b_ean_3518646126758": { id:"b_ean_3518646126758", name:"Liniment Oleo-Calcaire", brand:"Laboratoires Gilbert", slot:"windel", age:"baby_0_36m", ean:"3518646126758", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3518646126758/liniment-oleo-calcaire-laboratoires-gilbert", notes:"" },
  "b_ean_3058325066246": { id:"b_ean_3058325066246", name:"Lingettes ultra-fraîches à l'eau nettoyante", brand:"LASCAD", slot:"windel", age:"baby_0_36m", ean:"3058325066246", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3058325066246/lingettes-ultra-fraiches-a-l-eau-nettoyante-l-oreal", notes:"" },
  "b_ean_3760099591335": { id:"b_ean_3760099591335", name:"Natural caresse à l'huile d'amande douce", brand:"LASCAD", slot:"windel", age:"baby_0_36m", ean:"3760099591335", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3760099591335/natural-caresse-a-l-huile-d-amande-douce-l-oreal", notes:"" },
  "b_ean_3263856209318": { id:"b_ean_3263856209318", name:"80 lingettes pour bébé", brand:"Leader Price", slot:"windel", age:"baby_0_36m", ean:"3263856209318", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3263856209318/80-lingettes-pour-bebe-leader-price", notes:"" },
  "b_ean_3263855778037": { id:"b_ean_3263855778037", name:"Bébé Lait de Toilette Visage, Corps et Change", brand:"Leader Price", slot:"windel", age:"baby_0_36m", ean:"3263855778037", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3263855778037/bebe-lait-de-toilette-visage-corps-et-change-leader-price", notes:"" },
  "b_ean_4056489191681": { id:"b_ean_4056489191681", name:"Lingettes pour bébé sensitive Lupilu", brand:"Lidl", slot:"windel", age:"baby_0_36m", ean:"4056489191681", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4056489191681/lingettes-pour-bebe-sensitive-lupilu-lidl", notes:"" },
  "b_ean_4260678845037": { id:"b_ean_4260678845037", name:"Lingettes bébé", brand:"Lillydoo", slot:"windel", age:"baby_0_36m", ean:"4260678845037", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4260678845037/lingettes-bebe-lillydoo", notes:"" },
  "b_ean_5901912623477": { id:"b_ean_5901912623477", name:"Baby wipes", brand:"Love & Care Gugu", slot:"windel", age:"baby_0_36m", ean:"5901912623477", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5901912623477/baby-wipes-love-care-gugu", notes:"" },
  "b_ean_3517360016079": { id:"b_ean_3517360016079", name:"Eau Thermale Jonzac Bébé Bio - Liniment Doux Oléo-Calcaire", brand:"Léa Nature", slot:"windel", age:"baby_0_36m", ean:"3517360016079", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360016079/eau-thermale-jonzac-bebe-bio-liniment-doux-oleo-calcaire-lea-nature", notes:"" },
  "b_ean_3517360012453": { id:"b_ean_3517360012453", name:"Liniment Doux Oléo-Calcaire - Eau Thermale Jonzac Bébé Bio", brand:"Léa Nature", slot:"windel", age:"baby_0_36m", ean:"3517360012453", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360012453/liniment-doux-oleo-calcaire-eau-thermale-jonzac-bebe-bio-lea-nature", notes:"" },
  "b_ean_3517360016819": { id:"b_ean_3517360016819", name:"SO'BIO ETIC - BABY LINIMENT OLÉO-CALCAIRE", brand:"Léa Nature", slot:"windel", age:"baby_0_36m", ean:"3517360016819", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360016819/so-bio-etic-baby-liniment-oleo-calcaire-lea-nature", notes:"" },
  "b_ean_3517360000290": { id:"b_ean_3517360000290", name:"So'Bio Etic Baby' Liniment", brand:"Léa Nature", slot:"windel", age:"baby_0_36m", ean:"3517360000290", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360000290/so-bio-etic-baby-liniment-lea-nature", notes:"" },
  "b_ean_3582910072393": { id:"b_ean_3582910072393", name:"Lingettes bébé", brand:"Mitosyl", slot:"windel", age:"baby_0_36m", ean:"3582910072393", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3582910072393/lingettes-bebe-mitosyl", notes:"" },
  "b_ean_3760162124231": { id:"b_ean_3760162124231", name:"Baby Green Liniment Bio", brand:"MKL", slot:"windel", age:"baby_0_36m", ean:"3760162124231", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3760162124231/baby-green-liniment-bio-mkl", notes:"" },
  "b_ean_3350033362291": { id:"b_ean_3350033362291", name:"Les Lingettes débarbouillantes x40", brand:"Monoprix bébé", slot:"windel", age:"baby_0_36m", ean:"3350033362291", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3350033362291/les-lingettes-debarbouillantes-x40-monoprix-bebe", notes:"" },
  "b_ean_3504105025854": { id:"b_ean_3504105025854", name:"Crème change", brand:"Mustela", slot:"windel", age:"baby_0_36m", ean:"3504105025854", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3504105025854/creme-change-mustela", notes:"Mustela Kernlinie oft parfümiert; Stelatopia für FF priorisieren." },
  "b_ean_3517360001303": { id:"b_ean_3517360001303", name:"Liniment oleo-calcaire", brand:"Natessance", slot:"windel", age:"baby_0_36m", ean:"3517360001303", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360001303/liniment-oleo-calcaire-natessance", notes:"" },
  "b_ean_3517360000993": { id:"b_ean_3517360000993", name:"Bioliniment protecteur", brand:"Natessance bébé", slot:"windel", age:"baby_0_36m", ean:"3517360000993", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360000993/bioliniment-protecteur-natessance-bebe", notes:"" },
  "b_ean_3250392066819": { id:"b_ean_3250392066819", name:"80 Lingettes bébé", brand:"Netto", slot:"windel", age:"baby_0_36m", ean:"3250392066819", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3250392066819/80-lingettes-bebe-netto", notes:"" },
  "b_ean_0659525114954": { id:"b_ean_0659525114954", name:"Toallitas baby", brand:"Nikky", slot:"windel", age:"baby_0_36m", ean:"0659525114954", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/0659525114954/toallitas-baby-nikky", notes:"" },
  "b_ean_4005808861446": { id:"b_ean_4005808861446", name:"Baby pure & sensitive", brand:"Nivea", slot:"windel", age:"baby_0_36m", ean:"4005808861446", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4005808861446/baby-pure-sensitive-nivea", notes:"" },
  "b_ean_8436029700560": { id:"b_ean_8436029700560", name:"AMOSELI LINGETTES BEBE x 72 unités", brand:"No Name", slot:"windel", age:"baby_0_36m", ean:"8436029700560", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8436029700560/amoseli-lingettes-bebe-x-72-unites-no-name", notes:"" },
  "b_ean_7331121418447": { id:"b_ean_7331121418447", name:"Soft & Gentle Baby wipes", brand:"Nordic Formula", slot:"windel", age:"baby_0_36m", ean:"7331121418447", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7331121418447/soft-gentle-baby-wipes-nordic-formula", notes:"" },
  "b_ean_5900095034674": { id:"b_ean_5900095034674", name:"Wet wipes for infants and babies", brand:"Ola baby", slot:"windel", age:"baby_0_36m", ean:"5900095034674", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5900095034674/wet-wipes-for-infants-and-babies-ola-baby", notes:"" },
  "b_ean_8006530140171": { id:"b_ean_8006530140171", name:"Aqua soft touch", brand:"Pampers", slot:"windel", age:"baby_0_36m", ean:"8006530140171", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8006530140171/aqua-soft-touch-pampers", notes:"" },
  "b_ean_8006530135269": { id:"b_ean_8006530135269", name:"Baby wipes", brand:"Pampers", slot:"windel", age:"baby_0_36m", ean:"8006530135269", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8006530135269/baby-wipes-pampers", notes:"" },
  "b_ean_8006530116305": { id:"b_ean_8006530116305", name:"Baby wipes", brand:"Pampers", slot:"windel", age:"baby_0_36m", ean:"8006530116305", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8006530116305/baby-wipes-pampers", notes:"" },
  "b_ean_8006540815885": { id:"b_ean_8006540815885", name:"Baby wipes", brand:"Pampers", slot:"windel", age:"baby_0_36m", ean:"8006540815885", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8006540815885/baby-wipes-pampers", notes:"" },
  "b_ean_8001841062624": { id:"b_ean_8001841062624", name:"Baby wipes Pampers Sensitive", brand:"Pampers", slot:"windel", age:"baby_0_36m", ean:"8001841062624", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8001841062624/baby-wipes-pampers-sensitive", notes:"" },
  "b_ean_8700216250641": { id:"b_ean_8700216250641", name:"Harmonie Protect & Care", brand:"Pampers", slot:"windel", age:"baby_0_36m", ean:"8700216250641", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8700216250641/harmonie-protect-care-pampers", notes:"" },
  "b_ean_8001090934444": { id:"b_ean_8001090934444", name:"lingettes bébé", brand:"pampers", slot:"windel", age:"baby_0_36m", ean:"8001090934444", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8001090934444/lingettes-bebe-pampers", notes:"" },
  "b_ean_4015400623496": { id:"b_ean_4015400623496", name:"Lingettes bébé New Baby Sensitive", brand:"Pampers", slot:"windel", age:"baby_0_36m", ean:"4015400623496", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4015400623496/lingettes-bebe-new-baby-sensitive-pampers", notes:"" },
  "b_ean_8006530116558": { id:"b_ean_8006530116558", name:"Pampers 99% Water Babydoekjes", brand:"Pampers", slot:"windel", age:"baby_0_36m", ean:"8006530116558", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8006530116558/pampers-99-water-babydoekjes", notes:"" },
  "b_ean_00321275": { id:"b_ean_00321275", name:"Penaten Baby Wundschutzcrème", brand:"Penaten (Johnson & Johnson)", slot:"windel", age:"baby_0_36m", ean:"00321275", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/00321275/penaten-baby-wundschutzcreme-penaten-johnson-johnson", notes:"Penaten: Markenseite Ultra Sensitiv/Sensible Haut = parfümfrei; Klassik oft parfümiert." },
  "b_ean_3250391649051": { id:"b_ean_3250391649051", name:"Lingettes bébé", brand:"Pomette", slot:"windel", age:"baby_0_36m", ean:"3250391649051", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3250391649051/lingettes-bebe-pomette", notes:"" },
  "b_ean_3250391503544": { id:"b_ean_3250391503544", name:"Sensitive - lingettes imprégnées bébé", brand:"Pommette", slot:"windel", age:"baby_0_36m", ean:"3250391503544", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3250391503544/sensitive-lingettes-impregnees-bebe-pommette", notes:"" },
  "b_ean_3596710520503": { id:"b_ean_3596710520503", name:"Lingettes bébé", brand:"Pouce", slot:"windel", age:"baby_0_36m", ean:"3596710520503", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710520503/lingettes-bebe-pouce", notes:"" },
  "b_ean_3245678691403": { id:"b_ean_3245678691403", name:"Lingettes bébé", brand:"Pouce", slot:"windel", age:"baby_0_36m", ean:"3245678691403", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678691403/lingettes-bebe-pouce", notes:"" },
  "b_ean_3596710535064": { id:"b_ean_3596710535064", name:"Lingettes bébé", brand:"Pouce", slot:"windel", age:"baby_0_36m", ean:"3596710535064", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596710535064/lingettes-bebe-pouce", notes:"" },
  "b_ean_3401540393640": { id:"b_ean_3401540393640", name:"Saforelle Bébé Liniment Oléo-Calcaire", brand:"Saforelle Bébé", slot:"windel", age:"baby_0_36m", ean:"3401540393640", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3401540393640/saforelle-bebe-liniment-oleo-calcaire", notes:"" },
  "b_ean_5712873709144": { id:"b_ean_5712873709144", name:"Fri Baby VådServietter", brand:"Salling", slot:"windel", age:"baby_0_36m", ean:"5712873709144", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5712873709144/fri-baby-vadservietter-salling", notes:"" },
  "b_ean_3560071310769": { id:"b_ean_3560071310769", name:"Lingettes Bébé à l'Aloe Vera", brand:"Simpl", slot:"windel", age:"baby_0_36m", ean:"3560071310769", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560071310769/lingettes-bebe-a-l-aloe-vera-simpl", notes:"" },
  "b_ean_8711868013850": { id:"b_ean_8711868013850", name:"Baby wipes regular", brand:"Teddy care", slot:"windel", age:"baby_0_36m", ean:"8711868013850", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711868013850/baby-wipes-regular-teddy-care", notes:"" },
  "b_ean_8711868013874": { id:"b_ean_8711868013874", name:"Baby Wipes Sensitive", brand:"Teddy care", slot:"windel", age:"baby_0_36m", ean:"8711868013874", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711868013874/baby-wipes-sensitive-teddy-care", notes:"" },
  "b_ean_8711868006296": { id:"b_ean_8711868006296", name:"natural baby wipes", brand:"teddy care", slot:"windel", age:"baby_0_36m", ean:"8711868006296", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711868006296/natural-baby-wipes-teddy-care", notes:"" },
  "b_ean_8711868004575": { id:"b_ean_8711868004575", name:"Lingettes bébé", brand:"TeddyCare", slot:"windel", age:"baby_0_36m", ean:"8711868004575", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711868004575/lingettes-bebe-teddycare", notes:"" },
  "b_ean_5045731103908": { id:"b_ean_5045731103908", name:"Plastic-free Baby Wipes", brand:"Teeny stars", slot:"windel", age:"baby_0_36m", ean:"5045731103908", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5045731103908/plastic-free-baby-wipes-teeny-stars", notes:"" },
  "b_ean_20095963": { id:"b_ean_20095963", name:"Lingettes Imprégnées Pour Bébés", brand:"Toujours", slot:"windel", age:"baby_0_36m", ean:"20095963", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/20095963/lingettes-impregnees-pour-bebes-toujours", notes:"" },
  "b_ean_5907489072397": { id:"b_ean_5907489072397", name:"Chusteczki nawilżające dla dzieci", brand:"Tullino", slot:"windel", age:"baby_0_36m", ean:"5907489072397", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5907489072397/chusteczki-nawilżające-dla-dzieci-tullino", notes:"" },
  "b_ean_5099514200209": { id:"b_ean_5099514200209", name:"Baby wipes", brand:"Water wipes", slot:"windel", age:"baby_0_36m", ean:"5099514200209", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5099514200209/baby-wipes-water-wipes", notes:"" },
  "b_ean_5099514001486": { id:"b_ean_5099514001486", name:"Baby wipes", brand:"Waterwipes", slot:"windel", age:"baby_0_36m", ean:"5099514001486", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5099514001486/baby-wipes-waterwipes", notes:"" },
  "b_ean_5099514005026": { id:"b_ean_5099514005026", name:"Baby wipes", brand:"Waterwipes", slot:"windel", age:"baby_0_36m", ean:"5099514005026", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5099514005026/baby-wipes-waterwipes", notes:"" },
  "b_ean_5099514400074": { id:"b_ean_5099514400074", name:"Water Wipes", brand:"Waterwipes", slot:"windel", age:"baby_0_36m", ean:"5099514400074", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5099514400074/water-wipes-waterwipes", notes:"" },
  "b_ean_5099514400159": { id:"b_ean_5099514400159", name:"Waterwipes Babydoekjes", brand:"Waterwipes", slot:"windel", age:"baby_0_36m", ean:"5099514400159", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5099514400159/waterwipes-babydoekjes", notes:"" },
  "b_ean_4001638088138": { id:"b_ean_4001638088138", name:"Weleda Baby calendula billenbalsem", brand:"Weleda", slot:"windel", age:"baby_0_36m", ean:"4001638088138", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/4001638088138/weleda-baby-calendula-billenbalsem", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_3596206529621": { id:"b_ean_3596206529621", name:"Weleda Bébé Calendula - Crème pour le change", brand:"Weleda", slot:"windel", age:"baby_0_36m", ean:"3596206529621", ff:false, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3596206529621/weleda-bebe-calendula-creme-pour-le-change", notes:"Weleda Calendula Standard oft mit Duft/ätherischen Ölen — FF nur parfümfrei-SKU." },
  "b_ean_8711700508483": { id:"b_ean_8711700508483", name:"Zwitsal Baby vochtige washandjes", brand:"Zwitsal", slot:"windel", age:"baby_0_36m", ean:"8711700508483", ff: null, u3:true, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711700508483/zwitsal-baby-vochtige-washandjes", notes:"" },
  "b_ean_8714789406220": { id:"b_ean_8714789406220", name:"Tahiti Kids Cheveux et Corps", brand:"Colgate-Palmolive", slot:"bad", age:"kind_3_11", ean:"8714789406220", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8714789406220/tahiti-kids-cheveux-et-corps-colgate-palmolive", notes:"" },
  "b_ean_3263855775333": { id:"b_ean_3263855775333", name:"Shampooing douche et bain parfum fraise", brand:"Leader Price", slot:"bad", age:"kind_3_11", ean:"3263855775333", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3263855775333/shampooing-douche-et-bain-parfum-fraise-leader-price", notes:"" },
  "b_ean_3517360002577": { id:"b_ean_3517360002577", name:"Douche & Bain parfum Cola", brand:"Léa Nature", slot:"bad", age:"kind_3_11", ean:"3517360002577", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3517360002577/cola-lea-nature", notes:"" },
  "b_ean_3564700193358": { id:"b_ean_3564700193358", name:"Petit Manava Fruit du dragon", brand:"Marque Repère", slot:"bad", age:"kind_3_11", ean:"3564700193358", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3564700193358/petit-manava-fruit-du-dragon-marque-repere", notes:"" },
  "b_ean_3178040689510": { id:"b_ean_3178040689510", name:"Teraxyl junior 2 en 1", brand:"Teraxyl", slot:"bad", age:"kind_3_11", ean:"3178040689510", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3178040689510/teraxyl-junior-2-en-1-henkel", notes:"" },
  "b_ean_3700376703044": { id:"b_ean_3700376703044", name:"Dentifraise bio", brand:"Bioseptyl", slot:"creme", age:"kind_3_11", ean:"3700376703044", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3700376703044/dentifraise-bio-bioseptyl", notes:"" },
  "b_ean_8720181509803": { id:"b_ean_8720181509803", name:"Junior 6-13 ans arome menthe", brand:"Fluocaril", slot:"creme", age:"kind_3_11", ean:"8720181509803", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720181509803/junior-6-13-ans-arome-menthe-fluocaril", notes:"" },
  "b_ean_8001090632937": { id:"b_ean_8001090632937", name:"Junior 6+ Star Wars", brand:"oral-b", slot:"creme", age:"kind_3_11", ean:"8001090632937", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8001090632937/junior-6-star-wars-oral-b", notes:"" },
  "b_ean_8720181501814": { id:"b_ean_8720181501814", name:"Protection caries longue durée", brand:"Signal", slot:"creme", age:"kind_3_11", ean:"8720181501814", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720181501814/protection-caries-longue-duree-signal", notes:"" },
  "b_ean_8717644091777": { id:"b_ean_8717644091777", name:"Signal Dentifrice Enfants 7+ Ans Menthe Pokémon 75ml", brand:"Signal", slot:"creme", age:"kind_3_11", ean:"8717644091777", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8717644091777/signal-dentifrice-enfants-7-ans-menthe-pokemon-75ml-unilever", notes:"" },
  "b_ean_5414971009354": { id:"b_ean_5414971009354", name:"Shampooing à l'extrait de camomille et bleuet Extra Doux", brand:"Belgian Cosmetic Brands", slot:"haar", age:"kind_3_11", ean:"5414971009354", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/5414971009354/shampooing-a-l-extrait-de-camomille-et-bleuet-extra-doux-belgian-cosmetic-brands", notes:"" },
  "b_ean_3560070815470": { id:"b_ean_3560070815470", name:"Démêlant Sprayz", brand:"Carrefour", slot:"haar", age:"kind_3_11", ean:"3560070815470", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3560070815470/demelant-sprayz-carrefour", notes:"" },
  "b_ean_3160920965005": { id:"b_ean_3160920965005", name:"Shampooing anti poux et lentes", brand:"Cars", slot:"haar", age:"kind_3_11", ean:"3160920965005", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3160920965005/shampooing-anti-poux-et-lentes-cars", notes:"" },
  "b_ean_3222475571121": { id:"b_ean_3222475571121", name:"Les Tilapins de Casino - Shampooing très doux", brand:"Casino", slot:"haar", age:"kind_3_11", ean:"3222475571121", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3222475571121/les-tilapins-de-casino-shampooing-tres-doux", notes:"" },
  "b_ean_3283950912594": { id:"b_ean_3283950912594", name:"Shampooing démêlant parfum pomme Kids bio", brand:"Cattier", slot:"haar", age:"kind_3_11", ean:"3283950912594", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3283950912594/shampooing-demelant-parfum-pomme-kids-bio-cattier", notes:"" },
  "b_ean_3600550254211": { id:"b_ean_3600550254211", name:"Beautiful Beginnings Shampooing soin 2 en 1", brand:"Dark and Lovely", slot:"haar", age:"kind_3_11", ean:"3600550254211", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550254211/beautiful-beginnings-shampooing-soin-2-en-1-dark-and-lovely", notes:"" },
  "b_ean_3567730300437": { id:"b_ean_3567730300437", name:"Shampooing 2 en 1 démêlant Fraise Grenade Lait de coton", brand:"Dermaclay Junior", slot:"haar", age:"kind_3_11", ean:"3567730300437", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3567730300437/shampooing-2-en-1-demelant-fraise-grenade-lait-de-coton-dermaclay-junior", notes:"" },
  "b_ean_3160920965012": { id:"b_ean_3160920965012", name:"Shampooing anti poux & lentes", brand:"Disney", slot:"haar", age:"kind_3_11", ean:"3160920965012", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3160920965012/shampooing-anti-poux-lentes-disney", notes:"" },
  "b_ean_3600550306774": { id:"b_ean_3600550306774", name:"Shampooing 3 en 1 usage quotidien", brand:"Dop", slot:"haar", age:"kind_3_11", ean:"3600550306774", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600550306774/shampooing-3-en-1-usage-quotidien-dop", notes:"" },
  "b_ean_3380390901154": { id:"b_ean_3380390901154", name:"Papoo Shampooing des écoles", brand:"Douce Nature", slot:"haar", age:"kind_3_11", ean:"3380390901154", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3380390901154/papoo-shampooing-des-ecoles-douce-nature", notes:"" },
  "b_ean_3600541173620": { id:"b_ean_3600541173620", name:"Shampooing 2 en 1", brand:"Garnier", slot:"haar", age:"kind_3_11", ean:"3600541173620", ff: null, u3: false, cf:true, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600541173620/shampooing-2-en-1-l-oreal", notes:"" },
  "b_ean_3600542525787": { id:"b_ean_3600542525787", name:"Ultra doux enfant 2 en 1", brand:"Garnier", slot:"haar", age:"kind_3_11", ean:"3600542525787", ff: null, u3: false, cf:true, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3600542525787/ultra-doux-enfant-2-en-1-garnier", notes:"" },
  "b_ean_8411126026966": { id:"b_ean_8411126026966", name:"Shampooing Enfants Extra Doux fraîcheur de cologne", brand:"Geniol", slot:"haar", age:"kind_3_11", ean:"8411126026966", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8411126026966/shampooing-enfants-extra-doux-fraicheur-de-cologne-geniol", notes:"" },
  "b_ean_3250391151844": { id:"b_ean_3250391151844", name:"Shampooing Vanille Abricot", brand:"Labell", slot:"haar", age:"kind_3_11", ean:"3250391151844", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3250391151844/shampooing-vanille-abricot-labell", notes:"" },
  "b_ean_3574661344621": { id:"b_ean_3574661344621", name:"Shampooing Extra Doux 2 en 1 avec de l'Abricot", brand:"Le Petit Marseillais", slot:"haar", age:"kind_3_11", ean:"3574661344621", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3574661344621/shampooing-extra-doux-2-en-1-avec-de-l-abricot-le-petit-marseillais", notes:"" },
  "b_ean_3245678127322": { id:"b_ean_3245678127322", name:"Auchan bio dentifrice enfants 3-6 ans fraise", brand:"Auchan", slot:"sonst", age:"kind_3_11", ean:"3245678127322", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3245678127322/auchan-bio-dentifrice-enfants-3-6-ans-fraise", notes:"" },
  "b_ean_8718951746558": { id:"b_ean_8718951746558", name:"Bluey toothpaste", brand:"colgate", slot:"sonst", age:"kind_3_11", ean:"8718951746558", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8718951746558/bluey-toothpaste-colgate", notes:"" },
  "b_ean_7046110071519": { id:"b_ean_7046110071519", name:"Jordan Tandpasta Milde Frambozensmaak 0-5 Jaar 50 ml", brand:"Jordan", slot:"sonst", age:"kind_3_11", ean:"7046110071519", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7046110071519/jordan-tandpasta-milde-frambozensmaak-0-5-jaar-50-ml", notes:"" },
  "b_ean_7046110075562": { id:"b_ean_7046110075562", name:"Jordan Tandpasta Milde Fruitsmaak 6-12 Jaar 50 ml", brand:"Jordan", slot:"sonst", age:"kind_3_11", ean:"7046110075562", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7046110075562/jordan-tandpasta-milde-fruitsmaak-6-12-jaar-50-ml", notes:"" },
  "b_ean_7070866038342": { id:"b_ean_7070866038342", name:"Toothpaste pump Kids 0-5", brand:"Jordan", slot:"sonst", age:"kind_3_11", ean:"7070866038342", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/7070866038342/toothpaste-pump-kids-0-5-jordan", notes:"" },
  "b_ean_3564700427828": { id:"b_ean_3564700427828", name:"Dentamyl junior", brand:"Marque Repère", slot:"sonst", age:"kind_3_11", ean:"3564700427828", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/3564700427828/dentamyl-junior-marque-repere", notes:"" },
  "b_ean_8711568044048": { id:"b_ean_8711568044048", name:"3+ Toothpaste", brand:"Peppa Pig", slot:"sonst", age:"kind_3_11", ean:"8711568044048", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8711568044048/3-toothpaste-peppa-pig", notes:"" },
  "b_ean_8720181501784": { id:"b_ean_8720181501784", name:"Kids toothpaste 0-6 years old", brand:"Signal", slot:"sonst", age:"kind_3_11", ean:"8720181501784", ff: null, u3: false, cf: null, nc: null, spfNote:"", url:"https://world.openbeautyfacts.org/product/8720181501784/kids-toothpaste-0-6-years-old-unilever", notes:"" },
};


// Automatische Verifizierung aller Baby-/Kind-Produkte gegen das CFI-Verzeichnis
Object.keys(BABY_DB).forEach(id => {
  const p = BABY_DB[id];
  if (p && isBrandCrueltyFree(p.brand)) {
    p.cf = true;
  }
});
// ==========================================
// EU Jugend- & Teenie-Katalog (96 Produkte)
// Quellen: eu-jugend-katalog.csv / eu-jugend-katalog.md / jugend-markt.md
// Separate Kategorie: Teenie (12-17) & Young Adult - keine Vermischung
// ==========================================
const TEEN_DB = {
  "t_ean_3282770202120": { id:"t_ean_3282770202120", name:"Protect Crème SPF50+", brand:"A-Derma", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3282770202120", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3282770202120/protect-creme-spf50-a-derma", notes:"" },
  "t_ean_7319861018585": { id:"t_ean_7319861018585", name:"Kids Active Sun Lotion SPF 50+", brand:"ACO", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"7319861018585", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/7319861018585/kids-active-sun-lotion-spf-50-aco", notes:"" },
  "t_ean_7319861018509": { id:"t_ean_7319861018509", name:"Sun face cream", brand:"ACO", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"7319861018509", ff:true, nc: null, cf: null, notForMinors:false, countries:"NL;SE", url:"https://world.openbeautyfacts.org/product/7319861018509/sun-face-cream-aco", notes:"" },
  "t_ean_7313272135244": { id:"t_ean_7313272135244", name:"Solcreme ansikte SPF 30", brand:"apoteket", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"7313272135244", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/7313272135244/solcreme-ansikte-spf-30-apoteket", notes:"" },
  "t_ean_7313272150896": { id:"t_ean_7313272150896", name:"Solcreme ansikte SPF 50", brand:"apoteket", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"7313272150896", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/7313272150896/solcreme-ansikte-spf-50-apoteket", notes:"" },
  "t_ean_7313272153712": { id:"t_ean_7313272153712", name:"Solfluid ansikte", brand:"apoteket", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"7313272153712", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/7313272153712/solfluid-ansikte-apoteket", notes:"" },
  "t_ean_7313272135268": { id:"t_ean_7313272135268", name:"Sollotion högt skydd SPF 30", brand:"apoteket", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"7313272135268", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/7313272135268/sollotion-hogt-skydd-spf-30-apoteket", notes:"" },
  "t_ean_7313272135275": { id:"t_ean_7313272135275", name:"Sollotion SPF 30", brand:"apoteket", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"7313272135275", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/7313272135275/sollotion-spf-30-apoteket", notes:"" },
  "t_ean_7313272139747": { id:"t_ean_7313272139747", name:"Sollotion SPF 30", brand:"apoteket", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"7313272139747", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/7313272139747/sollotion-spf-30-apoteket", notes:"" },
  "t_ean_7313272150834": { id:"t_ean_7313272150834", name:"Sollotion SPF 30", brand:"apoteket", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"7313272150834", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/7313272150834/sollotion-spf-30-apoteket", notes:"" },
  "t_ean_7313272150940": { id:"t_ean_7313272150940", name:"Solspray SPF 30", brand:"apoteket", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"7313272150940", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/7313272150940/solspray-spf-30-apoteket", notes:"" },
  "t_ean_3282779059848": { id:"t_ean_3282779059848", name:"Eluage Crème anti-âge restructurant", brand:"Avène", slot:"creme", rawSlot:"basis_creme", age:"young_adult", ean:"3282779059848", ff: null, nc:true, cf: null, notForMinors:true, countries:"FR", url:"https://world.openbeautyfacts.org/product/3282779059848/eluage-creme-anti-age-restructurant-avene", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag" },
  "t_ean_3282779363815": { id:"t_ean_3282779363815", name:"Très Haute Protection Spray 50+ SPF", brand:"Avène", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3282779363815", ff: null, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3282779363815/tres-haute-protection-spray-50-spf-avene", notes:"" },
  "t_ean_4005900261038": { id:"t_ean_4005900261038", name:"NIVEA SUN Protect & Sensitive Sun Lotion SPF 30", brand:"Beiersdorf", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"4005900261038", ff:true, nc: null, cf: null, notForMinors:false, countries:"SE", url:"https://world.openbeautyfacts.org/product/4005900261038/nivea-sun-protect-sensitive-sun-lotion-spf-30-beiersdorf", notes:"" },
  "t_ean_4005900127365": { id:"t_ean_4005900127365", name:"Protect & Sensitive 50", brand:"Beiersdorf", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"4005900127365", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/4005900127365/protect-sensitive-50-beiersdorf", notes:"" },
  "t_ean_3329310002113": { id:"t_ean_3329310002113", name:"Masque visage purifiant Argile verte", brand:"Biocos", slot:"sonst", rawSlot:"sonst", age:"teen_or_ya_unclear", ean:"3329310002113", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3329310002113/masque-visage-purifiant-argile-verte-biocos", notes:"" },
  "t_item_17": { id:"t_item_17", name:"Bioderma Photoderm AKN Mat LSF 30", brand:"Bioderma", slot:"spf", rawSlot:"basis_spf", age:"tween_teen", ean:"", ff:false, nc:true, cf: null, notForMinors:false, countries:"DE;AT;FR;EU", url:"https://www.bioderma.de/unsere-produkte/photoderm/akn-mat-lsf-30", notes:"DE: Erwachsene, Teenager; Nicht komedogen; Seite sagt 'Parfümiert' → FF=no; Salicyl+Glykolsäure" },
  "t_item_18": { id:"t_item_18", name:"Bioderma Sébium Gel moussant", brand:"Bioderma", slot:"reiniger", rawSlot:"akne_reiniger", age:"tween_teen", ean:"", ff:false, nc:true, cf: null, notForMinors:false, countries:"DE;AT;FR;EU", url:"https://www.bioderma.de/unsere-produkte/sebium/gel-moussant", notes:"DE: Erwachsene, Teenager; Nicht komedogen; leichter frischer Duft → FF=no" },
  "t_item_19": { id:"t_item_19", name:"Bioderma Sébium H2O", brand:"Bioderma", slot:"reiniger", rawSlot:"akne_reiniger", age:"tween_teen", ean:"", ff: null, nc:true, cf: null, notForMinors:false, countries:"DE;AT;FR;EU", url:"https://www.bioderma.de/unsere-produkte/sebium/h2o", notes:"DE: Erwachsene, Teenager; Nicht komedogen" },
  "t_ean_3401573670053": { id:"t_ean_3401573670053", name:"Créaline TS H2O Solution micellaire", brand:"Bioderma", slot:"reiniger", rawSlot:"basis_reiniger", age:"tween_teen", ean:"3401573670053", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3401573670053/crealine-ts-h2o-solution-micellaire-bioderma", notes:"" },
  "t_ean_3401353688513": { id:"t_ean_3401353688513", name:"Photoderm Bronz SPF 50+", brand:"Bioderma", slot:"spf", rawSlot:"basis_spf", age:"tween_teen", ean:"3401353688513", ff: null, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3401353688513/photoderm-bronz-spf-50-bioderma", notes:"" },
  "t_ean_3401353688742": { id:"t_ean_3401353688742", name:"Photoderm MAX SPF 50+ Spray très haute protection", brand:"Bioderma", slot:"spf", rawSlot:"basis_spf", age:"tween_teen", ean:"3401353688742", ff:true, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3401353688742/photoderm-max-spf-50-spray-tres-haute-protection-bioderma", notes:"" },
  "t_ean_5017634247843": { id:"t_ean_5017634247843", name:"Anti-boutons", brand:"Bioré", slot:"active", rawSlot:"akne_active", age:"teen_or_ya_unclear", ean:"5017634247843", ff: null, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/5017634247843/anti-boutons-biore", notes:"" },
  "t_item_24": { id:"t_item_24", name:"CeraVe Ausgleichender Reinigungsschaum", brand:"CeraVe", slot:"reiniger", rawSlot:"basis_reiniger", age:"tween_teen", ean:"", ff:true, nc:true, cf: null, notForMinors:false, countries:"DE;AT;EU", url:"https://www.cerave.de/hautpflege/reinigung-fuer-gesicht-und-koerper/ausgleichender-reinigungsschaum", notes:"DE: Nicht komedogen; parfümfrei/ohne Duftstoffe; INCI mit Niacinamid+Salicylsäure" },
  "t_item_25": { id:"t_item_25", name:"CeraVe Feuchtigkeitsspendendes HA Water Gel", brand:"CeraVe", slot:"creme", rawSlot:"basis_creme", age:"tween_teen", ean:"", ff:true, nc:true, cf: null, notForMinors:false, countries:"DE;AT;EU", url:"https://www.cerave.de/hautpflege/gesichtspflege/feuchtigkeitsspendendes-ha-water-gel", notes:"DE: nicht komedogen + ohne Duftstoffe/parfümfrei; laut Seite auch zu Akne neigende Haut" },
  "t_ean_3337875597449": { id:"t_ean_3337875597449", name:"CeraVe Hydraterende Gezichtscrème", brand:"CeraVe", slot:"creme", rawSlot:"basis_creme", age:"tween_teen", ean:"3337875597449", ff: null, nc:true, cf: null, notForMinors:false, countries:"NL", url:"https://world.openbeautyfacts.org/product/3337875597449/facial-moisturising-lotion-cerave", notes:"OBF NC/FF label; EU countries from OBF" },
  "t_ean_3337875597395": { id:"t_ean_3337875597395", name:"Hydraterende Melk", brand:"CeraVe", slot:"creme", rawSlot:"basis_creme", age:"tween_teen", ean:"3337875597395", ff: null, nc:true, cf: null, notForMinors:false, countries:"IE;NL", url:"https://world.openbeautyfacts.org/product/3337875597395/moisturising-lotion-cerave", notes:"OBF NC/FF label; EU countries from OBF" },
  "t_ean_3337875598996": { id:"t_ean_3337875598996", name:"moisturising cream", brand:"CeraVe", slot:"creme", rawSlot:"basis_creme", age:"tween_teen", ean:"3337875598996", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR;RO", url:"https://world.openbeautyfacts.org/product/3337875598996/moisturising-cream-cerave", notes:"OBF NC/FF label; EU countries from OBF" },
  "t_item_29": { id:"t_item_29", name:"Cetaphil Feuchtigkeitscreme", brand:"Cetaphil", slot:"creme", rawSlot:"basis_creme", age:"tween_teen", ean:"", ff:true, nc:true, cf: null, notForMinors:false, countries:"DE;AT;EU", url:"https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/feuchtigkeitscreme/1874015.html", notes:"DE: Ohne Parfüm + Nicht komedogen; INCI ohne Parfum" },
  "t_item_30": { id:"t_item_30", name:"Cetaphil Sanfte Reinigungslotion", brand:"Cetaphil", slot:"reiniger", rawSlot:"basis_reiniger", age:"tween_teen", ean:"", ff:true, nc:true, cf: null, notForMinors:false, countries:"DE;AT;EU", url:"https://www.cetaphil.de/produktkategorie/reinigung/reinigungslotion/7127319.html", notes:"DE: duftstofffrei + Nicht komedogen; INCI ohne Parfum; PZN 14136594" },
  "t_item_31": { id:"t_item_31", name:"Cetaphil Sanfte Tagespflege mit Hyaluronsäure", brand:"Cetaphil", slot:"creme", rawSlot:"basis_creme", age:"tween_teen", ean:"", ff:true, nc:true, cf: null, notForMinors:false, countries:"DE;AT;EU", url:"https://www.cetaphil.de/produktkategorie/feuchtigkeitspflege/tagespflege-mit-hyalurons%C3%A4ure/14136571.html", notes:"DE: NC + ohne Duftstoffe" },
  "t_ean_8056386602200": { id:"t_ean_8056386602200", name:"Client Sun LSF 50", brand:"Cien", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"8056386602200", ff: null, nc: null, cf:true, notForMinors:false, countries:"DE", url:"https://world.openbeautyfacts.org/product/8056386602200/client-sun-lsf-50-cien", notes:"" },
  "t_ean_20283131": { id:"t_ean_20283131", name:"Crème de jour anti-rides Q10", brand:"Cien", slot:"creme", rawSlot:"basis_creme", age:"young_adult", ean:"20283131", ff: null, nc: null, cf:true, notForMinors:true, countries:"FR", url:"https://world.openbeautyfacts.org/product/20283131/creme-de-jour-anti-rides-q10-cien", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag" },
  "t_ean_20434182": { id:"t_ean_20434182", name:"Crème de jour anti-âge Gold (Or 1%)", brand:"Cien", slot:"creme", rawSlot:"basis_creme", age:"young_adult", ean:"20434182", ff: null, nc: null, cf:true, notForMinors:true, countries:"FR", url:"https://world.openbeautyfacts.org/product/20434182/creme-de-jour-anti-age-gold-or-1-cien", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag" },
  "t_ean_20231460": { id:"t_ean_20231460", name:"Crème solaire enfant FPS50+", brand:"Cien", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"20231460", ff:true, nc: null, cf:true, notForMinors:false, countries:"FR;NL;ES", url:"https://world.openbeautyfacts.org/product/20231460/cien-sun", notes:"" },
  "t_ean_20864781": { id:"t_ean_20864781", name:"Eau micellaire sensitive", brand:"Cien", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"20864781", ff: null, nc: null, cf:true, notForMinors:false, countries:"BG;FR", url:"https://world.openbeautyfacts.org/product/20864781/eau-micellaire-sensitive-cien", notes:"" },
  "t_ean_20864774": { id:"t_ean_20864774", name:"Micellar water fresh", brand:"Cien", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"20864774", ff: null, nc: null, cf:true, notForMinors:false, countries:"BE;FR", url:"https://world.openbeautyfacts.org/product/20864774/micellar-water-fresh-cien", notes:"" },
  "t_ean_20382933": { id:"t_ean_20382933", name:"Sonnenmilch classic LSF 30", brand:"cien", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"20382933", ff: null, nc: null, cf:true, notForMinors:false, countries:"DE", url:"https://world.openbeautyfacts.org/product/20382933/sonnenmilch-classic-lsf-30-cien", notes:"" },
  "t_ean_4056489405191": { id:"t_ean_4056489405191", name:"Sonnencreme 50 LSF HOCH", brand:"Cien Sun", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"4056489405191", ff: null, nc: null, cf:true, notForMinors:false, countries:"DE", url:"https://world.openbeautyfacts.org/product/4056489405191/sonnencreme-50-lsf-hoch-cien-sun", notes:"" },
  "t_ean_4056489617419": { id:"t_ean_4056489617419", name:"Sonnenmilch 50 LSF | Hoch", brand:"Cien sun", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"4056489617419", ff: null, nc: null, cf:true, notForMinors:false, countries:"DE", url:"https://world.openbeautyfacts.org/product/4056489617419/sonnenmilch-50-lsf-hoch-cien-sun", notes:"" },
  "t_ean_3257984523521": { id:"t_ean_3257984523521", name:"Les Soins Eau micellaire Peaux Sensibles", brand:"Cora", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"3257984523521", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3257984523521/les-soins-eau-micellaire-peaux-sensibles-cora", notes:"" },
  "t_ean_3560070848898": { id:"t_ean_3560070848898", name:"SensilianeSun lait protecteur 50+", brand:"Dermato Science", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3560070848898", ff:true, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3560070848898/sensilianesun-lait-protecteur-50-dermato-science", notes:"" },
  "t_ean_3178040694149": { id:"t_ean_3178040694149", name:"Crème Anti-Rides Nuit Haute Tolérance", brand:"Diadermine", slot:"creme", rawSlot:"basis_creme", age:"young_adult", ean:"3178040694149", ff:true, nc: null, cf: null, notForMinors:true, countries:"FR", url:"https://world.openbeautyfacts.org/product/3178040694149/creme-anti-rides-nuit-haute-tolerance-henkel", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag" },
  "t_ean_3178040694156": { id:"t_ean_3178040694156", name:"Lotion micellaire démaquillante Haute Tolérance", brand:"Diadermine", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3178040694156", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3178040694156/lotion-micellaire-demaquillante-haute-tolerance-henkel", notes:"" },
  "t_ean_4020829005037": { id:"t_ean_4020829005037", name:"Crème de jour fluide", brand:"Dr. Hauschka", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"4020829005037", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/4020829005037/creme-de-jour-fluide-dr-hauschka", notes:"" },
  "t_ean_3282770037500": { id:"t_ean_3282770037500", name:"Keracnyl gel moussant visage et corps", brand:"Ducray", slot:"reiniger", rawSlot:"akne_reiniger", age:"teen_or_ya_unclear", ean:"3282770037500", ff: null, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3282770037500/keracnyl-gel-moussant-visage-et-corps-ducray", notes:"" },
  "t_ean_3517360003314": { id:"t_ean_3517360003314", name:"Nutritive Gel nettoyant surgras", brand:"Eau thermale Jonzac", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"3517360003314", ff:true, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3517360003314/nutritive-gel-nettoyant-surgras-eau-thermale-jonzac", notes:"" },
  "t_ean_3517360025750": { id:"t_ean_3517360025750", name:"Reactive CONTROL, Crème miraculeuse HAUTE TOLERANCE", brand:"EAU THERMALE JONZAC", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3517360025750", ff: null, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3517360025750/reactive-control-creme-miraculeuse-haute-tolerance-eau-thermale-jonzac", notes:"" },
  "t_ean_4033981742054": { id:"t_ean_4033981742054", name:"Opalovací krém SPF 15 bio", brand:"Eco cosmetics", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"4033981742054", ff: null, nc: null, cf:true, notForMinors:false, countries:"CZ", url:"https://world.openbeautyfacts.org/product/4033981742054/opalovaci-krem-spf-15-bio-eco-cosmetics", notes:"" },
  "t_ean_4005800192883": { id:"t_ean_4005800192883", name:"Eucerin DermoPure Cleansing Gel", brand:"Eucerin", slot:"reiniger", rawSlot:"akne_reiniger", age:"teen_or_ya_unclear", ean:"4005800192883", ff: null, nc:true, cf: null, notForMinors:false, countries:"BE;FR;DE;NL", url:"https://world.openbeautyfacts.org/product/4005800192883/eucerin-dermopure-cleansing-gel", notes:"" },
  "t_item_51": { id:"t_item_51", name:"Eucerin DERMOPURE CLINICAL Hydra Repair", brand:"Eucerin", slot:"creme", rawSlot:"akne_creme", age:"teen_or_ya_unclear", ean:"", ff:true, nc:true, cf: null, notForMinors:false, countries:"DE;AT;EU", url:"https://www.eucerin.de/produkte/dermopure-clinical/hydra-repair", notes:"DE: Nicht komedogen + Ohne Duftstoffe; therapiebegleitend — App≠Therapie" },
  "t_item_52": { id:"t_item_52", name:"Eucerin DERMOPURE CLINICAL Klärendes Tonic", brand:"Eucerin", slot:"active", rawSlot:"akne_active", age:"teen_or_ya_unclear", ean:"", ff:true, nc:true, cf: null, notForMinors:false, countries:"DE;AT;EU", url:"https://www.eucerin.de/produkte/dermopure-clinical/klaerendes-tonic", notes:"DE Markenseite: NC + ohne Duftstoffe" },
  "t_item_53": { id:"t_item_53", name:"Eucerin DERMOPURE CLINICAL Mat Fluid", brand:"Eucerin", slot:"creme", rawSlot:"akne_creme", age:"teen_or_ya_unclear", ean:"", ff: null, nc:true, cf: null, notForMinors:false, countries:"DE;AT;EU", url:"https://www.eucerin.de/produkte/dermopure-clinical/mat-fluid", notes:"DE: NC; FF nicht bestätigt" },
  "t_item_54": { id:"t_item_54", name:"Eucerin DERMOPURE CLINICAL Porenverfeinerndes Reinigungsgel", brand:"Eucerin", slot:"reiniger", rawSlot:"akne_reiniger", age:"teen_or_ya_unclear", ean:"", ff:true, nc:true, cf: null, notForMinors:false, countries:"DE;AT;EU", url:"https://www.eucerin.de/produkte/dermopure-clinical/porenverfeinerndes-reinigungsgel", notes:"DE: BHA/Salicylsäure; Nicht komedogen; frei von Duftstoffen; PZN 19729844" },
  "t_ean_8470001549990": { id:"t_ean_8470001549990", name:"Fotoprotector ISDIN Gel Cream 30 SPF", brand:"Fotoprotector ISDIN", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"8470001549990", ff: null, nc:true, cf: null, notForMinors:false, countries:"ES", url:"https://world.openbeautyfacts.org/product/8470001549990/fotoprotector-isdin-gel-cream-30-spf", notes:"" },
  "t_ean_3600542578585": { id:"t_ean_3600542578585", name:"50* Super UV Acide Hyaluronique", brand:"Garnier", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3600542578585", ff: null, nc: null, cf:true, notForMinors:false, countries:"BE", url:"https://world.openbeautyfacts.org/product/3600542578585/50-super-uv-acide-hyaluronique-garnier", notes:"" },
  "t_ean_3600542512886": { id:"t_ean_3600542512886", name:"Enfant sensitive expert + Spf 50+", brand:"Garnier", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3600542512886", ff: null, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600542512886/enfant-sensitive-expert-spf-50-garnier-ambre-solaire", notes:"" },
  "t_ean_3600542520263": { id:"t_ean_3600542520263", name:"Enfant sensitive expert + Spf 50+ Spay", brand:"Garnier", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3600542520263", ff: null, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600542520263/enfant-sensitive-expert-spf-50-spay-l-oreal", notes:"" },
  "t_ean_36005426450723600542597821": { id:"t_ean_36005426450723600542597821", name:"Garnier PureActive BHA+ Niacinamide SPF50+ Anti-Imperfections Fluid", brand:"Garnier", slot:"creme", rawSlot:"akne_creme", age:"teen_or_ya_unclear", ean:"36005426450723600542597821", ff: null, nc: null, cf:true, notForMinors:false, countries:"NL", url:"https://world.openbeautyfacts.org/product/36005426450723600542597821/garnier-pureactive-bha-niacinamide-spf50-anti-imperfections-fluid", notes:"" },
  "t_ean_3600542663304": { id:"t_ean_3600542663304", name:"Garnier Salicylic Fresh & Matte Hydrating Sorbet Cream", brand:"Garnier", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3600542663304", ff: null, nc: null, cf:true, notForMinors:false, countries:"NL", url:"https://world.openbeautyfacts.org/product/3600542663304/garnier-salicylic-fresh-matte-hydrating-sorbet-cream", notes:"" },
  "t_ean_4084200772901": { id:"t_ean_4084200772901", name:"Hautklar", brand:"Garnier", slot:"active", rawSlot:"akne_active", age:"teen_or_ya_unclear", ean:"4084200772901", ff: null, nc: null, cf:true, notForMinors:false, countries:"DE;IE", url:"https://world.openbeautyfacts.org/product/4084200772901/hautklar-l-oreal", notes:"" },
  "t_ean_3600542624909": { id:"t_ean_3600542624909", name:"Hydra 24h protect spf 30", brand:"Garnier", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3600542624909", ff: null, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600542624909/hydra-24h-protect-spf-30-garnier", notes:"" },
  "t_ean_3600541729476": { id:"t_ean_3600541729476", name:"Micellar Cleansing Water", brand:"Garnier", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"3600541729476", ff:true, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600541729476/micellar-cleansing-water-l-oreal", notes:"" },
  "t_ean_3600541738508": { id:"t_ean_3600541738508", name:"Miracle Wake Up Crème Anti-Âge défatigant", brand:"Garnier", slot:"creme", rawSlot:"basis_creme", age:"young_adult", ean:"3600541738508", ff: null, nc:true, cf:true, notForMinors:true, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600541738508/miracle-wake-up-creme-anti-age-defatigant-l-oreal", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag" },
  "t_ean_3600541744554": { id:"t_ean_3600541744554", name:"Mizellen", brand:"Garnier", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"3600541744554", ff: null, nc: null, cf:true, notForMinors:false, countries:"DE", url:"https://world.openbeautyfacts.org/product/3600541744554/mizellen-l-oreal", notes:"" },
  "t_ean_3215662980011": { id:"t_ean_3215662980011", name:"PureActive Gel nettoyant assainissant", brand:"Garnier", slot:"reiniger", rawSlot:"akne_reiniger", age:"teen_or_ya_unclear", ean:"3215662980011", ff: null, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3215662980011/pureactive-gel-nettoyant-assainissant-l-oreal", notes:"" },
  "t_ean_3600542520454": { id:"t_ean_3600542520454", name:"Sensitive expert + Spf 50+", brand:"Garnier", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3600542520454", ff: null, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600542520454/sensitive-expert-spf-50-l-oreal", notes:"" },
  "t_ean_3600541271814": { id:"t_ean_3600541271814", name:"Sensitive Expert+ - Lait visage & corps FPS 50+ pour peaux sensibles", brand:"Garnier", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3600541271814", ff: null, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600541271814/sensitive-expert-lait-visage-corps-fps-50-pour-peaux-sensibles-l-oreal", notes:"" },
  "t_ean_3600541594968": { id:"t_ean_3600541594968", name:"Skin Active Solution Micellaire Tout En 1 Peaux Sèches et Sensibles", brand:"Garnier", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"3600541594968", ff: null, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600541594968/skin-active-solution-micellaire-tout-en-1-peaux-seches-et-sensibles-l-oreal", notes:"" },
  "t_ean_3600541144019": { id:"t_ean_3600541144019", name:"Skin Naturals Ultra Lift + Sérum Crème Soin anti-rides global 2 en 1", brand:"Garnier", slot:"active", rawSlot:"serum", age:"young_adult", ean:"3600541144019", ff: null, nc: null, cf:true, notForMinors:true, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600541144019/skin-naturals-ultra-lift-serum-creme-soin-anti-rides-global-2-en-1-l-oreal", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag" },
  "t_ean_3600542453127": { id:"t_ean_3600542453127", name:"Vitamina C", brand:"Garnier", slot:"active", rawSlot:"serum", age:"teen_or_ya_unclear", ean:"3600542453127", ff: null, nc: null, cf:true, notForMinors:false, countries:"PT", url:"https://world.openbeautyfacts.org/product/3600542453127/vitamina-c-garnier", notes:"" },
  "t_ean_3701154720093": { id:"t_ean_3701154720093", name:"Nettoyant Visage", brand:"Horace", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"3701154720093", ff: null, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3701154720093/nettoyant-visage-horace", notes:"" },
  "t_ean_3760171121023": { id:"t_ean_3760171121023", name:"Crème visage anti-âge", brand:"Kuomayé Bio", slot:"creme", rawSlot:"basis_creme", age:"young_adult", ean:"3760171121023", ff: null, nc: null, cf:true, notForMinors:true, countries:"FR", url:"https://world.openbeautyfacts.org/product/3760171121023/creme-visage-anti-age-kuomaye-bio", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag" },
  "t_ean_3600523461103": { id:"t_ean_3600523461103", name:"Eau biphase micellaire", brand:"L'Oréal", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"3600523461103", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600523461103/eau-biphase-micellaire-l-oreal", notes:"" },
  "t_ean_3600522365884": { id:"t_ean_3600522365884", name:"Solution Micellaire", brand:"L'Oréal Paris", slot:"reiniger", rawSlot:"basis_reiniger", age:"teen_or_ya_unclear", ean:"3600522365884", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600522365884/solution-micellaire-l-oreal", notes:"" },
  "t_item_76": { id:"t_item_76", name:"La Roche-Posay Toleriane Sensitive Crème", brand:"La Roche-Posay", slot:"creme", rawSlot:"basis_creme", age:"tween_teen", ean:"", ff:true, nc:true, cf: null, notForMinors:false, countries:"FR;DE;AT;EU", url:"https://www.laroche-posay.fr/gammes/visage/toleriane/toleriane-sensitive-creme.-soin-hydratant-apaisant-protecteur/LRP_128.html", notes:"FR: Non comédogène + SANS PARFUM (DE-Fetch teils Cloudflare)" },
  "t_ean_3506770501008": { id:"t_ean_3506770501008", name:"Crème visage protectrice SPF 50 anti-rides au Monoï de Tahiti", brand:"Laboratoires Biocos", slot:"spf", rawSlot:"basis_spf", age:"young_adult", ean:"3506770501008", ff:true, nc: null, cf:true, notForMinors:true, countries:"FR", url:"https://world.openbeautyfacts.org/product/3506770501008/creme-visage-protectrice-spf-50-anti-rides-au-monoi-de-tahiti-laboratoires-biocos", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag" },
  "t_ean_3517360012040": { id:"t_ean_3517360012040", name:"Hydra aloe vera", brand:"Lea Nature So' Bio étic", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3517360012040", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3517360012040/hydra-aloe-vera-lea-nature-so-bio-etic", notes:"" },
  "t_ean_3331300011968": { id:"t_ean_3331300011968", name:"Ultimate Slim Sérum 100% Actif Cure Cellulite Rebelle", brand:"Linéance", slot:"active", rawSlot:"serum", age:"teen_or_ya_unclear", ean:"3331300011968", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3331300011968/ultimate-slim-serum-100-actif-cure-cellulite-rebelle-lineance", notes:"" },
  "t_ean_3506770302001": { id:"t_ean_3506770302001", name:"Spray protecteur hydratant SPF 30 haute protection", brand:"Lovea", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3506770302001", ff:true, nc: null, cf:true, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3506770302001/spray-protecteur-hydratant-spf-30-haute-protection-lovea", notes:"" },
  "t_ean_3517360006162": { id:"t_ean_3517360006162", name:"BB Cream Mon lait d'Ânesse  SPF 10 - 01 beige lumière", brand:"Léa Nature", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3517360006162", ff:true, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3517360006162/bb-cream-mon-lait-d-anesse-spf-10-01-beige-lumiere-lea-nature", notes:"" },
  "t_ean_3517360005998": { id:"t_ean_3517360005998", name:"BB cream texture légère perfecteur de teint - 01 beige nude", brand:"Léa Nature", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3517360005998", ff: null, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3517360005998/bb-cream-texture-legere-perfecteur-de-teint-01-beige-nude-lea-nature", notes:"" },
  "t_ean_3517360008685": { id:"t_ean_3517360008685", name:"Précieux Argan Eau micellaire anti-âge", brand:"Léa Nature", slot:"reiniger", rawSlot:"basis_reiniger", age:"young_adult", ean:"3517360008685", ff:true, nc: null, cf: null, notForMinors:true, countries:"FR", url:"https://world.openbeautyfacts.org/product/3517360008685/precieux-argan-eau-micellaire-anti-age-lea-nature", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag" },
  "t_ean_3600550362534": { id:"t_ean_3600550362534", name:"BB Crème Solaire Teinté SPF 50+", brand:"Mixa", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"3600550362534", ff:true, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600550362534/bb-creme-solaire-teinte-spf-50-mixa", notes:"" },
  "t_ean_3600550880687": { id:"t_ean_3600550880687", name:"Crème riche apaisante pro-tolérance", brand:"Mixa", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3600550880687", ff:true, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600550880687/creme-riche-apaisante-pro-tolerance-mixa", notes:"" },
  "t_ean_3600550538175": { id:"t_ean_3600550538175", name:"Hydratant teinté protecteur anti-imperfections Dermo Defense", brand:"Mixa", slot:"active", rawSlot:"akne_active", age:"teen_or_ya_unclear", ean:"3600550538175", ff: null, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3600550538175/hydratant-teinte-protecteur-anti-imperfections-dermo-defense-mixa", notes:"" },
  "t_ean_3361370627073": { id:"t_ean_3361370627073", name:"MB dermo cold crème Saint-Gervais Mont Blanc", brand:"Rivadis", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3361370627073", ff:true, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3361370627073/mb-dermo-cold-creme-saint-gervais-mont-blanc-rivadis", notes:"" },
  "t_ean_4066447105957": { id:"t_ean_4066447105957", name:"Sonnencreme Gel, MED ultra sensitiv, LSF 50+", brand:"Sun Dance", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"4066447105957", ff:true, nc: null, cf: null, notForMinors:false, countries:"DE", url:"https://world.openbeautyfacts.org/product/4066447105957/sonnencreme-gel-med-ultra-sensitiv-lsf-50-sun-dance", notes:"" },
  "t_ean_4066447106404": { id:"t_ean_4066447106404", name:"Sonnencreme sensitiv LSF 50", brand:"Sun Dance", slot:"spf", rawSlot:"basis_spf", age:"teen_or_ya_unclear", ean:"4066447106404", ff:true, nc: null, cf: null, notForMinors:false, countries:"DE", url:"https://world.openbeautyfacts.org/product/4066447106404/sonnencreme-sensitiv-lsf-50-sun-dance", notes:"" },
  "t_item_90": { id:"t_item_90", name:"SVR Sebiaclear Gel Moussant", brand:"SVR", slot:"reiniger", rawSlot:"akne_reiniger", age:"tween_teen", ean:"", ff:false, nc:true, cf: null, notForMinors:false, countries:"FR;IE;EU", url:"https://fr.svr.com/collections/filtres-de-zee/products/sebiaclear-gel-moussant-23", notes:"FR/IE Markenseite: Non comédogène; Adults and teenagers; INCI enthält PARFUM/FRAGRANCE → FF=no" },
  "t_ean_5061087560738": { id:"t_ean_5061087560738", name:"Starter retinol serum", brand:"The Inkey List", slot:"active", rawSlot:"serum", age:"young_adult", ean:"5061087560738", ff:true, nc: null, cf:true, notForMinors:true, countries:"NL", url:"https://world.openbeautyfacts.org/product/5061087560738/starter-retinol-serum-the-inkey-list", notes:"not-for-minors: Retinol/Anti-Aging — nur young_adult / kein Teen-Vorschlag; CFI-Marke; Retinol YA-only" },
  "t_ean_5060879821989": { id:"t_ean_5060879821989", name:"Vitamin B, C and E moisturizer", brand:"The Inkey List", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"5060879821989", ff:true, nc: null, cf:true, notForMinors:false, countries:"NL", url:"https://world.openbeautyfacts.org/product/5060879821989/vitamin-b-c-and-e-moisturizer-the-inkey-list", notes:"" },
  "t_ean_3596206332825": { id:"t_ean_3596206332825", name:"Crème au calendula", brand:"Weleda", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3596206332825", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3596206332825/creme-au-calendula-weleda", notes:"" },
  "t_ean_3596200064425": { id:"t_ean_3596200064425", name:"Fluide hydratant 24h", brand:"Weleda", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3596200064425", ff: null, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3596200064425/fluide-hydratant-24h-weleda", notes:"" },
  "t_ean_3401360192539": { id:"t_ean_3401360192539", name:"Fluide matifiant", brand:"Weleda", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3401360192539", ff: null, nc:true, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3401360192539/fluide-matifiant-weleda", notes:"" },
  "t_ean_3596202092938": { id:"t_ean_3596202092938", name:"Iris Crème de jour hydratante", brand:"Weleda", slot:"creme", rawSlot:"basis_creme", age:"teen_or_ya_unclear", ean:"3596202092938", ff:true, nc: null, cf: null, notForMinors:false, countries:"FR", url:"https://world.openbeautyfacts.org/product/3596202092938/iris-creme-de-jour-hydratante-weleda", notes:"" },
};

// Automatische Verifizierung aller Teenie-Produkte gegen das CFI-Verzeichnis
Object.keys(TEEN_DB).forEach(id => {
  const p = TEEN_DB[id];
  if (p && isBrandCrueltyFree(p.brand)) {
    p.cf = true;
  }
});

// State



// ==========================================
// Länder-Filter (eu_countries → countries[])
// Annahme Seeds ohne Land: DE|AT|CH (DACH-Demo) — siehe land-filter.md
// EU-Tag = überall verfügbar, sobald ein Land gewählt ist.
// ==========================================

const SEED_DEFAULT_COUNTRIES = ["DE", "AT", "CH"];

const PROFILE_COUNTRY_OPTIONS = [
  // EU-27 fully + EFTA
  { code: "AT", label: "Österreich", group: "EU" },
  { code: "BE", label: "Belgien", group: "EU" },
  { code: "BG", label: "Bulgarien", group: "EU" },
  { code: "HR", label: "Kroatien", group: "EU" },
  { code: "CY", label: "Zypern", group: "EU" },
  { code: "CZ", label: "Tschechien", group: "EU" },
  { code: "DK", label: "Dänemark", group: "EU" },
  { code: "EE", label: "Estland", group: "EU" },
  { code: "FI", label: "Finnland", group: "EU" },
  { code: "FR", label: "Frankreich", group: "EU" },
  { code: "DE", label: "Deutschland", group: "EU" },
  { code: "GR", label: "Griechenland", group: "EU" },
  { code: "HU", label: "Ungarn", group: "EU" },
  { code: "IE", label: "Irland", group: "EU" },
  { code: "IT", label: "Italien", group: "EU" },
  { code: "LV", label: "Lettland", group: "EU" },
  { code: "LT", label: "Litauen", group: "EU" },
  { code: "LU", label: "Luxemburg", group: "EU" },
  { code: "MT", label: "Malta", group: "EU" },
  { code: "NL", label: "Niederlande", group: "EU" },
  { code: "PL", label: "Polen", group: "EU" },
  { code: "PT", label: "Portugal", group: "EU" },
  { code: "RO", label: "Rumänien", group: "EU" },
  { code: "SK", label: "Slowakei", group: "EU" },
  { code: "SI", label: "Slowenien", group: "EU" },
  { code: "ES", label: "Spanien", group: "EU" },
  { code: "SE", label: "Schweden", group: "EU" },
  { code: "CH", label: "Schweiz", group: "EFTA" },
  { code: "NO", label: "Norwegen", group: "EFTA" },
  { code: "IS", label: "Island", group: "EFTA" },
];

function parseEuCountries(raw) {
  if (Array.isArray(raw)) {
    return raw.map(function (c) { return String(c || "").trim().toUpperCase(); })
      .filter(function (c) { return /^[A-Z]{2}$/.test(c) || c === "EU"; });
  }
  if (raw == null) return [];
  var s = String(raw).trim();
  if (!s) return [];
  return s.split(/[|;,\s\/]+/)
    .map(function (c) { return c.trim().toUpperCase(); })
    .filter(function (c) { return /^[A-Z]{2}$/.test(c) || c === "EU"; });
}

function normalizeProductCountries(p, defaultCodes) {
  if (!p || typeof p !== "object") return p;
  var list = parseEuCountries(p.countries);
  if (!list.length && p.eu_countries) list = parseEuCountries(p.eu_countries);
  if (!list.length && p.store) {
    var store = String(p.store);
    var m = store.match(/\(([A-Za-z0-9\s,;|/·.-]+)\)/);
    if (m) list = parseEuCountries(m[1]);
    if (!list.length) {
      // z.B. "Avène · FR" / "7th Heaven · NL"
      var m2 = store.match(/·\s*([A-Z]{2}(?:\s*[,;/|]\s*[A-Z]{2}|EU)*)\s*$/i);
      if (m2) list = parseEuCountries(m2[1]);
    }
  }
  if (!list.length) {
    list = (defaultCodes && defaultCodes.length) ? defaultCodes.slice() : SEED_DEFAULT_COUNTRIES.slice();
    p._countriesDefaulted = true;
  } else {
    p._countriesDefaulted = false;
  }
  p.countries = list;
  return p;
}

function ensureCatalogCountries() {
  if (typeof DB === "object" && DB) {
    Object.keys(DB).forEach(function (id) {
      normalizeProductCountries(DB[id], SEED_DEFAULT_COUNTRIES);
    });
  }
  if (typeof BABY_DB === "object" && BABY_DB) {
    Object.keys(BABY_DB).forEach(function (id) {
      // Offline-Seeds ohne Land: EU (breit), CSV überschreibt später mit echten Codes
      normalizeProductCountries(BABY_DB[id], ["EU"]);
    });
  }
  if (typeof TEEN_DB === "object" && TEEN_DB) {
    Object.keys(TEEN_DB).forEach(function (id) {
      normalizeProductCountries(TEEN_DB[id], SEED_DEFAULT_COUNTRIES);
    });
  }
  if (typeof EU_FLAG_CATALOG === "object" && EU_FLAG_CATALOG) {
    Object.keys(EU_FLAG_CATALOG).forEach(function (id) {
      normalizeProductCountries(EU_FLAG_CATALOG[id], ["EU"]);
    });
  }
}

function productCountriesUnknown(p) {
  if (!p) return true;
  var list = parseEuCountries(p.countries);
  return list.length === 0;
}

function productAvailableInCountry(p, cc, opts) {
  opts = opts || {};
  if (!cc) return true;
  var code = String(cc).trim().toUpperCase();
  if (!code) return true;
  var list = parseEuCountries(p && p.countries);
  if (!list.length) {
    if (opts.includeUnknown) return true;
    if (opts.hideUnknown === false) return true;
    return false;
  }
  if (list.indexOf("EU") !== -1) return true;
  return list.indexOf(code) !== -1;
}

function filterProductsByCountry(list, cc, opts) {
  opts = opts || {};
  var arr = Array.isArray(list) ? list : [];
  if (!cc) return arr.slice();
  var hideUnknown = (opts.hideUnknown !== undefined)
    ? !!opts.hideUnknown
    : (typeof shouldHideUnknownCountries === "function" ? shouldHideUnknownCountries() : true);
  return arr.filter(function (p) {
    return productAvailableInCountry(p, cc, { hideUnknown: hideUnknown, includeUnknown: !hideUnknown });
  });
}

function filterProductIdsByCountry(ids, dbMap, cc, opts) {
  opts = opts || {};
  var hideUnknown = (opts.hideUnknown !== undefined)
    ? !!opts.hideUnknown
    : (typeof shouldHideUnknownCountries === "function" ? shouldHideUnknownCountries() : true);
  var map = dbMap || {};
  var code = cc || (typeof getProfileCountry === "function" ? getProfileCountry() : "");
  var kept = [];
  var hiddenUnknown = 0;
  var hiddenCountry = 0;
  (ids || []).forEach(function (id) {
    var p = map[id];
    if (!p) { kept.push(id); return; }
    var list = parseEuCountries(p.countries);
    if (!code) { kept.push(id); return; }
    if (!list.length) {
      if (hideUnknown) hiddenUnknown++;
      else kept.push(id);
      return;
    }
    if (productAvailableInCountry(p, code, { hideUnknown: false })) kept.push(id);
    else hiddenCountry++;
  });
  return { ids: kept, hiddenUnknown: hiddenUnknown, hiddenCountry: hiddenCountry, total: (ids || []).length };
}

function countryFilterNoteHtml(stats, cc) {
  if (!cc || !stats) return "";
  var parts = [];
  if (stats.hiddenCountry > 0) parts.push(stats.hiddenCountry + " nicht in " + cc);
  if (stats.hiddenUnknown > 0) parts.push(stats.hiddenUnknown + " Land offen ausgeblendet");
  if (!parts.length) return "";
  return '<div style="font-size:0.72rem;color:var(--muted);margin:4px 0 8px;line-height:1.35">🌍 Filter ' + cc + ': ' + parts.join(" · ") + '. <button type="button" class="btn-text" style="font-size:0.72rem;padding:0;text-decoration:underline;color:#2563eb" onclick="toggleHideUnknownCountries()">Unklare Herkunft ' + (typeof shouldHideUnknownCountries === "function" && shouldHideUnknownCountries() ? "einblenden" : "ausblenden") + "</button></div>";
}

function getLiveDmHonesty(cc) {
  var code = String(cc || (typeof getProfileCountry === "function" ? getProfileCountry() : "") || "").toUpperCase();
  if (!code || code === "DE") {
    return { short: "Live dm = Deutschland-Shop", badge: null, showWarn: false };
  }
  return {
    short: "Live dm = Deutschland-Shop",
    badge: "Shop: DE — Verfügbarkeit in " + code + " ggf. anders",
    showWarn: true
  };
}

function liveDmHonestyBadgeHtml(cc) {
  var h = getLiveDmHonesty(cc);
  if (!h.showWarn) {
    return '<span class="tag" style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;font-size:0.65rem;padding:1px 5px">Live dm · DE-Shop</span>';
  }
  return '<span class="tag" style="background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;font-size:0.65rem;padding:1px 5px" title="' + h.short + '">' + h.badge + "</span>";
}

function pickCountryAvailableId(preferredIds, dbMap, slot) {
  var cc = typeof getProfileCountry === "function" ? getProfileCountry() : "";
  var map = dbMap || {};
  var prefs = preferredIds || [];
  for (var i = 0; i < prefs.length; i++) {
    var p = map[prefs[i]];
    if (p && productAvailableInCountry(p, cc, { hideUnknown: false })) return prefs[i];
  }
  if (slot) {
    var keys = Object.keys(map);
    for (var j = 0; j < keys.length; j++) {
      var q = map[keys[j]];
      if (!q) continue;
      if (slot && q.slot && q.slot !== slot && !(slot === "reiniger" && (q.slot === "bad" || q.slot === "reiniger"))) continue;
      if (productAvailableInCountry(q, cc, { hideUnknown: true })) return keys[j];
    }
  }
  return prefs[0] || null;
}

if (typeof window !== "undefined") {
  window.parseEuCountries = parseEuCountries;
  window.normalizeProductCountries = normalizeProductCountries;
  window.ensureCatalogCountries = ensureCatalogCountries;
  window.productAvailableInCountry = productAvailableInCountry;
  window.filterProductsByCountry = filterProductsByCountry;
  window.filterProductIdsByCountry = filterProductIdsByCountry;
  window.countryFilterNoteHtml = countryFilterNoteHtml;
  window.getLiveDmHonesty = getLiveDmHonesty;
  window.liveDmHonestyBadgeHtml = liveDmHonestyBadgeHtml;
  window.pickCountryAvailableId = pickCountryAvailableId;
  window.PROFILE_COUNTRY_OPTIONS = PROFILE_COUNTRY_OPTIONS;
  window.SEED_DEFAULT_COUNTRIES = SEED_DEFAULT_COUNTRIES;
}

// Seeds / Offline-Katalog einmal normalisieren
ensureCatalogCountries();

// ==========================================
// Shared active-class classifier (CSV / dm / seeds / custom)
// Maps name + wirk + existing klassen → matrix classes.
// Remaps bare "retinoid" → retinoid_cos (or retinoid_rx if Rx).
// ==========================================

function _classifyBlob(p) {
  return String((p && p.name) || "") + " " +
    String((p && p.wirk) || "") + " " +
    String((p && p.brand) || "") + " " +
    String((p && p.notes) || "");
}

function classifyProductClasses(p) {
  p = p || {};
  var blob = _classifyBlob(p)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  var existing = Array.isArray(p.klassen) ? p.klassen.slice() : [];
  var out = {};

  function add(k) {
    if (k) out[k] = true;
  }
  function hasOut(k) {
    return !!out[k];
  }
  function del(k) {
    delete out[k];
  }

  existing.forEach(function (k) {
    if (!k || k === "retinoid") return;
    add(k);
  });

  var isRxRetName =
    /\b(adapalen|adapalene|tretinoin|trifaroten|trifarotene|tazaroten|tazarotene)\b/.test(blob) ||
    /\b(epiduo|differin|retin-?a\b|acnatac|clienzo)\b/.test(blob);
  var isCosRetName =
    /\b(retinol|retinaldehyd|retinaldehyde|retinal|retinyl|retistar|a-game)\b/.test(blob);

  var hadBareRetinoid = existing.indexOf("retinoid") !== -1;
  var hadRx = existing.indexOf("retinoid_rx") !== -1;
  var hadCos = existing.indexOf("retinoid_cos") !== -1;

  if (isRxRetName || hadRx || (p.rx && (isCosRetName || hadBareRetinoid || hadCos))) {
    add("retinoid_rx");
    del("retinoid_cos");
  } else if (isCosRetName || hadCos || hadBareRetinoid) {
    add("retinoid_cos");
  }

  if (/\b(glycol|glykol|lactic|milchsaure|mandel|mandelic|\baha\b|fruchtsaure)/.test(blob)) add("aha");
  // Leave-on BHA signal; skip plain wash/cleanser names unless explicitly BHA/serum
  if (/\b(salicyl|\bbha\b|lipohydroxy|\blha\b)/.test(blob)) {
    if (!/\b(waschgel|waschschaum|reinigungsschaum|cleanser|waschcreme)\b/.test(blob) ||
        /\b(serum|liquid|toner|tonic|peeling|leave-?on|\bbha\b)/.test(blob)) {
      add("bha");
    }
  }
  if (/\b(benzoyl|benzoylperoxid|\bbpo\b)/.test(blob)) add("bpo");
  if (/\b(ascorb|vitamin\s*c|vit\.?\s*c|\bl-aa\b|ethyl.?ascorb|ascorbyl|c-glow)\b/.test(blob)) add("ascorbic");
  if (/\b(azelain|azelaic|\bapad\b|azelains)/.test(blob)) add("azelaic");
  if (/\b(niacinamid)/.test(blob)) add("niacinamide");
  if (/\b(clindamycin|erythromycin|\bclinda\b)/.test(blob)) add("ab_top");
  if (/\b(clascoteron|winlevi)/.test(blob)) add("clascoterone");
  if (/\b(hydrochinon|hydroquinone)/.test(blob)) add("hq_banned");

  var looksWash = /\b(wasch|reinig|cleanser|mizellen|schaum|gel moussant|savon)\b/.test(blob);
  var looksSerum = /(serum|konzentrat|concentrate)/.test(blob);
  var looksSpf =
    /\b(spf\s*\d|lsf\s*\d|sonnenschutz|sunscreen|uv\s*mune|breitbandfilter|sun\s*lotion|sun\s*fluid)\b/.test(blob) ||
    /\b(gesichtscreme sonnenschutz)\b/.test(blob);
  var looksActive =
    hasOut("retinoid_cos") ||
    hasOut("retinoid_rx") ||
    hasOut("aha") ||
    hasOut("bha") ||
    hasOut("bpo") ||
    hasOut("ascorbic") ||
    hasOut("azelaic");

  var kat = p.kat || null;
  if (looksWash && !looksActive) kat = "reiniger";
  else if (looksActive && !looksSpf) {
    if (hasOut("retinoid_rx") || hasOut("bpo")) kat = p.kat === "spot" ? "spot" : "active";
    else kat = looksSerum || p.kat === "serum" ? "serum" : (p.kat === "active" ? "active" : "serum");
  } else if (looksSpf && !looksActive) kat = "spf";
  else if (looksSerum) kat = "serum";
  else if (!kat) kat = "creme";

  if (kat === "spf" || looksSpf) {
    add("uv");
  }

  // Wrong CSV slot basis_spf on retinal/retinol serums → correct
  if ((p.kat === "spf" || kat === "spf") && looksActive && !looksSpf) {
    kat = looksSerum ? "serum" : "active";
    del("uv");
  }
  // Name sagt Serum, CSV/Heuristik hat nur generic creme
  if (looksSerum && looksActive && (kat === "creme" || !kat)) {
    kat = "serum";
  }

  if (looksActive) {
    del("support");
    del("humectant");
    if (!looksSpf) del("uv");
  }

  var schiene = p.schiene || "support";
  var rx = !!p.rx;
  if (hasOut("retinoid_rx") || isRxRetName) {
    rx = true;
    schiene = "arzneimittel";
  } else if (looksActive && schiene === "support") {
    schiene = "kosmetik";
  } else if (looksActive && schiene === "active") {
    schiene = "kosmetik";
  }

  var wirkHint = null;
  if (hasOut("retinoid_rx") && /adapalen/.test(blob)) wirkHint = "Adapalen (Rx-Retinoid)";
  else if (hasOut("retinoid_rx") && /tretinoin/.test(blob)) wirkHint = "Tretinoin (Rx-Retinoid)";
  else if (hasOut("retinoid_rx")) wirkHint = "Rx-Retinoid";
  else if (hasOut("retinoid_cos") && /retinal/.test(blob)) wirkHint = "Retinal (kosmetisches Retinoid)";
  else if (hasOut("retinoid_cos")) wirkHint = "Retinol (kosmetisches Retinoid)";
  else if (hasOut("aha")) wirkHint = "AHA-Fruchtsäure";
  else if (hasOut("bha")) wirkHint = "BHA / Salicylsäure";
  else if (hasOut("bpo")) wirkHint = "Benzoylperoxid (BPO)";
  else if (hasOut("ascorbic")) wirkHint = "Vitamin C / Ascorbinsäure";
  else if (hasOut("azelaic")) wirkHint = "Azelainsäure";

  return {
    klassen: Object.keys(out),
    kat: kat,
    schiene: schiene,
    rx: rx,
    wirkHint: wirkHint,
    looksActive: looksActive
  };
}

function enrichProductClasses(p) {
  if (!p || typeof p !== "object") return p;
  var result = classifyProductClasses(p);
  p.klassen = result.klassen;

  var prevKat = p.kat;
  if (result.kat && (
    !prevKat ||
    prevKat === "spf" && result.kat !== "spf" ||
    (prevKat === "creme" || prevKat === "support") && (result.kat === "serum" || result.kat === "active" || result.kat === "spot")
  )) {
    p.kat = result.kat;
  }

  if (result.rx) p.rx = true;
  if (result.schiene === "arzneimittel") p.schiene = "arzneimittel";
  else if ((!p.schiene || p.schiene === "support" || p.schiene === "active") && result.schiene) {
    p.schiene = result.schiene;
  }

  var wirk = String(p.wirk || "");
  var weakWirk =
    !wirk ||
    wirk.indexOf("EU-Katalog") !== -1 ||
    /^Parf[uü]mfrei/i.test(wirk) ||
    /^dm\s*\(/i.test(wirk) ||
    wirk === "Hautbarriere-Pflege" ||
    wirk === "Hydratisierendes Konzentrat" ||
    wirk === "Pflegendes Gesichtskonzentrat";
  if (result.wirkHint && weakWirk) p.wirk = result.wirkHint;

  if (result.looksActive && p.kat === "serum") {
    p.shape = p.shape || "serum";
    p.c = p.c && p.c !== "#888888" ? p.c : "#6aa8c9";
  } else if (result.looksActive && (p.kat === "active" || p.kat === "spot")) {
    p.shape = p.shape || "tube";
    p.c = p.c && p.c !== "#888888" ? p.c : "#58408a";
  }

  return p;
}

function enrichAllDbProducts() {
  if (typeof DB === "object" && DB) {
    Object.keys(DB).forEach(function (id) {
      enrichProductClasses(DB[id]);
    });
  }
  if (typeof appState === "object" && appState && appState.customProducts) {
    Object.keys(appState.customProducts).forEach(function (id) {
      enrichProductClasses(appState.customProducts[id]);
      if (typeof DB === "object" && DB) DB[id] = appState.customProducts[id];
    });
  }
}


// ==========================================
// LIVE-DM INTEGRATION (Echtzeit-Produktsuche & EAN-Abfrage frisch bei dm)
// ==========================================

window.DM_PILOT_CACHE = [];
window.currentLiveDmResults = [];

// Pre-load dm-pilot-produkte.csv on startup
async function loadDmPilotFromCSV() {
  try {
    const text = await fetch("dm-pilot-produkte.csv").then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    });
    if (text) {
      const rows = parseCSV(text);
      window.DM_PILOT_CACHE = rows;
      console.log(`[Live-dm] ${rows.length} Pilot-Produkte aus dm-pilot-produkte.csv geladen.`);
    }
  } catch (err) {
    console.info("[Live-dm] Offline-Modus: Nutze eingebetteten Basis-Katalog.", err);
  }
}

function normalizeDmProduct(p) {
  const dan = p.dan || "";
  const gtin = p.gtin || "";
  const id = "dm_" + (dan || gtin || Math.random().toString(36).slice(2));
  const title = p.title || (p.tileData && p.tileData.title && p.tileData.title.tileHeadline) || "dm-Produkt";
  const brand = p.brandName || (p.tileData && p.tileData.brand && p.tileData.brand.name) || "dm";

  // Price extraction
  let price = "";
  if (p.price && p.price.formattedValue) {
    price = p.price.formattedValue;
  } else if (p.tileData && p.tileData.price && p.tileData.price.price && p.tileData.price.price.current) {
    price = p.tileData.price.price.current.value || "";
  } else if (p.tileData && p.tileData.trackingData && p.tileData.trackingData.price) {
    price = p.tileData.trackingData.price + " €";
  }

  // Image extraction
  let img = "";
  if (p.tileData && p.tileData.images && p.tileData.images.length > 0) {
    img = p.tileData.images[0].tileSrc || "";
  }

  // URL extraction
  let url = "";
  if (p.relativeProductUrl) {
    url = "https://www.dm.de" + p.relativeProductUrl;
  } else if (p.tileData && p.tileData.self) {
    url = "https://www.dm.de" + p.tileData.self;
  }

  // Fragrance Free evaluation
  let ff = null;
  const titleLower = title.toLowerCase();
  if (titleLower.includes("parfümfrei") || titleLower.includes("unparfümiert") || titleLower.includes("ohne parfüm")) {
    ff = true;
  }
  if (p.attributes) {
    for (const attr of p.attributes) {
      if (attr.name === "fragranceFree") ff = true;
      if (attr.values && attr.values.some(v => v.toLowerCase().includes("parfümfrei") || v.toLowerCase().includes("ohne parfüm"))) {
        ff = true;
      }
    }
  }

  // Category deduction
  let kat = "creme";
  const catStr = ((p.tileData && p.tileData.trackingData && p.tileData.trackingData.categories) ? p.tileData.trackingData.categories.join(" ") : "") + " " + titleLower;
  if (catStr.includes("reinigung") || catStr.includes("wasch") || catStr.includes("cleanser") || catStr.includes("schaum") || catStr.includes("mizellen") || catStr.includes("gel moussant")) {
    kat = "reiniger";
  } else if (catStr.includes("sonne") || catStr.includes("lsf") || catStr.includes("spf") || catStr.includes("uv") || catStr.includes("fluid lsf")) {
    kat = "spf";
  } else if (catStr.includes("serum") || catStr.includes("toner") || catStr.includes("tonic") || catStr.includes("peeling") || catStr.includes("bha") || catStr.includes("aha") || catStr.includes("niacinamid") || catStr.includes("azelain")) {
    kat = "serum";
  } else if (catStr.includes("creme") || catStr.includes("balsam") || catStr.includes("lotion") || catStr.includes("fluid")) {
    kat = "creme";
  }

  const draft = {
    name: title,
    brand,
    kat,
    schiene: "support",
    klassen: [],
    wirk: title,
    ff
  };
  const classified = classifyProductClasses(draft);
  kat = classified.kat || kat;
  const klassen = classified.klassen.length ? classified.klassen : (kat === "spf" ? ["uv"] : (kat === "serum" ? ["humectant"] : ["support"]));
  const schiene = classified.schiene || "support";

  const cf = typeof isBrandCrueltyFree === "function" && isBrandCrueltyFree(brand) ? true : null;

  // Melanin / Phototyp / Skin of Color detection
  let iron_ox = false;
  if (titleLower.includes("getönt") || titleLower.includes("tinted") || titleLower.includes("eisenoxid") || titleLower.includes("iron oxide") || titleLower.includes("ci 77491") || titleLower.includes("ci 77492") || titleLower.includes("ci 77499")) {
    iron_ox = true;
  }

  let no_white_cast = null;
  if (kat === "spf" || kat === "creme") {
    if (titleLower.includes("invisible") || titleLower.includes("unsichtbar") || titleLower.includes("fluid") || titleLower.includes("getönt") || titleLower.includes("tinted") || titleLower.includes("transparent") || titleLower.includes("transparenz")) {
      no_white_cast = true;
    } else if (titleLower.includes("mineral") || titleLower.includes("zink") || titleLower.includes("zinc")) {
      no_white_cast = false;
    } else {
      no_white_cast = true;
    }
  }

  let pih = false;
  if (titleLower.includes("azelain") || titleLower.includes("azelaic") || titleLower.includes("niacinamid") || titleLower.includes("tranexam") || titleLower.includes("arbutin") || titleLower.includes("pickelmal") || titleLower.includes("dunkle flecken") || titleLower.includes("anti-pigment")) {
    pih = true;
  }

  const prod = {
    id,
    name: title,
    brand,
    ean: String(gtin),
    dan: String(dan),
    price,
    img,
    url,
    kat,
    schiene,
    klassen,
    rx: !!classified.rx,
    shape: kat === "reiniger" ? "pump" : (kat === "serum" || kat === "active" ? "serum" : (kat === "spf" ? "tube" : "jar")),
    c: kat === "reiniger" ? "#76a9c7" : (kat === "serum" || kat === "active" ? "#6aa8c9" : (kat === "spf" ? "#ecd37b" : "#a4c8a8")),
    wirk: classified.wirkHint || ((ff === true ? "Parfümfrei · " : "") + (price ? price + " · " : "") + brand),
    nc: null,
    ff,
    cf,
    no_white_cast,
    iron_ox,
    pih,
    store: `dm (${price || 'Online/Filiale'})`,
    source: "dm-live"
  };
  return enrichProductClasses(prod);
}

function normalizeDmPilotRow(r) {
  const dan = r.dan || "";
  const ean = r.ean || "";
  const id = "dm_" + (dan || ean || Math.random().toString(36).slice(2));
  const name = r.name || "dm-Produkt";
  const brand = r.brand || "dm";
  const price = r.price || "";

  let ff = null;
  if (r.flag_fragrance_free === "yes" || r.dm_fragranceFree === "True" || String(r.dm_fragranceFree).toLowerCase() === "true") {
    ff = true;
  } else if (r.flag_fragrance_free === "no" && (r.fragrance_basis || "").trim().length > 0) {
    ff = false;
  }

  let nc = null;
  if ((r.flag_nc === "yes" || r.flag_nc === "true") && (r.nc_basis || "").trim().length > 0) {
    nc = true;
  } else if ((r.flag_nc === "no" || r.flag_nc === "false") && (r.nc_basis || "").trim().length > 0) {
    nc = false;
  }

  const isCf = typeof isBrandCrueltyFree === "function" && isBrandCrueltyFree(brand);
  let cf = null;
  if (isCf || ((r.flag_cf === "yes" || r.flag_cf === "true") && (r.cf_basis || "").trim().length > 0)) {
    cf = true;
  } else if ((r.flag_cf === "no" || r.flag_cf === "false") && (r.cf_basis || "").trim().length > 0) {
    cf = false;
  }

  const url = r.dm_url || (dan ? `https://www.dm.de/p/d/${dan}` : "https://www.dm.de");

  let kat = "creme";
  const catStr = ((r.category || "") + " " + name).toLowerCase();
  if (catStr.includes("reinigung") || catStr.includes("wasch") || catStr.includes("cleanser") || catStr.includes("schaum") || catStr.includes("mizellen")) {
    kat = "reiniger";
  } else if (catStr.includes("sonne") || catStr.includes("lsf") || catStr.includes("spf") || catStr.includes("uv")) {
    kat = "spf";
  } else if (catStr.includes("serum") || catStr.includes("toner") || catStr.includes("tonic") || catStr.includes("peeling") || catStr.includes("bha") || catStr.includes("aha") || catStr.includes("niacinamid")) {
    kat = "serum";
  } else if (catStr.includes("creme") || catStr.includes("balsam") || catStr.includes("lotion") || catStr.includes("fluid")) {
    kat = "creme";
  }

  const draft = {
    name,
    brand,
    kat,
    schiene: "support",
    klassen: [],
    wirk: name,
    ff,
    nc
  };
  const classified = classifyProductClasses(draft);
  kat = classified.kat || kat;
  const klassen = classified.klassen.length ? classified.klassen : (kat === "spf" ? ["uv"] : (kat === "serum" ? ["humectant"] : ["support"]));
  const schiene = classified.schiene || "support";

  // Melanin / Phototyp / Skin of Color detection
  let iron_ox = false;
  if (catStr.includes("getönt") || catStr.includes("tinted") || catStr.includes("eisenoxid") || catStr.includes("iron oxide")) {
    iron_ox = true;
  }

  let no_white_cast = null;
  if (kat === "spf" || kat === "creme") {
    if (catStr.includes("invisible") || catStr.includes("unsichtbar") || catStr.includes("fluid") || catStr.includes("getönt") || catStr.includes("tinted") || catStr.includes("transparent")) {
      no_white_cast = true;
    } else if (catStr.includes("mineral") || catStr.includes("zink") || catStr.includes("zinc")) {
      no_white_cast = false;
    } else {
      no_white_cast = true;
    }
  }

  let pih = false;
  if (catStr.includes("azelain") || catStr.includes("azelaic") || catStr.includes("niacinamid") || catStr.includes("tranexam") || catStr.includes("arbutin") || catStr.includes("pickelmal") || catStr.includes("anti-pigment")) {
    pih = true;
  }

  const prod = {
    id,
    name,
    brand,
    ean,
    dan,
    price,
    img: "",
    url,
    kat,
    schiene,
    klassen,
    rx: !!classified.rx,
    shape: kat === "reiniger" ? "pump" : (kat === "serum" || kat === "active" ? "serum" : (kat === "spf" ? "tube" : "jar")),
    c: kat === "reiniger" ? "#76a9c7" : (kat === "serum" || kat === "active" ? "#6aa8c9" : (kat === "spf" ? "#ecd37b" : "#a4c8a8")),
    wirk: classified.wirkHint || ((ff === true ? "Parfümfrei · " : "") + (price ? price + " · " : "") + brand),
    nc,
    ff,
    cf,
    no_white_cast,
    iron_ox,
    pih,
    store: `dm (${price || 'Filiale'})`,
    source: "dm-pilot"
  };
  return enrichProductClasses(prod);
}

async function searchDmLive(query) {
  if (!query || String(query).trim().length < 2) return [];
  const q = String(query).trim();

  // 1. If running on localhost / server, call server proxy
  if (window.location.protocol !== "file:") {
    try {
      const res = await fetch(`/api/dm-search?query=${encodeURIComponent(q)}&pageSize=12`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.products && data.products.length > 0) {
          const prods = data.products.map(normalizeDmProduct);
          window.currentLiveDmResults = prods;
          window.dmResultsMap = window.dmResultsMap || {};
          prods.forEach(pr => {
            if (pr.id) window.dmResultsMap[pr.id] = pr;
            if (pr.ean) window.dmResultsMap[pr.ean] = pr;
            if (pr.dan) window.dmResultsMap[pr.dan] = pr;
          });
          return prods;
        }
      }
    } catch (e) {
      console.warn("[Live-dm] Server-Proxy fehlgeschlagen, prüfe Pilot-Cache:", e);
    }
  }

  // 2. Offline / file:// Fallback: Query DM_PILOT_CACHE
  if (window.DM_PILOT_CACHE && window.DM_PILOT_CACHE.length > 0) {
    const qLower = q.toLowerCase();
    const hits = window.DM_PILOT_CACHE.filter(r => {
      return (r.name && r.name.toLowerCase().includes(qLower)) ||
             (r.brand && r.brand.toLowerCase().includes(qLower)) ||
             (r.ean && r.ean.includes(q)) ||
             (r.dan && r.dan.includes(q)) ||
             (r.queries && r.queries.toLowerCase().includes(qLower));
    });
    if (hits.length > 0) {
      const prods = hits.slice(0, 12).map(normalizeDmPilotRow);
      window.currentLiveDmResults = prods;
      window.dmResultsMap = window.dmResultsMap || {};
      prods.forEach(pr => {
        if (pr.id) window.dmResultsMap[pr.id] = pr;
        if (pr.ean) window.dmResultsMap[pr.ean] = pr;
        if (pr.dan) window.dmResultsMap[pr.dan] = pr;
      });
      return prods;
    }
  }

  return [];
}


// ==========================================
// MASTER-KATALOG LOADER (katalog-produkte.csv)
// Gemeinsame Tabelle aller Kategorien:
// rows.filter(r => r.katalog === "jugend")
// rows.filter(r => r.katalog === "baby_kind")
// rows.filter(r => r.katalog === "erwachsen_gesicht")
// ==========================================

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentVal.trim());
      if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
        lines.push(row);
      }
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    lines.push(row);
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map(h => h.trim());
  return lines.slice(1).map(line => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = line[idx] !== undefined ? line[idx] : '';
    });
    return obj;
  });
}

function applyKatalogRows(rows) {
  if (!rows || rows.length === 0) return;

  const parseFlagWithSource = (val, basis) => {
    if (!val) return null;
    const v = String(val).toLowerCase().trim();
    const hasBasis = basis && String(basis).trim().length > 0;
    if (v === "yes" || v === "true") {
      return hasBasis ? true : null;
    }
    if (v === "no" || v === "false") {
      return hasBasis ? false : null;
    }
    return null; // offen (nie raten)
  };

  // 1. Nur Jugend-Produkte: rows.filter(r => r.katalog === "jugend" || r.katalog === "jugend_teen")
  const jugendRows = rows.filter(r => r.katalog === "jugend" || r.katalog === "jugend_teen");
  if (jugendRows.length > 0) {
    jugendRows.forEach((r, idx) => {
      const ean = (r.ean || "").trim();
      const rawName = (r.name || "").trim();
      const rawBrand = (r.brand || "").trim();

      // Match ID: EAN first; if no EAN, search matching seed by name & brand; fallback to t_item_
      let id = ean ? ("t_ean_" + ean) : null;
      if (!id && typeof TEEN_DB === "object" && TEEN_DB) {
        const nameL = rawName.toLowerCase();
        const brandL = rawBrand.toLowerCase();
        for (const tid in TEEN_DB) {
          const item = TEEN_DB[tid];
          if (item && !item.ean && item.name && item.name.toLowerCase() === nameL && item.brand && item.brand.toLowerCase() === brandL) {
            id = tid;
            break;
          }
        }
      }
      if (!id) {
        id = "t_item_" + (idx + 1);
      }

      const existing = (typeof TEEN_DB === "object" && TEEN_DB) ? TEEN_DB[id] : null;

      const rawSlot = (r.slot || "").trim();
      let slot = "creme";
      if (rawSlot === "basis_reiniger" || rawSlot === "akne_reiniger" || rawSlot === "reiniger") slot = "reiniger";
      else if (rawSlot === "akne_active" || rawSlot === "serum" || rawSlot === "active") slot = "active";
      else if (rawSlot === "basis_creme" || rawSlot === "akne_creme" || rawSlot === "creme") slot = "creme";
      else if (rawSlot === "basis_spf" || rawSlot === "spf") slot = "spf";
      else if (rawSlot === "sonst") slot = "sonst";
      else if (existing && existing.slot) slot = existing.slot;

      const brand = rawBrand || (existing ? existing.brand : "");
      const cfFromBrand = typeof isBrandCrueltyFree === "function" && isBrandCrueltyFree(brand);

      const parsedFf = parseFlagWithSource(r.flag_fragrance_free, r.fragrance_basis);
      let ff = parsedFf !== null ? parsedFf : (existing && existing.ff !== null && existing.ff !== undefined ? existing.ff : null);
      if (ff === null && (r.flag_fragrance_free === "no" || r.flag_fragrance_free === "false")) {
        const blob = ((r.fragrance_basis || "") + " " + (r.notes || "")).toLowerCase();
        if (/parf|duft|fragrance|scent|perfume/.test(blob)) {
          ff = false;
        }
      }
      const ff_basis = (r.fragrance_basis || "").trim() || (existing ? existing.ff_basis : "");

      const parsedNc = parseFlagWithSource(r.flag_nc, r.nc_basis);
      const nc = parsedNc !== null ? parsedNc : (existing && existing.nc !== null && existing.nc !== undefined ? existing.nc : null);
      const nc_basis = (r.nc_basis || "").trim() || (existing ? existing.nc_basis : "");

      const parsedCf = parseFlagWithSource(r.flag_cf, r.cf_basis);
      const cf = cfFromBrand ? true : (parsedCf !== null ? parsedCf : (existing && existing.cf !== null && existing.cf !== undefined ? existing.cf : null));
      const cf_basis = (r.cf_basis || "").trim() || (cfFromBrand ? "CFI Leaping Bunny" : (existing ? existing.cf_basis : ""));

      const notForMinors = r.not_for_minors === "yes" || r.not_for_minors === "true" || (existing ? !!existing.notForMinors : false);
      const parsedCountries = parseEuCountries(r.eu_countries);
      const countries = parsedCountries && parsedCountries.length ? parsedCountries : (existing && existing.countries ? existing.countries : ["EU"]);

      TEEN_DB[id] = {
        id: id,
        name: rawName || (existing ? existing.name : ""),
        brand: brand,
        slot: slot,
        rawSlot: rawSlot || (existing ? existing.rawSlot : slot),
        age: (r.age_band || "").trim() || (existing ? existing.age : "teen_or_ya_unclear"),
        ean: ean || (existing ? existing.ean : ""),
        ff: ff,
        ff_basis: ff_basis,
        nc: nc,
        nc_basis: nc_basis,
        cf: cf,
        cf_basis: cf_basis,
        notForMinors: notForMinors,
        countries: countries,
        url: (r.source_url || "").trim() || (existing ? existing.url : ""),
        notes: (r.notes || "").trim() || (existing ? existing.notes : "")
      };
    });
  }

  // 2. Baby & Kind: rows.filter(r => r.katalog === "baby_kind")
  const babyRows = rows.filter(r => r.katalog === "baby_kind");
  if (babyRows.length > 0) {
    babyRows.forEach((r, idx) => {
      const ean = (r.ean || "").trim();
      const rawName = (r.name || "").trim();
      const rawBrand = (r.brand || "").trim();

      // Match ID: EAN first; if no EAN, search matching seed by name & brand; fallback to b_item_
      let id = ean ? ("b_ean_" + ean) : null;
      if (!id && typeof BABY_DB === "object" && BABY_DB) {
        const nameL = rawName.toLowerCase();
        const brandL = rawBrand.toLowerCase();
        for (const bid in BABY_DB) {
          const item = BABY_DB[bid];
          if (item && !item.ean && item.name && item.name.toLowerCase() === nameL && item.brand && item.brand.toLowerCase() === brandL) {
            id = bid;
            break;
          }
        }
      }
      if (!id) {
        id = "b_item_" + (idx + 1);
      }

      const existing = (typeof BABY_DB === "object" && BABY_DB) ? BABY_DB[id] : null;

      const slot = (r.slot || "").trim() || (existing ? existing.slot : "creme");
      const brand = rawBrand || (existing ? existing.brand : "");
      const cfFromBrand = typeof isBrandCrueltyFree === "function" && isBrandCrueltyFree(brand);

      const parsedFf = parseFlagWithSource(r.flag_fragrance_free, r.fragrance_basis);
      let ff = parsedFf !== null ? parsedFf : (existing && existing.ff !== null && existing.ff !== undefined ? existing.ff : null);
      if (ff === null && (r.flag_fragrance_free === "no" || r.flag_fragrance_free === "false")) {
        const blob = ((r.fragrance_basis || "") + " " + (r.notes || "")).toLowerCase();
        if (/parf|duft|fragrance|scent|perfume/.test(blob)) {
          ff = false;
        }
      }
      const ff_basis = (r.fragrance_basis || "").trim() || (existing ? existing.ff_basis : "");

      const parsedU3 = parseFlagWithSource(r.flag_under3_intended, r.under3_basis);
      let u3 = parsedU3 !== null ? parsedU3 : (existing && existing.u3 !== null && existing.u3 !== undefined ? existing.u3 : ((r.age_band || "").includes("baby") ? true : ((r.age_band || "").includes("kind") ? false : null)));
      const u3_basis = (r.under3_basis || "").trim() || (existing ? existing.under3_basis : "");

      const parsedCf = parseFlagWithSource(r.flag_cf, r.cf_basis);
      const cf = cfFromBrand ? true : (parsedCf !== null ? parsedCf : (existing && existing.cf !== null && existing.cf !== undefined ? existing.cf : null));
      const cf_basis = (r.cf_basis || "").trim() || (cfFromBrand ? "CFI Leaping Bunny" : (existing ? existing.cf_basis : ""));

      const parsedNc = parseFlagWithSource(r.flag_nc, r.nc_basis);
      const nc = parsedNc !== null ? parsedNc : (existing && existing.nc !== null && existing.nc !== undefined ? existing.nc : null);
      const nc_basis = (r.nc_basis || "").trim() || (existing ? existing.nc_basis : "");

      const parsedCountries = parseEuCountries(r.eu_countries);
      const countries = parsedCountries && parsedCountries.length ? parsedCountries : (existing && existing.countries ? existing.countries : ["EU"]);

      BABY_DB[id] = {
        id: id,
        name: rawName || (existing ? existing.name : ""),
        brand: brand,
        slot: slot,
        age: (r.age_band || "").trim() || (existing ? existing.age : "baby_0_36m"),
        ean: ean || (existing ? existing.ean : ""),
        ff: ff,
        ff_basis: ff_basis,
        u3: u3,
        u3_basis: u3_basis,
        cf: cf,
        cf_basis: cf_basis,
        nc: nc,
        nc_basis: nc_basis,
        spfNote: (r.spf_note || "").trim() || (existing ? existing.spfNote : ""),
        url: (r.source_url || "").trim() || (existing ? (existing.url || existing.sourceUrl) : ""),
        notes: (r.notes || "").trim() || (existing ? existing.notes : ""),
        countries: countries
      };
    });
  }

  // 3. Erwachsen Gesicht: rows.filter(r => r.katalog === "erwachsen_gesicht")
  const erwachsenRows = rows.filter(r => r.katalog === "erwachsen_gesicht");
  if (erwachsenRows.length > 0 && typeof DB === "object") {
    erwachsenRows.forEach((r, idx) => {
      const ean = (r.ean || "").trim();
      const id = ean ? ("ean_" + ean) : ("custom_" + (idx + 1));
      const name = (r.name || "").trim();
      const brand = (r.brand || "").trim();
      const rawSlot = (r.slot || "").trim();
      let kat = "creme";
      const nameL = name.toLowerCase();
      // Name-Heuristik vor falschem CSV-Slot (z.B. basis_spf auf Retinal-Serum)
      if (rawSlot.includes("reiniger") || nameL.includes("wasch") || nameL.includes("cleanser") || nameL.includes("reinigung") || nameL.includes("savon")) kat = "reiniger";
      else if (nameL.includes("serum") || nameL.includes("retinol") || nameL.includes("retinal") || rawSlot.includes("serum") || rawSlot.includes("active")) kat = "serum";
      else if ((rawSlot.includes("spf") || rawSlot.includes("sun") || nameL.includes("spf") || nameL.includes("sun") || nameL.includes("sonne")) && !(nameL.includes("retinol") || nameL.includes("retinal"))) kat = "spf";
      
      const cfFromBrand = typeof isBrandCrueltyFree === "function" && isBrandCrueltyFree(brand);

      if (!DB[id]) {
        DB[id] = enrichProductClasses({
          id: id,
          name: name,
          brand: brand,
          kat: kat,
          schiene: "support",
          klassen: [],
          shape: kat === "reiniger" ? "pump" : (kat === "serum" ? "dropper" : "tube"),
          c: "#888888",
          wirk: "EU-Katalog (" + (r.eu_countries || "EU") + ")",
          nc: parseFlagWithSource(r.flag_nc, r.nc_basis),
          nc_basis: (r.nc_basis || "").trim(),
          ff: parseFlagWithSource(r.flag_fragrance_free, r.fragrance_basis),
          ff_basis: (r.fragrance_basis || "").trim(),
          cf: cfFromBrand ? true : parseFlagWithSource(r.flag_cf, r.cf_basis),
          cf_basis: (r.cf_basis || "").trim(),
          store: "EU (" + (r.eu_countries || "Drogerie/Apo") + ")",
          ean: ean,
          sourceUrl: (r.source_url || "").trim(),
          notes: (r.notes || "").trim(),
          countries: parseEuCountries(r.eu_countries)
        });
      } else {
        // Kern-Produkt mit Nachweisen aus der CSV anreichern
        if (r.fragrance_basis && !DB[id].ff_basis) DB[id].ff_basis = r.fragrance_basis.trim();
        if (r.nc_basis && !DB[id].nc_basis) DB[id].nc_basis = r.nc_basis.trim();
        if (r.cf_basis && !DB[id].cf_basis) DB[id].cf_basis = r.cf_basis.trim();
        if (r.source_url && !DB[id].url) DB[id].url = r.source_url.trim();
        if (cfFromBrand && !DB[id].cf) { DB[id].cf = true; DB[id].cf_basis = "CFI Leaping Bunny"; }
        if (r.notes && !DB[id].notes) DB[id].notes = r.notes.trim();
        if (r.eu_countries) DB[id].countries = parseEuCountries(r.eu_countries);
        enrichProductClasses(DB[id]);
      }
    });
  }

  // Eigene und aus Live-dm übernommene Produkte im DB-Katalog absichern
  if (typeof appState === "object" && appState.customProducts) {
    for (const [cid, cprod] of Object.entries(appState.customProducts)) {
      if (!cprod) continue;
      const enriched = enrichProductClasses(cprod);
      if (typeof DB === "object") DB[cid] = enriched;
      // Keep Teen/Baby cabinets resolvable after CSV overwrite of catalog maps
      if (typeof TEEN_DB === "object" && TEEN_DB) {
        const slot = enriched.kat === "reiniger" ? "reiniger" : (enriched.kat === "spf" ? "spf" : (enriched.kat === "serum" || enriched.kat === "active" || enriched.kat === "spot" ? "active" : "creme"));
        TEEN_DB[cid] = Object.assign({}, enriched, { slot: (TEEN_DB[cid] && TEEN_DB[cid].slot) || slot });
      }
      if (typeof BABY_DB === "object" && BABY_DB) {
        const slot = enriched.kat === "reiniger" ? "reiniger" : (enriched.kat === "spf" ? "spf" : (enriched.kat === "windel" ? "windel" : "creme"));
        BABY_DB[cid] = Object.assign({}, enriched, { slot: (BABY_DB[cid] && BABY_DB[cid].slot) || slot });
      }
    }
  }

  // Klassen für Seeds + CSV-Produkte nachziehen (retinoid_cos/rx, aha, …)
  enrichAllDbProducts();
  ensureCatalogCountries();

  // Wenn Schrank geöffnet ist, Ansicht auffrischen
  if (typeof appState === "object" && appState.view === "cabinet" && typeof renderMain === "function") {
    renderMain();
  }
}

// ==========================================
// KATALOG-STATUS & SERVER-HILFE
// ==========================================

window.katalogStatus = {
  mode: "loading",
  protocol: window.location.protocol
};

function updateKatalogStatusUI() {
  const badge = document.getElementById("katalogStatusBadge");
  const text = document.getElementById("katalogStatusText");
  if (!badge || !text) return;

  if (window.katalogStatus && window.katalogStatus.mode === "live") {
    badge.style.background = "#dcfce7";
    badge.style.color = "#166534";
    badge.style.borderColor = "#bbf7d0";
    badge.innerHTML = `<span style="color:#16a34a">●</span> Live-Katalog (${window.katalogStatus.count || 985})`;
    badge.title = "Verbunden: 985 Produkte live aus katalog-produkte.csv geladen. Kamera-Scanner aktiv.";
  } else {
    badge.style.background = "#fef3c7";
    badge.style.color = "#92400e";
    badge.style.borderColor = "#fde68a";
    badge.innerHTML = `<span style="color:#d97706">●</span> Offline-Katalog (896)`;
    badge.title = "file:// Modus: Eingebetteter Katalog aktiv. Klicke für Info zum lokalen Server.";
  }
}

function showKatalogStatusModal() {
  const isLive = window.katalogStatus && window.katalogStatus.mode === "live";

  showModalSheet(`
    <div style="padding:1rem 1.1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem">
        <span class="tag" style="background:${isLive ? '#dcfce7' : '#fef3c7'};color:${isLive ? '#166534' : '#92400e'};font-weight:700">
          ${isLive ? '🟢 Live-Katalog & Server aktiv' : '⚡ Offline-Fallback-Modus'}
        </span>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>

      <h2 style="font-family:'Iowan Old Style', Georgia, serif;font-size:1.3rem;margin:0 0 0.5rem">
        ${isLive ? 'Master-Katalog erfolgreich geladen' : 'Katalog- & Server-Status'}
      </h2>

      <p style="font-size:0.86rem;color:var(--ink);line-height:1.45;margin-bottom:0.9rem">
        ${isLive
          ? `Der Kosmetikschrank ist über <strong>${window.location.origin}</strong> verbunden. Alle <strong>${window.katalogStatus.count || 985} Produkte</strong> wurden dynamisch aus <code>katalog-produkte.csv</code> eingelesen. Der Live-Kamera-Barcode-Scanner ist im gesicherten Modus voll einsatzbereit.`
          : `Die App läuft aktuell über das <code>file://</code>-Protokoll. Browser sperren hierbei externe Datei-Abrufe (CORS). Der Kosmetikschrank nutzt daher automatisch seinen <strong>eingebetteten Offline-Katalog (896 Produkte)</strong> – alle Routinen und Analysen funktionieren vollständig offline!`
        }
      </p>

      ${!isLive ? `
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:12px;margin-bottom:0.9rem">
          <div style="font-weight:700;font-size:0.86rem;color:#0f172a;margin-bottom:4px">🚀 Lokalen Server starten (Live-CSV & Kamera-Scanner):</div>
          <ol style="font-size:0.82rem;color:#334155;margin:0;padding-left:1.2rem;line-height:1.5">
            <li>Mappe auf deinem Desktop öffnen: <code>Kosmetikschrank</code></li>
            <li>Doppelklick auf <strong><code>start-server.bat</code></strong></li>
            <li>Der Server startet sofort auf <strong><code>http://localhost:8000</code></strong> und öffnet den Browser automatisch!</li>
          </ol>
        </div>
      ` : ''}

      <div style="display:flex;gap:8px;margin-top:0.8rem">
        <button class="btn-text" style="flex:1;background:var(--ok);color:#F7F4D5;padding:9px;border-radius:8px;font-weight:700" onclick="closeModal()">
          Verstanden
        </button>
      </div>
    </div>
  `);
}

async function loadKatalogFromCSV() {
  try {
    const text = await fetch("katalog-produkte.csv").then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    });
    if (text) {
      const rows = parseCSV(text);
      applyKatalogRows(rows);
      window.katalogStatus = {
        mode: "live",
        source: "katalog-produkte.csv",
        count: rows.length,
        protocol: window.location.protocol
      };
      console.log(`[Master-Katalog] ${rows.length} Zeilen aus katalog-produkte.csv erfolgreich geladen.`);
      updateKatalogStatusUI();
    }
  } catch (err) {
    window.katalogStatus = {
      mode: "fallback",
      error: err.message,
      protocol: window.location.protocol
    };
    console.info("[Master-Katalog] Offline-Fallback-Katalog aktiv (896 Kern-Produkte). Unter localhost wird die Live-CSV geladen.", err);
    updateKatalogStatusUI();
  }
}