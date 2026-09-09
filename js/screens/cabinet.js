// ==========================================
// Cabinet Screen Module (Mein Schrank)
// ==========================================


function resolveProfileCabinetProduct(id) {
  if (!id) return null;
  if (typeof resolveCabinetProduct === "function") {
    var resolved = resolveCabinetProduct(id);
    if (resolved) return resolved;
  }
  if (typeof TEEN_DB === "object" && TEEN_DB[id]) return TEEN_DB[id];
  if (typeof BABY_DB === "object" && BABY_DB[id]) return BABY_DB[id];
  if (typeof DB === "object" && DB[id]) return DB[id];
  if (typeof appState === "object" && appState.customProducts && appState.customProducts[id]) {
    return appState.customProducts[id];
  }
  return null;
}

function loadBabyPreset() {
  const pick = (prefs, slot) => (typeof pickCountryAvailableId === "function"
    ? pickCountryAvailableId(prefs, BABY_DB, slot)
    : prefs[0]);
  appState.baby = {
    reiniger: [pick(["b_ean_3560071348069", "b_item_10"], "reiniger")].filter(Boolean),
    creme: [pick(["b_item_10", "b_ean_3282779300551", "b_ean_3337872412998"], "creme")].filter(Boolean),
    windel: [pick(["b_ean_3286011092310", "b_item_23"], "windel")].filter(Boolean),
    spf: [pick(["b_ean_3760075074227", "b_ean_20231460"], "spf")].filter(Boolean)
  };
  saveState();
  renderMain();
}

function loadChildPreset() {
  appState.child = {
    reiniger: ["b_ean_3560071348069"], // Gel lavant 2 in 1
    creme: ["b_ean_5060447948674"],    // Face cream Fragrance Free (Childs cream - ff, u3, cf)
    spf: ["b_ean_20231460"],           // Crème solaire enfant FPS50+ (Cien - ff, u3, cf)
    haar: ["b_ean_3574660536522"]      // First Touch Shampoo (Natusan - ff, u3)
  };
  saveState();
  renderMain();
}

function clearBabyCabinet() {
  appState.baby = { reiniger: [], creme: [], windel: [], spf: [] };
  saveState();
  renderMain();
  showToast("Baby-Schrank geleert.");
}

function clearChildCabinet() {
  appState.child = { reiniger: [], creme: [], spf: [], haar: [] };
  saveState();
  renderMain();
  showToast("Kinder-Schrank geleert.");
}

function addBabyProduct(prodId, profile, slot) {
  const p = BABY_DB[prodId];
  if (!p) return;
  const targetProfile = profile || appState.profile;
  let targetSlot = slot;
  if (!targetSlot || targetSlot === "all") {
    if (p.slot === "bad") targetSlot = "reiniger";
    else if (p.slot === "windel") targetSlot = (targetProfile === "baby" ? "windel" : "creme");
    else if (p.slot === "haar") targetSlot = (targetProfile === "child" ? "haar" : "reiniger");
    else if (p.slot === "spf") targetSlot = "spf";
    else targetSlot = "creme";
  }
  if (!appState[targetProfile][targetSlot]) {
    appState[targetProfile][targetSlot] = [];
  }
  if (!appState[targetProfile][targetSlot].includes(prodId)) {
    appState[targetProfile][targetSlot].push(prodId);
  }
  saveState();
  closeModal();
  renderMain();
}

function removeBabyProduct(prodId, profile, slot) {
  const targetProfile = profile || appState.profile;
  if (appState[targetProfile] && appState[targetProfile][slot]) {
    appState[targetProfile][slot] = appState[targetProfile][slot].filter(id => id !== prodId);
    saveState();
    renderMain();
  }
}


/** Shared unified verdict card for Adult, Teen, Child, and Baby.
 * - Single concise banner on conflict/warning (no triple repetition!)
 * - Short bullet list for quick checks/cautions (no long text walls)
 * - Expandable "Warum?" details accordion for clinical guidelines, background, & rationale
 */
function renderCategoryPrognosisBanner(prog, opts) {
  opts = opts || {};
  var accent = opts.accent || "#1d4ed8";
  var countLabel = opts.countLabel || "Produkte";
  var totalCount = opts.totalCount !== undefined ? opts.totalCount : 0;
  if (!prog || prog.empty || prog.status === "empty") {
    return `
    <div class="prognosis-card empty" style="border-left-color:${accent}">
      <div class="prognosis-header">
        <div class="prognosis-title">Noch keine Produkte — Scan oder Beispiel</div>
        <span style="font-size:0.75rem;color:var(--muted);font-weight:600">0 ${countLabel}</span>
      </div>
      <ul class="prognosis-list">
        <li>Füge Produkte hinzu oder tippe auf <strong>Beispiel</strong> — dann erscheint hier passt / eher nicht / Konflikt.</li>
      </ul>
    </div>`;
  }

  var statusClass = prog.status || "ok";
  var verdict = prog.verdict || "passt";

  // 1. Kurze Meldung oben: Genau EINE prägnante Meldung bei Konflikt oder Warnung
  var bannerHtml = "";
  var primaryAlertClean = "";

  if (verdict === "konflikt" || verdict === "eher_nicht") {
    var rawReason = "";
    if (prog.topAlert) {
      rawReason = prog.topAlert;
    } else if (prog.points && prog.points.length > 0) {
      var matchPt = prog.points.find(function (pt) {
        return verdict === "konflikt"
          ? String(pt).indexOf("Konflikt") !== -1
          : (String(pt).indexOf("eher nicht") !== -1 || String(pt).indexOf("fehlt") !== -1 || String(pt).indexOf("Duft") !== -1);
      }) || prog.points[0];
      rawReason = matchPt;
    }

    // Clean up reason: remove leading icons / verdict tags and trailing suffixes
    primaryAlertClean = String(rawReason || "")
      .replace(/^[🔴🟡🟢ℹ️]\s*(konflikt|eher\s*nicht|passt)\s*—\s*/i, "")
      .replace(/\s*—\s*(eher\s*nicht|konflikt)\.?$/i, "")
      .trim();

    if (!primaryAlertClean) {
      primaryAlertClean = verdict === "konflikt"
        ? "Wirkstoffe derselben Klasse oder hartes Stacking im Schrank."
        : "Einige Wirkstoffe passen besser im Wechsel oder erfüllen Profil-Priorität nicht.";
    }

    var bannerPrefix = verdict === "konflikt" ? "🔴 Konflikt:" : "🟡 Hinweis:";
    bannerHtml = `
      <div class="schrank-conflict-banner ${verdict === "konflikt" ? "is-konflikt" : "is-warn"}">
        ${bannerPrefix} ${escapeHtml(primaryAlertClean)}
      </div>`;
  }

  // 2. Kurze Cautions & Checks (NUR kurze, prägnante Punkte — keine Romane!)
  // Wichtig: Den im Banner gezeigten Grund nicht nochmals als Bullet duplizieren!
  var rawBullets = prog.shortPoints || (prog.points || []);
  var displayBullets = rawBullets.filter(function (pt) {
    var s = String(pt);
    if (s.length > 125) return false;
    if (/Laut gängiger Begleitpflege|Arzneimittel.*Einkaufs-Hilfe|Beim Zukauf: eher Support|Textil-Hinweis/i.test(s)) return false;

    var sClean = s
      .replace(/^[🔴🟡🟢ℹ️]\s*(konflikt|eher\s*nicht|passt)\s*—\s*/i, "")
      .replace(/\s*—\s*(eher\s*nicht|konflikt)\.?$/i, "")
      .trim();
    if (primaryAlertClean && (sClean === primaryAlertClean || primaryAlertClean.indexOf(sClean) !== -1 || sClean.indexOf(primaryAlertClean) !== -1)) {
      return false; // Bereits im Banner oben genannt!
    }
    return true;
  });

  var pointsHtml = "";
  if (displayBullets.length > 0) {
    pointsHtml = `
      <ul class="prognosis-list">
        ${displayBullets.map(function (pt) { return "<li>" + pt + "</li>"; }).join("")}
      </ul>`;
  }

  // 3. Aufklappbares "Warum?" (für alle Kategorien!)
  var whyItems = (prog.whyNotes && prog.whyNotes.length > 0) ? prog.whyNotes.slice() : ((prog.eduNotes && prog.eduNotes.length > 0) ? prog.eduNotes.slice() : []);
  if (!whyItems.length && prog.points) {
    whyItems = prog.points.filter(function (pt) {
      return String(pt).length > 110 || /Begleitpflege|Arzneimittel|Textil-Hinweis|Warum/i.test(String(pt));
    });
  }
  if (!whyItems.length) {
    if (verdict === "passt") {
      whyItems = ["Deine Produkte ergänzen sich ohne Reiz-Stacking oder Inaktivierung. Reinigung, Pflege und Schutz sind aufeinander abgestimmt."];
    } else {
      whyItems = ["Prüfe die Verträglichkeit der Produkte und passe die Reihenfolge oder Wechsel-Abende an."];
    }
  }

  var whyBlock = `
    <details class="prognosis-why-details">
      <summary>Warum?</summary>
      <div class="prognosis-why-content">
        <ul class="prognosis-why-list">
          ${whyItems.map(function (n) { return "<li>" + n + "</li>"; }).join("")}
        </ul>
      </div>
    </details>`;

  return `
    <div class="prognosis-card ${statusClass}">
      <div class="prognosis-header">
        <div class="prognosis-title">${prog.title}</div>
        <span style="font-size:0.75rem;color:var(--muted);font-weight:600">${totalCount} ${totalCount === 1 ? "Produkt" : countLabel}</span>
      </div>
      ${bannerHtml}
      ${pointsHtml}
      ${whyBlock}
    </div>`;
}
window.renderUnifiedPrognosisCard = renderCategoryPrognosisBanner;

