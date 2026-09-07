// ==========================================
// Central State Management Module
// ==========================================

let appState = {
  profile: "adult", // "adult" | "baby" | "child" | "teen"
  view: "cabinet", // Startet direkt in "Mein Schrank"!
  tab: "am", // "am" | "pm"
  pmMode: "a", // "a" (Adapalen) | "b" (Clienzo) | "c" (Pause)
  tags: ["Eigene Routine"],
  routineComplexity: "basis", // "minimal" (2) | "basis" (3) | "comprehensive" (4-5)
  babyComplexity: "basis",
  childComplexity: "basis",
  teenComplexity: "basis",
  profileSubtitles: {
    adult: "Akne & Barriere",
    teen: "Basis & Akne",
    child: "Sanft & LSF 50+",
    baby: "Parfümfrei-Prio"
  },
  am: [],
  pm_a: [],
  pm_b: [],
  pm_c: [],
  baby: {
    reiniger: [],
    creme: [],
    windel: [],
    spf: []
  },
  child: {
    reiniger: [],
    creme: [],
    spf: [],
    haar: []
  },
  teen: {
    reiniger: [],
    active: [],
    creme: [],
    spf: []
  },
  // Dynamische Profile (Frei wählbar & benennbar)
  activeProfileId: "p_adult_1",
  profiles: [
    {
      id: "p_adult_1",
      name: "Erwachsener",
      category: "adult",
      subtitle: "Akne & Barriere",
      complexity: "basis",
      tags: ["Eigene Routine"],
      data: { am: [], pm_a: [], pm_b: [], pm_c: [], pmMode: "a" }
    }
  ]
};

// ==========================================
// LOCALSTORAGE PERSISTENZ (Schrank-Speicherung)
// Speichert auf dem Gerät, auch nach Neu-Laden
// ==========================================

// Laden (beim Start der App):
function loadState() {
  const saved = localStorage.getItem("schrank");
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === "object") {
      appState = Object.assign({}, appState, parsed);
      if (!appState.baby) appState.baby = { reiniger: [], creme: [], windel: [], spf: [] };
      if (!appState.child) appState.child = { reiniger: [], creme: [], spf: [], haar: [] };
      if (!appState.teen) appState.teen = { reiniger: [], active: [], creme: [], spf: [] };
      if (!appState.babyComplexity) appState.babyComplexity = "basis";
      if (!appState.childComplexity) appState.childComplexity = "basis";
      if (!appState.teenComplexity) appState.teenComplexity = "basis";
      if (!appState.profileSubtitles) {
        appState.profileSubtitles = {
          adult: "Akne & Barriere",
          teen: "Basis & Akne",
          child: "Sanft & LSF 50+",
          baby: "Parfümfrei-Prio"
        };
      }
      // Migration / Initialisierung von profiles
      if (!appState.profiles || !Array.isArray(appState.profiles) || appState.profiles.length === 0) {
        appState.profiles = [
          {
            id: "p_adult_1",
            name: "Erwachsener",
            category: "adult",
            subtitle: (appState.profileSubtitles && appState.profileSubtitles.adult) || "Akne & Barriere",
            complexity: appState.routineComplexity || "basis",
            tags: appState.tags || ["Eigene Routine"],
            data: {
              am: appState.am || [],
              pm_a: appState.pm_a || [],
              pm_b: appState.pm_b || [],
              pm_c: appState.pm_c || [],
              pmMode: appState.pmMode || "a"
            }
          }
        ];
        appState.activeProfileId = "p_adult_1";
      }
      const activeP = getActiveProfile();
      if (activeP) {
        loadProfileToAppState(activeP);
      }
    }
  } catch (e) {
    console.warn("Fehler beim Laden von localStorage('schrank'):", e);
  }
}
}

// Speichern (z. B. nach jeder Schrank-Änderung):
function saveState() {
  try {
    syncActiveProfileFromWorkingState();
    localStorage.setItem("schrank", JSON.stringify(appState));
  } catch (e) {
    console.warn("Fehler beim Speichern in localStorage('schrank'):", e);
  }
}

