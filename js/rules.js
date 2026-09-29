// ==========================================
// Rules, Conflicts & Safety Assessment Module
// Specs 2026-09-08: verdict-glossar, constraints-v1,
// scan-ohne-schrank, reiz-budget, arzt-thema-scan
// INCI: nur Hooks auf klassen/kat/ff — CosIng-Parser STUB
// ==========================================

const VERDICT_DISCLAIMER =
  "Keine Therapie — dein Ratgeber für Einkauf & Layering.";

if (typeof window !== "undefined") {
  window.APP_DISCLAIMER = VERDICT_DISCLAIMER;
}

const OUTCOME_RANK = { passt: 0, unbekannt: 1, eher_nicht: 2, konflikt: 3 };

const TAG_ALIASES = {
  sensibel: ["sensibel", "sensible"],
  barrier: ["barriere-fragil", "barrier", "barriere"],
  "akne-prone": ["akne-prone", "akne prone", "akne", "akne-neigung", "akne neigung"],
  "arzt-thema": ["arzt-thema", "arzt thema", "zystisch"],
  begleitpflege: ["rx-begleitpflege", "begleitpflege", "rx"],
  duftstofffrei: ["parfümfrei", "parfumfrei", "duftstofffrei"],
  pref_nc: ["nc-preference", "pref_nc", "nc-pref"],
  pref_cf: ["cruelty-free", "pref_cf", "cruelty_free"],
  trocken: ["trocken"],
  oelig: ["ölig", "oelig"],
  misch: ["mischhaut", "misch"],
  unklar: ["unklar", "ausgeglichen", "eigene routine"],
  "pih-prone": ["pih-prone", "pih prone", "pih", "hyperpigmentierung", "pickelmale", "post-inflammatory hyperpigmentation", "melasma"],
  "skin-of-color": ["skin-of-color", "skin of color", "soc", "fitzpatrick", "fototyp", "phototyp"],
  "zero-white-cast": ["zero-white-cast", "zero white cast", "zero_white_cast_prio", "no-white-cast", "kein weisseln", "kein weißeln"],
  "iron-oxide-prio": ["iron-oxide-prio", "iron_oxide_prio", "eisenoxid-schutz", "eisenoxide", "visible-light-prio"]
};

const SOFT_PREF_LABELS = {
  duftstofffrei: "Parfümfrei",
  pref_nc: "NC-Preference"
};

// --- Tag / Profil Helpers ---

