# Katalog: Scannen vs. Vorschlagen (v0.1)

## Zwei Ebenen (nicht vermischen)

| Ebene | Was | Quelle |
|---|---|---|
| **A — Schrank / Scan** | Moeglichst *jedes* EU-Barcode-Produkt hinterlegen | Open Beauty Facts + spaeter Haendlerfeeds + Nutzer-OCR. Kein Non-Comedogen-Zwang. |
| **B — Vorschlaege / Alternativen** | Kurze, kuratierte Liste wenn Verdict "lieber nicht" | Filter unten. Das ist *nicht* der ganze Markt. |

"Alle Produkte auf dem Markt" als *Scan* = Infrastruktur. Als *handgepflegte Excel* = unmoeglich und unnoetig.

---

## Vorschlags-Filter (Prioritaet)

1. **EU/DACH erhaeltlich** (dm, Rossmann, Douglas, Apotheke, Marken-EU-Shop)
2. **Passt zu Constraints + Slot** (Reiniger ersetzt Reiniger; kein Active-Spam)
3. **Nicht-komedogen-Claim auf Markenseite / Pack** — Marketing, kein EU-Rechtslabel. App zeigt: `claim:nicht-komedogen` + Disclaimer
4. Wenn kein Claim: **Cruelty-Free mit Siegel** (bevorzugt **Leaping Bunny** / CFI). Sonst Marken-Policy ohne Siegel = schwächer, separat taggen
5. Nie vorschlagen: unvertraegliche Matrix (`inactivate` / hartes `skip_stack`), Hydrochinon-Kosmetik, reine Duftbomben ohne Nutzen

**Disclaimer (immer bei Vorschlaegen):**  
Nicht-komedogen ist Herstellerangabe, keine Garantie. Cruelty-Free-Siegel kann sich aendern — vor Launch Siegel erneut pruefen.

