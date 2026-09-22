// ==========================================
// Länder-aware Live-Suche (Retailer-Map + API-Client)
// Siehe eu-drogerien.md — ehrlich: DE-MCP ≠ IT-Lager
// ==========================================

const DM_LIVE_COUNTRIES = ["DE","AT","IT","PL","CZ","SK","HU","SI","HR","RO","BG","BA","RS","MK"];

const LIVE_RETAILER_BY_COUNTRY = {
  DE: { primary: "dm", secondary: "mueller", label: "dm Deutschland", chip: "Live: dm Deutschland", shopUrl: "https://www.dm.de/search?query=", muellerUrl: "https://www.mueller.de/search/?q=", mode: "mcp" },
  AT: { primary: "dm", secondary: "bipa", tertiary: "mueller", label: "dm, BIPA & Müller Österreich", chip: "Live: dm / BIPA / Müller AT", shopUrl: "https://www.dm.at/search?query=", bipaUrl: "https://www.bipa.at/search?q=", muellerUrl: "https://www.mueller.at/search/?q=", mode: "deeplink_obf" },
  IT: { primary: "dm", label: "dm Italia", chip: "Live: dm Italia", shopUrl: "https://www.dm.it/search?query=", mode: "deeplink_obf" },
  PL: { primary: "dm", label: "dm Polska", chip: "Live: dm Polska", shopUrl: "https://www.dm.pl/search?query=", mode: "deeplink_obf" },
  CZ: { primary: "dm", label: "dm Česko", chip: "Live: dm Česko", shopUrl: "https://www.dm.cz/search?query=", mode: "deeplink_obf" },
  SK: { primary: "dm", label: "dm Slovensko", chip: "Live: dm Slovensko", shopUrl: "https://www.dm.sk/search?query=", mode: "deeplink_obf" },
  HU: { primary: "dm", label: "dm Magyarország", chip: "Live: dm Magyarország", shopUrl: "https://www.dm.hu/search?query=", mode: "deeplink_obf" },
  SI: { primary: "dm", label: "dm Slovenija", chip: "Live: dm Slovenija", shopUrl: "https://www.dm.si/search?query=", mode: "deeplink_obf" },
  HR: { primary: "dm", label: "dm Hrvatska", chip: "Live: dm Hrvatska", shopUrl: "https://www.dm.hr/search?query=", mode: "deeplink_obf" },
  RO: { primary: "dm", label: "dm România", chip: "Live: dm România", shopUrl: "https://www.dm.ro/search?query=", mode: "deeplink_obf" },
  BG: { primary: "dm", label: "dm България", chip: "Live: dm България", shopUrl: "https://www.dm.bg/search?query=", mode: "deeplink_obf" },
  FR: { primary: "sephora", label: "Sephora / Notino FR", chip: "Live: Sephora/Notino", shopUrl: "https://www.notino.fr/search.asp?q=", secondaryUrl: "https://www.sephora.fr/search?q=", mode: "deeplink_obf" },
  ES: { primary: "notino", label: "Notino / Sephora ES", chip: "Live: Notino/Sephora", shopUrl: "https://www.notino.es/search.asp?q=", mode: "deeplink_obf" },
  PT: { primary: "notino", label: "Notino PT", chip: "Live: Notino", shopUrl: "https://www.notino.pt/search.asp?q=", mode: "deeplink_obf" },
  NL: { primary: "douglas", label: "Douglas / Notino NL", chip: "Live: Douglas/Notino", shopUrl: "https://www.notino.nl/search.asp?q=", note: "Auch Kruidvat/Etos (kein API)", mode: "deeplink_obf" },
  BE: { primary: "douglas", label: "Douglas / Notino BE", chip: "Live: Douglas/Notino", shopUrl: "https://www.notino.be/search.asp?q=", note: "Auch Kruidvat (kein API)", mode: "deeplink_obf" },
  CH: { primary: "mueller", secondary: "douglas", label: "Müller Schweiz", chip: "Live: Müller CH", shopUrl: "https://www.mueller.ch/search/?q=", muellerUrl: "https://www.mueller.ch/search/?q=", mode: "deeplink_obf" },
  SE: { primary: "notino", label: "Notino SE", chip: "Live: Notino", shopUrl: "https://www.notino.se/search.asp?q=", mode: "deeplink_obf" },
  DK: { primary: "notino", label: "Notino DK", chip: "Live: Notino", shopUrl: "https://www.notino.dk/search.asp?q=", mode: "deeplink_obf" },
  FI: { primary: "notino", label: "Notino FI", chip: "Live: Notino", shopUrl: "https://www.notino.fi/search.asp?q=", mode: "deeplink_obf" },
  IE: { primary: "notino", label: "Notino IE", chip: "Live: Notino", shopUrl: "https://www.notino.ie/search.asp?q=", mode: "deeplink_obf" },
  GR: { primary: "notino", label: "Notino GR", chip: "Live: Notino", shopUrl: "https://www.notino.gr/search.asp?q=", mode: "deeplink_obf" },
  EE: { primary: "douglas", label: "Douglas / Notino EE", chip: "Live: Douglas/Notino", shopUrl: "https://www.notino.ee/search.asp?q=", mode: "deeplink_obf" },
  LV: { primary: "douglas", label: "Douglas / Notino LV", chip: "Live: Douglas/Notino", shopUrl: "https://www.notino.lv/search.asp?q=", mode: "deeplink_obf" },
  LT: { primary: "douglas", label: "Douglas / Notino LT", chip: "Live: Douglas/Notino", shopUrl: "https://www.notino.lt/search.asp?q=", mode: "deeplink_obf" },
  LU: { primary: "notino", label: "Notino LU", chip: "Live: Notino", shopUrl: "https://www.notino.lu/search.asp?q=", mode: "deeplink_obf" },
  MT: { primary: "notino", label: "Notino (EU)", chip: "Live: Notino", shopUrl: "https://www.notino.com/search.asp?q=", mode: "deeplink_obf" },
  CY: { primary: "notino", label: "Notino (EU)", chip: "Live: Notino", shopUrl: "https://www.notino.com/search.asp?q=", mode: "deeplink_obf" },
  NO: { primary: "notino", label: "Notino NO", chip: "Live: Notino", shopUrl: "https://www.notino.no/search.asp?q=", mode: "deeplink_obf" },
  IS: { primary: "notino", label: "Notino (EU/IS)", chip: "Live: Notino", shopUrl: "https://www.notino.com/search.asp?q=", mode: "deeplink_obf" }
};

