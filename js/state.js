// ==========================================
// Central State Management Module
// ==========================================

let appState = {
  profile: "adult", // "adult" | "baby" | "child" | "teen"
  view: "cabinet", // Startet direkt in "Mein Schrank"!
  tab: "am", // "am" | "pm"
  pmMode: "a", // "a" (Adapalen) | "b" (Clienzo) | "c" (Pause)
  useSkinCycling: false,
  tags: ["Eigene Routine"],
  routineComplexity: "basis", // "minimal" (2) | "basis" (3) | "comprehensive" (4-5)
  babyComplexity: "basis",
  childComplexity: "basis",
  teenComplexity: "basis",
  profileSubtitles: {
    adult: "Unreinheiten & Barriere",
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
      name: "Erwachsen",
      category: "adult",
      subtitle: "Unreinheiten & Barriere",
      complexity: "basis",
      tags: ["Eigene Routine"],
      country: "AT",
      data: { am: [], pm_a: [], pm_b: [], pm_c: [], pmMode: "a", useSkinCycling: false }
    }
  ],
  customProducts: {},
  country: "AT",
  hideUnknownCountries: false
};

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
window.escapeHtml = escapeHtml;


/** Normalize poisoned live-API price/wirk objects so UI never shows [object Object]. */
function sanitizeProductPriceFields(prod) {
  if (!prod || typeof prod !== "object") return prod;
  const fmt = (typeof formatLivePrice === "function") ? formatLivePrice : null;
  if (prod.price != null && typeof prod.price === "object") {
    prod.price = fmt ? fmt(prod.price) : "";
  } else if (prod.price != null && typeof prod.price !== "string" && typeof prod.price !== "number") {
    prod.price = fmt ? fmt(prod.price) : String(prod.price);
  }
  if (prod.wirk != null && typeof prod.wirk !== "string") {
    if (typeof prod.wirk === "object") {
      prod.wirk = fmt ? (fmt(prod.wirk) || "") : "";
    } else {
      prod.wirk = String(prod.wirk);
    }
  }
  if (prod.store != null && typeof prod.store === "object") {
    prod.store = fmt ? (fmt(prod.store) || "Drogerie") : "Drogerie";
  }
  return prod;
}
window.sanitizeProductPriceFields = sanitizeProductPriceFields;


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
      if (appState.useSkinCycling === undefined) {
        appState.useSkinCycling = shouldAutoEnableSkinCycling(appState);
      }
      if (!appState.baby) appState.baby = { reiniger: [], creme: [], windel: [], spf: [] };
      if (!appState.child) appState.child = { reiniger: [], creme: [], spf: [], haar: [] };
      if (!appState.teen) appState.teen = { reiniger: [], active: [], creme: [], spf: [] };
      if (!appState.babyComplexity) appState.babyComplexity = "basis";
      if (!appState.childComplexity) appState.childComplexity = "basis";
      if (!appState.teenComplexity) appState.teenComplexity = "basis";
      if (!appState.profileSubtitles) {
        appState.profileSubtitles = {
          adult: "Unreinheiten & Barriere",
          teen: "Basis & Akne",
          child: "Sanft & LSF 50+",
          baby: "Parfümfrei-Prio"
        };
      }
      if (!appState.customProducts || typeof appState.customProducts !== "object") {
        appState.customProducts = {};
      }
      // Restore dynamic & live-dm products into DB (+ Klassen-Heuristik)
      for (const [cid, cprod] of Object.entries(appState.customProducts)) {
        if (cprod && typeof sanitizeProductPriceFields === "function") sanitizeProductPriceFields(cprod);
        if (typeof enrichProductClasses === "function" && cprod) enrichProductClasses(cprod);
        if (typeof DB === "object" && cprod) DB[cid] = cprod;
        if (typeof TEEN_DB === "object" && cprod && !TEEN_DB[cid]) {
          TEEN_DB[cid] = Object.assign({}, cprod, {
            slot: cprod.kat === "reiniger" ? "reiniger" : (cprod.kat === "spf" ? "spf" : (cprod.kat === "serum" || cprod.kat === "active" ? "active" : "creme"))
          });
        }
        if (typeof BABY_DB === "object" && cprod && !BABY_DB[cid]) {
          BABY_DB[cid] = Object.assign({}, cprod, {
            slot: cprod.kat === "reiniger" ? "reiniger" : (cprod.kat === "spf" ? "spf" : "creme")
          });
        }
      }
      if (typeof enrichAllDbProducts === "function") enrichAllDbProducts();
      // Migration / Initialisierung von profiles
      if (!appState.profiles || !Array.isArray(appState.profiles) || appState.profiles.length === 0) {
        appState.profiles = [
          {
            id: "p_adult_1",
            name: "Erwachsen",
            category: "adult",
            subtitle: (appState.profileSubtitles && appState.profileSubtitles.adult) || "Unreinheiten & Barriere",
            complexity: appState.routineComplexity || "basis",
            tags: appState.tags || ["Eigene Routine"],
            data: {
              am: appState.am || [],
              pm_a: appState.pm_a || [],
              pm_b: appState.pm_b || [],
              pm_c: appState.pm_c || [],
              pmMode: appState.pmMode || "a",
              useSkinCycling: Boolean(appState.useSkinCycling)
            }
          }
        ];
        appState.activeProfileId = "p_adult_1";
      }

      // Länder-Migration: einheitliches Land für alle Kategorien (Global Sync)
      // dach1: Unklare Herkunft standardmäßig einblenden (Katalog für AT nicht leeren)
      if (appState.hideUnknownCountries === undefined) appState.hideUnknownCountries = false;
      if (appState._countryFilterVersion !== "dach1") {
        appState._countryFilterVersion = "dach1";
        // Einmalig weicher: alter Default hide=true machte AT-Katalog zu klein
        if (appState.hideUnknownCountries === true) {
          appState.hideUnknownCountries = false;
        }
      }
      if (!appState.country) {
        const found = (Array.isArray(appState.profiles) && appState.profiles.find(p => p.country)) || null;
        appState.country = (found && found.country) ? String(found.country).toUpperCase() : "AT";
      } else {
        appState.country = String(appState.country).toUpperCase();
      }
      if (Array.isArray(appState.profiles)) {
        appState.profiles.forEach(function (pr) {
          pr.country = appState.country;
        });
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
    useSkinCycling: false,
    tags: ["Eigene Routine"],
    routineComplexity: "basis",
    babyComplexity: "basis",
    childComplexity: "basis",
    teenComplexity: "basis",
    profileSubtitles: {
      adult: "Unreinheiten & Barriere",
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
        name: "Erwachsen",
        category: "adult",
        subtitle: "Unreinheiten & Barriere",
        complexity: "basis",
        tags: ["Eigene Routine"],
        country: "AT",
        data: { am: [], pm_a: [], pm_b: [], pm_c: [], pmMode: "a", useSkinCycling: false }
      }
    ],
    customProducts: {},
    country: "AT",
    hideUnknownCountries: false
  };
  if (appState.profiles && appState.profiles[0] && !appState.profiles[0].country) {
    appState.profiles[0].country = "AT";
  }
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
  return "Unreinheiten & Barriere";
}

