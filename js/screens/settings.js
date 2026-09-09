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
                ${escapeHtml(p.name)} ${isActive ? '<span style="font-size:0.7rem;color:var(--ok);font-weight:700">(Aktiv)</span>' : ''}
              </div>
              <div style="font-size:0.74rem;color:var(--muted)">
                ${p.category === 'adult' ? 'Erwachsener' : (p.category === 'teen' ? 'Teenie' : (p.category === 'child' ? 'Kind' : 'Baby'))} · ${escapeHtml(p.subtitle || '')} · 🌍 ${escapeHtml(p.country || 'AT')}
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
        <span>🌍 Land & Verfügbarkeit</span>
      </div>
      <p style="font-size:0.82rem;color:var(--muted);margin:0 0 0.55rem;line-height:1.4">
        Aktives Profil: <strong>${typeof countryLabel==="function" ? countryLabel(typeof getProfileCountry==="function" ? getProfileCountry() : "AT") : (typeof getProfileCountry==="function" ? getProfileCountry() : "AT")}</strong>.
        Katalog und Vorschläge zeigen nur Produkte, die laut <code>eu_countries</code> hier vorkommen (oder <code>EU</code>).
      </p>
      ${typeof renderCountryPickerHtml === "function" ? renderCountryPickerHtml((typeof getProfileCountry==="function" ? getProfileCountry() : "AT"), "setProfileCountry", { uid: "settingsCountryPicker", maxHeight: "280px" }) : (typeof renderCountryChipsHtml === "function" ? renderCountryChipsHtml((typeof getProfileCountry==="function" ? getProfileCountry() : "AT"), "setProfileCountry") : "")}
      <div style="margin-top:0.7rem;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <label style="font-size:0.8rem;color:var(--ink);display:flex;align-items:center;gap:6px;cursor:pointer">
          <input type="checkbox" ${typeof shouldHideUnknownCountries==="function" && shouldHideUnknownCountries() ? "checked" : ""} onchange="setHideUnknownCountries(this.checked); renderSettingsScreen();">
          Unklare Herkunft ausblenden
        </label>
        <span style="font-size:0.72rem;color:var(--muted)">Standard: an — Produkte ohne Land-Angabe verstecken</span>
      </div>
      <p style="font-size:0.72rem;color:var(--muted);margin:0.55rem 0 0;line-height:1.35">
        Hinweis: Live-dm-Suche bleibt der <strong>Deutschland-Shop</strong>. Bei Land ≠ DE erscheint ein ehrlicher Badge.
      </p>
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

    <div class="settings-section">
      <div class="settings-title">
        <span>🔒 Datenschutz & Privatsphäre</span>
      </div>
      <div style="font-size:0.82rem;color:var(--muted);line-height:1.5">
        <p style="margin:0 0 0.6rem">
          <strong>Privacy by Design:</strong> Deine Hautbedürfnisse und Routinen gehören dir allein.
        </p>
        <ul style="margin:0;padding-left:1.2rem">
          <li><strong>📷 Kamera:</strong> Bildverarbeitung läuft zu 100 % lokal im Browser. Kein Videobild wird gespeichert oder übertragen.</li>
          <li><strong>💾 Speicherort:</strong> Schrank und Profile liegen ausschließlich im <code>localStorage</code> deines Endgeräts. Keine Cloud.</li>
          <li><strong>🔍 dm-Suche:</strong> Überträgt nur den Suchbegriff oder die EAN zur Produktdaten-Abfrage — niemals persönliche Profildaten.</li>
          <li><strong>🚫 Zero Tracking:</strong> Keine Tracking-Cookies, keine Werbenetzwerke, keine externen Analyse-Dienste.</li>
        </ul>
        <div style="margin-top:0.8rem;display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="ghost-btn" style="width:auto;margin-top:0;padding:0.45rem 0.9rem;font-size:0.8rem" onclick="openPrivacyModal()">
            📜 Datenschutz-Notiz lesen ➔
          </button>
          <button type="button" class="ghost-btn" style="width:auto;margin-top:0;padding:0.45rem 0.9rem;font-size:0.8rem" onclick="openImpressumModal()">
            ⚖️ Impressum anzeigen ➔
          </button>
        </div>
      </div>
    </div>
  `;
}

function openPrivacyModal() {
  const modalHTML = `
    <div style="padding:1rem 1.1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem">
        <div style="font-family:'Iowan Old Style', Georgia, serif;font-size:1.3rem;font-weight:700">
          🔒 Datenschutz & Privatsphäre
        </div>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>

      <div style="font-size:0.82rem;color:var(--muted);line-height:1.45;margin-bottom:1rem">
        Transparenz nach DSGVO & Grundsatz der Datensparsamkeit: Wie diese Anwendung deine Privatsphäre schützt.
      </div>

      <div style="display:flex;flex-direction:column;gap:10px">
        <!-- 1. Kamera -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:0.8rem">
          <div style="font-weight:700;font-size:0.88rem;color:#0f172a;display:flex;align-items:center;gap:6px">
            <span>📷</span> 1. Kamera-Zugriff (Barcode-Scanner)
          </div>
          <div style="font-size:0.78rem;color:var(--muted);line-height:1.4;margin-top:4px">
            Die Kamera dient ausschließlich der optischen Erfassung von EAN-Strichcodes. Die Erkennung erfolgt über die native BarcodeDetector-API <strong>zu 100 % lokal auf deinem Gerät</strong>. Es werden niemals Videobilder aufgezeichnet, gespeichert oder übertragen. Der Stream stoppt sofort beim Schließen oder Erkennen.
          </div>
        </div>

        <!-- 2. localStorage -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:0.8rem">
          <div style="font-weight:700;font-size:0.88rem;color:#0f172a;display:flex;align-items:center;gap:6px">
            <span>💾</span> 2. Lokale Speicherung (localStorage)
          </div>
          <div style="font-size:0.78rem;color:var(--muted);line-height:1.4;margin-top:4px">
            Alle Daten (Morgen-/Abend-Routine, Profile, Hauttyp-Quiz) werden ausschließlich lokal im <code>window.localStorage</code> deines Browsers gespeichert. Es gibt keinen Cloud-Speicher, keinen Server-Abgleich und keinen Account-Zwang. Ein Klick auf „Gesamten Schrank zurücksetzen“ löscht alle Daten rückstandslos.
          </div>
        </div>

        <!-- 3. dm-Abfragen -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:0.8rem">
          <div style="font-weight:700;font-size:0.88rem;color:#0f172a;display:flex;align-items:center;gap:6px">
            <span>🔍</span> 3. Produktsuche & dm-Abfragen
          </div>
          <div style="font-size:0.78rem;color:var(--muted);line-height:1.4;margin-top:4px">
            Der Offline-Katalog mit über 980 Produkten funktioniert komplett ohne Internetverbindung. Nutzt du die Live-Suche nach neuen Produkten, wird nur der eingegebene Text oder die EAN an die öffentliche dm-Schnittstelle gesendet. Es werden <strong>keine persönlichen Profildaten, Hautzustände oder Routinen</strong> übertragen.
          </div>
        </div>

        <!-- 4. Zero Tracking -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:0.8rem">
          <div style="font-weight:700;font-size:0.88rem;color:#0f172a;display:flex;align-items:center;gap:6px">
            <span>🚫</span> 4. Keine Tracking-Cookies & keine Analyse
          </div>
          <div style="font-size:0.78rem;color:var(--muted);line-height:1.4;margin-top:4px">
            Kein Google Analytics, kein Meta-Pixel, keine Werbe-Netzwerke, keine externen CDNs.
          </div>
        </div>
      </div>

      <div style="margin-top:1.2rem;display:flex;flex-direction:column;gap:8px">
        <button class="primary" onclick="closeModal()">Verstanden</button>
        <div style="font-size:0.75rem;color:var(--muted);text-align:center;margin-top:4px">
          ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
        </div>
      </div>
    </div>
  `;
  showModalSheet(modalHTML);
}

function openImpressumModal() {
  const modalHTML = `
    <div style="padding:1rem 1.1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem">
        <div style="font-family:'Iowan Old Style', Georgia, serif;font-size:1.3rem;font-weight:700">
          ⚖️ Impressum & Rechtliche Hinweise
        </div>
        <button class="btn-text" onclick="closeModal()" style="font-size:1.2rem;color:var(--muted);padding:0 4px">✕</button>
      </div>

      <div style="font-size:0.82rem;color:var(--muted);line-height:1.45;margin-bottom:1rem">
        Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) & § 5 E-Commerce-Gesetz (ECG Österreich)
      </div>

      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:0.8rem">
          <div style="font-weight:700;font-size:0.88rem;color:#0f172a;margin-bottom:4px">
            Dienstanbieter & Betreiber
          </div>
          <div style="font-size:0.78rem;color:var(--muted);line-height:1.4">
            <strong>Kosmetikschrank (Kokoro)</strong><br>
            Open-Source-Projekt zur evidenzbasierten Hautpflege-Transparenz<br>
            GitHub: <a href="https://github.com/rprim3209/kokoro" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline">github.com/rprim3209/kokoro</a>
          </div>
        </div>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:0.8rem">
          <div style="font-weight:700;font-size:0.88rem;color:#0f172a;margin-bottom:4px">
            Medizinischer & kosmetischer Disclaimer
          </div>
          <div style="font-size:0.78rem;color:var(--muted);line-height:1.4">
            Die App dient ausschließlich der neutralen Verbraucherinformation sowie der Unterstützung beim Einkauf und Layering frei verkäuflicher Kosmetika. Die Inhalte stellen <strong>keine medizinische Therapie, Diagnose oder Heilbehandlung</strong> dar und ersetzen nicht den Besuch einer Fachärztin oder eines Facharztes.
          </div>
        </div>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:0.8rem">
          <div style="font-weight:700;font-size:0.88rem;color:#0f172a;margin-bottom:4px">
            Haftung für Inhalte & Links
          </div>
          <div style="font-size:0.78rem;color:var(--muted);line-height:1.4">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte verantwortlich. Für externe Links zu Webseiten Dritter (z. B. Herstellerseiten oder OpenBeautyFacts) übernehmen wir keine Haftung; für deren Inhalte ist stets der jeweilige Anbieter verantwortlich.
          </div>
        </div>
      </div>

      <div style="margin-top:1.2rem;display:flex;flex-direction:column;gap:8px">
        <button class="primary" onclick="closeModal()">Schließen</button>
        <div style="font-size:0.75rem;color:var(--muted);text-align:center;margin-top:4px">
          ⚖️ ${window.APP_DISCLAIMER || "Keine Therapie — dein Ratgeber für Einkauf & Layering."}
        </div>
      </div>
    </div>
  `;
  showModalSheet(modalHTML);
}

if (typeof window !== "undefined") {
  window.openPrivacyModal = openPrivacyModal;
  window.openImpressumModal = openImpressumModal;
}