// Rossmann-starke Länder: ergänze Hinweis (PL/HU/CZ/ES/CH/DE schon abgedeckt)
LIVE_RETAILER_BY_COUNTRY.PL.secondary = "Rossmann PL";
LIVE_RETAILER_BY_COUNTRY.HU.secondary = "Rossmann HU";
LIVE_RETAILER_BY_COUNTRY.CZ.secondary = "Rossmann CZ";
LIVE_RETAILER_BY_COUNTRY.ES.secondary = "Rossmann ES";
LIVE_RETAILER_BY_COUNTRY.CH.secondary = "Rossmann CH";

const MUELLER_BRANDS_RE = /\b(cv|cadeavera|terra\s*naturi|beauty\s*baby|aveo|aiko|duchesse|barfuss|sensisana|müller|mueller)\b/i;

function isMuellerBrandQuery(query) {
  return MUELLER_BRANDS_RE.test(String(query || ""));
}

function getMuellerShopUrlForCountry(cc) {
  const code = String(cc || "AT").toUpperCase();
  if (code === "AT") return "https://www.mueller.at/search/?q=";
  if (code === "CH") return "https://www.mueller.ch/search/?q=";
  if (code === "HR") return "https://www.mueller.hr/pretraga/?q=";
  if (code === "SI") return "https://www.mueller.si/iskanje/?q=";
  if (code === "HU") return "https://www.mueller.co.hu/kereses/?q=";
  return "https://www.mueller.de/search/?q=";
}

function guessMuellerCategory(query) {
  const qLower = String(query || "").toLowerCase();
  if (/\b(wasch|reiniger|cleanser|reinigung|schaum|gel|mizell)\b/i.test(qLower)) return "reiniger";
  if (/\b(serum|ampulle|retinol|niacinamid|vitamin\s*c|aha|bha|peeling)\b/i.test(qLower)) return "serum";
  if (/\b(sonne|sun|spf|lfs|uv)\b/i.test(qLower)) return "spf";
  if (/\b(shampoo|haar|spülung|conditioner)\b/i.test(qLower)) return "haar";
  if (/\b(windel|wundschutz|po-creme|zink|wickel)\b/i.test(qLower)) return "windel";
  return "creme";
}

function detectMuellerBrand(query) {
  const qLower = String(query || "").toLowerCase();
  if (/\b(cv|cadeavera)\b/i.test(qLower)) return "CV CadeaVera";
  if (/\bterra\s*naturi\b/i.test(qLower)) return "Terra Naturi";
  if (/\bbeauty\s*baby\b/i.test(qLower)) return "Beauty Baby";
  if (/\baveo\b/i.test(qLower)) return "Aveo";
  if (/\baiko\b/i.test(qLower)) return "Aiko";
  if (/\bduchesse\b/i.test(qLower)) return "Duchesse";
  if (/\bbarfuss\b/i.test(qLower)) return "Barfuss";
  if (/\bsensisana\b/i.test(qLower)) return "SensiSana";
  return "Müller";
}


const BIPA_BRANDS_RE = /\b(bi\s*good|bigood|bi\s*care|bicare|babywell|look\s*by\s*bipa|today|today\s*sun|bipa)\b/i;

function isBipaBrandQuery(query) {
  return BIPA_BRANDS_RE.test(String(query || ""));
}

function getBipaShopUrlForCountry(cc) {
  return "https://www.bipa.at/search?q=";
}