// Löschen (Schrank zurücksetzen):
function resetSchrank() {
  try {
    localStorage.removeItem("schrank");
  } catch (e) {
    console.warn("Fehler beim Löschen von localStorage('schrank'):", e);
  }
  appState = {
    profile: "adult",
    view: "cabinet",
    tab: "am",
    pmMode: "a",
    tags: ["Eigene Routine"],
    routineComplexity: "basis",
    babyComplexity: "basis",
    childComplexity: "basis",
    teenComplexity: "basis",
    profileSubtitles: {
      adult: "Akne & Barriere",
      teen: "Basis & Akne",
      child: "Sanft & LSF 50+",
      baby: "Parfümfrei-Prio"
    },
    am: [],
    pm_a: [],
    pm_b: [],
    pm_c: [],
    baby: { reiniger: [], creme: [], windel: [], spf: [] },
    child: { reiniger: [], creme: [], spf: [], haar: [] },
    teen: { reiniger: [], active: [], creme: [], spf: [] },
    activeProfileId: "p_adult_1",
    profiles: [
      {
        id: "p_adult_1",
        name: "Erwachsener",
        category: "adult",
        subtitle: "Akne & Barriere",
        complexity: "basis",
        tags: ["Eigene Routine"],
        data: { am: [], pm_a: [], pm_b: [], pm_c: [], pmMode: "a" }
      }
    ]
  };
  updateCategoryNav();
  renderMain(false);
}

// ==========================================
// DYNAMISCHES PROFIL-MANAGEMENT & KATEGORIEN
// Benutzerdefinierte Profile, Kategorien & Synchronisation
// ==========================================

function getCategoryEmoji(cat) {
  if (cat === "teen") return "🧑‍🦱";
  if (cat === "child") return "🧒";
  if (cat === "baby") return "👶";
  return "👤";
}

function getCategoryDefaultSubtitle(cat) {
  if (cat === "teen") return "Basis & Akne";
  if (cat === "child") return "Sanft & LSF 50+";
  if (cat === "baby") return "Parfümfrei-Prio";
  return "Akne & Barriere";
}

function computeAdultSubtitleFromTags(tags) {
  const t = tags || [];
  const isAcne = t.some(x => x.includes("Akne") || x.includes("Arzt-Thema"));
  const isSensibel = t.some(x => x.includes("Sensibel"));
  const isDry = t.some(x => x.includes("Trocken"));
  const isOily = t.some(x => x.includes("Ölig") || x.includes("Oelig"));
  const isMixed = t.some(x => x.includes("Mischhaut"));
  const isHealthy = t.some(x => x.includes("Gesunde Haut") || x.includes("Normale Haut"));
  const isBarrier = t.some(x => x.includes("Barriere"));

  // 1. Akne-Kombinationen
  if (isAcne && isSensibel) return "Akne & Sensibel";
  if (isAcne && isDry) return "Akne & Trocken";
  if (isAcne && isOily) return "Ölig & Akne";
  if (isAcne && isMixed) return "Mischhaut & Akne";
  if (isAcne && isBarrier) return "Akne & Barriere";
  if (isAcne) return "Akne";

  // 2. Trocken-Kombinationen (wenn nur trocken, dann "Trocken")
  if (isDry && isSensibel) return "Trocken & Sensibel";
  if (isDry) return "Trocken";

  // 3. Ölig-Kombinationen
  if (isOily && isSensibel) return "Ölig & Sensibel";
  if (isOily) return "Ölig";

  // 4. Mischhaut
  if (isMixed && isSensibel) return "Mischhaut & Sensibel";
  if (isMixed) return "Mischhaut";

  // 5. Sensibel / Barriere einzeln
  if (isSensibel) return "Sensibel";
  if (isBarrier) return "Barriere-Schutz";

  // 6. Normal / Gesund
  if (isHealthy) return "Gesunde Haut";

  return "Akne & Barriere";
}

