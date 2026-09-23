// ==========================================
// Start / Begrüßungs-Screen
// Compact accordion sections (Land / Kategorie / Concerns)
// ==========================================

/** Which start accordion is open: 'country' | 'category' | 'concerns' | null */
var startAccordionOpen = null;

function toggleStartAccordion(id) {
  startAccordionOpen = startAccordionOpen === id ? null : id;
  if (typeof renderStartScreen === "function") renderStartScreen();
}

function selectStartCategory(cat) {
  if (typeof switchProfile === "function") {
    switchProfile(cat);
  } else {
    appState.profile = cat;
  }
  appState.view = "start";
  startAccordionOpen = null; // auto-collapse after pick
  if (typeof saveState === "function") saveState();
  if (typeof updateCategoryNav === "function") updateCategoryNav();
  renderStartScreen();
}

function selectStartCountry(code) {
  if (typeof setProfileCountry === "function") {
    setProfileCountry(code);
  } else {
    const p = typeof getActiveProfile === "function" ? getActiveProfile() : null;
    if (p) p.country = code;
    if (typeof saveState === "function") saveState();
  }
  appState.view = "start";
  startAccordionOpen = null; // auto-collapse after pick
  renderStartScreen();
}

/** Alle EU-27 (+ CH/NO/IS) als durchsuchbares, scrollbar Grid. */
function getProfileCountryOptionsList() {
  if (typeof PROFILE_COUNTRY_OPTIONS !== "undefined" && Array.isArray(PROFILE_COUNTRY_OPTIONS) && PROFILE_COUNTRY_OPTIONS.length) {
    return PROFILE_COUNTRY_OPTIONS;
  }
  return [
    { code: "AT", label: "Österreich" }, { code: "DE", label: "Deutschland" }, { code: "IT", label: "Italien" }, { code: "FR", label: "Frankreich" }
  ];
}

function renderCountryPickerHtml(selected, onclickName, opts) {
  opts = opts || {};
  const uid = opts.uid || ("cp_" + Math.random().toString(36).slice(2, 8));
  const list = getProfileCountryOptionsList();
  const sel = String(selected || "AT").toUpperCase();
  const selObj = list.find(o => o.code === sel);
  const selLabel = selObj ? selObj.label : sel;
  const maxH = opts.maxHeight || "220px";

  const eu = list.filter(o => (o.group || "EU") === "EU");
  const efta = list.filter(o => o.group === "EFTA");

  function chip(o) {
    const active = o.code === sel;
    return `<button type="button" class="start-pill-btn country-chip ${active ? "active" : ""}" data-code="${o.code}" data-label="${o.label}" title="${o.label}" style="padding:0.32rem 0.65rem;font-size:0.78rem;justify-content:flex-start" onclick="${onclickName}('${o.code}')">
      <strong>${o.code}</strong>&nbsp;<span style="opacity:0.8;font-weight:600">${o.label}</span>
    </button>`;
  }

  return `
    <div class="country-picker" id="${uid}" data-onclick="${onclickName}">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:0.4rem">
        <div style="font-size:0.8rem;color:var(--ink)">
          Gewählt: <strong>${sel}</strong> · ${selLabel}
          <span style="color:var(--muted);font-size:0.72rem"> · EU-27 vollständig</span>
        </div>
        <input type="search" class="country-picker-search" placeholder="Land suchen (z. B. Italien, PL, Griechen…)" 
          style="flex:1;min-width:160px;max-width:280px;padding:7px 10px;border:1px solid var(--line);border-radius:8px;font-size:0.82rem;background:#fcfaf6"
          oninput="filterCountryPicker('${uid}', this.value)" autocomplete="off">
      </div>
      <div class="country-picker-scroll" style="max-height:${maxH};overflow-y:auto;border:1px solid var(--line);border-radius:10px;background:#fff;padding:8px">
        <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin:0 0 6px">EU-Mitgliedstaaten</div>
        <div class="start-pills-row country-chip-row" style="margin:0;gap:6px">
          ${eu.map(chip).join("")}
        </div>
        ${efta.length ? `
          <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin:10px 0 6px">EFTA / Nachbarn</div>
          <div class="start-pills-row country-chip-row" style="margin:0;gap:6px">
            ${efta.map(chip).join("")}
          </div>
        ` : ''}
        <div class="country-picker-empty" style="display:none;font-size:0.8rem;color:var(--muted);padding:8px 2px">Kein Land gefunden — anderen Suchbegriff versuchen.</div>
      </div>
    </div>
  `;
}

