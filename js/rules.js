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

const OUTCOME_RANK = { passt: 0, eher_nicht: 1, konflikt: 2 };

const TAG_ALIASES = {
  sensibel: ["sensibel", "sensible"],
  barrier: ["barriere-fragil", "barrier", "barriere"],
  "akne-prone": ["akne-prone", "akne prone", "akne"],
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

function normalizeOutcome(x) {
  const s = String(x || "").toLowerCase().replace(/\s+/g, "_");
  if (s === "passt" || s === "ok" || s === "yes" || s === "empty_ok") return "passt";
  if (s === "eher_nicht" || s === "warn" || s === "wechsel" || s === "umbauen") return "eher_nicht";
  if (s === "konflikt" || s === "no" || s === "danger" || s === "lieber_nicht") return "konflikt";
  if (s === "skip" || s === "n_a" || s === "na" || s === "noch_nicht") return null;
  return "passt";
}

function worstWins() {
  var best = "passt";
  var bestRank = 0;
  for (var i = 0; i < arguments.length; i++) {
    var o = normalizeOutcome(arguments[i]);
    if (o == null) continue;
    var r = OUTCOME_RANK[o] != null ? OUTCOME_RANK[o] : 0;
    if (r > bestRank) {
      bestRank = r;
      best = o;
    }
  }
  return best;
}

function formatVerdictOneLook(outcome, reason) {
  var o = normalizeOutcome(outcome) || "passt";
  var emoji = o === "konflikt" ? "🔴" : o === "eher_nicht" ? "🟡" : "🟢";
  var label = o === "konflikt" ? "passt schlecht zusammen" : o === "eher_nicht" ? "eher nicht" : "passt";
  var grund = String(reason || "").trim();
  return emoji + " " + label + (grund ? " — " + grund : "");
}

function outcomeTitle(outcome) {
  var o = normalizeOutcome(outcome) || "passt";
  if (o === "konflikt") return "🔴 passt schlecht zusammen";
  if (o === "eher_nicht") return "🟡 eher nicht";
  return "🟢 passt";
}

function statusFromOutcome(outcome) {
  var o = normalizeOutcome(outcome) || "passt";
  if (o === "konflikt") return "no";
  if (o === "eher_nicht") return "warn";
  return "ok";
}

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

const PAIR_MATRIX = [
  // 1. not_cosmetic: BPO Leave-on in Kosmetik-Schiene
  {
    id: "rule_not_cosmetic_bpo",
    code: "not_cosmetic",
    prio: 10,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (isBpoProduct(cand) && cand.schiene === "kosmetik" && cand.kat !== "reiniger") {
        return "BPO ist in der EU kein Gesichts-Kosmetikstoff (Annex III/94) — nur im Arzneimittel-Schrank erfassen.";
      }
      return false;
    }
  },
  // 2. not_cosmetic: Hydrochinon in Kosmetik verboten
  {
    id: "rule_not_cosmetic_hq",
    code: "not_cosmetic",
    prio: 10,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      var blob = ((cand.name || "") + " " + (cand.wirk || "")).toLowerCase();
      var isHq = productHasClass(cand, "hq_banned") || blob.indexOf("hydrochinon") !== -1 || blob.indexOf("hydroquinone") !== -1;
      if (isHq && !cand.rx) {
        return "Hydrochinon ist in der EU in Kosmetik verboten (Annex II/1339).";
      }
      return false;
    }
  },
  // 3. inactivate: BPO + klassisches Tretinoin (BPO oxidiert Tretinoin)
  {
    id: "rule_inactivate_bpo_tretinoin",
    code: "inactivate",
    prio: 20,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (!other) return false;
      var candBpo = isBpoProduct(cand);
      var otherBpo = isBpoProduct(other);
      var candTret = isTretinoinProduct(cand);
      var otherTret = isTretinoinProduct(other);
      if ((candBpo && otherTret) || (candTret && otherBpo)) {
        return "Klassisches Tretinoin wird durch BPO oxidiert und inaktiviert — nicht zeitgleich anwenden.";
      }
      return false;
    }
  },
  // 12. inactivate: BPO + reine L-Ascorbinsäure (Vitamin C)
  {
    id: "rule_inactivate_bpo_ascorbic",
    code: "inactivate",
    prio: 20,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (!other) return false;
      var candBpo = isBpoProduct(cand);
      var otherBpo = isBpoProduct(other);
      var candAsc = isAscorbicProduct(cand);
      var otherAsc = isAscorbicProduct(other);
      if ((candBpo && otherAsc) || (candAsc && otherBpo)) {
        return "BPO oxidiert reine L-Ascorbinsäure (Vitamin C) sofort — besser trennen (z. B. Vitamin C morgens, BPO abends).";
      }
      return false;
    }
  },
  // 8. same_class: retinoid_rx + retinoid_cos
  {
    id: "rule_same_class_ret_cos_rx",
    code: "same_class",
    prio: 30,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (!other) return false;
      var candCos = isCosmeticRetinoid(cand);
      var otherCos = isCosmeticRetinoid(other);
      var candRx = isRxRetinoid(cand);
      var otherRx = isRxRetinoid(other);
      if ((candCos && otherRx) || (candRx && otherCos)) {
        return "Gleiche Wirkstoffklasse (Retinoid) schon im Schrank — kosmetisches Retinol neben medizinischem Retinoid bringt mehr Reiz ohne Zusatznutzen.";
      }
      return false;
    }
  },
  // 9. same_class: retinoid_rx + retinoid_rx
  {
    id: "rule_same_class_ret_rx_rx",
    code: "same_class",
    prio: 30,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (!other) return false;
      if (isRxRetinoid(cand) && isRxRetinoid(other)) {
        return "Gleiche Wirkstoffklasse: Zwei medizinische Retinoide nicht kombinieren — erhöht nur das Schälungs- und Reizrisiko.";
      }
      return false;
    }
  },
  // 10. same_class: retinoid_cos + retinoid_cos
  {
    id: "rule_same_class_ret_cos_cos",
    code: "same_class",
    prio: 30,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (!other) return false;
      if (isCosmeticRetinoid(cand) && isCosmeticRetinoid(other)) {
        return "Gleiche Wirkstoffklasse (Retinoid): Zwei kosmetische Retinoide doppeln sich nur — lieber bei einem bewährten Produkt bleiben.";
      }
      return false;
    }
  },
  // 11. same_class: aha + aha
  {
    id: "rule_same_class_aha_aha",
    code: "same_class",
    prio: 30,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (!other) return false;
      if (isAhaProduct(cand) && isAhaProduct(other)) {
        return "Gleiche Wirkstoffklasse (AHA-Fruchtsäure) schon vorhanden — zwei AHA-Peelings doppeln sich nur und strapazieren die Barriere.";
      }
      return false;
    }
  },
  // 11b. same_class: bha + bha
  {
    id: "rule_same_class_bha_bha",
    code: "same_class",
    prio: 30,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (!other) return false;
      if (isBhaProduct(cand) && isBhaProduct(other)) {
        return "Gleiche Wirkstoffklasse (BHA) schon vorhanden — zwei BHA-Produkte doppeln sich nur und erhöhen das Reizrisiko.";
      }
      return false;
    }
  },
  // 4. skip_stack: BPO + Retinoid (Einzeltuben) in derselben Schicht (Reizrisiko, keine Inaktivierung bei Adapalen)
  {
    id: "rule_skip_stack_bpo_retinoid",
    code: "skip_stack",
    prio: 40,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (!other) return false;
      var candBpo = isBpoProduct(cand);
      var otherBpo = isBpoProduct(other);
      var candRet = isRetinoidProduct(cand);
      var otherRet = isRetinoidProduct(other);
      if ((candBpo && otherRet) || (candRet && otherBpo)) {
        if (ctx && (ctx.slot === "pm" || String(ctx.slot || "").indexOf("pm") !== -1)) {
          return "Retinoid und BPO nicht in derselben Abend-Schicht stapeln (Reiz). Chemie Adapalen×BPO ist stabil — Problem ist Reiz, nicht Zerstörung.";
        }
      }
      return false;
    }
  },
  // 10. skip_stack: AHA + BHA am selben Abend
  {
    id: "rule_skip_stack_aha_bha",
    code: "skip_stack",
    prio: 40,
    outcome: "konflikt",
    match: function (cand, other, ctx) {
      if (!other) return false;
      var candAha = isAhaProduct(cand);
      var otherAha = isAhaProduct(other);
      var candBha = isBhaProduct(cand);
      var otherBha = isBhaProduct(other);
      if ((candAha && otherBha) || (candBha && otherAha)) {
        if (ctx && (ctx.slot === "pm" || String(ctx.slot || "").indexOf("pm") !== -1)) {
          return "Zwei starke Säuren (AHA + BHA) am selben Abend überfordern die Barriere.";
        }
      }
      return false;
    }
  },
  // 6 & 7. alternate_days: Retinoid x AHA / BHA
  {
    id: "rule_alternate_retinoid_acid",
    code: "alternate_days",
    prio: 50,
    outcome: "eher_nicht",
    match: function (cand, other, ctx) {
      if (!other) return false;
      var candRet = isRetinoidProduct(cand);
      var otherRet = isRetinoidProduct(other);
      var candAcid = isAcidProduct(cand);
      var otherAcid = isAcidProduct(other);
      if ((candRet && otherAcid) || (candAcid && otherRet)) {
        if (!ctx || ctx.slot === "pm" || String(ctx.slot || "").indexOf("pm") !== -1) {
          return "Nicht am selben Abend wie dein Retinoid — lieber getrennte Tage (Skin Cycling).";
        }
      }
      return false;
    }
  },
  // 13. split: Ascorbinsäure (Vitamin C) x AHA / BHA
  {
    id: "rule_split_ascorbic_acid",
    code: "split",
    prio: 50,
    outcome: "eher_nicht",
    match: function (cand, other, ctx) {
      if (!other) return false;
      var candAsc = isAscorbicProduct(cand);
      var otherAsc = isAscorbicProduct(other);
      var candAcid = isAcidProduct(cand);
      var otherAcid = isAcidProduct(other);
      if ((candAsc && otherAcid) || (candAcid && otherAsc)) {
        return "Stark saures Milieu kann reizen — besser trennen (z. B. Vitamin C morgens, Säure-Peeling abends).";
      }
      return false;
    }
  },
  // 5. resistance: Topisches Antibiotikum (ab_top) ohne BPO im Schrank
  {
    id: "rule_resistance_ab_without_bpo",
    code: "resistance",
    prio: 55,
    outcome: "eher_nicht",
    match: function (cand, other, ctx) {
      if (isAntibioticProduct(cand)) {
        var cabinetHasBpo = ctx && ctx.allCabinetProducts && ctx.allCabinetProducts.some(isBpoProduct);
        if (!cabinetHasBpo && !isBpoProduct(cand)) {
          return "Topisches Antibiotikum nie als Monotherapie ohne BPO anwenden — Gefahr von bakterieller Resistenzbildung. Ärztlich abklären.";
        }
      }
      return false;
    }
  },
  // 17. begleit_barrier: Duftstoffe / Barrierestress neben aktiver Rx-Therapie
  {
    id: "rule_begleit_barrier",
    code: "begleit_barrier",
    prio: 60,
    outcome: "eher_nicht",
    match: function (cand, other, ctx) {
      if (!other) return false;
      var candStress = cand.ff === false || productHasClass(cand, "barrier_stress");
      var otherRx = isRxRetinoid(other) || isBpoProduct(other);
      if (candStress && (otherRx || hasTag("begleitpflege"))) {
        return "Parfüm/Barrierestress neben Rx/Retinoid — Begleitpflege eher reizarm und barrierefreundlich halten.";
      }
      return false;
    }
  },
  // 19. bleach: BPO bleicht Textilien
  {
    id: "rule_bleach_bpo",
    code: "bleach",
    prio: 80,
    outcome: "passt",
    match: function (cand, other, ctx) {
      if (isBpoProduct(cand)) {
        return "Hinweis: Benzoylperoxid (BPO) bleicht Textilien und Kissenbezüge.";
      }
      return false;
    }
  }
];