function computeAdultSubtitleFromTags(tags) {
  const t = tags || [];
  const isAcne = t.some(x => x.includes("Akne") || x.includes("Unreinheiten") || x.includes("Arzt-Thema"));
  const isSensibel = t.some(x => x.includes("Sensibel"));
  const isDry = t.some(x => x.includes("Trocken"));
  const isOily = t.some(x => x.includes("Ölig") || x.includes("Oelig"));
  const isMixed = t.some(x => x.includes("Mischhaut"));
  const isHealthy = t.some(x => x.includes("Gesunde Haut") || x.includes("Normale Haut"));
  const isBarrier = t.some(x => x.includes("Barriere"));
  const isPih = t.some(x => x.includes("PIH") || x.includes("Skin-of-Color"));

  // 1. Akne- & PIH-Kombinationen
  if (isAcne && isPih) return "Akne & PIH-Schutz";
  if (isPih && isSensibel) return "PIH & Sensibel";
  if (isPih && isDry) return "PIH & Trocken";
  if (isPih && isOily) return "Ölig & PIH-Schutz";
  if (isPih) return "PIH & Melanin-Schutz";

  if (isAcne && isSensibel) return "Akne & Sensibel";
  if (isAcne && isDry) return "Akne & Trocken";
  if (isAcne && isOily) return "Ölig & Akne";
  if (isAcne && isMixed) return "Mischhaut & Akne";
  if (isAcne && isBarrier) return "Unreinheiten & Barriere";
  if (isAcne) return "Unreinheiten";

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
  if (isBarrier) return "Barriere";

  // 6. Normal / Gesund
  if (isHealthy) return "Gesunde Haut";

  return "Unreinheiten & Barriere";
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
        name: "Erwachsen",
        category: "adult",
        subtitle: "Unreinheiten & Barriere",
        complexity: "basis",
        tags: ["Eigene Routine"],
        country: "AT",
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
    p.data.useSkinCycling = Boolean(appState.useSkinCycling);
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

function shouldAutoEnableSkinCycling(pOrState) {
  const obj = pOrState || appState;
  const cat = obj.category || obj.profile;
  if (cat && cat !== "adult") return false;

  const comp = obj.complexity || obj.routineComplexity || "basis";
  if (comp === "minimal") return false;

  const tags = obj.tags || (appState && appState.tags) || [];
  const isRxOrAcne = tags.some(t => String(t).includes("Rx") || String(t).includes("Akne") || String(t).includes("Arzt-Thema") || String(t).includes("Skin Cycling"));

  const routineId = typeof getSelectedIdealRoutineId === "function" ? getSelectedIdealRoutineId() : "acne_barrier";
  if (routineId === "acne_barrier") return true;

  const d = obj.data || obj;
  const allIds = [].concat(
    d.am || obj.am || [],
    d.pm_a || obj.pm_a || [],
    d.pm_b || obj.pm_b || [],
    d.pm_c || obj.pm_c || []
  );
  let activeCount = 0;
  allIds.forEach(id => {
    const prod = (typeof resolveProfileCabinetProduct === "function" ? resolveProfileCabinetProduct(id) : null)
      || (typeof DB !== "undefined" && DB ? DB[id] : null);
    if (prod && (prod.rx || prod.schiene === "arzneimittel" || (typeof isRetinoidProduct === "function" && isRetinoidProduct(prod)) || (typeof isAcidProduct === "function" && isAcidProduct(prod)) || (typeof isBpoProduct === "function" && isBpoProduct(prod)))) {
      activeCount++;
    }
  });
  if (activeCount >= 2) return true;
  return isRxOrAcne;
}
window.shouldAutoEnableSkinCycling = shouldAutoEnableSkinCycling;

function loadProfileToAppState(p) {
  appState.activeProfileId = p.id;
  appState.profile = p.category;
  if (!appState.profileSubtitles) {
    appState.profileSubtitles = {};
  }
  appState.profileSubtitles[p.category] = p.subtitle || "";
  if (appState.country) {
    p.country = appState.country;
  } else if (p.country) {
    appState.country = p.country;
  }

  if (p.category === "adult") {
    const d = p.data || {};
    appState.am = d.am || [];
    appState.pm_a = d.pm_a || [];
    appState.pm_b = d.pm_b || [];
    appState.pm_c = d.pm_c || [];
    appState.pmMode = d.pmMode || "a";
    appState.useSkinCycling = d.useSkinCycling !== undefined ? Boolean(d.useSkinCycling) : shouldAutoEnableSkinCycling(p);
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
    const defaultNames = { adult: "Erwachsen", teen: "Teenie 12–17 J.", child: "Kind 3–11 J.", baby: "Baby <3 J." };
    const defaultSubs = { adult: "Unreinheiten & Barriere", teen: "Basis & Akne", child: "Sanft & LSF 50+", baby: "Parfümfrei-Prio" };
    target = {
      id: "p_" + cat + "_" + Date.now(),
      name: defaultNames[cat],
      category: cat,
      subtitle: defaultSubs[cat],
      complexity: "basis",
      tags: cat === "adult" ? ["Eigene Routine"] : [],
      country: getProfileCountry(),
      data: cat === "adult" ? { am: [], pm_a: [], pm_b: [], pm_c: [], pmMode: "a", useSkinCycling: false } :
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
          <span class="c-sub" id="${subId}">${(p.subtitle && p.subtitle.trim()) ? escapeHtml(p.subtitle) : ''}</span>
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
    guardBadge.innerHTML = "Kurzanleitung";
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

// ==========================================
// Dynamic Profile & Skin-Type Onboarding
// ==========================================

const CATEGORY_SKIN_TYPES = {
  adult: [
    {
      id: "acne_barrier",
      name: "Unreinheiten & Barriere",
      desc: "Pickel, verstopfte Poren, Rx-Optionen (BPO/Adapalen) & Barriere-Support",
      subtitle: "Unreinheiten & Barriere",
      tags: ["Akne-Neigung", "Barriere-Support"],
      badge: "🔴 Akne & Poren",
      routineId: "acne_barrier"
    },
    {
      id: "oily_pores",
      name: "Ölige Haut & Mischhaut",
      desc: "Talgüberschuss, Glanz in der T-Zone, Mitesser & vergrößerte Poren",
      subtitle: "Ölig & Poren",
      tags: ["Ölig", "Mischhaut"],
      badge: "🔵 Sebum & Glanz",
      routineId: "oily_pores"
    },
    {
      id: "dry_fragile",
      name: "Trockene & sensible Haut",
      desc: "Spannungsgefühl, Trockenheitsschuppen, Rötungen & Barriere-Ceramide",
      subtitle: "Trocken & Sensibel",
      tags: ["Trocken", "Sensibel"],
      badge: "🟠 Trocken & Barriere",
      routineId: "dry_fragile"
    },
    {
      id: "healthy_glow",
      name: "Normale Haut & Prävention",
      desc: "Ausgeglichene Haut, Feuchte-Balance & täglicher Breitband-UV-Schutz",
      subtitle: "Gesunde Haut",
      tags: ["Gesunde Haut", "Prävention & LSF"],
      badge: "🟢 Ausgeglichen",
      routineId: "healthy_glow"
    }
  ],
  teen: [
    {
      id: "teen_acne",
      name: "Talg, Mitesser & Pickel",
      desc: "Sanfte BHA-Klärung & Porenbalance ohne schädliche Anti-Aging-Stoffe",
      subtitle: "Basis & Akne",
      tags: ["Teen", "Akne-Neigung"],
      badge: "🔴 Akne & Talg"
    },
    {
      id: "teen_dry",
      name: "Trocken & Sensibel",
      desc: "Spannungsgefühl & raue Stellen; milde Tenside & reizfreie Pflege",
      subtitle: "Trocken & Sensibel",
      tags: ["Teen", "Sensibel", "Trocken"],
      badge: "🟠 Trocken"
    },
    {
      id: "teen_normal",
      name: "Gesunde Teenie-Basispflege",
      desc: "Ausgeglichene junge Haut; milde Reinigung, Feuchtigkeit & LSF 30–50+",
      subtitle: "Normale Haut",
      tags: ["Teen", "Gesunde Basis"],
      badge: "🟢 Ausgeglichen"
    }
  ],
  child: [
    {
      id: "child_normal",
      name: "Sanfte Kinder-Basispflege",
      desc: "Milde Dusche/Waschlotion & LSF 50+ für Schule, Sport und Hofpause",
      subtitle: "Sanft & LSF 50+",
      tags: ["Kind", "Sanfte Basis"],
      badge: "🟢 Ausgeglichen"
    },
    {
      id: "child_dry",
      name: "Trockene Kinderhaut",
      desc: "Neigung zu rauen Stellen oder Neurodermitis; rückfettende Barrierepflege",
      subtitle: "Trocken & Sensibel",
      tags: ["Kind", "Trocken"],
      badge: "🟠 Trocken"
    }
  ],
  baby: [
    {
      id: "baby_normal",
      name: "Sanfter Säuglingsschutz",
      desc: "100% parfümfreie, minimalistische Säuglingspflege für zarte Haut",
      subtitle: "Parfümfrei-Prio",
      tags: ["Baby", "Parfümfrei"],
      badge: "🟢 Normal"
    },
    {
      id: "baby_dry",
      name: "Trockene Babyhaut / Schuppung",
      desc: "Barriere-Emollient für sensible Wangen & Schienbeine",
      subtitle: "Trockene Barriere",
      tags: ["Baby", "Trockene Barriere"],
      badge: "🟠 Trocken"
    },
    {
      id: "baby_diaper",
      name: "Sensible Windelzone",
      desc: "Zinkhaltiger Wundschutz gegen Rötungen & Feuchtigkeitsreiz",
      subtitle: "Sensible Windelzone",
      tags: ["Baby", "Windelbereich"],
      badge: "🟡 Windel-SOS"
    }
  ]
};

let newProfileSelectedCat = "adult";
let newProfileSelectedMode = "direct"; // "direct" | "quiz"
let newProfileSelectedSkinType = "acne_barrier";
let newProfileCabinetFillMode = "empty"; // "empty" | "starter"

function renderNewProfileSkinTypesHtml(cat) {
  const list = CATEGORY_SKIN_TYPES[cat] || CATEGORY_SKIN_TYPES.adult;
  return list.map((st, idx) => {
    const isSelected = (newProfileSelectedSkinType === st.id) || (!newProfileSelectedSkinType && idx === 0);
    return `
      <div class="choice-card st-choice-card ${isSelected ? 'active' : ''}" id="stChoice_${st.id}" onclick="selectNewProfileSkinType('${st.id}')" style="padding:0.65rem 0.85rem;cursor:pointer;border:2px solid ${isSelected ? '#0a3323' : 'var(--line)'};border-radius:10px;background:${isSelected ? '#f4f8f5' : '#fff'};margin-bottom:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong style="font-size:0.88rem;color:var(--ink)">${st.name}</strong>
          <span style="font-size:0.68rem;background:#f1f5f9;color:#334155;padding:1px 6px;border-radius:4px;font-weight:700">${st.badge}</span>
        </div>
        <div style="font-size:0.75rem;color:var(--muted);margin-top:2px;line-height:1.3">${st.desc}</div>
      </div>
    `;
  }).join("");
}

function openNewProfileModal() {
  newProfileSelectedCat = "adult";
  newProfileSelectedMode = "direct";
  newProfileSelectedSkinType = "acne_barrier";
  newProfileCabinetFillMode = "empty";

  showModalSheet(`
    <div style="max-height:85vh;overflow-y:auto;padding-right:2px">
      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">Neues Profil anlegen</div>
      <h2 style="margin:0.2rem 0 0.25rem;font-size:1.28rem">Für wen möchtest du pflegen?</h2>
      <p style="font-size:0.84rem;color:var(--muted);margin:0 0 0.8rem;line-height:1.4">
        Wähle die Kategorie, vergib einen Namen und bestimme deinen Start-Weg:
      </p>

      <!-- 1. Kategorie -->
      <div style="margin:0.5rem 0">
        <label style="display:block;font-size:0.74rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:0.35rem">1. Kategorie auswählen</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px" id="newProfCatGrid">
          <div class="choice-card active" id="catChoice_adult" onclick="selectNewProfileCategory('adult')" style="padding:0.75rem 0.85rem;cursor:pointer;border:2px solid #0a3323;border-radius:10px;background:#f4f8f5;margin-bottom:0;display:flex;align-items:center;justify-content:center">
            <div style="font-weight:700;font-size:0.92rem;display:flex;align-items:center;gap:6px">👤 Erwachsene</div>
          </div>
          <div class="choice-card" id="catChoice_teen" onclick="selectNewProfileCategory('teen')" style="padding:0.75rem 0.85rem;cursor:pointer;border:2px solid var(--line);border-radius:10px;background:#fff;margin-bottom:0;display:flex;align-items:center;justify-content:center">
            <div style="font-weight:700;font-size:0.92rem;display:flex;align-items:center;gap:6px">🧑‍🦱 Teenie</div>
          </div>
          <div class="choice-card" id="catChoice_child" onclick="selectNewProfileCategory('child')" style="padding:0.75rem 0.85rem;cursor:pointer;border:2px solid var(--line);border-radius:10px;background:#fff;margin-bottom:0;display:flex;align-items:center;justify-content:center">
            <div style="font-weight:700;font-size:0.92rem;display:flex;align-items:center;gap:6px">🧒 Kind</div>
          </div>
          <div class="choice-card" id="catChoice_baby" onclick="selectNewProfileCategory('baby')" style="padding:0.75rem 0.85rem;cursor:pointer;border:2px solid var(--line);border-radius:10px;background:#fff;margin-bottom:0;display:flex;align-items:center;justify-content:center">
            <div style="font-weight:700;font-size:0.92rem;display:flex;align-items:center;gap:6px">👶 Baby</div>
          </div>
        </div>
      </div>

      <!-- 2. Profilname -->
      <div style="margin:0.75rem 0">
        <label for="newProfileNameInput" style="display:block;font-size:0.74rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:0.35rem">2. Profilname (frei wählbar)</label>
        <input type="text" id="newProfileNameInput" placeholder="z. B. Mama, Papa, Sarah, Lukas..." style="width:100%;padding:0.65rem 0.8rem;border:1.5px solid var(--line);border-radius:10px;font-size:0.92rem;font-family:inherit" value="Erwachsene" onkeydown="if(event.key==='Enter'){ submitCreateProfile(); }">
      </div>

      <!-- 3. Wie möchtest du starten? -->
      <div style="margin:0.85rem 0">
        <label style="display:block;font-size:0.74rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:0.35rem">3. Hautprofil &amp; Schrank-Setup</label>
        
        <!-- Toggle Tabs: Direkt vs Quiz -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#f1f5f9;padding:4px;border-radius:10px;margin-bottom:0.75rem">
          <button type="button" class="btn-text" id="btnModeDirect" onclick="selectNewProfileMode('direct')" style="padding:7px 10px;border-radius:8px;font-size:0.82rem;font-weight:700;background:#fff;color:var(--ink);box-shadow:0 1px 2px rgba(0,0,0,0.06);border:none">
            ⚡ Hauttyp direkt wählen
          </button>
          <button type="button" class="btn-text" id="btnModeQuiz" onclick="selectNewProfileMode('quiz')" style="padding:7px 10px;border-radius:8px;font-size:0.82rem;font-weight:600;background:transparent;color:var(--muted);border:none">
            🔬 Hauttyp per Quiz ermitteln
          </button>
        </div>

        <!-- Sektion A: Direktauswahl -->
        <div id="newProfDirectSection" style="display:block">
          <div style="font-size:0.76rem;color:var(--muted);margin-bottom:0.4rem">
            Wähle deinen Hauttyp. Kosmetikschrank richtet die Wächter-Filterung und Produktempfehlungen darauf aus:
          </div>
          <div style="display:grid;grid-template-columns:1fr;gap:6px" id="newProfSkinTypesContainer">
            ${renderNewProfileSkinTypesHtml('adult')}
          </div>

          <!-- Schrank-Initialisierung: Leer (auf Null) vs Starter-Routine -->
          <div style="background:#f8fafc;border:1px solid var(--line);border-radius:10px;padding:0.75rem;margin-top:0.75rem">
            <div style="font-size:0.76rem;font-weight:700;color:var(--ink);margin-bottom:0.4rem">Schrank-Ausstattung bei Erstellung:</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;font-size:0.82rem;line-height:1.35">
                <input type="radio" name="newProfFillMode" id="fillMode_empty" value="empty" checked onchange="selectNewProfileCabinetFill('empty')" style="margin-top:2px">
                <div>
                  <strong>🧴 Schrank komplett leer starten (auf Null)</strong>
                  <div style="font-size:0.72rem;color:var(--muted)">0 Produkte im Schrank – eigene Produkte selbst scannen oder einsortieren.</div>
                </div>
              </label>
              <label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;font-size:0.82rem;line-height:1.35">
                <input type="radio" name="newProfFillMode" id="fillMode_starter" value="starter" onchange="selectNewProfileCabinetFill('starter')" style="margin-top:2px">
                <div>
                  <strong>🎯 Empfohlene Starter-Routine für diesen Hauttyp laden</strong>
                  <div style="font-size:0.72rem;color:var(--muted)">Stellt die passenden Basis-Produkte direkt in deinen Schrank.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Sektion B: Quiz-Hinweis -->
        <div id="newProfQuizSection" style="display:none;background:#f0fdf4;border:1.5px solid #86efac;border-radius:10px;padding:0.85rem">
          <div style="font-weight:700;font-size:0.88rem;color:#166534;display:flex;align-items:center;gap:6px">
            🔬 Wissenschaftliche Hautanalyse
          </div>
          <div style="font-size:0.8rem;color:#166534;margin-top:4px;line-height:1.4">
            Du beantwortest kurze Fragen zu deinem Hautgefühl (Spannen, Sebum/Glanz, Unreinheiten) und gewünschtem Aufwand. Kosmetikschrank ermittelt deinen Hauttyp und erstellt danach deinen Schrank.
          </div>
          <div style="font-size:0.72rem;color:#15803d;margin-top:6px;font-style:italic">
            ✓ Das Profil startet komplett auf Null und wird nach dem Quiz eingerichtet.
          </div>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-top:1rem">
        <button type="button" class="ghost-btn" style="width:auto;margin-top:0;padding:0.7rem 1.1rem" onclick="closeModal()">Abbrechen</button>
        <button type="button" class="primary" id="btnSubmitNewProfile" style="margin-top:0;flex:1" onclick="submitCreateProfile()">
          Profil anlegen &amp; Schrank öffnen →
        </button>
      </div>
    </div>
  `);

  setTimeout(() => {
    const inp = document.getElementById("newProfileNameInput");
    if (inp) inp.select();
  }, 50);
}

function selectNewProfileMode(mode) {
  newProfileSelectedMode = mode;
  const directSec = document.getElementById("newProfDirectSection");
  const quizSec = document.getElementById("newProfQuizSection");
  const btnDirect = document.getElementById("btnModeDirect");
  const btnQuiz = document.getElementById("btnModeQuiz");
  const submitBtn = document.getElementById("btnSubmitNewProfile");

  if (mode === "quiz") {
    if (directSec) directSec.style.display = "none";
    if (quizSec) quizSec.style.display = "block";
    if (btnDirect) {
      btnDirect.style.background = "transparent";
      btnDirect.style.color = "var(--muted)";
      btnDirect.style.boxShadow = "none";
    }
    if (btnQuiz) {
      btnQuiz.style.background = "#fff";
      btnQuiz.style.color = "var(--ink)";
      btnQuiz.style.boxShadow = "0 1px 2px rgba(0,0,0,0.06)";
    }
    if (submitBtn) submitBtn.innerHTML = "Profil anlegen &amp; Quiz starten ➔";
  } else {
    if (directSec) directSec.style.display = "block";
    if (quizSec) quizSec.style.display = "none";
    if (btnDirect) {
      btnDirect.style.background = "#fff";
      btnDirect.style.color = "var(--ink)";
      btnDirect.style.boxShadow = "0 1px 2px rgba(0,0,0,0.06)";
    }
    if (btnQuiz) {
      btnQuiz.style.background = "transparent";
      btnQuiz.style.color = "var(--muted)";
      btnQuiz.style.boxShadow = "none";
    }
    if (submitBtn) submitBtn.innerHTML = "Profil anlegen &amp; Schrank öffnen →";
  }
}

function selectNewProfileSkinType(stId) {
  newProfileSelectedSkinType = stId;
  const cat = newProfileSelectedCat || "adult";
  const list = CATEGORY_SKIN_TYPES[cat] || CATEGORY_SKIN_TYPES.adult;
  list.forEach(st => {
    const el = document.getElementById("stChoice_" + st.id);
    if (!el) return;
    if (st.id === stId) {
      el.style.borderColor = "#0a3323";
      el.style.background = "#f4f8f5";
    } else {
      el.style.borderColor = "var(--line)";
      el.style.background = "#ffffff";
    }
  });
}

function selectNewProfileCabinetFill(fill) {
  newProfileCabinetFillMode = fill;
  const rEmpty = document.getElementById("fillMode_empty");
  const rStarter = document.getElementById("fillMode_starter");
  if (rEmpty) rEmpty.checked = (fill === "empty");
  if (rStarter) rStarter.checked = (fill === "starter");
}

function selectNewProfileCategory(cat) {
  newProfileSelectedCat = cat;
  const colors = {
    adult: { border: "#0a3323", bg: "#f4f8f5" },
    teen: { border: "#105666", bg: "#E3EFF2" },
    child: { border: "#4A5B2B", bg: "#EDF3E4" },
    baby: { border: "#8C483E", bg: "#FBF0ED" }
  };
  const cats = ["adult", "teen", "child", "baby"];
  cats.forEach(c => {
    const el = document.getElementById("catChoice_" + c);
    if (!el) return;
    if (c === cat) {
      el.style.borderColor = colors[c] ? colors[c].border : "#0a3323";
      el.style.background = colors[c] ? colors[c].bg : "#f4f8f5";
    } else {
      el.style.borderColor = "var(--line)";
      el.style.background = "#ffffff";
    }
  });

  const skinTypes = CATEGORY_SKIN_TYPES[cat] || CATEGORY_SKIN_TYPES.adult;
  newProfileSelectedSkinType = skinTypes[0] ? skinTypes[0].id : "acne_barrier";
  const container = document.getElementById("newProfSkinTypesContainer");
  if (container) {
    container.innerHTML = renderNewProfileSkinTypesHtml(cat);
  }

  const inp = document.getElementById("newProfileNameInput");
  if (inp) {
    const defaultNames = {
      adult: "Erwachsen",
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
  const defaultNames = { adult: "Erwachsen", teen: "Teenie", child: "Kind", baby: "Baby" };
  const finalName = rawName || defaultNames[cat];

  syncActiveProfileFromWorkingState();

  const skinTypeList = CATEGORY_SKIN_TYPES[cat] || CATEGORY_SKIN_TYPES.adult;
  const selectedSkin = skinTypeList.find(s => s.id === newProfileSelectedSkinType) || skinTypeList[0];

  const newP = {
    id: "p_" + cat + "_" + Date.now(),
    name: finalName,
    category: cat,
    subtitle: newProfileCabinetFillMode === "starter" ? (selectedSkin.subtitle || "") : "",
    complexity: "basis",
    tags: Array.isArray(selectedSkin.tags) ? selectedSkin.tags.slice() : ["Eigene Routine"],
    country: getProfileCountry(),
    data: cat === "adult" ? { am: [], pm_a: [], pm_b: [], pm_c: [], pmMode: "a", useSkinCycling: false } :
          cat === "baby" ? { reiniger: [], creme: [], windel: [], spf: [] } :
          cat === "child" ? { reiniger: [], creme: [], spf: [], haar: [] } :
          { reiniger: [], active: [], creme: [], spf: [] }
  };

  appState.profiles.push(newP);
  loadProfileToAppState(newP);

  if (cat === "adult" && selectedSkin.routineId) {
    window.selectedIdealRoutineId = selectedSkin.routineId;
  }

  closeModal();
  updateCategoryNav();
  renderMain();

  if (newProfileSelectedMode === "quiz") {
    // Start Quiz immediately for this fresh profile
    if (typeof openQuizModal === "function") {
      openQuizModal();
    }
    showToast(`🔬 Starte Hautanalyse für <strong>${escapeHtml(finalName)}</strong>...`);
    return;
  }

  // Direct Mode
  if (newProfileCabinetFillMode === "starter") {
    if (cat === "adult") {
      if (typeof syncAdultRoutineToComplexity === "function") {
        syncAdultRoutineToComplexity("basis", selectedSkin.routineId || "acne_barrier", true);
      }
    } else if (cat === "teen") {
      if (typeof loadTeenPreset === "function") loadTeenPreset();
    } else if (cat === "baby") {
      if (typeof loadBabyPreset === "function") loadBabyPreset();
    } else if (cat === "child") {
      if (typeof loadChildPreset === "function") loadChildPreset();
    }
    saveState();
    renderMain();
    showToast(`🎯 Profil <strong>${escapeHtml(finalName)}</strong> mit Starter-Routine (${selectedSkin.subtitle}) angelegt!`);
  } else {
    // Completely empty (auf Null)
    saveState();
    renderMain();
    showToast(`🧴 Profil <strong>${escapeHtml(finalName)}</strong> angelegt (Schrank komplett auf Null)!`);
  }
}

// Quick Skin-Type Picker Modal for existing profiles
function openSkinTypePickerModal() {
  const activeP = getActiveProfile();
  const cat = activeP.category || "adult";
  const skinTypes = CATEGORY_SKIN_TYPES[cat] || CATEGORY_SKIN_TYPES.adult;

  showModalSheet(`
    <div style="max-height:85vh;overflow-y:auto;padding-right:2px">
      <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">Hauttyp anpassen</div>
      <h2 style="margin:0.2rem 0 0.3rem;font-size:1.3rem">Hauttyp für ${escapeHtml(activeP.name)}</h2>
      <p style="font-size:0.86rem;color:var(--muted);margin:0 0 0.9rem;line-height:1.4">
        Wähle deinen aktuellen Hauttyp. Der Wächter gleicht deine Produkte und Empfehlungen sofort darauf ab:
      </p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:1rem">
        ${skinTypes.map(st => {
          const isCurrent = activeP.subtitle === st.subtitle;
          return `
            <div class="choice-card" onclick="applySkinTypeToActiveProfile('${st.id}')" style="padding:0.8rem 0.95rem;cursor:pointer;border:2px solid ${isCurrent ? '#0a3323' : 'var(--line)'};border-radius:10px;background:${isCurrent ? '#f4f8f5' : '#fff'}">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <strong style="font-size:0.92rem;color:var(--ink)">${st.name}</strong>
                <span style="font-size:0.7rem;background:#f1f5f9;color:#334155;padding:2px 7px;border-radius:4px;font-weight:700">${st.badge}</span>
              </div>
              <div style="font-size:0.76rem;color:var(--muted);margin-top:3px;line-height:1.35">${st.desc}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="display:flex;gap:8px">
        <button class="ghost-btn" style="flex:1;margin-top:0" onclick="closeModal()">Abbrechen</button>
        <button class="primary" style="flex:1;margin-top:0" onclick="closeModal(); openQuizModal();">🔬 Lieber Quiz machen</button>
      </div>
    </div>
  `);
}

function applySkinTypeToActiveProfile(typeId) {
  const activeP = getActiveProfile();
  const cat = activeP.category || "adult";
  const skinTypes = CATEGORY_SKIN_TYPES[cat] || CATEGORY_SKIN_TYPES.adult;
  const st = skinTypes.find(s => s.id === typeId) || skinTypes[0];

  activeP.subtitle = st.subtitle;
  activeP.tags = Array.isArray(st.tags) ? st.tags.slice() : [];
  if (!appState.profileSubtitles) appState.profileSubtitles = {};
  appState.profileSubtitles[cat] = st.subtitle;
  appState.tags = activeP.tags;

  if (cat === "adult" && st.routineId && typeof setIdealRoutineType === "function") {
    window.selectedIdealRoutineId = st.routineId;
  }

  saveState();
  closeModal();
  updateCategoryNav();
  renderMain();
  showToast(`🪵 Hauttyp auf <strong>${st.name}</strong> umgestellt!`);
}

function loadStarterRoutineForActiveProfile() {
  const activeP = getActiveProfile();
  const cat = activeP.category || "adult";
  if (cat === "adult") {
    const routineId = typeof getSelectedIdealRoutineId === "function" ? getSelectedIdealRoutineId() : "acne_barrier";
    if (typeof syncAdultRoutineToComplexity === "function") {
      syncAdultRoutineToComplexity("basis", routineId, true);
    }
  } else if (cat === "teen") {
    if (typeof loadTeenPreset === "function") loadTeenPreset();
  } else if (cat === "baby") {
    if (typeof loadBabyPreset === "function") loadBabyPreset();
  } else if (cat === "child") {
    if (typeof loadChildPreset === "function") loadChildPreset();
  }
  saveState();
  renderMain();
  const sub = (appState.profileSubtitles && appState.profileSubtitles[cat]) || "Starter-Routine";
  showToast(`🎯 Starter-Routine (${sub}) in den Schrank gestellt!`);
}

window.CATEGORY_SKIN_TYPES = CATEGORY_SKIN_TYPES;
window.renderNewProfileSkinTypesHtml = renderNewProfileSkinTypesHtml;
window.openNewProfileModal = openNewProfileModal;
window.selectNewProfileCategory = selectNewProfileCategory;
window.selectNewProfileMode = selectNewProfileMode;
window.selectNewProfileSkinType = selectNewProfileSkinType;
window.selectNewProfileCabinetFill = selectNewProfileCabinetFill;
window.submitCreateProfile = submitCreateProfile;
window.openSkinTypePickerModal = openSkinTypePickerModal;
window.applySkinTypeToActiveProfile = applySkinTypeToActiveProfile;
window.loadStarterRoutineForActiveProfile = loadStarterRoutineForActiveProfile;

// Rename Profile Modal
function openRenameProfileModal(profileId) {
  const p = appState.profiles.find(x => x.id === profileId) || getActiveProfile();
  if (!p) return;

  const catLabel = p.category === "adult" ? "Erwachsen"
    : (p.category === "teen" ? "Teenie"
    : (p.category === "child" ? "Kind" : "Baby"));
  const canDelete = (appState.profiles || []).length > 1;
  const safeId = String(p.id).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const safeName = String(p.name || "").replace(/"/g, "&quot;");

  showModalSheet(`
    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--muted);font-weight:700">Profil anpassen</div>
    <h2 style="margin:0.2rem 0 0.3rem;font-size:1.3rem">Profil bearbeiten</h2>
    <p style="font-size:0.86rem;color:var(--muted);margin:0 0 0.9rem;line-height:1.4">
      Kategorie: ${getCategoryEmoji(p.category)} <strong>${catLabel}</strong>
    </p>

    <div style="margin:0.9rem 0">
      <label for="renameProfileInput" style="display:block;font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem">Profilname</label>
      <input type="text" id="renameProfileInput" value="${safeName}" style="width:100%;padding:0.75rem 0.85rem;border:1.5px solid var(--line);border-radius:10px;font-size:0.95rem;font-family:inherit" onkeydown="if(event.key==='Enter'){ submitRenameProfile('${safeId}'); }">
    </div>

    <div style="margin:0.7rem 0 0.2rem">
      <label style="display:block;font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem">Land (Produktfilter)</label>
      <input type="hidden" id="renameCountryValue" value="${p.country || 'AT'}">
      ${typeof renderCountryPickerHtml === "function" ? renderCountryPickerHtml(p.country || 'AT', "window._setRenameCountry", { uid: "renameCountryPicker", maxHeight: "200px" }) : ""}
    </div>

    <div style="display:flex;gap:8px;margin-top:1.1rem;flex-wrap:wrap">
      <button type="button" class="ghost-btn" style="width:auto;margin-top:0;padding:0.75rem 1.2rem" onclick="closeModal()">Abbrechen</button>
      <button type="button" class="primary" style="margin-top:0;flex:1;min-width:8rem" onclick="submitRenameProfile('${safeId}')">Speichern</button>
    </div>

    <div style="margin-top:1rem;padding-top:0.9rem;border-top:1px solid var(--line)">
      ${canDelete ? `
        <button type="button" class="ghost-btn profile-delete-btn" style="width:100%;margin-top:0;padding:0.8rem 1rem;color:#b91c1c;border-color:#fecaca;font-weight:700" onclick="deleteProfile('${safeId}')">
          🗑️ Profil löschen
        </button>
        <p style="font-size:0.74rem;color:var(--muted);margin:0.45rem 0 0;line-height:1.35">Löscht dieses Profil und seinen Schrank (Erwachsener, Teenie, Kind und Baby gleich). Andere Profile bleiben.</p>
      ` : `
        <p style="font-size:0.8rem;color:var(--muted);margin:0;line-height:1.4">Mindestens ein Profil muss bleiben — deshalb gerade kein Löschen.</p>
      `}
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
  const cInp = document.getElementById("renameCountryValue");
  const p = appState.profiles.find(x => x.id === profileId);
  if (p && newName) {
    p.name = newName;
    if (cInp && cInp.value && typeof setProfileCountry === "function") {
      setProfileCountry(cInp.value, profileId);
    } else {
      if (cInp && cInp.value) p.country = String(cInp.value).toUpperCase();
      saveState();
    }
  }
  closeModal();
  updateCategoryNav();
  renderMain(false);
}

// Delete Profile
function deleteProfile(profileId) {
  try {
    if (!appState.profiles || !Array.isArray(appState.profiles)) return;
    if (appState.profiles.length <= 1) {
      alert("Das letzte Profil kann nicht gelöscht werden. Lege zuerst ein anderes an.");
      return;
    }
    const id = String(profileId || "");
    const p = appState.profiles.find(x => String(x.id) === id);
    if (!p) {
      alert("Profil wurde nicht gefunden.");
      return;
    }
    // Alle Kategorien (adult/teen/child/baby) gleich — kein Sonderfall Teenie
    const catLabel = p.category === "adult" ? "Erwachsen"
      : (p.category === "teen" ? "Teenie"
      : (p.category === "child" ? "Kind" : "Baby"));
    if (!confirm("Profil \u201e" + p.name + "\u201c (" + catLabel + ") wirklich löschen?\n\nDer Schrank dieses Profils geht verloren.")) {
      return;
    }
    const wasActive = appState.activeProfileId === id || (typeof getActiveProfile === "function" && getActiveProfile() && String(getActiveProfile().id) === id);
    appState.profiles = appState.profiles.filter(x => String(x.id) !== id);
    if (wasActive || appState.activeProfileId === id) {
      const nextP = appState.profiles[0];
      if (nextP) loadProfileToAppState(nextP);
    }
    if (typeof saveState === "function") saveState();
    if (typeof closeModal === "function") closeModal();
    if (typeof updateCategoryNav === "function") updateCategoryNav();
    if (typeof showToast === "function") showToast("Profil \u201e" + p.name + "\u201c gelöscht");
    if (appState.view === "settings" && typeof renderSettingsScreen === "function") {
      renderSettingsScreen();
    } else if (typeof renderCurrentScreen === "function") {
      renderCurrentScreen();
    } else if (typeof renderMain === "function") {
      renderMain();
    }
  } catch (err) {
    console.error("deleteProfile failed", err);
    alert("Löschen hat nicht geklappt. Bitte nochmal versuchen.");
  }
}

function getProfileCountry(profileOrId) {
  if (appState && appState.country) {
    return String(appState.country).toUpperCase();
  }
  var p = null;
  if (profileOrId && typeof profileOrId === "object") p = profileOrId;
  else if (profileOrId) p = (appState.profiles || []).find(function (x) { return x.id === profileOrId; });
  if (!p && typeof getActiveProfile === "function") p = getActiveProfile();
  var cc = (p && p.country) ? String(p.country).toUpperCase() : (appState && appState.country ? String(appState.country).toUpperCase() : "AT");
  return cc || "AT";
}

function setProfileCountry(code, profileId) {
  var cc = String(code || "AT").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) cc = "AT";

  // Global im appState setzen (einheitlich für alle Kategorien & Online-Suche)
  appState.country = cc;
  if (Array.isArray(appState.profiles)) {
    appState.profiles.forEach(function (pr) {
      pr.country = cc;
    });
  }

  saveState();
  if (typeof showToast === "function") {
    var label = typeof countryLabel === "function" ? countryLabel(cc) : cc;
    showToast("🌍 Land: <strong>" + label + " (" + cc + ")</strong> — für alle Kategorien & Online-Suche aktiv");
  }
  if (typeof renderCurrentScreen === "function") renderCurrentScreen();
  else if (typeof renderMain === "function") renderMain(false);
}

const COUNTRY_GEO_ANCHORS = {
  AT: [[48.2, 16.37], [47.07, 15.44], [47.27, 11.40], [47.81, 13.05], [46.62, 14.31], [47.5, 14.5]],
  DE: [[52.52, 13.40], [48.14, 11.58], [53.55, 9.99], [50.94, 6.96], [50.11, 8.68], [48.78, 9.18], [51.34, 12.37], [54.32, 10.13]],
  CH: [[47.38, 8.54], [46.20, 6.14], [46.95, 7.45], [46.80, 8.23]],
  IT: [[41.90, 12.50], [45.46, 9.19], [40.85, 14.27], [38.12, 13.36], [43.77, 11.25], [45.44, 12.33]],
  FR: [[48.86, 2.35], [43.30, 5.37], [45.76, 4.84], [43.60, 1.44], [44.84, -0.58], [48.57, 7.75], [50.63, 3.06]],
  ES: [[40.42, -3.70], [41.39, 2.17], [39.47, -0.38], [37.39, -5.98], [43.26, -2.93]],
  PT: [[38.72, -9.14], [41.16, -8.63], [37.02, -7.93]],
  NL: [[52.37, 4.90], [51.92, 4.48], [52.09, 5.12], [53.22, 6.57]],
  BE: [[50.85, 4.35], [51.22, 4.40], [50.46, 4.87], [50.63, 5.57]],
  LU: [[49.61, 6.13], [49.81, 6.13]],
  PL: [[52.23, 21.01], [50.06, 19.94], [51.11, 17.03], [54.35, 18.65], [52.41, 16.93]],
  CZ: [[50.08, 14.44], [49.20, 16.61], [49.83, 18.28]],
  SK: [[48.15, 17.11], [48.72, 21.26], [49.22, 18.74]],
  HU: [[47.50, 19.04], [46.25, 20.15], [47.53, 21.63]],
  SI: [[46.06, 14.51], [46.55, 15.65]],
  HR: [[45.82, 15.98], [43.51, 16.44], [45.33, 14.44], [42.65, 18.09]],
  RO: [[44.43, 26.10], [46.77, 23.60], [45.75, 21.23], [44.18, 28.65]],
  BG: [[42.70, 23.32], [42.14, 24.75], [43.21, 27.91]],
  GR: [[37.98, 23.73], [40.64, 22.94], [35.34, 25.14]],
  SE: [[59.33, 18.07], [57.71, 11.97], [55.60, 13.00], [63.83, 20.26]],
  NO: [[59.91, 10.75], [60.39, 5.32], [63.43, 10.40], [69.65, 18.96]],
  DK: [[55.68, 12.57], [56.16, 10.20], [55.40, 10.40], [57.05, 9.92]],
  FI: [[60.17, 24.94], [61.50, 23.76], [65.01, 25.47]],
  IE: [[53.35, -6.26], [51.90, -8.47], [53.27, -9.05]],
  EE: [[59.44, 24.75], [58.38, 26.73]],
  LV: [[56.95, 24.11], [55.87, 26.54]],
  LT: [[54.69, 25.28], [54.90, 23.90], [55.70, 21.14]],
  CY: [[35.19, 33.38], [34.67, 33.04]],
  MT: [[35.90, 14.51]],
  IS: [[64.15, -21.94], [65.68, -18.10]]
};

function coordsToCountryCode(lat, lon) {
  if (typeof lat !== "number" || typeof lon !== "number" || isNaN(lat) || isNaN(lon)) return "AT";
  var bestCc = null;
  var bestDist = Infinity;
  var rad = Math.PI / 180;
  for (var cc in COUNTRY_GEO_ANCHORS) {
    var points = COUNTRY_GEO_ANCHORS[cc];
    for (var i = 0; i < points.length; i++) {
      var plat = points[i][0];
      var plon = points[i][1];
      var dlat = lat - plat;
      var dlon = (lon - plon) * Math.cos(((lat + plat) / 2) * rad);
      var dist = dlat * dlat + dlon * dlon;
      if (dist < bestDist) {
        bestDist = dist;
        bestCc = cc;
      }
    }
  }
  return bestCc || "AT";
}

function detectCountryFromTimezoneOrLocale() {
  try {
    var tz = (typeof Intl !== "undefined" && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone || "" : "";
    if (tz.includes("Vienna")) return "AT";
    if (tz.includes("Berlin")) return "DE";
    if (tz.includes("Zurich")) return "CH";
    if (tz.includes("Rome")) return "IT";
    if (tz.includes("Paris")) return "FR";
    if (tz.includes("Madrid")) return "ES";
    if (tz.includes("Lisbon")) return "PT";
    if (tz.includes("Amsterdam")) return "NL";
    if (tz.includes("Brussels")) return "BE";
    if (tz.includes("Luxembourg")) return "LU";
    if (tz.includes("Warsaw")) return "PL";
    if (tz.includes("Prague")) return "CZ";
    if (tz.includes("Bratislava")) return "SK";
    if (tz.includes("Budapest")) return "HU";
    if (tz.includes("Ljubljana")) return "SI";
    if (tz.includes("Zagreb")) return "HR";
    if (tz.includes("Bucharest")) return "RO";
    if (tz.includes("Sofia")) return "BG";
    if (tz.includes("Athens")) return "GR";
    if (tz.includes("Stockholm")) return "SE";
    if (tz.includes("Oslo")) return "NO";
    if (tz.includes("Copenhagen")) return "DK";
    if (tz.includes("Helsinki")) return "FI";
    if (tz.includes("Dublin")) return "IE";
    if (tz.includes("Tallinn")) return "EE";
    if (tz.includes("Riga")) return "LV";
    if (tz.includes("Vilnius")) return "LT";
  } catch (e) {}

  try {
    var lang = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || "";
    lang = String(lang).toUpperCase();
    if (lang.includes("-AT")) return "AT";
    if (lang.includes("-DE")) return "DE";
    if (lang.includes("-CH")) return "CH";
    if (lang.includes("-IT")) return "IT";
    if (lang.includes("-FR")) return "FR";
    if (lang.includes("-ES")) return "ES";
  } catch (e) {}

  return "AT";
}

function detectCountryFromLocation(cb) {
  cb = cb || function () {};

  function fallback(reason) {
    var tzCc = detectCountryFromTimezoneOrLocale();
    setProfileCountry(tzCc);
    cb(null, tzCc, "Fallback: " + reason);
  }

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return fallback("Kein GPS im Browser");
  }

  var didRespond = false;
  var timer = setTimeout(function () {
    if (didRespond) return;
    didRespond = true;
    fallback("GPS-Timeout");
  }, 7500);

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      if (didRespond) return;
      didRespond = true;
      clearTimeout(timer);
      var lat = pos.coords.latitude;
      var lon = pos.coords.longitude;

      // 1. Präziser Offline-Distanz-Matcher über europäische Anker (sofort & synchron)
      var geoCc = coordsToCountryCode(lat, lon);
      setProfileCountry(geoCc);

      // 2. Online Reverse-Geocode API zur optionalen Ortsnamen-Veredelung (asynchron im Hintergrund)
      if (typeof fetch === "function" && window.location.protocol !== "file:") {
        try {
          var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
          var to = ctrl ? setTimeout(function () { ctrl.abort(); }, 3000) : null;
          fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat + "&longitude=" + lon + "&localityLanguage=de", {
            signal: ctrl ? ctrl.signal : undefined
          }).then(function (res) {
            if (to) clearTimeout(to);
            if (res && res.ok) return res.json();
          }).then(function (data) {
            if (data && data.countryCode && /^[A-Z]{2}$/i.test(data.countryCode)) {
              var onlineCc = data.countryCode.toUpperCase();
              if (onlineCc !== geoCc) setProfileCountry(onlineCc);
              var place = data.city || data.locality || onlineCc;
              cb(null, onlineCc, "GPS + Geocode (" + place + ")");
              return;
            }
            cb(null, geoCc, "GPS (" + lat.toFixed(2) + "°, " + lon.toFixed(2) + "°)");
          }).catch(function () {
            cb(null, geoCc, "GPS (" + lat.toFixed(2) + "°, " + lon.toFixed(2) + "°)");
          });
          return;
        } catch (e) {
          // Fallback zu direktem Callback unten
        }
      }

      cb(null, geoCc, "GPS (" + lat.toFixed(2) + "°, " + lon.toFixed(2) + "°)");
    },
    function (err) {
      if (didRespond) return;
      didRespond = true;
      clearTimeout(timer);
      fallback(err.code === 1 ? "Standortfreigabe abgelehnt" : "GPS Signal fehlt");
    },
    { timeout: 7000, enableHighAccuracy: false, maximumAge: 300000 }
  );
}

function detectCountryFromLocationUI(btnEl) {
  var origText = btnEl ? btnEl.innerHTML : "";
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = "<span>⏳</span> Standort wird ermittelt…";
  }
  var statusSpan = document.getElementById("countryLocationStatusQuiz")
    || document.getElementById("countryLocationStatusStart")
    || document.getElementById("countryLocationStatusSettings");
  if (statusSpan) statusSpan.innerText = "Frage GPS an…";

  detectCountryFromLocation(function (err, cc, source) {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = origText;
    }
    var label = typeof countryLabel === "function" ? countryLabel(cc) : cc;
    if (statusSpan) {
      statusSpan.innerText = "✅ " + label + " (" + cc + ") [" + source + "]";
    }
    if (typeof showToast === "function") {
      showToast("📍 Standort aktiv: <strong>" + label + " (" + cc + ")</strong><br><small style='opacity:0.9'>" + source + " — für alle Kategorien & Online-Suche</small>");
    }
    if (typeof window !== "undefined" && window._quizCountryStepActive && typeof renderQuizCountryStep === "function") {
      renderQuizCountryStep();
    } else if (typeof renderCurrentScreen === "function") {
      renderCurrentScreen();
    } else if (typeof renderStartScreen === "function") {
      renderStartScreen();
    }
  });
}

