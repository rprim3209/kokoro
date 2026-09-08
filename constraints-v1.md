# Constraints v1 — Tags für Einkauf & Layering

**Stand:** 2026-09-08 (Europe/Vienna)  
**App:** Prim’s Kosmetikschrank  
**Zweck:** Kanonische Tags steuern **Shopping-Filter** und **Verdict-Zeilen** (Zu dir / Zum Schrank / Slot).  
**Nicht Zweck:** Diagnose, Therapie, Leitlinien-Schema, „behandle Akne mit X“.

Evidenz-Stärke pro Regel: **stark** | **mittel** | **schwach** | **unsicher**  
Wenn unsicher → App sagt **offen / unsicher**, nie erfinden.

Verwandte Specs: `quiz-7.md`, `schrank-modell.md`, `editorial.md`, `konfliktmatrix.md`, `actives-whitelist.md`, `vorschlags-katalog.md`, `kinder-kategorie.md`, `jugend-markt.md`, `theory-check.md`, `katalog-schema.md`.  
Code-Inventar (nur gelesen): `js/screens/quiz.js`, `js/rules.js`, `js/state.js`.

---

## 1. Was Constraints dürfen

| Darf | Darf nicht |
|---|---|
| Produkt/INCI-Flags gegen Nutzer-Tags prüfen | Therapieplan / Stufenschema |
| `passt` / `eher nicht` / `Konflikt` mit Einkaufsgrund | „Heilt / behandelt / klaren Zysten“ |
| Layering-Hinweis gegen Schrank-Slots | Active-Upsell bei `arzt-thema` |
| Claim als Claim kennzeichnen (NC, CF) | Garantie: non-comedogenic, hypoallergen, 100 % verträglich |
| Arzt-Schiene **erkennen** | Rx bewerben / „lass dir X verschreiben“ |

Verdict-Zeilen (aus `schrank-modell.md`):

1. **Zu dir** — Constraints (diese Datei)
2. **Zum Schrank** — Konfliktmatrix / Klassen
3. **Slot** — AM / PM / Ersatz-Kategorie

Nutzertext (kanonisch, bis Glossar folgt): **passt** | **eher nicht** | **Konflikt**  
(Editorial „Umbauen“ / Demo-Varianten → später `verdict-glossar.md`.)

---

## 2. Inventar — alle bisherigen Tags

### 2.1 Aus Specs (`quiz-7.md` u. a.)

| Tag | Quelle | Rolle bisher |
|---|---|---|
| `trocken` | Quiz Feuchte | Haupt-Tag Feuchte |
| `oelig` | Quiz Feuchte | Haupt-Tag Feuchte |
| `misch` | Quiz Feuchte | Haupt-Tag Feuchte (Schiedsregel) |
| `sensibel` | Quiz Q4/Q5 | Reaktivität |
| `akne-prone` | Quiz Q6/Q7 | Unreinheiten (Einkauf) |
| `arzt-thema` | Quiz Q7=A | Escalation, kein Active-Shop |
| `barrier` | Quiz Q3 / sensibel+stark | Preference Support/Barrier |
| `unklar` / `unsicher` | Q1D | Keine Achsen-Punkte |
| `duftstofffrei` / empfindlich | schrank-modell | Preference |
| `zystisch` | prim-schrank.md (Text) | inhaltlich = `arzt-thema`, kein eigener Quiz-Tag |
| `baby_0_36m`, `kind_3_11` | kinder-kategorie | Profile / Altersband |
| `tween_teen_basis`, `teen_akne` | jugend-markt | Profile-Ideen |
| Produktflags Katalog | katalog-schema | `flag_fragrance_free`, `flag_nc`, `flag_cf`, `flag_under3_intended`, `not_for_minors` |

### 2.2 Aus Code (`quiz.js` Score-Keys) — Stand Laptop

**Erwachsen Beginner/Pro (Roh-Scores):**  
`trocken`, `oelig`, `misch`, `sensibel`, `barrier`, `barrier_ok`, `akne-prone`, `arzt-thema`, `normal`, `rein`, `gesunde_haut`, `basic`, `robust`, `rasur`, `actives`, `begleitpflege`, `rx`, `praevention`, `duftstofffrei`, `cruelty_free`, `acids`, `retinoid_cos`, `mild_actives`, `minimal_basis`, `cycling`, `high_freq`, `dynamic`, `no_acids`, `peeling_moderate`, `peeling_high`, `complexity_minimal`, `complexity_basis`, `complexity_comprehensive`

**Baby:** `baby_u6m`, `baby_o6m`, `baby_normal`, `baby_dry`, `baby_windel`, `baby_diaper`, `barrier`, `complexity_*`

**Kind:** `child_school`, `child_active`, `child_sensitive_eyes`, `child_normal`, `child_dry`, `barrier`, `complexity_*`

**Teen:** `teen_oily`, `teen_blemish`, `teen_dry`, `teen_sensibel`, `teen_normal`, `teen_starter`, `teen_actives`, `teen_prevent_hype`, `complexity_*`