function checkPairRules(candidate, cabinetProducts, context) {
  if (!candidate) return null;
  var prods = Array.isArray(cabinetProducts) ? cabinetProducts.filter(Boolean) : [];
  var ctx = context || {};
  ctx.allCabinetProducts = prods;

  var matches = [];
  PAIR_MATRIX.forEach(function (rule) {
    // 1. Single-product check
    var candOnly = rule.match(candidate, null, ctx);
    if (candOnly) {
      matches.push({
        prio: rule.prio,
        code: rule.code,
        outcome: rule.outcome,
        reason: candOnly
      });
      return;
    }
    // 2. Pairwise check against cabinet products
    for (var i = 0; i < prods.length; i++) {
      var other = prods[i];
      if (!other || (candidate.id && other.id === candidate.id)) continue;
      var hit = rule.match(candidate, other, ctx);
      if (hit) {
        matches.push({
          prio: rule.prio,
          code: rule.code,
          outcome: rule.outcome,
          reason: hit,
          withProduct: other
        });
        break;
      }
    }
  });

  if (!matches.length) return null;
  matches.sort(function (a, b) {
    return a.prio - b.prio;
  });
  return matches[0];
}

/**
 * Nacht-Stack: ≥ Schwelle aus zwei Reizklassen → Konflikt (skip_stack).
 * Adapalen×BPO = Reiz/skip_stack, NIEMALS inactivate.
 */
function assessNightReiz(pmIds, candidate) {
  var ids = (pmIds || []).slice();
  if (candidate && candidate.id && ids.indexOf(candidate.id) === -1) ids.push(candidate.id);

  var prods = ids.map(function (id) {
    if (candidate && id === candidate.id) return candidate;
    return typeof DB !== "undefined" ? DB[id] : null;
  }).filter(Boolean);

  var weight = 0;
  var classes = {};
  prods.forEach(function (p) {
    weight += reizWeightForProduct(p);
    (p.klassen || []).forEach(function (k) {
      classes[k] = true;
    });
  });

  var hasRet = prods.some(isRetinoidProduct);
  var hasRxRet = prods.some(isRxRetinoid);
  var hasCosRet = prods.some(isCosmeticRetinoid);
  var hasAcid = prods.some(isAcidProduct);
  var hasAha = prods.some(isAhaProduct);
  var hasBha = prods.some(isBhaProduct);
  var hasBpo = prods.some(isBpoProduct);
  var hasAscorbic = prods.some(isAscorbicProduct);

  var sharp = hasTag("begleitpflege") || hasTag("barrier") || hasTag("sensibel");
  var threshold = sharp ? 3 : 4;

  // Inaktivierung (BPO x Tretinoin / BPO x Ascorbic)
  var pairNight = checkPairRules(candidate || prods[0], prods, { slot: "pm" });
  if (pairNight && pairNight.code === "inactivate") {
    return makeDim("konflikt", pairNight.reason, "inactivate");
  }

  // Redundanz am selben Abend
  if (hasRxRet && hasCosRet) {
    return makeDim(
      "konflikt",
      "Gleiche Wirkstoffklasse (Retinoid) schon im Schrank — kosmetisches Retinol neben medizinischem Retinoid bringt mehr Reiz ohne Zusatznutzen.",
      "same_class"
    );
  }
  var ahaCount = prods.filter(isAhaProduct).length;
  if (ahaCount > 1) {
    return makeDim(
      "konflikt",
      "Gleiche Wirkstoffklasse (AHA-Fruchtsäure) schon vorhanden — zwei AHA-Peelings doppeln sich nur und strapazieren die Barriere.",
      "same_class"
    );
  }

  if (hasRet && hasAcid) {
    return makeDim(
      "konflikt",
      "Zwei starke Reizstoffe am selben Abend (Retinoid + Säure) — Barriererisiko.",
      "skip_stack"
    );
  }
  if (hasRet && hasBpo) {
    // Chemie Adapalen×BPO ist OK — trotzdem skip_stack wegen Reiz, nie inactivate
    return makeDim(
      "konflikt",
      "Retinoid und BPO nicht in derselben Abend-Schicht stapeln (Reiz). Chemie Adapalen×BPO ist stabil — Problem ist Reiz, nicht Zerstörung.",
      "skip_stack"
    );
  }
  if (hasAha && hasBha) {
    return makeDim(
      "konflikt",
      "Zwei starke Säuren (AHA + BHA) am selben Abend überfordern die Barriere.",
      "skip_stack"
    );
  }
  if (weight >= threshold && (hasRet || hasAcid || hasBpo || hasAscorbic)) {
    return makeDim(
      "konflikt",
      "Reiz-Budget der Nacht überschritten — starke Actives besser trennen.",
      "skip_stack"
    );
  }
  return makeDim("passt", "Kein hartes Nacht-Stacking erkannt.", "ok");
}

/**
 * Tageslast AM+PM: BPO AM + Retinoid PM → eher nicht (Default);
 * bei begleitpflege+barrier eher Konflikt-Ton.
 */
function assessDayReiz(amIds, pmIds, candidate, candidateSlot) {
  var am = (amIds || []).slice();
  var pm = (pmIds || []).slice();
  if (candidate && candidate.id) {
    if (candidateSlot === "am" && am.indexOf(candidate.id) === -1) am.push(candidate.id);
    else if (candidateSlot === "pm" && pm.indexOf(candidate.id) === -1) pm.push(candidate.id);
    else {
      // Scan ohne Slot: hypothetisch gegen beide Lasten prüfen
      if (isBpoProduct(candidate) && am.indexOf(candidate.id) === -1) am = am.concat([candidate.id]);
      if (isRetinoidProduct(candidate) && pm.indexOf(candidate.id) === -1) pm = pm.concat([candidate.id]);
    }
  }
  var amProds = am.map(function (id) {
    return candidate && id === candidate.id ? candidate : (typeof DB !== "undefined" ? DB[id] : null);
  }).filter(Boolean);
  var pmProds = pm.map(function (id) {
    return candidate && id === candidate.id ? candidate : (typeof DB !== "undefined" ? DB[id] : null);
  }).filter(Boolean);

  var amHeavy = amProds.some(function (p) {
    return reizWeightForProduct(p) >= 2;
  });
  var pmHeavy = pmProds.some(function (p) {
    return reizWeightForProduct(p) >= 2;
  });
  var amBpo = amProds.some(isBpoProduct);
  var pmRet = pmProds.some(isRetinoidProduct);
  var sharp = hasTag("begleitpflege") && (hasTag("barrier") || hasTag("sensibel"));

  if (amBpo && pmRet) {
    return makeDim(
      sharp ? "konflikt" : "eher_nicht",
      "Viel Active an einem Tag (z. B. BPO morgens + medizinisches Retinoid abends). Nicht weil Adapalen×BPO chemisch inkompatibel wäre — sondern zwei starke Reizstoffe an einem Tag ohne Fertiggalenik.",
      "day_skip_stack"
    );
  }
  if (amHeavy && pmHeavy) {
    return makeDim(
      "eher_nicht",
      "AM und PM tragen heute beide starke Actives — Reiz-Budget des Tages hoch.",
      "day_load"
    );
  }
  return makeDim("passt", "Tageslast unkritisch.", "ok");
}

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