function shouldHideUnknownCountries() {
  // Default aus (false): unklare Herkunft einblenden — siehe land-filter.md / dach1
  return appState.hideUnknownCountries === true;
}

function setHideUnknownCountries(on) {
  appState.hideUnknownCountries = !!on;
  saveState();
}

function toggleHideUnknownCountries() {
  setHideUnknownCountries(!shouldHideUnknownCountries());
  if (typeof showToast === "function") {
    showToast(shouldHideUnknownCountries()
      ? "Unklare Herkunft ausgeblendet"
      : "Unklare Herkunft eingeblendet (Badge „Land offen“)");
  }
  const modal = document.getElementById("modalContainer");
  const modalOpen = modal && modal.innerHTML && modal.innerHTML.trim().length > 0;
  if (modalOpen) {
    // Liste im offenen Sheet neu aufbauen, ohne Modal zu schließen
    if (typeof window._refreshOpenCountryFilteredList === "function") {
      window._refreshOpenCountryFilteredList();
    }
    return;
  }
  if (typeof renderCurrentScreen === "function") renderCurrentScreen();
}

function countryLabel(code) {
  var cc = String(code || "").toUpperCase();
  if (typeof PROFILE_COUNTRY_OPTIONS !== "undefined") {
    var opt = PROFILE_COUNTRY_OPTIONS.find(function (o) { return o.code === cc; });
    if (opt) return opt.label;
  }
  return cc || "—";
}



