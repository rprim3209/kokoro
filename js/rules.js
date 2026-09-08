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
  if (p.id === "adap" || (p.rx && kl.indexOf("retinoid_rx") !== -1)) w = Math.max(w, 2);
  if (p.id === "clienzo" || kl.indexOf("bpo") !== -1) w = Math.max(w, 2);
  if (p.kat === "active" || p.kat === "spot") w = Math.max(w, 1);
  return w;
}

function productHasClass(p, klass) {
  return !!(p && p.klassen && p.klassen.indexOf(klass) !== -1);
}

function isRetinoidProduct(p) {
  if (!p) return false;
  if (p.id === "adap" || p.id === "retinol") return true;
  return productHasClass(p, "retinoid_rx") || productHasClass(p, "retinoid_cos");
}

function isBpoProduct(p) {
  if (!p) return false;
  if (p.id === "clienzo") return true;
  return productHasClass(p, "bpo") || productHasClass(p, "ab_top");
}

function isAcidProduct(p) {
  return productHasClass(p, "aha") || productHasClass(p, "bha");
}

/**
 * Nacht-Stack: ≥ Schwelle aus zwei Reizklassen → Konflikt (skip_stack).
 * Adapalen×BPO = Reiz/skip_stack, NIEMALS inactivate.
 */
function assessNightReiz(pmIds, candidate) {
  var ids = (pmIds || []).slice();
  if (candidate && candidate.id && ids.indexOf(candidate.id) === -1) ids.push(candidate.id);
  var classes = {};
  var weight = 0;
  ids.forEach(function (id) {
    var p = id === (candidate && candidate.id) ? candidate : DB[id];
    if (!p) return;
    weight += reizWeightForProduct(p);
    (p.klassen || []).forEach(function (k) {
      classes[k] = true;
    });
    if (p.id === "adap") classes.retinoid_rx = true;
    if (p.id === "clienzo") {
      classes.bpo = true;
      classes.ab_top = true;
    }
    if (p.id === "retinol") classes.retinoid_cos = true;
  });
  var hasRet =
    classes.retinoid_rx || classes.retinoid_cos || ids.indexOf("adap") !== -1 || ids.indexOf("retinol") !== -1;
  var hasAcid = classes.aha || classes.bha;
  var hasBpo = classes.bpo || classes.ab_top || ids.indexOf("clienzo") !== -1;
  var sharp = hasTag("begleitpflege") || hasTag("barrier") || hasTag("sensibel");
  var threshold = sharp ? 3 : 4;

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
  if (weight >= threshold && (hasRet || hasAcid || hasBpo)) {
    return makeDim(
      "konflikt",
      "Reiz-Budget der Nacht überschritten — starke Actives besser trennen.",
      "skip_stack"
    );
  }
  return makeDim("passt", "Kein hartes Nacht-Stacking erkannt.", "ok");
}