function guessBipaCategory(query) {
  const qLower = String(query || "").toLowerCase();
  if (/\b(wasch|reiniger|cleanser|reinigung|schaum|gel|mizell|seife)\b/i.test(qLower)) return "reiniger";
  if (/\b(serum|ampulle|retinol|niacinamid|vitamin\s*c|aha|bha|peeling|elixier)\b/i.test(qLower)) return "serum";
  if (/\b(sonne|sun|spf|lfs|uv)\b/i.test(qLower)) return "spf";
  if (/\b(shampoo|haar|spülung|conditioner)\b/i.test(qLower)) return "haar";
  if (/\b(windel|wundschutz|po-creme|zink|wickel)\b/i.test(qLower)) return "windel";
  return "creme";
}

function detectBipaBrand(query) {
  const qLower = String(query || "").toLowerCase();
  if (/\b(bi\s*good|bigood)\b/i.test(qLower)) return "bi good";
  if (/\b(bi\s*care|bicare)\b/i.test(qLower)) return "bi care";
  if (/\bbabywell\b/i.test(qLower)) return "Babywell";
  if (/\blook\s*by\s*bipa\b/i.test(qLower)) return "Look by BIPA";
  if (/\btoday\b/i.test(qLower)) return "Today";
  return "BIPA";
}

function createBipaCard(query, country) {
  const q = String(query || "").trim();
  const cc = String(country || (typeof getProfileCountry === "function" ? getProfileCountry() : "AT") || "AT").toUpperCase();
  const shop = getBipaShopUrlForCountry(cc);
  const url = shop + encodeURIComponent(q);
  const brand = detectBipaBrand(q);
  const kat = guessBipaCategory(q);
  const safeId = encodeURIComponent(q).replace(/%/g, "_").slice(0, 24);
  return normalizeLiveApiProduct({
    id: "deeplink_bipa_" + cc + "_" + safeId,
    name: "Im BIPA Onlineshop nach „" + q + "“ suchen",
    title: "Im BIPA Onlineshop nach „" + q + "“ suchen",
    brand: brand,
    brandName: brand,
    kat: kat,
    price: "",
    url: url,
    appLink: url,
    store: "BIPA " + cc,
    source: "deeplink",
    deeplinkOnly: true,
    retailerLabel: "BIPA " + cc,
    country: cc,
    countries: [cc],
    gtin: "",
    dan: "",
    wirk: "BIPA Drogerie (" + cc + ") · Deep-Link"
  });
}

function createMuellerCard(query, country) {
  const q = String(query || "").trim();
  const cc = String(country || (typeof getProfileCountry === "function" ? getProfileCountry() : "AT") || "AT").toUpperCase();
  const shop = getMuellerShopUrlForCountry(cc);
  const url = shop + encodeURIComponent(q);
  const brand = detectMuellerBrand(q);
  const kat = guessMuellerCategory(q);
  const safeId = encodeURIComponent(q).replace(/%/g, "_").slice(0, 24);
  return normalizeLiveApiProduct({
    id: "deeplink_mueller_" + cc + "_" + safeId,
    name: "Im Müller Onlineshop nach „" + q + "“ suchen",
    title: "Im Müller Onlineshop nach „" + q + "“ suchen",
    brand: brand,
    brandName: brand,
    kat: kat,
    price: "",
    url: url,
    appLink: url,
    store: "Müller " + cc,
    source: "deeplink",
    deeplinkOnly: true,
    retailerLabel: "Müller " + cc,
    country: cc,
    countries: [cc],
    gtin: "",
    dan: "",
    wirk: "Müller Drogerie (" + cc + ") · Deep-Link"
  });
}

function getLiveRetailerForCountry(cc) {
  const code = String(cc || (typeof getProfileCountry === "function" ? getProfileCountry() : "AT") || "AT").toUpperCase();
  const hit = LIVE_RETAILER_BY_COUNTRY[code];
  if (hit) return Object.assign({ country: code }, hit);
  return {
    country: code,
    primary: "notino",
    label: "Notino (EU)",
    chip: "Live: Notino",
    shopUrl: "https://www.notino.com/search.asp?q=",
    mode: "deeplink_obf"
  };
}

function getLiveSearchChipLabel(cc) {
  return getLiveRetailerForCountry(cc).chip || "Live-Suche";
}

function getLiveSearchHonesty(cc) {
  const r = getLiveRetailerForCountry(cc);
  if (r.mode === "mcp" && r.country === "DE") {
    return { showWarn: false, short: "Live dm = Deutschland-Shop (MCP)", badge: null, chip: r.chip };
  }
  if (r.country === "AT") {
    return {
      showWarn: true,
      short: "Deep-Links zu dm.at, bipa.at & mueller.at + Open Beauty Facts",
      badge: "dm, BIPA & Müller · Österreich",
      chip: r.chip
    };
  }
  if (r.primary === "mueller" || r.country === "CH") {
    return {
      showWarn: true,
      short: "Deep-Link zum Onlineshop von Müller Schweiz",
      badge: "Müller Schweiz · mueller.ch",
      chip: r.chip
    };
  }
  if (r.primary === "dm") {
    return {
      showWarn: true,
      short: "Kein lokales dm-API — Deep-Link + Open Beauty Facts",
      badge: r.label + " · nicht DE-Lager (ehrlich)",
      chip: r.chip
    };
  }
  return {
    showWarn: true,
    short: "Kein dm in diesem Land — Online-Shop-Link + OBF",
    badge: r.label + " · Verfügbarkeit im Shop prüfen",
    chip: r.chip
  };
}