**UI-Anzeige-Strings** (nach Auswertung, `appState.tags`):  
„Trocken“, „Ölig“, „Mischhaut“, „Normale Haut“, „Gesunde Haut“, „Ausgeglichen“, „Sensibel“, „Barriere-fragil“, „Rasur-sensibel“, „Akne-prone“, „Arzt-Thema“, „Parfümfrei“, „Cruelty-Free“, „Prävention & LSF“, „Rx-Begleitpflege“, „2/3/4–5 Schritte …“

### 2.3 Produkt-/Engine-Klassen in `rules.js` (nicht Nutzer-Tags)

`barrier_stress`, `retinoid_cos`, `aha`, `bha`, `niacinamide`, Produktfeld `ff` (fragrance-free), Hardcodes Adapalen/Clienzo/Retinol.

**Hinweis Theory-Check:** Demo-Code ≠ volle Konfliktmatrix. Diese Spec schließt zuerst die **Nutzer-Tag**-Seite.

---

## 3. Kanonische kurze Tag-Menge

Ziel: wenige **Engine-Tags** (steuern Verdict), klar getrennt von **UI-only**.

### 3.1 Engine-Tags (v1 — Erwachsenen-Kern)

Genau **ein** Feuchte-Haupt-Tag (oder `unklar`):

| ID | Typ | Bedeutung (einfach) |
|---|---|---|
| `trocken` | enum Feuchte | Spannt / braucht oft Creme |
| `oelig` | enum Feuchte | Glänzt / Creme fühlt sich schnell zu viel an |
| `misch` | enum Feuchte | T-Zone ≠ Wangen / gemischte Signale |
| `unklar` | enum Feuchte | Zu wenig klare Antworten |

Zusatz-Flags (beliebig kombinierbar):

| ID | Typ | Bedeutung |
|---|---|---|
| `sensibel` | bool | Brennen/Stechen/Jucken auf Reize (IFSI-nah) |
| `barrier` | bool | Barriere wirkt strapaziert → Support priorisieren |
| `akne-prone` | bool | wiederkehrende Unreinheiten (Einkaufsfilter) |
| `arzt-thema` | bool | tiefe schmerzende Knoten / zystisch-nodulär → **kein** Active-Upsell |
| `begleitpflege` | bool | Nutzerin nutzt schon Rx (Adapalen, BPO-AM, …) → Reizfilter schärfen |
| `duftstofffrei` | bool | Preference: Parfüm/Duft möglichst meiden |
| `pref_nc` | bool | Preference: NC-Claim bevorzugen (Marketing!) |
| `pref_cf` | bool | Preference: CF-Siegel bevorzugen (ethisch, nicht Haut-Outcome) |

**Alias (nicht speichern):**  
`zystisch` → immer `arzt-thema`  
`empfindlich` → `sensibel`  
`duftstofffrei` UI „Parfümfrei“

### 3.2 Engine-Tags — Profile / Altersband (Phase-2-fähig)

Steuern **andere** Filter-Prioritäten und Slot-Sets, nicht denselben Erwachsenen-Active-Pfad:

| ID | Wann |
|---|---|
| `profil_baby` | EU-relevante Schwelle &lt;3 Jahre (`baby_0_36m`) |
| `profil_kind` | ~3–11 |
| `profil_teen` | ~12–17 |
| `profil_adult` | Default Erwachsen |

Unterflags nur innerhalb des Profils (nicht in Adult-Engine mischen):

- Baby: `baby_u6m` | `baby_o6m`, optional `baby_dry`, `baby_windel`
- Kind: `child_dry`, `child_sensitive_eyes` (UI/Slot), kein NC-Hauptfilter
- Teen: `teen_oily` / `teen_blemish` → map auf `oelig` / `akne-prone` **nur** für Teen-Schrank; `teen_prevent_hype` → UI-Warnung Anti-Aging-Retinol (`not_for_minors`)

### 3.3 UI-only (nicht Verdict-Engine)

| Tag / Label | Warum UI-only |
|---|---|
| „Gesunde Haut“, „Normale Haut“, „Ausgeglichen“, `normal`, `rein`, `gesunde_haut`, `robust`, `praevention` | Marketing-/Subtitle-Text; kein eigener Constraint-Pfad nötig |
| `rasur` / „Rasur-sensibel“ | Hinweis-Copy; optional soft → `sensibel` |
| `complexity_*` / „2/3/4 Schritte“ | Routine-Umfang für Ideal-Routine-UI, nicht Scan-Verdict |
| `cycling`, `high_freq`, `dynamic`, `peeling_*`, `acids`, `mild_actives`, `retinoid_cos` (Quiz-Roh) | fließen in Schrank/Klassen, nicht als Nutzer-Constraint speichern |
| `barrier_ok`, `basic`, `minimal_basis` | interne Scores ohne eigene Ampel |
| Subtitles („Akne & Barriere“, „Parfümfrei-Prio“) | Display |

### 3.4 Produkt-Flags (Katalog / Scan-Eingang)

