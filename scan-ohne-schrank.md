# Scan ohne Schrank v1

**Stand:** 2026-09-08 (Europe/Vienna)  
**App:** Prim’s Kosmetikschrank  
**Zweck:** Was der Scan/Suche-Verdict sagt, wenn der virtuelle Schrank **leer oder nahezu leer** ist — ohne Layering zu erfinden und ohne den Scan zu blockieren.  
**Verwandt:** `editorial.md`, `schrank-modell.md`, `constraints-v1.md`, `verdict-glossar.md`, `inci-klassifikator.md`, `quiz-7.md`, `arzt-schiene.md`, `theory-check.md`, `mvp.md`.  
**Schließt:** Theory-Check Blocker #4 / `verdict-glossar.md` §6.

---

## 0. Hard Rules

| Darf | Darf nicht |
|---|---|
| Scan/Suche auch ohne Schrank | Therapie, Schema, Dosis, Heilversprechen |
| **Zu dir** aus Profil + Tags | Layering-Konflikt gegen **leere** Slots erfinden |
| Schrank-Zeile ehrlich: „noch nicht prüfbar“ | „passt zu deiner Routine“ ohne Produkte |
| Soft Slot-Hinweis (Kategorie AM/PM) | Soft-Prefs (`pref_nc`, `pref_cf`, fehlendes NC) → **Konflikt** |
| Einladen, Schrank zu füllen — **ohne** Scan zu sperren | Active-Upsell bei `arzt-thema` |
| Worst wins **nur** über Dimensionen, die wirklich laufen | Rx bewerben / „lass dir X verschreiben“ |

Ampel-Wörter kanonisch (`verdict-glossar.md`): **passt** | **eher nicht** | **Konflikt**.  
Pflicht-Disclaimer unter jedem Verdict:  
*Keine medizinische Therapie — reines Einkaufs- & Layering-Erkennungstool.*

---

## 1. Wann „ohne Schrank“ gilt

Modus `schrank_status: ohne` (oder gleichwertig), solange **kein layering-relevantes Produkt** im Schrank liegt.

| Fall | Gilt als „ohne Schrank“? | Warum |
|---|---|---|
| **0 Produkte** in allen Slots | **Ja** | Kein Partner für Matrix |
| **Nur Wasser** / Platzhalter „kein Reiniger“ / „nur Wasser waschen“ (wie `prim-schrank.md` AM Schritt 0) | **Ja** | Kein INCI, keine Klasse, kein Matrix-Partner |
| Profil gesetzt, Slots angelegt, aber **alle leer** | **Ja** | Struktur allein ≠ Routine |
| Nur Support-Platzhalter ohne EAN/INCI (Demo-Stub) | **Ja** (behandeln wie leer) | Keine echte Klasse |
| ≥ 1 echtes Produkt mit Klasse/INCI (Kosmetik, AM, Support mit Flags) | **Nein** → normaler Scan | „Zum Schrank“ läuft |
| 1 Produkt + restliche Slots leer | **Nein** (Teil-Schrank) | Matrix gegen das **eine** Produkt; Lücken-Hinweis ok, aber nicht „ohne Schrank“ |

**Nahezu leer** = weiterhin Modus ohne Schrank, bis das erste echte Produkt gespeichert ist.  
Wasser-Zeilen dürfen im UI stehen bleiben; sie zählen **nicht** für Worst-wins / Matrix.

---

## 2. Mindest-Eingaben vor dem Verdict

Scan darf starten, sobald das **Minimum** da ist. Fehlendes Quiz blockiert **nicht**.

### 2.1 Pflicht

| Eingabe | Minimum | Default wenn fehlt |
|---|---|---|
| **Profil / Altersband** | eines von `profil_adult` \| `profil_teen` \| `profil_kind` \| `profil_baby` | Start-Screen: Nutzerin wählt; sonst `profil_adult` |
| **Scan-Eingang** | EAN / Name / INCI-OCR → Produkt + Flags/Klassen (`inci-klassifikator.md`) | ohne Match → offen, kein erfundenes Verdict |

### 2.2 Tags (Zu dir)

| Situation | Tags | Feuchte-Haupt-Tag |
|---|---|---|
| Quiz fertig | Engine-Tags aus `constraints-v1.md` / `quiz-7.md` | eines von `trocken`/`oelig`/`misch`/`unklar` |
| **Kein Quiz** | Soft-Defaults je Profil; **kein** hartes Constraint erzwingen | **`unklar`** |
| Quiz abgebrochen / „Weiß nicht“ | wie kein Quiz + gesetzte Teiltags behalten | `unklar` wenn Feuchte unklar |

