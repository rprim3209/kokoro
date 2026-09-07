# To-do: Demo gut stehen — nächste Schritte

Stand: 2026-09-05

## Erledigt
- [x] Leichte App-Struktur
- [x] Start-Screen
- [x] Verdict einheitlich
- [x] UTF-8 / Umlaute (UI)
- [x] Schrank + Typ-Regal Smoke-Test
- [x] Scan + Live-dm Smoke-Test
- [x] Speichern lokal (`localStorage` key `schrank`: load/save; Leeren ruft `saveState`)
- [x] Daten ehrlich: Flags (NC / CF / parfümfrei) nur bei Quellen-Nachweis; sonst transparent „offen“; 985 Produkte aus `katalog-produkte.csv` validiert
- [x] Leicht aufräumen: README (Server starten, Screen-Überblick, „Demo steht, wenn…“), `.bak` in `archiv/` aufgeräumt

---

## Status: Demo steht!
Alle Kernpunkte für „Demo gut“ sind vollständig erfüllt:
1. **Speichern hält:** Lokale Persistenz (`localStorage`) für Schrank, Routinen und Profil.
2. **Flags sind ehrlich:** Kein Raten — transparente Ausweisung von Quellen bzw. „offen“.
3. **Ordner & README aufgeräumt:** Saubere Modularisierung, keine losen Backups, lückenlose Doku.

---

## Demo steht, wenn
Flags sind ehrlich und der Ordner/README ist aufgeräumt.

## Nicht jetzt
Fotos, Cloud, Impressum, Hosting, App-Store