// ==========================================
// SHARE / EXPORT / IMPORT (Tester → Prim)
// Freiwillig, lokal — kein Cloud-Backend
// ==========================================

var KOKORO_EXPORT_VERSION = 1;

function _kokoroCategoryLabel(cat) {
  if (cat === "teen") return "Teenie";
  if (cat === "child") return "Kind";
  if (cat === "baby") return "Baby";
  return "Erwachsen";
}

function _kokoroProductDisplayName(id) {
  if (!id) return "";
  var p = null;
  if (typeof resolveProfileCabinetProduct === "function") {
    try { p = resolveProfileCabinetProduct(id); } catch (e) { p = null; }
  }
  if (!p && typeof DB === "object" && DB) p = DB[id];
  if (!p && typeof TEEN_DB === "object" && TEEN_DB) p = TEEN_DB[id];
  if (!p && typeof BABY_DB === "object" && BABY_DB) p = BABY_DB[id];
  if (!p && appState && appState.customProducts) p = appState.customProducts[id];
  if (!p) return String(id);
  var brand = (p.brand || "").toString().trim();
  var name = (p.name || "").toString().trim();
  var label = (brand + " " + name).trim();
  return label || String(id);
}

function _kokoroNamesFromIds(ids, limit) {
  var max = (typeof limit === "number") ? limit : 12;
  var out = [];
  (ids || []).forEach(function (id) {
    if (out.length >= max) return;
    var n = _kokoroProductDisplayName(id);
    if (n) out.push(n);
  });
  return out;
}

