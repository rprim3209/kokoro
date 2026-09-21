// ==========================================
// Main Application Module (Router & Navigation)
// ==========================================

function switchScreen(screenName) {
  if (typeof stopBarcodeScanner === "function") stopBarcodeScanner();
  if (screenName === "welcome") screenName = "start";
  const allowed = ["start", "cabinet", "scan", "settings"];
  if (!allowed.includes(screenName)) screenName = "start";
  appState.view = screenName;
  saveState();
  updateCategoryNav();
  updateBottomNav();
  renderCurrentScreen();
}

function renderCurrentScreen() {
  const container = document.getElementById("appContent");
  if (!container) return;

  const view = appState.view || "cabinet";
  const allowed = ["start", "welcome", "cabinet", "scan", "settings"];
  const safeView = allowed.includes(view) ? view : "start";
  if (safeView !== view) appState.view = safeView;

  if (safeView === "start" || safeView === "welcome") {
    renderStartScreen(container);
  } else if (safeView === "scan") {
    renderScanScreen(container);
  } else if (safeView === "settings") {
    renderSettingsScreen(container);
  } else {
    // Default: cabinet
    renderMain(false);
  }
}

function updateBottomNav() {
  const view = appState.view || "cabinet";
  const tabs = ["start", "cabinet", "scan", "settings"];
  tabs.forEach(t => {
    const btn = document.getElementById("navTab_" + t);
    if (!btn) return;
    const isAct = (t === view) || (t === "start" && view === "welcome");
    btn.classList.toggle("active", isAct);
    
    // Category accent color for active cabinet tab
    btn.classList.remove("tab-teen", "tab-child", "tab-baby");
    if (isAct && appState.profile) {
      if (appState.profile === "teen") btn.classList.add("tab-teen");
      if (appState.profile === "child") btn.classList.add("tab-child");
      if (appState.profile === "baby") btn.classList.add("tab-baby");
    }
  });
}

// In renderMain, ensure updateBottomNav is also triggered:
const originalRenderMain = window.renderMain;

// App initialization on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State Load
  if (typeof loadState === "function") {
    loadState();
  }
  // Klassen-Heuristik für Seeds + gespeicherte Custom-Produkte
  if (typeof enrichAllDbProducts === "function") {
    enrichAllDbProducts();
  }

  // Ensure view is valid so we never land in a broken screen
  const allowed = ["start", "welcome", "cabinet", "scan", "settings"];
  if (!appState.view || !allowed.includes(appState.view)) {
    appState.view = "start";
  }

  // 2–3. Sync nav + render — never block catalog load if render throws
  try {
    updateCategoryNav();
    renderCurrentScreen();
    updateBottomNav();
  } catch (err) {
    console.error("[app] Initial render failed:", err);
    try {
      if (typeof showToast === "function") {
        showToast("Anzeige-Fehler — Katalog wird trotzdem geladen.");
      }
    } catch (_) {}
  }

  // 4. Load CSVs in Background — ALWAYS run, even if render threw
  if (typeof loadKatalogFromCSV === "function") {
    loadKatalogFromCSV();
  }
  if (typeof loadDmPilotFromCSV === "function") {
    loadDmPilotFromCSV();
  }

  // 5. Wire Header Events
  const brand = document.querySelector(".brand");
  if (brand) {
    brand.onclick = () => switchScreen("start");
  }

  const guardBtn = document.getElementById("btnGuardInfo");
  if (guardBtn) {
    guardBtn.onclick = () => {
      if (typeof openGuardModal === "function") openGuardModal();
    };
  }

  const statusBadge = document.getElementById("katalogStatusBadge");
  if (statusBadge) {
    statusBadge.onclick = () => {
      if (typeof showKatalogStatusModal === "function") showKatalogStatusModal();
    };
  }
});

if (typeof window !== "undefined") {
  window.switchScreen = switchScreen;
  window.renderCurrentScreen = renderCurrentScreen;
  window.updateBottomNav = updateBottomNav;
}