**Defaults ohne Quiz (nur Preference / neutrale Basis — nie Konflikt allein deshalb):**

| Profil | Soft-Default | Nicht setzen |
|---|---|---|
| Adult | nichts Hartes; Feuchte `unklar` | `arzt-thema`, `begleitpflege`, `akne-prone` |
| Teen | `profil_teen`; Anti-Aging/`not_for_minors` vorsichtig | Adult-Active-Upsell |
| Kind | `profil_kind`; Parfümfrei-Priorität hoch | NC als Hauptfilter |
| Baby | `profil_baby`; Parfümfrei + under3-Priorität | Adult-Actives |

Soft-Prefs (`pref_nc`, `duftstofffrei`, `pref_cf`) nur wenn Quiz/Constraints sie setzen — **ohne Quiz nicht still auto-erzwingen**, außer Profil-Baby/Kind Parfümfrei-Hauptfilter (Constraints §4.7).

### 2.3 Explizit optional (nie Scan-Blocker)

- Volles 7-/Pro-Quiz  
- Schrank befüllen  
- Leit-Active-Triage (siehe §5)  
- Begleitpflege-Flag (kommt aus Quiz **oder** später aus erkanntem Rx im Schrank)

---

## 3. Welche Verdict-Dimensionen laufen

| # | Dimension | Ohne Schrank | Ergebnis-Form |
|---|---|---|---|
| 1 | **Zu dir** | **JA** | `passt` / `eher nicht` / `Konflikt` nach `constraints-v1.md` |
| 2 | **Zum Schrank** | **SKIP** — Anzeige: **noch nicht prüfbar** | Kein Ampel-Beitrag; **kein** erfundenes `ok`/`skip_stack` |
| 3 | **Slot** | **Nur Soft-Vorschlag** | Placement-Text (Reiniger/Serum/Creme/SPF, eher AM/PM); **kein** Konflikt allein aus leerem Slot |

### Worst wins ohne Schrank

Nur Dimensionen, die **laufen**, zählen:

```
Gesamt = Worst( Zu dir [, Slot nur wenn „eher nicht“ durch Umbau-Hinweis] )
Zum Schrank trägt 0 bei (weder passt noch Konflikt).
```

- Soft-Prefs und fehlender NC-Claim → **nie** Konflikt.  
- `Konflikt` ohne Schrank nur aus **Zu dir** (z. B. Baby+Parfüm, `arzt-thema`+Active-Upsell).  
- UI zeigt weiter **drei Zeilen**; Zeile 2 ist Info, keine Ampel-Lüge.

### Was „Zu dir“ ohne Schrank **sagen darf**

- Passt zu Tags/Profil (Duft, Textur-Tendenz, Baby/Teen-Filter, EU-Signal grob).  
- Pharmazie-Einordnung des Stoffs (Klasse, Claim vs. Evidenz) — Shopping-Helper.  
- Bei `unklar`: neutrale Basis + „Tags später im Quiz schärfen“.

### Was die App **nicht** claimen darf (ohne Schrank)

- „Passt zu **deiner Routine** / zu dem was du schon nutzt“ (Routine unbekannt).  
- „Kein Konflikt mit deinem Retinoid / Adapalen“ (nichts im Schrank).  
- „Gehört in Schritt X **neben deinem Y**“.  
- Layering-Codes (`skip_stack`, `same_class`, `inactivate`, …) gegen Phantom-Slots.  
- Tagesreiz-Budget / Wechsel-Slots rechnen.  
- Therapie („behandelt“, Schema, Rx-Befehl).

---

## 4. Copy-Templates (leerer / nahezu leerer Schrank)

Platzhalter `{grund}` = ein kurzer Satz aus Constraints/INCI.

### 4.1 Gesamt-Ampel (1 Blick)

```
🟢 passt — {grund zu Tags/Profil}. Schrank noch leer — Layering folgt nach dem ersten Produkt.
🟡 eher nicht — {grund}. Schrank noch leer — nur Haut-/Profil-Check.
🔴 Konflikt — {grund}. Schrank noch leer — kein Layering-Check nötig für diese Warnung.
```

### 4.2 Drei Zeilen (Detail)

**Zu dir**

| Outcome | Vorlage |
|---|---|
| passt | `Zu dir: passt — {z. B. parfümfrei / leichte Textur / under3 ok}.` |
| eher nicht | `Zu dir: eher nicht — {z. B. enthält Duftstoffe / sehr reich für ölige Haut}.` |
| Konflikt | `Zu dir: Konflikt — {z. B. parfümiert bei Baby / Active-Upsell bei Arzt-Thema}.` |
| unklar-Tags | `Zu dir: passt (neutral) — Noch kein Quiz: nur Basis-Check. Tags später schärfen.` |

