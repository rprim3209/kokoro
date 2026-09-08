# Verdict-Glossar v1

**Stand:** 2026-09-08 (Europe/Vienna)  
**App:** Prim’s Kosmetikschrank  
**Zweck:** Eine Ampel-Sprache für Editorial, Konfliktmatrix und Demo-UI.  
**Verwandt:** `editorial.md`, `konfliktmatrix.md`, `schrank-modell.md`, `constraints-v1.md`, `theory-check.md`.

---

## 1. Zweck / Non-Goals

### Zweck
- Shopping- und Layering-Helper: Produkt gegen **dich**, gegen **deinen Schrank**, gegen den **Slot** prüfen.
- Eine kanonische Ampel: **passt** | **eher nicht** | **Konflikt**.
- Jeden Matrix-Code und jedes Constraint-Signal auf genau **eine** Nutzerzeile + Dimension mappen.
- Demo-Labels (`passt` / `eher nicht` / `Konflikt`) und Editorial-Sprache vereinheitlichen.

### Non-Goals
- Keine Therapie, kein Schema, keine Leitlinien als App-Befehl.
- Keine Dosis, kein „mach das so“, keine Heilversprechen.
- Keine Garantie (non-comedogenic, hypoallergen, 100 % verträglich).
- Kein Rx-Verkauf / „lass dir X verschreiben“.
- Unsicherheit **nicht** als harte Unverträglichkeit verkaufen.

---

## 2. Kanonische 3 Outcomes + Kurz-Copy

| ID | Nutzertext (1 Blick) | Farbe | Wann |
|---|---|---|---|
| `passt` | **passt** | 🟢 | Kein hartes Missmatch; Produkt darf in Frage kommen |
| `eher_nicht` | **eher nicht** | 🟡 | Weiches Missmatch / Umbau / Wechsel — kaufbar mit Grund |
| `konflikt` | **Konflikt** | 🔴 | Hartes Missmatch: Stacking, Inaktivierung, Redundanz, Baby-Parfüm, Active-Upsell bei Arzt-Thema |

### 1-Blick-Template (immer Outcome + 1 Grund)

```
🟢 passt — {ein kurzer Grund}
🟡 eher nicht — {ein kurzer Grund}
🔴 Konflikt — {ein kurzer Grund}
```

Beispiele:
- `🟢 passt — Harmoniert mit deiner Routine und deinen Tags.`
- `🟡 eher nicht — Nicht am selben Abend wie dein Retinoid.`
- `🔴 Konflikt — Zwei Retinoide: mehr Reiz ohne Zusatznutzen.`

Detail (Zu dir / Zum Schrank / Slot) und Alternativen: **einen Tap** entfernt.  
Immer darunter: Disclaimer (§8).

---

## 3. Drei Dimensionen — und wie sie kombiniert werden

Aus `schrank-modell.md` + `constraints-v1.md`:

| # | Dimension | Steuert | Quelle |
|---|---|---|---|
| 1 | **Zu dir** | Tags ↔ Produktflags (Duft, Textur, Prefs, Profil) | `constraints-v1.md` |
| 2 | **Zum Schrank** | Klassen × Klassen (Layering / Chemie / Redundanz) | `konfliktmatrix.md` |
| 3 | **Slot** | AM/PM, Schritt, Wechsel-Modus, Platzierung | `schrank-modell.md` |

### Kombinationsregel (Gesamt-Ampel)

**Worst wins** über die drei Dimensionen:

```
Konflikt  >  eher nicht  >  passt
```

1. Liefert **irgendeine** Dimension `Konflikt` → Gesamt = **Konflikt**.
2. Sonst, liefert irgendeine `eher nicht` → Gesamt = **eher nicht**.
3. Sonst → **passt**.

Zusatzregeln:
- Innerhalb **Zum Schrank** gilt die Matrix-Prio  
  (`not_cosmetic` > `inactivate` > `same_class` > `skip_stack` > `alternate_days` > `begleit_barrier` > `uv` / `bleach`).
- Soft-Prefs (`pref_nc`, `pref_cf`, fehlender NC-Claim) **eskalieren nie** zu Konflikt.
- Parfüm bei `sensibel` (± auto-`duftstofffrei`) = **eher nicht**, nicht Konflikt  
  (Ausnahme Baby / künftige Allergie-Tags — siehe §5).
- **Slot** allein erzeugt selten Konflikt; meist Placement-Hinweis („nur an freien Abenden“, „morgens statt abends“). Slot-Hinweise können den Gesamtstatus auf `eher nicht` heben, wenn der Kandidat nur mit Umbau passt.
- UI zeigt weiterhin **drei Zeilen** (Zu dir / Zum Schrank / Slot); die Ampel oben ist die Worst-wins-Zusammenfassung.

---

## 4. Matrix-Code → Outcome-Mapping

Status-Spalte = kanonisches Nutzer-Outcome. Dimension = wo die Zeile erscheint.