/**
 * Tageslast AM+PM: Clienzo AM + Adapalen PM → eher nicht (Default);
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
  var amHeavy = am.some(function (id) {
    var p = candidate && id === candidate.id ? candidate : DB[id];
    return reizWeightForProduct(p) >= 2;
  });
  var pmHeavy = pm.some(function (id) {
    var p = candidate && id === candidate.id ? candidate : DB[id];
    return reizWeightForProduct(p) >= 2;
  });
  var amBpo = am.some(function (id) {
    var p = candidate && id === candidate.id ? candidate : DB[id];
    return isBpoProduct(p);
  });
  var pmRet = pm.some(function (id) {
    var p = candidate && id === candidate.id ? candidate : DB[id];
    return isRetinoidProduct(p);
  });
  var sharp = hasTag("begleitpflege") && (hasTag("barrier") || hasTag("sensibel"));

  if (amBpo && pmRet) {
    return makeDim(
      sharp ? "konflikt" : "eher_nicht",
      "Viel Active an einem Tag (z. B. Clienzo-Spot morgens + Adapalen abends). Nicht weil Adapalen×BPO „nie geht“ — sondern zwei Reiz-Mittel ohne Fertiggalenik.",
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
  var hasRxRetinoid =
    currentPM.indexOf("adap") !== -1 ||
    ((appState.pm_a || []).indexOf("adap") !== -1) ||
    am.concat(currentPM).some(function (id) {
      return isRetinoidProduct(DB[id]);
    });
  var hasBPO =
    currentPM.indexOf("clienzo") !== -1 ||
    ((appState.pm_b || []).indexOf("clienzo") !== -1) ||
    am.concat(currentPM).some(function (id) {
      return isBpoProduct(DB[id]);
    });

  // same_class Retinoid
  if (productHasClass(candidate, "retinoid_cos") && hasRxRetinoid) {
    return makeDim(
      "konflikt",
      "Gleiche Wirkstoffklasse (Retinoid) schon im Schrank — mehr Reiz ohne Zusatznutzen.",
      "same_class"
    );
  }

  // Night stack hypothetisch wenn Kandidat abends landet
  var night = assessNightReiz(currentPM, candidate);
  if (night.outcome === "konflikt") return night;

  // AHA/BHA vs Retinoid → eher nicht / alternate wenn nicht schon konflikt
  if (isAcidProduct(candidate) && hasRxRetinoid) {
    return makeDim(
      "eher_nicht",
      "Nicht am selben Abend wie dein Retinoid — lieber getrennte Tage (Skin Cycling).",
      "alternate_days"
    );
  }

  var day = assessDayReiz(am, currentPM, candidate, null);
  if (day.outcome === "eher_nicht" || day.outcome === "konflikt") return day;

  if (candidate.ff === false && (hasRxRetinoid || hasBPO || hasTag("begleitpflege"))) {
    return makeDim(
      "eher_nicht",
      "Parfüm neben Rx/Retinoid — Begleitpflege eher reizarm halten.",
      "begleit_barrier"
    );
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
  if (isAcidProduct(candidate) && currentPM.indexOf("adap") !== -1) {
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
  var am = appState.am || [];
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

  var hasSPF = am.some(function (id) {
    return DB[id] && DB[id].kat === "spf";
  });
  var hasActives = all.some(function (id) {
    return DB[id] && (DB[id].kat === "active" || DB[id].kat === "serum" || DB[id].rx);
  });
  var hasMoisturizer = all.some(function (id) {
    return DB[id] && DB[id].kat === "creme";
  });
  var hasAdap = all.indexOf("adap") !== -1;
  var hasClienzo = all.indexOf("clienzo") !== -1;
  var hasRetinol = all.indexOf("retinol") !== -1;
  var hasAHA = pm.some(function (id) {
    return DB[id] && DB[id].klassen && DB[id].klassen.indexOf("aha") !== -1;
  });
  var hasBHA = pm.some(function (id) {
    return DB[id] && DB[id].klassen && DB[id].klassen.indexOf("bha") !== -1;
  });

  var night = assessNightReiz(pm, null);
  if (night.outcome === "konflikt") {
    outcomes.push("konflikt");
    points.push(formatVerdictOneLook("konflikt", night.reason));
  }

  if (hasAdap && hasRetinol) {
    outcomes.push("konflikt");
    points.push(
      formatVerdictOneLook(
        "konflikt",
        "Zwei Retinoide: Adapalen und kosmetisches Retinol — mehr Reiz ohne Zusatznutzen."
      )
    );
  }

  // Gleicher Abend Clienzo+Adap (exklusiver Wechsel bleibt)
  if (pm.indexOf("clienzo") !== -1 && pm.indexOf("adap") !== -1) {
    outcomes.push("konflikt");
    points.push(
      formatVerdictOneLook(
        "konflikt",
        "Clienzo und Adapalen nicht am selben Abend schichten — Modus A ‖ Modus B im Wechsel."
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

  if (hasAdap || hasClienzo) {
    points.push("ℹ️ Begleitpflege: Rx erkannt — Reizstoff-Filter aktiver. Kein Therapie-Schema.");
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