// Override older honesty helpers if present
function getLiveDmHonesty(cc) {
  return getLiveSearchHonesty(cc);
}
function liveDmHonestyBadgeHtml(cc) {
  const h = getLiveSearchHonesty(cc);
  if (!h.showWarn) {
    return '<span class="tag" style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;font-size:0.65rem;padding:1px 5px">' + (h.chip || "Live dm · DE") + "</span>";
  }
  return '<span class="tag" style="background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;font-size:0.65rem;padding:1px 5px" title="' + (h.short || "") + '">' + (h.badge || h.chip) + "</span>";
}

/** Preis immer als String — nie {formattedValue:...} → "[object Object]". */
function formatLivePrice(price) {
  if (price == null) return "";
  if (typeof price === "string") return price.trim();
  if (typeof price === "number" && isFinite(price)) return String(price);
  if (typeof price === "object") {
    if (Object.prototype.hasOwnProperty.call(price, "formattedValue")) {
      return String(price.formattedValue == null ? "" : price.formattedValue).trim();
    }
    if (price.value != null && price.value !== "") {
      const cur = price.currency || price.currencySymbol || "€";
      return String(price.value).trim() + (String(price.value).includes(cur) ? "" : " " + cur);
    }
    if (price.amount != null && price.amount !== "") {
      const cur = price.currency || price.currencySymbol || "€";
      return String(price.amount).trim() + (String(price.amount).includes(cur) ? "" : " " + cur);
    }
    return "";
  }
  return String(price);
}

function normalizeLiveApiProduct(p) {
  if (!p) return null;
  // Already normalized dm shape
  if (p.id && (p.name || p.brand) && p._liveSource) {
    p.price = formatLivePrice(p.price);
    if (p.wirk != null && typeof p.wirk !== "string") p.wirk = formatLivePrice(p.wirk) || String(p.wirk);
    if (typeof enrichProductClasses === "function") return enrichProductClasses(p);
    return p;
  }
  const source = p.source || p._liveSource || "live";
  const ean = p.gtin || p.ean || p.code || "";
  const dan = p.dan || "";
  const id = p.id || ((source === "obf" ? "obf_" : "live_") + (ean || dan || Math.random().toString(36).slice(2, 9)));
  const name = p.title || p.name || p.product_name || "Produkt";
  const brand = p.brandName || p.brand || p.brands || "";
  let url = p.url || p.appLink || "";
  if (!url && p.relativeProductUrl) url = "https://www.dm.de" + p.relativeProductUrl;
  const prod = {
    id: id,
    name: name,
    brand: brand,
    kat: p.kat || "creme",
    schiene: "support",
    klassen: [],
    shape: "tube",
    c: "#fecaca",
    wirk: p.wirk || formatLivePrice(p.price) || source,
    store: p.store || (p.retailerLabel || source),
    ean: ean,
    dan: dan,
    url: url,
    img: p.img || p.image_url || "",
    price: formatLivePrice(p.price),
    ff: p.ff != null ? p.ff : null,
    cf: p.cf != null ? p.cf : null,
    nc: p.nc != null ? p.nc : null,
    countries: p.countries || (p.country ? [p.country] : []),
    _liveSource: source,
    _deeplinkOnly: !!p.deeplinkOnly || source === "deeplink",
    retailerLabel: p.retailerLabel || ""
  };
  if (typeof enrichProductClasses === "function") return enrichProductClasses(prod);
  return prod;
}


