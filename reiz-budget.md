# Reiz-Budget v0.1

**Stand:** 2026-09-08 (Europe/Vienna)  
**App:** Prim’s Kosmetikschrank  
**Zweck:** Einkaufs- und Layering-Helper — wann zu viele Reiz-/Active-Stoffe in **einem** Slot oder **an einem Kalendertag** die Ampel auf **eher nicht** / **Konflikt** heben.  
**Verwandt:** `konfliktmatrix.md`, `clienzo-adapalen.md`, `prim-schrank.md`, `actives-whitelist.md`, `verdict-glossar.md`, `constraints-v1.md` (begleitpflege), `arzt-schiene.md`, `inci-klassifikator.md`.

---

## 1. Was das Reiz-Budget ist / nicht ist

### Ist
- Eine **Heuristik** für Over-Stacking von Leave-on-Reizstoffen (Retinoide, Säuren, BPO-AM, Alkohol/Duft neben Rx).
- Brücke zwischen **Konfliktmatrix** (Stoff×Stoff) und **Tages-/Slot-Sicht** (AM+PM am selben Tag; mehrere Actives in derselben Anwendung).
- Ausgang für Nutzerzeilen: *„viel Active heute“*, *„nicht dieselbe Schicht“*, *„anderen Slot oder weglassen“* — Outcome **eher nicht** oder **Konflikt**, plus Vorschlag `split` / `alternate_days` / `skip_stack`.

### Ist nicht
- **Keine Therapie**, kein Schema, kein „behandle Akne mit …“, keine Dosis, keine Häufigkeit als medizinischer Rat.
- Kein validierter klinischer Score (kein RCT, der „3 Punkte = Schaden“ belegt).
- Kein Ersatz für Fachinfo, Praxis oder Leitlinien-Verschreibung (Fertigkombis wie Epiduo bleiben **ärztlich** — die App verkauft sie nicht und schreibt sie nicht vor).
- Kein TEWL-Messgerät und kein Diagnosetool für „Barriereschaden“.

**Kernsatz:** Mehr Reizstoffe gleichzeitig = höheres Risiko für Trockenheit, Röten, Spannen — die App warnt beim Einkauf/Layering, sie behandelt nichts.

---

## 2. Was zählt als Reiz-Load (Kategorien)

Einheiten unten sind **App-Heuristik**, nicht validierter Score. Evidenz: siehe §9.

| Kategorie | Typische Stoffe / Signale | Slot-Gewicht (Heuristik) | Tag-Gewicht (Heuristik) | Evidenz Reiz/Barrier |
|---|---|---|---|---|
| `retinoid_rx` | Adapalen, Tretinoin, Trifaroten, Tazaroten | **2** | **2** | **stark–mittel** — Leitlinien: Irritation häufig; AAD Patientenedu: weniger oft / Creme zuerst |
| `retinoid_cos` | Retinol, Retinal, Retinylester | **2** | **2** | **mittel** — Reiz-Stacking mit Säuren; EU-Limit VO 2024/996 |
| `aha` | Glycolic Acid, Lactic Acid (Leave-on) | **2** | **1–2** | **mittel** — TEWL↑ in Humanstudien (Effendy 1995); UV-Hinweis |
| `bha` | Salicylic Acid Leave-on | **2** | **1–2** | **mittel** — keratolytisch; AAD conditional (Akne), Reiz möglich |
| `bpo` / AM-Spot mit BPO | Benzoylperoxid (Clienzo = `ab_top`+`bpo`) | **2** (Leave-on Spot/Fläche) | **1–2** | **stark–mittel** — AAD/EuroGuiDerm: wirksam + trocknet/reizt; Spot ≠ Fertigkombi-Galenik |
| `azelaic` (Leave-on) | Azelaic Acid Kosmetik / AM | **1** | **1** | **mittel** — oft verträglicher als BPO/Retinoid (EuroGuiDerm-Trend); trotzdem additiv |
| `ascorbic` (L-AA, sauer) | Ascorbic Acid niedrig-pH | **1** | **1** | **schwach–mittel** — Reiz möglich; mit BPO eher `inactivate`/`split` |
| `alcohol_high` | Alcohol Denat. früh in Leave-on (`barrier_stress`) | **1** | **1** | **schwach–mittel** — formulierungsabhängig; bei `barrier`/`begleitpflege` schärfer |
| `fragrance_barrier` | Parfüm / EO bei `sensibel`/`barrier`/`begleitpflege` | **1** | **1** | **mittel** — Allergen/Reiz; Constraints |
| `physical_scrub` | mechanisches Peeling / Scrub Gesicht | **2** (selbe Anwendung) | **1** | **schwach–mittel** — klinischer Common sense + Patientenedu; wenig harte Survey-Daten |

