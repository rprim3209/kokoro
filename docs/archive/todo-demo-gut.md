# To-do: Demo gut stehen — nächste Schritte

Stand: 2026-09-08

## Erledigt
- [x] App-Struktur, Start, Verdict, UTF-8, Schrank/Scan-Smoke, Speichern
- [x] Flag-Audit + Mini-Fixes (dm-Live/Pilot → offen, Custom-Checkbox, FF-offen-Text, server NC-Mapping)

## Als Nächstes (Flags ehrlich zu Ende)
- [x] Baby/Teen-UI: `=== true` / `=== false` / sonst **offen** (nicht `p.cf ?`)
- [x] Hardcoded Fallback-DBs: `nc/cf/ff: false` → `null`
- [x] CSV: `no` ohne `*_basis` als offen behandeln/schreiben
- [x] Baby `u3 || true` entfernen

## Danach
- [x] Verdict-Copy auf 1 Blick schärfen (Prominente Status-Pill, klare 'Warum?'-Begründung, Timing-Chip)
- [x] 10–20 dm-EANs Happy-Path (20 echte dm-EANs verifiziert, kein unbegründetes false)
- [x] Leicht aufräumen (README aktuell, `.bak` & `eu_catalog.js` in archiv/)

## Nicht jetzt
Fotos-Marathon, Cloud, App-Store, Skin-Bliss nachbauen

## Theory verdrahtet (2026-09-08)
- [x] `verdict-glossar` Helpers: normalizeOutcome, formatVerdictOneLook, worstWins, hasTag
- [x] Soft-Prefs pref_nc / duftstofffrei auto + abwählbar
- [x] Zu-dir Constraints (Parfüm×sensibel, Baby-Parfüm, Feuchte soft, Arzt-Upsell)
- [x] Scan ohne Schrank (noch nicht prüfbar, kein Fake-Konflikt)
- [x] Reiz-Budget Nacht/Tag; Adapalen×BPO ≠ inactivate
- [x] Arzt-Thema Scan verifiziert/behalten
- [ ] Voller INCI/CosIng-Parser (bewusst STUB — nur Katalog-Hooks)