function normalizeTagKey(t) {
  return String(t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function collectUserTags() {
  const collect = [];
  if (typeof appState !== "undefined" && appState && Array.isArray(appState.tags)) {
    collect.push(...appState.tags);
  }
  try {
    const p = typeof getActiveProfile === "function" ? getActiveProfile() : null;
    if (p && Array.isArray(p.tags)) collect.push(...p.tags);
  } catch (e) { /* Profil optional */ }
  return collect;
}

function hasTag(/* ...keys */) {
  const keys = Array.prototype.slice.call(arguments);
  const bag = collectUserTags().map(normalizeTagKey);
  return keys.some(function (key) {
    const aliases = TAG_ALIASES[key] || [key];
    return aliases.some(function (a) {
      const na = normalizeTagKey(a);
      return bag.some(function (b) {
        return b === na || b.indexOf(na) !== -1 || na.indexOf(b) !== -1;
      });
    });
  });
}

function getActiveProfileCategory() {
  try {
    const p = typeof getActiveProfile === "function" ? getActiveProfile() : null;
    if (p && p.category) return p.category;
  } catch (e) { /* ignore */ }
  if (typeof appState !== "undefined" && appState) {
    if (appState.category) return appState.category;
    if (appState.profile) return appState.profile;
  }
  return "adult";
}

function isBabyProfile() {
  return getActiveProfileCategory() === "baby";
}

function isChildProfile() {
  return getActiveProfileCategory() === "child";
}

function isTeenProfile() {
  return getActiveProfileCategory() === "teen";
}

function hasArztThema() {
  return hasTag("arzt-thema");
}

/** Soft-Prefs: sensibel→Parfümfrei, akne-prone→NC-Preference (abwählbar). */
function applySoftPrefsToTagList(tags) {
  const list = Array.isArray(tags) ? tags.slice() : [];
  const norm = list.map(normalizeTagKey);
  const hasSensibel = norm.some(function (t) {
    return t.indexOf("sensibel") !== -1;
  });
  const hasAkne = norm.some(function (t) {
    return t.indexOf("akne") !== -1;
  });
  const hasDuft = norm.some(function (t) {
    return t.indexOf("parfumfrei") !== -1 || t.indexOf("duftstofffrei") !== -1;
  });
  const hasNc = norm.some(function (t) {
    return t.indexOf("nc-preference") !== -1 || t.indexOf("pref_nc") !== -1;
  });
  if (hasSensibel && !hasDuft) list.push(SOFT_PREF_LABELS.duftstofffrei);
  if (hasAkne && !hasNc) list.push(SOFT_PREF_LABELS.pref_nc);
  return list;
}

function removeSoftPrefTag(label) {
  if (typeof appState === "undefined" || !appState) return;
  const target = normalizeTagKey(label);
  appState.tags = (appState.tags || []).filter(function (t) {
    return normalizeTagKey(t) !== target;
  });
  try {
    const p = typeof getActiveProfile === "function" ? getActiveProfile() : null;
    if (p && Array.isArray(p.tags)) {
      p.tags = p.tags.filter(function (t) {
        return normalizeTagKey(t) !== target;
      });
    }
  } catch (e) { /* ignore */ }
  if (typeof saveState === "function") saveState();
  if (typeof showToast === "function") {
    showToast("Soft-Preference entfernt: <strong>" + label + "</strong>");
  }
}

// --- Verdict helpers (Glossar) ---

function normalizeOutcome(x){return Object.hasOwn(KokoroEvidence.ranks,x)?x:'unbekannt';}

function worstWins(...outcomes){return outcomes.length?outcomes.map(normalizeOutcome).reduce((a,b)=>KokoroEvidence.ranks[a]>=KokoroEvidence.ranks[b]?a:b):'unbekannt';}

function formatVerdictOneLook(x,reason){return outcomeTitle(x)+' — '+reason;}

function outcomeTitle(x){return KokoroEvidence.labels[normalizeOutcome(x)];}

/** Short Ampel header for Schrank routine card (collapsed default). */
function routineAmpelTitle(x){return outcomeTitle(x);}

function statusFromOutcome(x){return evidenceStatus(normalizeOutcome(x));}

function makeDim(outcome, reason, code) {
  return {
    outcome: outcome == null ? null : normalizeOutcome(outcome),
    reason: reason || "",
    code: code || null
  };
}

// --- Schrank / Reiz-Budget ---

function getCabinetProductIds() {
  if (typeof appState === "undefined" || !appState) return [];
  var cat = typeof getActiveProfileCategory === "function" ? getActiveProfileCategory() : (appState.profile || "adult");
  if (cat === "teen") {
    var t = appState.teen || {};
    return [].concat(t.reiniger || [], t.active || [], t.creme || [], t.spf || []);
  }
  if (cat === "child") {
    var c = appState.child || {};
    return [].concat(c.reiniger || [], c.creme || [], c.spf || [], c.haar || []);
  }
  if (cat === "baby") {
    var b = appState.baby || {};
    return [].concat(b.reiniger || [], b.creme || [], b.windel || [], b.spf || []);
  }
  var pm =
    typeof getActivePMList === "function"
      ? getActivePMList()
      : [].concat(appState.pm_a || [], appState.pm_b || [], appState.pm_c || []);
  return [].concat(appState.am || [], pm || []);
}

/** Layering-relevante Produkte (Wasser-Platzhalter zählen nicht). */
function getLayeringProductIds() {
  return getCabinetProductIds().filter(function (id) {
    if (!id || id === "wasser" || id === "water") return false;
    var p = typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(id) : (typeof DB !== "undefined" ? DB[id] : null);
    if (!p) return !!id;
    if (p.placeholder || p.wasser) return false;
    if (String(p.name || "").toLowerCase() === "wasser") return false;
    return true;
  });
}

function isCabinetEmptyForLayering() {
  return getLayeringProductIds().length === 0;
}

/** Lightweight Reiz-Gewicht aus vorhandenen klassen/kat (kein CosIng). */
function ensureClassesForRules(p) {
  if (!p || typeof p !== "object") return p;
  if (typeof enrichProductClasses === "function") {
    enrichProductClasses(p);
  } else if (Array.isArray(p.klassen)) {
    // Fallback-Remap falls catalog.js Helper noch nicht geladen
    var next = [];
    p.klassen.forEach(function (k) {
      if (k === "retinoid") {
        next.push(p.rx || p.schiene === "arzneimittel" ? "retinoid_rx" : "retinoid_cos");
      } else if (k) {
        next.push(k);
      }
    });
    p.klassen = next;
  }
  return p;
}

function productHasClass(p, klass) {
  if (!p) return false;
  ensureClassesForRules(p);
  if (!Array.isArray(p.klassen)) return false;
  if (p.klassen.indexOf(klass) !== -1) return true;
  // Legacy-Alias
  if ((klass === "retinoid_cos" || klass === "retinoid_rx") && p.klassen.indexOf("retinoid") !== -1) {
    return klass === "retinoid_rx" ? !!(p.rx || p.schiene === "arzneimittel") : !(p.rx || p.schiene === "arzneimittel");
  }
  return false;
}

function isRetinoidProduct(p) {
  if (!p) return false;
  return productHasClass(p, "retinoid_rx") || productHasClass(p, "retinoid_cos");
}

function isRxRetinoid(p) {
  if (!p) return false;
  return productHasClass(p, "retinoid_rx") || (!!p.rx && isRetinoidProduct(p));
}

function isCosmeticRetinoid(p) {
  if (!p) return false;
  // Prefer class over sticky rx flag (enrich may set rx on mixed blobs)
  if (productHasClass(p, "retinoid_rx")) return false;
  return productHasClass(p, "retinoid_cos");
}

function isBpoProduct(p) {
  if (!p) return false;
  return productHasClass(p, "bpo");
}

function isAntibioticProduct(p) {
  if (!p) return false;
  return productHasClass(p, "ab_top");
}

function isAcidProduct(p) {
  if (!p) return false;
  return productHasClass(p, "aha") || productHasClass(p, "bha");
}

function isAhaProduct(p) {
  return productHasClass(p, "aha");
}

function isBhaProduct(p) {
  return productHasClass(p, "bha");
}

function isAscorbicProduct(p) {
  return productHasClass(p, "ascorbic");
}

function isAzelaicProduct(p) {
  return productHasClass(p, "azelaic");
}

function isTretinoinProduct(p) {
  if (!p) return false;
  if (productHasClass(p, "retinoid_rx_tretinoin")) return true;
  var blob = ((p.name || "") + " " + (p.wirk || "")).toLowerCase();
  return (productHasClass(p, "retinoid_rx") || !!p.rx) && blob.indexOf("tretinoin") !== -1;
}

function isAdapalenProduct(p) {
  if (!p) return false;
  var blob = ((p.name || "") + " " + (p.wirk || "")).toLowerCase();
  return blob.indexOf("adapalen") !== -1 || blob.indexOf("adapalene") !== -1;
}

function reizWeightForProduct(p) {
  if (!p) return 0;
  var kl = p.klassen || [];
  var w = 0;
  var heavy = ["retinoid_rx", "retinoid_cos", "aha", "bha", "bpo", "physical_scrub"];
  var mid = ["azelaic", "ascorbic", "ab_top"];
  heavy.forEach(function (k) {
    if (kl.indexOf(k) !== -1) w = Math.max(w, 2);
  });
  mid.forEach(function (k) {
    if (kl.indexOf(k) !== -1) w = Math.max(w, 1);
  });
  if (p.rx && (kl.indexOf("retinoid_rx") !== -1 || kl.indexOf("bpo") !== -1)) w = Math.max(w, 2);
  if (p.kat === "active" || p.kat === "spot") w = Math.max(w, 1);
  return w;
}

// ==========================================
// PAIR_MATRIX: Deklarative Paartabelle
// Konfliktmatrix v0.2 — Prio:
// not_cosmetic > inactivate > same_class > skip_stack > alternate_days > split > resistance > begleit_barrier > uv / bleach
// ==========================================

// Pair rules are defined in evidence-engine.js; no parallel legacy matrix.


function checkPairRules(candidate,products,context){const r=KokoroEvidence.assess({products:[candidate,...(products||[])],profile:evidenceProfile(),coApplication:()=>({together:!context?.dayNightSplit&&context?.slot!=='am_pm_split'})});const f=r.findings.find(x=>x.severity==='konflikt'||x.severity==='eher_nicht');return f?{...f,outcome:f.severity,code:f.id,prio:10}:null;}

/**
 * Nacht-Stack: ≥ Schwelle aus zwei Reizklassen → Konflikt (skip_stack).
 * Adapalen×BPO = Reiz/skip_stack, NIEMALS inactivate.
 */
function assessNightReiz(ids,candidate){const products=(ids||[]).map(evidenceResolve).filter(Boolean);if(candidate)products.push(candidate);const r=KokoroEvidence.assess({products,profile:evidenceProfile()});return makeDim(r.verdict,evidenceReason(r),'evidence');}

/**
 * Tageslast AM+PM: BPO AM + Retinoid PM → eher nicht (Default);
 * bei begleitpflege+barrier eher Konflikt-Ton.
 */
function assessDayReiz(am,pm,candidate,slot){const r=evidenceAssess([...(am||[]),...(pm||[])],candidate,slot);return makeDim(r.verdict,evidenceReason(r),'evidence');}

// --- INCI lightweight hooks (STUB: kein CosIng-Parser) ---

function inciHooksFromProduct(p) {
  // Nur vorhandene Felder: klassen, kat, ff, nc, cf — kein Roh-INCI-Parsing in diesem Pass
  return {
    klassen: (p && p.klassen) || [],
    kat: (p && p.kat) || null,
    ff: p ? p.ff : null,
    nc: p ? p.nc : null,
    cf: p ? p.cf : null,
    stub: true,
    note: "Vollständiger CosIng-/INCI-Parser bewusst stub — Engine nutzt Katalog-Flags."
  };
}

// --- Dimensionen ---

function isCosmeticActiveUpsell(candidate) {
  if (!candidate) return false;
  if (candidate.kat === "reiniger" || candidate.kat === "creme" || candidate.kat === "spf") return false;
  if (candidate.schiene === "support") return false;
  if (candidate.rx || candidate.schiene === "arzneimittel") return false;
  var kl = candidate.klassen || [];
  var activeKl = ["retinoid_cos", "aha", "bha", "azelaic", "niacinamide", "barrier_stress"];
  if (kl.some(function (k) {
    return activeKl.indexOf(k) !== -1;
  }))
    return true;
  if (
    (candidate.kat === "serum" || candidate.kat === "active" || candidate.kat === "spot") &&
    candidate.schiene === "kosmetik"
  )
    return true;
  return false;
}

function filterAltsForArztThema(alts) {
  if (!hasArztThema() || !Array.isArray(alts) || !alts.length) return alts || [];
  var supportHints =
    /reinig|wasch|creme|feucht|barriere|panthenol|hydrator|spf|lsf|sonnen|cleanser|support|bambo|mixa|balea med/i;
  var activeHints =
    /serum|retinol|retinoid|bha|aha|peeling|azelain|niacinamid|salicyl|glycol|adapalen|active/i;
  return alts.filter(function (a) {
    var blob = (a.name || "") + " " + (a.price || "") + " " + (a.store || "");
    if (activeHints.test(blob) && !supportHints.test(blob)) return false;
    return supportHints.test(blob) || !activeHints.test(blob);
  });
}

function assessZuDir(candidate){const r=KokoroEvidence.assess({products:[candidate],profile:evidenceProfile()});return makeDim(r.verdict,evidenceReason(r),'profile');}

function assessZumSchrank(candidate){const r=evidenceResult(candidate,appState.tab);return makeDim(r.verdict,evidenceReason(r),'evidence');}

function assessSlot(candidate, emptyCabinet) {
  var kat = (candidate && candidate.kat) || "";
  var slotHint =
    kat === "spf"
      ? "Eher SPF, typisch morgens."
      : kat === "reiniger"
        ? "Eher Reiniger, typisch morgens & abends."
        : kat === "creme"
          ? "Eher Creme/Barriere, typisch AM/PM."
          : kat === "serum" || kat === "active" || kat === "spot"
            ? "Eher Serum/Treat — Slot je nach Wirkstoff (oft abends)."
            : "Slot-Hinweis soft — erst Vorschlag.";

  if (emptyCabinet) {
    return makeDim(
      "passt",
      slotHint + " Kein Pflichtplatz, bis der Schrank steht.",
      "slot_soft"
    );
  }

  var currentPM = typeof getActivePMList === "function" ? getActivePMList() : [];
  var pmHasRetinoid = currentPM.some(function (id) {
    return isRetinoidProduct(typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(id) : (typeof DB !== "undefined" ? DB[id] : null));
  });
  if (isAcidProduct(candidate) && pmHasRetinoid) {
    return makeDim(
      "eher_nicht",
      "Nur an freien Abenden (ohne Retinoid-Nacht).",
      "slot_alternate"
    );
  }
  if (candidate && candidate.kat === "spf") {
    return makeDim("passt", "Schritt morgens (LSF).", "slot_am");
  }
  return makeDim("passt", slotHint, "slot_ok");
}

function evaluateCandidate(candidate){const r=evidenceResult(candidate,appState.tab);const dim=makeDim(r.verdict,evidenceReason(r),'evidence');return {evidence:r,status:evidenceStatus(r.verdict),verdict:r.verdict,title:r.title,oneLook:evidenceReason(r),reason:evidenceReason(r),truth:r.scope,where:'Anwendung nach Produktangabe',disclaimer:r.scope,alts:[],dims:{zuDir:assessZuDir(candidate),zumSchrank:dim,slot:makeDim('unbekannt','Anwendung und Häufigkeit nach Produktangabe prüfen.','slot')},emptyCabinet:isCabinetEmptyForLayering(),inciStub:true};}


/** Alle Produkte im Profil-Schrank (AM + alle PM-Modi), ohne Wasser-Platzhalter. */
/** Resolve a cabinet product from DB / custom / Teen / Baby catalogs. */
function resolveCabinetProduct(id) {
  if (!id) return null;
  if (typeof DB !== "undefined" && DB && DB[id]) return DB[id];
  if (typeof appState !== "undefined" && appState && appState.customProducts && appState.customProducts[id]) {
    return appState.customProducts[id];
  }
  if (typeof TEEN_DB !== "undefined" && TEEN_DB && TEEN_DB[id]) return TEEN_DB[id];
  if (typeof BABY_DB !== "undefined" && BABY_DB && BABY_DB[id]) return BABY_DB[id];
  if (typeof window !== "undefined" && window.dmResultsMap && window.dmResultsMap[id]) return window.dmResultsMap[id];
  if (typeof window !== "undefined" && Array.isArray(window.currentLiveDmResults)) {
    var found = window.currentLiveDmResults.find(function (x) { return x && (x.id === id || x.ean === id || x.dan === id); });
    if (found) return found;
  }
  return null;
}

function getFullCabinetProductIds() {
  if (typeof appState === "undefined" || !appState) return [];
  var cat = typeof getActiveProfileCategory === "function" ? getActiveProfileCategory() : (appState.profile || "adult");
  var ids = [];
  if (cat === "teen") {
    var t = appState.teen || {};
    ids = [].concat(t.reiniger || [], t.active || [], t.creme || [], t.spf || []);
  } else if (cat === "child") {
    var c = appState.child || {};
    ids = [].concat(c.reiniger || [], c.creme || [], c.spf || [], c.haar || []);
  } else if (cat === "baby") {
    var b = appState.baby || {};
    ids = [].concat(b.reiniger || [], b.creme || [], b.windel || [], b.spf || []);
  } else if (appState.useSkinCycling) {
    ids = [].concat(
      appState.am || [],
      appState.pm_a || [],
      appState.pm_b || [],
      appState.pm_c || []
    );
  } else {
    ids = [].concat(
      appState.am || [],
      appState.pm_a || []
    );
  }
  var seen = {};
  var out = [];
  ids.forEach(function (id) {
    if (!id || id === "wasser" || id === "water" || seen[id]) return;
    var p = resolveCabinetProduct(id);
    if (p && (p.placeholder || p.wasser || String(p.name || "").toLowerCase() === "wasser")) return;
    seen[id] = true;
    out.push(id);
  });
  return out;
}


/** True if catalog says not fragrance-free, or basis text indicates perfume. */
function productLooksPerfumed(p) {
  if (!p) return false;
  if (p.ff === true) return false;
  if (p.ff === false) return true;
  var basis = String(p.ff_basis || p.fragrance_basis || "").toLowerCase();
  var notes = String(p.notes || "").toLowerCase();
  var nameBlob = (String(p.name || "") + " " + String(p.brand || "") + " " + String(p.wirk || "")).toLowerCase();
  var blob = basis + " " + notes;
  var freeHint = /parf[uü]mfrei|parfumfrei|fragrance[\s-]?free|unparf[uü]miert|ohne duft|ohne parf|duftstofffrei|0%\s*parf|ff=yes|ff:true/;
  var perfumeHint = /parf[uü]m(?!frei)|fragrance|perfume|duftstoff|duft\/|\bduft\b|ätherisch|etherisch|essential oil|essential oils|leichten? (frischen )?duft/;
  if (freeHint.test(blob) && !perfumeHint.test(basis)) return false;
  if (perfumeHint.test(basis)) return true;
  if (/oft mit duft|nicht parf[uü]mfrei|ff nur parf[uü]mfrei|ff=no|ff:false|parf[uü]miert/.test(notes)) return true;
  // Name/Marke: wenn ff unbekannt, aber klar Parfüm im Namen (Baby-Sicherheit)
  if (freeHint.test(nameBlob)) return false;
  if (perfumeHint.test(nameBlob)) return true;
  return false;
}

/**
 * Profile×product constraints for ANY cabinet (Baby/Child/Teen/Adult).
 * Class-general — no demo ID hardcodes. Worst-wins per product.
 */
function assessCabinetProfileConstraints(products,opts){const r=KokoroEvidence.assess({products,profile:{...evidenceProfile(),category:opts?.category||evidenceProfile().category},coApplication:()=>({together:false})});return {hits:r.findings.map(f=>({...f,outcome:f.severity,code:f.id})),flagged:evidencePrognosis(r).flagged,eduNotes:[]};}

function mergeCabinetFlagged(baseFlagged, extraFlagged) {
  var out = {};
  Object.keys(baseFlagged || {}).forEach(function (id) {
    out[id] = baseFlagged[id];
  });
  Object.keys(extraFlagged || {}).forEach(function (id) {
    var prev = out[id];
    var next = extraFlagged[id];
    if (!prev || (OUTCOME_RANK[next.outcome] || 0) > (OUTCOME_RANK[prev.outcome] || 0)) {
      out[id] = next;
    }
  });
  return out;
}

/** Category Schrank prognosis (Baby/Child/Teen) — profile constraints + intra-cabinet matrix. */
function calculateCategoryCabinetPrognosis(products,category){return evidencePrognosis(KokoroEvidence.assess({products,profile:{...evidenceProfile(),category}}));}


function getProductCoApplicationInfo(aId, bId) {
  if (!aId || !bId) return { together: false, cyclingSeparated: false, dayNightSplit: false, slot: null };
  if (typeof appState === "undefined" || !appState) {
    return { together: true, cyclingSeparated: false, dayNightSplit: false, slot: null };
  }

  var am = Array.isArray(appState.am) ? appState.am : [];
  var inAmA = am.indexOf(aId) !== -1;
  var inAmB = am.indexOf(bId) !== -1;
  if (inAmA && inAmB) {
    return { together: true, cyclingSeparated: false, dayNightSplit: false, slot: "am" };
  }

  var useCycling = !!appState.useSkinCycling;

  if (useCycling) {
    var pmA = Array.isArray(appState.pm_a) ? appState.pm_a : [];
    var pmB = Array.isArray(appState.pm_b) ? appState.pm_b : [];
    var pmC = Array.isArray(appState.pm_c) ? appState.pm_c : [];

    var inPmA_A = pmA.indexOf(aId) !== -1;
    var inPmA_B = pmA.indexOf(bId) !== -1;
    if (inPmA_A && inPmA_B) return { together: true, cyclingSeparated: false, dayNightSplit: false, slot: "pm_a" };

    var inPmB_A = pmB.indexOf(aId) !== -1;
    var inPmB_B = pmB.indexOf(bId) !== -1;
    if (inPmB_A && inPmB_B) return { together: true, cyclingSeparated: false, dayNightSplit: false, slot: "pm_b" };

    var inPmC_A = pmC.indexOf(aId) !== -1;
    var inPmC_B = pmC.indexOf(bId) !== -1;
    if (inPmC_A && inPmC_B) return { together: true, cyclingSeparated: false, dayNightSplit: false, slot: "pm_c" };

    // Check if separated into different cycling modes:
    var anyPmA = inPmA_A || inPmB_A || inPmC_A;
    var anyPmB = inPmA_B || inPmB_B || inPmC_B;
    if (anyPmA && anyPmB) {
      // Both are in evening routines, but in different modes!
      return { together: false, cyclingSeparated: true, dayNightSplit: false, slot: "cycling_split" };
    }
    if ((inAmA && anyPmB) || (inAmB && anyPmA)) {
      return { together: false, cyclingSeparated: false, dayNightSplit: true, slot: "am_pm_split" };
    }
    return { together: false, cyclingSeparated: false, dayNightSplit: false, slot: null };
  } else {
    // Non-cycling adult cabinet: PM list is pm_a (or getActivePMList)
    var pm = (typeof getActivePMList === "function" ? getActivePMList() : (Array.isArray(appState.pm_a) ? appState.pm_a : []));
    var inPmA = pm.indexOf(aId) !== -1;
    var inPmB = pm.indexOf(bId) !== -1;
    if (inPmA && inPmB) return { together: true, cyclingSeparated: false, dayNightSplit: false, slot: "pm" };

    if ((inAmA && inPmB) || (inAmB && inPmA)) {
      return { together: false, cyclingSeparated: false, dayNightSplit: true, slot: "am_pm_split" };
    }
    return { together: false, cyclingSeparated: false, dayNightSplit: false, slot: null };
  }
}
window.getProductCoApplicationInfo = getProductCoApplicationInfo;

/**
 * Intra-Schrank Konfliktpass: jedes Paar gegen PAIR_MATRIX.
 * Wenn Skin Cycling aktiv ist und Wirkstoffe auf getrennte Modi verteilt sind,
 * entsteht kein Schrank-Konflikt (kein Reiz-Stacking am selben Abend).
 * Worst-wins Aggregation.
 */
function assessCabinetConflicts(products){const r=KokoroEvidence.assess({products,profile:evidenceProfile(),coApplication:getProductCoApplicationInfo});return {hits:r.findings.map(f=>({...f,outcome:f.severity,code:f.id})),flagged:evidencePrognosis(r).flagged};}

function cabinetConflictOneLook(hit) {
  if (!hit) return "";
  var reason = hit.reason || "";
  // Kurz & sichtbar für Schrank-Banner
  if (hit.code === "same_class") {
    if (/Retinoid/i.test(reason) || /Retinol/i.test(reason)) {
      reason =
        "Zwei Retinoide im Schrank (mehr Reiz ohne Zusatznutzen)";
    } else if (/AHA/i.test(reason)) {
      reason = "mehrere AHA-Peelings derselben Wirkstoffklasse im Schrank";
    } else if (/BHA/i.test(reason)) {
      reason = "mehrere BHA-Produkte derselben Wirkstoffklasse im Schrank";
    } else {
      reason = "gleiche Wirkstoffklasse mehrfach im Schrank (mehr Reiz ohne Zusatznutzen)";
    }
  } else if (hit.code === "alternate_days") {
    reason = "im Wechsel — nicht am selben Abend schichten";
  }
  return formatVerdictOneLook(hit.outcome, reason);
}


function calculatePrognosis(){return evidencePrognosis(evidenceResult());}


/**
 * Gegenprüfung eines Produkts (insb. aus Live-Katalog / EAN / Schrank) gegen Hauttyp und Routine.
 * Analysiert:
 * 1. Hauttyp-Fit (aktives Profil, Subtitel z. B. "Akne & Barriere", Tags).
 * 2. Routine-Fit (Wirkstoff-Kollisionen gegen andere Produkte der Morgen-/Abend-Routine).
 * 3. Transparenz über fehlende Händlerdaten (Komedogenität, Duftstoffe, Cruelty-Free).
 */
function evaluateProductCompatibility(productOrId,tab){const p=typeof productOrId==='object'?productOrId:evidenceResolve(productOrId);const r=evidenceResult(p,tab||appState.tab);return {evidence:r,status:evidenceStatus(r.verdict),verdict:r.verdict,title:r.title,skinTypeFit:{profileName:getActiveProfile()?.name||'Profil',skinSub:'Persönlicher Prüfkontext',category:evidenceProfile().category,points:[escapeHtml(r.scope)]},routineFit:{tab,points:r.findings.map(f=>escapeHtml(f.reason))},missingData:{hasMissing:!!r.missing.length,isLive:!!p?._liveSource,list:r.missing.map(escapeHtml)},comedogenicity:null,product:p};}


// --- Spec quiz-tags-soc-pih: Schnell-Concerns + sichtbares Reiz-Budget ---

var CONCERN_QUICK_TAGS = [
  { id: "skin-of-color", label: "Skin-of-Color", hint: "Mehr Melanin / Phototyp IV-VI (Einkaufsfilter)" },
  { id: "pih-prone", label: "PIH-prone", hint: "Neigung zu dunklen Pickelmalen" },
  { id: "akne-prone", label: "Akne-Neigung", hint: "Unreinheiten — ohne Arzt-Therapie" },
  { id: "barrier", label: "Barriere-fragil", hint: "Leicht gereizt / spannt" },
  { id: "arzt-thema", label: "Arzt-Thema", hint: "Rx / dermatologische Behandlung" }
];

function concernLabelForId(id) {
  for (var i = 0; i < CONCERN_QUICK_TAGS.length; i++) {
    if (CONCERN_QUICK_TAGS[i].id === id) return CONCERN_QUICK_TAGS[i].label;
  }
  return id;
}

function toggleConcernTag(id) {
  if (typeof appState === "undefined" || !appState) return;
  if (!Array.isArray(appState.tags)) appState.tags = [];
  var label = concernLabelForId(id);
  var on = hasTag(id);
  if (on) {
    appState.tags = appState.tags.filter(function (t) {
      var n = normalizeTagKey(t);
      var aliases = (TAG_ALIASES[id] || [id]).map(normalizeTagKey);
      aliases.push(normalizeTagKey(label));
      if (id === "arzt-thema") aliases.push(normalizeTagKey("Rx-Begleitpflege"));
      return !aliases.some(function (a) {
        return n === a || n.indexOf(a) !== -1;
      });
    });
  } else {
    if (appState.tags.indexOf(label) === -1) appState.tags.push(label);
    if (id === "arzt-thema" && appState.tags.indexOf("Rx-Begleitpflege") === -1) {
      appState.tags.push("Rx-Begleitpflege");
    }
  }
  if (typeof applySoftPrefsToTagList === "function") {
    appState.tags = applySoftPrefsToTagList(appState.tags);
  }
  if (typeof syncActiveProfileFromWorkingState === "function") syncActiveProfileFromWorkingState();
  if (typeof saveState === "function") saveState();
  if (typeof renderCurrentScreen === "function") renderCurrentScreen();
  else if (typeof renderMain === "function") renderMain(false);
}

function renderConcernQuickPanelHtml() {
  var chips = CONCERN_QUICK_TAGS.map(function (c) {
    var on = hasTag(c.id);
    return '<button type="button" class="start-pill-btn concern-chip ' + (on ? "active" : "") +
      '" title="' + c.hint + '" onclick="toggleConcernTag(\'' + c.id + '\')" style="font-size:0.78rem">' +
      (on ? "✓ " : "") + c.label + "</button>";
  }).join("");
  return '<p class="start-acc-hint">An/Aus — steuert Scan &amp; Schrank (keine Diagnose).</p>' +
    '<div class="start-pills-row" style="gap:6px;flex-wrap:wrap">' + chips + "</div>";
}

/** Full card (legacy / non-accordion callers). */
function renderConcernQuickHtml() {
  return '<div class="start-profile-card" style="margin-bottom:0.75rem">' +
    '<div class="start-profile-head"><span class="start-profile-label">3. Concerns (Einkauf — keine Diagnose)</span></div>' +
    renderConcernQuickPanelHtml() + "</div>";
}

function getReizBudgetSummary(){const r=evidenceResult();return {level:r.verdict==='konflikt'?'hot':r.verdict==='eher_nicht'?'warn':'unknown',title:'Kombinationshinweise',label:r.title,tip:r.scope,nightWeight:null,dayWeight:null};}

function renderReizBudgetCardHtml(){return '';}

function renderReizBudgetInlineHtml(){return '';}

function cabinetHasIronOxideSpf(listIds) {
  var ids = listIds || [];
  if (!ids.length && typeof getCabinetProductIds === "function") ids = getCabinetProductIds();
  for (var i = 0; i < ids.length; i++) {
    var p = (typeof resolveProfileCabinetProduct === "function" ? resolveProfileCabinetProduct(ids[i]) : null)
      || (typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(ids[i]) : null)
      || (typeof DB !== "undefined" && DB ? DB[ids[i]] : null);
    if (!p) continue;
    var isSpf = p.kat === "spf" || (typeof checkProductMatchesSlot === "function" && checkProductMatchesSlot(p, "spf"));
    if (isSpf && p.iron_ox === true) return true;
  }
  return false;
}

function renderIronOxideGapHtml(tab, currentList) {
  if (!(hasTag("pih-prone") || hasTag("skin-of-color") || hasTag("iron-oxide-prio"))) return "";
  var list = currentList || [];
  var amAll = (typeof appState !== "undefined" && appState && appState.am) ? appState.am : [];
  var allIds = [].concat(list, amAll);
  var hasIron = cabinetHasIronOxideSpf(allIds);
  var hasSpf = typeof checkSlotCovered === "function" ? !!checkSlotCovered("spf", tab || "am", list) : false;
  if (hasIron) {
    return '<div style="margin:8px 12px 12px;padding:8px 10px;border-radius:8px;background:#ecfdf5;border:1px solid #a7f3d0;font-size:0.78rem;color:#065f46">' +
      "✓ Eisenoxid-/getönter LSF im Schrank — gut für PIH/sichtbares Licht (Einkaufshinweis).</div>";
  }
  var adoptId = (typeof DB !== "undefined" && DB && DB.antheliosTinted) ? "antheliosTinted" : "";
  var btn = adoptId
    ? '<button type="button" class="btn-adopt" style="font-size:0.74rem;padding:5px 9px;margin-top:6px" onclick="adoptIdealProduct(\'' + adoptId + "', '" + (tab || "am") + '\')">+ Getönten LSF vorschlagen</button>'
    : "";
  return '<div style="margin:8px 12px 12px;padding:10px 12px;border-radius:8px;background:#fff7ed;border:1px solid #fed7aa">' +
    '<div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#9a3412;letter-spacing:0.04em">Lücke · optional</div>' +
    '<div style="font-size:0.88rem;font-weight:700;color:var(--ink);margin-top:2px">Eisenoxid-LSF / getönter Schutz</div>' +
    '<div style="font-size:0.78rem;color:var(--muted);line-height:1.35;margin-top:3px">' +
    (hasSpf
      ? "Du hast schon LSF — für PIH/SOC oft zusätzlich Eisenoxide gegen sichtbares Licht sinnvoll."
      : "Für PIH/SOC: Breitband-LSF priorisieren; Eisenoxid/getönt als Plus.") +
    " Keine Therapie — Einkaufshinweis.</div>" + btn + "</div>";
}


if (typeof window !== "undefined") {
  window.evaluateProductCompatibility = evaluateProductCompatibility;
  window.CONCERN_QUICK_TAGS = CONCERN_QUICK_TAGS;
  window.toggleConcernTag = toggleConcernTag;
  window.renderConcernQuickHtml = renderConcernQuickHtml;
  window.renderConcernQuickPanelHtml = renderConcernQuickPanelHtml;
  window.getReizBudgetSummary = getReizBudgetSummary;
  window.renderReizBudgetCardHtml = renderReizBudgetCardHtml;
  window.renderReizBudgetInlineHtml = renderReizBudgetInlineHtml;
  window.cabinetHasIronOxideSpf = cabinetHasIronOxideSpf;
  window.renderIronOxideGapHtml = renderIronOxideGapHtml;
  window.hasTag = hasTag;
}