function assessZuDir(candidate) {
  var hooks = inciHooksFromProduct(candidate);
  var hasPerfume = typeof productLooksPerfumed === "function" ? productLooksPerfumed(candidate) : candidate.ff === false;
  var fragranceFree = candidate.ff === true;

  if (hasArztThema() && isCosmeticActiveUpsell(candidate)) {
    return makeDim(
      "konflikt",
      "Arzt-Thema erkannt — kein Serum-/Active-Upsell. Basispflege weiter scannen ok.",
      "arzt_upsell"
    );
  }

  if (isBabyProfile()) {
    var klassesBaby = Array.isArray(candidate.klassen) ? candidate.klassen : [];
    var isAdultActiveBaby = klassesBaby.some(function (k) {
      return /retinoid|bpo|aha|bha|peeling|salicyl|glycolic|ascorbic|azelaic|barrier_stress/.test(k);
    }) || /retinol|retinal|adapalen|tretinoin|benzoyl|peeling|aha 30%|salicylsäure 2%/i.test(candidate.name || "");
    if (isAdultActiveBaby) {
      return makeDim(
        "konflikt",
        "Potente Wirkstoffe (Retinoide/Säuren/BPO) sind für Säuglinge kontraindiziert.",
        "baby_adult_active"
      );
    }
    if (hasPerfume) {
      return makeDim(
        "konflikt",
        "Für unter 3: parfümierte Leave-ons meiden.",
        "baby_perfume"
      );
    }
  }

  if (isChildProfile()) {
    var klassesChild = Array.isArray(candidate.klassen) ? candidate.klassen : [];
    var isAdultActiveChild = klassesChild.some(function (k) {
      return /retinoid|bpo|aha|bha|peeling|salicyl|glycolic|ascorbic|azelaic/.test(k);
    }) || /retinol|retinal|adapalen|tretinoin|benzoyl|peeling|aha 30%|salicylsäure 2%/i.test(candidate.name || "");
    if (isAdultActiveChild) {
      return makeDim(
        "konflikt",
        "Potente Wirkstoffe (Retinoide/chemische Säurepeelings/BPO) sind vor der Pubertät ungeeignet.",
        "child_adult_active"
      );
    }
    if (hasPerfume) {
      return makeDim(
        "eher_nicht",
        "Duftstoffarm bevorzugt bei Kinderhaut.",
        "child_perfume"
      );
    }
  }

  if ((hasTag("sensibel") || hasTag("duftstofffrei")) && hasPerfume) {
    return makeDim(
      "eher_nicht",
      hasTag("duftstofffrei")
        ? "Du willst Duft meiden — dieses Produkt hat Parfüm."
        : "Enthält Duftstoffe — bei sensibler Haut oft Reiz.",
      "perfume_sensibel"
    );
  }

  if (hasTag("begleitpflege") && hasPerfume) {
    return makeDim(
      "eher_nicht",
      "Neben Rx-Wirkstoff lieber milde, reizarme Begleitpflege (Duft).",
      "begleit_barrier"
    );
  }

  if (productHasClass(candidate, "barrier_stress")) {
    if (isBabyProfile()) {
      return makeDim("konflikt", "Aggressive Alkohole/ätherische Öle — bei Baby ungeeignet.", "barrier_stress");
    }
    if (hasTag("sensibel") || hasTag("barrier") || hasTag("begleitpflege")) {
      return makeDim(
        "eher_nicht",
        "Extra Reizstoff (Alkohol denat. / ätherische Öle) bei strapazierter oder Rx-Begleit-Barriere.",
        "barrier_stress"
      );
    }
    return makeDim("eher_nicht", "Enthält potenzielle Barrierestress-Stoffe.", "barrier_stress");
  }

  if (isTeenProfile() && productHasClass(candidate, "retinoid_cos") && candidate.kat !== "creme") {
    return makeDim(
      "eher_nicht",
      "Anti-Aging-Retinol ist für Jugendliche kein Default-Vorschlag.",
      "not_for_minors"
    );
  }

  // Soft Feuchte-Hinweise nur wenn Katalog Textur-Flag hat (sonst stub/neutral)
  if (candidate.textur === "matt" && hasTag("trocken")) {
    return makeDim("eher_nicht", "Sehr mattierend — für trockene Haut oft zu wenig Pflege.", "textur");
  }
  if ((candidate.textur === "reich" || candidate.textur === "occlusiv") && hasTag("oelig")) {
    return makeDim("eher_nicht", "Sehr reichhaltig — für ölige Haut oft zu schwer.", "textur");
  }

  // Soft pref_nc: fehlendes NC = nie Konflikt
  if (hasTag("pref_nc") || hasTag("akne-prone")) {
    if (candidate.nc === true) {
      return makeDim(
        "passt",
        "Hat NC-Claim — Herstellerangabe, keine Garantie.",
        "nc_claim"
      );
    }
    // kein Bonus, kein Konflikt
  }

  if (hasTag("sensibel") && fragranceFree) {
    return makeDim("passt", "Parfümfrei — passt zu deiner sensiblen Haut.", "ff_ok");
  }

  if (hasArztThema() && !isCosmeticActiveUpsell(candidate)) {
    return makeDim("passt", "Basispflege ok bei Arzt-Thema.", "arzt_basis");
  }

  // Evidence-based Phototyp & Melanin-Regeln (Skin of Color / Fitzpatrick IV–VI / PIH)
  if ((hasTag("pih-prone") || hasTag("skin-of-color")) && isAhaProduct(candidate)) {
    var candBlob = ((candidate.name || "") + " " + (candidate.wirk || "")).toLowerCase();
    var isGlycolic = candBlob.indexOf("glycol") !== -1 || candBlob.indexOf("glykol") !== -1 || candidate.id === "glycolic";
    if (isGlycolic) {
      return makeDim(
        "eher_nicht",
        "Bei Neigung zu PIH/dunklen Pickelmalen kann tief eindringende Glykolsäure Entzündungen und Rebound-Pigmentierung auslösen (AAD-Konsens). Sanftere Alternativen: Azelainsäure, Mandelsäure oder PHA.",
        "pih_acid_caution"
      );
    }
  }

  if ((hasTag("skin-of-color") || hasTag("zero-white-cast")) && candidate.no_white_cast === false) {
    return makeDim(
      "eher_nicht",
      "Ungetönte mineralische Filter (Zinkoxid/Titandioxid) hinterlassen auf dunkleren Hauttönen oft einen sichtbaren Grauschleier (White-Cast).",
      "white_cast_caution"
    );
  }

  if ((hasTag("pih-prone") || hasTag("skin-of-color") || hasTag("iron-oxide-prio")) && candidate.iron_ox === true) {
    return makeDim(
      "passt",
      "Enthält Eisenoxide: Schützt nachweislich vor sichtbarem Licht (HEV / Blue Light), dem Haupttrigger für persistierende Pigmentflecken bei Melanin-reicher Haut.",
      "soc_iron_praise"
    );
  }

  if (hasTag("pih-prone") && candidate.pih === true) {
    return makeDim(
      "passt",
      "Evidenzbasierte Pflege gegen Pickelmale (PIH): Reguliert Melaninbildung und Melanosomen-Transfer (z. B. Azelainsäure / Niacinamid).",
      "pih_target_match"
    );
  }

  var quizSparse =
    !hasTag("trocken") &&
    !hasTag("oelig") &&
    !hasTag("misch") &&
    !hasTag("sensibel") &&
    !hasTag("akne-prone") &&
    !hasTag("pih-prone") &&
    !hasTag("skin-of-color");
  if (quizSparse) {
    return makeDim(
      "passt",
      "Noch wenig Tags — nur Basis-Check. Quiz schärft später.",
      "neutral"
    );
  }

  return makeDim("passt", "Passt zu deinen Tags/Profil.", "ok");
}

function assessZumSchrank(candidate) {
  if (isCabinetEmptyForLayering()) {
    return {
      outcome: null,
      reason:
        "Noch nicht prüfbar — Dein Schrank ist leer (oder nur Wasser). Speichere Produkte, dann prüfen wir Layering.",
      code: "noch_nicht"
    };
  }

  var currentPM = typeof getActivePMList === "function" ? getActivePMList() : [];
  var am = (typeof appState !== "undefined" && appState.am) || [];
  var allCabinetIds = getCabinetProductIds();
  var allCabinetProds = allCabinetIds.map(function (id) {
    return typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(id) : (typeof DB !== "undefined" ? DB[id] : null);
  }).filter(Boolean);

  var hasRxRetinoid = allCabinetProds.some(isRxRetinoid);
  var hasBPO = allCabinetProds.some(isBpoProduct);

  // 1. Matrix-Prüfung gegen Schrank-Produkte (Prio: not_cosmetic > inactivate > same_class)
  var pairHit = checkPairRules(candidate, allCabinetProds, { slot: null, currentPM: currentPM });
  if (pairHit && pairHit.outcome === "konflikt") {
    return makeDim(pairHit.outcome, pairHit.reason, pairHit.code);
  }

  // 2. Matrix-Warnungen mit spezifischem Ablauf (alternate_days, split, resistance)
  if (pairHit && pairHit.outcome === "eher_nicht") {
    return makeDim(pairHit.outcome, pairHit.reason, pairHit.code);
  }

  // 3. Fallback: AHA/BHA vs Retinoid → lieber getrennte Tage (Skin Cycling) falls nicht bereits durch pairHit
  if (isAcidProduct(candidate) && hasRxRetinoid) {
    return makeDim(
      "eher_nicht",
      "Nicht am selben Abend wie dein Retinoid — lieber getrennte Tage (Skin Cycling).",
      "alternate_days"
    );
  }

  // 4. Hypothetischer Nacht-Stack wenn Kandidat abends landet (Reizgewicht-Budget)
  var night = assessNightReiz(currentPM, candidate);
  if (night.outcome === "konflikt") return night;

  // 5. Tageslast prüfen
  var day = assessDayReiz(am, currentPM, candidate, null);
  if (day.outcome === "eher_nicht" || day.outcome === "konflikt") return day;

  // 6. Begleitpflege / Duftstoffe
  var hasRxTherapy = allCabinetProds.some(function (p) {
    return isRxRetinoid(p) || isBpoProduct(p) || (p && (p.rx || p.schiene === "arzneimittel"));
  });
  if (candidate.ff === false && (hasRxTherapy || hasTag("begleitpflege"))) {
    return makeDim(
      "eher_nicht",
      "Parfüm neben Rx/Retinoid — Begleitpflege eher reizarm halten.",
      "begleit_barrier"
    );
  }

  // 7. Hinweis-Hits (z.B. bleach)
  if (pairHit && pairHit.code === "bleach") {
    return makeDim("passt", pairHit.reason, "bleach");
  }

  return makeDim("passt", "Kein bekannter harter Konflikt auf Stoffebene.", "ok");
}

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

