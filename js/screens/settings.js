// ==========================================
// Settings Screen Module (Einstellungen & Profile)
// ==========================================

function renderSettingsScreen(container) {
  if (!container) container = document.getElementById("appContent");
  if (!container) return;

  const activeP = getActiveProfile();

  let profileCardsHtml = "";
  if (appState.profiles && appState.profiles.length > 0) {
    appState.profiles.forEach(p => {
      const isActive = p.id === activeP.id;
      const emoji = getCategoryEmoji(p.category);
      profileCardsHtml += `
        <div class="profile-manage-card ${isActive ? 'active-profile' : ''}">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:1.4rem">${emoji}</span>
            <div>
              <div style="font-weight:700;font-size:0.92rem">
                ${escapeHtml(p.name)} ${isActive ? '<span style="font-size:0.7rem;color:#206845;font-weight:700">(Aktiv)</span>' : ''}
              </div>
              <div style="font-size:0.74rem;color:var(--muted)">
                ${p.category === 'adult' ? 'Erwachsener' : (p.category === 'teen' ? 'Teenie' : (p.category === 'child' ? 'Kind' : 'Baby'))} · ${escapeHtml(p.subtitle || '')}
              </div>
            </div>
          </div>
          <div style="display:flex;gap:6px">
            ${!isActive ? `<button class="ghost-btn" style="width:auto;margin-top:0;padding:0.4rem 0.8rem;font-size:0.78rem" onclick="switchProfile('${p.id}'); renderSettingsScreen()">Aktivieren</button>` : ''}
            <button class="ghost-btn" style="width:auto;margin-top:0;padding:0.4rem 0.6rem;font-size:0.78rem" onclick="openRenameProfileModal('${p.id}')" title="Umbenennen">✏️</button>
            ${appState.profiles.length > 1 ? `<button class="ghost-btn" style="width:auto;margin-top:0;padding:0.4rem 0.6rem;font-size:0.78rem;color:#b91c1c;border-color:#fecaca" onclick="if(confirm('Profil löschen?')){ deleteProfile('${p.id}'); renderSettingsScreen(); }" title="Löschen">🗑️</button>` : ''}
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = `
    <div class="settings-section">
      <div class="settings-title">
        <span>👤 Profile & Kategorien</span>
        <button class="primary" style="width:auto;margin-top:0;padding:0.35rem 0.75rem;font-size:0.75rem" onclick="openNewProfileModal()">
          ➕ Neues Profil
        </button>
      </div>
      <p style="font-size:0.82rem;color:var(--muted);margin:0 0 0.8rem;line-height:1.4">
        Verwalte mehrere Profile für dich und deine Familie. Jedes Profil besitzt seinen eigenen isolierten Schrank.
      </p>
      ${profileCardsHtml}
    </div>

    <div class="settings-section">
      <div class="settings-title">
        <span>📊 Daten & Katalog</span>
      </div>
      <div style="font-size:0.84rem;color:var(--muted);line-height:1.5">
        <p style="margin:0 0 0.6rem">
          Status: <strong id="settingsKatalogStatus">${window.katalogStatus && window.katalogStatus.mode === 'live' ? '🟢 Live-Katalog (' + (window.katalogStatus.count || 985) + ' Produkte)' : '⚡ Offline-Fallback (896 Produkte)'}</strong>
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="ghost-btn" style="width:auto;margin-top:0;padding:0.5rem 0.9rem;font-size:0.82rem" onclick="loadKatalogFromCSV(); showToast('Katalog wird neu geladen...')">
            🔄 CSV-Katalog aktualisieren
          </button>
          <button class="ghost-btn" style="width:auto;margin-top:0;padding:0.5rem 0.9rem;font-size:0.82rem" onclick="showKatalogStatusModal()">
            ℹ️ Status-Details
          </button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-title">
        <span>⚠️ Schrank-Verwaltung</span>
      </div>
      <p style="font-size:0.82rem;color:var(--muted);margin:0 0 0.8rem;line-height:1.4">
        Setzt alle Schränke, Routinen und benutzerdefinierten Profile auf die Standard-Auslieferung zurück.
      </p>
      <button class="ghost-btn" style="width:auto;margin-top:0;padding:0.55rem 1.1rem;font-size:0.84rem;color:#b91c1c;border-color:#fecaca" onclick="if(confirm('Möchtest du den gesamten Schrank wirklich zurücksetzen?')){ resetSchrank(); renderSettingsScreen(); showToast('Schrank wurde zurückgesetzt'); }">
        🗑️ Gesamten Schrank zurücksetzen
      </button>
    </div>

    <div class="settings-section">
      <div class="settings-title">
        <span>📚 Leitlinien & Evidenz</span>
      </div>
      <div style="font-size:0.82rem;color:var(--muted);line-height:1.5">
        <p style="margin:0 0 0.5rem">Die Empfehlungen und Checks dieser Demo basieren auf folgenden Quellen:</p>
        <ul style="margin:0;padding-left:1.2rem">
          <li><strong>Erwachsene:</strong> Deutsche Dermatologische Gesellschaft (S2k-Leitlinie Akne, Rosazea) & AAD Guideline</li>
          <li><strong>Teenie:</strong> AAD Adolescent Skincare Guidelines & Leitlinien-Trio</li>
          <li><strong>Kinder & Säuglinge:</strong> EU-Kosmetikverordnung 1223/2009 Anhang I Teil B, EDQM Pediatric Guideline & DGKJ</li>
        </ul>
        <div style="margin-top:0.85rem;padding:8px 12px;background:var(--paper);border-radius:8px;border:1px solid var(--line);font-size:0.78rem;color:var(--muted);text-align:center">
          ⚖️ <strong>Disclaimer:</strong> ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
        </div>
      </div>
    </div>
  `;
}