const KNOWN_EAN_REGISTRY = {
  "3600551183398": {
    name: "Balm Cica+ Multi-Use Reparierender Balm, 50 ml",
    brand: "Mixa",
    kat: "creme",
    price: "5,95 €",
    img: "https://products.dm-static.com/images/f_auto,q_auto,c_fit,h_320,w_320/v1765787581/assets/pas/images/da6fbf35-1c6d-441e-8535-02f4b58871dd/mixa-balm-cica-multi-use-reparierender-balm",
    wirk: "Cica (Madecassoside) + 5% Panthenol",
    ff: true,
    nc: true,
    cf: false,
    store: "dm / BIPA / Müller (~5,95 €)"
  },
  "3600551061986": {
    name: "Panthenol Comfort Beruhigende Creme, 50 ml",
    brand: "Mixa",
    kat: "creme",
    price: "6,95 €",
    img: "https://products.dm-static.com/images/f_auto,q_auto,c_fit,h_320,w_320/v1765787593/assets/pas/images/81f58087-1664-4a71-bab7-46199af06ee5/mixa-balm-cica-multi-use-reparierender-balm",
    wirk: "13% Glycerin + Panthenol",
    ff: true,
    nc: true,
    cf: false,
    store: "dm / BIPA / Müller (~6,95 €)"
  },
  "3337875597197": {
    name: "Hydrating Cleanser Feuchtigkeitsspendende Reinigungslotion, 236 ml",
    brand: "CeraVe",
    kat: "reiniger",
    price: "10,95 €",
    img: "https://products.dm-static.com/images/f_auto,q_auto,c_fit,h_320,w_320/v1765787667/assets/pas/images/bbcd8ce5-ab1e-4820-8267-1aacc3cf8640/mixa-balm-cica-multi-use-reparierender-balm",
    wirk: "3 Ceramide + Hyaluron",
    ff: true,
    nc: true,
    cf: false,
    store: "dm / Apotheke (~11 €)"
  },
  "769915232400": {
    name: "Natural Moisturizing Factors + Beta Glucan, 100 ml",
    brand: "The Ordinary",
    kat: "creme",
    price: "14,40 €",
    img: "https://static.prod.ecom.mueller.de/products/769915232400/769915232400_1_02042026.jpg",
    wirk: "Beta-Glucan + NMF + Ceramide",
    ff: true,
    nc: true,
    cf: true,
    store: "Müller (~14,40 €)"
  },
  "0769915232400": {
    name: "Natural Moisturizing Factors + Beta Glucan, 100 ml",
    brand: "The Ordinary",
    kat: "creme",
    price: "14,40 €",
    img: "https://static.prod.ecom.mueller.de/products/769915232400/769915232400_1_02042026.jpg",
    wirk: "Beta-Glucan + NMF + Ceramide",
    ff: true,
    nc: true,
    cf: true,
    store: "Müller (~14,40 €)"
  },
  "4066447888720": {
    name: "Baby Körperlotion ultra sensitive, 250 ml",
    brand: "Babylove",
    kat: "creme",
    price: "2,45 €",
    img: "",
    wirk: "Panthenol & Mandelöl",
    ff: true,
    nc: true,
    u3: true,
    cf: false,
    store: "dm (~2,45 €)"
  }
};