| Flag | Engine-Nutzung |
|---|---|
| `flag_fragrance_free` / INCI `Parfum`/`Aroma`/Annex-III-Allergene | gegen `sensibel`, `duftstofffrei`, Baby/Kind |
| `Alcohol Denat.` (hoch / Leave-on) | Caution bei `sensibel` / `barrier` |
| ätherische Öle / `barrier_stress` | Caution / eher Konflikt bei sensibel/barrier |
| `flag_nc` | nur Preference bei `akne-prone` + Disclaimer |
| `flag_cf` | nur Preference `pref_cf` |
| `flag_under3_intended` | Pflicht-Signal bei `profil_baby` |
| `not_for_minors` | Teen: eher nicht vorschlagen |
| Active-Klassen Whitelist | **Zum Schrank**, nicht „Zu dir“ |

---

## 4. Regeln je Engine-Tag (Einkauf + Verdict „Zu dir“)

Legende Verdict „Zu dir“:

- **passt** — Flags passen zu Constraint
- **eher nicht** — weiches Missmatch (trotzdem kaufbar mit Grund)
- **Konflikt** — hartes Missmatch für diesen Tag (selten; meist Duft bei Baby/stark sensibel)

Layering-Härte bleibt in `konfliktmatrix.md` („Zum Schrank“).

---

### 4.1 `sensibel`

**Einfach:** Haut reagiert oft mit Brennen, Stechen, Jucken — unabhängig von trocken/ölig.

| Regel | Verdict | Evidenz |
|---|---|---|
| Priorität **parfümfrei** / ohne `Parfum`/`Aroma`; gelistete Duftallergenes meiden | passt wenn FF; **eher nicht** wenn Parfüm | **stark** — Duftstoffe = häufige Kontaktallergene; EU Kennzeichnung Annex III; SCCS Opinion fragrance allergens (SCCS/1459/11); VO (EU) 2023/1545 erweitert Liste (~80+) |
| „unscented“ ≠ fragrance-free (Maskierduft möglich) | Hinweis, nicht auto-passt | **mittel** — AAD Patientenseite (fragrance-free vs unscented) |
| ätherische Öle / „natural fragrance“ Caution | **eher nicht** / bei starker Barrier **Konflikt**-nah | **mittel** — Kontaktallergie-Literatur zu EOs; kein „Therapie“-Claim |
| `Alcohol Denat.` hoch in Leave-ons Caution | **eher nicht** | **schwach–mittel** — Irritation/TEWL dosis- & formulierungsabhängig; CIR safe-as-used ≠ ideal für gereizte Haut; **kein** SCCS-Verbot als Allergen |
| Starke Actives (AHA/BHA/Retinol) nicht automatisch verbieten | nur Schrank-Reizregeln | **mittel** — IFSI: Trigger meiden, keine konsentierte Arzneitherapie für „sensitive skin“ |

Quellen: IFSI Definition/Management (doi:10.2340/00015555-2397; doi:10.1111/jdv.16000); Eur-Lex VO 2023/1545; EC Fragrance allergens labelling; AAD men/sensitive tips.

**Nicht sagen:** „Du hast Rosazea / Allergie diagnostiziert.“

---

### 4.2 `akne-prone`

**Einfach:** Unreinheiten kommen wieder — wir filtern Einkauf, wir behandeln nicht.

| Regel | Verdict | Evidenz |
|---|---|---|
| Preference: Produkte mit Claim **non-comedogenic / oil-free / won’t clog pores** | passt (Claim); ohne Claim = neutral, kein Konflikt | **schwach** — AAD Patientenseiten empfehlen die Labels als Orientierung; Claim **unreguliert** (kein EU-Rechtslabel) |
| App-Text immer: „Herstellerangabe, keine Garantie“ | Pflicht-Disclaimer | **stark** (Regulatorik/Transparenz) — siehe `vorschlags-katalog.md` |
| Kaninchenohr-Score 0–5 **nicht** als Engine-Wahrheit | nie encoden | **stark** gegen Nutzung — Assay überempfindlich, schlechte Human-Übertragbarkeit; Reviews 2025 (JAAD Reviews) |
| Schwere/ölig-schwere Cremes → **eher nicht** als Preference (Textur), nicht als „verursacht Akne“ | eher nicht | **unsicher** — Individuum + Formel; nicht aus INCI allein schließen |
| Kein Active-Upsell nur wegen Tags | — | Editorial |

Quellen: AAD acne moisturizer / won’t-clear / makeup patient pages; Draelos/DiNardo & Kligman/Mills Kritik am Rabbit-ear; JAAD Reviews 2025 comedogenicity.

**Ehrlich:** Komedogenitäts-Evidenz ist **begrenzt und inkonsistent** → Stärke **schwach / unsicher**. Preference ja, Wissenschafts-Garantie nein.

---

### 4.3 `trocken` / `oelig` / `misch` / `unklar`

**Einfach:** Wie fühlt sich die Haut an (Feuchte/Sebum-Achse) — **Shopping-Textur**, keine Diagnose.