function evaluateCandidate(candidate) {
  var empty = isCabinetEmptyForLayering();
  var zuDir = assessZuDir(candidate);
  var zumSchrank = assessZumSchrank(candidate);
  var slot = assessSlot(candidate, empty);

  var overall = worstWins(zuDir.outcome, zumSchrank.outcome, slot.outcome);

  // 1 Blick: Grund aus schlechtester Dimension
  var dims = [zuDir, zumSchrank, slot];
  var primary = zuDir;
  dims.forEach(function (d) {
    if (d.outcome && OUTCOME_RANK[d.outcome] > OUTCOME_RANK[primary.outcome || "passt"]) {
      primary = d;
    }
  });
  if (empty && overall === "passt") {
    primary = {
      outcome: "passt",
      reason: (zuDir.reason || "Passt zu Tags/Profil.") + " Schrank noch leer — Layering folgt nach dem ersten Produkt."
    };
  }

  var alts = [];
  if (overall === "konflikt" || overall === "eher_nicht") {
    alts = filterAltsForArztThema([
      { name: "Balea Med Ultra Sensitive Waschgel", store: "dm (~2,45 €)", price: "Milde Reinigung" },
      { name: "Balea Med Intensivcreme", store: "dm (~3,95 €)", price: "Barriere-Support" },
      { name: "Purito Bamboo Panthenol Cream", store: "EU-Shop (~18 €)", price: "Reizarme Pflege" }
    ]);
  }
  if (hasArztThema() && isCosmeticActiveUpsell(candidate)) {
    alts = filterAltsForArztThema(alts);
  }

  var where =
    empty
      ? "Slot soft — erst speichern, dann Layering"
      : candidate.kat === "spf"
        ? "Schritt 5 morgens"
        : candidate.kat === "reiniger"
          ? "Schritt 1 morgens & abends"
          : primary.code === "alternate_days" || primary.code === "slot_alternate"
            ? "Nur an freien Abenden / getrennte Tage"
            : primary.code === "split"
              ? "Morgens und abends trennen"
              : primary.code === "day_skip_stack" || primary.code === "day_load"
                ? "Tageslast prüfen — Wechsel-Nacht oder Spot pausieren (Nutzerwahl)"
                : candidate.kat === "creme"
                  ? "Schritt 4 Creme"
                  : "Je nach Slot in der Routine";

  return {
    status: statusFromOutcome(overall),
    verdict: overall,
    title: outcomeTitle(overall),
    oneLook: formatVerdictOneLook(overall, primary.reason),
    reason: primary.reason,
    truth:
      candidate.truth ||
      (empty
        ? "Ohne Schrank-Produkte kein Layering-Claim — nur Zu-dir/Profil-Check."
        : "Shopping- & Layering-Helper auf Basis von Flags/Klassen (kein CosIng-Vollparser)."),
    where: where,
    disclaimer: VERDICT_DISCLAIMER,
    alts: alts,
    dims: {
      zuDir: zuDir,
      zumSchrank: zumSchrank,
      slot: slot
    },
    emptyCabinet: empty,
    inciStub: true
  };
}


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
function assessCabinetProfileConstraints(products, opts) {
  opts = opts || {};
  var cat = opts.category || (typeof getActiveProfileCategory === "function" ? getActiveProfileCategory() : "adult");
  var list = (products || []).filter(Boolean);
  var hits = [];
  var flagged = {};
  var seenKey = {};

  function pushHit(hit, prod) {
    if (!hit || !hit.outcome) return;
    var key = hit.code + "|" + hit.reason;
    if (!seenKey[key]) {
      var productIds = {};
      if (prod && prod.id) productIds[prod.id] = true;
      var row = {
        code: hit.code,
        outcome: hit.outcome,
        reason: hit.reason,
        prio: hit.prio || 50,
        productIds: productIds,
        edu: hit.edu || null
      };
      seenKey[key] = row;
      hits.push(row);
    } else if (prod && prod.id) {
      seenKey[key].productIds[prod.id] = true;
    }
    if (prod && prod.id) {
      var prev = flagged[prod.id];
      var rank = OUTCOME_RANK[hit.outcome] || 0;
      if (!prev || rank > (OUTCOME_RANK[prev.outcome] || 0)) {
        flagged[prod.id] = { outcome: hit.outcome, code: hit.code, reason: hit.reason };
      }
    }
  }

  var wantsFf =
    cat === "baby" ||
    hasTag("sensibel") ||
    hasTag("duftstofffrei") ||
    (typeof appState !== "undefined" &&
      appState &&
      /parf[uü]mfrei|duftstofffrei/i.test(String((appState.profileSubtitles && appState.profileSubtitles[cat]) || "")));

  list.forEach(function (p) {
    var perfumed = productLooksPerfumed(p);

    // Baby / under-3: perfume = Konflikt (leave-on AND cleansers under Parfümfrei-Prio)
    if (cat === "baby" && perfumed) {
      pushHit(
        {
          code: "baby_perfume",
          outcome: "konflikt",
          reason: "Parfüm bei Baby unter 3 Jahren ist ein häufiger Allergie-Auslöser.",
          prio: 20,
          edu: "Duftstoffe (auch ätherische Öle) sind der häufigste Allergieauslöser bei Säuglingen. Parfümfrei-Prio im Baby-Profil."
        },
        p
      );
    }

    // Child: perfume = eher nicht (duftstoffarm)
    if (cat === "child" && perfumed) {
      pushHit(
        {
          code: "child_perfume",
          outcome: "eher_nicht",
          reason: "Duftstoffarm bevorzugt bei Kinderhaut.",
          prio: 40,
          edu: "Weniger Duftstoffe reduzieren das Irritationsrisiko bei Schulkindern."
        },
        p
      );
    }

    // Teen: Parfümfrei-Prio (editorial) → eher nicht
    if (cat === "teen" && perfumed) {
      pushHit(
        {
          code: "teen_perfume",
          outcome: "eher_nicht",
          reason: "Parfümfrei-Prio: Duftstoffe eher meiden.",
          prio: 45,
          edu: null
        },
        p
      );
    }

    // Adult / any: sensibel or duftstofffrei → eher nicht
    if ((cat === "adult" || !cat) && perfumed && (hasTag("sensibel") || hasTag("duftstofffrei"))) {
      pushHit(
        {
          code: "perfume_sensibel",
          outcome: "eher_nicht",
          reason: hasTag("duftstofffrei")
            ? "Du willst Duft meiden — dieses Produkt hat Parfüm."
            : "Enthält Duftstoffe — bei sensibler Haut oft Reiz.",
          prio: 42,
          edu: null
        },
        p
      );
    }

    // Akne & Ölige Haut Profil-Prüfung im Schrank (Komedogenität & Textur/Slugging)
    var isAkneCabinet = (cat === "teen" || hasTag("akne-prone") || hasTag("oelig") || hasTag("misch") || hasTag("pref_nc") ||
      /akne|unrein|zystisch|seborrhoe|oelig|glanz|mitesser/i.test(String((appState && appState.profileSubtitles && appState.profileSubtitles[cat]) || "")));
    if (isAkneCabinet) {
      var inciCheck = typeof analyzeInciComedogenicity === "function" ? analyzeInciComedogenicity(p) : null;
      if (inciCheck) {
        if (inciCheck.maxScore >= 4) {
          pushHit(
            {
              code: "akne_comedogenic_high",
              outcome: "konflikt",
              reason: "Komedogenität " + inciCheck.maxScore + "/5 (" + (inciCheck.highRisk.map(function(h){ return h.name; }).join(", ") || "Stark porenverstopfend") + ") — bei Akne & öliger Haut kontraindiziert.",
              prio: 25,
              edu: "Porenverstopfende Stoffe (wie Isopropyl Myristate, Carrageenan, Algenextrakte, Squalen-Oxidation oder Kokosöl) triggern Follikelverstopfungen und zystische Entzündungen (Acne cosmetica)."
            },
            p
          );
        } else if (inciCheck.hasCysticTrigger) {
          pushHit(
            {
              code: "akne_cystic_trigger",
              outcome: "konflikt",
              reason: "Zystischer Akne-Trigger (" + inciCheck.cysticTriggers.map(function(c){ return c.name; }).join(", ") + ") — Follikelschwellungs-Risiko.",
              prio: 26,
              edu: "Algenextrakte (Laminaria, Carrageenan) und oxidierendes Squalen stimulieren Entzündungsmediatoren und Follikelschwellungen, was zystische Knoten begünstigt."
            },
            p
          );
        } else if (inciCheck.textureEval && inciCheck.textureEval.isContraindicatedForAcne && (p.kat === "creme" || !p.kat)) {
          pushHit(
            {
              code: "akne_slugging_balm",
              outcome: "eher_nicht",
              reason: "Schwere Textur (" + inciCheck.textureEval.shortLabel + ") — bei zystischer Akne/öliger Haut besteht Slugging-Gefahr (anaerobe C. acnes Vermehrung).",
              prio: 48,
              edu: "Bei zystischer Akne und öliger Haut sind leichte Hydrogele oder ölfreie Gel-Cremes deutlich besser als dicke Balsame, um Talg- und Bakterienstau zu vermeiden."
            },
            p
          );
        } else if (p.nc === false) {
          pushHit(
            {
              code: "pref_nc_miss",
              outcome: "eher_nicht",
              reason: "Als komedogen bekannt — bei Unreinheiten eher ungeeignet.",
              prio: 60,
              edu: null
            },
            p
          );
        }
      } else if (p.nc === false) {
        pushHit(
          {
            code: "pref_nc_miss",
            outcome: "eher_nicht",
            reason: "Als komedogen bekannt — bei Unreinheiten eher ungeeignet.",
            prio: 60,
            edu: null
          },
          p
        );
      }
    }

    // Teen: anti-aging / not for minors
    if (cat === "teen" && p.notForMinors) {
      pushHit(
        {
          code: "not_for_minors",
          outcome: "eher_nicht",
          reason: "Anti-Aging / nicht für Jugendliche als Default.",
          prio: 35,
          edu: null
        },
        p
      );
    }

    // Baby: missing under-3 intent when known false
    if (cat === "baby" && p.u3 === false) {
      pushHit(
        {
          code: "baby_under3",
          outcome: "eher_nicht",
          reason: "Nicht klar für unter 3 Jahre ausgewiesen.",
          prio: 38,
          edu: "EU VO 1223/2009: spezifische Sicherheitsbewertung für Kinder unter 3 Jahren."
        },
        p
      );
    }

    // Baby: potent adult actives (Retinoids, Acids, BPO, peeling) = strict conflict
    if (cat === "baby") {
      var klasses = Array.isArray(p.klassen) ? p.klassen : [];
      var isAdultActive = klasses.some(function (k) {
        return /retinoid|bpo|aha|bha|peeling|salicyl|glycolic|ascorbic|azelaic|barrier_stress/.test(k);
      }) || /retinol|retinal|adapalen|tretinoin|benzoyl|peeling|aha 30%|salicylsäure 2%/i.test(p.name || "");
      if (isAdultActive) {
        pushHit(
          {
            code: "baby_adult_active",
            outcome: "konflikt",
            reason: "Potente Wirkstoffe (Retinoide/Säuren/BPO) sind für Säuglinge kontraindiziert.",
            prio: 10,
            edu: "Die Hautbarriere von Säuglingen (<3 Jahre) ist bis zu 30% dünner und stark resorptionsfähig. Erwachsene Wirkstoffe führen zu schweren Reizungen."
          },
          p
        );
      }
    }

    // Child: potent adult actives (Retinoids, Acids, BPO, chemical peeling) = strict conflict
    if (cat === "child") {
      var klassesChild = Array.isArray(p.klassen) ? p.klassen : [];
      var isAdultActiveChild = klassesChild.some(function (k) {
        return /retinoid|bpo|aha|bha|peeling|salicyl|glycolic|ascorbic|azelaic/.test(k);
      }) || /retinol|retinal|adapalen|tretinoin|benzoyl|peeling|aha 30%|salicylsäure 2%/i.test(p.name || "");
      if (isAdultActiveChild) {
        pushHit(
          {
            code: "child_adult_active",
            outcome: "konflikt",
            reason: "Potente Wirkstoffe (Retinoide/chemische Säurepeelings/BPO) sind vor der Pubertät ungeeignet.",
            prio: 12,
            edu: "Kinderhaut (3–11 Jahre) benötigt keine aggressiven Anti-Aging-Stoffe oder hochdosierten Säuren. Sanfter Barriere-Schutz und LSF genügen."
          },
          p
        );
      }
    }
  });

  hits.sort(function (a, b) {
    return (a.prio || 50) - (b.prio || 50);
  });

  var outcomes = hits.map(function (h) {
    return h.outcome;
  });
  var overall = outcomes.length ? worstWins.apply(null, outcomes) : "passt";

  return {
    hits: hits,
    flagged: flagged,
    verdict: overall,
    status: statusFromOutcome(overall),
    eduNotes: hits
      .filter(function (h) {
        return !!h.edu && (h.outcome === "konflikt" || h.outcome === "eher_nicht");
      })
      .map(function (h) {
        return h.edu;
      })
      .filter(function (v, i, arr) {
        return arr.indexOf(v) === i;
      })
  };
}

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
function calculateCategoryCabinetPrognosis(products, category) {
  var list = (products || []).filter(Boolean);
  if (!list.length) {
    return {
      status: "empty",
      verdict: null,
      title: "Noch keine Produkte — Scan oder Beispiel",
      points: [],
      flagged: {},
      eduNotes: [],
      empty: true
    };
  }
  list.forEach(ensureClassesForRules);

  // 1) Intra-Schrank Matrix (same_class retinoids, skip_stack, …) — must not be skipped
  var cabinet = assessCabinetConflicts(list, list);
  var outcomes = [];
  var points = [];
  (cabinet.hits || []).forEach(function (hit) {
    if (hit.code === "bleach") return;
    outcomes.push(hit.outcome);
    points.push(cabinetConflictOneLook(hit));
  });

  // 2) Profile constraints (Baby perfume, Teen not-for-minors, …)
  var profile = assessCabinetProfileConstraints(list, { category: category });
  (profile.hits || []).forEach(function (h) {
    if (h.outcome === "konflikt" || h.outcome === "eher_nicht") {
      outcomes.push(h.outcome);
      points.push(formatVerdictOneLook(h.outcome, h.reason));
    }
  });

  var flagged = mergeCabinetFlagged(cabinet.flagged, profile.flagged);
  var seenPt = {};
  points = points.filter(function (pt) {
    var k = String(pt);
    if (seenPt[k]) return false;
    seenPt[k] = true;
    return true;
  });

  var overall = outcomes.length ? worstWins.apply(null, outcomes) : "passt";
  var title;
  if (overall === "konflikt") {
    title = "🔴 passt schlecht zusammen — Schrank prüfen";
  } else if (overall === "eher_nicht") {
    title = "🟡 eher nicht — kleine Anpassung";
  } else {
    title = "🟢 passt — Produkte passen zum Profil";
  }
  if (!points.length) {
    points = [formatVerdictOneLook("passt", "Kein bekannter Konflikt in diesem Schrank.")];
  }

  var whyNotes = (profile.eduNotes || []).slice();
  (cabinet.hits || []).forEach(function (hit) {
    if (hit.outcome === "konflikt" || hit.outcome === "eher_nicht") {
      if (hit.code === "skip_stack") {
        whyNotes.push("Warum kein Stacking am selben Abend? Starke Wirkstoffe überfordern empfindliche Haut; Wechselabende schonen die Barriere.");
      } else if (hit.code === "same_class") {
        whyNotes.push("Warum keine zwei Produkte derselben Klasse? Doppelungen erhöhen das Irritationsrisiko ohne Zusatznutzen.");
      }
    }
  });
  if (!whyNotes.length) {
    if (category === "baby") {
      whyNotes.push("Säuglingshaut (<3 Jahre) benötigt reizarme, parfümfreie Basispflege. Die Hautbarriere ist bis zu 30% dünner und stark aufnahmefähig.");
    } else if (category === "child") {
      whyNotes.push("Kinderhaut profitiert von sanfter, duftstoffarmer Pflege und zuverlässigem Breitband-Sonnenschutz (LSF 50+) ohne aggressive Peelings.");
    } else if (category === "teen") {
      whyNotes.push("Die Teenie-Routine setzt auf evidenzbasierte Klärung und milde Tenside, ohne die Barriere mit schweren Anti-Aging-Stoffen zu überfordern.");
      whyNotes.push("Optimale Textur bei Akne & Seborrhoe: Leichte, ölfreie Hydrogele und Gel-Cremes versorgen die Haut mit Feuchtigkeit, ohne anaerobe Bakterienherde (C. acnes) unter schweren Balsamschichten einzuschließen.");
    } else {
      whyNotes.push("Deine Produkte passen gut zusammen und schonen die natürliche Hautbarriere.");
    }
  }

  var seenWhyCat = {};
  whyNotes = whyNotes.filter(function (wn) {
    var k = String(wn);
    if (seenWhyCat[k]) return false;
    seenWhyCat[k] = true;
    return true;
  });

  return {
    status: statusFromOutcome(overall),
    verdict: overall,
    title: title,
    points: points,
    shortPoints: points.slice(),
    whyNotes: whyNotes,
    eduNotes: whyNotes,
    flagged: flagged,
    empty: false,
    hits: (cabinet.hits || []).concat(profile.hits || []),
    cabinetHits: cabinet.hits || []
  };
}


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
function assessCabinetConflicts(allProds, pmProds) {
  var products = (allProds || []).filter(Boolean);
  products.forEach(ensureClassesForRules);
  var pmSet = {};
  (pmProds || []).forEach(function (p) {
    if (p && p.id) pmSet[p.id] = true;
  });

  var hits = [];
  var seenKey = {};

  function pushHit(hit, a, b) {
    if (!hit) return;
    var key = hit.code + "|" + hit.reason;
    if (seenKey[key]) {
      // product ids ergänzen
      if (a && a.id) seenKey[key].productIds[a.id] = true;
      if (b && b.id) seenKey[key].productIds[b.id] = true;
      return;
    }
    var productIds = {};
    if (a && a.id) productIds[a.id] = true;
    if (b && b.id) productIds[b.id] = true;
    var row = {
      code: hit.code,
      outcome: hit.outcome,
      reason: hit.reason,
      prio: hit.prio,
      productIds: productIds
    };
    seenKey[key] = row;
    hits.push(row);
  }

  for (var i = 0; i < products.length; i++) {
    for (var j = i + 1; j < products.length; j++) {
      var a = products[i];
      var b = products[j];
      var coApp = getProductCoApplicationInfo(a.id, b.id);

      // If cycling is active and products are separated across cycling modes:
      // They are deliberately NOT applied together on the same evening!
      if (coApp.cyclingSeparated) {
        continue;
      }

      var bothPm = !!(a.id && b.id && pmSet[a.id] && pmSet[b.id]);
      var slotCtx = coApp.together ? coApp.slot : (bothPm ? "pm" : (coApp.dayNightSplit ? "am_pm_split" : null));
      var ctx = { slot: slotCtx, allCabinetProducts: products };

      PAIR_MATRIX.forEach(function (rule) {
        // Pairwise only for product×product codes
        if (rule.code === "not_cosmetic" || rule.code === "bleach" || rule.code === "resistance") {
          return;
        }

        // If day/night split (e.g. Vitamin C in AM, Acid or BPO in PM), skip rules that warn about same session
        if (coApp.dayNightSplit && (rule.code === "skip_stack" || rule.code === "split" || rule.code === "alternate_days" || rule.id === "rule_inactivate_bpo_ascorbic")) {
          return;
        }

        // If not applied together (and not both in current evaluated PM list), skip same-session stacking rules
        if (!coApp.together && !bothPm && (rule.code === "skip_stack" || rule.code === "alternate_days")) {
          return;
        }

        var hitAb = rule.match(a, b, ctx);
        if (hitAb) {
          pushHit(
            { code: rule.code, outcome: rule.outcome, reason: hitAb, prio: rule.prio },
            a,
            b
          );
        }
      });
    }
  }

  // resistance: antibiotic without BPO (cabinet-level)
  var hasAb = products.some(isAntibioticProduct);
  var hasBpo = products.some(isBpoProduct);
  if (hasAb && !hasBpo) {
    pushHit(
      {
        code: "resistance",
        outcome: "eher_nicht",
        reason:
          "Topisches Antibiotikum ohne BPO in der Routine — Resistenzgefahr, ärztlich abklären.",
        prio: 55
      },
      products.filter(isAntibioticProduct)[0],
      null
    );
  }

  hits.sort(function (x, y) {
    return x.prio - y.prio;
  });

  var flagged = {};
  hits.forEach(function (h) {
    Object.keys(h.productIds || {}).forEach(function (id) {
      var prev = flagged[id];
      var rank = OUTCOME_RANK[h.outcome] || 0;
      if (!prev || rank > (OUTCOME_RANK[prev.outcome] || 0)) {
        flagged[id] = { outcome: h.outcome, code: h.code, reason: h.reason };
      }
    });
  });

  return { hits: hits, flagged: flagged };
}

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