| Code | Outcome | Dimension | Nutzerzeile (Klartext) |
|---|---|---|---|
| `ok` | **passt** | Zum Schrank | Kein bekannter harter Konflikt auf Stoffebene. |
| `alternate_days` | **eher nicht** | Zum Schrank + Slot | Geht, aber an **getrennten Tagen** (z. B. Peeling-Nacht vs. Retinoid-Nacht). |
| `split` | **eher nicht** | Zum Schrank + Slot | Nicht in dieselbe Anwendung: eines morgens, eines abends. |
| `skip_stack` | **Konflikt** | Zum Schrank | Zwei starke Reizstoffe am selben Abend — Barriererisiko. |
| `inactivate` | **Konflikt** | Zum Schrank | Chemie: einer zerstört/oxidiert den anderen (z. B. BPO + klassisches Tretinoin). |
| `same_class` | **Konflikt** | Zum Schrank | Gleiche Wirkstoffklasse schon im Schrank — mehr Reiz ohne Zusatznutzen. |
| `resistance` | **eher nicht** | Zum Schrank | Topisches Antibiotikum ohne BPO — Resistenzthema, **ärztlich klären** (kein App-Schema). |
| `not_cosmetic` | **Konflikt**\* | Zum Schrank | Arzneimittelstoff / nicht als Gesichts-Kosmetik verkaufen — nur erkennen. |
| `begleit_barrier` | **eher nicht** | Zu dir + Zum Schrank | Begleitpflege: aggressive Alkohole/Duftstoffe stressen die Barriere neben Rx. |
| `uv` | **eher nicht**\*\* | Slot / Hinweis | Macht lichtempfindlicher — Tagsüber LSF mitdenken (Hinweis, kein Kauf-Verbot). |
| `bleach` | Hinweis (Ampel unberührt) | Hinweis | BPO bleicht Textilien/Kissen — Praxis-Hinweis. |
| `barrier_stress` (Klasse) | **eher nicht** / **Konflikt** | Zu dir (+ Schrank bei Rx) | Aggressive Alkohole / ätherische Öle: bei `sensibel`/`barrier` eher nicht; bei Baby oder harter Begleitpflege ggf. Konflikt. |

\* `not_cosmetic`: Kauf als Leave-on-Gesichts-Kosmetik = **Konflikt**. Reine Schrank-Erkennung (Rx schon drin) = Info-Zeile, Ampel nicht zwingend rot.  
\*\* `uv`: allein hebt nicht auf Konflikt; kombiniert mit fehlendem SPF-Slot → **eher nicht** (wie Demo-Warnung).

### Schnellmap Editorial ↔ Matrix ↔ Demo

| Editorial (alt) | Matrix-Codes (typisch) | Demo / kanonisch |
|---|---|---|
| Passt so | `ok` | **passt** |
| Geht, aber umbauen | `alternate_days`, `split`, `begleit_barrier`, `uv`, soft Constraints | **eher nicht** |
| Lieber nicht | `skip_stack`, `inactivate`, `same_class`, hartes `not_cosmetic` | **Konflikt** |

---

## 5. Constraint-Tags → „Zu dir“ (Beispiele)

Aus `constraints-v1.md` Entscheidungen Prim (2026-09-08). Soft-Prefs sind Chips, abwählbar.

| Situation | Outcome Zu dir | Kurzgrund (Nutzer) |
|---|---|---|
| `sensibel` + fragrance-free | **passt** | Parfümfrei — passt zu deiner sensiblen Haut. |
| `sensibel` + Parfüm / Annex-Duftallergene Leave-on | **eher nicht** | Enthält Duftstoffe — bei sensibler Haut oft Reiz. |
| `sensibel` + auto-`duftstofffrei` + Leave-on-Duft | **eher nicht** | Du willst Duft meiden — dieses Produkt hat Parfüm. |
| `profil_baby` + Parfüm | **Konflikt** | Für unter 3: parfümierte Leave-ons meiden. |
| künftig: bestätigte Duftallergie-Tag | **Konflikt** | Duftallergie-Tag gesetzt — Parfüm hart meiden. |
| `akne-prone` + `flag_nc` | **passt** (Claim) | Hat NC-Claim — Herstellerangabe, keine Garantie. |
| `akne-prone` / `pref_nc` **ohne** `flag_nc` | **passt** / neutral | Kein NC-Claim — **kein** Konflikt, nur kein Bonus. |
| `pref_nc` Soft (auto bei `akne-prone`) | Sortierung | Vorschläge mit NC nach oben; Chip abwählbar. |
| `duftstofffrei` Soft (auto bei `sensibel`) | Sortierung / eher nicht | Parfüm → eher nicht; Chip abwählbar. |
| `pref_cf` ohne CF-Siegel | neutral | Nur Preference-Sortierung, kein Konflikt. |
| `trocken` + sehr matt/ölig-leicht Leave-on | **eher nicht** | Sehr mattierend — für trockene Haut oft zu wenig Pflege. |
| `oelig` + sehr reich/occlusiv | **eher nicht** | Sehr reichhaltig — für ölige Haut oft zu schwer. |
| `barrier` + Alcohol Denat. hoch / EO | **eher nicht** | Extra Reizstoff bei strapazierter Barriere. |
| `begleitpflege` + Parfüm/EO/Alcohol Denat. | **eher nicht** | Neben Rx-Wirkstoff lieber milde, reizarme Begleitpflege. |
| `arzt-thema` + Active-Upsell / „stärkere“ Seren | **Konflikt** | Kein Active-Shop-Upsell — Arzt-Thema erkannt. |
| `arzt-thema` + Reiniger/Creme/SPF | **passt** möglich | Basispflege weiter scannen ok. |
| `profil_teen` + `not_for_minors` (Anti-Aging-Retinol) | **eher nicht** | Für Jugendliche nicht als Default-Vorschlag. |
| `profil_baby` ohne `flag_under3_intended` | **eher nicht** / **Konflikt** je nach Stoff | Unter-3-Eignung prüfen; Parfüm = Konflikt. |