| Tag | Preference „Zu dir“ | Evidenz |
|---|---|---|
| `trocken` | eher reichhaltigere / lipidischere Cremes, Humectants+Emollients; mattierende „Öl-Kontrolle“-Leave-ons **eher nicht** | **mittel** — Baumann D/O-Achse (Fragebogen validiert, doi:10.4236/jcdsa.2016.61005); AAD Everyday-care zu trockener Haut als Education |
| `oelig` | leichtere Galenik (Gel/Fluid), mattierend ok; schwere Occlusives **eher nicht** als Default-Vorschlag | **mittel** — gleiche Achse; keine Therapie |
| `misch` | hybrid / zone-bewusst; kein Zwang zu „nur matt“ oder „nur reich“ | **schwach** — Baumann lehnt „combination“ als eigenen Typ ab; App behält `misch` als **praktischen** Einkaufs-Tag (T-Zone-Alltag) und sagt das ehrlich |
| `unklar` | keine Feuchte-Ampel; nur neutrale Basis + Nutzerin korrigiert Tags | — |

**oelig + dehydriert** (glänzt + spannt): Feuchte-Haupt-Tag eher `oelig` oder `misch`, **nicht** automatisch `trocken` — optional UI-Hinweis „kann trotzdem Feuchte brauchen“ (`quiz-7.md`). Evidenz Achsen-Logik **mittel**, Hinweis **unsicher**.

---

### 4.4 `barrier`

**Einfach:** Haut wirkt gerade strapaziert (Spannung, Schuppung, Brennen beim Eincremen).

| Regel | Verdict | Evidenz |
|---|---|---|
| Priorität Support (Creme/Emollient), Reizstoffe vorsichtiger | passt Support; Duft/EO/hoher Alcohol Denat. **eher nicht** | **mittel** — Barrier-Störung oft mit sensibel assoziiert (IFSI), kausal nicht immer |
| Extra Active-Kauf dämpfen wenn schon Rx/Actives im Schrank | eher nicht (Zu dir + Schrank) | **schwach** — klinischer Common sense; Reiz-Budget folgt später `reiz-budget.md` |

Kein Claim „repariert die Barrier in X Tagen“.

---

### 4.5 `arzt-thema` (inkl. zystisch / tiefe Knoten)

**Einfach:** Das ist ein **Arzt-Thema**, kein Serum-Upgrade.

| Regel | Verdict | Evidenz |
|---|---|---|
| **Kein** Active-Upsell / keine Alternativen-Shop-Liste mit „stärkeren“ Actives | Konflikt gegen Upsell-Pfad | **stark** (Produktregel/Editorial); klinisch: nodulär/zystisch → fachärztlich (AAD patient: deep nodules → dermatologist) — App zitiert das nur als **Erkennung**, nicht als Leitlinie |
| Scan von Kosmetik weiter erlaubt (Reiniger/Creme/SPF) | passt möglich | — |
| Rx im Schrank nur erkennen (`not_cosmetic`) | Zum Schrank | `arzt-schiene.md` |

**Niemals:** Iso/Spironolacton/„lass dir Adapalen verschreiben“ als App-Befehl.

---

### 4.6 `begleitpflege`

**Einfach:** Rx läuft schon — Kosmetik soll nicht extra reizen.

| Regel | Verdict | Evidenz |
|---|---|---|
| Parfüm / EO / Alcohol Denat. Leave-on **eher nicht** | eher nicht | **mittel** — AAD: Retinoide/BPO trocknen/reizen; Begleitpflege oft empfohlen (patient education, kein Schema) |
| Zweites Retinoid-Kosmetik gegen Rx-Retinoid | **Konflikt** (Zum Schrank `same_class`) | **stark** — Matrix |
| AHA/BHA selbe Anwendung wie Retinoid | eher nicht / skip_stack | **mittel** — Matrix |

---

### 4.7 `duftstofffrei` / Baby–Kind Parfüm-Priorität

| Kontext | Regel | Evidenz |
|---|---|---|
| Adult + Tag gesetzt | Parfüm → **eher nicht** (oder Konflikt wenn zusätzlich `sensibel`+`barrier`) | **stark** Kennzeichnungspflicht / Allergenlage |
| `profil_baby` | **Parfümfrei + für unter 3 gedacht** = Hauptfilter; NC **niedrig**; CF optional | **stark** EU VO 1223/2009 Annex I &lt;3 Safety Assessment; **mittel–stark** EDQM *Safe cosmetics for young children* (2023): Duft vorsichtig / Allergene minimieren; JDD 2020 Neonates/Infants consensus: fragrance-free |
| `profil_kind` | Parfümfrei weiterhin hoch; NC erst ab Vorpubertät/akne-prone mittel | **mittel** |
| SPF &lt;6 Monate | kein Sonnencreme-First (Schatten/Kleidung); App: Einkaufs-Hinweis, kein Befehl | **mittel** — AAP/AAD sunscreen guidance |

