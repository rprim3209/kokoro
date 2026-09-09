// ==========================================
// Scanner, Live dm & Verdict Module
// Dedicated Scan Screen & Unified Evidence Modals
// ==========================================


/** Shared Live-dm block for Teen/Baby/Child add modals — adds into ACTIVE profile Schrank. */
function mountProfileDmLiveSearch(opts) {
  opts = opts || {};
  const inputId = opts.inputId;
  const resultsId = opts.resultsId;
  const chipId = opts.chipId || null;
  const catalogListId = opts.catalogListId || null;
  let dmTimer = null;

  async function runDm(q) {
    const box = document.getElementById(resultsId);
    if (!box) return;
    const query = String(q || "").trim();
    const ccNow = typeof getProfileCountry === "function" ? getProfileCountry() : "AT";
    const retailer = typeof getLiveRetailerForCountry === "function" ? getLiveRetailerForCountry(ccNow) : { label: "dm" };
    if (query.length < 2) {
      box.innerHTML = `<div style="font-size:0.8rem;color:var(--muted);padding:8px 0">Tippe mindestens 2 Zeichen für die Live-Suche bei ${escapeHtml(retailer.label)}.</div>`;
      return;
    }
    box.innerHTML = `<div style="font-size:0.8rem;color:#991b1b;padding:8px 0;font-weight:600">⏳ Frage live bei ${escapeHtml(retailer.label)} nach „${escapeHtml(query)}“…</div>`;
    const prods = await searchDmLive(query);
    window.currentLiveDmResults = prods;
    window.dmResultsMap = window.dmResultsMap || {};
    prods.forEach(pr => { if (pr && pr.id) window.dmResultsMap[pr.id] = pr; });
    if (!prods.length) {
      const errMsg = window.lastDmError || (`Kein Live-Treffer bei ${escapeHtml(retailer.label)} für „${escapeHtml(query)}“.`);
      box.innerHTML = `<div style="font-size:0.8rem;color:var(--muted);padding:6px 0">${errMsg}</div>`;
      return;
    }
    const honesty = (typeof getLiveDmHonesty === "function") ? getLiveDmHonesty() : { showWarn: false, short: "Live dm = Deutschland-Shop", badge: "" };
    const honestyBanner = honesty.showWarn
      ? `<div style="font-size:0.74rem;color:#9a3412;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:6px 8px;margin-bottom:6px;line-height:1.35"><strong>${(typeof getLiveSearchHonesty==='function'&&getLiveSearchHonesty().short)?getLiveSearchHonesty().short:'Live-Suche'}</strong> ${honesty.badge}</div>`
      : `<div style="font-size:0.72rem;color:#991b1b;margin-bottom:4px">Live dm = Deutschland-Shop</div>`;
    box.innerHTML = honestyBanner + prods.slice(0, 8).map(p => `
      <div style="background:#fff;border:1px solid #fca5a5;border-radius:8px;padding:8px 10px;margin-top:6px;display:flex;align-items:center;justify-content:space-between;gap:8px">
        <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;cursor:pointer" onclick="window.open('${p.url || '#'}', '_blank')">
          ${p.img ? `<img src="${p.img}" alt="" style="width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid #f1f5f9;flex-shrink:0">` : '<div style="width:38px;height:38px;border-radius:6px;background:#fee2e2;color:#b91c1c;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">🛒</div>'}
          <div style="min-width:0;flex:1">
            <div style="font-weight:700;font-size:0.84rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(p.brand)} ${escapeHtml(p.name)}</div>
            <div style="font-size:0.74rem;color:var(--muted)">
              <span style="color:#16a34a;font-weight:700">${escapeHtml(p.price || "dm")}</span>
              ${p.ff === true ? ' · <span style="color:#16a34a;font-weight:600">🌸 Parfümfrei</span>' : (p.ff === false ? ' · <span style="color:#d97706">⚠️ Parfümiert</span>' : '')}
              · ${typeof liveDmHonestyBadgeHtml==="function" ? liveDmHonestyBadgeHtml() : '<span style="color:#991b1b;font-weight:600">Live dm</span>'}
            </div>
          </div>
        </div>
        ${p._deeplinkOnly ? `<a class="btn-text" style="background:#fff7ed;color:#9a3412;padding:6px 10px;border-radius:6px;font-size:0.76rem;font-weight:700;flex-shrink:0;text-decoration:none" href="${p.url||'#'}" target="_blank" rel="noopener">Im Shop oeffnen</a>` : `<button type="button" class="btn-text" style="background:var(--ok);color:#F7F4D5;padding:6px 10px;border-radius:6px;font-size:0.76rem;font-weight:700;flex-shrink:0" onclick="adoptDmProductToSlot('${p.id}', 'pm')">+ Schrank</button>`}
      </div>
    `).join("");
  }

  function showDmMode(on) {
    const box = document.getElementById(resultsId);
    const list = catalogListId ? document.getElementById(catalogListId) : null;
    const chip = chipId ? document.getElementById(chipId) : null;
    if (chip) chip.classList.toggle("active", !!on);
    if (list) list.style.display = on ? "none" : "";
    if (box) {
      box.style.display = on ? "block" : "none";
      if (on) {
        const inp = document.getElementById(inputId);
        runDm(inp ? inp.value : "");
      }
    }
    window._profileDmLiveMode = !!on;
  }

  const inp = document.getElementById(inputId);
  if (inp) {
    const prev = inp.oninput;
    inp.oninput = (e) => {
      if (window._profileDmLiveMode) {
        clearTimeout(dmTimer);
        dmTimer = setTimeout(() => runDm(e.target.value), 350);
      } else if (typeof prev === "function") {
        prev(e);
      }
    };
  }
  if (chipId) {
    const chip = document.getElementById(chipId);
    if (chip) {
      chip.onclick = () => {
        const next = !window._profileDmLiveMode;
        showDmMode(next);
      };
    }
  }
  window._profileDmLiveMode = false;
  const box = document.getElementById(resultsId);
  if (box) box.style.display = "none";
}

function openActiveProfileAddModal() {
  const cat = typeof getActiveProfileCategory === "function" ? getActiveProfileCategory() : (appState.profile || "adult");
  if (cat === "teen") return openAddTeenProductModal("all");
  if (cat === "baby") return openAddBabyProductModal("all", "baby");
  if (cat === "child") return openAddBabyProductModal("all", "child");
  return openAddProductModal("am");
}
window.openActiveProfileAddModal = openActiveProfileAddModal;

