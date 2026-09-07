// ==========================================
// Main Application Module (Router & Navigation)
// ==========================================

function switchScreen(screenName) {
  if (screenName === "welcome") screenName = "start";
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

  if (view === "start" || view === "welcome") {
    renderStartScreen(container);
  } else if (view === "scan") {
    renderScanScreen(container);
  } else if (view === "settings") {
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

  // 2. Synchronize Category Nav
  updateCategoryNav();

  // 3. Render Current Screen
  renderCurrentScreen();
  updateBottomNav();

  // 4. Load CSVs in Background
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