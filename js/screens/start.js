// ==========================================
// Start / Begrüßungs-Screen
// ==========================================

function selectStartCategory(cat) {
  if (typeof switchProfile === "function") {
    switchProfile(cat);
  } else {
    appState.profile = cat;
  }
  appState.view = "start";
  if (typeof saveState === "function") saveState();
  if (typeof updateCategoryNav === "function") updateCategoryNav();
  renderStartScreen();
}

function renderStartScreen(container) {
  if (!container) container = document.getElementById("appContent");
  if (!container) return;

  const currentProf = appState.profile || "adult";
  const sub = typeof getProfileSubtitle === "function" ? getProfileSubtitle(currentProf) : "";

  const catMeta = {
    adult: {
      name: "Erwachsener",
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

  container.innerHTML = `
    <div class="welcome-box">
      <div style="display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--ok);background:var(--ok-bg);padding:3px 9px;border-radius:99px;margin-bottom:0.6rem">
        <span>🌿</span> Evidenzbasierter Routine-Check · DACH
      </div>
      
      <h1 style="font-family:'Iowan Old Style', Palatino, Georgia, serif;font-size:1.6rem;font-weight:700;line-height:1.2;margin:0 0 0.5rem;letter-spacing:-0.02em">
        Schluss mit Fehlkäufen & Reiz-Chaos.
      </h1>
      
      <p style="font-size:0.92rem;color:var(--muted);line-height:1.45;margin:0 0 1rem">
        Prüfe deine Kosmetik in Sekunden auf Reiz-Stacking, Lücken und echte Verträglichkeit. Neutral, unabhängig & ohne Verkaufsabsicht.
      </p>

      <!-- Profil- & Kategoriewahl: Sichtbar, aber kompakt & nicht im Weg -->
      <div style="margin-bottom:1.15rem;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:9px 12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-size:0.74rem;font-weight:700;text-transform:uppercase;color:var(--muted);letter-spacing:0.04em">
            Kategorie wählen:
          </span>
          <span style="font-size:0.74rem;color:var(--muted);font-weight:600">
            Aktiv: <strong>${meta.icon} ${meta.name}</strong>
          </span>
        </div>

        <div class="start-pills-row">
          <button type="button" class="start-pill-btn ${currentProf === 'adult' ? 'active' : ''}" onclick="selectStartCategory('adult')">
            👤 Erwachsener
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

        <div style="font-size:0.77rem;color:var(--muted);line-height:1.35;margin-top:4px">
          ${sub ? `<strong>${sub}</strong> · ` : ''}${meta.focus}
        </div>
      </div>

      <!-- Die zwei klaren Wege: Schrank füllen vs. Quiz -->
      <div style="display:flex;flex-direction:column;gap:4px">
        <!-- Hauptaktion 1: Schrank füllen -->
        <div class="start-action-card primary" onclick="switchScreen('cabinet')">
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
        </div>

        <!-- Hauptaktion 2: 1-Minuten-Quiz -->
        <div class="start-action-card secondary" onclick="openQuizModal()">
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
        </div>
      </div>

      <!-- Sekundär-Aktion: Direkt Scan -->
      <div style="text-align:center;margin-top:1.1rem;padding-top:0.85rem;border-top:1px solid var(--line)">
        <button class="btn-text" style="font-size:0.84rem;color:var(--muted);font-weight:600" onclick="switchScreen('scan')">
          📷 Oder Barcode direkt im Laden scannen →
        </button>
      </div>

      <div style="text-align:center;margin-top:1.2rem;font-size:0.75rem;color:var(--muted)">
        ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
      </div>
    </div>
  `;
}

// Alias for backward compatibility
function renderWelcome(container) {
  renderStartScreen(container);
}