function getProfileSubtitle(profile) {
  if (appState.profileSubtitles && appState.profileSubtitles[profile]) {
    return appState.profileSubtitles[profile];
  }
  if (profile === "adult") {
    return computeAdultSubtitleFromTags(appState.tags);
  }
  if (profile === "teen") return "Basis & Akne";
  if (profile === "child") return "Sanft & LSF 50+";
  if (profile === "baby") return "Parfümfrei-Prio";
  return "";
}

function getActiveProfile() {
  if (!appState.profiles || !Array.isArray(appState.profiles) || appState.profiles.length === 0) {
    appState.profiles = [
      {
        id: "p_adult_1",
        name: "Erwachsener",
        category: "adult",
        subtitle: "Akne & Barriere",
        complexity: "basis",
        tags: ["Eigene Routine"],
        data: { am: [], pm_a: [], pm_b: [], pm_c: [], pmMode: "a" }
      }
    ];
    appState.activeProfileId = "p_adult_1";
  }
  let p = appState.profiles.find(x => x.id === appState.activeProfileId);
  if (!p) {
    p = appState.profiles[0];
    appState.activeProfileId = p.id;
  }
  return p;
}

function syncActiveProfileFromWorkingState() {
  const p = getActiveProfile();
  if (!p) return;
  if (p.category === "adult") {
    if (!p.data) p.data = {};
    p.data.am = appState.am || [];
    p.data.pm_a = appState.pm_a || [];
    p.data.pm_b = appState.pm_b || [];
    p.data.pm_c = appState.pm_c || [];
    p.data.pmMode = appState.pmMode || "a";
    p.complexity = appState.routineComplexity || "basis";
    p.tags = appState.tags || ["Eigene Routine"];
    if (appState.profileSubtitles && appState.profileSubtitles.adult) {
      p.subtitle = appState.profileSubtitles.adult;
    }
  } else if (p.category === "baby") {
    p.data = appState.baby || { reiniger: [], creme: [], windel: [], spf: [] };
    p.complexity = appState.babyComplexity || "basis";
    if (appState.profileSubtitles && appState.profileSubtitles.baby) {
      p.subtitle = appState.profileSubtitles.baby;
    }
  } else if (p.category === "child") {
    p.data = appState.child || { reiniger: [], creme: [], spf: [], haar: [] };
    p.complexity = appState.childComplexity || "basis";
    if (appState.profileSubtitles && appState.profileSubtitles.child) {
      p.subtitle = appState.profileSubtitles.child;
    }
  } else if (p.category === "teen") {
    p.data = appState.teen || { reiniger: [], active: [], creme: [], spf: [] };
    p.complexity = appState.teenComplexity || "basis";
    if (appState.profileSubtitles && appState.profileSubtitles.teen) {
      p.subtitle = appState.profileSubtitles.teen;
    }
  }
}

function loadProfileToAppState(p) {
  appState.activeProfileId = p.id;
  appState.profile = p.category;
  if (!appState.profileSubtitles) {
    const defaultSubs = { adult: "Akne & Barriere", teen: "Basis & Akne", child: "Sanft & LSF 50+", baby: "Parfümfrei-Prio" };
    appState.profileSubtitles = defaultSubs;
  }
  if (p.subtitle) {
    appState.profileSubtitles[p.category] = p.subtitle;
  }

  if (p.category === "adult") {
    const d = p.data || {};
    appState.am = d.am || [];
    appState.pm_a = d.pm_a || [];
    appState.pm_b = d.pm_b || [];
    appState.pm_c = d.pm_c || [];
    appState.pmMode = d.pmMode || "a";
    appState.routineComplexity = p.complexity || "basis";
    appState.tags = p.tags || ["Eigene Routine"];
  } else if (p.category === "baby") {
    appState.baby = p.data || { reiniger: [], creme: [], windel: [], spf: [] };
    appState.babyComplexity = p.complexity || "basis";
  } else if (p.category === "child") {
    appState.child = p.data || { reiniger: [], creme: [], spf: [], haar: [] };
    appState.childComplexity = p.complexity || "basis";
  } else if (p.category === "teen") {
    appState.teen = p.data || { reiniger: [], active: [], creme: [], spf: [] };
    appState.teenComplexity = p.complexity || "basis";
  }
}