**Zum Schrank** (immer Info, keine Ampel-Farbe erzwingen)

```
Zum Schrank: noch nicht prüfbar — Dein Schrank ist leer (oder nur Wasser).
Speichere das Produkt oder füge vorhandene hinzu — dann prüfen wir Layering.
```

Variante nur-Wasser:

```
Zum Schrank: noch nicht prüfbar — Bisher nur Wasser / kein Reiniger-Produkt.
Sobald echte Produkte drin sind, rechnen wir Konflikte.
```

**Slot** (soft)

```
Slot-Hinweis: Eher {Reiniger|Serum/Treat|Creme|SPF}, typisch {morgens|abends|beide}.
Kein Pflichtplatz — erst Vorschlag, bis der Schrank steht.
```

### 4.3 Einladung Schrank füllen (nie modal-blockierend)

Unter dem Verdict, sekundär:

```
Tipp: Produkt speichern oder 2–3 Alltagsprodukte scannen —
dann wird „Zum Schrank“ scharf. Scan bleibt frei.
```

Optional Chip/Buttons (nicht Pflicht vor Ergebnis):

- `In Schrank speichern`  
- `Quiz für schärfere Tags`  
- `Später`

### 4.4 Was Copy **nicht** darf

- „Füge erst Produkte hinzu, **sonst kein Scan**.“  
- „Routine harmonisch“ / „keine Stacking-Gefahr“ ohne Partner.  
- Active-Shop-Liste bei `arzt-thema`.  
- Garantien (NC, hypoallergen, 100 % verträglich).

---

## 5. Kanonische Triage: Scan-First vs. Quiz-First

Mehrere Specs hatten Weichen (MVP Weg A/B, Schrank-Modell Aisle, README Profil+Quiz). **Eine** Regel:

### Kanon (verbindlich)

```
1. Profil wählen (Adult/Teen/Kind/Baby)     ← Minimum
2. Scan/Suche ist Sofort erlaubt            ← Aisle Mode, Zero-Friction
3. Verdict = Zu dir (+ Slot soft); Zum Schrank = noch nicht prüfbar
4. Quiz = optional, parallel oder danach    ← schärft Tags, blockiert nicht
5. Schrank füllen = optional, nach Scan     ← „Speichern & später vervollständigen“
```

| Kontext | Reihenfolge | Quiz? |
|---|---|---|
| **Drogerie / Aisle** | Profil (falls neu) → **Scan** → Verdict → optional speichern | optional später zu Hause |
| **Zuhause, Einsteiger** | Profil → **kurzes Quiz angeboten** → Scan oder Ideal-Start | empfohlen, nicht Pflicht |
| **Zuhause, kennt Routine** | Profil → leerer Schrank → Produkte scannen/suchen | optional; Pro-Pfad wenn gewünscht |
| **Kein Profil gewählt** | vor erstem Verdict Profil abfragen (1 Tap) | — |

### Optionale 1-Fragen-Leit-Active (Aisle, ohne Schrank)

Aus `schrank-modell.md` Scan-First — **nur Soft**, ersetzt keinen Schrank:

> „Nutzt du abends starke Wirkstoffe (Adapalen, Retinol, Säuren, BPO)?“  
> - **Ja** → Soft-Flag `leit_active_abends` für **Hinweis-Copy** („Wenn du abends schon ein Retinoid nutzt: nicht dieselbe Nacht stapeln — speichere es im Schrank für den echten Check.“). **Kein** Matrix-`skip_stack` ohne gespeichertes Produkt.  
> - **Nein / Weiß nicht** → nur Zu-dir-Verdict.

Diese Antwort speichert **kein** Phantom-Produkt und erzeugt **keinen** Konflikt allein.

### Was entfällt als Blocker

- „Erst 8 Produkte tippen, dann scannen.“  
- „Erst Quiz zu Ende, sonst kein Aisle-Scan.“  
- Modal, das Scan erst nach Schrank-Fill freigibt.

---

## 6. Übergang: erstes echtes Produkt im Schrank

Trigger: Nutzerin speichert ein Produkt mit auswertbarer Klasse/INCI (nicht Wasser-Platzhalter).

