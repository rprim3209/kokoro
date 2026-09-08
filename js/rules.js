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
  unklar: ["unklar", "ausgeglichen", "eigene routine"]
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
  if (typeof appState !== "undefined" && appState && appState.category) return appState.category;
  return "adult";
}

function isBabyProfile() {
  return getActiveProfileCategory() === "baby";
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
  var label = o === "konflikt" ? "Konflikt" : o === "eher_nicht" ? "eher nicht" : "passt";
  var grund = String(reason || "").trim();
  return emoji + " " + label + (grund ? " — " + grund : "");
}

function outcomeTitle(outcome) {
  var o = normalizeOutcome(outcome) || "passt";
  if (o === "konflikt") return "🔴 Konflikt";
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
    var p = typeof DB !== "undefined" ? DB[id] : null;
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
function productHasClass(p, klass) {
  return !!(p && Array.isArray(p.klassen) && p.klassen.indexOf(klass) !== -1);
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
  return productHasClass(p, "retinoid_cos") && !p.rx;
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
        if (ctx && ctx.slot === "pm") {
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
        if (ctx && ctx.slot === "pm") {
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
        return "Nicht am selben Abend wie dein Retinoid — lieber getrennte Tage (Skin Cycling).";
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
  var hasPerfume = candidate.ff === false;
  var fragranceFree = candidate.ff === true;

  if (hasArztThema() && isCosmeticActiveUpsell(candidate)) {
    return makeDim(
      "konflikt",
      "Arzt-Thema erkannt — kein Serum-/Active-Upsell. Basispflege weiter scannen ok.",
      "arzt_upsell"
    );
  }

  if (isBabyProfile() && hasPerfume) {
    return makeDim(
      "konflikt",
      "Für unter 3: parfümierte Leave-ons meiden.",
      "baby_perfume"
    );
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

  var quizSparse =
    !hasTag("trocken") &&
    !hasTag("oelig") &&
    !hasTag("misch") &&
    !hasTag("sensibel") &&
    !hasTag("akne-prone");
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
    return typeof DB !== "undefined" ? DB[id] : null;
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
    return isRetinoidProduct(typeof DB !== "undefined" ? DB[id] : null);
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

function calculatePrognosis() {
  var am = (typeof appState !== "undefined" && appState.am) || [];
  var pm = typeof getActivePMList === "function" ? getActivePMList() : [];
  var all = am.concat(pm);
  var layering = getLayeringProductIds();

  if (layering.length === 0) {
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

  if (layering.length === 1) {
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

  var allProds = all.map(function (id) {
    return typeof DB !== "undefined" ? DB[id] : null;
  }).filter(Boolean);
  var pmProds = pm.map(function (id) {
    return typeof DB !== "undefined" ? DB[id] : null;
  }).filter(Boolean);
  var amProds = am.map(function (id) {
    return typeof DB !== "undefined" ? DB[id] : null;
  }).filter(Boolean);

  var hasSPF = amProds.some(function (p) {
    return p && p.kat === "spf";
  });
  var hasActives = allProds.some(function (p) {
    return p && (p.kat === "active" || p.kat === "serum" || p.kat === "spot" || p.rx);
  });
  var hasMoisturizer = allProds.some(function (p) {
    return p && p.kat === "creme";
  });

  var rxRetinoids = allProds.filter(isRxRetinoid);
  var cosRetinoids = allProds.filter(isCosmeticRetinoid);
  var pmHasBpo = pmProds.some(isBpoProduct);
  var pmHasRet = pmProds.some(isRetinoidProduct);
  var allHasBpo = allProds.some(isBpoProduct);
  var allHasAbTop = allProds.some(isAntibioticProduct);

  var night = assessNightReiz(pm, null);
  if (night.outcome === "konflikt") {
    outcomes.push("konflikt");
    points.push(formatVerdictOneLook("konflikt", night.reason));
  }

  // Redundanz: Retinoide
  if (rxRetinoids.length > 0 && cosRetinoids.length > 0) {
    outcomes.push("konflikt");
    points.push(
      formatVerdictOneLook(
        "konflikt",
        "Zwei Retinoide im Schrank (medizinisches Retinoid + kosmetisches Retinol) — mehr Reiz ohne Zusatznutzen."
      )
    );
  } else if (rxRetinoids.length > 1) {
    outcomes.push("konflikt");
    points.push(
      formatVerdictOneLook(
        "konflikt",
        "Zwei medizinische Retinoide im Schrank — doppelte Dosierung ohne Zusatznutzen."
      )
    );
  } else if (cosRetinoids.length > 1) {
    outcomes.push("konflikt");
    points.push(
      formatVerdictOneLook(
        "konflikt",
        "Zwei kosmetische Retinoide im Schrank — redundante Wirkung."
      )
    );
  }

  // Gleicher Abend BPO + Retinoid
  if (pmHasBpo && pmHasRet) {
    outcomes.push("konflikt");
    points.push(
      formatVerdictOneLook(
        "konflikt",
        "BPO und Retinoid nicht am selben Abend schichten — lieber an getrennten Tagen im Wechsel anwenden."
      )
    );
  }

  // Resistenz-Gefahr: Topisches Antibiotikum ohne BPO
  if (allHasAbTop && !allHasBpo) {
    outcomes.push("eher_nicht");
    points.push(
      formatVerdictOneLook(
        "eher_nicht",
        "Topisches Antibiotikum ohne BPO in der Routine — Resistenzgefahr, ärztlich abklären."
      )
    );
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
    points.push("ℹ️ Begleitpflege: Rx-Wirkstoff erkannt — Reizstoff-Filter aktiver. Kein Therapie-Schema.");
  }
  if (allHasBpo) {
    points.push("ℹ️ Textil-Hinweis: BPO bleicht Handtücher und Kissenbezüge.");
  }

  var overall = outcomes.length ? worstWins.apply(null, outcomes) : "passt";
  return {
    status: statusFromOutcome(overall),
    verdict: overall,
    title: overall === "passt" ? "🟢 passt — Routine ohne harten Konflikt" : outcomeTitle(overall),
    points: points.length
      ? points
      : [formatVerdictOneLook("passt", "Kein bekannter harter Konflikt in der aktuellen Routine.")],
    disclaimer: VERDICT_DISCLAIMER
  };
}