function _kokoroShelfLinesForActive() {
  var lines = [];
  var p = (typeof getActiveProfile === "function") ? getActiveProfile() : null;
  var cat = (p && p.category) || appState.profile || "adult";
  if (cat === "adult") {
    var am = _kokoroNamesFromIds(appState.am || []);
    var pmKey = "pm_" + (appState.pmMode || "a");
    var pm = _kokoroNamesFromIds(appState[pmKey] || appState.pm_a || []);
    if (am.length) lines.push("Morgen: " + am.join(", "));
    if (pm.length) lines.push("Abend: " + pm.join(", "));
  } else if (cat === "baby") {
    var b = appState.baby || {};
    ["reiniger", "creme", "windel", "spf"].forEach(function (slot) {
      var names = _kokoroNamesFromIds(b[slot] || []);
      if (names.length) lines.push(slot.charAt(0).toUpperCase() + slot.slice(1) + ": " + names.join(", "));
    });
  } else if (cat === "child") {
    var c = appState.child || {};
    ["reiniger", "creme", "spf", "haar"].forEach(function (slot) {
      var names = _kokoroNamesFromIds(c[slot] || []);
      if (names.length) lines.push(slot.charAt(0).toUpperCase() + slot.slice(1) + ": " + names.join(", "));
    });
  } else if (cat === "teen") {
    var t = appState.teen || {};
    ["reiniger", "active", "creme", "spf"].forEach(function (slot) {
      var names = _kokoroNamesFromIds(t[slot] || []);
      if (names.length) lines.push(slot.charAt(0).toUpperCase() + slot.slice(1) + ": " + names.join(", "));
    });
  }
  return lines;
}