| Schritt | Verhalten |
|---|---|
| 1 | `schrank_status` → `teil` (1 Produkt) oder `voll` später |
| 2 | **Zum Schrank** für den **aktuellen** Kandidaten **neu rechnen** (Matrix gegen gespeicherte Klassen) |
| 3 | Worst wins wieder über **alle drei** Dimensionen (`verdict-glossar.md` §3) |
| 4 | Copy „noch nicht prüfbar“ entfernen; bei Bedarf „nur 1 Partner — mehr Produkte = schärfer“ |
| 5 | Wenn gespeichertes Produkt Rx/`not_cosmetic` → `begleitpflege`-Logik / Arzt-Schiene-Erkennung anwerfen (`arzt-schiene.md`) |
| 6 | Offener Scan-Screen: Verdict live aktualisieren (kein zweiter Pflicht-Scan) |

**Wasser bleibt ignoriert** als Matrix-Partner, auch wenn die Zeile im UI steht.

---

## 7. Edge: `arzt-thema` bei leerem Schrank

Tag kommt aus Quiz (Q zystisch / tiefe Knoten) oder manuell — **nicht** aus leerem Schrank raten.

| Situation | Verhalten |
|---|---|
| `arzt-thema` + Scan Reiniger / Creme / SPF / Support | **Zu dir** kann **passt** / **eher nicht** (z. B. Duft) — Scan ok |
| `arzt-thema` + Active-Upsell / „stärkere Seren“-Alternativen | **Konflikt** gegen Upsell-Pfad; **kein** Alternativen-Karussell mit Actives |
| `arzt-thema` + leerer Schrank | Zeile: „Arzt-Thema erkannt — kein Serum-Upgrade. Basispflege scannen ok. Layering startet, sobald Rx/Kosmetik im Schrank liegt.“ |
| Rx noch nicht im Schrank | Kein erfundenes Adapalen; optional Leit-Active-Frage (§5) nur als Hinweis |
| Copy | „Das ist ein Arzt-Thema, kein Serum-Upgrade.“ (`arzt-schiene.md`) — Erkennung ≠ Diagnose |

**Niemals:** Iso/Spironolacton/„lass dir Adapalen verschreiben“; Tele-Derm; Active-Shop trotz Tag.

---

## 8. Non-Goals

1. Kein erzwungenes Onboarding-Quiz vor jedem Scan.  
2. Kein Fake-Layering / Fake-„passt zur Routine“.  
3. Keine Therapie, keine Leitlinien als App-Befehl, keine Dosis.  
4. Kein Rx-Verkauf / Rezept-Button.  
5. Soft-Prefs und Unsicherheit nicht zu **Konflikt** aufblasen.  
6. Kein Reiz-Budget / Tageslast hier (→ künftig `reiz-budget.md`).  
7. Keine Baby-/Teen-Engine vertiefen — nur Profil-Defaults aus Constraints.  
8. Demo-`rules.js` „Füge Produkte hinzu…“ als **einzige** Antwort ersetzen durch Scan-First-Copy (§4); Code-Anpassung **nach** Spec, nicht umgekehrt (`theory-check.md`).  
9. Kein Blockieren des Aisle-Scans zugunsten von Schrank-Vervollständigung.

---

## 9. Implementierungs-Checkliste (kurz)

- [ ] `schrank_status`: `ohne` | `teil` | `voll` (Wasser zählt nicht für `teil`)  
- [ ] `evaluateCandidate`: bei `ohne` → Zu dir ja; Zum Schrank = `noch_nicht_pruefbar`; Slot soft  
- [ ] Worst wins **ohne** Schrank-Dimension  
- [ ] Copy §4 + Disclaimer  
- [ ] CTA „Speichern“ / „Quiz“ sekundär, Scan primär  
- [ ] Nach erstem Save: Zum Schrank re-run (§6)  
- [ ] `arzt-thema`: Upsell aus (§7)  
- [ ] Demo-Text „Schrank noch leer → kein Scan-Nutzen“ entfernen zugunsten Scan-First

---

## 10. Kurz-Entscheidungsbaum

```
Scan-Anfrage
    │
    ├─ Profil fehlt? → 1-Tap Profil, dann weiter
    │
    ├─ Schrank ohne echte Produkte?
    │     ├─ JA → Zu dir (+ Slot soft); Zum Schrank = noch nicht prüfbar
    │     │         optional Leit-Active-Hinweis; CTA speichern/Quiz
    │     └─ NEIN → volle 3 Dimensionen, Worst wins
    │
    └─ Immer: Disclaimer; bei arzt-thema kein Active-Upsell
```

---

*Ende scan-ohne-schrank.md — Scan zuerst, Schrank ehrlich leer, keine Therapie.*