function switchProfile(profileIdOrCategory) {
  syncActiveProfileFromWorkingState();
  
  // Find by profile id or first profile of category
  let target = appState.profiles.find(p => p.id === profileIdOrCategory);
  if (!target) {
    target = appState.profiles.find(p => p.category === profileIdOrCategory);
  }
  
  // If user clicked category which doesn't exist yet, auto-create it
  if (!target) {
    const cat = ["adult", "teen", "child", "baby"].includes(profileIdOrCategory) ? profileIdOrCategory : "adult";
    const defaultNames = { adult: "Erwachsener", teen: "Teenie 12–17 J.", child: "Kind 3–11 J.", baby: "Baby <3 J." };
    const defaultSubs = { adult: "Akne & Barriere", teen: "Basis & Akne", child: "Sanft & LSF 50+", baby: "Parfümfrei-Prio" };
    target = {
      id: "p_" + cat + "_" + Date.now(),
      name: defaultNames[cat],
      category: cat,
      subtitle: defaultSubs[cat],
      complexity: "basis",
      tags: cat === "adult" ? ["Eigene Routine"] : [],
      data: cat === "adult" ? { am: [], pm_a: [], pm_b: [], pm_c: [], pmMode: "a" } :
            cat === "baby" ? { reiniger: [], creme: [], windel: [], spf: [] } :
            cat === "child" ? { reiniger: [], creme: [], spf: [], haar: [] } :
            { reiniger: [], active: [], creme: [], spf: [] }
    };
    appState.profiles.push(target);
  }
  
  loadProfileToAppState(target);
  appState.view = "cabinet";
  updateCategoryNav();
  renderMain();
}

function updateCategoryNav() {
  const navBar = document.getElementById("catNavBar");
  const activeP = getActiveProfile();

  if (navBar && appState.profiles && Array.isArray(appState.profiles)) {
    let navHtml = "";
    
    // We keep track of the first seen profile of each category so automated tests looking for #btnProfileAdult etc. find them!
    const seenCat = {};

    appState.profiles.forEach(p => {
      const isActive = p.id === activeP.id;
      const emoji = getCategoryEmoji(p.category);
      const isFirstOfCat = !seenCat[p.category];
      seenCat[p.category] = true;

      // Category-based ID alias if first of its type, or specific ID
      const btnId = isFirstOfCat ? `btnProfile${p.category.charAt(0).toUpperCase() + p.category.slice(1)}` : `btnProf_${p.id}`;
      const subId = isFirstOfCat ? `subProfile${p.category.charAt(0).toUpperCase() + p.category.slice(1)}` : `subProf_${p.id}`;

      navHtml += `
        <button class="cat-nav-btn ${isActive ? 'active cat-' + p.category : ''}" id="${btnId}" onclick="${isActive ? "openRenameProfileModal('" + p.id + "')" : "switchProfile('" + p.id + "')"} " title="${isActive ? 'Klicken zum Umbenennen' : 'Zu ' + p.name + ' wechseln'}">
          <div style="position:relative;display:inline-block">
            <span class="c-emoji">${emoji}</span>
            ${isActive ? `<span style="font-size:0.62rem;position:absolute;bottom:-1px;right:-5px;background:#f4ece0;border-radius:4px;padding:0 2px" title="Umbenennen">✏️</span>` : ''}
          </div>
          <span class="c-title">${p.name}</span>
          <span class="c-sub" id="${subId}">${p.subtitle || getCategoryDefaultSubtitle(p.category)}</span>
        </button>
      `;
    });

    // Add Profile / Category Button (+)
    navHtml += `
      <button type="button" class="cat-nav-add-btn" onclick="openNewProfileModal()" title="Neues Profil anlegen">
        <span style="font-size:1.15rem;line-height:1.2">➕</span>
        <span style="font-size:0.75rem;font-weight:700;margin-top:1px">Neu</span>
      </button>
    `;

    navBar.innerHTML = navHtml;
  }

  // Update Header Guard Badge & Scan Labels
  const guardBadge = document.getElementById("guardBadgeText");
  const scanLabel = document.getElementById("btnScanLabel");
  const manualBtn = document.getElementById("btnManualPaste");

  if (guardBadge) {
    if (activeP.category === "teen") {
      guardBadge.innerHTML = "🧑‍🦱 Teenie-Wächter · Basis & Akne";
    } else if (activeP.category === "baby") {
      guardBadge.innerHTML = "👶 Säuglings-Schutz · Parfümfrei";
    } else if (activeP.category === "child") {
      guardBadge.innerHTML = "🧒 Kinder-Wächter · Barriere";
    } else {
      guardBadge.innerHTML = "🛡️ Begleitpflege aktiv";
    }
  }

  if (scanLabel) {
    if (activeP.category === "teen") {
      scanLabel.innerText = "🧑‍🦱 Teenie-Produkt prüfen";
    } else if (activeP.category === "baby") {
      scanLabel.innerText = "👶 Baby-Produkt prüfen";
    } else if (activeP.category === "child") {
      scanLabel.innerText = "🧒 Kinder-Produkt prüfen";
    } else {
      scanLabel.innerText = "Im dm / Laden scannen";
    }
  }

  if (manualBtn) {
    if (activeP.category === "teen") {
      manualBtn.innerText = "Teenie-Leitlinie";
    } else if (activeP.category === "baby" || activeP.category === "child") {
      manualBtn.innerText = "Pädiatrie-Leitlinie";
    } else {
      manualBtn.innerText = "INCI prüfen";
    }
  }
}