Konzerne mit China-Vertrieb (viele L'Oreal/CeraVe/LRP/Vichy) haben oft **Non-Comedogen-Claim**, aber **kein** Leaping-Bunny. Fuer Prim's Wunsch: wenn Non-Comedogen *und* CF konkurrieren, **beide Töpfe** anbieten, klar gelabelt — Nutzerin filtert.

---

## Seed-Liste fuer Prim (trocken + sensibel + akne-prone)

Nur Produkte, die es *gibt*. Keine AM-Verkaufsvorschlaege (Clienzo/Adapalen bleiben Arzt-Schiene).

### Legende
- **NC** = Marke behauptet nicht komedogen (DE-Seite geprueft / ueblich in Linie)
- **CF-LB** = Leaping Bunny / CFI (lt. Provenance/CFI-Quellen Stand Recherche)
- **CF-self** = Marke sagt cruelty-free, ohne LB in unserer Recherche
- **EU** = DACH/EU-Kanal ueblich

### Reinigung
| Produkt | Regal / Verfügbarkeit | Tags | Warum hier |
|---|---|---|---|
| **Balea Med Ultra Sensitive Waschgel** | **dm** (~2–3 €) | Parfümfrei, Tensid-mild, EU | Der DACH-Drogerie-Klassiker bei gereizter Barriere & Aknetherapie |
| **Isana Pure Reinigungsschaum** | **Rossmann** (~2–3 €) | Parfümfrei, mild, EU | Drogerie-Alternative für Rossmann-Käufer |
| **CeraVe Hydrating Cleanser** | dm / Rossmann / Apotheke (~10–12 €) | NC, EU | Ceramide-Support für trockene/sensible Haut |
| **Bioderma Sensibio Gel Moussant** | Apotheke (~13–15 €) | NC, EU | Klinischer Standard bei extrem empfindlicher Haut |

### Feuchte / Barrier (Creme & Begleitpflege)
| Produkt | Regal / Verfügbarkeit | Tags | Warum |
|---|---|---|---|
| **Balea Med Ultra Sensitive Intensivcreme** | **dm** (~4 €) | Parfümfrei, Cica/Panthenol, EU | Günstigste wirksame Barrierecreme im dm-Regal |
| **Isana Pure Feuchtigkeitscreme** | **Rossmann** (~4 €) | Parfümfrei, Niacinamid+Panthenol | Milde Begleitpflege ohne Reizstoffe |
| **Mixa Panthenol Comfort Creme** | dm / Rossmann (~6–8 €) | Parfümfrei, Panthenol+Glycerin | Reichhaltige SOS-Pflege bei Retinoid-Schälung |
| **CeraVe Feuchtigkeitsspendende Gesichtscreme** | dm / Rossmann / Apotheke (~12 €) | **NC** explizit, EU | 3 essentielle Ceramide, Trocken + Barrier |
| **Bioderma Sébium Hydra** | Apotheke (~16 €) | **NC**, EU | Speziell formuliert als Begleitpflege bei austrocknender Aknetherapie |
| **Purito Mighty Bamboo Panthenol Cream** | EU-Online / K-Beauty (~18 €) | CF-self, EU-Vertrieb | Hoher Panthenol-Anteil, beruhigt Rötungen |

### Serum / Active (Kosmetik)
| Produkt | Regal / Verfügbarkeit | Tags | Warum |
|---|---|---|---|
| **The Ordinary Azelaic Acid Suspension 10%** | Douglas / dm / Online (~12 €) | CF-self, EU-Shop | 10 % kosmetische Azelainsäure, mattierend, milde Akne-Wirkung |
| **Geek & Gorgeous aPAD (20% PAD)** | dm / Online (~11 €) | CF-self, EU (HU) | Wasserleichtes Azelain-Derivat, reizarm bei sensibler Haut |
| **The Inkey List Azelaic Acid 10%** | Sephora / Online (~15 €) | **CF-LB**, EU | Leaping-Bunny zertifizierte Azelainsäure |
| **Paula's Choice 10% Azelaic Booster** | Douglas / Online (~39 €) | **CF-LB**, EU | High-End Azelainsäure mit Salicylsäure-Spuren |

### SPF (Tagesbegleiter — Pflicht bei Actives)
| Produkt | Regal / Verfügbarkeit | Tags | Notiz |
|---|---|---|---|
| **Balea Med Ultra Sensitive Sonnenfluid LSF 50+** | **dm** (~6 €) | Parfümfrei, EU-Filter | Solider, günstiger Drogerie-Schutz |
| **Nivea Sun UV Gesicht Sensitiv LSF 50** | dm / Rossmann (~10 €) | Parfümfrei, EU-Filter | Leichtes Finish, zieht schnell ein |
| **LRP Anthelios UVMune 400 Fluid LSF 50+** | Apotheke (~20 €) | NC, EU | Goldstandard Mexoryl 400, brennt nicht in den Augen |
| **CeraVe Feuchtigkeitscreme LSF 50** | dm / Rossmann / Apotheke (~14 €) | NC, EU | 2-in-1 Tagespflege mit Ceramiden |

### Nicht in die Kauf-Vorschlagsliste
- Clienzo, Adapalen, Skinoren, Differin → nur erkennen
- US-only Barcodes ohne EU-INCI
- "Non-comedogenic Oel als Active"

---

## Was die Engine tut

**Scan:** EAN → OBF/Eigen-DB → Schrank. Filter egal.  
**Alternativen-Tap:** aus Seed + spaeter wachsender Kuratierung, sortiert:

1. gleiche Kategorie  
2. NC-Claim  
3. sonst CF-LB  
4. Konflikt gegen Schrank = 0  
5. EU-Signal  

---

## Naechste Datenarbeit

1. Pro Seed-SKU: EAN (DE), Packshot-Claim NC ja/nein, Siegel-Screenshot-Datum
2. OBF-Dump anbinden (Scan-Ebene)
3. Nutzerin kann Filter umschalten: `nur NC-Claim` | `nur CF-LB` | `beides egal`

Stand: 2026-09-04. Siegel vor Launch re-checken.
