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

function normalizeLiveApiProduct(p) {
  if (!p) return null;
  // Already normalized dm shape
  if (p.id && (p.name || p.brand) && p._liveSource) {
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
    wirk: p.wirk || ((p.price && p.price.formattedValue) ? p.price.formattedValue : (p.price || "")) || source,
    store: p.store || (p.retailerLabel || source),
    ean: ean,
    dan: dan,
    url: url,
    img: p.img || p.image_url || "",
    price: (p.price && p.price.formattedValue) ? p.price.formattedValue : (p.price || ""),
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

async function searchLiveProducts(query, country) {
  const q = String(query || "").trim();
  if (q.length < 2) return [];
  const cc = String(country || (typeof getProfileCountry === "function" ? getProfileCountry() : "AT") || "AT").toUpperCase();
  const retailer = getLiveRetailerForCountry(cc);
  window.lastLiveSearchMeta = { country: cc, retailer: retailer };

  if (window.location.protocol !== "file:") {
    try {
      const res = await fetch(`/api/live-search?query=${encodeURIComponent(q)}&country=${encodeURIComponent(cc)}&pageSize=12`);
      if (res.ok) {
        const data = await res.json();
        window.lastLiveSearchMeta = Object.assign({}, window.lastLiveSearchMeta, data.meta || {});
        const raw = (data && data.products) ? data.products : [];
        let prods = raw.map(function (row) {
          if (row.source === "dm_mcp" || (!row.source && cc === "DE")) {
            return typeof normalizeDmProduct === "function" ? normalizeDmProduct(row) : normalizeLiveApiProduct(row);
          }
          return normalizeLiveApiProduct(row);
        }).filter(Boolean);
        if (isBipaBrandQuery(q) && !prods.some(function(p){ return p.url && p.url.includes("bipa"); })) {
          prods.unshift(createBipaCard(q, cc));
        } else if (isMuellerBrandQuery(q) && !prods.some(function(p){ return p.url && p.url.includes("mueller"); })) {
          prods.unshift(createMuellerCard(q, cc));
        } else if (cc === "AT") {
          if (!prods.some(function(p){ return p.url && p.url.includes("bipa"); })) {
            prods.splice(1, 0, createBipaCard(q, cc));
          }
          if (!prods.some(function(p){ return p.url && p.url.includes("mueller"); })) {
            prods.splice(2, 0, createMuellerCard(q, cc));
          }
        }
        window.currentLiveDmResults = prods;
        window.dmResultsMap = window.dmResultsMap || {};
        prods.forEach(function (pr) {
          if (pr.id) window.dmResultsMap[pr.id] = pr;
          if (pr.ean) window.dmResultsMap[pr.ean] = pr;
          if (pr.dan) window.dmResultsMap[pr.dan] = pr;
        });
        return prods;
      }
    } catch (e) {
      console.warn("[Live-search] API fehlgeschlagen:", e);
    }
  }

  // file:// or API miss: DE can still use pilot; others return synthetic deeplink card
  if (cc === "DE" && typeof searchDmLive === "function" && searchLiveProducts._viaDm !== true) {
    // fall through to classic pilot inside searchDmLive wrapper
  }
  const cards = [];
  const isMuellerQ = isMuellerBrandQuery(q);
  const isBipaQ = isBipaBrandQuery(q);
  const muellerCard = createMuellerCard(q, cc);
  const bipaCard = createBipaCard(q, cc);

  if (cc === "AT") {
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
      wirk: "Deep-Link — Verfügbarkeit im Shop prüfen"
    });
    if (isBipaQ) {
      cards.push(bipaCard, dmCard, muellerCard);
    } else if (isMuellerQ) {
      cards.push(muellerCard, dmCard, bipaCard);
    } else {
      cards.push(dmCard, bipaCard, muellerCard);
    }
  } else if (cc === "CH") {
    cards.push(muellerCard);
  } else if (cc === "DE") {
    if (isMuellerQ) {
      cards.push(muellerCard);
    }
    if (window.DM_PILOT_CACHE && window.DM_PILOT_CACHE.length) {
      const qLower = q.toLowerCase();
      const hits = window.DM_PILOT_CACHE.filter(function (r) {
        return (r.name && r.name.toLowerCase().includes(qLower)) ||
          (r.brand && r.brand.toLowerCase().includes(qLower)) ||
          (r.ean && r.ean.includes(q)) ||
          (r.dan && r.dan.includes(q));
      });
      if (hits.length && typeof normalizeDmPilotRow === "function") {
        cards.push(...hits.slice(0, 12).map(normalizeDmPilotRow));
      }
    }
    if (!cards.length || (cards.length === 1 && isMuellerQ)) {
      cards.push(normalizeLiveApiProduct({
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
        wirk: "Deep-Link — Verfügbarkeit im Shop prüfen"
      }));
    }
    if (!isMuellerQ && !cards.some(function(x) { return x.url && x.url.includes("mueller"); })) {
      cards.push(muellerCard);
    }
  } else {
    // Synthetic deep-link card for other countries
    const link = (retailer.shopUrl || "") + encodeURIComponent(q);
    cards.push(normalizeLiveApiProduct({
      id: "deeplink_" + cc + "_" + q.slice(0, 24),
      name: "Im " + retailer.label + " nach „" + q + "“ suchen",
      brand: retailer.label,
      url: link,
      store: retailer.label,
      source: "deeplink",
      deeplinkOnly: true,
      retailerLabel: retailer.label,
      country: cc,
      countries: [cc],
      wirk: "Deep-Link — Verfügbarkeit im Shop prüfen"
    }));
  }

  window.currentLiveDmResults = cards;
  window.dmResultsMap = window.dmResultsMap || {};
  cards.forEach(function (pr) {
    if (pr && pr.id) window.dmResultsMap[pr.id] = pr;
    if (pr && pr.ean) window.dmResultsMap[pr.ean] = pr;
    if (pr && pr.dan) window.dmResultsMap[pr.dan] = pr;
  });
  return cards;
}

// Back-compat: searchDmLive becomes country-aware
async function searchDmLive(query) {
  return searchLiveProducts(query, typeof getProfileCountry === "function" ? getProfileCountry() : "DE");
}

if (typeof window !== "undefined") {
  window.DM_LIVE_COUNTRIES = DM_LIVE_COUNTRIES;
  window.LIVE_RETAILER_BY_COUNTRY = LIVE_RETAILER_BY_COUNTRY;
  window.getLiveRetailerForCountry = getLiveRetailerForCountry;
  window.getLiveSearchChipLabel = getLiveSearchChipLabel;
  window.getLiveSearchHonesty = getLiveSearchHonesty;
  window.getLiveDmHonesty = getLiveDmHonesty;
  window.liveDmHonestyBadgeHtml = liveDmHonestyBadgeHtml;
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
}