**Härte-Merksatz:** Soft Prefs und Unsicherheit → **eher nicht** oder neutral. **Konflikt** sparsam: Baby-Parfüm, Arzt-Thema-Upsell, harte Matrix-Codes.

---

## 6. Leerer Schrank / Scan-First

Wenn noch **kein** Produkt im Schrank liegt:

> **Scan geht trotzdem.** Urteil zuerst **Zu dir** (Tags/Profil). Schrank-Zeile: „Noch kein Schrank — nur Hauttyp-Check. Speichern & später vervollständigen.“

- Kein erfundenes Layering-Verdict gegen leere Slots.
- Optional 1 Triage: „Nutzt du abends starke Wirkstoffe?“ → Soft-Leit-Active für Sofort-Check (siehe `schrank-modell.md` Scan-First).
- Ausführliche Spec: künftig **`scan-ohne-schrank.md`** (Theory-Check Blocker #4).

Demo-heute (`rules.js`): leerer Schrank = Info „Füge Produkte hinzu…“ — Glossar ersetzt das durch Scan-First-Einzeiler oben.

---

## 7. Deprecated Synonyms → kanonisch

| Alt / intern / Demo | Nicht mehr als Nutzer-Ampel | Kanonisch |
|---|---|---|
| Passt so | Editorial | **passt** |
| Geht, aber umbauen / umbauen | Editorial | **eher nicht** |
| Lieber nicht | Editorial | **Konflikt** |
| `lieber_nicht` (schrank-modell alt) | Spec-Wort | **Konflikt** |
| `wechsel` | schrank-modell Kurzlabel | **eher nicht** (+ Code `alternate_days`/`split` im Detail) |
| `warn` / status `"warn"` | `rules.js` intern | **eher nicht** |
| `no` / status `"no"` | `rules.js` intern | **Konflikt** |
| `ok` / status `"ok"` | intern + Matrix | **passt** (Nutzer) / Code `ok` bleibt intern |
| rot / gelb / grün allein | UI-Farbe | immer mit Text **passt** / **eher nicht** / **Konflikt** |
| Hervorragende Routine-Harmonie | Demo-Titel | nur wenn Gesamt = passt; sonst Outcome-Titel nutzen |
| Reiz-Stacking / Konflikt erkannt | Demo-Titel | **Konflikt** + 1 Grund |
| Gute Basis – Kleine Anpassung | Demo-Titel | **eher nicht** + 1 Grund |

Engine darf interne Keys (`ok`/`warn`/`no`, Matrix-Codes) behalten — **Nutzerflächen** nur die drei kanonischen Wörter.

---

## 8. Disclaimer (immer sichtbar)

Pflichtzeile unter jedem Scan-Verdict / jeder Prognose:

> **Keine medizinische Therapie — reines Einkaufs- & Layering-Erkennungstool.**

Ergänzungen je Kontext (nicht statt der Pflichtzeile):
- NC-Claim: „Herstellerangabe, keine Garantie.“
- `arzt-thema`: kein Active-Upsell; Erkennung ≠ Diagnose.
- Rx im Schrank: erkennen und gegen Kosmetik prüfen — nicht bewerben.

---

## 9. Implementierungs-Hinweise (kurz)

1. `evaluateCandidate` / Prognose: `verdict` ∈ {`passt`,`eher_nicht`,`konflikt`}; Titles = Nutzerwörter oben.
2. Drei Detailzeilen rendern; Gesamt-Ampel = Worst wins (§3).
3. Matrix-Prio innerhalb Zum Schrank unverändert (`konfliktmatrix.md` §3).
4. Constraints-v1 Soft-Defaults respektieren: `pref_nc`, `duftstofffrei`; Parfüm×sensibel = eher nicht; Baby-Parfüm = Konflikt.
5. Nach Glossar: Editorial-Cleanup, dann `rules.js` an volle Matrix koppeln (`theory-check.md`).

---

*Ende verdict-glossar.md — eine Ampel, drei Dimensionen, keine Therapie.*