function buildKokoroShareText() {
  if (typeof syncActiveProfileFromWorkingState === "function") {
    try { syncActiveProfileFromWorkingState(); } catch (e) {}
  }
  var p = (typeof getActiveProfile === "function") ? getActiveProfile() : null;
  var now = new Date();
  var dateStr = now.toLocaleDateString("de-AT", { year: "numeric", month: "2-digit", day: "2-digit" });
  var cat = (p && p.category) || appState.profile || "adult";
  var name = (p && p.name) || _kokoroCategoryLabel(cat);
  var subtitle = (p && p.subtitle) || "";
  var country = (typeof getProfileCountry === "function")
    ? getProfileCountry()
    : (appState.country || (p && p.country) || "AT");
  var countryName = (typeof countryLabel === "function") ? countryLabel(country) : country;
  var tags = [];
  if (p && Array.isArray(p.tags) && p.tags.length) tags = p.tags.slice();
  else if (Array.isArray(appState.tags)) tags = appState.tags.slice();

  var lines = [];
  lines.push("Kokoro – Profil");
  lines.push("Datum: " + dateStr);
  lines.push("");
  lines.push("Profil: " + name + " (" + _kokoroCategoryLabel(cat) + ")");
  if (subtitle) lines.push("Anliegen: " + subtitle);
  lines.push("Land: " + countryName + " (" + String(country).toUpperCase() + ")");
  if (tags.length) {
    lines.push("Quiz / Tags: " + tags.join(", "));
  }
  var shelves = _kokoroShelfLinesForActive();
  if (shelves.length) {
    lines.push("");
    lines.push("Schrank (Namen):");
    shelves.forEach(function (s) { lines.push("· " + s); });
  }
  lines.push("");
  lines.push("Kokoro Demo — nur Einkauf & Layering");
  return lines.join("\n");
}