**Nicht** als Reiz-Load (Support): Glycerin, HA, Ceramide, Panthenol, milde Reiniger, SPF, okklusive/barrier Cremes — außer sie tragen selbst `barrier_stress`/`fragrance`.

### Heuristik-Schwellen (nicht validiert — markiert!)

| Ebene | Schwelle (Summe Gewichte) | Default-Outcome | Matrix-Nähe |
|---|---|---|---|
| **Nacht / eine Anwendung** | ≥ **3** aus zwei verschiedenen Reiz-Klassen | **Konflikt** (`skip_stack` / `same_class`) | Matrix Regeln 7–13 |
| **Nacht / eine Anwendung** | = **2** aus **einer** Klasse verdoppelt | **Konflikt** (`same_class`) | z. B. zwei Retinoide |
| **Kalendertag AM+PM** | ≥ **4** über beide Slots (ohne Doppelzählung Support) | **eher nicht** („viel Active heute“) oder bei `begleitpflege`/`barrier` eher **Konflikt**-nah | Tagesflag; siehe Prim §6 |
| **Einführen neuer Kosmetik-Active** | zweites starkes Active im selben Kauf-/Einführfenster | **eher nicht** | AAD: ein Produkt zuerst |

Rinse-off BPO-Wash: Tag-Gewicht niedriger als Leave-on (**heuristisch 0–1**), weil Kontaktzeit kürzer — trotzdem bei `begleitpflege` erwähnen, nicht ignorieren.

---

## 3. Tagesregeln vs. Nachtregeln

### 3.1 Nachtregeln (gleiche Anwendung / gleicher PM- oder AM-Slot)

| Stack | Code | Outcome | App sagt (kurz) | Evidenz |
|---|---|---|---|---|
| Retinoid + AHA | `skip_stack` | **Konflikt** | Nicht dieselbe Schicht — Säure an anderem Abend oder weglassen. | **mittel** — AAD Irritation/Patientenedu; Matrix #7 |
| Retinoid + BHA | `skip_stack` | **Konflikt** | wie oben | **mittel** — Matrix #8 |
| AHA + BHA | `skip_stack` | **Konflikt** | Zwei Säuren auf einmal — eher Abstand. | **schwach–mittel** — Reiz, kein hartes Leitlinien-Verbot |
| Retinoid_rx + Retinoid_cos | `same_class` | **Konflikt** | Zwei Retinoide — mehr Reiz ohne klaren Zusatznutzen. | **stark** — Klasse |
| Retinoid + BPO Leave-on (zwei Tuben) | `skip_stack` (± `inactivate` nur Tretinoin×BPO) | **Konflikt** | Nicht stapeln; Fertigkombi ≠ frei drauf. | **mittel** Reiz; Adapalen×BPO Chemie **ok** (Martin 1998), Reiz trotzdem |
| Retinoid + Physical Scrub | `skip_stack` | **Konflikt** | Mechanisch + Retinoid = Extra-Reiz. | **schwach** |
| Retinoid + Azelaic | `ok` + optional Reiz | **passt** / bei `barrier` **eher nicht** | Kein Inactivate; bei Spannung vorsichtiger. | **mittel** — EuroGuiDerm Tolerability-Trend |
| Niacinamid + Retinoid | `ok` | **passt** | Kein sourced Inactivate. | **schwach–mittel** (Praxis, dünn sourced) |

