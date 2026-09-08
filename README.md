# Kosmetikschrank — Evidenzbasierter Routine- & Schrank-Wächter

Schluss mit Fehlkäufen & Reiz-Chaos. Prüfe deine Kosmetikprodukte in Sekunden auf Reiz-Stacking, Lücken und echte Verträglichkeit. Neutral, unabhängig & ohne Verkaufsabsicht.

> **Demo steht, wenn:** Speichern hält (lokal via `localStorage`), Flags sind ehrlich (Quellennachweis oder transparent „offen“), Ordner und README sind aufgeräumt.
>
> **Haltung:** Einkauf und Layering erleichtern. Keine Therapie — dein Ratgeber für Einkauf & Layering.

---

## 🚀 Schnellstart & Server starten

### 1. Server starten

Für die vollständige Funktionalität inklusive **Live-dm-Produktsuche** und dynamischem Laden des 985-Produkte-Katalogs wird ein lokaler Server empfohlen:

- **Empfohlen (1-Klick unter Windows):**  
  Doppelklick auf `start-server.bat`
- **Im Terminal (mit dm-Live-Proxy):**  
  `python server.py` (Port 8787)
- **Alternative (Offline / Nur statischer Webserver):**  
  `python -m http.server 8000` oder in PowerShell `./server.ps1`

### 2. Im Browser öffnen