// Modal for Creating a New Profile
let newProfileSelectedCat = "adult";

function openNewProfileModal() {
  newProfileSelectedCat = "adult";
  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">Neues Profil anlegen</div>
    <h2 style="margin:0.2rem 0 0.3rem;font-size:1.3rem">Für wen möchtest du pflegen?</h2>
    <p style="font-size:0.86rem;color:var(--muted);margin:0 0 0.9rem;line-height:1.4">
      Wähle die passende Kategorie und vergib direkt am Anfang einen Namen:
    </p>

    <div style="margin:0.6rem 0">
      <label style="display:block;font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem">1. Kategorie auswählen</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px" id="newProfCatGrid">
        <div class="choice-card active" id="catChoice_adult" onclick="selectNewProfileCategory('adult')" style="padding:0.75rem;cursor:pointer;border:2px solid #206845;border-radius:10px;background:#f4f9f5;margin-bottom:0">
          <div style="font-weight:700;font-size:0.92rem;display:flex;align-items:center;gap:6px">👤 Erwachsener</div>
          <div style="font-size:0.74rem;color:var(--muted);margin-top:2px">Akne, Skin Cycling & Barriere</div>
        </div>
        <div class="choice-card" id="catChoice_teen" onclick="selectNewProfileCategory('teen')" style="padding:0.75rem;cursor:pointer;border:2px solid #e3d9cb;border-radius:10px;background:#fff;margin-bottom:0">
          <div style="font-weight:700;font-size:0.92rem;display:flex;align-items:center;gap:6px">🧑‍🦱 Teenie (12–17 J.)</div>
          <div style="font-size:0.74rem;color:var(--muted);margin-top:2px">Basis & Akne, kein Anti-Aging</div>
        </div>
        <div class="choice-card" id="catChoice_child" onclick="selectNewProfileCategory('child')" style="padding:0.75rem;cursor:pointer;border:2px solid #e3d9cb;border-radius:10px;background:#fff;margin-bottom:0">
          <div style="font-weight:700;font-size:0.92rem;display:flex;align-items:center;gap:6px">🧒 Kind (3–11 J.)</div>
          <div style="font-size:0.74rem;color:var(--muted);margin-top:2px">Sanfte Barriere & LSF 50+</div>
        </div>
        <div class="choice-card" id="catChoice_baby" onclick="selectNewProfileCategory('baby')" style="padding:0.75rem;cursor:pointer;border:2px solid #e3d9cb;border-radius:10px;background:#fff;margin-bottom:0">
          <div style="font-weight:700;font-size:0.92rem;display:flex;align-items:center;gap:6px">👶 Baby (&lt;3 J.)</div>
          <div style="font-size:0.74rem;color:var(--muted);margin-top:2px">100% Parfümfrei & Säuglings-Schutz</div>
        </div>
      </div>
    </div>

    <div style="margin:0.9rem 0">
      <label for="newProfileNameInput" style="display:block;font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem">2. Profilname (frei wählbar)</label>
      <input type="text" id="newProfileNameInput" placeholder="z. B. Mama, Papa, Baby Emma, Lukas..." style="width:100%;padding:0.75rem 0.85rem;border:1.5px solid var(--line);border-radius:10px;font-size:0.95rem;font-family:inherit" value="Erwachsener" onkeydown="if(event.key==='Enter'){ submitCreateProfile(); }">
    </div>

    <div style="display:flex;gap:8px;margin-top:1.1rem">
      <button class="ghost-btn" style="width:auto;margin-top:0;padding:0.75rem 1.2rem" onclick="closeModal()">Abbrechen</button>
      <button class="primary" style="margin-top:0;flex:1" onclick="submitCreateProfile()">Profil anlegen & öffnen →</button>
    </div>
  `);

  setTimeout(() => {
    const inp = document.getElementById("newProfileNameInput");
    if (inp) inp.select();
  }, 50);
}

function selectNewProfileCategory(cat) {
  newProfileSelectedCat = cat;
  const cats = ["adult", "teen", "child", "baby"];
  cats.forEach(c => {
    const el = document.getElementById("catChoice_" + c);
    if (!el) return;
    if (c === cat) {
      el.style.borderColor = "#206845";
      el.style.background = "#f4f9f5";
    } else {
      el.style.borderColor = "#e3d9cb";
      el.style.background = "#ffffff";
    }
  });
  
  const inp = document.getElementById("newProfileNameInput");
  if (inp) {
    const defaultNames = {
      adult: "Erwachsener",
      teen: "Teenie",
      child: "Kind",
      baby: "Baby"
    };
    const count = appState.profiles.filter(p => p.category === cat).length + 1;
    inp.value = count > 1 ? `${defaultNames[cat]} ${count}` : defaultNames[cat];
    inp.select();
  }
}

function submitCreateProfile() {
  const inp = document.getElementById("newProfileNameInput");
  const rawName = inp ? inp.value.trim() : "";
  const cat = newProfileSelectedCat || "adult";
  const defaultNames = { adult: "Erwachsener", teen: "Teenie 12–17 J.", child: "Kind 3–11 J.", baby: "Baby <3 J." };
  const finalName = rawName || defaultNames[cat];
  const defaultSubs = { adult: "Akne & Barriere", teen: "Basis & Akne", child: "Sanft & LSF 50+", baby: "Parfümfrei-Prio" };

  syncActiveProfileFromWorkingState();

  const newP = {
    id: "p_" + cat + "_" + Date.now(),
    name: finalName,
    category: cat,
    subtitle: defaultSubs[cat],
    complexity: "basis",
    tags: cat === "adult" ? ["Eigene Routine"] : [],
    data: cat === "adult" ? { am: [], pm_a: [], pm_b: [], pm_c: [], pmMode: "a" } :
          cat === "baby" ? { reiniger: [], creme: [], windel: [], spf: [] } :
          cat === "child" ? { reiniger: [], creme: [], spf: [], haar: [] } :
          { reiniger: [], active: [], creme: [], spf: [] }
  };

  appState.profiles.push(newP);
  loadProfileToAppState(newP);
  closeModal();
  updateCategoryNav();
  renderMain();
}

// Rename Profile Modal
function openRenameProfileModal(profileId) {
  const p = appState.profiles.find(x => x.id === profileId) || getActiveProfile();
  if (!p) return;

  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">Profil anpassen</div>
    <h2 style="margin:0.2rem 0 0.3rem;font-size:1.3rem">Profil umbenennen</h2>
    <p style="font-size:0.86rem;color:var(--muted);margin:0 0 0.9rem;line-height:1.4">
      Kategorie: ${getCategoryEmoji(p.category)} <strong>${p.category === 'adult' ? 'Erwachsener' : (p.category === 'teen' ? 'Teenie' : (p.category === 'child' ? 'Kind' : 'Baby'))}</strong>
    </p>

    <div style="margin:0.9rem 0">
      <label for="renameProfileInput" style="display:block;font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem">Profilname</label>
      <input type="text" id="renameProfileInput" value="${p.name.replace(/"/g, '&quot;')}" style="width:100%;padding:0.75rem 0.85rem;border:1.5px solid var(--line);border-radius:10px;font-size:0.95rem;font-family:inherit" onkeydown="if(event.key==='Enter'){ submitRenameProfile('${p.id}'); }">
    </div>

    <div style="display:flex;gap:8px;margin-top:1.1rem">
      <button class="ghost-btn" style="width:auto;margin-top:0;padding:0.75rem 1.2rem" onclick="closeModal()">Abbrechen</button>
      <button class="primary" style="margin-top:0;flex:1" onclick="submitRenameProfile('${p.id}')">Speichern</button>
      ${appState.profiles.length > 1 ? `
        <button class="ghost-btn" style="width:auto;margin-top:0;color:#b91c1c;border-color:#fecaca" onclick="if(confirm('Profil wirklich löschen?')){ deleteProfile('${p.id}'); }" title="Profil löschen">🗑️</button>
      ` : ''}
    </div>
  `);

  setTimeout(() => {
    const inp = document.getElementById("renameProfileInput");
    if (inp) inp.select();
  }, 50);
}