function calculatePrognosis() {
  var am = (typeof appState !== "undefined" && appState.am) || [];
  var pm = typeof getActivePMList === "function" ? getActivePMList() : [];
  var all = am.concat(pm);
  var resolve = typeof resolveCabinetProduct === "function" ? resolveCabinetProduct : function (id) {
    return typeof DB !== "undefined" && DB ? DB[id] : null;
  };

  // Always judge the FULL adult cabinet (AM + all PM modes), not only the active tab.
  // Active-tab-only checks caused a red→green flash when navigation/re-render narrowed the list.
  var fullIds = typeof getFullCabinetProductIds === "function" ? getFullCabinetProductIds() : getLayeringProductIds();

  if (fullIds.length === 0) {
    return {
      status: "empty",
      title: "ℹ️ Schrank leer — Scan trotzdem möglich",
      points: [
        "Zum Schrank: noch nicht prüfbar. Urteil zuerst Zu dir (Tags/Profil).",
        "Scan bleibt frei — speichere 2–3 Alltagsprodukte, dann wird Layering scharf.",
        VERDICT_DISCLAIMER
      ]
    };
  }

  if (fullIds.length === 1) {
    return {
      status: "warn",
      verdict: "eher_nicht",
      title: outcomeTitle("eher_nicht"),
      points: [
        "1 Produkt im Schrank — Layering nur gegen dieses eine Produkt prüfbar.",
        "Füge weitere echte Produkte hinzu für vollständige Schrank-Checks."
      ]
    };
  }

  var points = [];
  var outcomes = [];

  var allProds = fullIds.map(resolve).filter(Boolean);
  // Verhindert Grün-Flash: IDs da, aber Katalog/CSV noch nicht geladen → Produkte unresolved
  if (allProds.length === 0 && fullIds.length > 0) {
    return {
      status: "empty",
      title: "⏳ Produkte werden geladen…",
      points: [
        "Katalog noch nicht bereit — die Prognose erscheint, sobald die Produkte geladen sind.",
        VERDICT_DISCLAIMER
      ],
      verdict: null,
      flagged: {},
      cabinetHits: []
    };
  }
  allProds.forEach(ensureClassesForRules);

  var pmProds = pm.map(resolve).filter(Boolean);
  var amProds = am.map(resolve).filter(Boolean);

  var hasSPF = amProds.some(function (p) {
    return p && p.kat === "spf";
  }) || allProds.some(function (p) {
    return p && p.kat === "spf";
  });
  var hasActives = allProds.some(function (p) {
    return p && (p.kat === "active" || p.kat === "serum" || p.kat === "spot" || p.rx || isRetinoidProduct(p) || isAcidProduct(p) || isBpoProduct(p));
  });
  var hasMoisturizer = allProds.some(function (p) {
    return p && p.kat === "creme";
  });

  var allHasBpo = allProds.some(isBpoProduct);

  // 1) Intra-Schrank Matrix (same_class, skip_stack, inactivate, alternate_days, …)
  var cabinet = assessCabinetConflicts(allProds, pmProds);
  cabinet.hits.forEach(function (hit) {
    if (hit.code === "bleach") return;
    outcomes.push(hit.outcome);
    points.push(cabinetConflictOneLook(hit));
  });

  // 1b) Profile constraints (Parfüm×sensibel/Baby, NC-Preference, …)
  var profileCab = assessCabinetProfileConstraints(allProds, {
    category: typeof getActiveProfileCategory === "function" ? getActiveProfileCategory() : "adult"
  });
  profileCab.hits.forEach(function (hit) {
    if (hit.outcome === "konflikt" || hit.outcome === "eher_nicht") {
      outcomes.push(hit.outcome);
      points.push(formatVerdictOneLook(hit.outcome, hit.reason));
    }
  });
  cabinet.flagged = mergeCabinetFlagged(cabinet.flagged, profileCab.flagged);

  // 2) Nacht-Reiz-Budget
  if (typeof appState !== "undefined" && appState && appState.useSkinCycling) {
    var modes = [
      { key: "a", name: "Modus A", list: appState.pm_a || [] },
      { key: "b", name: "Modus B", list: appState.pm_b || [] },
      { key: "c", name: "Modus C", list: appState.pm_c || [] }
    ];
    var anyCyclingNightConflict = false;
    modes.forEach(function (m) {
      if (m.list.length > 0) {
        var nRes = assessNightReiz(m.list, null);
        if (nRes && nRes.outcome === "konflikt") {
          anyCyclingNightConflict = true;
          outcomes.push("konflikt");
          points.push(formatVerdictOneLook("konflikt", m.name + ": " + nRes.reason));
        }
      }
    });
    if (!anyCyclingNightConflict && hasActives) {
      points.push(formatVerdictOneLook("passt", "Skin Cycling aktiv: Deine Wirkstoffe sind auf getrennte Abende verteilt (kein Reiz-Stacking)."));
    }
  } else {
    var night = assessNightReiz(pm, null);
    if (night.outcome === "konflikt") {
      var nightKey = "night|" + night.reason;
      var already = points.some(function (pt) {
        return String(pt).indexOf("Retinoid") !== -1 && night.code === "same_class";
      });
      if (!already) {
        outcomes.push("konflikt");
        points.push(formatVerdictOneLook("konflikt", night.reason));
      }
    }
  }

  var day = assessDayReiz(am, pm, null, null);
  if (day.outcome === "eher_nicht" || day.outcome === "konflikt") {
    outcomes.push(day.outcome);
    points.push(formatVerdictOneLook(day.outcome, day.reason));
  }

  if (!hasSPF && hasActives) {
    outcomes.push("eher_nicht");
    points.push(
      formatVerdictOneLook("eher_nicht", "Morgens fehlt LSF — Actives machen lichtempfindlicher (Hinweis).")
    );
  } else if (hasSPF) {
    points.push(formatVerdictOneLook("passt", "Sonnenschutz vorhanden."));
  }

  if (!hasMoisturizer && hasActives) {
    outcomes.push("eher_nicht");
    points.push(
      formatVerdictOneLook("eher_nicht", "Feuchtigkeitslücke neben Actives — Barriere-Support fehlt.")
    );
  } else if (hasMoisturizer) {
    points.push(formatVerdictOneLook("passt", "Feuchtigkeitspflege als Puffer vorhanden."));
  }

  var hasRxTherapy = allProds.some(function (p) {
    return isRxRetinoid(p) || isBpoProduct(p) || (p && (p.rx || p.schiene === "arzneimittel"));
  });
  if (hasRxTherapy) {
    var tipParts = [];
    tipParts.push("ℹ️ Du hast ein Arzneimittel (z. B. Retinoid oder BPO) im Schrank. Die App filtert dann schärfer auf Duft und starke Reizstoffe — das ist Einkaufs-Hilfe, kein Behandlungsplan.");
    tipParts.push("Laut gängiger Begleitpflege (AAD / EuroGuiDerm-Praxis): Haut sanft halten — milde Reinigung, reichhaltige Creme als Puffer, morgens LSF. Kein Extra-Retinol und kein starkes Säure-Peeling dazu stapeln.");
    var missing = [];
    if (!hasMoisturizer) missing.push("eine milde Feuchtigkeitscreme (z. B. mit Panthenol oder Ceramiden, möglichst parfümfrei)");
    if (!hasSPF) missing.push("Sonnenschutz LSF 30–50 für den Morgen");
    var hasGentleWash = allProds.some(function (p) {
      return p && p.kat === "reiniger" && p.ff !== false;
    });
    if (!hasGentleWash) missing.push("eine milde, möglichst parfümfreie Reinigung");
    if (missing.length) {
      tipParts.push("Zusätzlich sinnvoll im Schrank: " + missing.join("; ") + ".");
    } else {
      tipParts.push("Basis ist da (Reinigung/Creme/SPF). Beim Zukauf: eher Support wie Purito Panthenol, CeraVe Creme oder Bioderma Sébium Hydra — nicht noch ein zweites Retinoid.");
    }
    tipParts.forEach(function (t) { points.push(t); });
  }
  if (allHasBpo) {
    points.push("ℹ️ Textil-Hinweis: BPO bleicht Handtücher und Kissenbezüge.");
  }

  // Dedupe identical one-look lines (keep order)
  var seenPt = {};
  points = points.filter(function (pt) {
    var k = String(pt);
    if (seenPt[k]) return false;
    seenPt[k] = true;
    return true;
  });

  var whyNotes = [];
  if (hasRxTherapy) {
    whyNotes.push("ℹ️ Du hast ein Arzneimittel (z. B. Retinoid oder BPO) im Schrank. Die App filtert dann schärfer auf Duft und starke Reizstoffe — das ist Einkaufs-Hilfe, kein Behandlungsplan.");
    whyNotes.push("Laut gängiger Begleitpflege (AAD / EuroGuiDerm-Praxis): Haut sanft halten — milde Reinigung, reichhaltige Creme als Puffer, morgens LSF. Kein Extra-Retinol und kein starkes Säure-Peeling dazu stapeln.");
    if (missing && missing.length) {
      whyNotes.push("Zusätzlich sinnvoll im Schrank: " + missing.join("; ") + ".");
    } else {
      whyNotes.push("Basis ist da (Reinigung/Creme/SPF). Beim Zukauf: eher Support wie Purito Panthenol, CeraVe Creme oder Bioderma Sébium Hydra — nicht noch ein zweites Retinoid.");
    }
  }
  if (allHasBpo) {
    whyNotes.push("ℹ️ Textil-Hinweis: BPO bleicht Handtücher und Kissenbezüge.");
  }

  (cabinet.hits || []).forEach(function (hit) {
    if (hit.outcome === "konflikt" || hit.outcome === "eher_nicht") {
      if (hit.code === "skip_stack") {
        whyNotes.push("Warum kein Stacking am selben Abend? Starke Wirkstoffe überfordern die Hornschicht; getrennte Wechsel-Abende (Skin Cycling) schonen die Barriere.");
      } else if (hit.code === "same_class") {
        whyNotes.push("Warum keine Wirkstoff-Doppelung? Zwei Produkte derselben Klasse verdoppeln nicht den Nutzen, sondern vervielfachen das Irritationsrisiko.");
      } else if (hit.code === "inactivate") {
        whyNotes.push("Warum inkompatibel? Bestimmte Wirkstoffpaare heben ihre Wirkung gegenseitig auf oder zersetzen sich chemisch.");
      }
    }
  });
  (profileCab.hits || []).forEach(function (hit) {
    if (hit.edu) {
      whyNotes.push(hit.edu);
    }
  });

  var overall = outcomes.length ? worstWins.apply(null, outcomes) : "passt";

  if (!whyNotes.length) {
    if (overall === "passt") {
      whyNotes.push("Deine Produkte ergänzen sich ohne chemische Inaktivierung oder übermäßiges Reiz-Stacking. Reinigung, Pflege und Schutz sind aufeinander abgestimmt.");
    } else {
      whyNotes.push("Prüfe die Wirkstoff-Kombinationen und nutze bei Bedarf Wechselabende (Skin Cycling).");
    }
  }

  var seenWhy = {};
  whyNotes = whyNotes.filter(function (wn) {
    var k = String(wn);
    if (seenWhy[k]) return false;
    seenWhy[k] = true;
    return true;
  });

  var shortPoints = points.filter(function (pt) {
    var s = String(pt);
    if (s.length > 130) return false;
    if (/Laut gängiger Begleitpflege|Arzneimittel.*Einkaufs-Hilfe|Beim Zukauf: eher Support|Textil-Hinweis/i.test(s)) return false;
    return true;
  });

  return {
    status: statusFromOutcome(overall),
    verdict: overall,
    title:
      overall === "konflikt"
        ? "🔴 passt schlecht zusammen — Schrank prüfen"
        : overall === "eher_nicht"
          ? "🟡 eher nicht — kleine Anpassung"
          : "🟢 passt — Routine ohne harten Konflikt",
    points: points.length
      ? points
      : [formatVerdictOneLook("passt", "Kein bekannter harter Konflikt in der aktuellen Routine.")],
    shortPoints: shortPoints.length
      ? shortPoints
      : [formatVerdictOneLook(overall, overall === "passt" ? "Routine abgestimmt" : "Schrank anpassen")],
    whyNotes: whyNotes,
    eduNotes: whyNotes,
    disclaimer: VERDICT_DISCLAIMER,
    flagged: cabinet.flagged || {},
    cabinetHits: cabinet.hits || []
  };
}


