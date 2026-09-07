# Prim-Schrank (erster Testfall)

Constraints (vorläufig): akne-prone / zystische Akne, Barrier gerade gereizt (Spannung → extra Creme).

INCI aus Herstellerseiten, nicht von der Dose abgeschrieben — bei Abweichung gilt die Dose.

---

## AM

| Reihenfolge | Produkt | Schiene | Klassen | EU-Signal | Notiz |
|---|---|---|---|---|---|
| 0 | nur Wasser | — | — | — | kein Reiniger |
| 1 | **Good Molecules** Hyaluronic Acid Serum (vorher Inkey List) | support | humectant | unsicher / oft Import | kein Akne-Active |
| 2 | **The Ordinary** Azelaic Acid Suspension **10 %** | kosmetik | `azelaic` | ja (TO hat EU-Shop) | Präsentation kosmetisch. Studienlage 15–20 % nicht 1:1 vererben → Grade **dünn–mittel**. INCI u. a. Aqua, Isodecyl Neopentanoate, Dimethicone, **Azelaic Acid**, … |
| 2b | **Clienzo** 10 mg/g + 50 mg/g Gel (bei Pickeln, Spot) | **arzneimittel** | `ab_top` + `bpo` | ja (DACH Rx) | **Clindamycin 1 % + Benzoylperoxid 5 %**. Nicht reines BPO. Fachinfo: 1× täglich **abends** auf das **gesamte** betroffene Areal, max. ca. 12 Wochen ohne Rücksprache. Prim nutzt es **morgens als Spot** — App: erkennen + Label-Hinweis, nicht umschreiben. Bleicht Stoff (`bleach`). |
| 3 | **Purito** Mighty Bamboo Panthenol Cream | support (+ leises `niacinamide`) | panthenol 10 %, squalane, centella-Stoffe, Niacinamid **mitten** in der Liste | ja (KR, in EU vertrieben) | Niacinamid hier nicht als 4–5 %-Active behandeln (% steht nicht als Studien-Dosis auf der Dose) |
| 4 | **e.l.f.** Barrier Cream (vermutlich Holy Hydration! Barrier Goals) | support | glycerin, dimethicone, hafer, centella | ja | extra gekauft weil **Spannung** — Barrier-Flag, kein Active |
| 5 | SPF: **Trader Joe’s** gelartig **oder** **Neutrogena Ultra Sheer Dry-Touch SPF 70** | support / uv | UV-Filter | **TJ: nicht EU**. Neutrogena 70 Dry Touch: US-Formel, nicht 1:1 DACH-Regal | Slot SPF ist richtig. Filter-INCI später von der Dose |

### AM gegen Matrix (ohne Abend)

| Paar | Code | Bedeutung für Prim |
|---|---|---|
| Clienzo (`ab_top`+`bpo`) | kein `resistance` | BPO ist **drin** — genau die Kombi, die AAD/EuroGuiDerm wollen. Kein Antibiotikum allein. |
| Clienzo × Azelaic 10 % | `ok` + optional Reiz | Kein Inactivate. Beide können reizen → passt zur Extra-Barrier-Creme. |
| Clienzo | `not_cosmetic` + `bleach` | Arzt-Schiene, bleicht Kissen/Handtücher. |
| Azelaic + Support + SPF | `ok` | unverändert |

App-Verdict-Roh: **Passt stofflich**, mit Hinweis: Rx-Kombi erkannt; Fachinfo sagt Abend/Fläche, du nutzt Spot/Morgen — das entscheidet die Praxis, nicht die App. Spannung = Barrier, nicht falsche Chemie.

---

## PM

Zwei Modi — Prim wechselt, stapelt nicht.

### Modus A — Standard (Adapalen)

| Reihenfolge | Produkt | Schiene | Klassen | Notiz |
|---|---|---|---|---|
| 0 | **CeraVe** sanfte Washlotion | support | reiniger | EU-stark (L’Oréal/CeraVe DACH) |
| 1 | HA-Serum (wie AM, Good Molecules / zuvor Inkey) | support | humectant | |
| 2 | **Purito** Panthenol **oder Purito Oat Gel Cream** | support | barrier | beide Purito; ein Slot |
| 3 | **Adapalen** (Rx) | **arzneimittel** | `retinoid_rx` | nicht = Retinol. DE Rx. |
| 4 | **e.l.f.** Creme (dickere Konsistenz) | support | barrier / occlusive | Sandwich nach Adapalen |

### Modus B — aktive Pickel / Entzündung

Wie A, aber Slot 3 = **Clienzo statt Adapalen** (nicht zusätzlich).

---

## Tag gegen Matrix