function parseMuellerMarkdown(text, ean) {
  if (!text) return null;
  let rawTitle = "";
  let prodUrl = "";

  const linkMatch = text.match(/\[([^\]]+)\]\(((?:https?:\/\/(?:www\.)?mueller\.[a-z]+)?\/p\/[a-zA-Z0-9_\-]+(?:\/|\b)?)\)/i);
  if (linkMatch && !/^(!?\[?Image)/i.test(linkMatch[1])) {
    rawTitle = linkMatch[1].trim();
    prodUrl = linkMatch[2].trim();
  } else {
    const imgLink = text.match(/\[!\[Image\s*\d*:\s*([^\]]*)\]\([^)]+\)\]\(((?:https?:\/\/(?:www\.)?mueller\.[a-z]+)?\/p\/[a-zA-Z0-9_\-]+(?:\/|\b)?)\)/i);
    if (imgLink) {
      rawTitle = imgLink[1].trim();
      prodUrl = imgLink[2].trim();
    } else {
      const sourceMatch = text.match(/URL Source:\s*(https?:\/\/(?:www\.)?mueller\.[a-z]+\/p\/[^\s\)]+)/i);
      const titleMatch = text.match(/Title:\s*([^|\n\r]+)(?:\|\s*M[UÜ]LLER)?/i);
      if (sourceMatch && titleMatch) {
        prodUrl = sourceMatch[1].trim();
        rawTitle = titleMatch[1].replace(/online bestellen/i, "").trim();
      }
    }
  }
  if (!rawTitle || !prodUrl) return null;
  if (prodUrl.startsWith("/")) {
    prodUrl = "https://www.mueller.at" + prodUrl;
  }

  let img = "";
  const imgProdMatch = text.match(/https?:\/\/[^\s\)\"]*(?:static|images)\.prod\.ecom\.mueller\.de[^\s\)\"]*products(?:%2F|\/)[^\s\)\"]+/i)
                     || text.match(/https?:\/\/[^\s\)\"]*products(?:%2F|\/)[^\s\)\"]+/i);
  if (imgProdMatch) {
    img = imgProdMatch[0];
  } else {
    const cardImg = text.match(/\[!\[Image[^\]]*\]\((https?:\/\/[^\s\)\"]+)\)\]\([^\)]*\/p\//i);
    if (cardImg && !/icon|dam\/jcr/i.test(cardImg[1])) {
      img = cardImg[1];
    }
  }
  if (img) {
    const cleanMatch = img.match(/url=([^&]+)/);
    if (cleanMatch) {
      try { img = decodeURIComponent(cleanMatch[1]); } catch(e) {}
    }
  }

  let price = "";
  const priceMatch = text.match(/(\d+[,.]\d{2}\s*€)/);
  if (priceMatch) price = priceMatch[1].trim();

  const known = [
    "The Ordinary", "CV CadeaVera", "CadeaVera", "Terra Naturi", "Aveo Med", "Aveo",
    "Beauty Baby", "Mixa", "CeraVe", "Balea", "Nivea", "Neutrogena", "La Roche-Posay",
    "Garnier", "Sebamed", "Isana", "Catrice", "Essence", "Maybelline", "L'Oréal", "Loreal",
    "Weleda", "Dr. Hauschka", "Alverde", "Kneipp", "bi good", "bi care", "Babywell"
  ];
  let brand = "";
  for (const b of known) {
    if (rawTitle.toLowerCase().startsWith(b.toLowerCase())) {
      brand = b;
      break;
    }
  }
  if (!brand) brand = rawTitle.split(/\s+/)[0] || "Müller";

  let cleanName = rawTitle;
  if (brand && cleanName.toLowerCase().startsWith(brand.toLowerCase())) {
    cleanName = cleanName.slice(brand.length).trim().replace(/^[-–:]\s*/, "");
  }

  let kat = "creme";
  const low = (rawTitle + " " + brand).toLowerCase();
  if (/\b(wasch|reiniger|cleanser|reinigung|schaum|gel|mizell|seife)\b/.test(low)) kat = "reiniger";
  else if (/\b(serum|ampulle|retinol|niacinamid|vitamin\s*c|aha|bha|peeling|elixier)\b/.test(low)) kat = "serum";
  else if (/\b(sonne|sun|spf|lsf|uv)\b/.test(low)) kat = "spf";
  else if (/\b(windel|wundschutz|po-creme|zink|wickel)\b/.test(low)) kat = "windel";

  return {
    id: "mueller_" + (ean || "item"),
    title: rawTitle,
    name: cleanName || rawTitle,
    brand: brand,
    brandName: brand,
    price: price,
    img: img,
    image_url: img,
    url: prodUrl,
    appLink: prodUrl,
    store: "Müller",
    retailerLabel: "Müller",
    source: "mueller_live",
    deeplinkOnly: false,
    ean: ean || "",
    gtin: ean || "",
    kat: kat,
    wirk: "Müller Sortiment" + (price ? " · " + price : ""),
    countries: ["AT", "DE"]
  };
}

function findLocalProductMatch(query) {
  const raw = String(query || "").trim();
  const qClean = raw.replace(/\D/g, "");
  const qLower = raw.toLowerCase();

  const candidates = [];
  if (qClean) {
    candidates.push(qClean);
    if (qClean.length === 12) candidates.push("0" + qClean);
    if (qClean.length === 13 && qClean.startsWith("0")) candidates.push(qClean.replace(/^0+/, ""));
  }

  // 1. Check known EAN registry
  for (const c of candidates) {
    if (KNOWN_EAN_REGISTRY[c]) {
      const item = KNOWN_EAN_REGISTRY[c];
      return normalizeLiveApiProduct(Object.assign({
        id: "ean_" + c,
        gtin: c,
        ean: c,
        source: "live_catalog",
        deeplinkOnly: false
      }, item));
    }
  }

  // 2. Check DB (Adult)
  if (typeof DB === "object" && DB) {
    for (const k in DB) {
      const p = DB[k];
      if (!p) continue;
      const pClean = String(p.ean || p.gtin || "").replace(/\D/g, "");
      if (candidates.length && (candidates.includes(pClean) || candidates.some(c => p.id === "ean_" + c))) {
        return normalizeLiveApiProduct(Object.assign({}, p, { deeplinkOnly: false, source: "catalog" }));
      }
      if (qLower.length >= 3) {
        const full = (p.brand + " " + p.name).toLowerCase();
        if (full === qLower || p.name.toLowerCase() === qLower) {
          return normalizeLiveApiProduct(Object.assign({}, p, { deeplinkOnly: false, source: "catalog" }));
        }
      }
    }
  }

  // 3. Check BABY_DB
  if (typeof BABY_DB === "object" && BABY_DB) {
    for (const k in BABY_DB) {
      const p = BABY_DB[k];
      if (!p) continue;
      const pClean = String(p.ean || p.gtin || "").replace(/\D/g, "");
      if (candidates.length && (candidates.includes(pClean) || candidates.some(c => p.id === "b_ean_" + c))) {
        return normalizeLiveApiProduct(Object.assign({}, p, { deeplinkOnly: false, source: "baby_catalog" }));
      }
    }
  }

  // 4. Check TEEN_DB
  if (typeof TEEN_DB === "object" && TEEN_DB) {
    for (const k in TEEN_DB) {
      const p = TEEN_DB[k];
      if (!p) continue;
      const pClean = String(p.ean || p.gtin || "").replace(/\D/g, "");
      if (candidates.length && (candidates.includes(pClean) || candidates.some(c => p.id === "t_ean_" + c))) {
        return normalizeLiveApiProduct(Object.assign({}, p, { deeplinkOnly: false, source: "teen_catalog" }));
      }
    }
  }

  // 5. Check DM_PILOT_CACHE
  if (window.DM_PILOT_CACHE && window.DM_PILOT_CACHE.length) {
    const hit = window.DM_PILOT_CACHE.find(r => {
      const e = String(r.ean || r.gtin || "").replace(/\D/g, "");
      return candidates.includes(e);
    });
    if (hit && typeof normalizeDmPilotRow === "function") {
      const norm = normalizeDmPilotRow(hit);
      norm.deeplinkOnly = false;
      return norm;
    }
  }

  return null;
}

function canUseLocalLiveApi() {
  const loc = window.location;
  if (!loc || loc.protocol === "file:") return false;
  const h = String(loc.hostname || "").toLowerCase();
  if (h === "github.io" || h.endsWith(".github.io")) return false;
  return loc.protocol === "http:" || loc.protocol === "https:";
}

async function searchLiveProducts(query, country) {
  const q = String(query || "").trim();
  if (q.length < 2) return [];
  const qClean = q.replace(/\D/g, "");
  const cc = String(country || (typeof getProfileCountry === "function" ? getProfileCountry() : "AT") || "AT").toUpperCase();
  const retailer = getLiveRetailerForCountry(cc);
  window.lastLiveSearchMeta = { country: cc, retailer: retailer };

  let products = [];

  // A: Local instant check (works 100% offline and under file://)
  const localHit = findLocalProductMatch(q);
  if (localHit) {
    products.push(localHit);
  }

  // B: Lokaler Python-Proxy. Auf GitHub Pages gibt es den nicht — dann Katalog und Open Beauty Facts.
  if (products.length === 0 && canUseLocalLiveApi()) {
    try {
      const apiBase = (window.location.protocol === "file:") ? "http://127.0.0.1:8787" : "";
      const timeoutMs = (window.location.protocol === "file:") ? 1500 : 8000;
      let signal;
      if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
        signal = AbortSignal.timeout(timeoutMs);
      } else if (typeof AbortController !== "undefined") {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), timeoutMs);
        signal = ctrl.signal;
      }
      const fetchOpts = signal ? { signal } : {};
      const res = await fetch(`${apiBase}/api/live-search?query=${encodeURIComponent(q)}&country=${encodeURIComponent(cc)}&pageSize=12`, fetchOpts);
      if (res.ok) {
        const data = await res.json();
        window.lastLiveSearchMeta = Object.assign({}, window.lastLiveSearchMeta, data.meta || {});
        const raw = (data && data.products) ? data.products : [];
        raw.forEach(function (row) {
          const norm = (row.source === "dm_mcp" || (!row.source && cc === "DE"))
            ? (typeof normalizeDmProduct === "function" ? normalizeDmProduct(row) : normalizeLiveApiProduct(row))
            : normalizeLiveApiProduct(row);
          if (norm && !products.some(x => (x.ean && norm.ean && x.ean === norm.ean) || x.id === norm.id)) {
            products.push(norm);
          }
        });
      }
    } catch (e) {
      // Local API not running or unreachable
    }
  }

  // C: Direct Multi-Source Fallbacks if query is an EAN (8-14 digits) and still not found
  if (products.length === 0 && /^\d{8,14}$/.test(qClean)) {
    // C1: Open Beauty Facts & Open Food Facts (CORS allowed in browser!)
    const factCodes = [qClean];
    if (qClean.length === 12) factCodes.push("0" + qClean);
    else if (qClean.length === 13 && qClean.startsWith("0")) factCodes.push(qClean.slice(1));
    const factDbs = ["openbeautyfacts", "openfoodfacts"];

    for (const code of factCodes) {
      if (products.length > 0) break;
      for (const db of factDbs) {
        if (products.length > 0) break;
        try {
          const fRes = await fetch(`https://world.${db}.org/api/v2/product/${code}.json`);
          if (fRes.ok) {
            const fData = await fRes.json();
            if (fData && (fData.status === 1 || fData.status === "success") && fData.product) {
              const pr = fData.product;
              const name = pr.product_name_de || pr.product_name || pr.generic_name_de || pr.generic_name || "Produkt";
              const brand = (pr.brands ? pr.brands.split(",")[0].trim() : pr.brand_owner) || "";
              const img = pr.image_front_url || pr.image_url || pr.image_front_small_url || "";
              if (name || brand) {
                const label = db === "openfoodfacts" ? "Open Food Facts" : "Open Beauty Facts";
                products.push(normalizeLiveApiProduct({
                  id: (db === "openfoodfacts" ? "off_" : "obf_") + code,
                  name: name,
                  title: name,
                  brand: brand,
                  brandName: brand,
                  ean: code,
                  gtin: code,
                  img: img,
                  image_url: img,
                  price: "",
                  store: label,
                  source: db === "openfoodfacts" ? "off" : "obf",
                  deeplinkOnly: false,
                  wirk: "EAN erkannt (" + label + ")",
                  countries: [cc]
                }));
                break;
              }
            }
          }
        } catch (e) {
          // Fact fetch error
        }
      }
    }

    // C2: Direct Müller Search via Jina reader (CORS allowed for file:// origin: null)
    if (products.length === 0) {
      const muellerCodes = [qClean];
      if (qClean.length === 12) muellerCodes.push("0" + qClean);
      else if (qClean.length === 13 && qClean.startsWith("0")) muellerCodes.push(qClean.slice(1));
      const domains = (cc === "DE") ? ["mueller.de", "mueller.at"] : ["mueller.at", "mueller.de"];

      for (const mCode of muellerCodes) {
        if (products.length > 0) break;
        for (const dom of domains) {
          if (products.length > 0) break;
          try {
            let jinaSignal;
            if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
              jinaSignal = AbortSignal.timeout(3500);
            }
            const mRes = await fetch(`https://r.jina.ai/https://www.${dom}/search/?q=${mCode}`, jinaSignal ? { signal: jinaSignal } : {});
            if (mRes.ok) {
              const mTxt = await mRes.text();
              const parsed = parseMuellerMarkdown(mTxt, mCode);
              if (parsed && parsed.name) {
                products.push(normalizeLiveApiProduct(parsed));
                break;
              }
            }
          } catch (e) {
            // Jina fetch error
          }
        }
      }
    }
  }

  // D: Deep-Link Onlineshop Search Cards (dm, BIPA, Müller)
  const isBipaQ = isBipaBrandQuery(q);
  const isMuellerQ = isMuellerBrandQuery(q);
  const muellerCard = createMuellerCard(q, cc);
  const bipaCard = createBipaCard(q, cc);
  const dmCard = normalizeLiveApiProduct({
    id: "deeplink_" + cc + "_" + q.slice(0, 24),
    name: "Im dm Österreich nach „" + q + "“ suchen",
    brand: "dm Österreich",
    url: (retailer.shopUrl || "https://www.dm.at/search?query=") + encodeURIComponent(q),
    store: "dm Österreich",
    source: "deeplink",
    deeplinkOnly: true,
    retailerLabel: "dm Österreich",
    country: cc,
    countries: [cc],
    wirk: "Deep-Link — Im Onlineshop suchen"
  });

  const deeplinks = [];
  if (cc === "AT") {
    if (isBipaQ) deeplinks.push(bipaCard, dmCard, muellerCard);
    else if (isMuellerQ) deeplinks.push(muellerCard, dmCard, bipaCard);
    else deeplinks.push(dmCard, bipaCard, muellerCard);
  } else if (cc === "CH") {
    deeplinks.push(muellerCard);
  } else if (cc === "DE") {
    if (isMuellerQ) deeplinks.push(muellerCard);
    deeplinks.push(normalizeLiveApiProduct({
      id: "deeplink_" + cc + "_" + q.slice(0, 24),
      name: "Im " + retailer.label + " nach „" + q + "“ suchen",
      brand: retailer.label,
      url: (retailer.shopUrl || "https://www.dm.de/search?query=") + encodeURIComponent(q),
      store: retailer.label,
      source: "deeplink",
      deeplinkOnly: true,
      retailerLabel: retailer.label,
      country: cc,
      countries: [cc],
      wirk: "Deep-Link — Im Onlineshop suchen"
    }));
    if (!isMuellerQ) deeplinks.push(muellerCard);
  } else {
    deeplinks.push(normalizeLiveApiProduct({
      id: "deeplink_" + cc + "_" + q.slice(0, 24),
      name: "Im " + retailer.label + " nach „" + q + "“ suchen",
      brand: retailer.label,
      url: (retailer.shopUrl || "") + encodeURIComponent(q),
      store: retailer.label,
      source: "deeplink",
      deeplinkOnly: true,
      retailerLabel: retailer.label,
      country: cc,
      countries: [cc],
      wirk: "Deep-Link — Im Onlineshop suchen"
    }));
  }

  // Combine: Real products first, then deep-links
  const allCards = [].concat(products, deeplinks);
  window.currentLiveDmResults = allCards;
  window.dmResultsMap = window.dmResultsMap || {};
  allCards.forEach(function (pr) {
    if (pr && pr.id) window.dmResultsMap[pr.id] = pr;
    if (pr && pr.ean) window.dmResultsMap[pr.ean] = pr;
    if (pr && pr.dan) window.dmResultsMap[pr.dan] = pr;
  });
  return allCards;
}