**Moisturizer-Sandwich:** Nutzerwahl zur Verträglichkeit, **kein** Matrix-Konflikt. AAD: Creme zuerst kann Irritation mindern (Patientenedu). AAD-2025-Poster (ex vivo): „open sandwich“ erhält Bioaktivität eher als „full sandwich“ — **mittel/unsicher** für App-Copy (nicht als Dosis-Tipp verkaufen).  
Quelle Poster: https://doi.org/10.1016/j.jaad.2025.05.1324

### 3.2 Tagesregeln (AM + PM, derselbe Kalendertag)

Andere Tageszeit ≠ automatisch „frei“. Additives Reizbudget bleibt.

| Situation | Code | Outcome | App sagt | Evidenz |
|---|---|---|---|---|
| AM BPO/Clienzo Spot + PM Adapalen | `skip_stack` **möglich** (Tagesflag) | **eher nicht** Default; bei `begleitpflege`+`barrier` → **Konflikt**-nah | Viel Active heute — Wechsel-Nacht oder Spot pausieren (Nutzerwahl, kein Befehl). | **mittel** — Reiz additiv; Leitlinien loben Fertigkombi, nicht zwei freie Tuben am selben Tag ohne Galenik |
| AM Azelaic + PM Adapalen | `ok` + Reizhinweis | **passt** / soft **eher nicht** wenn `barrier` | Anderer Slot; Spannung möglich → Support ok. | **schwach–mittel** |
| AM AHA/BHA Leave-on + PM Retinoid | `alternate_days` bevorzugt | **eher nicht** | Lieber Peeling-Tage und Retinoid-Tage trennen. | **mittel** |
| Nur Support AM + ein Retinoid PM | `ok` + `uv` | **passt** | Tagsüber LSF mitdenken. | **stark** (UV-Hinweis AAD) |
| Zwei starke Actives neu gleichzeitig gekauft | — | **eher nicht** | AAD: mit **einem** Produkt starten, Zeit geben. | **mittel** — AAD public education |

**Split vs. Tagesbudget:** `split` (morgens/abends) löst oft Chemie-`inactivate` (z. B. klassisches Tretinoin×BPO) und harte Schicht-Konflikte. Es **löscht nicht** automatisch das Tages-Reizflag bei zwei schweren Leave-ons (Clienzo + Adapalen).

---

## 4. Mapping → Verdict-Glossar & Matrix

| Reiz-Budget-Signal | Matrix-Code(s) | Kanonisches Outcome | Dimension |
|---|---|---|---|
| Zwei Reizklassen **gleiche Anwendung** | `skip_stack` | **Konflikt** | Zum Schrank |
| Gleiche Klasse doppelt | `same_class` | **Konflikt** | Zum Schrank |
| Besser anderer Slot am **selben** Tag (Chemie/Inactivate) | `split` | **eher nicht** | Zum Schrank + Slot |
| Besser **anderer Tag** (Peeling vs Retinoid) | `alternate_days` | **eher nicht** | Zum Schrank + Slot |
| AM schwer + PM schwer, stofflich kein Inactivate | Tages-`skip_stack` / „viel Active“ | **eher nicht** (Default) | Slot + Zum Schrank |
| Parfüm/EO/Alcohol neben Rx | `begleit_barrier` | **eher nicht** | Zu dir + Schrank |
| UV-sensibilisierende Actives | `uv` | **eher nicht** (Hinweis) | Slot |
| BPO bleicht Stoff | `bleach` | Hinweis (Ampel oft unberührt) | Hinweis |
| Kein hartes Paar | `ok` | **passt** | Zum Schrank |

Worst-wins wie in `verdict-glossar.md`: **Konflikt > eher nicht > passt**.

Engine-Prio unverändert: `not_cosmetic` > `inactivate` / `resistance` > `same_class` > `skip_stack` > `alternate_days` / `split` / Tagesflag > `begleit_barrier` > `uv` / `bleach`.

---

## 5. Prim-Beispiel: Clienzo AM Spot + Adapalen PM

Aus `prim-schrank.md` / `clienzo-adapalen.md`:

| Fakt | Einordnung |
|---|---|
| Clienzo = Clindamycin 1 % + BPO 5 % (AM Spot) | Arzt-Schiene; `ab_top`+`bpo`; kein `resistance` (BPO drin) |
| Adapalen PM | `retinoid_rx` |
| Chemie Adapalen × BPO | **nicht** `inactivate` (Martin 1998; Epiduo-Logik) |
| Zwei **getrennte** Tuben ohne Fertiggalenik | Extra Reiz vs. formulierte Kombi |
| Barrier schon angespannt (Extra-Creme) | Tag `begleitpflege` / `barrier` schärft |

**App-Verdict (Entwurf):**

> 🟡 **eher nicht** — Viel Active an einem Tag (Clienzo-Spot morgens + Adapalen abends). Nicht verboten weil „Adapalen und BPO nie geht“ — Leitlinien empfehlen die **Fertigkombi**. Sondern: zwei Reiz-Arzneimittel ohne gemeinsame Galenik belasten die Barrier unnötig.  
> Alternative Slot-Logik: wie bisher **Modus A ‖ Modus B** (Adapalen **oder** Clienzo abends, nicht beides; AM-Spot an Retinoid-Tagen hinterfragen).  
> Codes: `skip_stack` (Tagesreiz) · nie `inactivate` für Adapalen×BPO · `bleach` Hinweis.

Bei gesetztem `begleitpflege` + `barrier`: Gesamt eher **Konflikt**-Ton erlaubt („Lieber nicht dieselbe Kalender-Last“), Copy bleibt ehrlich zu Leitlinien.

**Nicht sagen:** „Leitlinien verbieten Adapalen mit BPO.“  
**Nicht sagen:** „Nimm Epiduo statt …“ / Dosis / Therapieschema.

---

## 6. Tag `begleitpflege` schärft Schwellen

Aus `constraints-v1.md` §4.6: Rx läuft schon — Kosmetik soll nicht extra reizen.

| Ohne `begleitpflege` | Mit `begleitpflege` (± `barrier` / `sensibel`) |
|---|---|
| Nacht Retinoid+Säure → Konflikt | unverändert Konflikt |
| Tag Clienzo+Adapalen → eher nicht | eher **Konflikt**-nah / stärkere Copy |
| Parfüm / EO / Alcohol Denat. Leave-on | **eher nicht** (`begleit_barrier`) — Schwelle früher |
| Neues AHA/BHA-Serum gegen vollen Rx-Schrank | **eher nicht** schon beim Scan „Zu dir“ |
| Support-Creme / SPF / milder Reiniger | weiter **passt** möglich |

`begleitpflege` **verdoppelt keine Punkte mathematisch verpflichtend** — es senkt die Toleranzgrenze für zusätzliche Reizklassen und Soft-Flags (`alcohol_high`, `fragrance_barrier`).

---

## 7. Disclaimer (Pflicht)

> **Keine medizinische Therapie — reines Einkaufs- & Layering-Erkennungstool.**  
> Das Reiz-Budget ist eine **Heuristik**, kein validierter Score und kein ärztlicher Rat. Fachinfo und Praxis gelten vor App-Text. Rx-Stoffe werden erkannt, nicht empfohlen oder dosiert.

Immer mit der Pflichtzeile aus `verdict-glossar.md` §8 zeigen.

---

## 8. Offene Fragen

1. Harte Punkteschwelle Tag ≥4 vs. nur qualitative Flags — A/B in der Demo?
2. Zählt AM-**Spot**-Clienzo voll wie Flächen-BPO (Prim weicht von SmPC-Abend/Fläche ab — erkennen, nicht umschreiben)?
3. Azelaic 10 % Kosmetik: Tag-Gewicht 1 fest oder 0 wenn schon lange verträglich?
4. Consumer-Surveys zu „Over-Exfoliation“: bisher **keine robuste, zitierfähige Bevölkerungsstudie** mit klarer Methodik gefunden (Marketing-/Blog-Zahlen wie „33 %“ ohne Primärquelle → **nicht** als stark verkaufen). Nachziehen wenn Peer-Review erscheint.
5. Rinse-off vs Leave-on BPO: Gewicht 0 vs 1 in Engine?
6. `physical_scrub` über INCI/Claims erkennbar genug?
7. Alignment Demo-`rules.js`: Tagesflag schon verdrahten oder erst nach Theory-Check?
8. Wochenbudget (z. B. max. N Retinoid-Abende): bewusst **optional** und v0.1 nur skizziert — ohne Therapieschema. Ob UI „Ruheabend“ als Soft-Chip reicht?