function openAddBabyProductModal(targetSlot = "all", profileType = "baby") {
  let searchVal = "";
  let currentSlot = targetSlot;
  let filterFF = false;
  let filterU3 = false;
  let filterCF = false;

  function renderSearchList() {
    const keys = Object.keys(BABY_DB);
    const cc = typeof getProfileCountry === "function" ? getProfileCountry() : "";
    const hideUnknown = typeof shouldHideUnknownCountries === "function" ? shouldHideUnknownCountries() : false;
    let hiddenCountry = 0, hiddenUnknown = 0;
    const filtered = keys.filter(id => {
      const p = BABY_DB[id];
      // Search text
      const matchesSearch = (p.name + " " + p.brand + " " + (p.ean || "")).toLowerCase().includes(searchVal.toLowerCase());
      if (!matchesSearch) return false;

      // Slot filter
      if (currentSlot !== "all") {
        if (currentSlot === "reiniger" && !(p.slot === "reiniger" || p.slot === "bad")) return false;
        else if (currentSlot !== "reiniger" && p.slot !== currentSlot) return false;
      }

      // Flags
      if (filterFF && p.ff !== true) return false;
      if (filterU3 && p.u3 !== true) return false;
      if (filterCF && p.cf !== true) return false;

      // Country filter
      if (cc && typeof productAvailableInCountry === "function") {
        const list = typeof parseEuCountries === "function" ? parseEuCountries(p.countries) : (p.countries || []);
        if (!list.length) {
          if (hideUnknown) { hiddenUnknown++; return false; }
        } else if (!productAvailableInCountry(p, cc, { hideUnknown: false })) {
          hiddenCountry++; return false;
        }
      }

      return true;
    });

    const listEl = document.getElementById("babyProdList");
    const countEl = document.getElementById("babyProdCount");
    const noteEl = document.getElementById("babyCountryNote");
    if (countEl) countEl.innerText = `${filtered.length} von ${keys.length} · Land ${cc || "—"}`;
    if (noteEl && typeof countryFilterNoteHtml === "function") {
      noteEl.innerHTML = countryFilterNoteHtml({ hiddenCountry, hiddenUnknown }, cc);
    }

    if (!listEl) return;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--muted)">
          <div style="font-size:2rem;margin-bottom:0.4rem">🔍</div>
          <div style="font-weight:600">Kein passendes Produkt gefunden</div>
          <div style="font-size:0.82rem;margin-top:4px">Passe deine Suchbegriffe oder Filterchips an.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.slice(0, 100).map(id => {
      const p = BABY_DB[id];
      const slotLabels = {
        reiniger: "Reinigung & Waschlotion",
        bad: "Babybad & Waschlotion",
        creme: "Pflegecreme & Emollient",
        windel: "Windelschutz & Wundsalbe",
        spf: "Baby- / Kinder-Sonnenschutz",
        haar: "Haarpflege & Shampoo",
        sonst: "Zahn- & Spezialpflege"
      };
      const sLabel = slotLabels[p.slot] || p.slot;

      return `
        <div class="prod-search-item" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #f0e9dc;background:#fff">
          <div style="flex:1;padding-right:10px">
            <div style="font-size:0.7rem;text-transform:uppercase;color:var(--muted);font-weight:700">${p.brand} · <span style="color:#1d4ed8">${sLabel}</span></div>
            <div style="font-weight:600;font-size:0.88rem;color:var(--ink);line-height:1.25;margin:2px 0">${p.name}</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">
              ${p.ff === true ? '<span class="tag ff" style="font-size:0.64rem;padding:1px 5px">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn" style="font-size:0.64rem;padding:1px 5px">⚠️ Parfümiert</span>' : '')}
              ${p.u3 === true ? '<span class="tag ped-blue" style="font-size:0.64rem;padding:1px 5px">👶 EU &lt;3 Jahre</span>' : ''}
              ${p.cf === true ? '<span class="tag ped-purple" style="font-size:0.64rem;padding:1px 5px">🐰 Cruelty-Free</span>' : ''}
              ${p.spfNote ? '<span class="tag ped-amber" style="font-size:0.64rem;padding:1px 5px">☀️ AAP &lt;6m</span>' : ''}
              ${(!p.countries || (Array.isArray(p.countries) && !p.countries.length)) ? '<span class="tag" style="background:#f1f5f9;color:#475569;font-size:0.64rem;padding:1px 5px">Land offen</span>' : ''}
              ${p.ean ? `<span style="font-size:0.64rem;color:#888;background:#f5f0e6;padding:1px 4px;border-radius:4px">EAN ${p.ean}</span>` : ''}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end">
            <button class="btn-text" style="background:var(--ok);color:#F7F4D5;font-weight:700;padding:6px 11px;border-radius:8px;font-size:0.78rem" onclick="addBabyProduct('${p.id}', '${profileType}', '${targetSlot}')">
              + Schrank
            </button>
            <button class="btn-text" style="font-size:0.72rem;color:#666;padding:2px 6px" onclick="openBabyProductDetail('${p.id}')">
              Info
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  const slotOptions = profileType === "baby" ? [
    { key: "all", label: "Alle (606)" },
    { key: "reiniger", label: "Reinigung & Bad" },
    { key: "creme", label: "Pflegecreme" },
    { key: "windel", label: "Windelschutz" },
    { key: "spf", label: "Sonnenschutz" },
    { key: "haar", label: "Haare" },
    { key: "sonst", label: "Sonstiges" }
  ] : [
    { key: "all", label: "Alle (606)" },
    { key: "reiniger", label: "Reinigung / Dusche" },
    { key: "creme", label: "Kindercreme" },
    { key: "spf", label: "Sonnenschutz LSF 50+" },
    { key: "haar", label: "Kindershampoo" },
    { key: "sonst", label: "Zahnpflege / Sonst" }
  ];

  const modalHTML = `
    <div style="padding:1rem 1.1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem">
        <div style="font-family:'Iowan Old Style', Georgia, serif;font-size:1.25rem;font-weight:700">
          ${profileType === 'baby' ? '👶 Baby-Katalog (<3 Jahre)' : '🧒 Kinder-Katalog (3–11 Jahre)'}
        </div>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>
      <div style="font-size:0.8rem;color:var(--muted);margin-bottom:0.8rem">
        606 EU-gelistete Produkte mit spezifischer Sicherheitsbewertung (VO 1223/2009).
      </div>

      <!-- Suchfeld -->
      <div style="position:relative;margin-bottom:0.7rem">
        <input type="text" id="babySearchInput" placeholder="Name, Marke, EAN (z.B. Weleda, Biolane, Zink)..." 
          style="width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-size:0.9rem;background:#fcfaf6;color:var(--ink)">
      </div>

      <!-- Fach-Filter -->
      <div style="display:flex;gap:5px;overflow-x:auto;padding-bottom:6px;margin-bottom:0.5rem" id="babySlotChips">
        ${slotOptions.map(s => `
          <button class="cat-chip ${currentSlot === s.key ? 'active' : ''}" data-slot="${s.key}" style="white-space:nowrap;font-size:0.75rem;padding:4px 9px">
            ${s.label}
          </button>
        `).join("")}
      </div>

      <!-- Flag-Filter -->
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:0.7rem;padding:6px 8px;background:#f4eee2;border-radius:8px">
        <button class="cat-chip" id="chipFF" style="font-size:0.72rem;padding:3px 8px">🌸 Nur Parfümfrei</button>
        <button class="cat-chip" id="chipU3" style="font-size:0.72rem;padding:3px 8px">👶 Spezifisch &lt;3 Jahre</button>
        <button class="cat-chip" id="chipCF" style="font-size:0.72rem;padding:3px 8px">🐰 Cruelty-Free</button>
        <button class="cat-chip" id="chipBabyDmLive" style="font-size:0.72rem;padding:3px 8px;border-color:#fca5a5;color:#991b1b;background:#fef2f2">${(typeof getLiveSearchChipLabel==='function'?getLiveSearchChipLabel():'Live-Suche')}</button>
      </div>
      <div id="babyCountryNote"></div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
        <span id="babyProdCount" style="font-size:0.74rem;font-weight:700;color:var(--muted)">606 Produkte</span>
        <span style="font-size:0.72rem;color:var(--muted)">Sortiert nach Relevanz</span>
      </div>

      <!-- Trefferliste -->
      <div id="babyProdList" style="max-height:48vh;overflow-y:auto;border:1px solid var(--line);border-radius:10px;background:#fff"></div>
      <div id="babyDmLiveResults" style="display:none;max-height:48vh;overflow-y:auto;border:1px solid #fecaca;border-radius:10px;background:#fff7f7;padding:8px;margin-top:8px"></div>
    </div>
  `;

  showModalSheet(modalHTML);

  // Bind Search Events
  const inputEl = document.getElementById("babySearchInput");
  if (inputEl) {
    inputEl.oninput = (e) => {
      searchVal = e.target.value;
      renderSearchList();
    };
  }

  // Bind Slot Chips
  const chipContainer = document.getElementById("babySlotChips");
  if (chipContainer) {
    chipContainer.querySelectorAll(".cat-chip").forEach(btn => {
      btn.onclick = () => {
        chipContainer.querySelectorAll(".cat-chip").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSlot = btn.getAttribute("data-slot");
        renderSearchList();
      };
    });
  }

  // Bind Flag Toggles
  const chipFF = document.getElementById("chipFF");
  if (chipFF) {
    chipFF.onclick = () => {
      filterFF = !filterFF;
      chipFF.classList.toggle("active", filterFF);
      renderSearchList();
    };
  }

  const chipU3 = document.getElementById("chipU3");
  if (chipU3) {
    chipU3.onclick = () => {
      filterU3 = !filterU3;
      chipU3.classList.toggle("active", filterU3);
      renderSearchList();
    };
  }

  const chipCF = document.getElementById("chipCF");
  if (chipCF) {
    chipCF.onclick = () => {
      filterCF = !filterCF;
      chipCF.classList.toggle("active", filterCF);
      renderSearchList();
    };
  }

  renderSearchList();
  window._refreshOpenCountryFilteredList = renderSearchList;

  mountProfileDmLiveSearch({
    inputId: "babySearchInput",
    resultsId: "babyDmLiveResults",
    chipId: "chipBabyDmLive",
    catalogListId: "babyProdList"
  });
}

// Modal: Product Detail & Evidence Verdict for Baby / Child Product
function openBabyProductDetail(prodId) {
  const p = BABY_DB[prodId];
  if (!p) return;

  const inBaby = Object.values(appState.baby).some(arr => arr.includes(prodId));
  const inChild = Object.values(appState.child).some(arr => arr.includes(prodId));
  const inCabinet = inBaby || inChild;

  const slotNames = {
    reiniger: "Milde Reinigung & Waschlotion",
    bad: "Babybad & Badezusatz",
    creme: "Pflegecreme & Emollient (Feuchtigkeit/Barriere)",
    windel: "Windel- & Wundschutz (Zinksalbe)",
    spf: "Pädiatrischer Sonnenschutz",
    haar: "Milde Haarpflege / Kindershampoo",
    sonst: "Zahn- / Spezialpflege"
  };

  const modalHTML = `
    <div style="padding:1rem 1.1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
        <span class="tag ${p.age === 'baby_0_36m' ? 'ped-blue' : 'ped-amber'}" style="font-weight:700">
          ${p.age === 'baby_0_36m' ? '👶 Baby & Kleinkind (<3 Jahre)' : '🧒 Kind (3–11 Jahre)'}
        </span>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>

      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">${p.brand}</div>
      <h2 style="font-family:'Iowan Old Style', Georgia, serif;font-size:1.35rem;font-weight:700;margin:2px 0 0.6rem;line-height:1.25">
        ${p.name}
      </h2>

      <div style="font-size:0.82rem;color:var(--ink);background:#fcfaf6;padding:8px 10px;border-radius:8px;border:1px solid var(--line);margin-bottom:0.9rem">
        Kategorie: <strong>${slotNames[p.slot] || p.slot}</strong>
        ${p.ean ? `<br>EAN-Barcode: <span style="font-family:monospace;font-weight:600">${p.ean}</span>` : ''}
      </div>

      <!-- Evidenz-Checks -->
      <div style="margin-bottom:1rem">
        <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:6px">Pädiatrische Evidenz-Bewertung</div>
        
        <!-- Duftstoff-Check -->
        <div style="padding:8px 10px;border-radius:8px;margin-bottom:6px;background:${p.ff === true ? '#f0fdf4' : (p.ff === false ? '#fffbeb' : '#f9fafb')};border:1px solid ${p.ff === true ? '#bbf7d0' : (p.ff === false ? '#fde68a' : '#e5e7eb')}">
          <div style="font-weight:700;font-size:0.84rem;color:${p.ff === true ? '#166534' : (p.ff === false ? '#92400e' : '#4b5563')}">
            ${p.ff === true ? '🌸 100% Parfümfrei (Höchste Priorität)' : (p.ff === false ? '⚠️ Enthält Parfüm / Duftstoffe' : 'ℹ️ Parfümierung offen (keine verifizierten Angaben)')}
          </div>
          <div style="font-size:0.76rem;color:${p.ff === true ? '#166534' : (p.ff === false ? '#92400e' : '#6b7280')};margin-top:2px">
            ${p.ff === true ? 'Ausgezeichnet: Minimales Risiko für Kontaktsensibilisierungen. Empfohlener Standard für Säuglinge nach pädiatrischen Leitlinien.' : (p.ff === false ? 'Hinweis: Duftstoffe und ätherische Öle sind die häufigsten Auslöser für allergische Kontaktdermatitis auf zarter Kinderhaut.' : 'Zu diesem Produkt liegen keine verifizierten Angaben des Herstellers zur Duftstofffreiheit vor.')}
          </div>
        </div>

        <!-- EU Sicherheitsbewertung U3 -->
        <div style="padding:8px 10px;border-radius:8px;margin-bottom:6px;background:${p.u3 === true ? '#eff6ff' : (p.u3 === false ? '#fffbeb' : '#f9fafb')};border:1px solid ${p.u3 === true ? '#bfdbfe' : (p.u3 === false ? '#fde68a' : '#e5e7eb')}">
          <div style="font-weight:700;font-size:0.84rem;color:${p.u3 === true ? '#1e40af' : (p.u3 === false ? '#92400e' : '#4b5563')}">
            ${p.u3 === true ? '👶 EU &lt;3 Jahre (VO 1223/2009 Annex I Teil B)' : (p.u3 === false ? '🧒 Für Kinder ab 3 Jahren / älter' : 'ℹ️ U3-Eignung offen (keine explizite Säuglingsauslobung)')}
          </div>
          <div style="font-size:0.76rem;color:${p.u3 === true ? '#1e40af' : (p.u3 === false ? '#92400e' : '#6b7280')};margin-top:2px">
            ${p.u3 === true ? 'Gesetzlich vorgeschriebene, spezifische Sicherheitsbewertung für Kosmetikprodukte für Kinder unter drei Jahren bestätigt.' : (p.u3 === false ? 'Produkt ist nicht für Säuglinge/Kleinkinder unter drei Jahren zertifiziert.' : 'Keine herstellerseitige Verifizierung für Kinder unter 3 Jahren hinterlegt.')}
          </div>
        </div>

        <!-- Cruelty-Free Check -->
        <div style="padding:8px 10px;border-radius:8px;margin-bottom:6px;background:${p.cf === true ? '#faf5ff' : (p.cf === false ? '#fffbeb' : '#f9fafb')};border:1px solid ${p.cf === true ? '#e9d5ff' : (p.cf === false ? '#fde68a' : '#e5e7eb')}">
          <div style="font-weight:700;font-size:0.84rem;color:${p.cf === true ? '#6b21a8' : (p.cf === false ? '#92400e' : '#4b5563')}">
            ${p.cf === true ? '🐰 Cruelty-Free (CFI Leaping Bunny / Zertifiziert)' : (p.cf === false ? '⚠️ Tierversuche nicht ausgeschlossen' : '⚖️ Standard EU-Rechtsrahmen (kein Verbandssiegel)')}
          </div>
          <div style="font-size:0.76rem;color:${p.cf === true ? '#6b21a8' : (p.cf === false ? '#92400e' : '#6b7280')};margin-top:2px">
            ${p.cf === true ? 'Marke ist im CFI Leaping Bunny Verzeichnis als tierversuchsfrei zertifiziert.' : (p.cf === false ? 'Keine Zertifizierung; Marke vertreibt potenziell in Märkten mit vorgeschriebenen Tierversuchen.' : 'EU-Tierversuchsverbot für Kosmetik seit 2013 erfüllt; kein gesondertes Verbandssiegel deklariert.')}
          </div>
        </div>

        <!-- AAP Sonnenschutz Check -->
        ${p.spfNote ? `
          <div style="padding:8px 10px;border-radius:8px;margin-bottom:6px;background:#fff7ed;border:1px solid #fed7aa">
            <div style="font-weight:700;font-size:0.84rem;color:#9a3412">☀️ AAP/AAD-Leitlinie (unter 6 Monate)</div>
            <div style="font-size:0.76rem;color:#9a3412;margin-top:2px">${p.spfNote}. Schatten, Sonnensegel und dicht gewebte Kleidung haben stets Vorrang.</div>
          </div>
        ` : ''}

        ${p.notes ? `
          <div style="font-size:0.75rem;color:var(--muted);background:#f5f0e6;padding:6px 8px;border-radius:6px;margin-top:6px">
            <strong>Katalog-Notiz:</strong> ${p.notes}
          </div>
        ` : ''}
      </div>

      <!-- Datenquelle -->
      ${p.url ? `
        <div style="margin-bottom:1rem;font-size:0.78rem">
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="color:#1d4ed8;text-decoration:underline">
            🔗 Quellennachweis (OpenBeautyFacts / Markenseite) öffnen ↗
          </a>
        </div>
      ` : ''}

      <!-- Disclaimer -->
      <div style="font-size:0.73rem;color:var(--muted);text-align:center;margin-bottom:10px">
        ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
      </div>

      <!-- Action Button -->
      <div style="display:flex;gap:8px">
        ${inCabinet ? `
          <button class="btn-text" style="flex:1;background:#fee2e2;color:#991b1b;padding:10px;border-radius:10px;font-weight:700" 
            onclick="removeBabyProduct('${p.id}', '${inBaby ? 'baby' : 'child'}', '${p.slot === 'bad' ? 'reiniger' : p.slot}'); closeModal()">
            Aus dem Schrank entfernen
          </button>
        ` : `
          <button class="btn-text" style="flex:1;background:var(--ok);color:#F7F4D5;padding:10px;border-radius:10px;font-weight:700" 
            onclick="addBabyProduct('${p.id}', '${appState.profile}'); closeModal()">
            + In den Schrank stellen
          </button>
        `}
      </div>
    </div>
  `;

  showModalSheet(modalHTML);
}

// Modal: Educational Pediatric Guide
// ==========================================
// KATEGORIE TEENIE (12–17 JAHRE) — BEDIEN- & RENDERLOGIK
// Vollständig isoliert von Erwachsenen-, Baby- und Kinder-Schränken
// ==========================================


function openAddTeenProductModal(targetSlot = "all") {
  let searchVal = "";
  let currentSlot = targetSlot;
  let filterFF = false;
  let filterNC = false;
  let filterCF = false;
  let filterTeenOnly = true; // By default, filter out not_for_minors anti-aging products!

  function renderSearchList() {
    const keys = Object.keys(TEEN_DB);
    const cc = typeof getProfileCountry === "function" ? getProfileCountry() : "";
    const hideUnknown = typeof shouldHideUnknownCountries === "function" ? shouldHideUnknownCountries() : false;
    let hiddenCountry = 0, hiddenUnknown = 0;
    const filtered = keys.filter(id => {
      const p = TEEN_DB[id];
      // Search text
      const matchesSearch = (p.name + " " + p.brand + " " + (p.ean || "")).toLowerCase().includes(searchVal.toLowerCase());
      if (!matchesSearch) return false;

      // Slot filter
      if (currentSlot !== "all" && p.slot !== currentSlot) return false;

      // Flags
      if (filterFF && p.ff !== true) return false;
      if (filterNC && p.nc !== true) return false;
      if (filterCF && p.cf !== true) return false;
      if (filterTeenOnly && p.notForMinors) return false;

      if (cc && typeof productAvailableInCountry === "function") {
        const list = typeof parseEuCountries === "function" ? parseEuCountries(p.countries) : (p.countries || []);
        if (!list.length) {
          if (hideUnknown) { hiddenUnknown++; return false; }
        } else if (!productAvailableInCountry(p, cc, { hideUnknown: false })) {
          hiddenCountry++; return false;
        }
      }

      return true;
    });

    const listEl = document.getElementById("teenProdList");
    const countEl = document.getElementById("teenProdCount");
    const noteEl = document.getElementById("teenCountryNote");
    if (countEl) countEl.innerText = `${filtered.length} von ${keys.length} · Land ${cc || "—"}`;
    if (noteEl && typeof countryFilterNoteHtml === "function") {
      noteEl.innerHTML = countryFilterNoteHtml({ hiddenCountry, hiddenUnknown }, cc);
    }

    if (!listEl) return;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--muted)">
          <div style="font-size:2rem;margin-bottom:0.4rem">🔍</div>
          <div style="font-weight:600">Kein passendes Produkt gefunden</div>
          <div style="font-size:0.82rem;margin-top:4px">Passe deine Suchbegriffe oder Filterchips an.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.slice(0, 100).map(id => {
      const p = TEEN_DB[id];
      const slotLabels = {
        reiniger: "Gesichtsreinigung",
        active: "Active / Serum",
        creme: "Feuchtigkeitspflege",
        spf: "Tages-Sonnenschutz",
        sonst: "Spezialpflege"
      };
      const sLabel = slotLabels[p.slot] || p.slot;

      return `
        <div class="prod-search-item" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #f0e9dc;background:#fff">
          <div style="flex:1;padding-right:10px">
            <div style="font-size:0.7rem;text-transform:uppercase;color:var(--muted);font-weight:700">${p.brand} · <span style="color:#0d9488">${sLabel}</span></div>
            <div style="font-weight:600;font-size:0.88rem;color:var(--ink);line-height:1.25;margin:2px 0">${p.name}</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">
              ${p.ff === true ? '<span class="tag ff" style="font-size:0.64rem;padding:1px 5px">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn" style="font-size:0.64rem;padding:1px 5px">⚠️ Parfümiert</span>' : '')}
              ${p.nc === true ? '<span class="tag nc" style="font-size:0.64rem;padding:1px 5px">🛡️ NC</span>' : ''}
              ${p.cf === true ? '<span class="tag ped-purple" style="font-size:0.64rem;padding:1px 5px">🐰 Cruelty-Free</span>' : ''}
              ${p.notForMinors ? '<span class="tag" style="background:#fee2e2;color:#991b1b;border:1px solid #fecaca;font-size:0.64rem;padding:1px 5px">🛑 Anti-Aging / Nicht für Minderjährige</span>' : ''}
              ${p.ean ? `<span style="font-size:0.64rem;color:#888;background:#f5f0e6;padding:1px 4px;border-radius:4px">EAN ${p.ean}</span>` : ''}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end">
            <button class="btn-text" style="background:var(--ok);color:#F7F4D5;font-weight:700;padding:6px 11px;border-radius:8px;font-size:0.78rem" onclick="addTeenProduct('${p.id}', '${targetSlot}')">
              + Schrank
            </button>
            <button class="btn-text" style="font-size:0.72rem;color:#666;padding:2px 6px" onclick="openTeenProductDetail('${p.id}')">
              Info
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  const slotOptions = [
    { key: "all", label: "Alle (96)" },
    { key: "reiniger", label: "Reinigung" },
    { key: "active", label: "Actives & Seren" },
    { key: "creme", label: "Feuchtigkeitscreme" },
    { key: "spf", label: "Sonnenschutz" }
  ];

  const modalHTML = `
    <div style="padding:1rem 1.1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem">
        <div style="font-family:'Iowan Old Style', Georgia, serif;font-size:1.25rem;font-weight:700">
          🧑‍🦱 Teenie-Katalog (12–17 Jahre)
        </div>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>
      <div style="font-size:0.8rem;color:var(--muted);margin-bottom:0.8rem">
        96 EU-gelistete Produkte für Jugendliche & junge Erwachsene mit Schutz vor Anti-Aging-Hype.
      </div>

      <!-- Suchfeld -->
      <div style="position:relative;margin-bottom:0.7rem">
        <input type="text" id="teenSearchInput" placeholder="Name, Marke, EAN (z.B. CeraVe, Bioderma, BHA)..." 
          style="width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-size:0.9rem;background:#fcfaf6;color:var(--ink)">
      </div>

      <!-- Fach-Filter -->
      <div style="display:flex;gap:5px;overflow-x:auto;padding-bottom:6px;margin-bottom:0.5rem" id="teenSlotChips">
        ${slotOptions.map(s => `
          <button class="cat-chip ${currentSlot === s.key ? 'active' : ''}" data-slot="${s.key}" style="white-space:nowrap;font-size:0.75rem;padding:4px 9px">
            ${s.label}
          </button>
        `).join("")}
      </div>

      <!-- Flag-Filter -->
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:0.7rem;padding:6px 8px;background:#f4eee2;border-radius:8px">
        <button class="cat-chip active" id="chipTeenOnly" style="font-size:0.72rem;padding:3px 8px">🎯 Nur Teen-geeignet (ohne Anti-Aging)</button>
        <button class="cat-chip" id="chipTeenFF" style="font-size:0.72rem;padding:3px 8px">🌸 Parfümfrei</button>
        <button class="cat-chip" id="chipTeenNC" style="font-size:0.72rem;padding:3px 8px">🛡️ Nicht komedogen</button>
        <button class="cat-chip" id="chipTeenCF" style="font-size:0.72rem;padding:3px 8px">🐰 Cruelty-Free</button>
        <button class="cat-chip" id="chipTeenDmLive" style="font-size:0.72rem;padding:3px 8px;border-color:#fca5a5;color:#991b1b;background:#fef2f2">${(typeof getLiveSearchChipLabel==='function'?getLiveSearchChipLabel():'Live-Suche')}</button>
      </div>
      <div id="teenCountryNote"></div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
        <span id="teenProdCount" style="font-size:0.74rem;font-weight:700;color:var(--muted)">96 Produkte</span>
        <span style="font-size:0.72rem;color:var(--muted)">Sortiert nach Relevanz</span>
      </div>

      <!-- Trefferliste -->
      <div id="teenProdList" style="max-height:48vh;overflow-y:auto;border:1px solid var(--line);border-radius:10px;background:#fff"></div>
      <div id="teenDmLiveResults" style="display:none;max-height:48vh;overflow-y:auto;border:1px solid #fecaca;border-radius:10px;background:#fff7f7;padding:8px;margin-top:8px"></div>
    </div>
  `;

  showModalSheet(modalHTML);

  // Bind Search Events
  const inputEl = document.getElementById("teenSearchInput");
  if (inputEl) {
    inputEl.oninput = (e) => {
      searchVal = e.target.value;
      renderSearchList();
    };
  }

  // Bind Slot Chips
  const chipContainer = document.getElementById("teenSlotChips");
  if (chipContainer) {
    chipContainer.querySelectorAll(".cat-chip").forEach(btn => {
      btn.onclick = () => {
        chipContainer.querySelectorAll(".cat-chip").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSlot = btn.getAttribute("data-slot");
        renderSearchList();
      };
    });
  }

  // Bind Flag Toggles
  const chipTeenOnly = document.getElementById("chipTeenOnly");
  if (chipTeenOnly) {
    chipTeenOnly.onclick = () => {
      filterTeenOnly = !filterTeenOnly;
      chipTeenOnly.classList.toggle("active", filterTeenOnly);
      renderSearchList();
    };
  }

  const chipTeenFF = document.getElementById("chipTeenFF");
  if (chipTeenFF) {
    chipTeenFF.onclick = () => {
      filterFF = !filterFF;
      chipTeenFF.classList.toggle("active", filterFF);
      renderSearchList();
    };
  }

  const chipTeenNC = document.getElementById("chipTeenNC");
  if (chipTeenNC) {
    chipTeenNC.onclick = () => {
      filterNC = !filterNC;
      chipTeenNC.classList.toggle("active", filterNC);
      renderSearchList();
    };
  }

  const chipTeenCF = document.getElementById("chipTeenCF");
  if (chipTeenCF) {
    chipTeenCF.onclick = () => {
      filterCF = !filterCF;
      chipTeenCF.classList.toggle("active", filterCF);
      renderSearchList();
    };
  }

  renderSearchList();
  window._refreshOpenCountryFilteredList = renderSearchList;

  mountProfileDmLiveSearch({
    inputId: "teenSearchInput",
    resultsId: "teenDmLiveResults",
    chipId: "chipTeenDmLive",
    catalogListId: "teenProdList"
  });
}

// Modal: Product Detail & Evidence Verdict for Teenie Product
function openTeenProductDetail(prodId) {
  const p = TEEN_DB[prodId];
  if (!p) return;

  const inCabinet = Object.values(appState.teen).some(arr => arr.includes(prodId));

  const slotNames = {
    reiniger: "Milde Gesichtsreinigung",
    active: "Gezielter Wirkstoff / Serum",
    creme: "Feuchtigkeitspflege & Barriere",
    spf: "Tages-Sonnenschutz (LSF 30–50+)",
    sonst: "Spezialpflege / Maske"
  };

  const modalHTML = `
    <div style="padding:1rem 1.1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
        <span class="tag" style="background:#ccfbf1;color:#0f766e;border:1px solid #99f6e4;font-weight:700">
          ${p.notForMinors ? '⚠️ Young Adult (18+) · Nicht für Minderjährige' : '🧑‍🦱 Teenie-geeignet (12–17 Jahre)'}
        </span>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>

      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">${p.brand}</div>
      <h2 style="font-family:'Iowan Old Style', Georgia, serif;font-size:1.35rem;font-weight:700;margin:2px 0 0.6rem;line-height:1.25">
        ${p.name}
      </h2>

      <div style="font-size:0.82rem;color:var(--ink);background:#fcfaf6;padding:8px 10px;border-radius:8px;border:1px solid var(--line);margin-bottom:0.9rem">
        Kategorie: <strong>${slotNames[p.slot] || p.slot}</strong>
        ${p.ean ? `<br>EAN-Barcode: <span style="font-family:monospace;font-weight:600">${p.ean}</span>` : ''}
        ${p.countries ? `<br>EU-Verfügbarkeit: <span style="color:#666">${p.countries}</span>` : ''}
      </div>

      <!-- Evidenz-Checks -->
      <div style="margin-bottom:1rem">
        <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:6px">Teenie- & Barriere-Bewertung</div>
        
        <!-- Anti-Aging / Jugendschutz-Check -->
        <div style="padding:8px 10px;border-radius:8px;margin-bottom:6px;background:${p.notForMinors ? '#fef2f2' : '#f0fdf4'};border:1px solid ${p.notForMinors ? '#fecaca' : '#bbf7d0'}">
          <div style="font-weight:700;font-size:0.84rem;color:${p.notForMinors ? '#991b1b' : '#166534'}">
            ${p.notForMinors ? '🛑 Nicht für Minderjährige empfohlen (Anti-Aging-Warnung)' : '✅ Teenie-gerecht (Ohne Anti-Aging-Hype)'}
          </div>
          <div style="font-size:0.76rem;color:${p.notForMinors ? '#991b1b' : '#166534'};margin-top:2px">
            ${p.notForMinors ? 'Enthält Retinol oder intensive Anti-Falten-Wirkstoffe. Nach dermatologischer Leitlinie (AAD / PZ) für Jugendliche unnötig und potenziell reizend für die junge Barriere.' : 'Frei von unnötigen Falten- & Anti-Aging-Stacks. Unterstützt die gesunde Hautbarriere ohne Überforderung.'}
          </div>
        </div>

        <!-- Duftstoff-Check -->
        <div style="padding:8px 10px;border-radius:8px;margin-bottom:6px;background:${p.ff === true ? '#f0fdf4' : (p.ff === false ? '#fffbeb' : '#f9fafb')};border:1px solid ${p.ff === true ? '#bbf7d0' : (p.ff === false ? '#fde68a' : '#e5e7eb')}">
          <div style="font-weight:700;font-size:0.84rem;color:${p.ff === true ? '#166534' : (p.ff === false ? '#92400e' : '#4b5563')}">
            ${p.ff === true ? '🌸 100% Parfümfrei' : (p.ff === false ? '⚠️ Enthält Parfüm / Duftstoffe' : 'ℹ️ Parfümierung offen (keine verifizierten Angaben)')}
          </div>
          <div style="font-size:0.76rem;color:${p.ff === true ? '#166534' : (p.ff === false ? '#92400e' : '#6b7280')};margin-top:2px">
            ${p.ff === true ? 'Ausgezeichnet: Minimales Risiko für Kontaktsensibilisierungen und Reizungen auf pubertierender Haut.' : (p.ff === false ? 'Hinweis: Duftstoffe können bei sensibler oder akne-beanspruchter Haut zu Rötungen und Irritationen führen.' : 'Keine verifizierten Angaben zur Parfümierung hinterlegt.')}
          </div>
        </div>

        <!-- Nicht-Komedogen Check -->
        <div style="padding:8px 10px;border-radius:8px;margin-bottom:6px;background:${p.nc === true ? '#f0fdf4' : (p.nc === false ? '#fffbeb' : '#f9fafb')};border:1px solid ${p.nc === true ? '#bbf7d0' : (p.nc === false ? '#fde68a' : '#e5e7eb')}">
          <div style="font-weight:700;font-size:0.84rem;color:${p.nc === true ? '#166534' : (p.nc === false ? '#92400e' : '#4b5563')}">
            ${p.nc === true ? '🛡️ Nicht komedogen (Claim verifiziert)' : (p.nc === false ? '⚠️ Kein NC-Claim / potenziell komedogen' : 'ℹ️ NC offen (Komedogenität nicht deklariert)')}
          </div>
          <div style="font-size:0.76rem;color:${p.nc === true ? '#166534' : (p.nc === false ? '#92400e' : '#6b7280')};margin-top:2px">
            ${p.nc === true ? 'Herstellerclaim bestätigt: Formulierung ist darauf getestet, Poren nicht zu verstopfen – ideal bei Akne-Neigung.' : (p.nc === false ? 'Kein Nicht-Komedogen-Nachweis; Textur könnte bei Neigung zu Unreinheiten porenverstopfend wirken.' : 'Keine offizielle Hersteller-Auslobung bezüglich Komedogenität hinterlegt.')}
          </div>
        </div>

        <!-- Cruelty-Free Check -->
        <div style="padding:8px 10px;border-radius:8px;margin-bottom:6px;background:${p.cf === true ? '#faf5ff' : (p.cf === false ? '#fffbeb' : '#f9fafb')};border:1px solid ${p.cf === true ? '#e9d5ff' : (p.cf === false ? '#fde68a' : '#e5e7eb')}">
          <div style="font-weight:700;font-size:0.84rem;color:${p.cf === true ? '#6b21a8' : (p.cf === false ? '#92400e' : '#4b5563')}">
            ${p.cf === true ? '🐰 Cruelty-Free (CFI Leaping Bunny / Zertifiziert)' : (p.cf === false ? '⚠️ Tierversuche nicht ausgeschlossen' : '⚖️ Standard EU-Rechtsrahmen (kein Verbandssiegel)')}
          </div>
          <div style="font-size:0.76rem;color:${p.cf === true ? '#6b21a8' : (p.cf === false ? '#92400e' : '#6b7280')};margin-top:2px">
            ${p.cf === true ? 'Marke ist im CFI Leaping Bunny Verzeichnis als tierversuchsfrei bestätigt.' : (p.cf === false ? 'Keine Zertifizierung; Marke vertreibt potenziell in Märkten mit vorgeschriebenen Tierversuchen.' : 'EU-Tierversuchsverbot für Kosmetik seit 2013 erfüllt; kein gesondertes CFI-Siegel hinterlegt.')}
          </div>
        </div>

        ${p.notes ? `
          <div style="font-size:0.75rem;color:var(--muted);background:#f5f0e6;padding:6px 8px;border-radius:6px;margin-top:6px">
            <strong>Katalog-Notiz:</strong> ${p.notes}
          </div>
        ` : ''}
      </div>

      <!-- Datenquelle -->
      ${p.url ? `
        <div style="margin-bottom:1rem;font-size:0.78rem">
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="color:#0d9488;text-decoration:underline">
            🔗 Quellennachweis (OpenBeautyFacts / Markenseite) öffnen ↗
          </a>
        </div>
      ` : ''}

      <!-- Disclaimer -->
      <div style="font-size:0.73rem;color:var(--muted);text-align:center;margin-bottom:10px">
        ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
      </div>

      <!-- Action Button -->
      <div style="display:flex;gap:8px">
        ${inCabinet ? `
          <button class="btn-text" style="flex:1;background:#fee2e2;color:#991b1b;padding:10px;border-radius:10px;font-weight:700" 
            onclick="removeTeenProduct('${p.id}', '${p.slot}'); closeModal()">
            Aus dem Schrank entfernen
          </button>
        ` : `
          <button class="btn-text" style="flex:1;background:var(--ok);color:#F7F4D5;padding:10px;border-radius:10px;font-weight:700" 
            onclick="addTeenProduct('${p.id}', '${p.slot}'); closeModal()">
            + In den Schrank stellen
          </button>
        `}
      </div>
    </div>
  `;

  showModalSheet(modalHTML);
}

// Modal: Educational Teenie Guide

function openAddProductModal(defaultTarget = "am", initialCat = "all") {
  let searchVal = "";
  let currentCat = (initialCat === 'active' || initialCat === 'spot') ? 'serum' : (initialCat || 'all');
  let currentFlag = "all";
  let liveDmLoading = false;
  let liveDmItems = [];
  let dmDebounceTimer = null;

  function getFilteredProducts() {
    const keys = Object.keys(DB).filter(k => k !== "water");
    const cc = typeof getProfileCountry === "function" ? getProfileCountry() : "";
    const hideUnknown = typeof shouldHideUnknownCountries === "function" ? shouldHideUnknownCountries() : false;
    let hiddenCountry = 0, hiddenUnknown = 0;
    const filtered = keys.filter(id => {
      const p = DB[id];
      const matchesSearch = (p.name + " " + p.brand + " " + p.wirk + " " + (p.store || "") + " " + (p.ean || "")).toLowerCase().includes(searchVal.toLowerCase());
      const matchesCat = currentCat === "all" || p.kat === currentCat || (currentCat === "serum" && (p.kat === "active" || p.kat === "spot"));
      const matchesFlag = currentFlag === "all" 
        || (currentFlag === "clean" && p.ff !== false) 
        || (currentFlag === "ff" && p.ff === true) 
        || (currentFlag === "nc" && p.nc === true) 
        || (currentFlag === "cf" && p.cf === true)
        || (currentFlag === "nwc" && p.no_white_cast === true)
        || (currentFlag === "iron" && p.iron_ox === true)
        || (currentFlag === "pih" && p.pih === true);
      if (!(matchesSearch && matchesCat && matchesFlag)) return false;
      if (cc && typeof productAvailableInCountry === "function") {
        const list = typeof parseEuCountries === "function" ? parseEuCountries(p.countries) : (p.countries || []);
        if (!list.length) {
          if (hideUnknown) { hiddenUnknown++; return false; }
        } else if (!productAvailableInCountry(p, cc, { hideUnknown: false })) {
          hiddenCountry++; return false;
        }
      }
      return true;
    });
    window._adultCountryFilterStats = { hiddenCountry, hiddenUnknown, total: keys.length };
    return filtered;
  }

  function renderListHtml() {
    if (currentCat === "dm") {
      const ccNow = typeof getProfileCountry === "function" ? getProfileCountry() : "AT";
      const retailer = typeof getLiveRetailerForCountry === "function" ? getLiveRetailerForCountry(ccNow) : { label: "dm" };
      const countEl = document.getElementById("searchCountLabel");
      if (countEl) countEl.innerText = `${liveDmItems.length} Live-Treffer (${retailer.label})`;

      if (liveDmLoading) {
        return `
          <div style="text-align:center;padding:2.2rem 1rem;color:var(--muted);font-size:0.9rem">
            <div style="font-size:1.8rem;margin-bottom:8px">⏳</div>
            <div style="font-weight:600;color:var(--ink)">Frage live bei ${escapeHtml(retailer.label)} an...</div>
            <div style="font-size:0.8rem;color:var(--muted);margin-top:3px">Suchbegriff: „${escapeHtml(searchVal)}“</div>
          </div>
        `;
      }

      if (liveDmItems.length === 0) {
        return `
          <div style="text-align:center;padding:2.2rem 1rem;color:var(--muted);font-size:0.9rem">
            <div style="font-size:1.8rem;margin-bottom:8px">🛒</div>
            ${searchVal && searchVal.trim().length >= 2 
              ? `<div style="font-weight:600;color:var(--ink)">Kein Treffer bei ${escapeHtml(retailer.label)} für „${escapeHtml(searchVal)}“.</div><div style="font-size:0.8rem;color:var(--muted);margin-top:3px">Probiere Marken wie Balea Med, CeraVe, Nivea, Isana oder eine 13-stellige EAN.</div>`
              : `<div style="font-weight:600;color:var(--ink)">Live im Sortiment (${escapeHtml(retailer.label)}) suchen</div><div style="font-size:0.8rem;color:var(--muted);margin-top:3px">Tippe oben einen Suchbegriff (z.B. Waschgel, Niacinamid, Sonnenschutz oder EAN).</div>`}
          </div>
        `;
      }

      return liveDmItems.map((p, idx) => {
        return `
          <div class="alt-card" style="padding:0.75rem 0.9rem;border-color:#fca5a5;background:#fff;cursor:pointer" onclick="window.open('${p.url}', '_blank')">
            <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;margin-right:10px">
              ${p.img ? `<img src="${p.img}" alt="${p.name}" style="width:46px;height:46px;object-fit:cover;border-radius:8px;border:1px solid #f1f5f9;background:#f8fafc;flex-shrink:0">` : `<div style="width:46px;height:46px;border-radius:8px;background:#fee2e2;color:#b91c1c;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">🛒</div>`}
              <div style="min-width:0;flex:1">
                <div style="font-weight:700;font-size:0.88rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.brand} ${p.name}</div>
                <div style="font-size:0.76rem;color:var(--muted);margin-top:1px">
                  <span style="font-weight:700;color:#16a34a">${p.price || 'dm'}</span>
                  ${p.ean ? ` · EAN: ${p.ean}` : ''}
                  · <span style="color:#2563eb;text-decoration:underline">dm.de ↗</span>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:3px">
                  ${p.ff === true ? '<span class="tag ff" style="font-size:0.65rem;padding:1px 5px">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn" style="font-size:0.65rem;padding:1px 5px">⚠️ Parfümiert</span>' : '')}
                  ${p.cf === true ? '<span class="tag cf" style="font-size:0.65rem;padding:1px 5px">🐰 CF</span>' : ''}
                  ${p.no_white_cast === true ? '<span class="tag soc-nwc" style="font-size:0.65rem;padding:1px 5px">✨ Zero White-Cast</span>' : ''}
                  ${p.iron_ox === true ? '<span class="tag soc-iron" style="font-size:0.65rem;padding:1px 5px">🛡️ Eisenoxide</span>' : ''}
                  ${p.pih === true ? '<span class="tag soc-pih" style="font-size:0.65rem;padding:1px 5px">🎯 PIH</span>' : ''}
                  ${typeof liveDmHonestyBadgeHtml==="function" ? liveDmHonestyBadgeHtml() : '<span class="tag" style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;font-size:0.65rem;padding:1px 5px">Live dm</span>'}
                </div>
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0" onclick="event.stopPropagation()">
              <button type="button" class="btn-text" style="background:#eaf0f6;color:#204060;padding:6px 10px;border-radius:6px;font-size:0.76rem;font-weight:600" onclick="adoptDmProductToSlot('${p.id}', 'am')">+ Morgen</button>
              <button type="button" class="btn-text" style="background:#f4ece0;color:#5c3e1e;padding:6px 10px;border-radius:6px;font-size:0.76rem;font-weight:600" onclick="adoptDmProductToSlot('${p.id}', 'pm')">+ Abend</button>
            </div>
          </div>
        `;
      }).join("");
    }

    const filtered = getFilteredProducts();
    const countEl = document.getElementById("searchCountLabel");
    const ccNow = typeof getProfileCountry === "function" ? getProfileCountry() : "";
    if (countEl) countEl.innerText = `${filtered.length} Produkte · ${ccNow || "—"}`;
    const noteEl = document.getElementById("adultCountryNote");
    if (noteEl && typeof countryFilterNoteHtml === "function") {
      noteEl.innerHTML = countryFilterNoteHtml(window._adultCountryFilterStats || {}, ccNow);
    }

    if (filtered.length === 0) {
      return `
        <div style="text-align:center;padding:1.8rem 1rem;color:var(--muted);font-size:0.88rem">
          <div>Kein passendes Produkt im Basiskatalog gefunden.</div>
          ${searchVal ? `
            <div style="margin-top:10px">
              <button type="button" class="btn-text" style="background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;padding:7px 14px;border-radius:8px;font-weight:700;font-size:0.84rem" onclick="window.setAddCat('dm')">
                🛒 Live bei dm nach „${searchVal}“ suchen ➔
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    return filtered.map(id => {
      const p = DB[id];
      const badges = [];
      if (p.nc) badges.push('<span class="tag nc" style="font-size:0.68rem;padding:1px 5px">🛡️ Nicht-komedogen</span>');
      if (p.ff === true) badges.push('<span class="tag ff" style="font-size:0.68rem;padding:1px 5px">🌸 Parfümfrei</span>');
      if (p.cf === true) badges.push('<span class="tag cf" style="font-size:0.68rem;padding:1px 5px">🐰 Cruelty-Free (CFI)</span>');
      if (p.ff === false) badges.push('<span class="tag warn" style="font-size:0.68rem;padding:1px 5px">⚠️ Parfümiert</span>');
      if (p.no_white_cast === true) badges.push('<span class="tag soc-nwc" style="font-size:0.68rem;padding:1px 5px">✨ Zero White-Cast</span>');
      if (p.iron_ox === true) badges.push('<span class="tag soc-iron" style="font-size:0.68rem;padding:1px 5px">🛡️ Eisenoxide (Visible Light)</span>');
      if (p.pih === true) badges.push('<span class="tag soc-pih" style="font-size:0.68rem;padding:1px 5px">🎯 PIH / Anti-Pickelmale</span>');
      if (!p.countries || (Array.isArray(p.countries) && p.countries.length === 0)) badges.push('<span class="tag" style="background:#f1f5f9;color:#475569;font-size:0.68rem;padding:1px 5px">Land offen</span>');
      if (p.ean) badges.push(`<span class="tag ean" style="font-size:0.68rem;padding:1px 5px">EAN: ${p.ean}</span>`);

      return `
        <div class="alt-card" style="padding:0.75rem 0.9rem;cursor:pointer" onclick="openProductDetail('${p.id}')">
          <div style="flex:1;min-width:0;margin-right:10px">
            <div style="font-weight:600;font-size:0.9rem">${p.brand} ${p.name}</div>
            <div style="font-size:0.78rem;color:var(--muted)">Wirkstoff: ${p.wirk} · <span style="color:var(--ok)">${p.store || 'DACH'}</span></div>
            ${badges.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">${badges.join("")}</div>` : ''}
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0" onclick="event.stopPropagation()">
            <button class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 9px;border-radius:6px;text-decoration:none;font-size:0.78rem" onclick="addProductToSlot('${p.id}', 'am')">+ Morgen</button>
            <button class="btn-text" style="background:#f4ece0;color:#5c3e1e;padding:5px 9px;border-radius:6px;text-decoration:none;font-size:0.78rem" onclick="addProductToSlot('${p.id}', 'pm')">+ Abend</button>
          </div>
        </div>
      `;
    }).join("");
  }

  showModalSheet(`
    <div style="display:flex;justify-content:space-between;align-items:baseline">
      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">Schrank befüllen</div>
      <div style="font-size:0.76rem;color:var(--muted);font-weight:600" id="searchCountLabel">Katalog: ${Object.keys(DB).filter(k => k !== "water").length} Produkte</div>
    </div>
    <h2 style="margin:0.2rem 0 0.6rem">Produkt suchen & hinzufügen</h2>
    
    <input type="text" class="search-input" id="searchProdInput" placeholder="🔍 Marke, Drogerie, EAN (z.B. 3282770202120) oder Wirkstoff suchen..." value="${searchVal}">

    <div class="cat-chips" style="margin-bottom:6px">
      <div class="cat-chip ${currentCat === 'all' ? 'active' : ''}" id="chip_all" onclick="window.setAddCat('all')">Alle</div>
      <div class="cat-chip ${currentCat === 'reiniger' ? 'active' : ''}" id="chip_reiniger" onclick="window.setAddCat('reiniger')">Reiniger</div>
      <div class="cat-chip ${currentCat === 'serum' ? 'active' : ''}" id="chip_serum" onclick="window.setAddCat('serum')">Seren & Actives</div>
      <div class="cat-chip ${currentCat === 'creme' ? 'active' : ''}" id="chip_creme" onclick="window.setAddCat('creme')">Cremes</div>
      <div class="cat-chip ${currentCat === 'spf' ? 'active' : ''}" id="chip_spf" onclick="window.setAddCat('spf')">Sonnenschutz</div>
      <div class="cat-chip ${currentCat === 'dm' ? 'active' : ''}" id="chip_dm" style="border-color:#fca5a5;color:#991b1b;background:#fef2f2" onclick="window.setAddCat('dm')">${(typeof getLiveSearchChipLabel==='function'?getLiveSearchChipLabel():'Live-Suche')}</div>
    </div>
    <div id="adultCountryNote"></div>
    <div id="adultDmHonesty" style="display:${currentCat === 'dm' ? 'block' : 'none'};font-size:0.74rem;color:#9a3412;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:6px 8px;margin:0 0 0.55rem;line-height:1.35">
      <strong>${(typeof getLiveSearchHonesty==='function'&&getLiveSearchHonesty().short)?getLiveSearchHonesty().short:'Live-Suche'}</strong> ${(typeof getLiveDmHonesty==='function' && getLiveDmHonesty().showWarn && getLiveDmHonesty().badge) ? getLiveDmHonesty().badge : 'Preise/Sortiment gelten für DE — in anderen Ländern ggf. anders.'}
    </div>

    <div id="modalFilterChipsRow" style="display:${currentCat === 'dm' ? 'none' : 'flex'};gap:5px;flex-wrap:wrap;margin-bottom:0.7rem">
      <div class="cat-chip ${currentFlag === 'all' ? 'active' : ''}" id="fchip_all" style="font-size:0.74rem;padding:3px 9px" onclick="window.setAddFlag('all')">Alle Filter</div>
      <div class="cat-chip ${currentFlag === 'clean' ? 'active' : ''}" id="fchip_clean" style="font-size:0.74rem;padding:3px 9px" onclick="window.setAddFlag('clean')">⭐ Ungeflaggt / Reizarm</div>
      <div class="cat-chip ${currentFlag === 'ff' ? 'active' : ''}" id="fchip_ff" style="font-size:0.74rem;padding:3px 9px" onclick="window.setAddFlag('ff')">🌸 Parfümfrei</div>
      <div class="cat-chip ${currentFlag === 'nc' ? 'active' : ''}" id="fchip_nc" style="font-size:0.74rem;padding:3px 9px" onclick="window.setAddFlag('nc')">🛡️ Nicht-komedogen</div>
      <div class="cat-chip ${currentFlag === 'cf' ? 'active' : ''}" id="fchip_cf" style="font-size:0.74rem;padding:3px 9px" onclick="window.setAddFlag('cf')">🐰 Cruelty-Free (CFI)</div>
      <div class="cat-chip ${currentFlag === 'nwc' ? 'active' : ''}" id="fchip_nwc" style="font-size:0.74rem;padding:3px 9px" onclick="window.setAddFlag('nwc')">✨ Zero White-Cast</div>
      <div class="cat-chip ${currentFlag === 'iron' ? 'active' : ''}" id="fchip_iron" style="font-size:0.74rem;padding:3px 9px" onclick="window.setAddFlag('iron')">🛡️ Visible Light (Eisenoxid)</div>
      <div class="cat-chip ${currentFlag === 'pih' ? 'active' : ''}" id="fchip_pih" style="font-size:0.74rem;padding:3px 9px" onclick="window.setAddFlag('pih')">🎯 PIH / Anti-Pickelmale</div>
    </div>

    <div id="addResultsList" style="display:flex;flex-direction:column;gap:8px;max-height:46vh;overflow-y:auto;padding-bottom:10px">
      ${renderListHtml()}
    </div>

    <button class="ghost-btn" style="margin-top:0.8rem" onclick="closeModal()">Fertig</button>
  `);

  const inputEl = document.getElementById("searchProdInput");
  if (inputEl) {
    inputEl.focus();
    inputEl.oninput = (e) => {
      searchVal = e.target.value;
      if (currentCat === "dm") {
        clearTimeout(dmDebounceTimer);
        dmDebounceTimer = setTimeout(async () => {
          if (searchVal.trim().length >= 2) {
            liveDmLoading = true;
            const resEl = document.getElementById("addResultsList");
            if (resEl) resEl.innerHTML = renderListHtml();
            liveDmItems = await searchDmLive(searchVal);
            window.currentLiveDmResults = liveDmItems;
            window.dmResultsMap = window.dmResultsMap || {};
            liveDmItems.forEach(pr => { if (pr.id) window.dmResultsMap[pr.id] = pr; });
            liveDmLoading = false;
            if (resEl) resEl.innerHTML = renderListHtml();
          } else {
            liveDmItems = [];
            window.currentLiveDmResults = [];
            const resEl = document.getElementById("addResultsList");
            if (resEl) resEl.innerHTML = renderListHtml();
          }
        }, 350);
      } else {
        const resEl = document.getElementById("addResultsList");
        if (resEl) resEl.innerHTML = renderListHtml();
      }
    };
  }

  window.setAddCat = async (cat) => {
    currentCat = cat;
    ['all', 'reiniger', 'serum', 'creme', 'spf', 'dm'].forEach(c => {
      const chip = document.getElementById(`chip_${c}`);
      if (chip) chip.className = `cat-chip ${c === cat ? 'active' : ''}`;
    });
    const filterRow = document.getElementById("modalFilterChipsRow");
    if (filterRow) filterRow.style.display = cat === "dm" ? "none" : "flex";
    const dmHonesty = document.getElementById("adultDmHonesty");
    if (dmHonesty) dmHonesty.style.display = cat === "dm" ? "block" : "none";

    if (cat === "dm") {
      if (searchVal && searchVal.trim().length >= 2) {
        liveDmLoading = true;
        const resEl = document.getElementById("addResultsList");
        if (resEl) resEl.innerHTML = renderListHtml();
        liveDmItems = await searchDmLive(searchVal);
        window.currentLiveDmResults = liveDmItems;
        window.dmResultsMap = window.dmResultsMap || {};
        liveDmItems.forEach(pr => { if (pr.id) window.dmResultsMap[pr.id] = pr; });
        liveDmLoading = false;
        if (resEl) resEl.innerHTML = renderListHtml();
      } else {
        liveDmItems = [];
        const resEl = document.getElementById("addResultsList");
        if (resEl) resEl.innerHTML = renderListHtml();
      }
    } else {
      const resEl = document.getElementById("addResultsList");
      if (resEl) resEl.innerHTML = renderListHtml();
    }
  };

  window._refreshOpenCountryFilteredList = () => {
    const resEl = document.getElementById("addResultsList");
    if (resEl) resEl.innerHTML = renderListHtml();
  };

  window.setAddFlag = (fl) => {
    currentFlag = fl;
    ['all', 'clean', 'ff', 'nc', 'cf', 'nwc', 'iron', 'pih'].forEach(f => {
      const chip = document.getElementById(`fchip_${f}`);
      if (chip) chip.className = `cat-chip ${f === fl ? 'active' : ''}`;
    });
    const resEl = document.getElementById("addResultsList");
    if (resEl) resEl.innerHTML = renderListHtml();
  };
}



async function startBarcodeScanner(onCode) {
  const status = document.getElementById("scanStatus");
  const video = document.getElementById("scanVideo");
  const startBtn = document.getElementById("btnStartScan");
  const stopBtn = document.getElementById("btnStopScan");

  if (!status || !video) return;

  if (!window.isSecureContext) {
    status.textContent = "Kamera braucht localhost oder HTTPS.";
    return;
  }
  if (!("BarcodeDetector" in window)) {
    status.textContent = "Scanner in diesem Browser nicht verfügbar — EAN tippen.";
    return;
  }

  try {
    status.textContent = "Kamera wird initialisiert…";
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    currentScannerStream = stream;
    video.srcObject = stream;
    video.style.display = "block";
    if (startBtn) startBtn.style.display = "none";
    if (stopBtn) stopBtn.style.display = "inline-block";

    await video.play();

    const detector = new BarcodeDetector({
      formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"]
    });
    status.textContent = "Barcode vor die Kamera halten…";

    currentScannerTimer = setInterval(async () => {
      try {
        if (!video.videoWidth) return;
        const codes = await detector.detect(video);
        if (!codes.length) return;
        const raw = codes[0].rawValue;
        clearInterval(currentScannerTimer);
        currentScannerTimer = null;
        if (currentScannerStream) {
          currentScannerStream.getTracks().forEach(t => t.stop());
          currentScannerStream = null;
        }
        video.srcObject = null;
        video.style.display = "none";
        status.textContent = "Gefunden: " + raw;
        if (typeof onCode === "function") {
          onCode(raw);
        }
      } catch (e) {
        /* Frame überspringen */
      }
    }, 400);
  } catch (err) {
    status.textContent = "Kamera-Zugriff verweigert oder nicht verfügbar.";
    console.warn("Scanner-Fehler:", err);
    stopBarcodeScanner();
  }
}

function findProductByEan(ean) {
  if (!ean) return null;
  const cleanEan = String(ean).trim();

  const searchAdult = () => {
    for (const id in DB) {
      if (DB[id].ean && String(DB[id].ean).trim() === cleanEan) {
        return { type: "adult", id: id, prod: DB[id] };
      }
    }
    return null;
  };

  const searchTeen = () => {
    if (typeof TEEN_DB === "object") {
      for (const id in TEEN_DB) {
        if (TEEN_DB[id].ean && String(TEEN_DB[id].ean).trim() === cleanEan) {
          return { type: "teen", id: id, prod: TEEN_DB[id] };
        }
      }
    }
    return null;
  };

  const searchBaby = () => {
    if (typeof BABY_DB === "object") {
      for (const id in BABY_DB) {
        if (BABY_DB[id].ean && String(BABY_DB[id].ean).trim() === cleanEan) {
          return { type: "baby", id: id, prod: BABY_DB[id] };
        }
      }
    }
    return null;
  };

  // Aktives Profil priorisieren
  if (appState && appState.profile === "teen") {
    return searchTeen() || searchAdult() || searchBaby();
  } else if (appState && (appState.profile === "baby" || appState.profile === "child")) {
    return searchBaby() || searchAdult() || searchTeen();
  } else {
    return searchAdult() || searchTeen() || searchBaby();
  }
}

function handleScannedBarcode(rawEan) {
  const ean = String(rawEan).trim();
  console.log("Barcode gescannt:", ean);
  const found = findProductByEan(ean);

  if (found) {
    if (found.type === "adult") {
      showVerdict(found.id);
    } else if (found.type === "teen") {
      openTeenProductDetail(found.id);
    } else if (found.type === "baby") {
      openBabyProductDetail(found.id);
    }
  } else {
    // Falls noch nicht im Schrank-Katalog: ins Suchfeld eintragen und filtern
    const input = document.getElementById("scanSearchInput");
    if (input) {
      input.value = ean;
      if (typeof window.filterScanList === "function") {
        window.filterScanList(ean);
      }
    }
  }
}

function openScanModal() {
  showModalSheet(`
    <h2>Dose im Laden prüfen</h2>
    <p style="color:var(--muted);font-size:0.88rem;margin:-0.2rem 0 0.8rem">EAN-Barcode vor die Kamera halten oder Nummer eingeben:</p>
    
    <!-- Kamera Live-Scanner -->
    <div style="background:#1e293b;border-radius:14px;padding:12px;text-align:center;margin-bottom:0.9rem;color:#fff">
      <video id="scanVideo" playsinline style="width:100%;max-width:360px;height:200px;border-radius:12px;background:#000;display:none;object-fit:cover;margin:0 auto 8px"></video>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center">
        <button type="button" id="btnStartScan" class="btn-scan" style="background:#2563eb;font-size:0.86rem;padding:7px 14px;border-radius:8px">
          📷 Scanner starten
        </button>
        <button type="button" id="btnStopScan" class="btn-text" style="display:none;background:#475569;color:#fff;font-size:0.82rem;padding:7px 12px;border-radius:8px" onclick="stopBarcodeScanner()">
          Stoppen
        </button>
      </div>
      <p id="scanStatus" style="color:#cbd5e1;font-size:0.84rem;margin:6px 0 0">Kamera auf EAN-Strichcode der Dose richten</p>
      ${window.location.protocol === "file:" ? `
        <div style="margin-top:8px;font-size:0.75rem;color:#fcd34d;background:rgba(245,158,11,0.15);padding:6px 10px;border-radius:6px;line-height:1.35">
          💡 Hinweis: Live-Kamera braucht HTTPS oder <strong>localhost</strong>. Starte <code>start-server.bat</code> für die Kamera oder tippe die EAN unten ein.
        </div>
      ` : ''}
      <div style="margin-top:8px;font-size:0.72rem;color:#94a3b8;display:flex;align-items:center;justify-content:center;gap:4px">
        <span>🔒 Kamera verarbeitet 100% lokal im Browser ·</span>
        <button type="button" class="btn-text" style="color:#93c5fd;text-decoration:underline;font-size:0.72rem;padding:0;background:transparent;border:none" onclick="if(typeof openPrivacyModal==='function')openPrivacyModal()">Datenschutz</button>
      </div>
    </div>

    <input type="text" class="search-input" id="scanSearchInput" placeholder="🔍 EAN (z.B. 4066447952971) oder Produktname..." value="" oninput="window.filterScanList(this.value)">

    <!-- Live dm Sofort-Suche Container im Scanner -->
    <div id="scanLiveDmBox" style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:10px 12px;margin:8px 0">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="font-weight:700;font-size:0.84rem;color:#991b1b;display:flex;align-items:center;gap:6px">
          <span>🛒</span> Live-Suche bei dm
        </div>
        <button type="button" class="btn-text" style="background:#b91c1c;color:#fff;font-size:0.75rem;padding:4px 10px;border-radius:6px;font-weight:600" onclick="window.triggerLiveDmFromInput()">
          Jetzt bei dm prüfen ➔
        </button>
      </div>
      <div id="dmLiveScanResults" style="margin-top:4px"></div>
    </div>

    <div id="scanResultsContainer" style="display:none;flex-direction:column;gap:6px;max-height:36vh;overflow-y:auto;margin-bottom:0.8rem"></div>

    <div id="scanDefaultList" class="sim-list">
      <div class="sim-item" onclick="showVerdict('glycolic')">
        <div>
          <div class="sim-name">The Ordinary Glycolic Acid 7%</div>
          <div class="sim-brand">AHA Chemisches Peeling · dm / Douglas</div>
        </div>
        <span class="sim-cat">Säure</span>
      </div>

      <div class="sim-item" onclick="showVerdict('bha')">
        <div>
          <div class="sim-name">Paula's Choice 2% BHA Liquid</div>
          <div class="sim-brand">Salicylsäure Porenpflege · Douglas</div>
        </div>
        <span class="sim-cat">BHA</span>
      </div>

      <div class="sim-item" onclick="showVerdict('baleaWash')">
        <div>
          <div class="sim-name">Balea Med Ultra Sensitive Waschgel</div>
          <div class="sim-brand">Reizarmer Reiniger · dm (~2,45 €)</div>
        </div>
        <span class="sim-cat" style="background:#e0f2e9;color:#1e6b45">Mild</span>
      </div>

      <div class="sim-item" onclick="showVerdict('retinol')">
        <div>
          <div class="sim-name">The Ordinary Retinol 0.2% in Squalane</div>
          <div class="sim-brand">Kosmetisches Retinoid · dm</div>
        </div>
        <span class="sim-cat">Retinol</span>
      </div>

      <div class="sim-item" onclick="showVerdict('nia10')">
        <div>
          <div class="sim-name">The Ordinary Niacinamide 10% + Zinc</div>
          <div class="sim-brand">Hochdosiertes Niacinamid · dm</div>
        </div>
        <span class="sim-cat">Serum</span>
      </div>

      <div class="sim-item" onclick="showVerdict('cleanGlow')">
        <div>
          <div class="sim-name">Clean Glow Zitrus Peeling-Öl</div>
          <div class="sim-brand">Duftstoff- & Ätherisches Öl Produkt</div>
        </div>
        <span class="sim-cat" style="background:#fae5e5;color:#922222">Reiz</span>
      </div>
    </div>

    <button class="ghost-btn" onclick="closeModal()">Schließen</button>
  `);

  const btnStartScan = document.getElementById("btnStartScan");
  if (btnStartScan) {
    btnStartScan.onclick = () => {
      startBarcodeScanner((ean) => {
        handleScannedBarcode(ean);
      });
    };
  }

  window.triggerLiveDmFromInput = () => {
    const input = document.getElementById("scanSearchInput");
    const val = input ? input.value.trim() : "";
    window.runLiveDmScanSearch(val || "Balea Med");
  };

  window.runLiveDmScanSearch = async (rawQ) => {
    const q = decodeURIComponent(rawQ).trim();
    const container = document.getElementById("dmLiveScanResults");
    if (!container) return;
    if (!q) {
      container.innerHTML = `<div style="font-size:0.78rem;color:var(--muted);padding:4px 0">Tippe oben einen Namen oder Barcode ein.</div>`;
      return;
    }
    container.innerHTML = `<div style="font-size:0.8rem;color:#991b1b;padding:8px 0;font-weight:600">⏳ Frage live bei dm-drogerie markt nach „${q}“...</div>`;
    
    const prods = await searchDmLive(q);
    if (prods.length === 0) {
            const errMsg = window.lastDmError || ('Kein Live-Treffer bei dm für "' + escapeHtml(q) + '" gefunden.');
      container.innerHTML = `<div style="font-size:0.8rem;color:var(--muted);padding:6px 0">${errMsg}</div>`;
      return;
    }

    container.innerHTML = prods.slice(0, 4).map((p, idx) => `
      <div style="background:#fff;border:1px solid #fca5a5;border-radius:8px;padding:8px 10px;margin-top:6px;display:flex;align-items:center;justify-content:space-between;gap:8px">
        <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1">
          ${p.img ? `<img src="${p.img}" alt="${p.name}" style="width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid #f1f5f9;flex-shrink:0">` : '<div style="width:38px;height:38px;border-radius:6px;background:#fee2e2;color:#b91c1c;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">🛒</div>'}
          <div style="min-width:0;flex:1">
            <div style="font-weight:700;font-size:0.84rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.brand} ${p.name}</div>
            <div style="font-size:0.74rem;color:var(--muted)">
              <span style="color:#16a34a;font-weight:700">${p.price || 'dm'}</span>
              ${p.ff === true ? ' · <span style="color:#16a34a;font-weight:600">🌸 Parfümfrei</span>' : (p.ff === false ? ' · <span style="color:#d97706">⚠️ Parfümiert</span>' : '')}
              ${p.cf === true ? ' · <span style="color:#6b21a8">🐰 CF</span>' : ''}
              · <a href="${p.url}" target="_blank" style="color:#2563eb;text-decoration:underline">dm.de ↗</a>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0">
          <button type="button" class="btn-text" style="background:var(--ok);color:#F7F4D5;padding:5px 8px;border-radius:6px;font-size:0.74rem;font-weight:700" onclick="adoptDmProductToSlot('${p.id}', 'pm')">+ Schrank</button>
          <button type="button" class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 8px;border-radius:6px;font-size:0.74rem;font-weight:600" onclick="adoptDmProductToSlot('${p.id}', 'am')">+ Morgen</button>
        </div>
      </div>
    `).join("");
  };

  window.filterScanList = (q) => {
    const resEl = document.getElementById("scanResultsContainer");
    const defEl = document.getElementById("scanDefaultList");
    if (!resEl || !defEl) return;
    const query = q.trim().toLowerCase();
    if (!query) {
      resEl.style.display = "none";
      defEl.style.display = "flex";
      return;
    }
    defEl.style.display = "none";
    resEl.style.display = "flex";

    const allMatches = [];

    // 1. Adult DB
    Object.keys(DB).filter(k => k !== "water").forEach(id => {
      const p = DB[id];
      if ((p.name + " " + p.brand + " " + (p.wirk || "") + " " + (p.store || "") + " " + (p.ean || "")).toLowerCase().includes(query)) {
        allMatches.push({ type: "adult", p: p });
      }
    });

    // 2. Teen DB
    if (typeof TEEN_DB === "object") {
      Object.keys(TEEN_DB).forEach(id => {
        const p = TEEN_DB[id];
        if ((p.name + " " + p.brand + " " + (p.slot || "") + " " + (p.ean || "")).toLowerCase().includes(query)) {
          allMatches.push({ type: "teen", p: p });
        }
      });
    }

    // 3. Baby & Kind DB
    if (typeof BABY_DB === "object") {
      Object.keys(BABY_DB).forEach(id => {
        const p = BABY_DB[id];
        if ((p.name + " " + p.brand + " " + (p.slot || "") + " " + (p.ean || "")).toLowerCase().includes(query)) {
          allMatches.push({ type: "baby", p: p });
        }
      });
    }

    const matches = allMatches.slice(0, 18);

    let html = "";
    if (matches.length > 0) {
      html += matches.map(m => {
        const p = m.p;
        const badges = [];
        if (m.type === "teen") badges.push('<span class="tag" style="background:#ccfbf1;color:#0f766e;font-size:0.65rem;padding:1px 5px">🧑‍🦱 Teenie</span>');
        else if (m.type === "baby") badges.push('<span class="tag ped-blue" style="font-size:0.65rem;padding:1px 5px">👶 Baby/Kind</span>');

        if (p.ff === false) badges.push('<span class="tag warn" style="font-size:0.65rem;padding:1px 4px">⚠️ Parfüm</span>');
        else if (p.ff === true) badges.push('<span class="tag ff" style="font-size:0.65rem;padding:1px 4px">🌸 Parfümfrei</span>');
        if (p.nc === true) badges.push('<span class="tag nc" style="font-size:0.65rem;padding:1px 4px">🛡️ NC</span>');
        if (p.cf === true) badges.push('<span class="tag cf" style="font-size:0.65rem;padding:1px 4px">🐰 CF</span>');

        const clickAction = m.type === "teen" ? `openTeenProductDetail('${p.id}')` : (m.type === "baby" ? `openBabyProductDetail('${p.id}')` : `showVerdict('${p.id}')`);

        return `
          <div class="sim-item" onclick="${clickAction}">
            <div style="flex:1;min-width:0;margin-right:10px">
              <div class="sim-name">${p.brand} ${p.name}</div>
              <div class="sim-brand">${p.wirk || p.slot || 'Pflege'} · ${p.store || p.countries || 'EU'}${p.ean ? ' · EAN: ' + p.ean : ''}</div>
              ${badges.length ? `<div style="display:flex;gap:4px;margin-top:3px;flex-wrap:wrap">${badges.join("")}</div>` : ''}
            </div>
            <span class="sim-cat" style="background:#eaf0f6;color:#204060">Prüfen ➔</span>
          </div>
        `;
      }).join("");
    } else {
      html += `<div style="text-align:center;padding:1rem;color:var(--muted);font-size:0.85rem">Kein Treffer in den 985+ Basis-Artikeln.</div>`;
    }

    html += `
      <div style="text-align:center;padding:0.8rem;background:#fffcf8;border:1px dashed #dcd4c7;border-radius:10px;margin-top:6px">
        <div style="font-weight:600;font-size:0.86rem;color:#5c3e1e">Beliebiges anderes Produkt aus Drogerie oder Apotheke?</div>
        <div style="font-size:0.78rem;color:var(--muted);margin:2px 0 6px">Jedes EU-Produkt schnell erfassen, auf Kriterien flaggen & in die Routine stellen:</div>
        <button class="btn-text" style="background:#f4ece0;color:#5c3e1e;padding:6px 12px;border-radius:6px;font-size:0.8rem;font-weight:600" onclick="openCustomProductModal('${encodeURIComponent(q)}')">
          ➕ ${q ? `„${q}“ als neues Produkt erfassen & prüfen` : '+ Eigenes EU-Produkt erfassen & prüfen'}
        </button>
      </div>
    `;

    resEl.innerHTML = html;

    // Automatischer Live-Aufruf bei EAN-Barcodes (8 bis 14 Ziffern)
    if (/^\d{8,14}$/.test(query)) {
      window.runLiveDmScanSearch(query);
    }
  };
}


function openCustomProductModal(initialQuery = "") {
  let initial = "";
  try { initial = decodeURIComponent(initialQuery).trim(); } catch(e) { initial = initialQuery.trim(); }
  const isNumericEan = /^\d{8,14}$/.test(initial);
  const defaultEan = isNumericEan ? initial : "";
  const defaultName = isNumericEan ? "" : initial;

  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">EU-Produkt Erfassen</div>
    <h2 style="margin:0.2rem 0 0.5rem">Neues Drogerie- / Apothekenprodukt</h2>
    <p style="font-size:0.85rem;color:var(--muted);margin-bottom:0.9rem">
      Erfasse jedes in der EU erhältliche Produkt. Der Kosmetikschrank prüft es auf Reiz-Stacking, ordnet es galenisch ein und flaggt fehlende Kriterien.
    </p>

    <div style="display:flex;flex-direction:column;gap:10px">
      <div>
        <label style="font-size:0.78rem;font-weight:700;color:var(--ink)">Marke / Hersteller</label>
        <input type="text" id="custBrand" class="search-input" placeholder="z. B. Balea Med, CeraVe, Garnier, Cien, The Inkey List..." style="margin-top:3px" oninput="window.onCustBrandInput(this.value)">
        <div id="custCfiNotice" style="display:none;margin-top:4px;font-size:0.75rem;color:#6b21a8;font-weight:600">🐰 CFI Leaping Bunny genehmigte Marke erkannt!</div>
      </div>

      <div>
        <label style="font-size:0.78rem;font-weight:700;color:var(--ink)">Produktname</label>
        <input type="text" id="custName" class="search-input" value="${defaultName}" placeholder="z. B. Ultra Sensitive Waschbalsam..." style="margin-top:3px">
      </div>

      <div>
        <label style="font-size:0.78rem;font-weight:700;color:var(--ink)">Kategorie (Galenischer Schritt)</label>
        <select id="custKat" style="width:100%;padding:0.65rem;border:1px solid var(--line);border-radius:10px;background:#fff;font-size:0.9rem;margin-top:3px">
          <option value="reiniger">1. Reinigung (Waschgel, Schaum, Mizellenwasser)</option>
          <option value="serum">2. Serum / Konzentrat / Wirkstoff (Hyaluron, Niacinamid, Säure)</option>
          <option value="creme" selected>4. Creme / Feuchtigkeitspflege / Barriere</option>
          <option value="spf">5. Sonnenschutz (LSF 30 / 50+)</option>
        </select>
      </div>

      <div>
        <label style="font-size:0.78rem;font-weight:700;color:var(--ink)">EAN-Barcode (optional)</label>
        <input type="text" id="custEan" class="search-input" value="${defaultEan}" placeholder="z. B. 4010355..." style="margin-top:3px">
      </div>

      <!-- 3 EU-Flag Toggles -->
      <div style="background:#fcfbf8;border:1px solid var(--line);border-radius:12px;padding:0.85rem;margin-top:4px">
        <div style="font-size:0.8rem;font-weight:700;color:var(--ink);margin-bottom:6px">EU-Kriterien & Auslobung der Dose:</div>
        
        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer;margin-bottom:7px">
          <input type="checkbox" id="custFf" style="width:17px;height:17px;accent-color:#0369a1" checked>
          <span><strong>🌸 Parfümfrei</strong> (Kein Parfum / Duftstoffe auf der INCI-Liste)</span>
        </label>

        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer;margin-bottom:7px">
          <input type="checkbox" id="custNc" style="width:17px;height:17px;accent-color:#166534">
          <span><strong>🛡️ Nicht-Komedogen</strong> (Auslobung "nicht komedogen" auf Packung)</span>
        </label>

        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer">
          <input type="checkbox" id="custCf" style="width:17px;height:17px;accent-color:#6b21a8">
          <span><strong>🐰 Cruelty-Free</strong> (Leaping Bunny / PETA-Zertifikat)</span>
        </label>
      </div>

      <button class="primary" style="margin-top:0.6rem" onclick="saveCustomProductAndCheck()">
        🔬 Produkt prüfen & Verträglichkeits-Check starten
      </button>
      <button class="ghost-btn" onclick="openScanModal()">Zurück zum Scanner</button>
    </div>
  `);

  window.onCustBrandInput = (val) => {
    const isCf = isBrandCrueltyFree(val);
    const notice = document.getElementById("custCfiNotice");
    const cfCheckbox = document.getElementById("custCf");
    if (notice) notice.style.display = isCf ? "block" : "none";
    if (cfCheckbox && isCf) cfCheckbox.checked = true;
  };
}

function saveCustomProductAndCheck() {
  const brand = (document.getElementById("custBrand")?.value || "Individuell").trim();
  const name = (document.getElementById("custName")?.value || "Gesichtspflege").trim();
  const kat = document.getElementById("custKat")?.value || "creme";
  const ean = (document.getElementById("custEan")?.value || "").trim();
  const ff = document.getElementById("custFf")?.checked ? true : null;
  const nc = document.getElementById("custNc")?.checked ? true : null;
  const cf = document.getElementById("custCf")?.checked ? true : null;

  const isCf = (cf === true) || isBrandCrueltyFree(brand);
  const cfBasis = isCf ? (isBrandCrueltyFree(brand) ? "CFI Leaping Bunny (genehmigte Marke)" : "Manuell deklariert") : "";

  const id = "custom_" + Date.now();
  const colors = { reiniger: "#7ebbc4", serum: "#6bb5a3", creme: "#bad19f", spf: "#ecd37b" };
  const shapes = { reiniger: "pump", serum: "serum", creme: "jar", spf: "tube" };

  DB[id] = {
    id,
    name,
    brand,
    kat,
    schiene: "support",
    klassen: kat === "spf" ? ["uv"] : (kat === "serum" ? ["humectant"] : ["support"]),
    shape: shapes[kat] || "tube",
    c: colors[kat] || "#8ec4e6",
    wirk: kat === "reiniger" ? "Sanfte Reinigung" : (kat === "spf" ? "UV-Breitbandschutz" : (kat === "serum" ? "Hydratisierendes Konzentrat" : "Feuchtigkeits-Barriere")),
    nc,
    cf: isCf,
    cf_basis: cfBasis,
    ff,
    ean,
    store: "Eigene Erfassung · EU-Handel",
    notes: isCf ? "Marke erfüllt CFI / Leaping Bunny Kriterien." : "Individuell über den Scanner erfasst."
  };
  if (typeof enrichProductClasses === "function") enrichProductClasses(DB[id]);
  if (!appState.customProducts) appState.customProducts = {};
  appState.customProducts[id] = DB[id];

  showVerdict(id);
}

function showVerdict(prodId) {
  const prod = DB[prodId];
  if (!prod) return;
  const v = evaluateCandidate(prod);
  // Arzt-Thema: keine Active-Upsell-Listen (Support/Reiniger/SPF ok)
  const arztThema = (typeof hasArztThema === "function") && hasArztThema();

  let altsHTML = "";
  if (v.alts && v.alts.length) {
    const altTitle = arztThema
      ? "Basis-Alternativen (kein Serum-Upgrade bei Arzt-Thema)"
      : "Gleiches Regal bei dm / Apotheke (Bessere Wahl)";
    altsHTML = `
      <div class="alt-title">${altTitle}</div>
      <div class="alt-list">
        ${v.alts.map(a => `
          <div class="alt-card">
            <div>
              <div class="alt-name">${a.name}</div>
              <div class="alt-store">${a.store}</div>
            </div>
            <div class="alt-price">${a.price}</div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (arztThema && (typeof isCosmeticActiveUpsell === "function") && isCosmeticActiveUpsell(prod)) {
    altsHTML = `
      <div class="alt-title">Arzt-Thema – kein Active-Upsell</div>
      <div style="font-size:0.84rem;color:var(--muted);line-height:1.4;margin-bottom:0.6rem">
        Keine stärkeren Seren als Alternative. Reiniger, Creme, SPF und milder Support bleiben scannbar.
      </div>
    `;
  }

  // Ein Produkt gilt nur dann als mit WARNUNGEN GEFLAGT, wenn ein tatsächliches Reiz- oder Therapierisiko vorliegt:
  // 1. Enthält Parfüm / Duftstoffe (Reiz-Trigger für sensible/Retinoid-Haut): prod.ff === false
  // 2. Wirkstoff-Konflikt / Überreizung (z.B. Säuren am Adapalen-Abend): v.status === "danger" || v.status === "no"
  // Erfüllt ein Produkt die Kriterien (z.B. Parfümfrei, Nicht-Komedogen und/oder Cruelty-Free), wird es NICHT als Warnung geflagt, sondern positiv bestätigt!
  const hasPerfumeWarning = (prod.ff === false);
  const hasConflictWarning = (v.status === "danger" || v.status === "no");
  const isFlaggedWithWarning = hasPerfumeWarning || hasConflictWarning;

  const flagBoxHTML = `
    <div class="pharma-box" style="background:${isFlaggedWithWarning ? '#fffcf0' : '#f0fdf4'};border:1px solid ${isFlaggedWithWarning ? '#ebdcb5' : '#bbf7d0'};margin-top:0.8rem">
      <div class="pharma-title" style="color:${isFlaggedWithWarning ? '#785a28' : '#166534'};display:flex;justify-content:space-between;align-items:center">
        <span>📋 Kriterien- & Verträglichkeits-Check</span>
        ${isFlaggedWithWarning 
          ? '<span style="font-size:0.72rem;background:#fee2e2;color:#991b1b;padding:2px 7px;border-radius:5px;font-weight:700">⚠️ Reizstoff- / Verträglichkeits-Hinweis</span>' 
          : '<span style="font-size:0.72rem;background:#dcfce7;color:#166534;padding:2px 7px;border-radius:5px;font-weight:700">✅ Kriterien erfüllt · Nicht geflagt</span>'}
      </div>
      <div style="display:flex;flex-direction:column;gap:7px;margin-top:7px;font-size:0.84rem;line-height:1.4">
        <div style="display:flex;align-items:flex-start;gap:7px">
          ${prod.ff === true 
            ? '<span style="color:#0369a1;font-weight:700;flex-shrink:0">🌸 Parfümfrei:</span> <span>✅ Formel ohne Duftstoffe & Duftallergene (optimal reizarm).</span>' 
            : (prod.ff === false 
                ? '<span style="color:#b91c1c;font-weight:700;flex-shrink:0">⚠️ Nicht parfümfrei:</span> <span style="color:#7f1d1d">Enthält Parfüm/Duftstoffe. Kann bei sensibler Haut oder aktiver Retinoid-Therapie Brennen & Rötungen begünstigen.</span>'
                : '<span style="color:#525252;font-weight:700;flex-shrink:0">🌸 Parfümierung:</span> <span style="color:#6b7280">ℹ️ Offen (keine verifizierten Angaben).</span>')}
        </div>
        <div style="display:flex;align-items:flex-start;gap:7px">
          ${prod.nc === true 
            ? '<span style="color:#166534;font-weight:700;flex-shrink:0">🛡️ Nicht-Komedogen:</span> <span>✅ Offizieller Hersteller-Claim gegen Porenverstopfung & Komedonen.</span>' 
            : (prod.nc === false
                ? '<span style="color:#525252;font-weight:700;flex-shrink:0">🛡️ Komedogenität:</span> <span style="color:#525252">Nicht als komedogenarm ausgelobt.</span>'
                : '<span style="color:#525252;font-weight:700;flex-shrink:0">🛡️ Nicht-Komedogen:</span> <span style="color:#6b7280">ℹ️ Offen (kein offizieller Hersteller-Claim deklariert).</span>')}
        </div>
        <div style="display:flex;align-items:flex-start;gap:7px">
          ${prod.cf === true 
            ? `<span style="color:#6b21a8;font-weight:700;flex-shrink:0">🐰 Cruelty-Free:</span> <span>✅ Verifiziert tierversuchsfrei (${prod.cf_basis || 'CFI Leaping Bunny / Verbandssiegel'}).</span>` 
            : (prod.cf === false
                ? '<span style="color:#525252;font-weight:700;flex-shrink:0">🐰 Cruelty-Free:</span> <span style="color:#525252">Kein Verbandssiegel hinterlegt.</span>'
                : '<span style="color:#525252;font-weight:700;flex-shrink:0">🐰 Cruelty-Free:</span> <span style="color:#6b7280">ℹ️ Offen (kein gesondertes Verbands-Zertifikat hinterlegt; gesetzliches EU-Tierversuchsverbot gilt).</span>')}
        </div>
      </div>
    </div>
  `;

  const verdictId = v.verdict || (typeof normalizeOutcome === "function" ? normalizeOutcome(v.status) : v.status);
  const oneLook = v.oneLook || (typeof formatVerdictOneLook === "function"
    ? formatVerdictOneLook(verdictId, v.reason)
    : v.title);
  const statusPill = (verdictId === "passt" || v.status === "ok")
    ? '<span style="display:inline-block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;background:#dcfce7;color:#166534;padding:3px 9px;border-radius:6px;font-weight:800">🟢 passt</span>'
    : ((verdictId === "eher_nicht" || v.status === "warn")
      ? '<span style="display:inline-block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;background:#fef3c7;color:#92400e;padding:3px 9px;border-radius:6px;font-weight:800">🟡 eher nicht</span>'
      : '<span style="display:inline-block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;background:#fee2e2;color:#991b1b;padding:3px 9px;border-radius:6px;font-weight:800">🔴 Konflikt</span>');

  function dimLine(label, dim) {
    if (!dim) return "";
    if (dim.outcome == null && (dim.code === "noch_nicht" || v.emptyCabinet)) {
      return `<div style="font-size:0.82rem;line-height:1.35;margin-top:4px"><strong>${label}:</strong> noch nicht prüfbar — ${dim.reason || "Schrank leer"}</div>`;
    }
    const o = dim.outcome || "passt";
    const lab = o === "konflikt" ? "Konflikt" : (o === "eher_nicht" ? "eher nicht" : "passt");
    return `<div style="font-size:0.82rem;line-height:1.35;margin-top:4px"><strong>${label}:</strong> ${lab} — ${dim.reason || ""}</div>`;
  }
  const dimsHTML = v.dims ? `
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,0,0,0.06)">
        ${dimLine("Zu dir", v.dims.zuDir)}
        ${dimLine("Zum Schrank", v.dims.zumSchrank)}
        ${dimLine("Slot", v.dims.slot)}
      </div>` : "";
  const emptyTip = v.emptyCabinet ? `
      <div style="margin-top:6px;font-size:0.78rem;color:var(--muted);line-height:1.35">
        Tipp: Produkt speichern oder 2–3 Alltagsprodukte scannen — dann wird „Zum Schrank“ scharf. Scan bleibt frei.
      </div>` : "";

  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">Scan-Ergebnis für:</div>
    <h2>${prod.brand} ${prod.name}</h2>
    
    <div class="verdict-banner ${v.status}" style="flex-direction:column;gap:6px">
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;flex-wrap:wrap;gap:6px">
        <div class="verdict-title">${oneLook}</div>
        ${statusPill}
      </div>
      <div class="verdict-sub" style="font-size:0.92rem;font-weight:600;margin-top:2px">
        <strong>Warum?</strong> ${v.reason}
      </div>
      ${dimsHTML}
      ${emptyTip}
      <div style="display:inline-flex;align-items:center;gap:6px;margin-top:4px;padding:4px 9px;background:rgba(255,255,255,0.85);border-radius:6px;font-size:0.78rem;font-weight:700;color:var(--ink)">
        <span>⏱️ Empfohlener Einsatz:</span>
        <span style="font-weight:600">${v.where}</span>
      </div>
      <div style="margin-top:6px;font-size:0.72rem;color:var(--muted);font-style:italic">
        ⚖️ ${v.disclaimer || window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
      </div>
    </div>

    ${flagBoxHTML}

    <div class="pharma-box">
      <div class="pharma-title">🔬 Was das Marketing verschweigt (Pharmazie-Check)</div>
      <div class="pharma-text">${v.truth}</div>
    </div>

    ${altsHTML}

    <div style="margin-top:1.2rem;background:#fdfcf9;border:1px solid var(--line);border-radius:12px;padding:0.95rem">
      <div style="font-weight:700;font-size:0.9rem;color:var(--ink);margin-bottom:0.3rem">
        ${isFlaggedWithWarning ? '⚠️ Trotz der Hinweise in deine Routine übernehmen?' : '🎯 In deine Routine übernehmen:'}
      </div>
      <div style="font-size:0.79rem;color:var(--muted);margin-bottom:0.75rem;line-height:1.35">
        ${isFlaggedWithWarning 
          ? 'Du entscheidest selbst: Wenn deine Haut das Produkt gut verträgt, kannst du es direkt in die Morgen- oder Abend-Routine stellen.' 
          : 'Wähle einfach, wann du das Produkt anwenden möchtest:'}
      </div>
      <div style="display:flex;gap:8px">
        <button class="primary" style="flex:1;background:#204060;margin-top:0" onclick="addProductToSlot('${prod.id}', 'am')">
          + In Morgen-Routine
        </button>
        <button class="primary" style="flex:1;background:#5c3e1e;margin-top:0" onclick="addProductToSlot('${prod.id}', 'pm')">
          + In Abend-Routine
        </button>
      </div>
    </div>

    <div style="margin-top:0.6rem">
      <button class="ghost-btn" onclick="closeModal()">Zurück zum Scanner</button>
    </div>
  `);
}

function addCandidateToCabinet(prodId) {
  const p = DB[prodId];
  if (p.kat === "spf") {
    appState.am = appState.am.filter(x => DB[x].kat !== "spf").concat(prodId);
    appState.tab = "am";
  } else if (p.kat === "reiniger") {
    if (!appState.am.includes(prodId)) appState.am.push(prodId);
    if (!appState.pm_a.includes(prodId)) appState.pm_a.push(prodId);
    if (!appState.pm_b.includes(prodId)) appState.pm_b.push(prodId);
    if (!appState.pm_c.includes(prodId)) appState.pm_c.push(prodId);
  } else {
    // Add to PM Modus C or AM
    if (appState.tab === "am") {
      if (!appState.am.includes(prodId)) appState.am.push(prodId);
    } else {
      if (!appState.pm_c.includes(prodId)) appState.pm_c.push(prodId);
    }
  }
  appState.am = sortRoutine(appState.am, true);
  appState.pm_a = sortRoutine(appState.pm_a, false);
  appState.pm_b = sortRoutine(appState.pm_b, false);
  appState.pm_c = sortRoutine(appState.pm_c, false);
  saveState();
  closeModal();
  renderMain();
}

function openProductDetail(prodId) {
  const p = DB[prodId];
  if (!p) return;

  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">${p.schiene} · ${p.kat}</div>
    <h2>${p.brand} ${p.name}</h2>
    <p style="font-size:0.9rem;color:var(--muted);margin-top:-0.2rem">Wirkstoff: <strong>${p.wirk}</strong> · Erhältlich: ${p.store || "DACH-Handel"}</p>

    ${p.truth ? `
      <div class="pharma-box">
        <div class="pharma-title">🔬 Evidenz & Pharmazie-Check</div>
        <div class="pharma-text">${p.truth}</div>
      </div>
    ` : ""}

    ${p.notes ? `
      <div class="pharma-box" style="background:#f7f6f2;border-color:#ded8cd">
        <div class="pharma-title" style="color:#6d5b45">📋 Produkt- & Nachweisnotizen</div>
        <div class="pharma-text" style="font-size:0.84rem">${p.notes}</div>
      </div>
    ` : ""}

    <div class="alt-title">Produktdetails & Kriterien-Prüfung</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1rem">
      <span class="tag ${p.rx ? 'rx' : ''}">${p.rx ? 'Verschreibungspflichtig (Rx)' : 'Kosmetik frei'}</span>
      ${p.nc === true ? '<span class="tag nc">🛡️ Nicht-Komedogen Claim</span>' : '<span class="tag" style="background:#f9fafb;color:#6b7280" title="Kein offizieller Nicht-komedogen-Claim deklariert">ℹ️ NC offen</span>'}
      ${p.ff === true ? '<span class="tag ff">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn">⚠️ Enthält Parfüm/Duftstoffe</span>' : '<span class="tag" style="background:#f9fafb;color:#6b7280" title="Keine verifizierten Angaben zur Parfümierung">ℹ️ Parfümierung offen</span>')}
      ${p.cf === true ? `<span class="tag cf">🐰 Cruelty-Free (${p.cf_basis || 'CFI / Leaping Bunny'})</span>` : '<span class="tag" style="background:#f9fafb;color:#6b7280" title="Standard EU-Tierversuchsverbot erfüllt, kein gesondertes Verbandssiegel">ℹ️ CF offen / EU-Standard</span>'}
      ${p.no_white_cast === true ? '<span class="tag soc-nwc">✨ Zero White-Cast (kein Kreideschleier)</span>' : (p.no_white_cast === false ? '<span class="tag warn">⚠️ Weißelt / White-Cast</span>' : '')}
      ${p.iron_ox === true ? '<span class="tag soc-iron">🛡️ Eisenoxide (Schutz vor sichtbarem Licht / HEV)</span>' : ''}
      ${p.pih === true ? '<span class="tag soc-pih">🎯 PIH / Melanin-Regulierung</span>' : ''}
      ${p.ean ? `<span class="tag ean">EAN: ${p.ean}</span>` : ''}
      <span class="tag">PAO: 12 Monate</span>
      <span class="tag">EU-Konform</span>
    </div>

    ${p.url ? `
      <div style="margin-bottom:1rem">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="color:var(--ink);font-size:0.82rem;text-decoration:underline">
          ↗ Offizielle Produktseite / Quelle ansehen
        </a>
      </div>
    ` : ""}

    <button class="ghost-btn" style="color:var(--no);border-color:#ecc" onclick="removeProduct('${p.id}', '${appState.tab}'); closeModal()">Aus dieser Routine entfernen</button>
    <button class="ghost-btn" onclick="closeModal()">Schließen</button>
  `);
}



// Dedicated Full-Screen View for Scan / Verdict
function renderScanScreen(container) {
  if (!container) container = document.getElementById("appContent");
  if (!container) return;

  const activeP = getActiveProfile();

  container.innerHTML = `
    <div class="scan-screen-box">
      <div class="scan-screen-kicker">Scan &amp; Produktsuche</div>
      <h2>Produkt auf Verträglichkeit prüfen</h2>
      <p class="scan-screen-lead">
        Prüfe Produkte vor dem Kauf oder aus dem Bad auf Reizstoffe, Duftstoffe und Leitlinien-Eignung für <strong>${escapeHtml(activeP.name)}</strong>.
      </p>

      <div class="scan-cta-row">
        <button type="button" class="primary" onclick="openScanModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/><line x1="7" y1="12" x2="17" y2="12"/></svg>
          Kamera-Scanner starten
        </button>
        <button type="button" class="ghost-btn" onclick="openActiveProfileAddModal()">
          🔎 Katalog &amp; dm Suche
        </button>
      </div>

      <div class="scan-ean-box">
        <label for="scanScreenEanInput">EAN-Barcode manuell eingeben</label>
        <div class="scan-ean-row">
          <input type="text" id="scanScreenEanInput" placeholder="z. B. 4058172936746..." inputmode="numeric" autocomplete="off" onkeydown="if(event.key==='Enter'){ handleScanScreenEan(); }">
          <button type="button" class="primary" onclick="handleScanScreenEan()">Prüfen →</button>
        </div>
      </div>

      <div class="scan-inci-link">
        <button type="button" class="btn-text" onclick="openCustomProductModal()">
          ✏️ Eigene INCI-Liste manuell einfügen &amp; analysieren
        </button>
      </div>
    </div>
  `;
}

function handleScanScreenEan() {
  const inp = document.getElementById("scanScreenEanInput");
  if (!inp || !inp.value.trim()) return;
  handleScannedBarcode(inp.value.trim());
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}