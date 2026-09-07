# Kategorie Baby / Kind — Entscheidungsskizze

**Stand:** 2026-09-04 · Evidenzquellen, keine Therapie-Leitlinie für die App

## 1. Altersdefinitionen (nicht eine einzige „Kind“-Zahl)

| Quelle | Begriff | Alter |
|---|---|---|
| **EU VO 1223/2009** Annex I Teil B | Produkte „intended for use on children under the age of three“ | **< 3 Jahre** → *spezifische* Sicherheitsbewertung Pflicht |
| **EDQM / Europarat** „Safe cosmetics for young children“ (2023, 2. Aufl.) | „Infant“ in diesem Text | **alle Kinder unter 3** (nicht nur <12 Monate) |
| **WHO** | Infant | meist **< 1 Jahr** |
| **ICH E11 / EMA / FDA (Arzneimittelversuche)** | Infants & toddlers / children | ~28 Tage–23 Monate · children **2–11** · adolescents 12–17 |
| **Marketing „Kids bis 10“** | keine einheitliche Medizin-Definition | oft Marken-Band, nicht Leitlinien-Schnitt |

**App-Logik:** nicht „Kind = bis 10“ als medizinische Wahrheit verkaufen. Besser **Profile**:
- `baby_0_36m` (EU-relevante Schwelle <3)
- optional `kind_3_11` (Schulkind / vor Pubertät)
- ab Pubertät → bestehendes Face-Profil (Akne/Constraints), nicht „Kids“

## 2. Ab wann werden Kosmetikprodukte „empfohlen“?

Kosmetik ≠ Actives/Anti-Aging. Hygiene- und Barrier-Pflege ist von Geburt an üblich; Empfehlungen unterscheiden **Art** des Produkts:

| Bedarf | Typische Alters-Hinweise (Quellenrichtung) |
|---|---|
| Sanfte Reinigung, Windelbereich-Barrier, Emollient | ab Neugeborenenalter, wenn nötig — mild, möglichst **parfümfrei** (pädiatrische Derm-Konsens: Duft = häufige Allergenquelle) |
| **Sonnenschutz-Creme** | **AAP / AAD:** unter **6 Monaten** möglichst **kein** Sonnencreme-First — Schatten, Kleidung, Hut; ab ~6 Monaten Breitspektrum-SPF üblich |
| Gesichtspflege-Routine (Reiniger + Feuchte + SPF) | oft erst mit Vorpubertät relevant für „Poren/Akne“ (~**8–12**, z. B. CHOC/Kinderderm-Ratgeber); davor meist wenig Bedarf an „Routine“ |
| Akne-Actives (BHA, BPO kosmetisch, Retinoide) | nicht Baby/Kleinkind-Default; Infantile/neonatale Akne → **ärztlich**, nicht App-Therapie |

Die App gibt **keine** Therapie und keine „ab Monat X musst du X“. Sie hilft beim **Einkauf** von Produkten, die für die Zielgruppe gedacht und geflaggt sind.

## 3. Welche Flags für Baby/Kind?

Nicht 1:1 die Erwachsenen-Logik NC ∨ CF ∨ parfümfrei.

| Flag | Baby (<3) | Kind (~3–11) | Kommentar |
|---|---|---|---|
| **Parfümfrei** | **Hoch** | Hoch | Stärkste medizinische Übereinstimmung (Allergie/Sensibilisierung) |
| **Cruelty-free (CFI)** | ethisch ok, kein Haut-Outcome | ethisch ok | Siegel ≠ pädiatrische Sicherheit |
| **Non-komedogen** | **niedrig priorisieren** | mittel ab Vorpubertät / Akne-prone | NC ist Marketing; bei Säuglingen kaum das Kernproblem |
| **„Für unter 3“ / Baby-Kennzeichnung** | **Hoch** | — | EU verlangt dafür spezifische Safety Assessment — gutes Katalog-Signal |
| **Mild / ohne unnötige Actives** | Hoch | Hoch | Editorial: keine Erwachsenen-Retinol-Seren als Kids-Vorschlag |

## 4. Produkturteil

**Ja, eigene Kategorie** — aber:
1. **Getrennt** vom Erwachsenen-Schrank (andere Constraints, andere Slots: Windel, Bad, SPF-Kind, kein Adapalen-Layering).
2. Altersbänder an **EU <3** und optional **3–11** ausrichten, nicht willkürlich „0–2 und bis 10“ ohne Begründung (10 ist Marketing; medizinisch näher an ICH „child“ bis 11 / Pubertätsbeginn).
3. Filter-Priorität Baby: **parfümfrei + für unter 3 gedacht**; CF optional; NC nicht als Hauptfilter.
4. Scope-Risiko: Datenlage OBF/Claims für Baby noch dünner; Windelcreme vs. Rx-Hautmittel klar trennen (Arzt-Schiene).
5. Launch-Reihenfolge: Erwachsenen-Akne/EU zuerst war richtig; Baby/Kind als **Phase-2-Kategorie**, nicht parallel denselben Engine-Kern verwässern.

## Quellen (Abruf 2026-09-04)

- VO (EG) 1223/2009 Annex I Part B — spezifische Bewertung <3 Jahre
- EDQM / Council of Europe: *Safe cosmetics for young children* (2nd ed. 2023); ResAP(2012)1
- JDD 2020 Ceramide consensus neonates/infants — fragrance-free, mild cleansers
- AAP/AAD sunscreen guidance — caution <6 months
- CHOC / pediatric derm practice notes — Gesichtspflege-Routine oft ab Vorpubertät ~8–10
- ICH E11 age bands (drug development; Orientierung, keine Kosmetik-Zulassung)

Keine medizinische Beratung. App: Einkauf + Layering-Transparenz.

## Katalog-Output (Phase 2 Daten)

Stand 2026-09-04 — sourced Stichprobe (kein vollständiges EU-Register):

- `eu-baby-kind-katalog.csv` / `eu-baby-kind-katalog.md`
- Quellenlog: `eu-baby-kind-katalog-quellen.md`

Filter-Priorität unverändert: **parfümfrei + für unter 3 gedacht**; CF optional; NC nicht als Hauptfilter. App = Einkaufshilfe, keine Therapie.