/**
 * Gegenprüfung eines Produkts (insb. aus Live-Katalog / EAN / Schrank) gegen Hauttyp und Routine.
 * Analysiert:
 * 1. Hauttyp-Fit (aktives Profil, Subtitel z. B. "Akne & Barriere", Tags).
 * 2. Routine-Fit (Wirkstoff-Kollisionen gegen andere Produkte der Morgen-/Abend-Routine).
 * 3. Transparenz über fehlende Händlerdaten (Komedogenität, Duftstoffe, Cruelty-Free).
 */
function evaluateProductCompatibility(productOrId, tab) {
  var resolve = typeof resolveProfileCabinetProduct === "function"
    ? resolveProfileCabinetProduct
    : (typeof resolveCabinetProduct === "function" ? resolveCabinetProduct : function (id) {
        return typeof DB !== "undefined" && DB ? DB[id] : null;
      });

  var p = (productOrId && typeof productOrId === "object") ? productOrId : resolve(productOrId);
  if (!p) {
    return {
      status: "empty",
      verdict: null,
      title: "Produkt nicht gefunden",
      skinTypeFit: { outcome: "passt", points: ["Keine Produktdaten vorhanden."] },
      routineFit: { outcome: "passt", points: ["Keine Produktdaten vorhanden."] },
      missingData: { hasMissing: false, list: [] },
      isLive: false
    };
  }
  ensureClassesForRules(p);

  var activeProf = typeof getActiveProfile === "function" ? getActiveProfile() : null;
  var cat = (activeProf && activeProf.category) || (typeof getActiveProfileCategory === "function" ? getActiveProfileCategory() : "adult");
  var profileName = (activeProf && activeProf.name) || "Aktives Profil";
  var profileSub = (activeProf && activeProf.subtitle) || (typeof getProfileSubtitle === "function" ? getProfileSubtitle(cat) : ((appState && appState.profileSubtitles && appState.profileSubtitles[cat]) || "Akne & Barriere"));
  var tags = (appState && appState.tags) || [];
  var currentTab = tab || (appState && appState.tab) || "am";

  // --- 1. DATENQUALITÄT & LÜCKEN-CHECK ---
  var isLive = !!(p._liveSource || (p.source && /live|mcp|obf|web/i.test(p.source)) || (p.id && /^(dm_|mueller_|live_|obf_)/.test(p.id)));
  var missingList = [];
  if (p.ff == null) missingList.push("Duftstoffe / Parfümierung (keine verifizierten Angaben)");
  if (p.nc == null) missingList.push("Komedogenität (kein Nicht-komedogen-Claim deklariert)");
  if (p.cf == null) missingList.push("Cruelty-Free / Tierversuchsfrei-Zertifikat (kein Verbandssiegel hinterlegt)");

  var hasMissingData = missingList.length > 0;

  // --- 2. HAUTTYP-FIT ---
  var skinOutcomes = [];
  var skinPoints = [];
  var inciAnalysis = typeof analyzeInciComedogenicity === "function" ? analyzeInciComedogenicity(p) : null;

  var isAkneProfile = cat === "teen" || /akne|unrein|zystisch|seborrhoe|oelig|glanz|mitesser/i.test(profileSub) || hasTag("akne-prone") || hasTag("oelig") || hasTag("misch") || hasTag("pref_nc");
  var isSensitiveProfile = cat === "baby" || /sensibel|barriere|rötung|rosazea|parfümfrei/i.test(profileSub) || hasTag("sensibel") || hasTag("duftstofffrei") || hasTag("begleitpflege");

  if (cat === "baby") {
    var klassesBaby = Array.isArray(p.klassen) ? p.klassen : [];
    var isAdultActive = klassesBaby.some(function (k) {
      return /retinoid|bpo|aha|bha|peeling|salicyl|glycolic|ascorbic|azelaic|barrier_stress/.test(k);
    }) || /retinol|retinal|adapalen|tretinoin|benzoyl|peeling|aha 30%|salicylsäure 2%/i.test(p.name || "");

    if (isAdultActive) {
      skinOutcomes.push("konflikt");
      skinPoints.push("🔴 Potente Wirkstoffe (Retinoide/Säuren/BPO) sind für Säuglinge (<3 J.) kontraindiziert.");
    }
    if (p.ff === false) {
      skinOutcomes.push("konflikt");
      skinPoints.push("🔴 Enthält Parfüm/Duftstoffe: Im Baby-Profil gilt strikte Parfümfrei-Prio (Allergie-Risiko).");
    } else if (p.ff == null) {
      skinOutcomes.push("eher_nicht");
      skinPoints.push("🟡 Parfümierung offen: Im Online-Katalog liegen keine verifizierten Angaben zur Duftstofffreiheit vor. Für Babys nur bestätigte parfümfreie Produkte empfohlen.");
    } else {
      skinPoints.push("🟢 100% Parfümfrei: Erfüllt die pädiatrische Empfehlung für Säuglingshaut.");
    }
    if (p.u3 === false) {
      skinOutcomes.push("eher_nicht");
      skinPoints.push("🟡 Nicht für Säuglinge (<3 Jahre) ausgewiesen.");
    }
  } else if (cat === "child") {
    var klassesChild = Array.isArray(p.klassen) ? p.klassen : [];
    var isChildAdultActive = klassesChild.some(function (k) {
      return /retinoid|bpo|aha|bha|peeling|salicyl|glycolic|ascorbic|azelaic/.test(k);
    }) || /retinol|retinal|adapalen|tretinoin|benzoyl|peeling|aha 30%|salicylsäure 2%/i.test(p.name || "");

    if (isChildAdultActive) {
      skinOutcomes.push("konflikt");
      skinPoints.push("🔴 Intensive Wirkstoffe (Retinoide/chemische Säurepeelings/BPO) sind vor der Pubertät ungeeignet.");
    }
    if (p.ff === false) {
      skinOutcomes.push("eher_nicht");
      skinPoints.push("🟡 Enthält Duftstoffe: Bei Kinderhaut wird duftstoffarme Pflege bevorzugt.");
    } else if (p.ff == null) {
      skinPoints.push("ℹ️ Duftstoffe offen: Im Katalog nicht deklariert.");
    } else {
      skinPoints.push("🟢 Parfümfrei: Schont die junge Hautbarriere.");
    }
  } else {
    // Adult & Teen
    // a) Evidenzbasierte Komedogenitätsprüfung (Skala 0–5 nach Fulton/Kligman/Draelos)
    if (inciAnalysis) {
      if (isAkneProfile) {
        if (inciAnalysis.maxScore >= 4) {
          skinOutcomes.push("konflikt");
          var badList = inciAnalysis.highRisk.map(function(h) { return h.name + " (" + h.score + "/5)"; }).join(", ");
          skinPoints.push("🔴 Stark porenverstopfend (Komedogenität " + inciAnalysis.maxScore + "/5): Enthält " + badList + ". Bei Akne/öliger Haut kontraindiziert (triggert Acne cosmetica & Mikrokomedonen)!");
        } else if (inciAnalysis.maxScore === 3) {
          skinOutcomes.push("eher_nicht");
          var modList = inciAnalysis.moderateRisk.map(function(m) { return m.name + " (" + m.score + "/5)"; }).join(", ");
          skinPoints.push("🟡 Mäßig komedogen (Score 3/5): Enthält " + modList + ". Bei Neigung zu Unreinheiten und Seborrhoe ungeeignet.");
        } else if (inciAnalysis.maxScore === 2) {
          skinPoints.push("🟡 Leichtes Risiko (Score 2/5): Enthält milde Lipide/Fettalkohole (" + (inciAnalysis.lowRisk.map(function(l) { return l.name; }).join(", ") || "Fettphase") + "). Bei schwerer Akne beobachten.");
        } else {
          skinPoints.push("🟢 Porenfreundlich (Score " + inciAnalysis.maxScore + "/5): Keine porenverstopfenden Inhaltsstoffe in der INCI nachgewiesen.");
        }

        // Spezifische Warnung für zystische Akne (Algenextrakte, Carrageenan, Squalen-Oxidation, schwere Ester)
        if (inciAnalysis.hasCysticTrigger) {
          skinOutcomes.push("konflikt");
          var cNames = inciAnalysis.cysticTriggers.map(function(c) { return c.name; }).join(", ");
          skinPoints.push("🔴 Zystische Akne-Warnung: Enthält Inhaltsstoffe mit hohem Risiko für zystische Follikelschwellungen & Gewebsrupturen (" + cNames + "). Bei Neigung zu entzündlichen Unterlagerungen und Zysten strikt kontraindiziert!");
        }

        // Galenik- & Texturbewertung für Akne / Ölige Haut (Hydrogele/Gel-Cremes vs. Slugging-Balsame)
        var tex = inciAnalysis.textureEval;
        if (tex) {
          if (tex.isContraindicatedForAcne) {
            skinOutcomes.push("eher_nicht");
            skinPoints.push("⚠️ Textur-Warnung (Slugging- & Okklusions-Risiko): " + (tex.warning || "Schwere Balsame/Salben erzeugen ein anaerobes Milieu, in dem sich C. acnes vermehrt und Follikelrupturen (Zysten) begünstigt werden.") + " Empfehlung: Wechsle zu einem leichten Hydrogel oder einer ölfreien Gel-Creme.");
          } else if (tex.isOptimalForAcne) {
            skinPoints.push("💧 Ideale Textur für Akne & ölige Haut: " + tex.label + " – " + tex.explanation);
          }
        }

        // Transparenz-Hinweis: Unregulierter EU-Claim vs. INCI-Wahrheit
        if (p.nc === true && inciAnalysis.maxScore >= 3) {
          skinPoints.push("⚠️ Irreführender Claim: Packung wirbt mit 'nicht komedogen', enthält laut INCI jedoch porenverstopfende Stoffe (" + inciAnalysis.flagged.filter(function(f){ return f.score >= 3; }).map(function(f){ return f.name; }).join(", ") + "). Der Begriff ist in der EU nicht geschützt!");
        }
      } else if (hasTag("trocken") || /trocken|barriere/i.test(profileSub)) {
        if (inciAnalysis.maxScore >= 2 && inciAnalysis.maxScore <= 3) {
          skinPoints.push("🟢 Reichhaltige Barriere-Lipide (Score " + inciAnalysis.maxScore + "/5): Für trockene Haut physiologisch wertvoll zur Reparatur des transepidermalen Wasserverlusts (TEWL).");
        } else if (inciAnalysis.maxScore >= 4) {
          skinPoints.push("ℹ️ Sehr reichhaltige Okklusion (Score " + inciAnalysis.maxScore + "/5 durch " + (inciAnalysis.highRisk.map(function(h){ return h.name; }).join(", ") || "Lipide") + "). Gut für trockene Barriere, bei verstopften Poren sparsam dosieren.");
        } else {
          skinPoints.push("🟢 Nicht komedogen (Score " + inciAnalysis.maxScore + "/5): Reizarme Feuchtigkeitspflege.");
        }
        if (inciAnalysis.textureEval && (inciAnalysis.textureEval.type === "balm" || inciAnalysis.textureEval.type === "creme_rich")) {
          skinPoints.push("🟢 Reichhaltige Balsam-/Creme-Textur: Bietet intensive Lipidschutz-Okklusion gegen Feuchtigkeitsverlust.");
        }
      } else {
        // Normale / ausgeglichene Haut
        if (inciAnalysis.maxScore >= 4) {
          skinPoints.push("🟡 Reichhaltige Okklusion (Score " + inciAnalysis.maxScore + "/5): Enthält schwere Lipide/Ester.");
        } else {
          skinPoints.push(inciAnalysis.label + ": " + inciAnalysis.suitability);
        }
      }
    } else if (isAkneProfile) {
      if (p.nc === true) {
        skinPoints.push("🟢 Nicht-komedogen bestätigt: Offizieller Hersteller-Claim gegen porenverstopfende Stoffe.");
      } else if (p.nc === false) {
        skinOutcomes.push("eher_nicht");
        skinPoints.push("🟡 Nicht als komedogenarm ausgewiesen: Kann bei Neigung zu Unreinheiten porenverstopfend wirken.");
      } else {
        skinPoints.push("ℹ️ Komedogenität offen: Im Online-Katalog liegt kein offizieller Nicht-Komedogen-Claim vor. Bei unreiner Haut vorab INCI prüfen.");
      }
    }

    // b) Duftstoffe
    if (p.ff === true) {
      skinPoints.push("🟢 Parfümfrei: Reizarme Formulierung ohne Duftstoffe – optimal für empfindliche Hautbarriere.");
    } else if (p.ff === false) {
      if (isSensitiveProfile) {
        skinOutcomes.push("eher_nicht");
        skinPoints.push("🟡 Enthält Parfüm/Duftstoffe: Kann eine beanspruchte Hautbarriere zusätzlich irritieren.");
      } else {
        skinPoints.push("ℹ️ Enthält Parfüm/Duftstoffe.");
      }
    } else {
      if (isSensitiveProfile) {
        skinPoints.push("ℹ️ Duftstoffe offen: Im Online-Katalog liegen keine verifizierten Angaben zur Parfümierung vor. Bei sensibler Haut vorab INCI prüfen.");
      } else {
        skinPoints.push("ℹ️ Duftstoffe offen: Keine Händlerangaben hinterlegt.");
      }
    }

    // c) Cruelty-Free
    if (p.cf === true) {
      skinPoints.push("🟢 Cruelty-Free: Verifiziert tierversuchsfrei (" + (p.cf_basis || "Leaping Bunny / Verbandssiegel") + ").");
    } else if (p.cf === false) {
      skinPoints.push("ℹ️ Cruelty-Free: Kein Nachweis hinterlegt.");
    } else {
      skinPoints.push("ℹ️ Cruelty-Free offen: Kein Verbandssiegel im Online-Katalog hinterlegt (gesetzliches EU-Tierversuchsverbot gilt).");
    }
  }

  // --- 3. ROUTINE-FIT (Gegenprüfung gegen Schrank / AM / PM) ---
  var routineOutcomes = [];
  var routinePoints = [];

  var currentSlotIds = [];
  if (cat === "adult") {
    currentSlotIds = (currentTab === "am" ? (appState.am || []) : (typeof getActivePMList === "function" ? getActivePMList() : (appState.pm_a || [])));
  } else if (cat === "teen") {
    var t = appState.teen || {};
    currentSlotIds = [].concat(t.reiniger || [], t.active || [], t.creme || [], t.spf || []);
  } else if (cat === "child") {
    var c = appState.child || {};
    currentSlotIds = [].concat(c.reiniger || [], c.creme || [], c.spf || [], c.haar || []);
  } else if (cat === "baby") {
    var b = appState.baby || {};
    currentSlotIds = [].concat(b.reiniger || [], b.creme || [], b.windel || [], b.spf || []);
  }

  var otherProds = currentSlotIds
    .filter(function (id) { return id !== p.id; })
    .map(resolve)
    .filter(Boolean);
  otherProds.forEach(ensureClassesForRules);

  if (otherProds.length > 0) {
    var hasConflictPair = false;
    var hasWarnPair = false;
    otherProds.forEach(function (other) {
      if (typeof checkPairRules === "function") {
        var hit = checkPairRules(p, [other], { slot: currentTab });
        if (hit) {
          if (hit.outcome === "konflikt") {
            hasConflictPair = true;
            routineOutcomes.push("konflikt");
            routinePoints.push("🔴 passt schlecht zusammen mit " + other.name + ": " + hit.reason);
          } else if (hit.outcome === "eher_nicht") {
            hasWarnPair = true;
            routineOutcomes.push("eher_nicht");
            routinePoints.push("🟡 Im Wechsel anwenden mit " + other.name + ": " + hit.reason);
          }
        }
      }
    });

    if (!hasConflictPair && !hasWarnPair) {
      routinePoints.push("🟢 Keine Wirkstoff-Kollisionen mit deinen anderen Produkten in der " + (currentTab === "am" ? "Morgen" : "Abend") + "-Routine.");
    }
  } else {
    routinePoints.push("🟢 Erstes Produkt in diesem Routine-Bereich – keine Kollisionen vorhanden.");
  }

  if (currentTab === "am" && isRetinoidProduct(p)) {
    routineOutcomes.push("eher_nicht");
    routinePoints.push("🟡 Retinoide werden standardmäßig abends empfohlen (UV-Empfindlichkeit).");
  }

  var allOutcomes = skinOutcomes.concat(routineOutcomes);
  var overall = allOutcomes.length ? worstWins.apply(null, allOutcomes) : "passt";

  return {
    status: statusFromOutcome(overall),
    verdict: overall,
    title: overall === "konflikt"
      ? "🔴 passt schlecht zusammen"
      : (overall === "eher_nicht" ? "🟡 eher nicht" : "🟢 passt"),
    skinTypeFit: {
      profileName: profileName,
      skinSub: profileSub,
      category: cat,
      points: skinPoints
    },
    routineFit: {
      tab: currentTab,
      points: routinePoints
    },
    missingData: {
      hasMissing: hasMissingData,
      isLive: isLive,
      list: missingList
    },
    comedogenicity: inciAnalysis,
    product: p
  };
}