---

## 9. Evidenz & Quellen (kurz)

| Claim | Stärke | Quelle |
|---|---|---|
| Retinoide können reizen; seltener nutzen / Creme zuerst (Patientenedu) | **mittel–stark** | AAD Acne treat; AAD retinoid tips — https://www.aad.org/public/diseases/acne/derm-treat/treat |
| Mit **einem** Anti-Aging-/Active-Produkt starten, nicht mehrere gleichzeitig | **mittel** | AAD maximize anti-aging — https://www.aad.org/public/everyday-care/skin-care-secrets/anti-aging/maximize-anti-aging-products |
| Adult acne DIY: ein Active 6–8 Wochen, kein zweites dazu | **mittel** | AAD adult acne treatment — https://www.aad.org/public/diseases/acne/diy/adult-acne-treatment |
| Zu viele Produkte können Haut stressen / Akne verschlechtern | **schwach–mittel** | AAD „wont clear“ Tip — https://www.aad.org/public/diseases/acne/diy/wont-clear |
| AAD Acne Guideline 2024 (BPO, Retinoide, Kombis strong) | **stark** (Therapiekontext; App nur erkennen) | https://doi.org/10.1016/j.jaad.2023.12.017 |
| EuroGuiDerm Update: Adapalen+BPO f.c. stark empfohlen; Trend schlechtere Verträglichkeit vs. Einzelstoffe | **stark** / Tolerability **mittel** | https://doi.org/10.1111/jdv.70331 |
| Adapalen chemisch stabil mit BPO; klassisches Tretinoin nicht | **stark** (Stabilität) | Martin et al. 1998 — https://doi.org/10.1046/j.1365-2133.1998.1390s2008.x |
| Glykolsäure & RA erhöhen TEWL (Human, experimentell) | **mittel** | Effendy et al. Acta Derm Venereol 1995 — https://doi.org/10.2340/0001555575455458 |
| RA kann SC-Barriere sekundär beeinträchtigen (TEWL) | **mittel** | Effendy et al. Br J Dermatol 1996 — https://doi.org/10.1046/j.1365-2133.1996.26761.x |
| BPO/RA/SA keratolytisch, TEWL parallel zu SC-Entfernung | **mittel** | https://doi.org/10.1159/000093984 |
| Open- vs Full-Sandwich Moisturizer × Retinoid (ex vivo Bioaktivität) | **unsicher–mittel** (Poster/ex vivo) | JAAD 2025 Abs. — https://doi.org/10.1016/j.jaad.2025.05.1324 |
| Clienzo SmPC: Warnung Tretinoin/Iso/Tazaroten × BPO; Adapalen nicht in dieser Liste | **stark** (Label) | BASG Clienzo FI — siehe `prim-schrank.md` |
| Retinol EU-Limits | **stark** (Regulatorik) | VO (EU) 2024/996 |
| Repräsentative Consumer-Survey „Over-Exfoliation %“ | **unsicher** | **Fehlt** / nicht zitierfähig in v0.1 |

---

## 10. Engine-Skizze (nicht Therapy)

```
1. Produkte im Slot → Klassen (Whitelist / INCI-Klassifikator)
2. Paarregeln Konfliktmatrix (Prio)
3. Slot-Summe Reiz-Gewichte → Nacht-Schwelle
4. Kalendertag AM∪PM Summe → Tagesflag
5. Tags begleitpflege|barrier|sensibel → Schwellen verschärfen / begleit_barrier
6. Outcome + 1 Satz + optionaler Alternate (anderer Slot / skip_stack / Ruhe-Kosmetik)
7. Disclaimer
```

Optional Woche (v0.x): nur Soft-Chip „Actives wechseln / Pause-Abend“ — **keine** festen Therapietage.

---

*Ende reiz-budget.md v0.1 — Heuristik für Over-Stacking, keine Therapie.*