IFRA: Industrie-Standards für Duft-Dosierung; **kein** Ersatz für EU-Annex-Kennzeichnung. Engine nutzt **INCI/Claims**, nicht IFRA-Zertifikat-Parsing in v1. Evidenz-Rolle IFRA für App: **schwach** (Hintergrund).

---

### 4.8 `pref_nc` / `pref_cf`

| Tag | Wirkung | Evidenz |
|---|---|---|
| `pref_nc` | sortiert Vorschläge mit `flag_nc=yes` nach oben; Scan bleibt erlaubt ohne Flag | **schwach** (Claim) |
| `pref_cf` | sortiert CF-LB/CFI; Siegel ≠ Sicherheit | **stark** ethisch irrelevant für Haut-Outcome — ehrlich so labeln |

---

### 4.9 Teen-spezifisch (kurz)

| Regel | Evidenz |
|---|---|
| Anti-Aging-Retinol / starke Peel-Stacks an Minderjährige **nicht** als Default-Vorschlag (`not_for_minors`) | **mittel** — AAD Tween/Teen guides; DE Fachkritik Überpflege |
| Adapalen in DE = Rx → Arzt-Schiene, kein US-Differin-OTC | **stark** Regulatorik DE |
| Basis: Reiniger + Feuchte + SPF | **mittel** Education |

---

## 5. Map: Tag → Verdict-Dimension

| Engine-Tag | Zu dir | Zum Schrank | Slot |
|---|---|---|---|
| `trocken` | Textur reich/feucht → passt; matt/ölig-schwer → eher nicht | — | Creme-Slot eher reich |
| `oelig` | leicht/matt → passt; sehr reich → eher nicht | — | Creme eher Gel/Fluid |
| `misch` | hybrid ok; Extreme eher nicht | — | ggf. unterschiedliche AM/PM-Textur |
| `unklar` | neutral | — | Schrank trotzdem |
| `sensibel` | FF/ohne EO → passt; Parfüm/EO/Alcohol Denat. → eher nicht | Reiz-Stacking härter werten | — |
| `barrier` | Support priorisieren; Reizstoffe eher nicht | skip_stack früher | Extra Creme ok |
| `akne-prone` | NC-Claim Preference + Disclaimer | keine Komedo-Scores | Spot ≠ Upsell |
| `arzt-thema` | **kein Active-Upsell** = Konflikt gegen Shop-Active | Rx erkennen | keine „stärkeren“ Seren |
| `begleitpflege` | Duft/Reiz eher nicht | Matrix Rx×Kosmetik | AM/PM Wechsel respektieren |
| `duftstofffrei` | Parfüm eher nicht / Konflikt bei Baby | — | — |
| `pref_nc` / `pref_cf` | Sortierung Alternativen | — | — |
| `profil_baby` | Parfümfrei + under3; NC niedrig | eigene Slots (Windel) | kein Adult-Active |
| `profil_teen` | `not_for_minors`; milde Basis | Matrix wenn Actives | SPF Pflicht-Slot |

**Wann Konflikt (Zu dir) überhaupt?**  
Vor allem: Active-Upsell bei `arzt-thema`; stark parfümiert bei `profil_baby` / kombinierter `sensibel`+`duftstofffrei`+Leave-on-Duftbombe.  
Sonst lieber **eher nicht** + Grund — Unsicherheit nicht als harte Unverträglichkeit verkaufen (`konfliktmatrix.md`).

---

## 6. Quiz → Tag Mapping

### 6.1 Spec-Soll (`quiz-7.md` v0.2) — kanonisch für Theory

| Frage | Antwort → Score | Engine-Tag |
|---|---|---|
| Q1 Nach Waschen | A → trocken+2; B → misch+2; C → oelig+2; D → keine Achse (`unklar`-Kandidat) | Feuchte |
| Q2 Mittags | A trocken+2; B misch+2; C oelig+2 | Feuchte |
| Q3 Creme-Bedarf | A trocken+2 + barrier+1; B misch+2; C oelig+2 | Feuchte + barrier |
| Q4 Neue Produkte | A sensibel+3; B sensibel+2; C 0 | sensibel |
| Q5 Trigger | A sensibel+2; B +1; C 0 | sensibel |
| Q6 Unreinheiten | A akne-prone+3; B +2; C 0 | akne-prone |
| Q7 Tiefe Knoten | A akne-prone+2 + **arzt-thema**; B akne-prone+1; C 0 | akne-prone, arzt-thema |

**Schwellen (Spec):**

| Tag | Schwelle |
|---|---|
| `trocken` | trocken ≥ 4 **und** trocken &gt; oelig |
| `oelig` | oelig ≥ 4 **und** oelig &gt; trocken |
| `misch` | misch ≥ 4 **oder** (trocken≥2 und oelig≥2) **oder** \|trocken−oelig\|≤1 bei beiden ≥2 |
| `sensibel` | Q4+Q5 ≥ 3 |
| `akne-prone` | Q6+Q7 ≥ 3 |
| `arzt-thema` | Q7 = A |
| `barrier` | Q3=A **oder** (sensibel und Q4=A) |
| `unklar` | Q1D ohne klare Q2/Q3 |