- **Mit `server.py`:** [http://127.0.0.1:8787/demo.html](http://127.0.0.1:8787/demo.html) (oder direkt [http://127.0.0.1:8787/](http://127.0.0.1:8787/))
- **Mit statischem Webserver:** [http://localhost:8000/demo.html](http://localhost:8000/demo.html)

---

## 📱 Screen-Überblick

Die Demo ist modular in vier klare Kern-Bereiche aufgeteilt:

1. **Start (`Start`)**:
   - **Profilauswahl:** Direkte Wahl zwischen `👤 Erwachsener`, `🧑‍🦱 Teenie`, `🧒 Kind` und `👶 Baby`.
   - **Schnelleinstieg:** Wahl zwischen direktem Sprung in den Schrank oder dem **1-Minuten-Hautquiz** mit gezielter Triage.

2. **Mein Schrank (`Schrank`)**:
   - **Routinen-Übersicht:** Klare Trennung in Morgen- und Abend-Routine.
   - **Reiz-Stacking-Wächter:** Automatische Erkennung problematischer Wirkstoff-Kombinationen (z. B. Adapalen/Retinoide + Säuren).
   - **Typ-Regal & Begleitpflege:** Evidenzbasierte Empfehlungen für den gewählten Hauttyp — Produkte vergleichen und mit einem Klick in die eigene Routine übernehmen.
   - **Budget-Optimierer:** Routine nach vorgegebenem Drogerie-Budget (z. B. 20 €, 30 €, 50 €) evidenzbasiert zusammenstellen und per 1-Klick übernehmen.

3. **Scan & Verdict (`Scan`)**:
   - **Eingabe-Möglichkeiten:** Barcode per Kamera scannen oder EAN-Code/Produktname manuell suchen (inkl. Live-dm-Suche).
   - **Einheitliches Drei-Stufen-Verdict:**
     - 🟢 **passt** (Harmoniert mit der Routine und erfüllt die gewählten Kriterien)
     - 🟡 **eher nicht** (Parfümiert oder nur mit Vorsicht im Wechsel / Skin Cycling anzuwenden)
     - 🔴 **Konflikt** (Gefahr von Reiz-Stacking oder Überreizung der Hautbarriere)
   - **Transparente Begründung:** Jedes Verdict erklärt im Detail das *Warum* und zeigt ehrliche Flags.

4. **Einstellungen (`Einstellungen`)**:
   - **Profil-Verwaltung:** Hauttyp und Kriterien-Filter (z. B. Parfümfreiheit, Cruelty-Free) anpassen.
   - **Schrank leeren:** Bereinigt alle Produkte mit Sicherheitsabfrage und persistiert den leeren Zustand im Browser.

---

## 📁 Struktur der App

```
Kosmetikschrank/
│
├── demo.html               # Schlanker HTML-Einstiegspunkt (< 85 Zeilen)
├── index.html              # Web-Root Alias (identisch zu demo.html)
│
├── css/
│   ├── style.css           # Globales Design, Variablen, Karten, Modals & Verdict-Banner
│   └── screens.css         # Spezifische Screen-Layouts & Bottom-Navigation
│
├── js/
│   ├── catalog.js          # Master-Katalog (985 Produkte), Live-dm Proxy & Fallbacks
│   ├── state.js            # Zentrale State-Verwaltung (appState, Migration, localStorage)
│   ├── rules.js            # INCI-Check, Prognose & einheitliches Drei-Stufen-Verdict
│   ├── ideal-routines.js   # Typ-Regale für alle 4 Kategorien (Adult, Teenie, Kind, Baby)
│   │
│   ├── screens/
│   │   ├── start.js        # Startseite: Schrank öffnen vs. 1-Minuten-Quiz
│   │   ├── cabinet.js      # Schrank-Screen, Routinen, Typ-Regal & Begleitpflege
│   │   ├── scan.js         # Dedicated Scan-Screen, Barcode-Kamera & EAN-Suche
│   │   ├── settings.js     # Profil-Verwaltung & Schrank leeren
│   │   └── quiz.js         # Triage-Fragebögen für alle Kategorien
│   │
│   └── app.js              # Router, Bottom-Navigation & Initialisierung
│
├── archiv/                 # Historische Monolith-Backups (.bak)
│
├── katalog-produkte.csv    # Master-Katalog (985 Produkte mit Quellen-Nachweisen)
├── server.py               # Lokaler Python-Server (Port 8787 mit /api/dm-search Proxy)
├── server.ps1              # Lokaler PowerShell-Server (Port 8000)
├── start-server.bat        # 1-Klick-Starter für Windows
└── todo-demo-gut.md        # To-do- und Status-Tracking
```

---

## 🔬 Evidenz & Datenqualität

- **Ehrliche Flags:** Kriterien (`🌸 Parfümfrei`, `🛡️ Nicht-Komedogen`, `🐰 Cruelty-Free`) werden nur bei nachgewiesener Quellenbasis als positiv/negativ ausgewiesen. Liegt kein Nachweis vor, bleibt das Kriterium transparent als **offen** gekennzeichnet.
- **Lokal & Persistent:** Alle Änderungen am Schrank und Profil werden sofort und dauerhaft im Browser (`localStorage`) gespeichert. Kein Account, keine Cloud, kein Tracking.
- **Saubere Codierung:** 100% reines UTF-8 ohne externe Framework-Abhängigkeiten.

---

## Theory 2026-09-08 — verdrahtet in der Demo

Specs (Quelle der Wahrheit, unverändert): `constraints-v1.md`, `verdict-glossar.md`, `scan-ohne-schrank.md`, `reiz-budget.md`, `arzt-thema-scan.md`, `inci-klassifikator.md`.

**In Code (`js/rules.js` + Quiz/Scan):**
- Kanonische Ampel **passt | eher nicht | Konflikt** + Worst-wins über Zu dir / Zum Schrank / Slot
- Soft-Prefs: bei `Sensibel` → Chip **Parfümfrei**, bei `Akne-prone` → Chip **NC-Preference** (abwählbar per Tippen ×)
- Parfüm × sensibel = **eher nicht**; Baby + Parfüm = **Konflikt**; fehlendes NC ≠ Konflikt
- Leerer Schrank: Scan ok; Zum Schrank „noch nicht prüfbar“; keine Fake-Layering-Konflikte
- Reiz-Budget: Nacht-Stack ≥ Schwelle → Konflikt; Tag Clienzo AM + Adapalen PM → eher nicht (bei Begleitpflege+Barriere schärfer); **Adapalen×BPO ist nicht inactivate**
- Arzt-Thema: kein Active-Upsell (bereits vorhanden, verifiziert)
- INCI: nur Lightweight-Hooks auf `klassen`/`kat`/`ff`/`nc` — **voller CosIng-Parser STUB**

### Kurz testen (Prim)
1. `start-server.bat` → http://127.0.0.1:8787/demo.html
2. Quiz Adult: Sensibel + Akne-prone → Chips Parfümfrei & NC-Preference; × entfernt Soft-Pref
3. Schrank leeren → Scan Support-Produkt → passt/Zu dir, Zum Schrank „noch nicht prüfbar“
4. Baby-Profil + parfümiertes Produkt (`ff: false`) → Konflikt
5. Adapalen PM + Clienzo AM im Schrank → Prognose/Scan „eher nicht“ Tageslast; gleicher PM-Abend → Konflikt; nie „inactivate“-Copy für Adapalen×BPO
6. Arzt-Thema-Tag + Serum-Scan → Konflikt, keine Active-Alternativenliste
