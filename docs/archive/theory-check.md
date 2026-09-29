# Theory-Check: was sitzt, was fehlt (vor dem Scan)

Stand: 2026-09-08  
Fokus: Theorie — nicht UI, nicht Scan-Bau.

## Was schon solide ist
- **Frame:** Einkauf + Layering, keine Therapie/Leitlinien
- **Whitelist:** Actives mit Chemie + Studienlage + EU-Regeln
- **Konfliktmatrix:** Codes, Priorität, Clienzo/Adapalen-Wechsel
- **Schrank-Modell:** AM/PM, Schritte, Wechsel-Slots
- **Katalog-Logik:** Scannen breit ≠ Vorschläge kuratiert
- **Baby/Jugend:** Phase 2, eigene Regeln (nicht Erwachsenen-NC als Baby-Filter)

## Was fehlt / wackelt (wichtig zuerst)

### Blocker vor echtem Scan
1. **Tag-Liste fehlt** — Quiz erzeugt viele Tags, aber unklar: welche steuern das Urteil, welche nur Text?
2. **INCI → Klasse** nicht spezifiziert — wann ist etwas „Active“, wann nur Spur? Was mit aPAD vs. Azelain?
3. **Verdict-Sprache dreifach** — Editorial („Umbauen“) ≠ Matrix-Codes ≠ Demo („eher nicht“). Ein Glossar fehlt.
4. **Leerer Schrank** — was sagt der Scan, wenn noch nichts im Schrank ist?
5. **Tagesreiz** — z. B. Clienzo morgens + Adapalen abends = viel Active; kein klarer Regel-Code.

### Kleinere Widersprüche
6. Editorial vs. Whitelist bei BPO (kosmetisch vs. AM)
7. Drei verschiedene Onboarding-Weichen (Quiz / MVP / README)
8. Manche Vorschlags-Texte klingen zu sehr nach Wirkung
9. Baby/Jugend-Daten schon groß — Engine zuerst Erwachsen halten

### Theory vs. Code
`rules.js` kennt vor allem Hardcodes (Adapalen, Clienzo, Retinol) — **nicht** die volle Matrix. Demo ≠ Theory. Scan nicht auf Hardcodes weiterbauen, Specs zuerst schließen.

## Vor Scan klären
1. Tags + Quiz-Mapping
2. Verdict-Glossar (eine Sprache)
3. INCI-Klassifikator (Spur, Derivate)
4. Scan ohne Schrank
5. Reiz-Budget (Tageslast)
6. Verhalten bei „Arzt-Thema“ / zystisch
7. Editorial/Seed-Texte bereinigen

## Vorgeschlagene Reihenfolge (Theory-Todos)
1. `constraints-v1.md` — kanonische Tags
2. `verdict-glossar.md` — Codes → Nutzertext → Ampel
3. `inci-klassifikator.md`
4. `scan-ohne-schrank.md`
5. `reiz-budget.md`
6. `arzt-thema-scan.md`
7. Editorial-Cleanup — danach erst `rules.js` an Matrix koppeln

## Nicht jetzt
UI-Politur, alle Grenzfall-Stoffe, Händlerfeeds, Baby-Engine vertiefen

## Code-Stand nach Theory-Pass (2026-09-08)

Specs 1–6 geschrieben; Demo verdrahtet modular in `js/rules.js` (+ Quiz Soft-Prefs, Scan 3 Dimensionen).

| Spec | Status im Code |
|---|---|
| constraints-v1 Soft-Prefs / Zu dir | verdrahtet |
| verdict-glossar Ampel + Worst wins | verdrahtet |
| scan-ohne-schrank | verdrahtet |
| reiz-budget | verdrahtet (Heuristik) |
| arzt-thema-scan | verdrahtet (verify) |
| inci-klassifikator | **STUB** — Hooks auf klassen/kat/ff/nc; kein CosIng-Parser |

Hardcodes Adapalen/Clienzo-Wechsel-Slots bleiben; Matrix-Vollabdeckung folgt später ohne Monolith-Rückfall.