Nur **ein** Feuchte-Haupt-Tag; bei Konflikt → `misch`.

### 6.2 Code heute (`quiz.js`) — Abweichung (offen für Prim)

Demo hat **Beginner (8)** / **Pro (7)** / Baby / Kind / Teen — nicht 1:1 die 7 Spec-Fragen.

| Code-Roh-Score | Map auf Engine v1 |
|---|---|
| `trocken` / `oelig` / `misch` | gleich |
| `sensibel` ≥2 | `sensibel` |
| `barrier` ≥2 | `barrier` |
| `akne-prone` ≥2 | `akne-prone` |
| `arzt-thema` ≥1 | `arzt-thema` |
| `begleitpflege` / `rx` | `begleitpflege` |
| `duftstofffrei` | `duftstofffrei` |
| `cruelty_free` | `pref_cf` |
| `normal` / `rein` / `gesunde_haut` / `robust` / `praevention` | **UI-only** (kein Feuchte-Tag erzwingen) |
| `rasur` | UI; optional soft `sensibel` |
| `complexity_*` | UI-only |
| Teen `teen_blemish` | `akne-prone` im Teen-Profil |
| Teen `teen_oily` | `oelig` im Teen-Profil |
| Teen `teen_sensibel`/`teen_dry` | `sensibel` / `trocken` |
| Baby/Kind dry | `barrier` + Profil; Parfümfrei-Default für Profil |

**Schwellen im Code** sind weicher (≥2) als Spec (≥3/≥4) — **offen:** Spec oder Code angleichen vor Scan-Launch.

---

## 7. Explizite Non-Goals (Tags dürfen NIEMALS claimen)

1. **Keine Diagnose** („du hast Akne vulgaris Grad X / Rosazea / Neurodermitis“).
2. **Keine Therapie** („behandle mit BPO 5 % / Adapalen-Schema / Iso“).
3. **Keine Leitlinien-Wiedergabe** als App-Befehl (AAD/EuroGuiDerm nur als Evidenzquelle hinter den Kulissen).
4. **Keine Heilversprechen** und keine „klart zystische Akne“.
5. **Keine Garantie** non-comedogenic / hypoallergen / 100 % verträglich / porentief rein.
6. **Keine Komedogenitäts-Zahlen 0–5** als Wahrheit.
7. **Kein Rx-Verkauf** und kein „Rezept anfordern“.
8. **Kein** „Niacinamid + Vit C verboten“ ohne Formulierungsevidenz.
9. **Kein** Fitzpatrick als Feuchtigkeits-Tag.
10. **Kein** Baby = „Kind bis 10“ als medizinische Wahrheit.
11. **Kein** Anti-Aging-Retinol als Teen-Default.
12. Tags steuern **nicht** Konzentrationen/%-Dosierungen als Anwendungsempfehlung.

---

## 8. Offene Fragen an Prim (Pharmazie)

1. **Schwellen:** Spec `quiz-7.md` (härter) oder Demo-`quiz.js` (weicher ≥2) als Wahrheit vor Scan?
2. Soll `misch` trotz Baumann-Kritik bleiben? (Empfehlung dieser Spec: **ja**, als praktischer Einkaufs-Tag + ehrlicher Hinweis.)
3. ~~`pref_nc` automatisch bei jedem `akne-prone`, oder nur opt-in Filter?~~ → **entschieden 2026-09-08:** auto Soft-Preference + Chip (siehe „Entscheidungen Prim“).
4. ~~`duftstofffrei` auto-setzen wenn `sensibel`, oder nur bei expliziter Quiz-Antwort?~~ → **entschieden 2026-09-08:** auto Soft-Preference + Chip.
5. `begleitpflege` vs. nur Schrank-Erkennung von Rx — doppelte Logik?
6. Zystisch: eigener UI-Chip oder nur Copy unter `arzt-thema`?
7. ~~Wann genau wird „Zu dir“ **Konflikt** statt **eher nicht** bei Parfüm?~~ → **entschieden 2026-09-08:** eher nicht bei `sensibel`; Konflikt Baby / künftige Allergie-Tags.
8. Alcohol Denat.: Schwelle über INCI-Position/`barrier_stress`-Klasse — wie strikt flaggen ohne %-Angabe auf der Dose?

---

## 9. Quellen (Kern, EU/DACH-nah)

| Thema | Quelle | Stärke für App-Regel |
|---|---|---|
| Duft-Allergene Kennzeichnung | VO (EG) 1223/2009 Annex III; VO (EU) 2023/1545; SCCS/1459/11 | **stark** |
| CosIng / INCI | EC CosIng | **stark** (Namen) |
| Sensitive skin Definition | IFSI position papers | **stark** (Definition); Management **mittel/dünn** |
| Fragrance-free vs unscented | AAD patient education | **mittel** |
| NC-Claim / Komedogenität | AAD patient acne pages; JAAD Reviews 2025; Rabbit-ear Kritik | Preference **schwach**; Scores **nicht nutzen** |
| Feuchte-Achse | Baumann BSTQ validation doi:10.4236/jcdsa.2016.61005 | **mittel** |
| Baby &lt;3 / Duft | VO 1223/2009 Annex I B; EDQM Safe cosmetics for young children 2023; JDD 2020 ceramide consensus | **mittel–stark** |
| SPF &lt;6 Monate | AAP/AAD sunscreen guidance | **mittel** |
| IFRA | Industrie-Limits | Hintergrund **schwach** für Engine |
| Layering Actives | konfliktmatrix / AAD 2024 / EuroGuiDerm — **nicht** als Therapie in Constraints | Schrank-Dimension |