function filterCountryPicker(uid, query) {
  const root = document.getElementById(uid);
  if (!root) return;
  const q = String(query || "").trim().toLowerCase();
  let visible = 0;
  root.querySelectorAll(".country-chip").forEach(btn => {
    const code = (btn.getAttribute("data-code") || "").toLowerCase();
    const label = (btn.getAttribute("data-label") || "").toLowerCase();
    const ok = !q || code.includes(q) || label.includes(q);
    btn.style.display = ok ? "" : "none";
    if (ok) visible++;
  });
  root.querySelectorAll(".country-chip-row").forEach(row => {
    const any = Array.from(row.querySelectorAll(".country-chip")).some(b => b.style.display !== "none");
    const header = row.previousElementSibling;
    if (header) header.style.display = any ? "" : "none";
    row.style.display = any ? "" : "none";
  });
  const empty = root.querySelector(".country-picker-empty");
  if (empty) empty.style.display = visible ? "none" : "block";
}

/** Alias für Settings / ältere Aufrufe */
function renderCountryChipsHtml(selected, onclickName) {
  return renderCountryPickerHtml(selected, onclickName, { uid: "countryPickerMain", maxHeight: "240px" });
}

function renderStartAccordion(id, titleSummary, panelHtml) {
  const open = startAccordionOpen === id;
  const expanded = open ? "true" : "false";
  return `
    <div class="start-accordion start-profile-card${open ? " is-open" : ""}" data-acc="${id}">
      <button type="button" class="start-acc-summary" aria-expanded="${expanded}" aria-controls="start-acc-panel-${id}" id="start-acc-btn-${id}" onclick="toggleStartAccordion('${id}')">
        <span class="start-acc-title">${titleSummary}</span>
        <span class="start-acc-chevron" aria-hidden="true">${open ? "▴" : "▾"}</span>
      </button>
      <div class="start-acc-panel" id="start-acc-panel-${id}" role="region" aria-labelledby="start-acc-btn-${id}" ${open ? "" : "hidden"}>
        ${panelHtml}
      </div>
    </div>
  `;
}

function getConcernSummaryLabel() {
  if (typeof CONCERN_QUICK_TAGS === "undefined" || !Array.isArray(CONCERN_QUICK_TAGS)) {
    return "keine";
  }
  const active = CONCERN_QUICK_TAGS.filter(function (c) {
    return typeof hasTag === "function" && hasTag(c.id);
  });
  if (!active.length) return "keine";
  if (active.length <= 2) return active.map(function (c) { return c.label; }).join(", ");
  return active.length + " gewählt";
}

