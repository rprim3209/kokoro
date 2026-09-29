# Adaptives Onboarding & Haut-Triage v0.3

Beim Start der App entscheidet eine einzige Weichen-Frage, welcher Fragenpfad geöffnet wird:

```
                      [App-Start / Profil]
                                |
             "Wie gut kennst du dich mit Skincare aus?"
                     /                     \
       [🌱 Ich stehe am Anfang]     [🔬 Ich kenne meine Wirkstoffe]
                    /                         \
        PFAD 1: EINSTEIGER               PFAD 2: SKINCARE-PRO
     (Hautgefühl, Sebum, Barriere,    (Retinoid-Klasse, Skin Cycling,
      Rx-Status, 7 Alltagsfragen)      Säuren-Frequenz, No-Gos, 6 Fragen)
```

---

## Einstiegs-Weiche (1 Klick)

**„Wie vertraut bist du mit Skincare & Wirkstoffen?“**
* **A — 🌱 Einsteiger / Gesunderhaltung:** *„Ich will eine unkomplizierte Routine, die zu meiner Haut passt – egal ob gesunder Hautschutz, Prävention oder bei ersten Hautthemen.“* ➔ **Pfad 1**
* **B — 🔬 Skincare-Pro:** *„Ich kenne Wirkstoffe wie Retinol, BHA, Niacinamid und möchte mein Layering, meine Abende und meinen Schrank optimieren.“* ➔ **Pfad 2**

---

## PFAD 1: Einsteiger (7 Alltagsfragen — geschlechtsneutral & für alle Hautzustände)

Fokus auf unmittelbare Wahrnehmung, Sebum, Empfindlichkeit, Gesunderhaltung und Begleitpflege-Bedarf.

### Q1 — Nach dem Waschen (Hautgefühl nach 2 Min)
*Wie fühlt sich dein Gesicht kurz nach dem Waschen und Abtrocknen an?*
- A: **Normal:** Spannt nicht, fettet nicht, der Haut fehlt nach dem Waschen nichts. ➔ `normal +2`, `barrier_ok +1`
- B: **Trocken:** Spannt unangenehm oder fühlt sich „eine Nummer zu klein“ an. ➔ `trocken +2`, `barrier +1`
- C: **Mischhaut:** Wangen spannen leicht, Stirn & Nase sind neutral. ➔ `misch +2`
- D: **Ölig:** Schnell wieder entspannt, bildet bald neuen Glanz. ➔ `oelig +2`
- E: **Sensibel:** Brennt, kribbelt oder rötet sich (auch nach der Rasur). ➔ `sensibel +3`, `barrier +2`

### Q2 — Nachmittags-Check (Sebum-Produktion gegen 14:00 Uhr)
*Wie sieht deine Haut am Nachmittag im natürlichen Zustand aus (ohne Mattierung / Puder)?*
- A: **Ausgeglichen:** Vital & matt, gesunder Zustand ohne Spannungsgefühl oder Fettglanz. ➔ `normal +2`, `gesund +2`
- B: **Matt / Schuppig:** Komplett matt, teils feine Trockenheitsfältchen oder Schüppchen. ➔ `trocken +2`
- C: **T-Zone glänzt:** Stirn, Nase oder Kinn glänzen, die Wangen bleiben matt. ➔ `misch +2`
- D: **Vollflächig ölig:** Deutlicher Ölglanz im gesamten Gesicht. ➔ `oelig +2`
- E: **Dehydriert:** Glänzt ölig, spannt aber gleichzeitig unangenehm darunter. ➔ `oelig +1`, `barrier +2` *(ölig-dehydriert)*

### Q3 — Reaktivität & Empfindlichkeit
*Wie reagiert deine Haut auf Pflegeprodukte, Rasuren oder Wetterumschwünge?*
- A: **Robust:** Völlig unkompliziert, verträgt fast alles problemlos. ➔ `robust +2`, `normal +1`
- B: **Leicht reizbar:** Gelegentlich Rötung oder Brennen (z.B. nach Rasur, Kälte, Parfüm). ➔ `sensibel +1`
- C: **Hochsensibel:** Häufig Brennen, Stechen, Rötung oder Hitzegefühl. ➔ `sensibel +3`, `barrier +2`