---

## 10. Implementierungs-Checkliste (kurz)

- [ ] Engine speichert nur kanonische IDs aus §3.1–3.2  
- [ ] UI-Labels separat mappen (§3.3)  
- [ ] Jede „Zu dir“-Zeile: Tag + Produktflag + Evidenzstufe (intern) + Nutzergrund (einfaches Deutsch)  
- [ ] NC/CF immer als Claim kennzeichnen  
- [ ] `arzt-thema` blockt Active-Alternativen-Tap  
- [ ] Quiz-Schwellen Spec↔Code klären (§8.1)  
- [ ] Danach: `verdict-glossar.md`

---

*Ende constraints-v1.md — Einkauf & Layering, keine Therapie.*

---

## Entscheidungen Prim (evidenzbasiert 2026-09-08)

**Kontext:** Shopping-Helper, keine Therapie. Defaults steuern Preference-Chips / Verdict-Härte „Zu dir“. Nutzerin kann Soft-Prefs jederzeit abschalten (sichtbarer Chip + Override). Keine erfundenen Survey-Zahlen — wo keine direkte Auto-Tag-UX-Studie existiert, Inferenzen aus klinischer Patienteneducation + gekennzeichnet.

### Q1 — `akne-prone` → automatisch `pref_nc`?

**Default: JA — Soft-Preference auto setzen (Sortierung / Claim-Boost), kein Hard-Filter.**

| Aspekt | Entscheidung | Stärke |
|---|---|---|
| Auto-setzen `pref_nc` bei Tag `akne-prone` | **Ja** | **mittel** (klinische Education) |
| Fehlender NC-Claim = Konflikt? | **Nein** — neutral / kein Bonus | **stark** gegen Hard-Konflikt (Claim unreguliert) |
| Opt-out / Chip abwählbar | **Ja, Pflicht** | **mittel** (mHealth: Controllability) |

**Begründung:** AAD Patient Guidance empfiehlt bei acne-prone explizit Labels „oil-free / non-comedogenic / won’t clog pores“ als Einkaufsorientierung (Moisturizer-, Makeup-, Alltagspflege-Seiten). Das rechtfertigt ein **Default-Preference**, nicht eine medizinische Pflicht. Der Claim ist **nicht** EU-reguliert; JAAD Reviews 2025 betont regulatorische Lücken und warnt vor Label-Glauben — daher nie „Konflikt“ nur weil `flag_nc` fehlt, immer Disclaimer „Herstellerangabe, keine Garantie“.

**Survey-Lücke (ehrlich):** Keine frei zugängliche Euromonitor/Mintel-/Derm-Survey mit „% der Akne-Betroffenen suchen NC-Claim“ gefunden. Proxy (nicht 1:1 übertragbar): Beauty-Buddy Foundation-Survey — 36 % Beauty-Enthusiasten nennen non-comedogenic als wichtigen Foundation-Faktor (nicht Akne-Kohorte). Case-Control (PMC12323874) zeigt Assoziation comedogener Cleanser/Moisturizer mit Akne und rät klinisch zu NC — kein Consumer-„look for %“.

**UX:** Auto-apply + sichtbarer Chip + Abwahl — mHealth-Literatur: gemischte Initiative / Controllability bei Preference-Adaptionen (kein stilles Hard-Lock).

### Q2 — `sensibel` → automatisch `duftstofffrei`?

**Default: JA — Soft-Preference auto setzen.**

| Aspekt | Entscheidung | Stärke |
|---|---|---|
| Auto-setzen `duftstofffrei` bei `sensibel` | **Ja** | **stark** (klinische Education) / **mittel** (als UX-Default ohne Opt-out-Zwang) |
| Opt-out | **Ja** | **mittel** (IFSI: personalisierte Vermeidung; mHealth Controllability) |

**Begründung:** AAD: bei sensitive skin mild „fragrance free“ wählen; unscented ≠ fragrance-free (Maskierduft). AAD Atopic-Dermatitis-Self-Care: fragrance-free priorisieren. IFSI SIG Sensitive Skin (JEADV 2020): Trigger meiden; High-Tolerance-Produkte **ohne Duftstoffe**; sensitive skin ist **kein** immunologisches Störungsbild — Vermeidung empfohlen, aber keine starre Therapie-Leitlinie.