// --- Spec quiz-tags-soc-pih: Schnell-Concerns + sichtbares Reiz-Budget ---

var CONCERN_QUICK_TAGS = [
  { id: "skin-of-color", label: "Skin-of-Color", hint: "Mehr Melanin / Phototyp IV-VI (Einkaufsfilter)" },
  { id: "pih-prone", label: "PIH-prone", hint: "Neigung zu dunklen Pickelmalen" },
  { id: "akne-prone", label: "Akne-prone", hint: "Unreinheiten — ohne Arzt-Therapie" },
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
  else if (typeof renderStartScreen === "function" && appState.view === "start") renderStartScreen();
  else if (typeof renderMain === "function") renderMain(false);
}

function renderConcernQuickHtml() {
  var chips = CONCERN_QUICK_TAGS.map(function (c) {
    var on = hasTag(c.id);
    return '<button type="button" class="start-pill-btn concern-chip ' + (on ? "active" : "") +
      '" title="' + c.hint + '" onclick="toggleConcernTag(\'' + c.id + '\')" style="font-size:0.78rem">' +
      (on ? "✓ " : "") + c.label + "</button>";
  }).join("");
  return '<div class="start-profile-card" style="margin-bottom:0.75rem">' +
    '<div class="start-profile-head"><span class="start-profile-label">3. Concerns (Einkauf — keine Diagnose)</span></div>' +
    '<p style="font-size:0.76rem;color:var(--muted);margin:0 0 0.45rem;line-height:1.4">Tipp zum An/Aus. Steuert Scan &amp; Schrank-Hinweise. ' +
    (typeof VERDICT_DISCLAIMER !== "undefined" ? VERDICT_DISCLAIMER : "Keine Therapie.") + "</p>" +
    '<div class="start-pills-row" style="gap:6px;flex-wrap:wrap">' + chips + "</div></div>";
}

