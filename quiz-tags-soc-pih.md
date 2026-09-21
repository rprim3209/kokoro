# Quiz-Tags: Phototyp / PIH / Concerns (Spec)

Stand: 2026-09-20  
Status: Teilweise verdrahtet (2026-09-20) — Schnell-Concerns Start + Reiz-Budget-Karte + Eisenoxid-Lücke im Typ-Regal  
Editorial: Keine Diagnose, keine Therapie, kein Wirksamkeitsversprechen. Nur Einkauf & Layering.

## Ziel

Fünf klare Quiz-Tags als **Shopping-Constraints**, damit Scan/Schrank/Alternativen besser passen — besonders Skin of Color, PIH und Begleitpflege.

## Grundregeln für alle Tags

- Formulierung im Quiz: Alltagsprache, optional, abwählbar
- Intern: stabile Tag-Keys (siehe unten)
- UI-Copy immer: „Keine Diagnose — hilft nur bei Produktwahl & Layering.“
- Keine Krankheitsnamen als Diagnose-Label (kein „du hast Rosazea/Psoriasis“)

## Die 5 Tags

### 1. `skin-of-color`

**Quiz-Text (Vorschlag):**  
„Meine Haut wird eher dunkel / ich habe mehr Melanin (Phototyp eher IV–VI).“

**Zweck:** Photoprotektion & Reizvermeidung priorisieren.

**Produktregeln (Soll):**
- LSF 50+ priorisieren
- Plus für Eisenoxid / getönten LSF (`iron-oxide-prio` koppeln oder ableiten)
- Starke AHA (v. a. Glykol) → Warnung / Reiz-Budget
- Kein Therapie-Claim bei Pigment

**Bestehende Hooks:** Tag-Aliase in `rules.js` (`skin-of-color`, fitzpatrick, fototyp, soc)

---

### 2. `pih-prone`

**Quiz-Text:**  
„Nach Pickeln oder Reizung bleiben oft dunkle Flecken (Pickelmale).“

**Zweck:** Einkauf Richtung pigmentfreundlicher, reizarmer Routinen.

**Produktregeln (Soll):**
- Produkte mit PIH-relevanten Actives (z. B. Azelain, Niacinamid) → „passt zum Ziel“ (einkaufsseitig)
- Reizung vermeiden: Parfüm, doppelte Säuren, Retinoid+Säure-Stack
- LSF im Verdict hervorheben
- Oft kombiniert mit Tag 1, aber auch allein möglich

**Bestehende Hooks:** `pih-prone`, `candidate.pih`, Regeln `pih_acid_caution` / `pih_target_match`

---

### 3. `akne-prone`

**Quiz-Text:**  
„Ich neige zu Unreinheiten / Akne (ohne aktuelle Arzt-Therapie).“

**Zweck:** NC-Preference und sinnvolle Layering-Warnungen.

**Produktregeln (Soll):**
- Soft-Pref nicht-komedogen (NC)
- BHA / milde Retinoide / Niacinamid ok im Layering-Kontext
- same-class Stacking warnen
- Wenn zystisch / Rx → Tag 5 statt oder zusätzlich

**Bestehende Hooks:** `akne-prone`, Soft-Prefs in `rules.js`

---

### 4. `sensibel` + `barrier`

**Quiz-Text:**  
„Meine Haut brennt leicht, spannt oder verträgt wenig.“

**Zweck:** Reiz-Budget und Barriere-Support.

**Produktregeln (Soll):**
- Soft-Pref parfümfrei
- Ceramide / Panthenol / milde Reiniger hoch gewichten
- Retinoid+Säure und Mehrfach-Peelings → Warnung/Konflikt
- Strenger bei Begleitpflege

**Bestehende Hooks:** `sensibel`, `barrier` / `barriere-fragil`

---

### 5. `arzt-thema` (+ optional `begleitpflege`)

**Quiz-Text:**  
„Ich bin in dermatologischer Behandlung oder nutze ein Rx-Mittel (z. B. Adapalen, BPO).“

**Zweck:** Kein Kosmetik-Active-Upsell; Fokus Basispflege.

**Produktregeln (Soll):**
- Kein Serum-/Active-Upsell
- Fokus: Reiniger, Feuchte, LSF
- Barrierestress sichtbar machen
- Copy: App ersetzt keinen Arzt

**Bestehende Hooks:** `arzt-thema`, `filterAltsForArztThema`, Begleitpflege-Guard

---

## Bewusst nicht in v1

- Diagnose-Tags für Rosazea, Psoriasis, Ekzem, Vitiligo
- Hautfarbe als „Rasse“-Dropdown
- Therapiepläne oder Absetzen von Rx

Optional später: weicher Concern `roetungsempfindlich` ohne Krankheitsname.

## Quiz-Flow (Soll)

1. Land (schon vorhanden)
2. Kategorie Alter (Erwachsener/Teen/…)
3. Optional: Phototyp/SOC (Tag 1)
4. Wenn Tag 1 oder Akne: PIH-Frage (Tag 2)
5. Akne-prone vs. Arzt-Thema (3 vs. 5, gegenseitig klar trennen)
6. Sensibel/Barriere (Tag 4)
7. Soft-Prefs (Parfümfrei, NC) nur vorschlagen, nicht erzwingen

Max. 1–2 Haupt-Concerns als starke Filter; Rest optional.

## Umsetzung später (nicht Teil dieser Spec-Datei)

- Quiz-Fragen in `js/screens/quiz.js`
- Tag → Soft-Prefs Sync
- Verdict-Glossar-Texte (nicht-diagnostisch)
- Testdaten: 3 Produkte je Tag (passt / eher nicht)

## Abnahmekriterien

- [ ] Tags speichern sich im Profil
- [ ] Scan-Verdict ändert sich sichtbar mit Tag 1/2/5
- [ ] Kein Text klingt nach Diagnose oder Heilung
- [ ] Arzt-Thema blockt Active-Upsell