**Survey-Lücke (ehrlich):** Keine saubere offene Zahl „% sensibler Konsument:innen meiden Duft“ aus Euromonitor/Mintel gefunden. Verwandte (nicht identisch): Mintel US Facial Skincare (2014 Press) — 22 % suchen „free from“ (u. a. Parabene/Duft), 71 % Interesse an ultra-gentle; Meta-Analyse Selbstangabe sensitive skin ~71 % (Chen et al., Front Med / PubMed 31869523, via Branchenzusammenfassungen). Das stützt Marktrelevanz von Fragrance-free, nicht den exakten Auto-Tag-UX-Prozentsatz.

### Q3 — Duft/Parfüm bei `sensibel`: „eher nicht“ vs „Konflikt“?

**Default: weiches „eher nicht“ bei alleinigem `sensibel`. „Konflikt“ nur in engen Fällen.**

| Situation | Verdict „Zu dir“ | Stärke |
|---|---|---|
| `sensibel` + Parfüm/`Parfum`/Annex-Duftallergene Leave-on | **eher nicht** | **stark** (Allergenlage + IFSI ≠ Allergie-Diagnose) |
| `sensibel` + `duftstofffrei` (auto oder manuell) + deutlicher Leave-on-Duft | **eher nicht** (v1); optional später eskalieren | **mittel** |
| `profil_baby` + Parfüm | **Konflikt** | **stark** (EU Annex I &lt;3 / EDQM) |
| Künftig: bestätigte Duftallergie-Tag (Patch) | **Konflikt** | **stark** (klinische Sekundärprävention) |
| Parfüm-Produktkategorie (Eau de Parfum etc.) bei nur `sensibel` | **eher nicht** (nicht Hard-Block) | **mittel** |

**Begründung (Härte):** ESSCA/EBS 2019/20 (Kontaktallergie-Patient:innen): Fragrance Mix I **6,80 %**, FM II **3,77 %**, Myroxylon pereirae **6,62 %**. Allgemeine EU-Bevölkerung: SCCS Opinion ~**1–3 %** Duftkontaktallergie; Diepgen et al. BJD 2015 (5 Länder): konservativ **1,9 %** klinisch relevante Fragrance-Contact-Allergy. Self-Tag `sensibel` ≠ diagnostizierte Duftallergie (IFSI). Hard-„Konflikt“ würde die Mehrheit übermedizinisieren. Soft-„eher nicht“ + Grundtext passt zum Shopping-Helper und zu §5 („Unsicherheit nicht als harte Unverträglichkeit verkaufen“).

### Kurz-Update Constraints-v1 (verbindlich für Engine)

1. `akne-prone` **setzt** `pref_nc` (Soft; Chip; abwählbar). Fehlendes `flag_nc` → **kein** Konflikt.
2. `sensibel` **setzt** `duftstofffrei` (Soft; Chip; abwählbar).
3. Parfüm bei `sensibel` (± `duftstofffrei`) → Verdict **eher nicht**; **Konflikt** reserviert für Baby/Kind-Hauptfilter und künftige Allergie-Tags.
4. Offene Fragen §8.3, §8.4, §8.7 damit **entschieden** (Stand 2026-09-08).

### Kernquellen (Links/DOIs)

| Thema | Quelle |
|---|---|
| NC / oil-free bei Akne | https://www.aad.org/public/diseases/acne/skin-care/moisturizer |
| NC + fragrance-free nach Hauttyp | https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-for-men |
| Fragrance-free bei AD/Eczema | https://www.aad.org/public/diseases/eczema/types/atopic-dermatitis/atopic-dermatitis-coping |
| IFSI Sensitive Skin Management | https://doi.org/10.1111/jdv.16000 · https://pubmed.ncbi.nlm.nih.gov/31660659/ |
| IFSI Definition Sensitive Skin | https://pubmed.ncbi.nlm.nih.gov/26939643/ · doi:10.2340/00015555-2397 |
| ESSCA/EBS 2019/20 Patch-Test | https://doi.org/10.1111/cod.14170 (Open PDF: https://pure.rug.nl/ws/files/234436990/Contact_Dermatitis_2022_Uter_Patch_test_results_with_the_European_baseline_series_2019_20_Joint_European_results_of.pdf) |
| Fragrance allergy Allgemeinbevölkerung EU | https://doi.org/10.1111/bjd.14151 (Diepgen 2015); SCCS fragrance allergens https://ec.europa.eu/health/scientific_committees/consumer_safety/docs/sccs_o_102.pdf |
| NC-Claim regulatorische Lücken | https://www.jaadreviews.org/article/S2950-1989(25)00088-1/fulltext |
| Cosmetics×Acne Case-Control (NC-Empfehlung klinisch) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12323874/ |
| Mintel free-from / gentle (Proxy, US 2014) | https://www.mintel.com/press-centre/us-facial-skincare-trends/ |
| Sensitive-skin Prävalenz Meta (Proxy) | https://pubmed.ncbi.nlm.nih.gov/31869523/ |
| mHealth Auto vs Control | https://arxiv.org/html/2405.08302 · https://doi.org/10.1016/j.infsof.2026.108014 |

*Ende Entscheidungen Prim 2026-09-08.*