function getReizBudgetSummary() {
  var am = (typeof appState !== "undefined" && appState && appState.am) ? appState.am.slice() : [];
  var pm = (typeof getActivePMList === "function") ? getActivePMList().slice() : [];
  var nightW = 0;
  var dayW = 0;
  function addW(ids, bucket) {
    (ids || []).forEach(function (id) {
      var p = (typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(id) : null)
        || (typeof resolveProfileCabinetProduct === "function" ? resolveProfileCabinetProduct(id) : null)
        || (typeof DB !== "undefined" && DB ? DB[id] : null);
      var w = typeof reizWeightForProduct === "function" ? reizWeightForProduct(p) : 0;
      if (bucket === "pm") nightW += w;
      dayW += w;
    });
  }
  addW(am, "am");
  addW(pm, "pm");
  var night = typeof assessNightReiz === "function" ? assessNightReiz(pm, null) : { outcome: "passt", reason: "" };
  var day = typeof assessDayReiz === "function" ? assessDayReiz(am, pm, null, null) : { outcome: "passt", reason: "" };
  var level = "ok";
  if ((night && night.outcome === "konflikt") || (day && day.outcome === "konflikt")) level = "hot";
  else if ((night && night.outcome === "eher_nicht") || (day && day.outcome === "eher_nicht") || nightW >= 3 || dayW >= 4) level = "warn";
  var label = level === "hot" ? "Reiz-Budget: kritisch" : (level === "warn" ? "Reiz-Budget: angespannt" : "Reiz-Budget: entspannt");
  var tip = "Heuristik fuer Einkauf & Layering — keine Therapie.";
  if (level === "hot") tip = (night && night.reason) || (day && day.reason) || "Starke Actives besser trennen oder wechseln.";
  else if (level === "warn") tip = (day && day.reason) || (night && night.reason) || "Viel Active heute — Support & Abstand helfen.";
  else if (nightW === 0 && dayW === 0) tip = "Noch keine starken Actives im Schrank — Budget frei.";
  return {
    level: level,
    label: label,
    tip: tip,
    nightWeight: nightW,
    dayWeight: dayW,
    night: night,
    day: day
  };
}

function renderReizBudgetCardHtml() {
  var s = getReizBudgetSummary();
  var bg = s.level === "hot" ? "#fef2f2" : (s.level === "warn" ? "#fff7ed" : "#ecfdf5");
  var bd = s.level === "hot" ? "#fecaca" : (s.level === "warn" ? "#fed7aa" : "#a7f3d0");
  var fg = s.level === "hot" ? "#991b1b" : (s.level === "warn" ? "#9a3412" : "#065f46");
  return '<div class="reiz-budget-card" style="margin:0.65rem 0 0.85rem;padding:10px 12px;border-radius:10px;border:1px solid ' + bd +
    ";background:" + bg + ";color:" + fg + '">' +
    '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center">' +
    '<strong style="font-size:0.88rem">' + s.label + "</strong>" +
    '<span style="font-size:0.72rem;opacity:0.9">Nacht ' + s.nightWeight + " · Tag " + s.dayWeight + " (Heuristik)</span></div>" +
    '<div style="font-size:0.78rem;margin-top:4px;line-height:1.35;color:var(--ink)">' + s.tip + "</div>" +
    '<div style="font-size:0.7rem;color:var(--muted);margin-top:4px">Keine Therapie — nur Layering-Hinweis.</div></div>';
}

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
  window.getReizBudgetSummary = getReizBudgetSummary;
  window.renderReizBudgetCardHtml = renderReizBudgetCardHtml;
  window.cabinetHasIronOxideSpf = cabinetHasIronOxideSpf;
  window.renderIronOxideGapHtml = renderIronOxideGapHtml;
  window.hasTag = hasTag;
}