function buildKokoroExportObject() {
  if (typeof syncActiveProfileFromWorkingState === "function") {
    try { syncActiveProfileFromWorkingState(); } catch (e) {}
  }
  return {
    version: KOKORO_EXPORT_VERSION,
    app: "kokoro",
    exportedAt: new Date().toISOString(),
    appState: {
      activeProfileId: appState.activeProfileId,
      profiles: appState.profiles,
      country: appState.country,
      hideUnknownCountries: appState.hideUnknownCountries,
      profile: appState.profile,
      view: appState.view,
      tab: appState.tab,
      tags: appState.tags,
      routineComplexity: appState.routineComplexity,
      babyComplexity: appState.babyComplexity,
      childComplexity: appState.childComplexity,
      teenComplexity: appState.teenComplexity,
      profileSubtitles: appState.profileSubtitles,
      am: appState.am,
      pm_a: appState.pm_a,
      pm_b: appState.pm_b,
      pm_c: appState.pm_c,
      pmMode: appState.pmMode,
      useSkinCycling: appState.useSkinCycling,
      baby: appState.baby,
      child: appState.child,
      teen: appState.teen,
      customProducts: appState.customProducts || {}
    }
  };
}

function _kokoroCopyTextFallback(text) {
  return new Promise(function (resolve, reject) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(resolve).catch(function () {
          _kokoroCopyViaTextarea(text) ? resolve() : reject(new Error("clipboard"));
        });
        return;
      }
    } catch (e) {}
    if (_kokoroCopyViaTextarea(text)) resolve();
    else reject(new Error("clipboard"));
  });
}

