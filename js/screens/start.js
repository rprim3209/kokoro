// ==========================================
// Start / Begrüßungs-Screen
// Clean hero: Quiz + Schrank (no Land/Kategorie/Concerns accordions)
// Country picker helpers stay here — reused by Quiz & Optionen
// ==========================================

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

/** Speichert Land ohne Modal zu schließen (Quiz-Schritt). */
function selectQuizCountry(code) {
  var cc = String(code || "AT").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) cc = "AT";
  if (typeof appState !== "undefined") {
    appState.country = cc;
    if (Array.isArray(appState.profiles)) {
      appState.profiles.forEach(function (pr) { pr.country = cc; });
    }
  }
  if (typeof saveState === "function") saveState();
  if (typeof showToast === "function") {
    var label = typeof countryLabel === "function" ? countryLabel(cc) : cc;
    showToast("🌍 Land: <strong>" + label + " (" + cc + ")</strong> — für alle Kategorien & Online-Suche aktiv");
  }
  if (typeof renderQuizCountryStep === "function") renderQuizCountryStep();
}

function renderStartScreen(container) {
  if (!container) container = document.getElementById("appContent");
  if (!container) return;

  const disclaimer = "Keine Therapie — nur Einkauf & Layering-Hilfe.";

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

      <div class="start-actions">
        <button type="button" class="start-action-card primary" onclick="openQuizModal()">
          <div class="start-action-icon">🌱</div>
          <div class="start-action-body">
            <div class="start-action-title">
              <span>Hautprofil-Quiz starten</span>
              <span class="arrow">→</span>
            </div>
            <div class="start-action-desc">
              Land, Hautzustand &amp; Prioritäten — dann passende Routine vorschlagen.
            </div>
          </div>
        </button>

        <button type="button" class="start-action-card secondary" onclick="typeof openCabinet==='function'?openCabinet():switchScreen('cabinet')">
          <div class="start-action-icon">🧴</div>
          <div class="start-action-body">
            <div class="start-action-title">
              <span>Zu meinem Schrank</span>
              <span class="arrow">→</span>
            </div>
            <div class="start-action-desc">
              Produkte eintragen, Lücken erkennen und Reiz-Konflikte auflösen.
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
  window.renderCountryChipsHtml = renderCountryChipsHtml;
  window.renderCountryPickerHtml = renderCountryPickerHtml;
  window.filterCountryPicker = filterCountryPicker;
  window.getProfileCountryOptionsList = getProfileCountryOptionsList;
  window.selectQuizCountry = selectQuizCountry;
  // Back-compat aliases (old Start accordion handlers)
  window.selectStartCountry = function (code) {
    if (typeof setProfileCountry === "function") setProfileCountry(code);
    else selectQuizCountry(code);
  };
  window.selectStartCategory = function (cat) {
    if (typeof switchProfile === "function") switchProfile(cat);
    else if (typeof appState !== "undefined") appState.profile = cat;
  };
}
