# 90-Tage-Plan: Kosmetikschrank (Demo → glaubwürdiger Soft-Launch)

**Stand:** 2026-09-09  
**Für:** Prim Rose  
**Ziel in 90 Tagen:** Nicht „App-Store-Weltmarkt“ — sondern: **50 echte Nutzerinnen**, die den Kernloop verstehen und wiederkommen; Demo unter HTTPS; ehrliche Daten; rechtliche Mindesttexte.

**Kernloop (immer gleich):**  
Profil/Tags → Produkt scannen oder suchen → **passt / eher nicht / Konflikt** + 1 Grund → optional in den Schrank.

**Positionierung (1 Satz):**  
*Yuka sagt Risiko — wir sagen: passt das in **deinen** Schrank?*

**Nicht in den 90 Tagen:** App-Store-Perfektion, Cloud-Alles, Skin-Bliss-Features, Vollkatalog EU, Therapiefunktionen.

---

## Phase A — Tage 1–30: Fundament & Vertrauen

### Woche 1 (Tage 1–7) — Recht & Klarheit
- [x] Disclaimer überall gleich: „Keine Therapie — dein Ratgeber für Einkauf & Layering.“
- [x] Kurze **Datenschutz**-Notiz (Kamera, localStorage, dm-Abfragen) entwerfen (siehe datenschutz.md & Settings-Modal)
- [ ] **Impressum**-Entwurf (auch für spätere HTTPS-Seite)
- [ ] Positionierungs-Satz + 3 Beispiel-Scans aufschreiben (Retinol, parfümierte Creme, Baby-Produkt)
- [ ] `start-server.bat` als Standard-Start (nie `file://` für Tests)

**Done wenn:** Du die App jemandem zeigen kannst, ohne rechtlich unsicher zu wirken.

### Woche 2 (Tage 8–14) — DACH Happy-Path Daten
- [ ] 30–50 echte Gesichtspflege-Produkte (dm/Rossmann-Schwerpunkt) mit EAN
- [ ] Pro Produkt: Flags nur mit Quelle; sonst **offen**
- [ ] 10 „Muss funktionieren“-EANs als Testliste notieren
- [ ] Live-dm Happy-Path: Suche → Verdict → in Schrank (mind. 5 Produkte)

**Done wenn:** Die 10 Test-EANs ohne Drama durchlaufen.

### Woche 3 (Tage 15–21) — Kernloop härten
- [ ] Verdict 1-Blick prüfen (Outcome + 1 Grund) an 10 Beispielen
- [ ] Arzt-Thema: Active-Upsell bleibt aus
- [ ] Leerer Schrank: Scan möglich, „Zum Schrank noch nicht prüfbar“
- [ ] Reiz-Budget: Clienzo AM + Adapalen PM → eher nicht (nicht Chemie-inactivate)
- [ ] UTF-8 / kaputte Texte einmal durchklicken

**Done wenn:** Du die Demo in 3 Minuten vorführen kannst.

### Woche 4 (Tage 22–30) — Erste Testerinnen
- [ ] 8–12 Testerinnen finden (Pharmazie, sensible/Akne-Haut, 1–2 Eltern Baby/Kind)
- [ ] Kurzer Testleitfaden (5 Aufgaben, 15 Min)
- [ ] Feedback-Bogen: wo stocken sie? Verdict klar? Vertrauen?
- [ ] Top-5 Probleme notieren — nur die fixen

**Done wenn:** Mindestens 8 Feedbacks liegen vor.

---

## Phase B — Tage 31–60: Zeigbar & teilbar

### Woche 5 (Tage 31–37) — Feedback einbauen
- [ ] Top-3 UX-Probleme aus Phase A fixen
- [ ] Soft-Prefs (Parfümfrei / NC) verständlich machen (Chip + abwählbar)
- [ ] Fehlermeldungen auf Deutsch, kurz
- [ ] README für dich + 1 Seite „So testest du“ für andere

**Done wenn:** Dieselben 3 kritischen Testerinnen sagen „klarer als letztes Mal“.

### Woche 6 (Tage 38–44) — HTTPS-Demo
- [ ] Demo irgendwo unter **HTTPS** erreichbar (auch read-only / Passwort ok)
- [ ] Server + CSV + `/api/dm-search` (oder klarer Offline-Fallback)
- [ ] Link + QR für Testerinnen
- [ ] Prüfen: Kamera/Scanner nur unter HTTPS/localhost

**Done wenn:** Jemand öffnet den Link ohne deinen Laptop-Desktop-Ordner.

### Woche 7 (Tage 45–51) — Landing & Story
- [ ] 1 Landing-Seite (oder Notion/Carrd): Problem → 1 Satz → 3 Screenshots → Disclaimer → Testen-Link
- [ ] 3 Content-Bausteine (Carousel/Reel-Skript): Schrank-Verdict, Arzt-Thema, ehrliche Flags
- [ ] Liste „wo posten“: Uni, 2 DACH-Skincare-Gruppen, evtl. Apotheken-Netz

**Done wenn:** Fremde verstehen in 30 Sekunden, was die App tut.