### Q4 — Unreinheiten & Hautthemen
*Welche Unreinheiten oder Hautthemen beschäftigen dich am ehesten?*
- A: **Keine / Rein:** Haut ist gesund, Fokus liegt auf Frische & täglichem Sonnenschutz. ➔ `rein +2`, `normal +2`, `gesund +2`
- B: **Rasurbrand:** Gelegentlich Rasur-Pickelchen, eingewachsene Haare oder Reizung. ➔ `rasur +1`, `sensibel +1`
- C: **Mitesser:** Verstopfte Poren, Mitesser (schwarz/weiß) oder raue Textur. ➔ `akne-prone +2` *(komedonal)*
- D: **Entzündliche Pickel:** Rote Pickelchen und Pusteln, die schubweise auftreten. ➔ `akne-prone +3` *(entzündlich)*
- E: **Unterlagerungen:** Tiefe, harte Knoten unter der Haut, die bei Druck schmerzen. ➔ `akne-prone +2`, `arzt-thema` *(zystisch)*

### Q5 — Vorwissen & Wirkstoff-Status
*Nutzt du aktuell ein medizinisches Mittel oder spezielle Wirkstoffe?*
- A: **Keine:** Nur Basispflege oder Wasser – möchte gesunde Haut einfach richtig schützen. ➔ `gesunde_haut +2`, `basis_routine`
- B: **Drogerie-Actives:** Freiverkäufliche Säuren (BHA/AHA), Retinol oder Vitamin C. ➔ `actives_nutzer`
- C: **Hautarzt (Rx):** Rezeptpflichtiges Mittel (z.B. Adapalen, Epiduo, BPO, Tretinoin). ➔ `begleitpflege_aktiv`, `retinoid_rx`

### Q6 — Barriere-Zustand & Creme-Bedarf
*Brauchst du tagsüber zwingend eine Creme, damit sich deine Haut gut anfühlt?*
- A: **Nicht zwingend:** Der Haut fehlt nichts, ein leichter Sonnenschutz genügt vollkommen. ➔ `normal +2`
- B: **Immer nötig:** Ohne Feuchtigkeitscreme spannt, schuppt oder juckt die Haut. ➔ `trocken +2`, `barrier +2`
- C: **Nur situativ:** Vor allem im Winter, bei trockener Heizungsluft oder nach dem Rasieren. ➔ `barrier +1`
- D: **Eher nein:** Normale Cremes fühlen sich schnell schwer, fettig oder klebrig an. ➔ `oelig +1`

### Q7 — Pflegeziel
*Was ist dein wichtigstes persönliches Ziel für deine Pflegeroutine?*
- A: **Gesunderhaltung:** Barriere bewahren und mit täglichem UV-Schutz vorzeitiger Alterung vorbeugen. ➔ Tag: `Prävention & LSF`, `gesund +2`
- B: **Poren-Balance:** Verstopfte Poren, Mitesser oder Glanz mild regulieren. ➔ Tag: `Poren-Balance`
- C: **Beruhigung:** Rötungen lindern und Barriere (auch nach Rasur) reparieren. ➔ Tag: `Barriere-Support`
- D: **Reizarmut:** 100% parfümfrei, ohne Alkohol denat., vegan & Cruelty-Free. ➔ Tag: `Parfümfrei`, `Cruelty-Free`

---

## PFAD 2: Skincare-Pro (6 Wirkstoff- & Layering-Fragen)

Fokus auf aktive Stoffklassen, Schichtungsgewohnheiten, Skin Cycling und Reizschwellen.

### P1 — Aktive Leit-Wirkstoffe im Schrank
*Welche starken Wirkstoffe sind aktuell fester Bestandteil deiner Routine?*
- A: **Barriere & LSF:** Täglicher Breitband-UV-Schutz, Ceramide & Feuchtigkeit (keine Reiz-Actives). ➔ `normal +2`, `barrier_fokus`
- B: **Retinoid (Rx):** Medizinisches Retinoid oder BPO (Adapalen, Tretinoin, Epiduo, Benzaknen). ➔ `retinoid_rx`, `begleitpflege_aktiv`
- C: **Retinol (OTC):** Freiverkäufliches kosmetisches Retinoid (Retinol, Retinal). ➔ `retinoid_cos`
- D: **Chemische Peelings:** AHA Glykolsäure, Milchsäure oder 2% BHA Salicylsäure. ➔ `aha`, `bha`
- E: **Milde Regulatoren:** Azelainsäure 10%, Niacinamid 5–10% oder Vitamin C. ➔ `azelaic`, `niacinamide`