function submitRenameProfile(profileId) {
  const inp = document.getElementById("renameProfileInput");
  const newName = inp ? inp.value.trim() : "";
  const p = appState.profiles.find(x => x.id === profileId);
  if (p && newName) {
    p.name = newName;
    saveState();
  }
  closeModal();
  updateCategoryNav();
  renderMain(false);
}

// Delete Profile
function deleteProfile(profileId) {
  if (!appState.profiles || appState.profiles.length <= 1) {
    alert("Das letzte verbleibende Profil kann nicht gelöscht werden.");
    return;
  }
  const p = appState.profiles.find(x => x.id === profileId);
  if (!p) return;
  if (!confirm(`Möchtest du das Profil "${p.name}" wirklich löschen?`)) {
    return;
  }
  appState.profiles = appState.profiles.filter(x => x.id !== profileId);
  if (appState.activeProfileId === profileId) {
    const nextP = appState.profiles[0];
    loadProfileToAppState(nextP);
  }
  saveState();
  updateCategoryNav();
  renderMain();
}


function showToast(msg) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "toast-container";
    document.body.appendChild(toast);
  }
  toast.innerHTML = msg;
  toast.classList.add("show");
  if (window._toastTimer) clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}


function showModalSheet(contentHTML) {
  const container = document.getElementById("modalContainer");
  let sheet = container.querySelector(".sheet");
  if (!sheet) {
    container.innerHTML = `
      <div class="backdrop" onclick="closeModal()"></div>
      <div class="sheet">
        <div class="sheet-handle"></div>
        <div id="sheetContent">${contentHTML}</div>
      </div>
    `;
  } else {
    const contentEl = document.getElementById("sheetContent");
    if (contentEl) {
      contentEl.innerHTML = contentHTML;
    } else {
      sheet.innerHTML = `<div class="sheet-handle"></div><div id="sheetContent">${contentHTML}</div>`;
    }
    sheet.scrollTop = 0;
  }
}

function closeModal() {
  if (typeof stopBarcodeScanner === "function") {
    stopBarcodeScanner();
  }
  document.getElementById("modalContainer").innerHTML = "";
}


// Initiales Laden aus localStorage
loadState();