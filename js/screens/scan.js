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
  let catalogOnInput = null;

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
              <span style="color:#16a34a;font-weight:700">${(typeof formatLivePrice==="function"?escapeHtml(formatLivePrice(p.price)||"dm"):(p.price&&typeof p.price==="object"?escapeHtml(String(p.price.formattedValue||"dm")):escapeHtml(p.price||"dm")))}</span>
              ${p.ff === true ? ' · <span style="color:#16a34a;font-weight:600">🌸 Parfümfrei</span>' : (p.ff === false ? ' · <span style="color:#d97706">⚠️ Parfümiert</span>' : '')}
              · ${typeof liveDmHonestyBadgeHtml==="function" ? liveDmHonestyBadgeHtml() : '<span style="color:#991b1b;font-weight:600">Live dm</span>'}
            </div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0" onclick="event.stopPropagation()">
          ${p.url ? `<a class="btn-text" style="background:#fff7ed;color:#9a3412;padding:6px 10px;border-radius:6px;font-size:0.76rem;font-weight:700;flex-shrink:0;text-decoration:none" href="${p.url}" target="_blank" rel="noopener">Shop ↗</a>` : ''}
          <button type="button" class="btn-text" style="background:var(--ok);color:#F7F4D5;padding:6px 10px;border-radius:6px;font-size:0.76rem;font-weight:700;flex-shrink:0" onclick="adoptDmProductToSlot('${p.id}', 'pm')">+ Schrank</button>
        </div>
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
      const inp = document.getElementById(inputId);
      if (on) {
        runDm(inp ? inp.value : "");
      } else if (inp) {
        // Live-Modus aus: Katalog mit aktuellem Suchtext neu filtern
        if (typeof catalogOnInput === "function") catalogOnInput({ target: inp });
        else if (typeof window._refreshOpenCountryFilteredList === "function") window._refreshOpenCountryFilteredList();
      }
    }
    window._profileDmLiveMode = !!on;
  }

  const inp = document.getElementById(inputId);
  if (inp) {
    catalogOnInput = typeof inp.oninput === "function" ? inp.oninput : null;
    inp.oninput = (e) => {
      if (window._profileDmLiveMode) {
        clearTimeout(dmTimer);
        dmTimer = setTimeout(() => runDm(e.target.value), 350);
      } else if (typeof catalogOnInput === "function") {
        catalogOnInput(e);
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

        ${(() => {
          const cAnalysis = typeof analyzeInciComedogenicity === "function" ? analyzeInciComedogenicity(p) : null;
          if (!cAnalysis) return '';
          return `
            <div style="padding:8px 10px;border-radius:8px;margin-top:6px;background:${cAnalysis.badgeColor};border:1px solid ${cAnalysis.borderColor}">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-weight:700;font-size:0.84rem;color:${cAnalysis.textColor}">
                  🛡️ Komedogenitäts-Check: Score ${cAnalysis.maxScore}/5
                </span>
                <span style="font-size:0.7rem;font-weight:700;padding:1px 6px;border-radius:4px;background:#fff;border:1px solid ${cAnalysis.borderColor};color:${cAnalysis.textColor}">
                  ${cAnalysis.maxScore <= 1 ? 'Porenfreundlich' : 'Score ' + cAnalysis.maxScore + '/5'}
                </span>
              </div>
              <div style="font-size:0.74rem;color:${cAnalysis.textColor};margin-top:3px;line-height:1.3">
                ${cAnalysis.summary}
              </div>
            </div>
          `;
        })()}

        ${(p.ff == null || p.nc == null || p.cf == null || p._liveSource || (p.id && /^(dm_|mueller_|live_|obf_)/.test(p.id))) ? `
          <div style="font-size:0.78rem;color:#78350f;background:#fffbeb;border:1px solid #fde68a;padding:8px 10px;border-radius:8px;margin-top:8px;line-height:1.35">
            <strong>ℹ️ Hinweis zum Online-Katalog:</strong> Zu diesem Produkt liegen keine Labor- oder Zertifikatsdaten vor (Komedogenität, Duftstoffe oder Cruelty-Free offen). Bei unreiner Haut empfiehlt sich ein Blick auf die gedruckte INCI-Liste.
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

      ${(() => {
        const babyCat = inBaby ? "baby" : "child";
        const similarProds = typeof findSimilarProducts === "function" ? findSimilarProducts(p.id, { limit: 3, category: babyCat }) : [];
        if (!similarProds || similarProds.length === 0) return '';
        return `
          <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:0.85rem;margin:0.8rem 0">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div style="font-weight:700;font-size:0.86rem;color:#1e293b;display:flex;align-items:center;gap:6px">
                <span>✨ Ähnliche ${inBaby ? 'Baby' : 'Kinder'}-Alternativen</span>
                <span style="font-size:0.7rem;background:#dbeafe;color:#1d4ed8;padding:2px 6px;border-radius:4px;font-weight:700">${similarProds.length} Alternativen</span>
              </div>
            </div>
            <div style="font-size:0.76rem;color:var(--muted);margin-bottom:8px">
              Pädiatrisch geprüfte Alternativen mit ähnlichem Schutz- &amp; Wirkstoff-Profil:
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${similarProds.map(s => {
                const cand = s.candidate;
                const comp = s.comp;
                return `
                  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px">
                    <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;cursor:pointer" onclick="openProductComparisonModal('${p.id}', '${cand.id}')">
                      ${cand.img ? `<img src="${escapeHtml(cand.img)}" alt="${escapeHtml(cand.name)}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid #f1f5f9;flex-shrink:0" onerror="this.style.display='none'">` : '<div style="width:36px;height:36px;border-radius:6px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">👶</div>'}
                      <div style="min-width:0;flex:1">
                        <div style="font-weight:700;font-size:0.82rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                          ${escapeHtml(cand.brand || '')} ${escapeHtml(cand.name || '')}
                        </div>
                        <div style="font-size:0.72rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                          <span style="font-weight:700;color:#1d4ed8">✨ ${comp.score}% Match</span>
                          ${comp.sharedActives.length > 0 ? ` · ${escapeHtml(comp.sharedActives.map(a => a.label.split('(')[0].trim()).slice(0, 2).join(', '))}` : ''}
                        </div>
                      </div>
                    </div>
                    <button type="button" class="btn-text" style="font-size:0.72rem;padding:4px 8px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:6px;font-weight:700;flex-shrink:0" onclick="openProductComparisonModal('${p.id}', '${cand.id}')">
                      ⚖️ Vergleichen
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      })()}

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

        <!-- Evidenzbasierte Komedogenitäts-Prüfung (Skala 0-5) -->
        ${(() => {
          const cAnalysis = typeof analyzeInciComedogenicity === "function" ? analyzeInciComedogenicity(p) : null;
          if (!cAnalysis) return '';
          return `
            <div style="padding:8px 10px;border-radius:8px;margin-bottom:6px;background:${cAnalysis.badgeColor};border:1px solid ${cAnalysis.borderColor}">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div style="font-weight:700;font-size:0.84rem;color:${cAnalysis.textColor}">
                  🛡️ Komedogenitäts-Score: ${cAnalysis.maxScore}/5
                </div>
                <span style="font-size:0.7rem;background:#fff;color:${cAnalysis.textColor};border:1px solid ${cAnalysis.borderColor};padding:1px 6px;border-radius:4px;font-weight:700">
                  ${cAnalysis.maxScore <= 1 ? '🟢 Porenfreundlich' : (cAnalysis.maxScore === 2 ? '🟡 Gering' : (cAnalysis.maxScore === 3 ? '🟠 Mäßig' : '🔴 Stark'))}
                </span>
              </div>
              <div style="font-size:0.75rem;color:${cAnalysis.textColor};margin-top:3px;line-height:1.35">
                ${cAnalysis.summary}
              </div>
              ${cAnalysis.flagged.length > 0 ? `
                <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">
                  ${cAnalysis.flagged.map(f => `
                    <span style="font-size:0.68rem;padding:1px 5px;border-radius:4px;background:#fff;border:1px solid ${cAnalysis.borderColor};color:${f.score >= 4 ? '#991b1b' : (f.score === 3 ? '#9a3412' : '#166534')};font-weight:600" title="${escapeHtml(f.note)}">
                      ${escapeHtml(f.name)} (${f.score}/5)
                    </span>
                  `).join('')}
                </div>
              ` : ''}
              <div style="font-size:0.7rem;color:var(--muted);margin-top:5px;line-height:1.25">
                <em>EU-Hinweis:</em> 'Nicht komedogen' ist kein geschützter EU-Begriff. Der Score 0–5 basiert auf dermatologischer INCI-Evidenz (Fulton/Kligman).
              </div>
            </div>
          `;
        })()}

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
        ${(p.ff == null || p.nc == null || p.cf == null || p._liveSource || (p.id && /^(dm_|mueller_|live_|obf_)/.test(p.id))) ? `
          <div style="font-size:0.78rem;color:#78350f;background:#fffbeb;border:1px solid #fde68a;padding:8px 10px;border-radius:8px;margin-top:8px;line-height:1.35">
            <strong>ℹ️ Hinweis zum Online-Katalog:</strong> Zu diesem Produkt liegen keine Labor- oder Zertifikatsdaten vor (Komedogenität, Duftstoffe oder Cruelty-Free offen). Bei unreiner Haut empfiehlt sich ein Blick auf die gedruckte INCI-Liste.
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

      ${(() => {
        const similarProds = typeof findSimilarProducts === "function" ? findSimilarProducts(p.id, { limit: 3, category: "teen" }) : [];
        if (!similarProds || similarProds.length === 0) return '';
        return `
          <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:0.85rem;margin:0.8rem 0">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div style="font-weight:700;font-size:0.86rem;color:#1e293b;display:flex;align-items:center;gap:6px">
                <span>✨ Ähnliche Teenie-Alternativen</span>
                <span style="font-size:0.7rem;background:#ccfbf1;color:#0f766e;padding:2px 6px;border-radius:4px;font-weight:700">${similarProds.length} Alternativen</span>
              </div>
            </div>
            <div style="font-size:0.76rem;color:var(--muted);margin-bottom:8px">
              Hautschonende Alternativen für Teenager mit ähnlichem Wirkstoff-Fokus:
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${similarProds.map(s => {
                const cand = s.candidate;
                const comp = s.comp;
                return `
                  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px">
                    <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;cursor:pointer" onclick="openProductComparisonModal('${p.id}', '${cand.id}')">
                      ${cand.img ? `<img src="${escapeHtml(cand.img)}" alt="${escapeHtml(cand.name)}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid #f1f5f9;flex-shrink:0" onerror="this.style.display='none'">` : '<div style="width:36px;height:36px;border-radius:6px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">🧴</div>'}
                      <div style="min-width:0;flex:1">
                        <div style="font-weight:700;font-size:0.82rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                          ${escapeHtml(cand.brand || '')} ${escapeHtml(cand.name || '')}
                        </div>
                        <div style="font-size:0.72rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                          <span style="font-weight:700;color:#0f766e">✨ ${comp.score}% Match</span>
                          ${comp.sharedActives.length > 0 ? ` · ${escapeHtml(comp.sharedActives.map(a => a.label.split('(')[0].trim()).slice(0, 2).join(', '))}` : ''}
                        </div>
                      </div>
                    </div>
                    <button type="button" class="btn-text" style="font-size:0.72rem;padding:4px 8px;background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4;border-radius:6px;font-weight:700;flex-shrink:0" onclick="openProductComparisonModal('${p.id}', '${cand.id}')">
                      ⚖️ Vergleichen
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      })()}

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

      const realProds = liveDmItems.filter(p => !p._deeplinkOnly);
      const deeplinks = liveDmItems.filter(p => p._deeplinkOnly);

      const realHtml = realProds.map((p, idx) => {
        let shopLinkText = "Shop ↗";
        if (p.retailerLabel) {
          shopLinkText = p.retailerLabel + " ↗";
        } else if (p.url) {
          try {
            const u = new URL(p.url, window.location.href);
            shopLinkText = u.hostname.replace(/^www\./, "") + " ↗";
          } catch (e) {
            shopLinkText = (p.store || "Shop") + " ↗";
          }
        }
        return `
          <div class="alt-card" style="padding:0.8rem 0.95rem;border-color:#bbf7d0;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05)" data-testid="live-product-card" data-product-id="${escapeHtml(p.id)}">
            <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0">
              ${p.img ? `<img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}" style="width:54px;height:54px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;background:#fff;flex-shrink:0" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex'">` : ''}
              <div style="width:54px;height:54px;border-radius:8px;background:#f1f5f9;color:#64748b;display:${p.img ? 'none' : 'flex'};align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0">🧴</div>
              <div style="min-width:0;flex:1">
                <div style="font-weight:700;font-size:0.92rem;color:var(--ink);line-height:1.25">
                  <span style="color:#0f172a">${escapeHtml(p.brand)}</span> ${escapeHtml(p.name)}
                </div>
                <div style="font-size:0.76rem;color:var(--muted);margin-top:2px">
                  ${p.price ? `<span style="font-weight:700;color:#16a34a">${(typeof formatLivePrice==="function"?escapeHtml(formatLivePrice(p.price)||""):(typeof p.price==="object"?"":escapeHtml(p.price||"")))}</span> · ` : ''}
                  <span>${escapeHtml(p.wirk || p.store || '')}</span>
                  ${p.ean ? ` · <span style="font-family:monospace;font-size:0.73rem">EAN ${escapeHtml(p.ean)}</span>` : ''}
                  ${p.url ? ` · <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline" onclick="event.stopPropagation()">${escapeHtml(shopLinkText)}</a>` : ''}
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">
                  ${p.ff === true ? '<span class="tag ff" style="font-size:0.65rem;padding:1px 5px">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn" style="font-size:0.65rem;padding:1px 5px">⚠️ Parfümiert</span>' : '<span class="tag" style="background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;font-size:0.65rem;padding:1px 5px">ℹ️ Duftstoffe offen</span>')}
                  ${p.nc === true ? '<span class="tag nc" style="font-size:0.65rem;padding:1px 5px">🛡️ NC</span>' : (p.nc === false ? '<span class="tag warn" style="font-size:0.65rem;padding:1px 5px">⚠️ Komedogen</span>' : '<span class="tag" style="background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;font-size:0.65rem;padding:1px 5px">ℹ️ NC offen</span>')}
                  ${p.cf === true ? '<span class="tag cf" style="font-size:0.65rem;padding:1px 5px">🐰 CF</span>' : (p.cf === false ? '<span class="tag warn" style="font-size:0.65rem;padding:1px 5px">⚠️ Kein CF</span>' : '<span class="tag" style="background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;font-size:0.65rem;padding:1px 5px">ℹ️ CF offen</span>')}
                  ${p.no_white_cast === true ? '<span class="tag soc-nwc" style="font-size:0.65rem;padding:1px 5px">✨ Zero White-Cast</span>' : ''}
                  ${p.iron_ox === true ? '<span class="tag soc-iron" style="font-size:0.65rem;padding:1px 5px">🛡️ Eisenoxide</span>' : ''}
                  ${p.pih === true ? '<span class="tag soc-pih" style="font-size:0.65rem;padding:1px 5px">🎯 PIH</span>' : ''}
                  ${typeof liveDmHonestyBadgeHtml==="function" ? liveDmHonestyBadgeHtml() : '<span class="tag" style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;font-size:0.65rem;padding:1px 5px">Live dm</span>'}
                </div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0" onclick="event.stopPropagation()">
              <div style="display:flex;gap:5px">
                <button type="button" class="btn-text" style="background:#f1f5f9;color:#334155;padding:5px 8px;border-radius:6px;font-size:0.75rem;font-weight:600" onclick="openCompatibilityCheckModal('${escapeHtml(p.id)}', '${appState.tab || 'am'}')">🔍 Prüfen</button>
                ${p.url ? `<a class="btn-text" style="background:#fff7ed;color:#9a3412;padding:5px 8px;border-radius:6px;font-size:0.75rem;font-weight:700;text-decoration:none" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">Shop ↗</a>` : ''}
              </div>
              <div style="display:flex;gap:5px">
                <button type="button" class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 8px;border-radius:6px;font-size:0.75rem;font-weight:600" onclick="adoptDmProductToSlot('${escapeHtml(p.id)}', 'am')">+ Morgen</button>
                <button type="button" class="btn-text" style="background:#f4ece0;color:#5c3e1e;padding:5px 8px;border-radius:6px;font-size:0.75rem;font-weight:600" onclick="adoptDmProductToSlot('${escapeHtml(p.id)}', 'pm')">+ Abend</button>
              </div>
            </div>
          </div>
        `;
      }).join("");

      let deeplinkSectionHtml = "";
      if (deeplinks.length > 0) {
        if (realProds.length > 0) {
          deeplinkSectionHtml = `
            <div style="margin-top:10px;padding:9px 12px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:8px">
              <div style="font-size:0.74rem;font-weight:700;color:#475569;margin-bottom:6px">In Drogerie-Onlineshops weitersuchen:</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${deeplinks.map(dl => `
                  <a href="${escapeHtml(dl.url)}" target="_blank" rel="noopener" class="btn-text" style="background:#fff;border:1px solid #cbd5e1;color:#1e293b;padding:5px 10px;border-radius:6px;font-size:0.76rem;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:4px">
                    🛒 ${escapeHtml(dl.store || dl.retailerLabel || 'Shop')} ↗
                  </a>
                `).join("")}
              </div>
            </div>
          `;
        } else {
          deeplinkSectionHtml = `
            <div style="padding:10px 12px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;margin-bottom:8px;text-align:center">
              <div style="font-weight:600;font-size:0.86rem;color:#9a3412">Kein konkretes Produkt im Sofort-Katalog für „${escapeHtml(searchVal)}“.</div>
              <div style="font-size:0.76rem;color:#7c2d12;margin-top:2px">Direkt in den Drogerie-Onlineshops nachsehen:</div>
            </div>
            ${deeplinks.map(dl => `
              <div class="alt-card" style="padding:0.7rem 0.9rem;border-color:#fed7aa;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:10px">
                <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
                  <div style="width:40px;height:40px;border-radius:8px;background:#ffedd5;color:#c2410c;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">🛒</div>
                  <div style="min-width:0;flex:1">
                    <div style="font-weight:700;font-size:0.86rem;color:var(--ink)">${escapeHtml(dl.name || dl.title)}</div>
                    <div style="font-size:0.74rem;color:var(--muted)">${escapeHtml(dl.store || dl.retailerLabel || 'Onlineshop')}</div>
                  </div>
                </div>
                <div style="flex-shrink:0">
                  <a href="${escapeHtml(dl.url)}" target="_blank" rel="noopener" class="btn-text" style="background:#ea580c;color:#fff;padding:6px 12px;border-radius:6px;font-size:0.76rem;font-weight:700;text-decoration:none;display:inline-block">Im Shop öffnen ↗</a>
                </div>
              </div>
            `).join("")}
          `;
        }
      }

      return realHtml + deeplinkSectionHtml;
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
                🛒 Live im Drogerie-Sortiment nach „${escapeHtml(searchVal)}“ suchen ➔
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
        <div class="alt-card" style="padding:0.75rem 0.9rem;cursor:pointer;display:flex;align-items:center;gap:10px" onclick="openProductDetail('${p.id}')">
          ${p.img ? `<img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;background:#fff;flex-shrink:0" onerror="this.style.display='none'">` : ''}
          <div style="flex:1;min-width:0;margin-right:10px">
            <div style="font-weight:600;font-size:0.9rem">${p.brand} ${p.name}</div>
            <div style="font-size:0.78rem;color:var(--muted)">Wirkstoff: ${p.wirk} · <span style="color:var(--ok)">${p.store || 'DACH'}</span>${p.price ? ` · <span style="font-weight:700;color:#16a34a">${(typeof formatLivePrice==="function"?escapeHtml(formatLivePrice(p.price)||""):(typeof p.price==="object"?"":escapeHtml(p.price||"")))}</span>` : ''}</div>
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
      const cleanDigits = searchVal.trim().replace(/\D/g, "");
      const isEanTyped = cleanDigits.length >= 8 && cleanDigits.length <= 14 && /^\d+$/.test(searchVal.trim());
      if (currentCat !== "dm" && isEanTyped && getFilteredProducts().length === 0) {
        window.setAddCat('dm');
        return;
      }
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

async function handleScannedBarcode(rawEan) {
  const ean = String(rawEan || "").trim();
  if (!ean) return;
  console.log("Barcode gescannt / eingegeben:", ean);

  // 1. Lokaler Match (DB, Registry, Pilot mit 12/13-Digit-Normalisierung)
  const localMatch = (typeof findLocalProductMatch === "function") ? findLocalProductMatch(ean) : null;
  if (localMatch && !localMatch._deeplinkOnly && localMatch.source !== "deeplink") {
    if (typeof openCompatibilityCheckModal === "function") {
      openCompatibilityCheckModal(localMatch);
      return;
    }
  }

  const found = findProductByEan(ean);
  if (found) {
    if (found.type === "adult") {
      showVerdict(found.id);
    } else if (found.type === "teen") {
      openTeenProductDetail(found.id);
    } else if (found.type === "baby") {
      openBabyProductDetail(found.id);
    }
    return;
  }

  // 2. Falls ein Suchfeld im aktuellen Screen/Modal aktiv ist: eintragen
  const input = document.getElementById("scanSearchInput") || document.getElementById("searchProdInput");
  if (input) {
    input.value = ean;
  }

  // 3. Live-EAN Suche mit Status-Modal
  showModalSheet(`
    <div style="text-align:center;padding:1.6rem 0.6rem">
      <div style="font-size:2.6rem;margin-bottom:0.6rem">⏳</div>
      <h3 style="margin:0 0 0.4rem;font-size:1.15rem">EAN ${escapeHtml(ean)} wird gesucht…</h3>
      <p style="color:var(--muted);font-size:0.86rem;max-width:340px;margin:0 auto 1rem;line-height:1.4">
        Prüfe live im Sortiment von <strong>Müller, dm &amp; BIPA</strong> sowie Open Beauty / Food Facts…
      </p>
      <div style="font-size:0.75rem;color:#64748b">Echtzeit-Abfrage läuft…</div>
    </div>
  `);

  try {
    const cc = (typeof getProfileCountry === "function" ? getProfileCountry() : "AT") || "AT";
    const results = (typeof searchLiveProducts === "function") ? await searchLiveProducts(ean, cc) : [];
    const realProd = results.find(p => p && !p._deeplinkOnly && p.source !== "deeplink");

    if (realProd) {
      if (typeof openCompatibilityCheckModal === "function") {
        openCompatibilityCheckModal(realProd);
      } else {
        showVerdict(realProd.id);
      }
    } else {
      // Kein direkter Treffer -> In den Hinzufügen-Modal mit den Drogerie-Onlineshop-Links wechseln
      openAddProductModal("am", "dm");
      const sInp = document.getElementById("searchProdInput");
      if (sInp) {
        sInp.value = ean;
        if (typeof window.setAddCat === "function") {
          window.setAddCat("dm");
        }
      }
    }
  } catch (err) {
    console.error("Fehler bei Barcode-Suche:", err);
    openAddProductModal("am", "dm");
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
    const cc = (typeof getProfileCountry === "function" ? getProfileCountry() : "AT") || "AT";
    const ret = (typeof getLiveRetailerForCountry === "function" ? getLiveRetailerForCountry(cc) : { label: "Müller, dm & BIPA" });
    container.innerHTML = `<div style="font-size:0.8rem;color:#991b1b;padding:8px 0;font-weight:600">⏳ Frage live im Drogerie-Sortiment nach „${escapeHtml(q)}“…</div>`;

    const prods = await searchLiveProducts(q, cc);
    window.currentLiveDmResults = prods;
    window.dmResultsMap = window.dmResultsMap || {};
    prods.forEach(pr => { if (pr && pr.id) window.dmResultsMap[pr.id] = pr; });

    if (prods.length === 0) {
      const errMsg = window.lastDmError || ('Kein Treffer für „' + escapeHtml(q) + '“ gefunden.');
      container.innerHTML = `<div style="font-size:0.8rem;color:var(--muted);padding:6px 0">${errMsg}</div>`;
      return;
    }

    container.innerHTML = prods.slice(0, 6).map((p) => {
      const isDeeplink = p._deeplinkOnly || p.source === "deeplink";
      return `
        <div style="background:#fff;border:1px solid ${isDeeplink ? '#fed7aa' : '#fca5a5'};border-radius:8px;padding:8px 10px;margin-top:6px;display:flex;align-items:center;justify-content:space-between;gap:8px">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;cursor:pointer" onclick="${isDeeplink ? `window.open('${p.url || '#'}', '_blank')` : `openCompatibilityCheckModal(window.dmResultsMap['${p.id}'])`}">
            ${p.img ? `<img src="${p.img}" alt="${escapeHtml(p.name)}" style="width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid #f1f5f9;flex-shrink:0" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('div'),{className:'live-img-fallback',innerText:'🧴',style:'width:38px;height:38px;border-radius:6px;background:#f8fafc;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0'}))">` : `<div style="width:38px;height:38px;border-radius:6px;background:${isDeeplink ? '#fff7ed' : '#fee2e2'};color:${isDeeplink ? '#ea580c' : '#b91c1c'};display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${isDeeplink ? '🛒' : '🧴'}</div>`}
            <div style="min-width:0;flex:1">
              <div style="font-weight:700;font-size:0.84rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(p.brand || '')} ${escapeHtml(p.name || '')}</div>
              <div style="font-size:0.74rem;color:var(--muted)">
                ${p.price ? `<span style="color:#16a34a;font-weight:700">${(typeof formatLivePrice==="function"?escapeHtml(formatLivePrice(p.price)||""):(typeof p.price==="object"?"":escapeHtml(p.price||"")))}</span> · ` : ''}
                ${p.ff === true ? '<span style="color:#16a34a;font-weight:600">🌸 Parfümfrei</span> · ' : (p.ff === false ? '<span style="color:#d97706">⚠️ Parfüm</span> · ' : '')}
                ${p.nc === true ? '<span style="color:#2563eb;font-weight:600">🛡️ NC</span> · ' : ''}
                ${p.cf === true ? '<span style="color:#6b21a8;font-weight:600">🐰 CF</span> · ' : ''}
                <span style="color:#64748b">${escapeHtml(p.retailerLabel || p.store || 'Drogerie')}</span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0">
            ${!isDeeplink ? `
              <button type="button" class="btn-text" style="background:#eaf0f6;color:#204060;padding:5px 8px;border-radius:6px;font-size:0.74rem;font-weight:600" onclick="openCompatibilityCheckModal(window.dmResultsMap['${p.id}'])">🔍 Prüfen</button>
              <button type="button" class="btn-text" style="background:var(--ok);color:#F7F4D5;padding:5px 8px;border-radius:6px;font-size:0.74rem;font-weight:700" onclick="adoptDmProductToSlot('${p.id}', 'am')">+ Morgen</button>
            ` : `
              <a href="${p.url || '#'}" target="_blank" rel="noopener" class="btn-text" style="background:#fff7ed;color:#ea580c;padding:5px 8px;border-radius:6px;font-size:0.74rem;font-weight:700;text-decoration:none">Shop ↗</a>
            `}
          </div>
        </div>
      `;
    }).join("");
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

      <div>
        <label style="font-size:0.78rem;font-weight:700;color:var(--ink)">Inhaltsstoffliste (INCI) für evidenzbasierte Prüfung (optional)</label>
        <textarea id="custInci" style="width:100%;min-height:75px;padding:0.6rem;border:1px solid var(--line);border-radius:10px;font-size:0.8rem;font-family:monospace;margin-top:3px;box-sizing:border-box" placeholder="z. B. Aqua, Glycerin, Isopropyl Myristate, Cocos Nucifera Oil, Niacinamide..." oninput="window.onCustInciInput(this.value)"></textarea>
        <div id="custInciAnalysisBox" style="margin-top:4px"></div>
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

  window.onCustInciInput = (val) => {
    const box = document.getElementById("custInciAnalysisBox");
    const ncCheckbox = document.getElementById("custNc");
    if (!box) return;
    if (!val || !val.trim()) {
      box.innerHTML = "";
      return;
    }
    const cAnalysis = typeof analyzeInciComedogenicity === "function" ? analyzeInciComedogenicity(val) : null;
    if (!cAnalysis) return;

    if (ncCheckbox) {
      if (cAnalysis.maxScore <= 1) {
        ncCheckbox.checked = true;
      } else if (cAnalysis.maxScore >= 3) {
        ncCheckbox.checked = false;
      }
    }

    box.innerHTML = `
      <div style="background:${cAnalysis.badgeColor};border:1px solid ${cAnalysis.borderColor};border-radius:8px;padding:6px 10px;font-size:0.78rem">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong style="color:${cAnalysis.textColor}">🛡️ Live-INCI Check: Score ${cAnalysis.maxScore}/5</strong>
          <span style="font-size:0.68rem;background:#fff;color:${cAnalysis.textColor};padding:1px 5px;border-radius:4px;font-weight:700">
            ${cAnalysis.maxScore <= 1 ? 'Porenfreundlich' : (cAnalysis.maxScore === 2 ? 'Leicht' : 'Komedogen')}
          </span>
        </div>
        <div style="color:${cAnalysis.textColor};margin-top:2px;font-size:0.74rem">${cAnalysis.summary}</div>
      </div>
    `;
  };
}

function saveCustomProductAndCheck() {
  const brand = (document.getElementById("custBrand")?.value || "Individuell").trim();
  const name = (document.getElementById("custName")?.value || "Gesichtspflege").trim();
  const kat = document.getElementById("custKat")?.value || "creme";
  const ean = (document.getElementById("custEan")?.value || "").trim();
  const inci = (document.getElementById("custInci")?.value || "").trim();
  const ff = document.getElementById("custFf")?.checked ? true : null;
  const rawNc = document.getElementById("custNc")?.checked ? true : null;
  const cf = document.getElementById("custCf")?.checked ? true : null;

  const cAnalysis = inci && typeof analyzeInciComedogenicity === "function" ? analyzeInciComedogenicity(inci) : null;
  const nc = cAnalysis ? (cAnalysis.maxScore <= 1) : rawNc;

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
    inci: inci || undefined,
    comedogenicScore: cAnalysis ? cAnalysis.maxScore : (nc ? 0 : 2),
    store: "Eigene Erfassung · EU-Handel",
    notes: isCf ? "Marke erfüllt CFI / Leaping Bunny Kriterien." : "Individuell über den Scanner erfasst."
  };
  if (typeof enrichProductClasses === "function") enrichProductClasses(DB[id]);
  if (!appState.customProducts) appState.customProducts = {};
  appState.customProducts[id] = DB[id];

  showVerdict(id);
}

function showVerdict(prodId) {
  const prod = (typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(prodId) : null) || (typeof DB !== "undefined" ? DB[prodId] : null);
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
  const p = (typeof resolveProfileCabinetProduct === "function" ? resolveProfileCabinetProduct(prodId) : null)
    || (typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(prodId) : null)
    || (typeof DB !== "undefined" ? DB[prodId] : null);
  if (!p) return;

  const activeTab = (typeof appState !== "undefined" && appState.tab) || "am";
  const evalRes = typeof evaluateProductCompatibility === "function" ? evaluateProductCompatibility(p, activeTab) : null;
  const isLive = !!(p._liveSource || (p.source && /live|mcp|obf|web/i.test(p.source)) || (p.id && /^(dm_|mueller_|live_|obf_)/.test(p.id)));

  showModalSheet(`
    <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:0.5rem">
      ${p.img ? `<img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}" style="width:68px;height:68px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;background:#fff;flex-shrink:0" onerror="this.style.display='none'">` : ''}
      <div style="flex:1;min-width:0">
        <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">${p.schiene || 'Produkt'} · ${p.kat}</div>
        <h2 style="margin:2px 0 0.25rem">${p.brand} ${p.name}</h2>
        <p style="font-size:0.86rem;color:var(--muted);margin:0">Wirkstoff: <strong>${p.wirk}</strong> · Erhältlich: ${p.store || "DACH-Handel"}${p.price ? ` · <span style="font-weight:700;color:#16a34a">${(typeof formatLivePrice==="function"?escapeHtml(formatLivePrice(p.price)||""):(typeof p.price==="object"?"":escapeHtml(p.price||"")))}</span>` : ''}</p>
      </div>
    </div>

    ${evalRes ? `
      <div class="pharma-box" style="background:#f8fafc;border:1px solid #cbd5e1;margin:0.8rem 0">
        <div class="pharma-title" style="display:flex;justify-content:space-between;align-items:center;color:#1e293b">
          <span>🔬 Gegenprüfung: Routine- &amp; Hauttyp-Check</span>
          ${evalRes.verdict === 'passt' 
            ? '<span style="font-size:0.72rem;background:#dcfce7;color:#166534;padding:2px 7px;border-radius:5px;font-weight:700">🟢 Passt</span>'
            : (evalRes.verdict === 'eher_nicht'
                ? '<span style="font-size:0.72rem;background:#fef3c7;color:#92400e;padding:2px 7px;border-radius:5px;font-weight:700">🟡 Eingeschränkt</span>'
                : '<span style="font-size:0.72rem;background:#fee2e2;color:#991b1b;padding:2px 7px;border-radius:5px;font-weight:700">🔴 Konflikt</span>')}
        </div>
        <div style="font-size:0.82rem;color:var(--ink);display:flex;flex-direction:column;gap:6px;margin-top:6px">
          <div><strong>Hauttyp (${evalRes.skinTypeFit.skinSub || evalRes.skinTypeFit.profileName}):</strong></div>
          ${evalRes.skinTypeFit.points.map(pt => `<div style="font-size:0.8rem;line-height:1.35">${pt}</div>`).join('')}
          <div style="margin-top:4px"><strong>Routine (${activeTab === 'am' ? '☀️ Morgen' : '🌙 Abend'}):</strong></div>
          ${evalRes.routineFit.points.map(pt => `<div style="font-size:0.8rem;line-height:1.35">${pt}</div>`).join('')}
          ${(evalRes.missingData.hasMissing || isLive) ? `
            <div style="margin-top:6px;padding:6px 8px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;font-size:0.78rem;color:#78350f;line-height:1.35">
              <strong>ℹ️ Hinweis zum Online-Katalog:</strong> Zu diesem Produkt liegen beim Händler keine verifizierten Labor-/Zertifikatsdaten zu Cruelty-Free, Nicht-Komedogenität oder Duftstoffen vor. Bitte vor Gebrauch auf der Packung gegenprüfen.
            </div>
          ` : ''}
        </div>
      </div>
    ` : ""}

    ${(() => {
      const cAnalysis = typeof analyzeInciComedogenicity === "function" ? analyzeInciComedogenicity(p) : null;
      if (!cAnalysis) return '';
      return `
        <div style="background:${cAnalysis.badgeColor};border:1px solid ${cAnalysis.borderColor};border-radius:10px;padding:0.85rem;margin:0.8rem 0">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:700;font-size:0.88rem;color:${cAnalysis.textColor};display:flex;align-items:center;gap:6px">
              <span>🛡️ Komedogenitäts-Score: <strong>${cAnalysis.maxScore}/5</strong></span>
            </div>
            <span style="font-size:0.72rem;background:#fff;color:${cAnalysis.textColor};border:1px solid ${cAnalysis.borderColor};padding:2px 7px;border-radius:6px;font-weight:700">
              ${cAnalysis.maxScore <= 1 ? '🟢 Porenfreundlich' : (cAnalysis.maxScore === 2 ? '🟡 Gering' : (cAnalysis.maxScore === 3 ? '🟠 Mäßig komedogen' : '🔴 Stark komedogen'))}
            </span>
          </div>
          <div style="font-size:0.8rem;color:${cAnalysis.textColor};margin-top:4px;line-height:1.35">
            ${cAnalysis.summary}
          </div>
          ${cAnalysis.flagged.length > 0 ? `
            <div style="margin-top:8px;padding-top:6px;border-top:1px dashed ${cAnalysis.borderColor};display:flex;flex-wrap:wrap;gap:4px">
              ${cAnalysis.flagged.map(f => `
                <span style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:#fff;border:1px solid ${cAnalysis.borderColor};color:${f.score >= 4 ? '#991b1b' : (f.score === 3 ? '#9a3412' : (f.score === 2 ? '#854d0e' : '#166534'))};font-weight:600" title="${escapeHtml(f.note)}">
                  ${escapeHtml(f.name)} (${f.score}/5)
                </span>
              `).join('')}
            </div>
          ` : ''}
          <div style="font-size:0.72rem;color:var(--muted);margin-top:6px;line-height:1.3">
            <em>EU-Transparenz-Hinweis (VO 1223/2009):</em> Der Claim „nicht komedogen“ ist in Europa kosmetikrechtlich nicht geschützt. Kosmetikschrank prüft direkt die evidenzbasierte INCI-Zusammensetzung (Skala 0–5 nach Fulton/Kligman).
          </div>
        </div>
      `;
    })()}

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
      ${p.nc === true ? '<span class="tag nc">🛡️ Nicht-Komedogen Claim</span>' : (p.nc === false ? '<span class="tag warn">⚠️ Nicht als komedogenarm ausgewiesen</span>' : '<span class="tag" style="background:#fff7ed;color:#9a3412;border:1px solid #fed7aa" title="Kein offizieller Nicht-komedogen-Claim im Katalog deklariert">ℹ️ NC offen</span>')}
      ${p.ff === true ? '<span class="tag ff">🌸 Parfümfrei</span>' : (p.ff === false ? '<span class="tag warn">⚠️ Enthält Parfüm/Duftstoffe</span>' : '<span class="tag" style="background:#fff7ed;color:#9a3412;border:1px solid #fed7aa" title="Keine verifizierten Angaben zur Parfümierung im Online-Katalog hinterlegt">ℹ️ Duftstoffe offen</span>')}
      ${p.cf === true ? `<span class="tag cf">🐰 Cruelty-Free (${p.cf_basis || 'CFI / Leaping Bunny'})</span>` : (p.cf === false ? '<span class="tag warn">⚠️ Kein CF-Nachweis</span>' : '<span class="tag" style="background:#f8fafc;color:#64748b;border:1px solid #e2e8f0" title="Standard EU-Tierversuchsverbot erfüllt, kein gesondertes Verbandssiegel">ℹ️ CF offen / EU-Standard</span>')}
      ${isLive ? '<span class="tag" style="background:#fef3c7;color:#92400e;border:1px solid #fde68a;font-weight:700">⚠️ Live-Katalog</span>' : ''}
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

    ${(() => {
      const similarProds = typeof findSimilarProducts === "function" ? findSimilarProducts(p.id, { limit: 3 }) : [];
      if (!similarProds || similarProds.length === 0) return '';
      return `
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:0.85rem;margin:0.8rem 0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <div style="font-weight:700;font-size:0.88rem;color:#1e293b;display:flex;align-items:center;gap:6px">
              <span>✨ Ähnliche Produkte &amp; Dupe-Vergleich</span>
              <span style="font-size:0.7rem;background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:4px;font-weight:700">${similarProds.length} Alternativen</span>
            </div>
          </div>
          <div style="font-size:0.78rem;color:var(--muted);margin-bottom:8px">
            Ähnliche Inhaltsstoffe &amp; vergleichbare Wirkung. Wähle eine Alternative für den Direkt-Vergleich:
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${similarProds.map(s => {
              const cand = s.candidate;
              const comp = s.comp;
              const isHigh = comp.score >= 80;
              return `
                <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px">
                  <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;cursor:pointer" onclick="openProductComparisonModal('${p.id}', '${cand.id}')">
                    ${cand.img ? `<img src="${escapeHtml(cand.img)}" alt="${escapeHtml(cand.name)}" style="width:38px;height:38px;object-fit:cover;border-radius:6px;border:1px solid #f1f5f9;flex-shrink:0" onerror="this.style.display='none'">` : '<div style="width:38px;height:38px;border-radius:6px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">🧴</div>'}
                    <div style="min-width:0;flex:1">
                      <div style="font-weight:700;font-size:0.84rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                        ${escapeHtml(cand.brand || '')} ${escapeHtml(cand.name || '')}
                      </div>
                      <div style="font-size:0.74rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                        <span style="font-weight:700;color:${isHigh ? '#059669' : '#0284c7'}">✨ ${comp.score}% Match</span>
                        ${comp.sharedActives.length > 0 ? ` · <span style="color:#475569">${escapeHtml(comp.sharedActives.map(a => a.label.split('(')[0].trim()).slice(0, 2).join(', '))}</span>` : ''}
                        ${comp.priceB ? ` · <strong style="color:#16a34a">${escapeHtml(comp.priceB)}</strong>` : ''}
                      </div>
                    </div>
                  </div>
                  <button type="button" class="btn-text" style="font-size:0.74rem;padding:4px 8px;background:#f0f9ff;color:#0284c7;border:1px solid #bae6fd;border-radius:6px;font-weight:700;flex-shrink:0" onclick="openProductComparisonModal('${p.id}', '${cand.id}')">
                    ⚖️ Vergleichen
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    })()}

    <button class="ghost-btn" style="color:var(--no);border-color:#ecc" onclick="removeProduct('${p.id}', '${appState.tab}'); closeModal()">Aus dieser Routine entfernen</button>
    <button class="ghost-btn" onclick="closeModal()">Schließen</button>
  `);
}

function openProductComparisonModal(originalId, candidateId) {
  const prodA = (typeof resolveProfileCabinetProduct === "function" ? resolveProfileCabinetProduct(originalId) : null)
    || (typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(originalId) : null)
    || (typeof DB !== "undefined" ? DB[originalId] : null)
    || (typeof EU_FLAG_CATALOG !== "undefined" ? EU_FLAG_CATALOG[originalId] : null)
    || (typeof TEEN_DB !== "undefined" ? TEEN_DB[originalId] : null)
    || (typeof BABY_DB !== "undefined" ? BABY_DB[originalId] : null);

  if (!prodA) return;

  const activeP = typeof getActiveProfile === "function" ? getActiveProfile() : { category: "adult" };
  const cat = activeP.category || "adult";
  const similarList = typeof findSimilarProducts === "function" ? findSimilarProducts(prodA.id, { limit: 5, category: cat }) : [];

  let chosenCandidateId = candidateId;
  if (!chosenCandidateId && similarList.length > 0) {
    chosenCandidateId = similarList[0].candidate.id;
  }

  const prodB = (typeof resolveProfileCabinetProduct === "function" ? resolveProfileCabinetProduct(chosenCandidateId) : null)
    || (typeof resolveCabinetProduct === "function" ? resolveCabinetProduct(chosenCandidateId) : null)
    || (typeof DB !== "undefined" ? DB[chosenCandidateId] : null)
    || (typeof EU_FLAG_CATALOG !== "undefined" ? EU_FLAG_CATALOG[chosenCandidateId] : null)
    || (typeof TEEN_DB !== "undefined" ? TEEN_DB[chosenCandidateId] : null)
    || (typeof BABY_DB !== "undefined" ? BABY_DB[chosenCandidateId] : null);

  if (!prodB) {
    showModalSheet(`
      <div style="padding:1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
          <h3 style="margin:0">✨ Keine Alternativen gefunden</h3>
          <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted)">✕</button>
        </div>
        <p style="color:var(--muted);font-size:0.86rem;line-height:1.4">Für <strong>${escapeHtml(prodA.brand || '')} ${escapeHtml(prodA.name || '')}</strong> liegen im aktuellen Katalog derzeit keine ähnlich formulierten Alternativen vor.</p>
        <button type="button" class="ghost-btn" onclick="${cat === 'teen' ? `openTeenProductDetail('${prodA.id}')` : (cat === 'baby' || cat === 'child' ? `openBabyProductDetail('${prodA.id}')` : `openProductDetail('${prodA.id}')`)}">➔ Zurück zu Produktdetails</button>
      </div>
    `);
    return;
  }

  const comp = typeof compareTwoProducts === "function" ? compareTwoProducts(prodA, prodB) : null;
  if (!comp) return;

  // Render candidate selection pills
  const candidatePillsHtml = similarList.length > 1 ? `
    <div style="margin:0.5rem 0 0.85rem;display:flex;gap:6px;overflow-x:auto;padding-bottom:4px">
      ${similarList.map((s, idx) => {
        const c = s.candidate;
        const isSelected = c.id === prodB.id;
        return `
          <button type="button" class="btn-text" style="padding:4px 9px;border-radius:18px;font-size:0.74rem;white-space:nowrap;cursor:pointer;background:${isSelected ? '#0284c7' : '#f1f5f9'};color:${isSelected ? '#fff' : '#334155'};border:1px solid ${isSelected ? '#0284c7' : '#cbd5e1'};font-weight:${isSelected ? '700' : '600'}" onclick="openProductComparisonModal('${prodA.id}', '${c.id}')">
            ${idx + 1}. ${escapeHtml(c.brand || '')} (${s.score}%)
          </button>
        `;
      }).join('')}
    </div>
  ` : '';

  const isHighMatch = comp.score >= 80;
  const matchColor = isHighMatch ? '#059669' : (comp.score >= 65 ? '#0284c7' : '#d97706');
  const matchBg = isHighMatch ? '#ecfdf5' : (comp.score >= 65 ? '#f0f9ff' : '#fffbeb');
  const matchBorder = isHighMatch ? '#a7f3d0' : (comp.score >= 65 ? '#bae6fd' : '#fde68a');

  // Shared actives badges
  const sharedActivesHtml = comp.sharedActives.length > 0
    ? comp.sharedActives.map(a => `<span class="tag" style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;font-weight:700">✅ ${escapeHtml(a.label)}</span>`).join(' ')
    : `<span style="font-size:0.78rem;color:#64748b">Keine direkten Namensüberschneidungen bei den Hauptwirkstoffen (vergleichbare Pflegebasis).</span>`;

  // Only in A / Only in B
  const diffAHtml = comp.onlyInA.length > 0
    ? `<div style="font-size:0.78rem;color:#475569;margin-top:4px"><strong>${escapeHtml(prodA.brand)} enthält speziell:</strong> ${comp.onlyInA.map(a => a.label.split('(')[0].trim()).join(', ')}</div>`
    : '';
  const diffBHtml = comp.onlyInB.length > 0
    ? `<div style="font-size:0.78rem;color:#475569;margin-top:4px"><strong>${escapeHtml(prodB.brand)} enthält zusätzlich:</strong> ${comp.onlyInB.map(b => b.label.split('(')[0].trim()).join(', ')}</div>`
    : '';

  // Shared effects
  const sharedEffectsHtml = comp.sharedEffects.length > 0
    ? comp.sharedEffects.map(e => `<span class="tag" style="background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;font-size:0.74rem">${escapeHtml(e.label)}</span>`).join(' ')
    : `<span style="font-size:0.78rem;color:#64748b">Vergleichbare Hautpflege &amp; Verträglichkeit.</span>`;

  const modalHTML = `
    <div style="padding:0.2rem 0">
      <!-- Title & Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.3rem">
        <div style="font-size:0.74rem;text-transform:uppercase;color:var(--muted);font-weight:700">⚖️ Dupe- &amp; Wirkstoff-Vergleich</div>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>
      <h2 style="margin:2px 0 0.35rem;font-size:1.25rem">Produkt-Vergleich &amp; Alternativen</h2>
      <p style="font-size:0.82rem;color:var(--muted);margin:0 0 0.4rem">
        Gegenüberstellung nach Inhaltsstoffen, Wirkung, Hautverträglichkeit &amp; Sparpotenzial.
      </p>

      ${candidatePillsHtml}

      <!-- Match Highlight Banner -->
      <div style="background:${matchBg};border:1px solid ${matchBorder};border-radius:10px;padding:0.75rem 0.95rem;margin-bottom:0.85rem">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
          <div style="font-weight:800;font-size:1.05rem;color:${matchColor}">
            ✨ ${comp.score}% Übereinstimmung
          </div>
          <span style="font-size:0.72rem;background:#fff;color:${matchColor};padding:2px 8px;border-radius:6px;border:1px solid ${matchBorder};font-weight:700">
            ${comp.tier}
          </span>
        </div>
        <div style="font-size:0.82rem;color:var(--ink);margin-top:5px;line-height:1.4">
          ${escapeHtml(comp.verdictSummary)}
        </div>
      </div>

      <!-- Side-by-Side Product Cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:0.9rem">
        <!-- Original Product Card -->
        <div style="background:#fff;border:2px solid #cbd5e1;border-radius:10px;padding:0.75rem;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="font-size:0.68rem;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:4px">🏠 Im Schrank (Original)</div>
            ${prodA.img ? `<img src="${escapeHtml(prodA.img)}" alt="${escapeHtml(prodA.name)}" style="width:100%;height:75px;object-fit:cover;border-radius:6px;margin-bottom:6px;border:1px solid #f1f5f9" onerror="this.style.display='none'">` : ''}
            <div style="font-weight:700;font-size:0.84rem;color:var(--ink);line-height:1.25;margin-bottom:2px">${escapeHtml(prodA.brand || '')}</div>
            <div style="font-size:0.76rem;color:var(--ink);line-height:1.3;margin-bottom:6px">${escapeHtml(prodA.name || '')}</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#16a34a;font-weight:700;margin-bottom:3px">${escapeHtml(comp.priceA || 'Preis n/a')}</div>
            <div style="font-size:0.7rem;color:var(--muted);margin-bottom:4px">${escapeHtml(prodA.store || 'Handel')}</div>
            <div style="display:flex;gap:3px;flex-wrap:wrap">
              ${prodA.ff === true ? '<span class="tag ff" style="font-size:0.6rem;padding:1px 4px">🌸 PF</span>' : (prodA.ff === false ? '<span class="tag warn" style="font-size:0.6rem;padding:1px 4px">⚠️ Parfüm</span>' : '')}
              ${prodA.nc === true ? '<span class="tag nc" style="font-size:0.6rem;padding:1px 4px">🛡️ NC</span>' : ''}
              ${prodA.cf === true ? '<span class="tag cf" style="font-size:0.6rem;padding:1px 4px">🐰 CF</span>' : ''}
            </div>
          </div>
        </div>

        <!-- Alternative Product Card -->
        <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:10px;padding:0.75rem;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="font-size:0.68rem;text-transform:uppercase;color:#166534;font-weight:700;margin-bottom:4px">✨ Alternative (Dupe)</div>
            ${prodB.img ? `<img src="${escapeHtml(prodB.img)}" alt="${escapeHtml(prodB.name)}" style="width:100%;height:75px;object-fit:cover;border-radius:6px;margin-bottom:6px;border:1px solid #dcfce7" onerror="this.style.display='none'">` : ''}
            <div style="font-weight:700;font-size:0.84rem;color:var(--ink);line-height:1.25;margin-bottom:2px">${escapeHtml(prodB.brand || '')}</div>
            <div style="font-size:0.76rem;color:var(--ink);line-height:1.3;margin-bottom:6px">${escapeHtml(prodB.name || '')}</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:#16a34a;font-weight:700;margin-bottom:3px">${escapeHtml(comp.priceB || 'Preis n/a')}</div>
            <div style="font-size:0.7rem;color:var(--muted);margin-bottom:4px">${escapeHtml(prodB.store || 'Drogerie')}</div>
            <div style="display:flex;gap:3px;flex-wrap:wrap">
              ${prodB.ff === true ? '<span class="tag ff" style="font-size:0.6rem;padding:1px 4px">🌸 PF</span>' : (prodB.ff === false ? '<span class="tag warn" style="font-size:0.6rem;padding:1px 4px">⚠️ Parfüm</span>' : '')}
              ${prodB.nc === true ? '<span class="tag nc" style="font-size:0.6rem;padding:1px 4px">🛡️ NC</span>' : ''}
              ${prodB.cf === true ? '<span class="tag cf" style="font-size:0.6rem;padding:1px 4px">🐰 CF</span>' : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- 1. Inhaltsstoffe & Wirkstoffe Section -->
      <div style="background:#fff;border:1px solid var(--line);border-radius:10px;padding:0.75rem 0.9rem;margin-bottom:0.75rem">
        <div style="font-weight:700;font-size:0.85rem;color:var(--ink);margin-bottom:6px">
          🌿 Inhaltsstoffe &amp; Wirkstoffe
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px">
          ${sharedActivesHtml}
        </div>
        ${diffAHtml}
        ${diffBHtml}
      </div>

      <!-- 2. Porenverstopfungs- & Komedogenitäts-Vergleich Section -->
      ${(() => {
        const ca = comp.comedogenicity ? comp.comedogenicity.analysisA : (typeof analyzeInciComedogenicity === "function" ? analyzeInciComedogenicity(prodA) : null);
        const cb = comp.comedogenicity ? comp.comedogenicity.analysisB : (typeof analyzeInciComedogenicity === "function" ? analyzeInciComedogenicity(prodB) : null);
        if (!ca || !cb) return '';
        const isBetter = cb.maxScore < ca.maxScore;
        const isWorse = cb.maxScore > ca.maxScore;
        const bothSafe = ca.maxScore <= 1 && cb.maxScore <= 1;

        return `
          <div style="background:#fff;border:1px solid var(--line);border-radius:10px;padding:0.75rem 0.9rem;margin-bottom:0.75rem">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div style="font-weight:700;font-size:0.85rem;color:var(--ink)">
                🛡️ Porenverstopfung &amp; Komedogenität (Skala 0–5)
              </div>
              <span style="font-size:0.72rem;font-weight:700;padding:2px 7px;border-radius:5px;background:${isBetter ? '#dcfce7' : (bothSafe ? '#eff6ff' : (isWorse ? '#fee2e2' : '#fef9c3'))};color:${isBetter ? '#166534' : (bothSafe ? '#1e40af' : (isWorse ? '#991b1b' : '#854d0e'))}">
                ${isBetter ? '🟢 Alternative ist porenfreundlicher' : (bothSafe ? '🟢 Beide nicht komedogen' : (isWorse ? '⚠️ Alternative ist komedogener' : 'Gleiches Risiko'))}
              </span>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;font-size:0.78rem">
              <div style="background:${ca.badgeColor};padding:6px 8px;border-radius:6px;border:1px solid ${ca.borderColor}">
                <div style="font-weight:700;color:${ca.textColor}">Original: Score ${ca.maxScore}/5</div>
                <div style="font-size:0.72rem;color:${ca.textColor};margin-top:2px">${ca.maxScore <= 1 ? 'Porenfreundlich' : (ca.maxScore === 2 ? 'Leichtes Risiko' : (ca.maxScore === 3 ? 'Moderat komedogen' : 'Stark verstopfend'))}</div>
                ${ca.highRisk.concat(ca.moderateRisk).length > 0 ? `<div style="font-size:0.68rem;color:#991b1b;margin-top:3px">⚠️ ${ca.highRisk.concat(ca.moderateRisk).map(i => i.name).join(', ')}</div>` : ''}
              </div>
              <div style="background:${cb.badgeColor};padding:6px 8px;border-radius:6px;border:1px solid ${cb.borderColor}">
                <div style="font-weight:700;color:${cb.textColor}">Dupe: Score ${cb.maxScore}/5</div>
                <div style="font-size:0.72rem;color:${cb.textColor};margin-top:2px">${cb.maxScore <= 1 ? 'Porenfreundlich' : (cb.maxScore === 2 ? 'Leichtes Risiko' : (cb.maxScore === 3 ? 'Moderat komedogen' : 'Stark verstopfend'))}</div>
                ${cb.highRisk.concat(cb.moderateRisk).length > 0 ? `<div style="font-size:0.68rem;color:#991b1b;margin-top:3px">⚠️ ${cb.highRisk.concat(cb.moderateRisk).map(i => i.name).join(', ')}</div>` : ''}
              </div>
            </div>
            <div style="font-size:0.72rem;color:var(--muted);margin-top:6px">
              <em>EU-Transparenz:</em> Werbebehauptungen zu 'nicht komedogen' sind unreguliert; die Kosmetikschrank-Engine analysiert jeden Inhaltsstoff nach dermatologischer Evidenz.
            </div>
          </div>
        `;
      })()}

      <!-- 3. Wirkung & Hautnutzen Section -->
      <div style="background:#fff;border:1px solid var(--line);border-radius:10px;padding:0.75rem 0.9rem;margin-bottom:0.75rem">
        <div style="font-weight:700;font-size:0.85rem;color:var(--ink);margin-bottom:6px">
          🎯 Wirkung &amp; Hautfokus
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px">
          ${sharedEffectsHtml}
        </div>
        <div style="font-size:0.78rem;color:var(--muted);margin-top:4px">
          Textur: <strong>${escapeHtml(comp.profA.texture)}</strong> vs. <strong>${escapeHtml(comp.profB.texture)}</strong>
        </div>
      </div>

      <!-- 3. Preis & Ersparnis Section -->
      ${comp.priceDiffText ? `
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:0.75rem 0.9rem;margin-bottom:0.85rem">
          <div style="font-weight:700;font-size:0.85rem;color:#166534;margin-bottom:3px">
            💶 Preisvergleich &amp; Sparpotenzial
          </div>
          <div style="font-size:0.82rem;color:#15803d;line-height:1.4">
            ${escapeHtml(comp.priceDiffText)}
          </div>
          ${prodB.store ? `<div style="font-size:0.74rem;color:#475569;margin-top:3px">Erhältlich bei: <strong>${escapeHtml(prodB.store)}</strong></div>` : ''}
        </div>
      ` : ''}

      <!-- Action Buttons -->
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:0.9rem">
        <button type="button" class="primary" style="background:#16a34a;border-color:#16a34a;color:#fff;font-weight:700;padding:11px" onclick="replaceCabinetProduct('${prodA.id}', '${prodB.id}')">
          🔄 Im Schrank durch diese Alternative ersetzen
        </button>
        <button type="button" class="ghost-btn" onclick="openCompatibilityCheckModal('${prodB.id}', '${appState.tab || 'am'}')">
          🔬 Routine- &amp; Verträglichkeits-Check für Alternative
        </button>
        <button type="button" class="ghost-btn" onclick="${cat === 'teen' ? `openTeenProductDetail('${prodA.id}')` : (cat === 'baby' || cat === 'child' ? `openBabyProductDetail('${prodA.id}')` : `openProductDetail('${prodA.id}')`)}">
          ➔ Zurück zu Produktdetails
        </button>
      </div>
    </div>
  `;

  showModalSheet(modalHTML);
}
window.openProductComparisonModal = openProductComparisonModal;




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