function conflictBadgeHtml(flag) {
  if (!flag || !flag.outcome) return "";
  var reason = String(flag.reason || "").replace(/"/g, "&quot;");
  if (flag.outcome === "konflikt") {
    return `<span class="tag conflict-flag konflikt" title="${reason}">🔴 Konflikt</span>`;
  }
  if (flag.outcome === "eher_nicht") {
    return `<span class="tag conflict-flag warn" title="${reason}">🟡 eher nicht</span>`;
  }
  return "";
}


// Render Baby Cabinet View
function renderBabyCabinet(container) {
  const b = appState.baby;
  const slotLabels = {
    reiniger: "Milde Reinigung & Babybad",
    creme: "Pflegecreme & Barriere (Emollient)",
    windel: "Windel- & Wundschutz",
    spf: "Baby-Sonnenschutz (ab 6 Monate)"
  };

  const allBabyProds = [];
  ["reiniger", "creme", "windel", "spf"].forEach(k => {
    (b[k] || []).forEach(id => {
      const p = resolveProfileCabinetProduct(id);
      if (p) {
        if (typeof enrichProductClasses === "function") enrichProductClasses(p);
        allBabyProds.push({ ...p, slotKey: k, slotTitle: slotLabels[k] });
      }
    });
  });
  const totalCount = allBabyProds.length;
  const babyProg = typeof calculateCategoryCabinetPrognosis === "function"
    ? calculateCategoryCabinetPrognosis(allBabyProds, "baby")
    : { empty: totalCount === 0, flagged: {}, points: [], title: "", status: "ok", verdict: "passt", eduNotes: [] };
  const babyFlagged = (babyProg && babyProg.flagged) || {};

  const activeP = getActiveProfile();

  let html = `
    <div class="profile-bar">
      <div>
        <div style="font-size:0.7rem;text-transform:uppercase;color:#1d4ed8;font-weight:700;margin-bottom:2px">Säuglings- & Kleinkindpflege</div>
        <div class="tags-list">
          <span class="tag ped-blue">👶 Baby &lt;3 Jahre</span>
          <span class="tag ff">🌸 100% Parfümfrei-Prio</span>
          <span class="tag" style="background:#f0fdf4;color:#166534">EU VO 1223/2009</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button class="btn-text" onclick="loadBabyPreset()" style="color:#1d4ed8;font-weight:600">Beispiel</button>
        <button class="btn-text" onclick="clearBabyCabinet()" style="color:#92580a">Leeren</button>
        <button class="btn-text" onclick="appState.view = 'welcome'; renderMain()" style="color:#777">Start</button>
      </div>
    </div>

    ${renderCategoryPrognosisBanner(babyProg, { accent: "#3b82f6", totalCount: totalCount, countLabel: "Produkte" })}

    <!-- Hero Search Bar -->
    <div class="scan-hero" style="background:linear-gradient(135deg, #1e293b, #2e4166)">
      <h2>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
        Baby-Schrank befüllen & prüfen
      </h2>
      <p>606 EU-geprüfte Baby- & Kind-Produkte mit pädiatrischen Flags (Parfümfrei, Cruelty-Free, &lt;3 Jahre).</p>
      <div class="scan-btn-group">
        <button class="btn-scan" style="background:#2563eb" onclick="openAddBabyProductModal('all', 'baby')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          + Baby-Produkt hinzufügen
        </button>
        <button class="btn-manual" onclick="openBabySafetyGuideModal()">Pädiatrie-Leitlinie</button>
      </div>
    </div>
  `;

  if (allBabyProds.length === 0) {
    html += `
      <div style="text-align:center;padding:1.8rem 1.2rem;background:#fffdf9;border:1.5px dashed #bfdbfe;border-radius:14px;margin:0.8rem 0 1.2rem">
        <div style="font-size:2.2rem;line-height:1;margin-bottom:8px">👶</div>
        <div style="font-weight:700;font-size:1.05rem;color:var(--ink)">Noch keine Produkte — Scan oder Beispiel</div>
        <div style="font-size:0.85rem;color:var(--muted);max-width:420px;margin:4px auto 14px;line-height:1.45">
          Wähle milde, babygerechte Produkte für deinen Liebling oder übernimm geprüfte Empfehlungen mit 1 Klick aus dem Pädiatrie-Ideal-Vergleich darunter.
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button type="button" class="btn-scan" style="padding:7px 14px;font-size:0.85rem;background:#2563eb" onclick="openAddBabyProductModal('all', 'baby')">
            + Baby-Produkt hinzufügen
          </button>
          <button type="button" class="btn-manual" style="padding:7px 14px;font-size:0.85rem;background:#fff;border-color:var(--line);color:#1d4ed8" onclick="openBabySafetyGuideModal()">
            Pädiatrie-Leitlinie
          </button>
        </div>
      </div>
    `;
  } else {
    html += `<div class="step-list" style="margin-top:1.1rem">`;
    allBabyProds.forEach((p, idx) => {
      const flag = babyFlagged[p.id];
      const flagOutcome = flag && flag.outcome;
      const cardConflictClass = flagOutcome === "konflikt" ? "has-konflikt" : (flagOutcome === "eher_nicht" ? "has-warn" : "");
      html += `
        <div class="step-card ${cardConflictClass}" onclick="openBabyProductDetail('${p.id}')">
          <div class="step-num" style="background:#dbeafe;color:#1e40af">${idx + 1}</div>
          <div class="bottle-icon">
            <div class="bottle-neck"></div>
            <div class="bottle-body" style="--b-color:#93c5fd">
              <span class="bottle-label">${p.brand.slice(0, 7)}</span>
            </div>
          </div>
          <div class="step-info">
            <div class="step-cat" style="color:#1e40af">${p.slotTitle}</div>
            <div class="step-prod-name">${p.name}</div>
            <div class="step-active-desc" style="font-size:0.78rem;color:var(--muted)">Marke: <strong>${p.brand}</strong></div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:5px">
              ${conflictBadgeHtml(flag)}
              ${p.ff === true ? '<span class="tag ff" style="font-size:0.66rem;padding:1px 5px">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn" style="font-size:0.66rem;padding:1px 5px">⚠️ Parfümiert</span>' : '')}
              ${p.u3 === true ? '<span class="tag ped-blue" style="font-size:0.66rem;padding:1px 5px">👶 EU &lt;3 Jahre</span>' : ''}
              ${p.cf === true ? '<span class="tag ped-purple" style="font-size:0.66rem;padding:1px 5px">🐰 Cruelty-Free</span>' : ''}
              ${p.spfNote ? '<span class="tag ped-amber" style="font-size:0.66rem;padding:1px 5px">☀️ AAP &lt;6m</span>' : ''}
            </div>
          </div>
          <div class="step-actions">
            <button class="btn-remove" title="Entfernen" onclick="event.stopPropagation(); removeBabyProduct('${p.id}', 'baby', '${p.slotKey}')">×</button>
          </div>
        </div>
      `;
    });
    html += `
      <button class="btn-text" style="align-self:flex-start;font-size:0.82rem;margin-top:4px;color:#1d4ed8;font-weight:600" onclick="openAddBabyProductModal('all', 'baby')">
        + Weiteres Baby-Produkt hinzufügen
      </button>
    </div>
    `;
  }

  // Budget-Hero Card für Baby
  html += `
    <div class="budget-hero-card" style="border-color:#bfdbfe;background:linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:1.5rem;background:#dbeafe;width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid #bfdbfe">
            💰
          </div>
          <div>
            <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#1d4ed8;letter-spacing:0.04em">
              Baby-Budget-Planer
            </div>
            <div style="font-family:'Iowan Old Style', Palatino, Georgia, serif;font-size:1.05rem;font-weight:700;color:#1e3a8a">
              Baby-Routine nach Budget zusammenstellen (z. B. 15 €, 25 €, 40 €)
            </div>
            <div style="font-size:0.78rem;color:#1d4ed8;margin-top:1px">
              100% reizarme, parfümfreie Säuglingspflege — von Drogerie-Spar bis Spezial-Apotheke.
            </div>
          </div>
        </div>
        <button type="button" id="btnBabyBudgetRoutine" class="btn-adopt" style="background:#2563eb;color:#fff;font-size:0.82rem;padding:8px 14px" onclick="openBudgetRoutineModal('baby')">
          Budget festlegen ➔
        </button>
      </div>
    </div>
  `;

  html += renderBabyTypRegal();
  html += `
    <div style="text-align:center;margin:1.6rem 0 1rem;font-size:0.75rem;color:var(--muted)">
      ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
    </div>
  `;
  container.innerHTML = html;
}

// Render Child Cabinet View
function renderChildCabinet(container) {
  const c = appState.child;
  const slotLabels = {
    reiniger: "Milde Reinigung & Dusche",
    creme: "Kinder-Pflegecreme & Lotion",
    spf: "Kinder-Sonnenschutz (LSF 50+)",
    haar: "Milde Haarpflege / Kindershampoo"
  };

  const allChildProds = [];
  ["reiniger", "creme", "spf", "haar"].forEach(k => {
    (c[k] || []).forEach(id => {
      const p = resolveProfileCabinetProduct(id);
      if (p) {
        if (typeof enrichProductClasses === "function") enrichProductClasses(p);
        allChildProds.push({ ...p, slotKey: k, slotTitle: slotLabels[k] });
      }
    });
  });
  const totalCount = allChildProds.length;
  const childProg = typeof calculateCategoryCabinetPrognosis === "function"
    ? calculateCategoryCabinetPrognosis(allChildProds, "child")
    : { empty: totalCount === 0, flagged: {}, points: [], title: "", status: "ok", verdict: "passt", eduNotes: [] };
  const childFlagged = (childProg && childProg.flagged) || {};

  const activeP = getActiveProfile();

  let html = `
    <div class="profile-bar">
      <div>
        <div style="font-size:0.7rem;text-transform:uppercase;color:#b45309;font-weight:700;margin-bottom:2px">Kinder-Pflege (Präpubertär)</div>
        <div class="tags-list">
          <span class="tag ped-amber">🧒 Kind 3–11 Jahre</span>
          <span class="tag ff">🌸 Milde Barriere</span>
          <span class="tag" style="background:#fef3c7;color:#92580a">☀️ LSF 50+ Pflicht</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button class="btn-text" onclick="loadChildPreset()" style="color:#b45309;font-weight:600">Beispiel</button>
        <button class="btn-text" onclick="clearChildCabinet()" style="color:#92580a">Leeren</button>
        <button class="btn-text" onclick="appState.view = 'welcome'; renderMain()" style="color:#777">Start</button>
      </div>
    </div>

    ${renderCategoryPrognosisBanner(childProg, { accent: "#f59e0b", totalCount: totalCount, countLabel: "Produkte" })}

    <!-- Hero Search Bar -->
    <div class="scan-hero" style="background:linear-gradient(135deg, #382d1d, #57462c)">
      <h2>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
        Kinder-Schrank befüllen & prüfen
      </h2>
      <p>Passende Duschgele, Cremes, LSF 50+ und Shampoos für Kindergarten- & Schulkinder.</p>
      <div class="scan-btn-group">
        <button class="btn-scan" style="background:#d97706" onclick="openAddBabyProductModal('all', 'child')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          + Kinder-Produkt hinzufügen
        </button>
        <button class="btn-manual" onclick="openBabySafetyGuideModal()">Pädiatrie-Leitlinie</button>
      </div>
    </div>
  `;

  if (allChildProds.length === 0) {
    html += `
      <div style="text-align:center;padding:1.8rem 1.2rem;background:#fffdf9;border:1.5px dashed #fde68a;border-radius:14px;margin:0.8rem 0 1.2rem">
        <div style="font-size:2.2rem;line-height:1;margin-bottom:8px">🧒</div>
        <div style="font-weight:700;font-size:1.05rem;color:var(--ink)">Noch keine Produkte — Scan oder Beispiel</div>
        <div style="font-size:0.85rem;color:var(--muted);max-width:420px;margin:4px auto 14px;line-height:1.45">
          Wähle sanfte, kindgerechte Produkte für Haut & Haar oder übernimm geprüfte Empfehlungen mit 1 Klick aus dem Kinder-Ideal-Vergleich darunter.
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button type="button" class="btn-scan" style="padding:7px 14px;font-size:0.85rem;background:#d97706" onclick="openAddBabyProductModal('all', 'child')">
            + Kinder-Produkt hinzufügen
          </button>
          <button type="button" class="btn-manual" style="padding:7px 14px;font-size:0.85rem;background:#fff;border-color:var(--line);color:#b45309" onclick="openBabySafetyGuideModal()">
            Pädiatrie-Leitlinie
          </button>
        </div>
      </div>
    `;
  } else {
    html += `<div class="step-list" style="margin-top:1.1rem">`;
    allChildProds.forEach((p, idx) => {
      const flag = childFlagged[p.id];
      const flagOutcome = flag && flag.outcome;
      const cardConflictClass = flagOutcome === "konflikt" ? "has-konflikt" : (flagOutcome === "eher_nicht" ? "has-warn" : "");
      html += `
        <div class="step-card ${cardConflictClass}" onclick="openBabyProductDetail('${p.id}')">
          <div class="step-num" style="background:#fef3c7;color:#b45309">${idx + 1}</div>
          <div class="bottle-icon">
            <div class="bottle-neck"></div>
            <div class="bottle-body" style="--b-color:#fcd34d">
              <span class="bottle-label">${p.brand.slice(0, 7)}</span>
            </div>
          </div>
          <div class="step-info">
            <div class="step-cat" style="color:#b45309">${p.slotTitle}</div>
            <div class="step-prod-name">${p.name}</div>
            <div class="step-active-desc" style="font-size:0.78rem;color:var(--muted)">Marke: <strong>${p.brand}</strong></div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:5px">
              ${conflictBadgeHtml(flag)}
              ${p.ff === true ? '<span class="tag ff" style="font-size:0.66rem;padding:1px 5px">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn" style="font-size:0.66rem;padding:1px 5px">⚠️ Parfümiert</span>' : '')}
              ${p.u3 === true ? '<span class="tag ped-blue" style="font-size:0.66rem;padding:1px 5px">👶 EU &lt;3 Jahre</span>' : ''}
              ${p.cf === true ? '<span class="tag ped-purple" style="font-size:0.66rem;padding:1px 5px">🐰 Cruelty-Free</span>' : ''}
              ${p.spfNote ? '<span class="tag ped-amber" style="font-size:0.66rem;padding:1px 5px">☀️ AAP &lt;6m</span>' : ''}
            </div>
          </div>
          <div class="step-actions">
            <button class="btn-remove" title="Entfernen" onclick="event.stopPropagation(); removeBabyProduct('${p.id}', 'child', '${p.slotKey}')">×</button>
          </div>
        </div>
      `;
    });
    html += `
      <button class="btn-text" style="align-self:flex-start;font-size:0.82rem;margin-top:4px;color:#b45309;font-weight:600" onclick="openAddBabyProductModal('all', 'child')">
        + Weiteres Kinder-Produkt hinzufügen
      </button>
    </div>
    `;
  }

  // Budget-Hero Card für Kind
  html += `
    <div class="budget-hero-card" style="border-color:#fde68a;background:linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:1.5rem;background:#fef3c7;width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid #fde68a">
            💰
          </div>
          <div>
            <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#b45309;letter-spacing:0.04em">
              Kinder-Budget-Planer
            </div>
            <div style="font-family:'Iowan Old Style', Palatino, Georgia, serif;font-size:1.05rem;font-weight:700;color:#78350f">
              Kinder-Routine nach Budget zusammenstellen (z. B. 15 €, 25 €, 40 €)
            </div>
            <div style="font-size:0.78rem;color:#b45309;margin-top:1px">
              Pädiatrisch geprüfte Kinderpflege für Kita & Schule — reizarm, kindergerecht & evidenzbasiert.
            </div>
          </div>
        </div>
        <button type="button" id="btnChildBudgetRoutine" class="btn-adopt" style="background:#d97706;color:#fff;font-size:0.82rem;padding:8px 14px" onclick="openBudgetRoutineModal('child')">
          Budget festlegen ➔
        </button>
      </div>
    </div>
  `;

  html += renderChildTypRegal();
  html += `
    <div style="text-align:center;margin:1.6rem 0 1rem;font-size:0.75rem;color:var(--muted)">
      ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
    </div>
  `;
  container.innerHTML = html;
}

// Modal: Search and add Baby / Child products from BABY_DB

function loadTeenPreset() {
  const pick = (prefs, slot) => (typeof pickCountryAvailableId === "function"
    ? pickCountryAvailableId(prefs, TEEN_DB, slot)
    : prefs[0]);
  // Evidenzbasierte Teenie-Starterauswahl — landesabhängig (DE/AT Preferenzen zuerst)
  appState.teen = {
    reiniger: [pick(["t_item_24", "t_item_18", "t_item_30"], "reiniger")].filter(Boolean),
    active: [pick(["t_item_52", "t_item_17"], "active")].filter(Boolean),
    creme: [pick(["t_item_25", "t_item_29", "t_item_31"], "creme")].filter(Boolean),
    spf: [pick(["t_item_17", "t_ean_4056489405191", "t_ean_20382933", "t_ean_4005900261038"], "spf")].filter(Boolean)
  };
  saveState();
  renderMain();
}

function clearTeenCabinet() {
  appState.teen = { reiniger: [], active: [], creme: [], spf: [] };
  saveState();
  renderMain();
  showToast("Teenie-Schrank geleert.");
}

function addTeenProduct(prodId, slot) {
  let p = TEEN_DB[prodId] || (typeof resolveProfileCabinetProduct === "function" ? resolveProfileCabinetProduct(prodId) : null);
  if (!p) return;
  if (typeof enrichProductClasses === "function") enrichProductClasses(p);
  if (typeof TEEN_DB === "object" && !TEEN_DB[prodId]) {
    TEEN_DB[prodId] = Object.assign({}, p, {
      slot: p.slot || (p.kat === "reiniger" ? "reiniger" : (p.kat === "spf" ? "spf" : (p.kat === "serum" || p.kat === "active" || p.kat === "spot" ? "active" : "creme")))
    });
  }
  if (typeof appState === "object") {
    if (!appState.customProducts) appState.customProducts = {};
    if (!appState.customProducts[prodId]) appState.customProducts[prodId] = p;
  }
  if (typeof DB === "object" && !DB[prodId]) DB[prodId] = p;
  p = TEEN_DB[prodId] || p;
  let targetSlot = slot;
  if (!targetSlot || targetSlot === "all") {
    if (p.slot === "reiniger") targetSlot = "reiniger";
    else if (p.slot === "active") targetSlot = "active";
    else if (p.slot === "spf") targetSlot = "spf";
    else targetSlot = "creme";
  }
  if (!appState.teen[targetSlot]) {
    appState.teen[targetSlot] = [];
  }
  if (!appState.teen[targetSlot].includes(prodId)) {
    appState.teen[targetSlot].push(prodId);
  }
  saveState();
  closeModal();
  renderMain();
}

function removeTeenProduct(prodId, slot) {
  if (appState.teen && appState.teen[slot]) {
    appState.teen[slot] = appState.teen[slot].filter(id => id !== prodId);
    saveState();
    renderMain();
  }
}

// Render Teen Cabinet View
function renderTeenCabinet(container) {
  const t = appState.teen;
  const slotLabels = {
    reiniger: "Milde Gesichtsreinigung",
    active: "Gezielter Wirkstoff (Optional)",
    creme: "Leichte Feuchtigkeit & Barriere",
    spf: "Täglicher Sonnenschutz (LSF 30–50+)"
  };

  const allTeenProds = [];
  ["reiniger", "active", "creme", "spf"].forEach(k => {
    (t[k] || []).forEach(id => {
      const p = resolveProfileCabinetProduct(id);
      if (p) {
        if (typeof enrichProductClasses === "function") enrichProductClasses(p);
        allTeenProds.push({ ...p, slotKey: k, slotTitle: slotLabels[k] });
      }
    });
  });
  const totalCount = allTeenProds.length;
  const teenProg = typeof calculateCategoryCabinetPrognosis === "function"
    ? calculateCategoryCabinetPrognosis(allTeenProds, "teen")
    : { empty: totalCount === 0, flagged: {}, points: [], title: "", status: "ok", verdict: "passt", eduNotes: [] };
  const teenFlagged = (teenProg && teenProg.flagged) || {};

  const activeP = getActiveProfile();

  let html = `
    <div class="profile-bar">
      <div>
        <div style="font-size:0.7rem;text-transform:uppercase;color:#0d9488;font-weight:700;margin-bottom:2px">Jugend- & Teenie-Pflege</div>
        <div class="tags-list">
          <span class="tag" style="background:#ccfbf1;color:#0f766e;border:1px solid #99f6e4">🧑‍🦱 Teenie 12–17 J.</span>
          <span class="tag ff">🌸 Parfümfrei-Prio</span>
          <span class="tag nc">🛡️ Nicht-Komedogen</span>
          <span class="tag" style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca">🛑 Kein Anti-Aging-Hype</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button class="btn-text" onclick="loadTeenPreset()" style="color:#0d9488;font-weight:600">Beispiel</button>
        <button class="btn-text" onclick="clearTeenCabinet()" style="color:#92580a">Leeren</button>
        <button class="btn-text" onclick="appState.view = 'welcome'; renderMain()" style="color:#777">Start</button>
      </div>
    </div>

    ${renderCategoryPrognosisBanner(teenProg, { accent: "#0d9488", totalCount: totalCount, countLabel: "Produkte" })}

    <!-- Hero Search Bar -->
    <div class="scan-hero" style="background:linear-gradient(135deg, #134e4a, #115e59)">
      <h2>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
        Teenie-Schrank befüllen & prüfen
      </h2>
      <p>96 EU-geprüfte Teenie- & Young-Adult-Produkte mit Flags (Parfümfrei, Nicht-komedogen, Cruelty-Free, ohne Anti-Aging).</p>
      <div class="scan-btn-group">
        <button class="btn-scan" style="background:#0d9488" onclick="openAddTeenProductModal('all')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          + Teenie-Produkt hinzufügen
        </button>
        <button class="btn-manual" onclick="openTeenSafetyGuideModal()">Teenie-Leitlinie</button>
      </div>
    </div>
  `;

  if (allTeenProds.length === 0) {
    html += `
      <div style="text-align:center;padding:1.8rem 1.2rem;background:#fffdf9;border:1.5px dashed #99f6e4;border-radius:14px;margin:0.8rem 0 1.2rem">
        <div style="font-size:2.2rem;line-height:1;margin-bottom:8px">🧑‍🦱</div>
        <div style="font-weight:700;font-size:1.05rem;color:var(--ink)">Noch keine Produkte — Scan oder Beispiel</div>
        <div style="font-size:0.85rem;color:var(--muted);max-width:420px;margin:4px auto 14px;line-height:1.45">
          Stelle deine täglichen Pflegeprodukte zusammen oder übernimm geprüfte Empfehlungen mit 1 Klick aus dem Teenie-Ideal-Vergleich darunter.
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button type="button" class="btn-scan" style="padding:7px 14px;font-size:0.85rem;background:#0d9488" onclick="openAddTeenProductModal('all')">
            + Teenie-Produkt hinzufügen
          </button>
          <button type="button" class="btn-manual" style="padding:7px 14px;font-size:0.85rem;background:#fff;border-color:var(--line);color:#0f766e" onclick="openTeenSafetyGuideModal()">
            Teenie-Leitlinie
          </button>
        </div>
      </div>
    `;
  } else {
    html += `<div class="step-list" style="margin-top:1.1rem">`;
    allTeenProds.forEach((p, idx) => {
      const flag = teenFlagged[p.id];
      const flagOutcome = flag && flag.outcome;
      const cardConflictClass = flagOutcome === "konflikt" ? "has-konflikt" : (flagOutcome === "eher_nicht" ? "has-warn" : "");
      html += `
        <div class="step-card ${cardConflictClass}" onclick="openTeenProductDetail('${p.id}')">
          <div class="step-num" style="background:#ccfbf1;color:#0f766e">${idx + 1}</div>
          <div class="bottle-icon">
            <div class="bottle-neck"></div>
            <div class="bottle-body" style="--b-color:#5eead4">
              <span class="bottle-label">${p.brand.slice(0, 7)}</span>
            </div>
          </div>
          <div class="step-info">
            <div class="step-cat" style="color:#0f766e">${p.slotTitle}</div>
            <div class="step-prod-name">${p.name}</div>
            <div class="step-active-desc" style="font-size:0.78rem;color:var(--muted)">Marke: <strong>${p.brand}</strong></div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:5px">
              ${conflictBadgeHtml(flag)}
              ${p.ff === true ? '<span class="tag ff" style="font-size:0.66rem;padding:1px 5px">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn" style="font-size:0.66rem;padding:1px 5px">⚠️ Parfümiert</span>' : '')}
              ${p.nc === true ? '<span class="tag nc" style="font-size:0.66rem;padding:1px 5px">🛡️ NC</span>' : ''}
              ${p.cf === true ? '<span class="tag ped-purple" style="font-size:0.66rem;padding:1px 5px">🐰 Cruelty-Free</span>' : ''}
              ${p.notForMinors ? '<span class="tag" style="background:#fee2e2;color:#991b1b;border:1px solid #fecaca;font-size:0.66rem;padding:1px 5px">🛑 Kein Teen-Vorschlag</span>' : ''}
            </div>
          </div>
          <div class="step-actions">
            <button class="btn-remove" title="Entfernen" onclick="event.stopPropagation(); removeTeenProduct('${p.id}', '${p.slotKey}')">×</button>
          </div>
        </div>
      `;
    });
    html += `
      <button class="btn-text" style="align-self:flex-start;font-size:0.82rem;margin-top:4px;color:#0d9488;font-weight:600" onclick="openAddTeenProductModal('all')">
        + Weiteres Teenie-Produkt hinzufügen
      </button>
    </div>
    `;
  }

  // Budget-Hero Card für Teenies
  html += `
    <div class="budget-hero-card" style="border-color:#99f6e4;background:linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:1.5rem;background:#ccfbf1;width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid #99f6e4">
            💰
          </div>
          <div>
            <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:#0f766e;letter-spacing:0.04em">
              Teenie-Budget-Planer
            </div>
            <div style="font-family:'Iowan Old Style', Palatino, Georgia, serif;font-size:1.05rem;font-weight:700;color:#134e4a">
              Routine nach Budget zusammenstellen (z. B. 15 €, 20 €, 30 €)
            </div>
            <div style="font-size:0.78rem;color:#0f766e;margin-top:1px">
              Sichere AAD-Leitlinienprodukte — ohne Hype und im Taschengeld-Budget.
            </div>
          </div>
        </div>
        <button type="button" class="btn-adopt" style="background:#0d9488;color:#fff;font-size:0.82rem;padding:8px 14px" onclick="openBudgetRoutineModal('teen')">
          Budget festlegen ➔
        </button>
      </div>
    </div>
  `;

  // Teenie-Typ-Regal / AAD-Ideal-Vergleich
  html += renderTeenTypRegal();
  html += `
    <div style="text-align:center;margin:1.6rem 0 1rem;font-size:0.75rem;color:var(--muted)">
      ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
    </div>
  `;
  container.innerHTML = html;
}

// Modal: Search and add Teenie products from TEEN_DB

function openTeenSafetyGuideModal() {
  const modalHTML = `
    <div style="padding:1rem 1.1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem">
        <div style="font-family:'Iowan Old Style', Georgia, serif;font-size:1.3rem;font-weight:700">
          🧑‍🦱 Teenie-Skincare: Evidenz vor Hype
        </div>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>

      <div style="font-size:0.82rem;color:var(--muted);line-height:1.45;margin-bottom:1rem">
        Empfehlungen der American Academy of Dermatology (AAD) und deutscher Fachgesellschaften für Jugendliche (12–17 Jahre).
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;font-size:0.84rem;line-height:1.5">
        <div style="background:#f0fdf4;padding:10px;border-radius:10px;border-left:4px solid #16a34a">
          <strong style="color:#166534">1. Das AAD-Basis-Trio reicht für 80 % der Haut</strong><br>
          Jugendliche Haut braucht keine 10 Schritte. Die wissenschaftliche Basisroutine besteht aus:
          1. Sanftes Waschen (Schweiß, Talg & Schmutz entfernen)
          2. Leichte Feuchtigkeitspflege (verhindert Rebound-Fettung)
          3. Täglicher Breitspektrum-Sonnenschutz (LSF 30–50+ verhindert postinflammatorische Pickelmale).
        </div>

        <div style="background:#fef2f2;padding:10px;border-radius:10px;border-left:4px solid #dc2626">
          <strong style="color:#991b1b">2. Stoppt den Anti-Aging- & Retinol-Hype!</strong><br>
          Trends auf TikTok und Instagram („Sephora Kids“) verleiten viele Teenager zum Kauf teurer Anti-Aging-Seren mit Retinol, hochdosierten Fruchtsäuren oder Peptiden. Fachärzte warnen: Auf junger Haut haben diese Produkte keinen Nutzen, zerstören die Barriere und führen zu perioraler Dermatitis.
        </div>

        <div style="background:#f0fdfa;padding:10px;border-radius:10px;border-left:4px solid #0d9488">
          <strong style="color:#0f766e">3. Wirkstoffe bei Akne: Gezielt und schonend</strong><br>
          Wenn in der Pubertät Mitesser und Pickel auftreten:
          • <strong>Salicylsäure (BHA):</strong> dringt fettlöslich in die Poren ein und löst Talg.
          • <strong>Niacinamid:</strong> reguliert die Talgproduktion und beruhigt Rötungen.
          • <strong>Wichtig in Deutschland:</strong> Retinoide gegen Akne (wie Adapalen) sind in den USA ab 12 Jahren frei verkäuflich, in Deutschland aber verschreibungspflichtig (Rx) und gehören in ärztliche Hand!
        </div>

        <div style="background:#fffbeb;padding:10px;border-radius:10px;border-left:4px solid #d97706">
          <strong style="color:#b45309">4. Wann zum Hautarzt?</strong><br>
          Bei tiefen, schmerzhaften Entzündungen (zystische Akne) oder beginnender Narbenbildung: Bitte nicht endlos mit Kosmetik experimentieren, sondern frühzeitig eine Hautarztpraxis aufsuchen.
        </div>
      </div>

      <div style="margin-top:1.2rem;text-align:center">
        <button class="btn-text" style="background:var(--ok);color:#F7F4D5;padding:8px 16px;border-radius:8px;font-weight:700" onclick="closeModal()">
          Alles klar!
        </button>
      </div>
    </div>
  `;

  showModalSheet(modalHTML);
}
function openBabySafetyGuideModal() {
  const modalHTML = `
    <div style="padding:1rem 1.1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem">
        <div style="font-family:'Iowan Old Style', Georgia, serif;font-size:1.3rem;font-weight:700">
          👶 Pädiatrische Evidenz & Leitlinien
        </div>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>

      <div style="font-size:0.82rem;color:var(--muted);line-height:1.45;margin-bottom:1rem">
        Evidenzquellen zur Pflege von Säuglingen (&lt;3 Jahre) und Kindern (3–11 Jahre) nach EU VO 1223/2009, EDQM und AAP/AAD.
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;font-size:0.84rem;line-height:1.5">
        <div style="background:#f4f8fe;padding:10px;border-radius:10px;border-left:4px solid #2563eb">
          <strong style="color:#1d4ed8">1. EU VO 1223/2009 Annex I Teil B: Schwelle &lt;3 Jahre</strong><br>
          Babyhaut ist bis zu 30% dünner als Erwachsenenhaut und hat ein hohes Verhältnis von Körperoberfläche zu Körpergewicht. Die EU schreibt für Produkte für Kinder unter 3 Jahren eine spezifische toxikologische Sicherheitsbewertung vor.
        </div>

        <div style="background:#f0fdf4;padding:10px;border-radius:10px;border-left:4px solid #16a34a">
          <strong style="color:#166534">2. Priorität 1: 100% Parfümfrei</strong><br>
          Pädiatrisch-dermatologischer Konsens: Duftstoffe (einschließlich natürlicher ätherischer Öle wie Lavendel, Citrus oder Kamille) sind die häufigste Ursache für Kontaktallergien bei Säuglingen. Im Schrank wird Parfümfreiheit mit höchster Priorität bewertet.
        </div>

        <div style="background:#fffbeb;padding:10px;border-radius:10px;border-left:4px solid #d97706">
          <strong style="color:#b45309">3. Sonnenschutz nach AAP / AAD (&lt;6 Monate)</strong><br>
          Für Säuglinge unter 6 Monaten ist Sonnencreme nicht die erste Wahl. Direkte Sonne meiden! Schatten, Sonnensegel und dicht gewebte UV-Kleidung haben Vorrang. Ab 6 Monaten mineralischer/sanfter LSF 50+.
        </div>

        <div style="background:#fef2f2;padding:10px;border-radius:10px;border-left:4px solid #dc2626">
          <strong style="color:#991b1b">4. Grenzen der Kosmetik & Kinderarzt-Wegweiser</strong><br>
          Kosmetik dient der Hygiene und dem Barriereschutz, nicht der Therapie. Bei stark nässender Windeldermatitis, Satelliten-Pusteln (Verdacht auf Candida/Soor) oder stark juckendem Ekzem bitte umgehend die Kinderärztin / den Kinderarzt konsultieren!
        </div>
      </div>

      <div style="margin-top:1.2rem;text-align:center">
        <button class="btn-text" style="background:var(--ok);color:#F7F4D5;padding:8px 16px;border-radius:8px;font-weight:700" onclick="closeModal()">
          Verstanden
        </button>
      </div>
    </div>
  `;

  showModalSheet(modalHTML);
}


function getActivePMList() {
  if (appState.useSkinCycling) {
    if (appState.pmMode === "a") return appState.pm_a;
    if (appState.pmMode === "b") return appState.pm_b;
    return appState.pm_c;
  }
  return appState.pm_a;
}

// Galenische & dermatologische Routine-Sortierung:
// 1. Reiniger (immer zuerst) -> 2. Seren / Feuchte -> 3. Actives / Rx / Spot -> 4. Creme / Barriere -> 5. SPF (morgens immer zuletzt)
function sortRoutine(arr, isAM = true) {
  if (!Array.isArray(arr)) return [];
  
  const getRank = (prodId) => {
    const p = (typeof resolveProfileCabinetProduct === "function" ? resolveProfileCabinetProduct(prodId) : null)
      || (typeof DB === "object" ? DB[prodId] : null)
      || (typeof TEEN_DB === "object" ? TEEN_DB[prodId] : null)
      || (typeof BABY_DB === "object" ? BABY_DB[prodId] : null);
    if (!p) return 999;

    const kat = p.kat || p.slot || "creme";

    // 1. Cleanser / Reiniger ist IMMER Schritt 1
    if (kat === "reiniger" || kat === "bad") return 10;

    // 2. Seren / Hydratisierung (dünnflüssig)
    if (kat === "serum") {
      // Reine Hydratoren & Humectants zuerst (Hyaluron, Ectoin)
      if (p.klassen && p.klassen.includes("humectant")) return 21;
      // Beruhigende Barriere-Seren (Niacinamid)
      if (p.klassen && p.klassen.includes("niacinamide")) return 23;
      // Aktive Seren (Azelainsäure, BHA, AHA, Retinol)
      return 25;
    }

    // 3. Medizinische Actives & Akut-Spots
    if (kat === "active") return 30;
    if (kat === "spot") return 35;

    // 4. Feuchtigkeits- & Barriere-Cremes / Windelschutz
    if (kat === "creme" || kat === "windel") return 40;

    // 5. Breitspektrum-Sonnenschutz (morgens immer der allerletzte Schritt)
    if (kat === "spf") return isAM ? 50 : 90;

    return 60;
  };

  return [...arr].sort((a, b) => getRank(a) - getRank(b));
}

function openCabinet() {
  appState.am = sortRoutine(appState.am, true);
  appState.pm_a = sortRoutine(appState.pm_a, false);
  appState.pm_b = sortRoutine(appState.pm_b, false);
  appState.pm_c = sortRoutine(appState.pm_c, false);
  appState.view = "cabinet";
  renderMain();
}

function startWithEmptyCabinet() {
  if (appState.profile === "teen") {
    appState.teen = { reiniger: [], active: [], creme: [], spf: [] };
  } else if (appState.profile === "baby") {
    appState.baby = { reiniger: [], creme: [], windel: [], spf: [] };
  } else if (appState.profile === "child") {
    appState.child = { reiniger: [], creme: [], spf: [], haar: [] };
  } else {
    appState.tags = ["Eigene Routine"];
    appState.am = [];
    appState.pm_a = [];
    appState.pm_b = [];
    appState.pm_c = [];
  }
  appState.view = "cabinet";
  saveState();
  renderMain();
  showToast("Schrank geleert.");
}
function loadPrimPreset() {
  appState.tags = ["Trocken", "Sensibel", "Akne-prone", "Rx-Begleitpflege"];
  appState.am = sortRoutine(["water", "ha", "aza", "purito", "anthelios"], true);
  appState.pm_a = sortRoutine(["ceraveWash", "ha", "purito", "adap", "baleaCreme"], false);
  appState.pm_b = sortRoutine(["ceraveWash", "ha", "purito", "clienzo", "baleaCreme"], false);
  appState.pm_c = sortRoutine(["ceraveWash", "ha", "purito", "baleaCreme"], false);
  appState.view = "cabinet";
  saveState();
  renderMain();
}


function renderBottle(prod) {
  let cap = `<div class="bottle-neck"></div>`;
  let shapeClass = "";
  if (prod.shape === "serum") cap = `<div class="bottle-dropper"></div><div class="bottle-neck"></div>`;
  else if (prod.shape === "pump") cap = `<div class="bottle-pump"></div><div class="bottle-neck"></div>`;
  else if (prod.shape === "jar") { cap = ""; shapeClass = "jar"; }
  else if (prod.shape === "tube") { cap = `<div class="bottle-neck"></div>`; shapeClass = "tube"; }
  const rxClass = prod.rx ? "rx" : "";
  const shortLbl = ((prod.wirk || prod.name || "Produkt").split(" ")[0] || "").slice(0, 7);

  return `
    <div class="bottle-icon">
      ${cap}
      <div class="bottle-body ${shapeClass} ${rxClass}" style="--b-color:${prod.c || '#2563eb'}">
        <span class="bottle-label">${shortLbl}</span>
      </div>
    </div>
  `;
}


function renderMain(autoSave = true) {
  const container = document.getElementById("appContent");
  updateCategoryNav();

  if (autoSave) {
    saveState();
  }

  if (appState.view === "welcome" || appState.view === "start") {
    if (typeof renderStartScreen === "function") {
      renderStartScreen(container);
    }
    return;
  }

  if (appState.profile === "teen") {
    renderTeenCabinet(container);
    return;
  }

  if (appState.profile === "baby") {
    renderBabyCabinet(container);
    return;
  }

  if (appState.profile === "child") {
    renderChildCabinet(container);
    return;
  }

  const isAM = appState.tab === "am";
  // Immer streng chronologische Routine-Sortierung garantieren
  appState.am = sortRoutine(appState.am, true);
  appState.pm_a = sortRoutine(appState.pm_a, false);
  appState.pm_b = sortRoutine(appState.pm_b, false);
  appState.pm_c = sortRoutine(appState.pm_c, false);

  const currentList = isAM ? appState.am : getActivePMList();
  if (typeof enrichAllDbProducts === "function") enrichAllDbProducts();
  const prog = calculatePrognosis();
  const flaggedMap = (prog && prog.flagged) || {};

  const stepLabels = {
    reiniger: "Reinigung",
    serum: "Hydratisieren & Pflegen",
    active: "Gezielter Wirkstoff (Active)",
    spot: "Akut-Active (Spot)",
    creme: "Feuchtigkeit & Barriere",
    spf: "Tages-Sonnenschutz (LSF 50+)"
  };

  const activeP = getActiveProfile();

  let html = `
    <div class="profile-bar">
      <div>
        <div style="font-size:0.7rem;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:2px">Dein Hautprofil</div>
        <div class="tags-list">
          ${(appState.tags.length ? appState.tags : ["Eigene Routine"]).map(t => `<span class="tag ${t.includes('Rx') ? 'rx' : ''}">${t}</span>`).join("")}
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button class="btn-text" id="btnEditProfile">Quiz</button>
        <button class="btn-text" onclick="startWithEmptyCabinet()" style="color:#92580a">Leeren</button>
        <button class="btn-text" onclick="appState.view = 'welcome'; renderMain()" style="color:#777">Start</button>
      </div>
    </div>

    <!-- Live Routine-Prognose Banner (inkl. Intra-Schrank Klassen-Konflikte) -->
    ${renderCategoryPrognosisBanner(prog, {
      accent: "#4f46e5",
      totalCount: (typeof getFullCabinetProductIds === "function" ? getFullCabinetProductIds().length : (appState.am.length + getActivePMList().length)),
      countLabel: "Flaschen"
    })}

    <!-- Scan & Search Bar -->
    <div class="scan-hero">
      <h2>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
        Schrank befüllen & Dose prüfen
      </h2>
      <p>Stelle deine Flaschen in den Schrank oder prüfe ein neues Produkt direkt im Laden.</p>
      <div class="scan-btn-group">
        <button class="btn-scan" onclick="openAddProductModal('${appState.tab}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          + Produkt hinzufügen
        </button>
        <button class="btn-manual" onclick="openScanModal()">Im Laden scannen</button>
      </div>
      <div style="display:flex;gap:8px;margin-top:0.6rem">
        <button class="btn-manual" style="flex:1;background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.18);font-size:0.78rem;padding:0.55rem;border-radius:10px" onclick="openMarketGuideModal()">
          🛒 Markt-Navigator (dm / Rossmann / Apo)
        </button>
        <button class="btn-manual" style="flex:1;background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.18);font-size:0.78rem;padding:0.55rem;border-radius:10px" onclick="openDoctorGuideModal()">
          🩺 Hautarzt & Rx-Wegweiser
        </button>
      </div>
    </div>

    <!-- Routine Segment Switcher -->
    <div class="routine-tabs">
      <button class="tab-btn ${isAM ? 'active' : ''}" onclick="setTab('am')">
        ☀️ Morgen-Routine (${appState.am.length})
      </button>
      <button class="tab-btn ${!isAM ? 'active' : ''}" onclick="setTab('pm')">
        🌙 Abend-Routine (${getActivePMList().length})
      </button>
    </div>
  `;

  // If PM, show Skin Cycling Modes (or simple evening routine bar)
  if (!isAM) {
    if (appState.useSkinCycling) {
      const routineId = typeof getSelectedIdealRoutineId === "function" ? getSelectedIdealRoutineId() : "acne_barrier";
      const cyclingCfg = typeof getSkinCyclingConfig === "function" ? getSkinCyclingConfig(routineId) : null;
      const modes = (cyclingCfg && cyclingCfg.modes) || {
        a: { name: "Modus A: Retinoid", desc: "Standard-Active-Nacht" },
        b: { name: "Modus B: Akut / Wechsel", desc: "Zweit-Wirkstoff im Wechsel" },
        c: { name: "Modus C: Barriere-Pause", desc: "Nur Feuchtigkeit & Erholung" }
      };
      const title = (cyclingCfg && cyclingCfg.title) || "Skin Cycling / Wechsel-Abende";

      html += `
        <div class="mode-switcher">
          <div class="mode-switcher-title" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div>
              <span>${escapeHtml(title)}</span>
              <span style="color:var(--rx);font-weight:600;font-size:0.75rem;margin-left:6px">🛡️ Kein Reiz-Stacking</span>
            </div>
            <button type="button" class="btn-text" onclick="toggleSkinCycling(false)" style="font-size:0.72rem;color:var(--muted);text-decoration:underline">
              Einfache Routine nutzen
            </button>
          </div>
          <div class="mode-pills">
            <div class="mode-pill ${appState.pmMode === 'a' ? 'active' : ''}" onclick="setPmMode('a')">
              <span class="m-name">${escapeHtml(modes.a.name)}</span>
              <span class="m-desc">${escapeHtml(modes.a.desc)}</span>
            </div>
            <div class="mode-pill ${appState.pmMode === 'b' ? 'active' : ''}" onclick="setPmMode('b')">
              <span class="m-name">${escapeHtml(modes.b.name)}</span>
              <span class="m-desc">${escapeHtml(modes.b.desc)}</span>
            </div>
            <div class="mode-pill ${appState.pmMode === 'c' ? 'active' : ''}" onclick="setPmMode('c')">
              <span class="m-name">${escapeHtml(modes.c.name)}</span>
              <span class="m-desc">${escapeHtml(modes.c.desc)}</span>
            </div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="simple-pm-bar" style="display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin:8px 0 12px">
          <div style="font-size:0.8rem;color:var(--muted)">
            🌙 <strong>Feste Abend-Routine</strong> (gleiche Pflege jeden Abend)
          </div>
          <button type="button" class="btn-text" onclick="toggleSkinCycling(true)" style="font-size:0.78rem;color:var(--rx);font-weight:600;display:flex;align-items:center;gap:4px">
            🔀 Wechsel-Abende einrichten
          </button>
        </div>
      `;
    }
  }

  // Render Step-by-Step Cards or Empty Shelf (KEINE leeren Placeholder!)
  if (currentList.length === 0) {
    html += `
      <div class="empty-shelf" style="text-align:center;padding:1.8rem 1.2rem;margin:0.8rem 0 1.2rem">
        <div style="font-size:2.2rem;line-height:1;margin-bottom:8px">🧴</div>
        <div style="font-weight:700;font-size:1.05rem;color:var(--ink)">Dein ${isAM ? 'Morgen-Schrank' : 'Abend-Schrank'} ist noch leer</div>
        <div style="font-size:0.85rem;color:var(--muted);max-width:400px;margin:4px auto 14px;line-height:1.45">
          Stelle deine eigenen Produkte hinein oder übernimm passende Empfehlungen mit 1 Klick aus dem Ideal-Vergleich darunter.
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button type="button" class="btn-scan" style="padding:7px 14px;font-size:0.85rem" onclick="openAddProductModal('${appState.tab}')">
            + Produkt hinzufügen
          </button>
          <button type="button" class="btn-manual" style="padding:7px 14px;font-size:0.85rem;background:#fff;border-color:var(--line)" onclick="openScanModal()">
            Barcode scannen
          </button>
        </div>
      </div>
    `;
  } else {
    html += `<div class="step-list">`;
    currentList.forEach((prodId, idx) => {
      const p = DB[prodId];
      if (!p) return;
      if (typeof enrichProductClasses === "function") enrichProductClasses(p);
      const catLabel = stepLabels[p.kat] || p.kat;
      const flag = flaggedMap[p.id];
      const flagOutcome = flag && flag.outcome;
      const cardConflictClass = flagOutcome === "konflikt" ? "has-konflikt" : (flagOutcome === "eher_nicht" ? "has-warn" : "");
      const flagBadge = flagOutcome === "konflikt"
        ? `<span class="tag conflict-flag konflikt" title="${String(flag.reason || "").replace(/"/g, "&quot;")}">🔴 Konflikt</span>`
        : (flagOutcome === "eher_nicht"
          ? `<span class="tag conflict-flag warn" title="${String(flag.reason || "").replace(/"/g, "&quot;")}">🟡 im Wechsel</span>`
          : "");
      const classChips = (Array.isArray(p.klassen) ? p.klassen : [])
        .filter(k => ["retinoid_rx","retinoid_cos","aha","bha","bpo","ascorbic","azelaic"].indexOf(k) !== -1)
        .map(k => `<span class="tag class-chip" style="font-size:0.66rem;padding:1px 5px">${k}</span>`)
        .join("");
      html += `
        <div class="step-card ${cardConflictClass}" onclick="openProductDetail('${p.id}')">
          <div class="step-num">${idx + 1}</div>
          ${renderBottle(p)}
          <div class="step-info">
            <div class="step-cat">${catLabel}</div>
            <div class="step-prod-name" style="font-size:0.92rem;font-weight:700;color:var(--ink);margin:1px 0 2px">${p.name}</div>
            <div class="step-active-desc">Marke: <strong>${p.brand}</strong> · Wirkstoff: <strong>${p.wirk}</strong> ${p.rx ? '<span class="tag rx">Rx-Arzneimittel</span>' : ''}</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">
              ${flagBadge}
              ${classChips}
              ${p.ff === true ? '<span class="tag ff" style="font-size:0.66rem;padding:1px 5px" title="Frei von Duftstoffen">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn" style="font-size:0.66rem;padding:1px 5px" title="Enthält Parfüm/Duftstoffe">⚠️ Parfümiert</span>' : '')}
              ${p.nc === true ? '<span class="tag nc" style="font-size:0.66rem;padding:1px 5px" title="Nicht-komedogen ausgelobt">🛡️ NC</span>' : ''}
              ${p.cf === true ? '<span class="tag cf" style="font-size:0.66rem;padding:1px 5px" title="Zertifiziert tierversuchsfrei (CFI/Leaping Bunny)">🐰 Cruelty-Free</span>' : ''}
              ${p.no_white_cast === true ? '<span class="tag soc-nwc" style="font-size:0.66rem;padding:1px 5px" title="Hinterlässt keinen weißen Kreideschleier">✨ Zero White-Cast</span>' : ''}
              ${p.iron_ox === true ? '<span class="tag soc-iron" style="font-size:0.66rem;padding:1px 5px" title="Enthält Eisenoxide zum Schutz vor sichtbarem Licht/HEV">🛡️ Eisenoxide</span>' : ''}
              ${p.pih === true ? '<span class="tag soc-pih" style="font-size:0.66rem;padding:1px 5px" title="Evidenzbasierter Wirkstoff gegen Pickelmale/PIH">🎯 PIH-Fokus</span>' : ''}
            </div>
          </div>
          <div class="step-actions">
            <button class="btn-remove" title="Entfernen" onclick="event.stopPropagation(); removeProduct('${p.id}', '${appState.tab}')">×</button>
          </div>
        </div>
      `;
    });
    html += `
      <div style="text-align:center;margin-top:0.6rem">
        <button class="btn-text" style="font-size:0.86rem" onclick="openAddProductModal('${appState.tab}')">
          + Weiteres Produkt zu dieser Routine hinzufügen
        </button>
      </div>
    `;
    html += `</div>`;
  }


  // Budget-Hero Card direkt vor dem Typ-Regal
  html += `
    <div class="budget-hero-card">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:1.6rem;background:#fef3c7;width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid #fde68a">
            💰
          </div>
          <div>
            <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:0.04em">
              Budget-Optimierer
            </div>
            <div style="font-family:'Iowan Old Style', Palatino, Georgia, serif;font-size:1.08rem;font-weight:700;color:var(--ink)">
              Routine nach Budget zusammenstellen (z. B. 20 €, 30 €, 50 €)
            </div>
            <div style="font-size:0.79rem;color:var(--muted);margin-top:1px">
              Maximale Evidenz für deinen Hauttyp — strikt innerhalb deines Einkaufs-Limits.
            </div>
          </div>
        </div>
        <button type="button" class="btn-adopt" style="background:var(--ok);color:#F7F4D5;font-size:0.82rem;padding:8px 14px" onclick="openBudgetRoutineModal()">
          Budget festlegen ➔
        </button>
      </div>
    </div>
  `;

  // Typ-Regal / Ideal-Vergleich direkt unter dem Schrank rendern
  html += renderTypRegal(appState.tab, currentList);

  html += `
    <div style="text-align:center;margin:1.6rem 0 1rem;font-size:0.75rem;color:var(--muted)">
      ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
    </div>
  `;

  container.innerHTML = html;

  // Bind edit profile
  const editBtn = document.getElementById("btnEditProfile");
  if (editBtn) editBtn.onclick = openQuizModal;
  const guardBtn = document.getElementById("btnGuardInfo");
  if (guardBtn) guardBtn.onclick = openGuardModal;
}

function setTab(tab) {
  appState.tab = tab;
  renderMain();
}

function setPmMode(mode) {
  appState.pmMode = mode;
  renderMain();
}

function toggleSkinCycling(enable) {
  appState.useSkinCycling = Boolean(enable);
  if (appState.useSkinCycling) {
    if ((!appState.pm_b || appState.pm_b.length === 0) && (!appState.pm_c || appState.pm_c.length === 0)) {
      const routineId = typeof getSelectedIdealRoutineId === "function" ? getSelectedIdealRoutineId() : "acne_barrier";
      const routine = (typeof IDEAL_ROUTINES === "object" && IDEAL_ROUTINES[routineId]) || (typeof IDEAL_ROUTINES === "object" && IDEAL_ROUTINES.acne_barrier);
      const comp = appState.routineComplexity || "basis";
      if (routine && typeof getIdealRoutineSteps === "function" && typeof syncListToSteps === "function") {
        const stepsPMB = getIdealRoutineSteps(routine, "pm", comp, "b");
        appState.pm_b = syncListToSteps(appState.pm_b, stepsPMB, false, false);
        const stepsPMC = getIdealRoutineSteps(routine, "pm", comp, "c");
        appState.pm_c = syncListToSteps(appState.pm_c, stepsPMC, false, false);
      }
    }
  } else {
    appState.pmMode = "a";
  }
  saveState();
  renderMain();
  if (appState.useSkinCycling) {
    showToast("🔀 <strong>Wechsel-Abende (Skin Cycling)</strong> aktiviert: Wirkstoffe werden schonend auf getrennte Abende verteilt!");
  } else {
    showToast("🌙 Auf <strong>einfache Abend-Routine</strong> umgestellt!");
  }
}
window.toggleSkinCycling = toggleSkinCycling;

function removeProduct(prodId, tab) {
  if (tab === "am") {
    appState.am = sortRoutine(appState.am.filter(x => x !== prodId), true);
  } else {
    const activeMode = appState.useSkinCycling ? appState.pmMode : "a";
    if (activeMode === "a") appState.pm_a = sortRoutine(appState.pm_a.filter(x => x !== prodId), false);
    else if (activeMode === "b") appState.pm_b = sortRoutine(appState.pm_b.filter(x => x !== prodId), false);
    else appState.pm_c = sortRoutine(appState.pm_c.filter(x => x !== prodId), false);
  }
  saveState();
  renderMain();
}


function addProductToSlot(prodId, target) {
  if (target === "am") {
    if (!appState.am.includes(prodId)) appState.am.push(prodId);
    appState.am = sortRoutine(appState.am, true);
    appState.tab = "am";
  } else {
    const activeMode = appState.useSkinCycling ? appState.pmMode : "a";
    if (activeMode === "a") {
      if (!appState.pm_a.includes(prodId)) appState.pm_a.push(prodId);
      appState.pm_a = sortRoutine(appState.pm_a, false);
    } else if (activeMode === "b") {
      if (!appState.pm_b.includes(prodId)) appState.pm_b.push(prodId);
      appState.pm_b = sortRoutine(appState.pm_b, false);
    } else {
      if (!appState.pm_c.includes(prodId)) appState.pm_c.push(prodId);
      appState.pm_c = sortRoutine(appState.pm_c, false);
    }
    appState.tab = "pm";
  }
  saveState();
  renderMain();
  closeModal();
}

function adoptDmProductToSlot(prodOrIdOrIdx, target = "am") {
  let prod = null;
  if (prodOrIdOrIdx && typeof prodOrIdOrIdx === "object") {
    prod = prodOrIdOrIdx;
  } else if (typeof prodOrIdOrIdx === "string") {
    prod = (window.dmResultsMap && window.dmResultsMap[prodOrIdOrIdx])
        || (window.currentLiveDmResults && window.currentLiveDmResults.find(x => x.id === prodOrIdOrIdx || x.ean === prodOrIdOrIdx || x.dan === prodOrIdOrIdx))
        || (typeof DB === "object" && DB[prodOrIdOrIdx])
        || null;
  } else if (typeof prodOrIdOrIdx === "number") {
    prod = (window.currentLiveDmResults && window.currentLiveDmResults[prodOrIdOrIdx]) || null;
  }

  if (!prod || typeof prod !== "object") {
    console.error("[adoptDmProductToSlot] Kein gültiges dm-Produkt gefunden:", prodOrIdOrIdx);
    return;
  }

  // Stabile ID & Pflichtfelder absichern
  if (!prod.id) {
    prod.id = "dm_" + (prod.dan || prod.ean || ("live_" + Math.random().toString(36).slice(2, 9)));
  }

  const kat = prod.kat || "creme";
  const colors = { reiniger: "#76a9c7", serum: "#6aa8c9", creme: "#a4c8a8", spf: "#ecd37b" };
  const shapes = { reiniger: "pump", serum: "serum", creme: "jar", spf: "tube" };

  if (!prod.c) prod.c = colors[kat] || "#a4c8a8";
  if (!prod.shape) prod.shape = shapes[kat] || "tube";
  if (!prod.wirk) prod.wirk = (prod.ff === true ? "Parfümfrei · " : "") + (prod.price ? prod.price + " · " : "") + (prod.brand || "dm");
  if (!prod.store) prod.store = `dm (${prod.price || "Drogerie"})`;
  if (typeof enrichProductClasses === "function") {
    enrichProductClasses(prod);
  } else if (!Array.isArray(prod.klassen) || prod.klassen.length === 0) {
    prod.klassen = kat === "spf" ? ["uv"] : (kat === "serum" ? ["humectant"] : ["support"]);
  }
  if (!prod.schiene) prod.schiene = "support";

  // 1. In globalem Katalog (DB) registrieren
  if (typeof DB === "object") {
    DB[prod.id] = prod;
  }
  if (typeof TEEN_DB === "object" && !TEEN_DB[prod.id]) {
    TEEN_DB[prod.id] = Object.assign({}, prod, {
      slot: kat === "reiniger" ? "reiniger" : (kat === "spf" ? "spf" : (kat === "serum" ? "active" : "creme"))
    });
  }
  if (typeof BABY_DB === "object" && !BABY_DB[prod.id]) {
    BABY_DB[prod.id] = Object.assign({}, prod, {
      slot: kat === "reiniger" ? "reiniger" : (kat === "spf" ? "spf" : "creme")
    });
  }

  // 2. In appState.customProducts persistieren (überlebt Reload)
  if (typeof appState === "object") {
    if (!appState.customProducts) appState.customProducts = {};
    appState.customProducts[prod.id] = prod;
  }

  // 3. Dem aktiven Profil / Schrank zuordnen
  const activeProfile = typeof getActiveProfile === "function" ? getActiveProfile() : null;
  const profileCat = activeProfile ? activeProfile.category : (appState.profile || "adult");

  if (profileCat === "teen") {
    const slot = kat === "reiniger" ? "reiniger" : (kat === "spf" ? "spf" : (kat === "serum" ? "active" : "creme"));
    if (!appState.teen) appState.teen = { reiniger: [], active: [], creme: [], spf: [] };
    if (!appState.teen[slot]) appState.teen[slot] = [];
    if (!appState.teen[slot].includes(prod.id)) appState.teen[slot].push(prod.id);
  } else if (profileCat === "baby" || profileCat === "child") {
    const slot = kat === "reiniger" ? "reiniger" : (kat === "spf" ? "spf" : "creme");
    const targetKey = profileCat;
    if (!appState[targetKey]) appState[targetKey] = { reiniger: [], creme: [], spf: [] };
    if (!appState[targetKey][slot]) appState[targetKey][slot] = [];
    if (!appState[targetKey][slot].includes(prod.id)) appState[targetKey][slot].push(prod.id);
  } else {
    // Erwachsenen-Profil: AM oder PM
    if (target === "am") {
      if (!Array.isArray(appState.am)) appState.am = [];
      if (!appState.am.includes(prod.id)) appState.am.push(prod.id);
      if (typeof sortRoutine === "function") appState.am = sortRoutine(appState.am, true);
      appState.tab = "am";
    } else {
      let activeList = typeof getActivePMList === "function" ? getActivePMList() : appState.pm_a;
      if (!Array.isArray(activeList)) {
        appState.pm_a = appState.pm_a || [];
        activeList = appState.pm_a;
      }
      if (!activeList.includes(prod.id)) activeList.push(prod.id);
      if (typeof sortRoutine === "function") {
        const activeMode = appState.useSkinCycling ? appState.pmMode : "a";
        if (activeMode === "a") appState.pm_a = sortRoutine(appState.pm_a, false);
        else if (activeMode === "b") appState.pm_b = sortRoutine(appState.pm_b, false);
        else appState.pm_c = sortRoutine(appState.pm_c, false);
      }
      appState.tab = "pm";
    }
  }

  // 4. Speichern, Modal schließen, Schrank aktualisieren
  if (typeof saveState === "function") saveState();
  if (typeof closeModal === "function") closeModal();
  if (typeof renderMain === "function") renderMain();

  // 5. Toast Feedback
  const targetName = (profileCat === "adult")
    ? (target === "am" ? "Morgen-Routine" : "Abend-Routine")
    : (activeProfile ? activeProfile.name : "Schrank");

  const esc = typeof escapeHtml === "function" ? escapeHtml : (s) => String(s || "");
  if (typeof showToast === "function") {
    showToast(`🛒 <strong>${esc(prod.brand)} ${esc(prod.name)}</strong> in ${targetName} gestellt!`);
  }
}
window.adoptDmProductToSlot = adoptDmProductToSlot;

// 3-Second Verdict Logic against Cabinet

function openGuardModal() {
  const tags = [].concat((appState && appState.tags) || []);
  const isRx = tags.some(function (t) {
    const s = String(t || "").toLowerCase();
    return s.indexOf("begleit") !== -1 || s.indexOf("rx") !== -1;
  });
  const hasRxProd = (typeof getFullCabinetProductIds === "function" ? getFullCabinetProductIds() : [])
    .map(function (id) { return typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(id) : (typeof DB !== "undefined" ? DB[id] : null); })
    .some(function (p) { return p && (p.rx || p.schiene === "arzneimittel" || (Array.isArray(p.klassen) && p.klassen.some(function (k) { return /retinoid_rx|bpo/.test(k); }))); });

  const lead = (isRx || hasRxProd)
    ? "Du hast <strong>Begleitpflege / ein Rx-Mittel</strong> aktiv. Medizinische Akne-Wirkstoffe (z.&nbsp;B. Adapalen / BPO) können die Barriere vorübergehend empfindlicher machen — die App filtert dann schärfer beim Einkauf & Layering."
    : "Der <strong>Schrank-Wächter</strong> prüft Konflikte in deiner Routine (gleiche Wirkstoffklasse, Stacking, fehlender LSF). <strong>Begleitpflege</strong> schaltet du im Quiz oder im Rx-Wegweiser dazu — dann wird bei Duft & starken Säuren strenger gefiltert.";

  showModalSheet(`
    <h2>🛡️ Was bedeutet Begleitpflege-Schutz?</h2>
    <p style="font-size:0.92rem;line-height:1.45">${lead}</p>
    <div class="pharma-box">
      <div class="pharma-title">${(isRx || hasRxProd) ? "Deine automatischen Schutz-Regeln:" : "Was der Wächter prüft:"}</div>
      <div class="pharma-text">
        • <strong>Kein Säure-Stacking:</strong> AHA/BHA-Peelings werden am selben Abend blockiert.<br>
        • <strong>Reizstoff-Filter:</strong> Warnung vor austrocknenden Alkoholen & ätherischen Zitrusölen.<br>
        • <strong>Barriere-Support:</strong> Bevorzugung von Panthenol, Ceramiden und Glycerin.
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button class="primary" onclick="closeModal()">Verstanden</button>
      <button class="ghost-btn" style="margin-top:0" onclick="openDoctorGuideModal()">🩺 Zum Dermatologie- & Rx-Wegweiser</button>
    </div>
  `);
}

// Dermatologist & Prescription Guide
function openDoctorGuideModal() {
  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--rx);font-weight:700;letter-spacing:0.05em">Evidenz & Medizin</div>
    <h2 style="margin-top:0.2rem">🩺 Dermatologie- & Rx-Wegweiser</h2>
    <p style="font-size:0.88rem;color:var(--muted);margin-top:-0.2rem;line-height:1.4">
      Wann Kosmetik nicht mehr ausreicht, was die Wissenschaft empfiehlt und wie dein Schrank medizinische Therapien begleitet.
    </p>

    <div class="pharma-box" style="border-left-color:var(--rx);background:#f2f5fb;margin:0.9rem 0">
      <div class="pharma-title" style="color:var(--rx)">⚖️ Wo Kosmetik per Gesetz endet (Pharmazie-Check)</div>
      <div class="pharma-text" style="font-size:0.84rem;line-height:1.45">
        Laut EU-Kosmetikverordnung (VO (EG) 1223/2009) dürfen freiverkäufliche Kosmetika keine Krankheiten heilen oder physiologische Tiefenfunktionen verändern.
        <br><br>
        • <strong>Kosmetik (dm / Rossmann) kann:</strong> Milde Verhornung an der Oberfläche lösen (BHA), Feuchtigkeit binden, die Barriere mit Lipiden/Ceramiden schützen und UV-Schäden vorbeugen.
        <br>
        • <strong>Wann zum Hautarzt?</strong> Bei tief sitzenden, schmerzhaften Unterlagerungen/Knoten (Zysten), persistierenden Pusteln, Entzündungen die länger als 8–12 Wochen anhalten, oder wenn Narbengefahr besteht. Hier ist Kosmetik allein wirkungslos und führt oft zu teurem Frust.
      </div>
    </div>

    <div class="alt-title" style="margin-top:1.1rem">Die 4 echten medizinischen Wirkstoffklassen</div>
    <div style="display:flex;flex-direction:column;gap:9px">
      
      <div style="background:#fff;border:1px solid var(--line);border-radius:10px;padding:0.75rem 0.9rem">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:700;font-size:0.9rem;color:var(--ink)">1. Topische Retinoide (3. Generation)</span>
          <span class="tag rx">Rezeptpflichtig</span>
        </div>
        <div style="font-size:0.82rem;color:var(--muted);margin-top:3px">
          <strong>Stoffe:</strong> Adapalen (0.1%), Tretinoin, Trifaroten (z.B. Differin, Aknemycin Plus, Selgamis).
        </div>
        <div style="font-size:0.8rem;color:var(--ink);margin-top:4px;line-height:1.35">
          <em>Wirkung:</em> Bindet selektiv an RAR-Rezeptoren und normalisiert die Verhornung in der Tiefe des Haarfollikels. Verhindert neue Mitesser an der Wurzel. Deutlich potenter als kosmetisches Retinol.
        </div>
      </div>

      <div style="background:#fff;border:1px solid var(--line);border-radius:10px;padding:0.75rem 0.9rem">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:700;font-size:0.9rem;color:var(--ink)">2. Benzoylperoxid (BPO) & Kombis</span>
          <span class="tag" style="background:#eaf0f8;color:var(--rx);font-weight:600">Apotheke / Rx</span>
        </div>
        <div style="font-size:0.82rem;color:var(--muted);margin-top:3px">
          <strong>Stoffe:</strong> BPO 3–5% (z.B. Benzaknen) oder Fixkombi BPO + Clindamycin / Adapalen (Clienzo, Duac, Epiduo).
        </div>
        <div style="font-size:0.8rem;color:var(--ink);margin-top:4px;line-height:1.35">
          <em>Wirkung:</em> Setzt Sauerstoffradikale frei und tötet Aknebakterien anaerob ab – <strong>ohne jede Resistenzbildung</strong>. Leitlinien-Empfehlung #1 bei entzündlichen Pickeln.
        </div>
      </div>

      <div style="background:#fff;border:1px solid var(--line);border-radius:10px;padding:0.75rem 0.9rem">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:700;font-size:0.9rem;color:var(--ink)">3. Azelainsäure 15 % – 20 %</span>
          <span class="tag rx">Rezeptpflichtig</span>
        </div>
        <div style="font-size:0.82rem;color:var(--muted);margin-top:3px">
          <strong>Stoffe:</strong> Azelaic Acid 15% / 20% Gel oder Creme (z.B. Skinoren).
        </div>
        <div style="font-size:0.8rem;color:var(--ink);margin-top:4px;line-height:1.35">
          <em>Wirkung:</em> Wirkt antibakteriell, stark antientzündlich und hemmt die Tyrosinase (mildert rote Pickelmale/PIH). Sehr gut verträglich, auch in der Schwangerschaft oft erste Wahl.
        </div>
      </div>

      <div style="background:#fff;border:1px solid var(--line);border-radius:10px;padding:0.75rem 0.9rem">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:700;font-size:0.9rem;color:var(--ink)">4. Systemische Therapien</span>
          <span class="tag" style="background:#fde8e8;color:var(--no);font-weight:600">Streng Ärztlich</span>
        </div>
        <div style="font-size:0.82rem;color:var(--muted);margin-top:3px">
          <strong>Stoffe:</strong> Orales Isotretinoin (Kapseln) oder hormonelle Therapie.
        </div>
        <div style="font-size:0.8rem;color:var(--ink);margin-top:4px;line-height:1.35">
          <em>Wirkung:</em> Bei schwerer, knotiger oder narbiger Akne. Schaltet die Talgproduktion systemisch ab. Erfordert strenge Laborkontrollen und Verhütung (stark fruchtschädigend). Kein Kosmetik-Thema.
        </div>
      </div>

    </div>

    <div style="margin-top:1.2rem;display:flex;flex-direction:column;gap:8px">
      <button class="primary" onclick="activateRxBegleitpflege()">
        🛡️ Ich nutze/plane ein Rezept (z.B. Adapalen) ➔ Begleitpflege aktivieren
      </button>
      <button class="ghost-btn" style="margin-top:0" onclick="openMarketGuideModal()">
        🛒 Passende Drogerie- & Apothekenprodukte ansehen (Markt-Navigator)
      </button>
      <button class="ghost-btn" style="margin-top:0" onclick="closeModal()">Schließen</button>
      <div style="font-size:0.75rem;color:var(--muted);text-align:center;margin-top:6px">
        ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
      </div>
    </div>
  `);
}

function activateRxBegleitpflege() {
  if (!appState.tags.includes("Rx-Begleitpflege")) {
    appState.tags.push("Rx-Begleitpflege");
  }
  if (!appState.pm_a.includes("adap")) {
    appState.pm_a = sortRoutine(["baleaWash", "ha", "adap", "baleaCreme"], false);
    appState.pm_b = sortRoutine(["baleaWash", "ha", "clienzo", "baleaCreme"], false);
    appState.pm_c = sortRoutine(["baleaWash", "purito", "baleaCreme"], false);
  }
  saveState();
  closeModal();
  renderMain();
  alert("🛡️ Rx-Begleitpflege wurde aktiviert! Dein Schrank schützt deine Haut nun vor aggressiven Säuren und Reiz-Stacking.");
}

// Market Decision Engine & Navigator
function openMarketGuideModal() {
  const profileTags = appState.tags.join(", ") || "Individuell";
  const isAcne = appState.tags.includes("Akne-prone");
  const isRx = appState.tags.includes("Rx-Begleitpflege");
  // Arzt-Thema: keine Serum-/Active-Upsell-Liste im Markt-Navigator
  const isArztThema = (typeof hasArztThema === "function") ? hasArztThema() : (appState.tags || []).some(t => String(t).includes("Arzt-Thema") || String(t).toLowerCase().includes("arzt-thema") || String(t).toLowerCase().includes("zystisch"));

  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--gold);font-weight:700;letter-spacing:0.05em">Einkaufs-Kompass</div>
    <h2 style="margin-top:0.2rem">🛒 Markt-Navigator (dm, Rossmann & Apotheke)</h2>
    <p style="font-size:0.88rem;color:var(--muted);margin-top:-0.2rem;line-height:1.4">
      Wie du aus über 10.000 Produkten im Regal zielsicher das Richtige für dein Profil (<strong>${profileTags}</strong>) wählst.
    </p>

    <!-- Der 3-Stufen-Pharmazie-Filter -->
    <div class="pharma-box" style="margin:0.9rem 0">
      <div class="pharma-title">🔬 Der 3-Stufen-Pharmazie-Filter für deinen Drogerie-Einkauf</div>
      <div class="pharma-text" style="font-size:0.84rem;line-height:1.45">
        <strong>1. Slot-Disziplin (Kauf nur, was fehlt):</strong> Deine Routine braucht exakt 4 Basis-Bausteine: <em>Reinigung ➔ Feuchtigkeit ➔ LSF 50</em> und maximal <em>1 gezielten Active</em>. Wer 3 verschiedene Seren kauft, erzeugt Reiz-Chaos.
        <br><br>
        <strong>2. Wirkstoff-Realität statt Marketing-Hype:</strong>
        <br>
        • <span style="color:var(--ok);font-weight:600">Top-Evidenz:</span> BHA (Salicylsäure), Azelainsäure, Retinoide, Panthenol, Glycerin, Ceramide, moderne Breitband-UV-Filter.
        <br>
        • <span style="color:var(--no);font-weight:600">Geldverschwendung:</span> Reine Collagen-Cremes (zu groß für Hautpenetration), Schneckenschleim (keine belastbaren RCTs), ätherische Zitrusöle / starkes Parfüm (hohes Allergie- & Reizrisiko).
        <br><br>
        <strong>3. Schrank-Check an der Kasse:</strong> Beißt sich das Produkt mit deinem Abend (z.B. keine Säure am Retinoid-Abend)?
      </div>
    </div>

    <div class="alt-title" style="margin-top:1.2rem">Kuratierte Top-Empfehlungen für dein Profil</div>

    <!-- Category 1: Reinigung -->
    <div style="margin-bottom:1rem">
      <div style="font-weight:700;font-size:0.86rem;color:var(--muted);text-transform:uppercase;margin-bottom:6px">1. Milde Reinigung (Morgens & Abends)</div>
      <div style="display:flex;flex-direction:column;gap:7px">
        <div class="alt-card" style="padding:0.7rem 0.85rem">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.9rem">Balea Med Ultra Sensitive Waschgel</div>
            <div style="font-size:0.78rem;color:var(--muted)">Parfümfrei, extrem tensidmild · <strong style="color:var(--ok)">dm (~2,45 €)</strong></div>
          </div>
          <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('baleaWash', 'am'); openMarketGuideModal();">+ In Schrank</button>
        </div>
        <div class="alt-card" style="padding:0.7rem 0.85rem">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.9rem">Isana Pure Reinigungsschaum</div>
            <div style="font-size:0.78rem;color:var(--muted)">Budget-Favorit, sanft & seifenfrei · <strong style="color:var(--ok)">Rossmann (~2,95 €)</strong></div>
          </div>
          <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('isanaWash', 'am'); openMarketGuideModal();">+ In Schrank</button>
        </div>
        <div class="alt-card" style="padding:0.7rem 0.85rem">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.9rem">CeraVe Hydrating Cleanser</div>
            <div style="font-size:0.78rem;color:var(--muted)">Schäumt nicht, schützt mit 3 Ceramiden · <strong style="color:var(--ok)">Apotheke / dm (~11 €)</strong></div>
          </div>
          <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('ceraveWash', 'am'); openMarketGuideModal();">+ In Schrank</button>
        </div>
      </div>
    </div>

    <!-- Category 2: Gezieltes Wirkstoff-Serum -->
    <div style="margin-bottom:1rem">
      <div style="font-weight:700;font-size:0.86rem;color:var(--muted);text-transform:uppercase;margin-bottom:6px">${isArztThema ? "2. Support / Feuchte (kein Active-Upsell bei Arzt-Thema)" : "2. Gezieltes Wirkstoff-Serum (Evidenz)"}</div>
      <div style="display:flex;flex-direction:column;gap:7px">
        ${isArztThema ? `
          <div class="alt-card" style="padding:0.7rem 0.85rem;background:#f8fafc">
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:0.9rem">Arzt-Thema – kein Serum-Upgrade</div>
              <div style="font-size:0.78rem;color:var(--muted)">Keine stärkeren Actives als Shop-Vorschlag. Nur milder Support / Basis.</div>
            </div>
          </div>
          <div class="alt-card" style="padding:0.7rem 0.85rem">
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:0.9rem">Good Molecules Hyaluronic Acid Serum</div>
              <div style="font-size:0.78rem;color:var(--muted)">Support-Feuchte, kein Active-Upsell – <strong style="color:var(--ok)">Online / Handel (~12 €)</strong></div>
            </div>
            <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('ha', 'am'); openMarketGuideModal();">+ In Schrank</button>
          </div>
          <div class="alt-card" style="padding:0.7rem 0.85rem">
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:0.9rem">Nø Cosmetics 120h Liquid Hydrator</div>
              <div style="font-size:0.78rem;color:var(--muted)">Panthenol + Ectoin Barriere-Feuchte – <strong style="color:var(--ok)">dm / Rossmann (~9,95 €)</strong></div>
            </div>
            <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('noHydrator', 'am'); openMarketGuideModal();">+ In Schrank</button>
          </div>
` : isAcne || isRx ? `
          <div class="alt-card" style="padding:0.7rem 0.85rem">
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:0.9rem">Geek & Gorgeous aPAD (Azelain-Derivat)</div>
              <div style="font-size:0.78rem;color:var(--muted)">Mild gegen Rötungen, Pickel & Talg · <strong style="color:var(--ok)">dm / Online (~10,50 €)</strong></div>
            </div>
            <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('apad', 'am'); openMarketGuideModal();">+ In Schrank</button>
          </div>
          <div class="alt-card" style="padding:0.7rem 0.85rem">
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:0.9rem">The Ordinary Azelaic Acid 10%</div>
              <div style="font-size:0.78rem;color:var(--muted)">Reine Azelainsäure, mild keratolytisch · <strong style="color:var(--ok)">dm / Douglas (~12 €)</strong></div>
            </div>
            <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('aza', 'am'); openMarketGuideModal();">+ In Schrank</button>
          </div>
          <div class="alt-card" style="padding:0.7rem 0.85rem">
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:0.9rem">Paula's Choice 2% BHA Liquid Peeling</div>
              <div style="font-size:0.78rem;color:var(--muted)">Klärt verstopfte Poren fettlöslich · <strong style="color:var(--ok)">Douglas / Online (~39 €)</strong></div>
            </div>
            <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('bha', 'pm'); openMarketGuideModal();">+ In Schrank</button>
          </div>
        ` : `
          <div class="alt-card" style="padding:0.7rem 0.85rem">
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:0.9rem">Good Molecules Hyaluronic Acid Serum</div>
              <div style="font-size:0.78rem;color:var(--muted)">Reine Tiefenfeuchte ohne Reizstoffe · <strong style="color:var(--ok)">Online / Handel (~12 €)</strong></div>
            </div>
            <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('ha', 'am'); openMarketGuideModal();">+ In Schrank</button>
          </div>
          <div class="alt-card" style="padding:0.7rem 0.85rem">
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:0.9rem">Nø Cosmetics 120h Liquid Hydrator</div>
              <div style="font-size:0.78rem;color:var(--muted)">Panthenol + Ectoin Barriere-Feuchte · <strong style="color:var(--ok)">dm / Rossmann (~9,95 €)</strong></div>
            </div>
            <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('noHydrator', 'am'); openMarketGuideModal();">+ In Schrank</button>
          </div>
        `}
      </div>
    </div>

    <!-- Category 3: Barriere-Creme -->
    <div style="margin-bottom:1rem">
      <div style="font-weight:700;font-size:0.86rem;color:var(--muted);text-transform:uppercase;margin-bottom:6px">3. Feuchtigkeits- & Barriere-Creme</div>
      <div style="display:flex;flex-direction:column;gap:7px">
        <div class="alt-card" style="padding:0.7rem 0.85rem">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.9rem">Balea Med Ultra Sensitive Intensivcreme</div>
            <div style="font-size:0.78rem;color:var(--muted)">Cica + 7% Panthenol, unschlagbarer Preis · <strong style="color:var(--ok)">dm (~3,95 €)</strong></div>
          </div>
          <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('baleaCreme', 'pm'); openMarketGuideModal();">+ In Schrank</button>
        </div>
        <div class="alt-card" style="padding:0.7rem 0.85rem">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.9rem">Isana Pure Feuchtigkeitscreme</div>
            <div style="font-size:0.78rem;color:var(--muted)">Leicht, zieht schnell ein, Niacinamid · <strong style="color:var(--ok)">Rossmann (~3,95 €)</strong></div>
          </div>
          <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('isanaCreme', 'pm'); openMarketGuideModal();">+ In Schrank</button>
        </div>
        <div class="alt-card" style="padding:0.7rem 0.85rem">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.9rem">Purito Mighty Bamboo Panthenol Cream</div>
            <div style="font-size:0.78rem;color:var(--muted)">10% Panthenol SOS-Pflege bei Retinoid-Trockenheit · <strong style="color:var(--ok)">EU-Shop (~18 €)</strong></div>
          </div>
          <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('purito', 'pm'); openMarketGuideModal();">+ In Schrank</button>
        </div>
      </div>
    </div>

    <!-- Category 4: Täglicher LSF 50+ -->
    <div style="margin-bottom:1rem">
      <div style="font-weight:700;font-size:0.86rem;color:var(--muted);text-transform:uppercase;margin-bottom:6px">4. Täglicher Breitband-Sonnenschutz (LSF 50+)</div>
      <div style="display:flex;flex-direction:column;gap:7px">
        <div class="alt-card" style="padding:0.7rem 0.85rem">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.9rem">Balea Med Ultra Sensitive Sonnenfluid LSF 50+</div>
            <div style="font-size:0.78rem;color:var(--muted)">Parfümfrei, brennt nicht in den Augen · <strong style="color:var(--ok)">dm (~5,95 €)</strong></div>
          </div>
          <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('baleaSpf', 'am'); openMarketGuideModal();">+ In Schrank</button>
        </div>
        <div class="alt-card" style="padding:0.7rem 0.85rem">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:0.9rem">La Roche-Posay Anthelios UVMune 400 LSF 50+</div>
            <div style="font-size:0.78rem;color:var(--muted)">Modernster Mexoryl 400 Filter gegen tiefste UVA-Strahlen · <strong style="color:var(--ok)">Apotheke (~19 €)</strong></div>
          </div>
          <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;font-size:0.76rem" onclick="addProductToSlot('anthelios', 'am'); openMarketGuideModal();">+ In Schrank</button>
        </div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-top:1.2rem">
      <button class="primary" onclick="closeModal(); renderMain()">Zurück zum Schrank</button>
      <div style="font-size:0.75rem;color:var(--muted);text-align:center;margin-top:4px">
        ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
      </div>
    </div>
  `);
}