### P2 — Routine-Architektur & Rhythmus
*Wie strukturierst du deine Abende?*
- A: **Basispflege:** Konstante milde Reinigung, Feuchtigkeit & gesunde Regeneration. ➔ `minimal_basis`
- B: **Skin Cycling:** Fester Rhythmus (z.B. Tag 1 Säure, Tag 2 Retinoid, Tag 3–4 Pause). ➔ `skin_cycling: true`
- C: **Tägliches Schichten:** Wirkstoff fast jeden Abend aufgetragen, Haut ist adaptiert. ➔ `high_frequency`
- D: **Nach Bedarf:** Dynamisch & intuitiv je nach aktuellem Hautgefühl. ➔ `dynamic`

### P3 — Akuter Barriere-Zustand (Retinisierung & Reizschwellen)
*Zeigt deine Haut aktuell Anzeichen von Überreizung oder Schälung?*
- A: **Tolerant & stabil:** Gesunde Barriere, keine Schälung, keine Rötung. ➔ `barrier_robust`, `normal +1`
- B: **Situativ gereizt:** Nur wenn zu viele Actives gestapelt werden oder nach Rasur. ➔ `sensibel +1`
- C: **Akut irritiert:** Trockenheitsinseln, Schuppung um Mund/Nase oder Brennen beim Eincremen. ➔ `barrier_fragil +3`, `begleit_barrier`

### P4 — Peeling-Frequenz (AHA / BHA)
*Wie oft nutzt du chemische Leave-on Peelings?*
- A: **Gar nicht:** Haut ist im Gleichgewicht oder Säuren beißen sich mit Retinoid. ➔ `no_peeling`
- B: **1–2× pro Woche:** Gezielt zur sanften Porenklärung und Hautglättung. ➔ `peeling_moderat`
- C: **3× oder öfter:** Fast täglich im Toner oder Peeling-Serum. ➔ `peeling_intensiv`

### P5 — Textur- & Finish-Präferenz
*Welche Galenik bevorzugst du für deine Feuchtigkeitsstufe?*
- A: **Leichte Lotion:** Klassische Feuchtigkeitspflege für normale bis ausgeglichene Haut. ➔ `normal +2`
- B: **Gel-Creme / Fluid:** Zieht matt ein, klebt nicht im Bart, neigt nicht zu Glanz. ➔ `oelig +2`
- C: **Reichhaltige Creme:** Lipide & Ceramide (auch für Sandwich-Methode geeignet). ➔ `trocken +2`, `barrier +1`
- D: **Hybrid-Layering:** Feuchtigkeitsserum + leichte Creme kombiniert. ➔ `hybrid_layering`, `misch`

### P6 — Ausschluss-Kriterien & Filter
*Welche Kriterien sollen bei jedem Scan sofort rot flaggen?*
- A: **Duftstoffe & Alkohol:** Limonene, Linalool, Parfüm & austrocknender Alkohol denat. ➔ `parfuemfrei`, `reizarm`
- B: **Cruelty-Free:** Offizielle Leaping Bunny oder PETA Zertifizierung. ➔ `cruelty_free_lb`
- C: **Keine Filter:** Hauptsache wissenschaftlich und evidenzbasiert belegt. ➔ `clean_science`

---

## Auswertung & Tag-Mapping

* **Hautzustand & Feuchte:** Gesunde Haut ｜ Normale Haut ｜ Trocken ｜ Mischhaut ｜ Ölig ｜ Ölig-dehydriert
* **Präventions-Fokus:** `Prävention & LSF` (Anerkennung, dass auch unkomplizierte Haut tägliche Reinigung, Feuchtigkeitsbalance und UV-Schutz braucht)
* **Reaktivität:** Sensibel ｜ Robust
* **Akne- & Rasur-Achse:** Rasur-sensibel ｜ Komedonal ｜ Entzündlich ｜ Zystisch (`arzt-thema`)
* **Begleitpflege-Status:** Automatisch `🛡️ Begleitpflege aktiv`, wenn Q5=C (Einsteiger) oder P1=B (Pro) gewählt wird.