### Woche 8 (Tage 52–60) — Coverage & Vertrauen
- [ ] Katalog auf ~80–100 kuratierte Vorschlags-Produkte (nicht Millionen)
- [ ] Quellen-Hinweis bei Flags in der UI (kurz)
- [ ] Warteliste / Interesse sammeln (einfaches Formular)
- [ ] Zwischenstand: Was funktioniert? Was streichen wir bewusst?

**Done wenn:** ≥20 Leute auf Warteliste oder aktiv getestet; bewusste Non-Goals stehen schwarz auf weiß.

---

## Phase C — Tage 61–90: Soft-Launch-Entscheidung

### Woche 9 (Tage 61–67) — Stabilität
- [ ] Smoke-Test-Checkliste wöchentlich (Server, Scan, Speichern, 5 EANs)
- [ ] Backup Katalog + Specs
- [ ] Bekannte Bugs-Liste (P1/P2/P3)
- [ ] Nur P1 vor „öffentlicher“ Soft-Launch

**Done wenn:** P1-Bugs = 0 für den Kernloop.

### Woche 10 (Tage 68–74) — 50-Nutzerinnen-Ziel
- [ ] Aktiv auf 50 Testern/Warteliste hinarbeiten
- [ ] 5 „Wiederkehrerinnen“ interviewen (nutzen sie’s ein 2. Mal?)
- [ ] Messen (einfach): Scans/Woche, Schrank gefüllt?, Verdict verstanden?

**Done wenn:** 50 Kontakte **oder** 15 Wiederkehrerinnen — was zuerst da ist, zählt.

### Woche 11 (Tage 75–81) — Geschäfts-Entscheidung
- [ ] Option A: weiter gratis + Reputation (Uni/Apotheke)
- [ ] Option B: kleines Abo (nur wenn Wiederkehr klar)
- [ ] Option C: Partner-Gespräch (Händler) — **redaktionelle Unabhängigkeit** festhalten
- [ ] Eine Option wählen, zwei bewusst parkieren

**Done wenn:** Schriftliche Entscheidung in 10 Zeilen.

### Woche 12 (Tage 82–90) — Soft-Launch-Paket
- [ ] Öffentlicher Link + Landing final
- [ ] Impressum/Datenschutz live
- [ ] 1 Launch-Post / Uni-Kanal / kleine Runde
- [ ] „Was kommt nach Tag 90“-Liste (max. 5 Punkte) — z. B. Sync, mehr EANs, nicht Face-AI
- [ ] Feierabend: Specs + Demo-Stand sichern

**Done wenn:** Soft-Launch passiert ist (auch klein) und du weißt, was Phase 2 ist.

---

## Wöchentlicher Rhythmus (alle 90 Tage)

| Tag | Ritual |
|---|---|
| Mo | 1 Kernloop selbst durchklicken (5 EANs) |
| Mi | 1 Spec/Code-Thema (max. 2h) |
| Fr | Feedback lesen oder 1 Testerin anschreiben |
| So | 3 Zeilen Fortschritt in `launch-90-tage.md` abhaken |

---

## Erfolg nach 90 Tagen (Messlatte)

| Muss | Nice |
|---|---|
| Kernloop vorführbar unter HTTPS | Erste Partner-Idee |
| Disclaimer + Privacy + Impressum | 100+ kuratierte SKUs |
| 30–50 DACH-Testprodukte stabil | Content-Serie läuft |
| ≥8 qualitative Feedbacks + Top-Fixes | Warteliste 50 |
| Klare Non-Goals | Abo-Entscheidung |

**Durchgefallen wäre:** Feature-Chaos, medizinische Claims, „wir brauchen erst Millionen Produkte“.

---

## Bewusste Non-Goals (90 Tage)

- App Store / Play Store Pflicht-Release  
- Cloud-Sync / Multi-Gerät als Blocker  
- Skin-Bliss-Parität (Face-AI, Progress-Diary)  
- Rossmann-API erzwingen (wenn tot → dm + manuell)  
- Therapie-/Leitlinien-Modus  

---

## Schnell-Hilfe bei Hürden

| Hürde | Sofortmaßnahme |
|---|---|
| Recht unsicher | Disclaimer live + Uni-Beratungstermin |
| Zu wenig Daten | Nur Top-30 dm Gesicht, Rest „offen“ |
| Niemand testet | 5 Kommilitoninnen + 1 Apotheke-Praktik-Kontakt |
| Konkurrenz-Angst | 1 Satz Positionierung wiederholen |
| Technik spinnt | Nur Server-URL; `file://` verbieten |
| Geld-Druck | 90 Tage Reputation first |

---

## Nächster konkreter Schritt (Tag 1)

1. Disclaimer-Text finalisieren  
2. 10 Test-EANs aufschreiben  
3. Erste 3 Testerinnen anschreiben  

Verwandte Dateien: `theory-check.md`, `constraints-v1.md`, `verdict-glossar.md`, `arzt-thema-scan.md`, `vergleich-eu-apps.md`, `todo-demo-gut.md`.
