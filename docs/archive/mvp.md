# MVP v0.2

## Loop 1 — Scan (Aisle Mode im Drogeriemarkt)
Barcode (EAN) oder **Kamera-INCI-OCR Fallback** (wenn Balea/Isana noch nicht in Open Beauty Facts ist).  
Drei Zeilen in 3 Sekunden:
1. **Zu dir:** Constraints (Akne-Prone, Barriere-Status, Begleitpflege) & EU-Status.
2. **Zu deinem Schrank:**
   - 🟢 `Passt perfekt` (kein Konflikt)
   - 🟡 `Geht, aber im Wechsel` (Skin Cycling: an Abenden ohne dein Retinoid)
   - 🔴 `Lieber nicht` (Reiz-Stacking, doppelte Klasse oder Inaktivierung)
3. **Im selben Laden:** Wenn 🟡 oder 🔴 ➔ 2–3 Alternativen aus demselben Regal (dm, Rossmann oder Apotheke).
4. **Pharmazie-Check:** 1 Klartext-Satz, der Marketing-Hype einordnet (z.B. „10 % Niacinamid reizt mehr als es nützt — Studien zeigen 2–5 % reichen“).

## Loop 2 — Schrank & Routine
Produkte in Auftragsreihenfolge (1. Reinigen ➔ 2. Hydratisieren ➔ 3. Treat ➔ 4. Creme ➔ 5. SPF).  
- **AM und PM getrennt.**
- **Wechsel-Slots / Skin Cycling:** Abende können alternieren (z.B. *Modus A: Adapalen* vs. *Modus B: BPO/Clienzo* vs. *Modus C: Barriere-Pause*).
- **Begleitpflege-Wächter:** Sobald ein Rx-Mittel im Schrank liegt, warnt die App vor austrocknenden Alkoholen und aggressiven Säuren.

## Loop 3 — Tausch & Simulation
Ein Produkt raus, Kandidat rein. Rest neu rechnen: neue Konflikte, Lücken, was mitwandert.

## Onboarding (Beim ersten Öffnen der App)
Die App fragt direkt: **„Hast du schon eine Routine oder fängst du gerade an?“**
1. **Weg A: „Ich habe keine Ahnung / stehe am Anfang“ ➔ Quiz:**
   - Ermittelt Hauttyp, Empfindlichkeit und Begleitpflege-Bedarf.
   - Schlägt eine harmonische Start-Routine für den Schrank vor.
2. **Weg B: „Ich habe schon eine Routine / kenne mich aus“ ➔ Leerer Schrank:**
   - Startet mit einem **leeren Schrank**.
   - Nutzerin stellt ihre vorhandenen Produkte über Suche oder Barcode-Scan hinein.
   - **Automatische Routine-Prognose:** Die Engine berechnet in Echtzeit eine Verträglichkeits-Prognose (Reiz-Stacking, Barriere-Gleichgewicht, fehlender SPF, redundante Wirkstoffklassen).

## Bau-Reihenfolge
1. Actives-Whitelist + Evidenzgrad (erledigt)
2. Konfliktmatrix v0.2 mit Wechsel-Slots & Begleitpflege (erledigt)
3. Schrank-Modell v0.2 mit Modi A/B (erledigt)
4. Open Beauty Facts + Kamera-INCI-Parser (OCR-Fallback)
5. 3-Sekunden-Scan-Verdict + Drogerie-Alternativen-Katalog