| Situation | Code | App-Satz |
|---|---|---|
| PM Adapalen allein (Modus A) | `ok` + `uv` (Tagsüber SPF) | Passt. Retinoid erkannt, Arzt-Schiene. |
| PM Clienzo statt Adapalen (Modus B) | `ok`, kein `resistance` | Passt stofflich — Kombi schon mit BPO. |
| Adapalen **und** Clienzo dieselbe Nacht | `skip_stack` (+ Reiz) | Lieber nicht stapeln. Du machst das schon richtig (Wechsel). |
| AM Spot-Clienzo **plus** PM Adapalen | `skip_stack` möglich | Zwei Reizschienen an einem Tag. App: Flag „viel Active heute“, kein Verbot. |
| AM Azelaic + PM Adapalen | `ok` (anderer Slot) | Kein Inactivate. Reiz additiv möglich → deine Barrier-Cremen sind das Gegengewicht. |
| AM Azelaic + PM Clienzo | `ok` + Reizhinweis | wie oben |
| CeraVe + HA + Creme ohne Active | `ok` | Support-Schiene |

### Was die Engine am Scan lernen soll

1. **Exklusiv-Slot:** Adapalen ‖ Clienzo — gleiche PM-Position, `mutex`-Flag.
2. **Arzt-Schiene** zweimal: Adapalen + Clienzo beide `not_cosmetic` / kein dm-Ersatz.
3. **Sandwich** (Creme → Active → dickere Creme) ist Nutzerwahl, kein Matrix-Konflikt.
4. Fachinfo Clienzo = abends/Fläche; Prim AM-Spot + PM-Wechsel = erkennen, nicht umschreiben.

Erster echter Tages-Verdict: Routine ist **chemisch kohärent**, solange Adapalen und Clienzo sich abwechseln. Hauptrisiko ist Reiz/Barrier (schon sichtbar), nicht eine verbotene Stoffpaarung.

---

## Warum die App Clienzo und Adapalen nicht zusammen sagt

**Kurz und ehrlich:** Nicht weil Leitlinien Adapalen + BPO verbieten. Die empfehlen die Kombi. Sondern weil zwei getrennte Reiz-Arzneimittel ohne Fertiggalenik fuer dich (Barrier schon angespannt) das Risiko sind.

### Was Leitlinien wirklich sagen

| Quelle | Inhalt |
|---|---|
| **EuroGuiDerm** | **Stark:** top. **Adapalen + BPO** (Fertigkombi) und **BPO + Clindamycin** (Fertigkombi) bei leichter-mittelschwerer papulopustuloeser Akne. Adapalen+BPO: Trend zu schlechterer Vertraeglichkeit vs. Einzelstoffe. |
| **AAD 2024** | Strong: BPO, top. Retinoide, top. Antibiotika; multimodal; Antibiotikum nicht allein. Fertigkombis empfohlen. |
| **Cabtreo** (US) | Clinda + Adapalen + BPO in einer formulierten Dose. Freies Draufstapeln ist nicht dasselbe. |

Quellen: https://doi.org/10.1111/jdv.70331 · https://doi.org/10.1016/j.jaad.2023.12.017

### Was die Clienzo-Fachinfo sagt

Gleichzeitige Anwendung mit **Tretinoin, Isotretinoin oder Tazaroten** vermeiden: BPO kann deren Wirksamkeit mindern und die Irritation erhoehen; wenn noetig: verschiedene Tageszeiten.

**Adapalen steht in dieser Warnliste nicht.** Adapalen ist photostabil und bewusst mit BPO kombinierbar (Epiduo / AAD). Texte die behaupten BPO deaktiviert Adapalen vermischen das mit Tretinoin.

Quelle: BASG Clienzo SmPC 4.5 — https://medikamente.basg.gv.at/documents/140890__DOTC_FACH_INFO.pdf

### App-Copy (Entwurf)

**Titel:** Lieber nicht dieselbe Anwendung.

1. Clienzo = Clindamycin + 5 % BPO. Adapalen = Retinoid. Beide reizen; EuroGuiDerm sieht bei Adapalen+BPO schon in der Fertigkombi mehr Unvertraeglichkeit.
2. Zwei separate Tuben sind nicht Epiduo/Cabtreo. Ohne abgestimmte Galenik steigt das Barrier-Risiko (bei dir: Extra-Creme wegen Spannung).
3. Fachinfo warnt bei anderen Retinoiden vor Gleichzeitigkeit mit Clienzo. Adapalen ist von der Inaktivierungs-Warnung ausgenommen; dein Wechsel ist trotzdem die schonendere Strategie.

**Nicht sagen:** Leitlinien verbieten Adapalen mit BPO.

**Matrix-Code:** skip_stack (Reiz), nicht inactivate (das waere Tretinoin x BPO).