async function searchDmLive(query) {
  const cc = (typeof getProfileCountry === "function" ? getProfileCountry() : "AT") || "AT";
  return searchLiveProducts(query, cc);
}

if (typeof window !== "undefined") {
  window.DM_LIVE_COUNTRIES = DM_LIVE_COUNTRIES;
  window.LIVE_RETAILER_BY_COUNTRY = LIVE_RETAILER_BY_COUNTRY;
  window.getLiveRetailerForCountry = getLiveRetailerForCountry;
  window.getLiveSearchChipLabel = getLiveSearchChipLabel;
  window.getLiveSearchHonesty = getLiveSearchHonesty;
  window.getLiveDmHonesty = getLiveDmHonesty;
  window.liveDmHonestyBadgeHtml = liveDmHonestyBadgeHtml;
  window.formatLivePrice = formatLivePrice;
  window.normalizeLiveApiProduct = normalizeLiveApiProduct;
  window.searchLiveProducts = searchLiveProducts;
  window.searchDmLive = searchDmLive;
  window.MUELLER_BRANDS_RE = MUELLER_BRANDS_RE;
  window.isMuellerBrandQuery = isMuellerBrandQuery;
  window.getMuellerShopUrlForCountry = getMuellerShopUrlForCountry;
  window.createMuellerCard = createMuellerCard;
  window.BIPA_BRANDS_RE = BIPA_BRANDS_RE;
  window.isBipaBrandQuery = isBipaBrandQuery;
  window.getBipaShopUrlForCountry = getBipaShopUrlForCountry;
  window.createBipaCard = createBipaCard;
  window.KNOWN_EAN_REGISTRY = KNOWN_EAN_REGISTRY;
  window.findLocalProductMatch = findLocalProductMatch;
}