function _kokoroCopyViaTextarea(text) {
  try {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return !!ok;
  } catch (e) {
    return false;
  }
}

function shareKokoroProfil() {
  var text = buildKokoroShareText();
  var finishCopy = function () {
    _kokoroCopyTextFallback(text).then(function () {
      if (typeof showToast === "function") showToast("Kopiert — in WhatsApp einfügen");
    }).catch(function () {
      if (typeof showToast === "function") showToast("Teilen nicht möglich — bitte manuell kopieren");
    });
  };
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      var p = navigator.share({ title: "Kokoro Profil", text: text });
      if (p && typeof p.then === "function") {
        p.then(function () {
          if (typeof showToast === "function") showToast("Profil geteilt");
        }).catch(function (err) {
          if (err && (err.name === "AbortError" || err.name === "NotAllowedError")) return;
          finishCopy();
        });
        return;
      }
    } catch (e) {
      finishCopy();
      return;
    }
  }
  finishCopy();
}

function downloadKokoroExport() {
  try {
    var obj = buildKokoroExportObject();
    var json = JSON.stringify(obj, null, 2);
    var blob = new Blob([json], { type: "application/json;charset=utf-8" });
    var now = new Date();
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1).padStart(2, "0");
    var d = String(now.getDate()).padStart(2, "0");
    var filename = "kokoro-profil-" + y + m + d + ".json";
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) {} }, 1500);
    if (typeof showToast === "function") showToast("Export gespeichert: " + filename);
  } catch (e) {
    console.warn("downloadKokoroExport", e);
    if (typeof showToast === "function") showToast("Export fehlgeschlagen");
  }
}

function isValidKokoroExport(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  if (data.version != null && typeof data.version !== "number" && typeof data.version !== "string") return false;
  if (data.app != null && data.app !== "kokoro") return false;
  var s = data.appState;
  if (s == null && (Array.isArray(data.profiles) || data.activeProfileId || data.am || data.baby || data.tags)) {
    s = data;
  }
  if (!s || typeof s !== "object" || Array.isArray(s)) return false;
  if (Array.isArray(s.profiles)) return true;
  if (s.activeProfileId || s.am || s.pm_a || s.baby || s.child || s.teen || Array.isArray(s.tags)) return true;
  return false;
}

function _kokoroReinjectCustomProducts(customs) {
  if (!customs || typeof customs !== "object") return;
  Object.keys(customs).forEach(function (cid) {
    var cprod = customs[cid];
    if (!cprod) return;
    if (typeof sanitizeProductPriceFields === "function") sanitizeProductPriceFields(cprod);
    if (typeof enrichProductClasses === "function") enrichProductClasses(cprod);
    if (typeof DB === "object" && DB) DB[cid] = cprod;
    if (typeof TEEN_DB === "object" && TEEN_DB && !TEEN_DB[cid]) {
      TEEN_DB[cid] = Object.assign({}, cprod, {
        slot: cprod.kat === "reiniger" ? "reiniger" : (cprod.kat === "spf" ? "spf" : (cprod.kat === "serum" || cprod.kat === "active" ? "active" : "creme"))
      });
    }
    if (typeof BABY_DB === "object" && BABY_DB && !BABY_DB[cid]) {
      BABY_DB[cid] = Object.assign({}, cprod, {
        slot: cprod.kat === "reiniger" ? "reiniger" : (cprod.kat === "spf" ? "spf" : "creme")
      });
    }
  });
  if (typeof enrichAllDbProducts === "function") {
    try { enrichAllDbProducts(); } catch (e) {}
  }
}

function applyImportedKokoroAppState(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return false;
  var keys = [
    "activeProfileId", "profiles", "country", "hideUnknownCountries", "profile",
    "view", "tab", "tags", "routineComplexity", "babyComplexity", "childComplexity",
    "teenComplexity", "profileSubtitles", "am", "pm_a", "pm_b", "pm_c", "pmMode",
    "useSkinCycling", "baby", "child", "teen", "customProducts"
  ];
  keys.forEach(function (k) {
    if (snapshot[k] !== undefined) appState[k] = snapshot[k];
  });
  if (!appState.baby) appState.baby = { reiniger: [], creme: [], windel: [], spf: [] };
  if (!appState.child) appState.child = { reiniger: [], creme: [], spf: [], haar: [] };
  if (!appState.teen) appState.teen = { reiniger: [], active: [], creme: [], spf: [] };
  if (!appState.customProducts || typeof appState.customProducts !== "object") appState.customProducts = {};
  if (!appState.country) appState.country = "AT";
  else appState.country = String(appState.country).toUpperCase();
  if (Array.isArray(appState.profiles)) {
    appState.profiles.forEach(function (pr) { pr.country = appState.country; });
  }
  _kokoroReinjectCustomProducts(appState.customProducts);
  var activeP = (typeof getActiveProfile === "function") ? getActiveProfile() : null;
  if (activeP && typeof loadProfileToAppState === "function") {
    loadProfileToAppState(activeP);
  }
  return true;
}

function importKokoroExport(file) {
  if (!file) {
    if (typeof showToast === "function") showToast("Keine Datei gewählt");
    return;
  }
  var reader = new FileReader();
  reader.onload = function () {
    try {
      var raw = String(reader.result || "");
      var data = JSON.parse(raw);
      if (!isValidKokoroExport(data)) {
        if (typeof showToast === "function") showToast("Ungültige Kokoro-Datei");
        return;
      }
      var snapshot = data.appState || data;
      if (!confirm("Vorhandenes Profil und Schrank mit der Datei überschreiben?\n\n(Daten bleiben lokal — Teilen war freiwillig.)")) {
        return;
      }
      applyImportedKokoroAppState(snapshot);
      if (typeof saveState === "function") saveState();
      if (typeof updateCategoryNav === "function") updateCategoryNav();
      if (typeof renderCurrentScreen === "function") renderCurrentScreen();
      else if (appState.view === "settings" && typeof renderSettingsScreen === "function") renderSettingsScreen();
      else if (typeof renderMain === "function") renderMain();
      if (typeof showToast === "function") showToast("Profil importiert");
    } catch (e) {
      console.warn("importKokoroExport", e);
      if (typeof showToast === "function") showToast("Import fehlgeschlagen — Datei prüfen");
    }
  };
  reader.onerror = function () {
    if (typeof showToast === "function") showToast("Datei konnte nicht gelesen werden");
  };
  reader.readAsText(file);
}

window.buildKokoroShareText = buildKokoroShareText;
window.buildKokoroExportObject = buildKokoroExportObject;
window.shareKokoroProfil = shareKokoroProfil;
window.downloadKokoroExport = downloadKokoroExport;
window.importKokoroExport = importKokoroExport;
window.isValidKokoroExport = isValidKokoroExport;


window.openRenameProfileModal = openRenameProfileModal;
window.submitRenameProfile = submitRenameProfile;
window.deleteProfile = deleteProfile;
window.getProfileCountry = getProfileCountry;
window.setProfileCountry = setProfileCountry;
window.coordsToCountryCode = coordsToCountryCode;
window.detectCountryFromTimezoneOrLocale = detectCountryFromTimezoneOrLocale;
window.detectCountryFromLocation = detectCountryFromLocation;
window.detectCountryFromLocationUI = detectCountryFromLocationUI;
window.shouldHideUnknownCountries = shouldHideUnknownCountries;
window.setHideUnknownCountries = setHideUnknownCountries;
window.toggleHideUnknownCountries = toggleHideUnknownCountries;
window.countryLabel = countryLabel;

function showToast(msg) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "toast-container";
    document.body.appendChild(toast);
  }
  toast.innerHTML = msg;
  if (typeof applyI18n === "function") applyI18n(toast);
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
  if (typeof applyI18n === "function") applyI18n(container);
}

function closeModal() {
  if (typeof stopBarcodeScanner === "function") {
    stopBarcodeScanner();
  }
  document.getElementById("modalContainer").innerHTML = "";
}


// Initiales Laden aus localStorage
loadState();