function renderStartScreen(container) {
  if (!container) container = document.getElementById("appContent");
  if (!container) return;

  const currentProf = appState.profile || "adult";
  const sub = typeof getProfileSubtitle === "function" ? getProfileSubtitle(currentProf) : "";
  const country = typeof getProfileCountry === "function" ? getProfileCountry() : "AT";
  const countryName = typeof countryLabel === "function" ? countryLabel(country) : country;

  const catMeta = {
    adult: {
      name: "Erwachsen",
      icon: "👤",
      focus: "Akne, Barriere-Support & Skin Cycling (Adapalen / BPO / Actives)"
    },
    teen: {
      name: "Teenie",
      icon: "🧑‍🦱",
      focus: "Milde AAD-Basispflege, Porenklärung & Schutz vor schädlichem Anti-Aging-Hype"
    },
    child: {
      name: "Kind",
      icon: "🧒",
      focus: "Präpubertäre Haut: Sanfte Reinigung, Barrierecreme & LSF 50+"
    },
    baby: {
      name: "Baby",
      icon: "👶",
      focus: "Säuglinge (<3 J.): 100% Parfümfrei-Prio, Windelschutz & EU Annex I Teil B"
    }
  };

  const meta = catMeta[currentProf] || catMeta.adult;
  const disclaimer = "Keine Therapie — nur Einkauf & Layering-Hilfe.";
  const concernSummary = getConcernSummaryLabel();

  const countryPanel = `
    <p class="start-acc-hint">EU-27 + CH/NO/IS — gilt für alle Kategorien &amp; Live-Suche.</p>
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:0.55rem;flex-wrap:wrap">
      <button type="button" class="country-location-btn" id="btnDetectCountryLocationStart" onclick="detectCountryFromLocationUI(this)" style="padding:0.42rem 0.85rem;font-size:0.8rem;font-weight:700;display:inline-flex;align-items:center;gap:6px;background:#eef6f3;color:#1e4620;border:1px solid #b7dfca;border-radius:8px;cursor:pointer">
        <span aria-hidden="true">📍</span> Standort des Handys verwenden
      </button>
      <span id="countryLocationStatusStart" style="font-size:0.76rem;color:var(--muted)"></span>
    </div>
    ${renderCountryPickerHtml(country, "selectStartCountry", { uid: "startCountryPicker", maxHeight: "220px" })}
  `;

  const categoryPanel = `
    <div class="start-pills-row">
      <button type="button" class="start-pill-btn ${currentProf === 'adult' ? 'active' : ''}" onclick="selectStartCategory('adult')">
        👤 Erwachsen
      </button>
      <button type="button" class="start-pill-btn ${currentProf === 'teen' ? 'active pill-teen' : ''}" onclick="selectStartCategory('teen')">
        🧑‍🦱 Teenie
      </button>
      <button type="button" class="start-pill-btn ${currentProf === 'child' ? 'active pill-child' : ''}" onclick="selectStartCategory('child')">
        🧒 Kind
      </button>
      <button type="button" class="start-pill-btn ${currentProf === 'baby' ? 'active pill-baby' : ''}" onclick="selectStartCategory('baby')">
        👶 Baby
      </button>
    </div>
    <div class="start-profile-focus">
      ${sub ? `<strong>${sub}</strong> · ` : ''}${meta.focus}
    </div>
  `;

  const concernsPanel = typeof renderConcernQuickPanelHtml === "function"
    ? renderConcernQuickPanelHtml()
    : (typeof renderConcernQuickHtml === "function" ? renderConcernQuickHtml() : "");

  container.innerHTML = `
    <div class="welcome-box">
      <div class="start-eyebrow">
        <span aria-hidden="true">🌿</span> Evidenzbasierter Routine-Check · EU-27 + DACH
      </div>

      <h1 class="start-hero-title">
        Schluss mit Fehlkäufen &amp; Reiz-Chaos.
      </h1>

      <p class="start-hero-desc">
        Prüfe deine Kosmetik in Sekunden auf Reiz-Stacking, Lücken und echte Verträglichkeit. Neutral, unabhängig &amp; ohne Verkaufsabsicht.
      </p>

      <div class="start-disclaimer" role="note">
        <span class="start-disclaimer-icon" aria-hidden="true">⚖️</span>
        <span class="start-disclaimer-text">${disclaimer}</span>
      </div>

      ${renderStartAccordion(
        "country",
        `1. Land · <strong>${country}</strong> ${countryName}`,
        countryPanel
      )}

      ${renderStartAccordion(
        "category",
        `2. Kategorie · <strong>${meta.icon} ${meta.name}</strong>`,
        categoryPanel
      )}

      ${renderStartAccordion(
        "concerns",
        `3. Concerns · <strong>${concernSummary}</strong>`,
        concernsPanel
      )}

      <div class="start-actions">
        <button type="button" class="start-action-card primary" onclick="typeof openCabinet==='function'?openCabinet():switchScreen('cabinet')">
          <div class="start-action-icon">🧴</div>
          <div class="start-action-body">
            <div class="start-action-title">
              <span>Direkt in deinen Schrank</span>
              <span class="arrow">→</span>
            </div>
            <div class="start-action-desc">
              Bestehende Produkte eintragen, Lücken im Typ-Regal erkennen und Reiz-Konflikte auflösen.
            </div>
          </div>
        </button>

        <button type="button" class="start-action-card secondary" onclick="openQuizModal()">
          <div class="start-action-icon">🌱</div>
          <div class="start-action-body">
            <div class="start-action-title">
              <span>1-Minuten-Hautquiz starten</span>
              <span class="arrow">→</span>
            </div>
            <div class="start-action-desc">
              Hautzustand & Prioritäten ermitteln — passende evidenzbasierte Routine automatisch vorschlagen.
            </div>
          </div>
        </button>
      </div>

      <div class="start-secondary">
        <button type="button" class="btn-text start-scan-link" onclick="switchScreen('scan')">
          📷 Oder Barcode direkt im Laden scannen →
        </button>
      </div>
    </div>
  `;
}

function renderWelcome(container) {
  renderStartScreen(container);
}

if (typeof window !== "undefined") {
  Object.defineProperty(window, "startAccordionOpen", {
    get: function () { return startAccordionOpen; },
    set: function (v) { startAccordionOpen = v; },
    configurable: true
  });
  window.toggleStartAccordion = toggleStartAccordion;
  window.selectStartCountry = selectStartCountry;
  window.selectStartCategory = selectStartCategory;
  window.renderCountryChipsHtml = renderCountryChipsHtml;
  window.renderCountryPickerHtml = renderCountryPickerHtml;
  window.filterCountryPicker = filterCountryPicker;
  window.getProfileCountryOptionsList = getProfileCountryOptionsList;
  window.toggleConcernTag = typeof toggleConcernTag === "function" ? toggleConcernTag : window.toggleConcernTag;
}
