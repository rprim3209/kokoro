# Datenschutz & Privatsphäre — Kosmetikschrank (Kokoro)

**Stand:** September 2026 · Version 1.0

Der **Kosmetikschrank** wurde nach dem Grundsatz **Privacy by Design & Zero Tracking** entwickelt. Die Anwendung dient als neutraler, evidenzbasierter Einkaufs- und Schrank-Wächter und verzichtet bewusst auf Datensammeln, Benutzer-Accounts und kommerzielles Tracking.

---

## 1. Kamera-Zugriff (Barcode-Scanner)

- **Zweck:** Die Kamera deines Smartphones, Tablets oder Laptops wird ausschließlich genutzt, um EAN-Strichcodes auf Kosmetikpackungen beim Einkaufen oder vor dem Badezimmerspiegel optisch zu erfassen.
- **100 % lokale Erkennung:** Die Bilderkennung erfolgt über standardisierte Browser-Schnittstellen (`navigator.mediaDevices.getUserMedia` und die native `BarcodeDetector`-API) direkt und flüchtig auf deinem Endgerät.
- **Keine Videoübertragung & kein Upload:** Zu keinem Zeitpunkt werden Fotos oder Videostreams gespeichert, aufgezeichnet oder an externe Server übertragen.
- **Sofortige Deaktivierung:** Sobald ein Barcode erkannt wird oder du das Scanner-Fenster schließt bzw. auf „Stoppen“ tippst, wird der Kamerazugriff augenblicklich beendet und die Hardware freigegeben.
- **Freiwillig:** Du musst der Kamera keinen Zugriff gewähren. Jedes Produkt und jede EAN-Nummer lässt sich jederzeit manuell über das Suchfeld eintippen.

---

## 2. Lokale Speicherung (`localStorage`)

- **Zweck:** Damit deine Morgen- und Abend-Routinen, deine Hautprofile (z. B. Erwachsener, Teenie, Kind, Baby) und dein Schrankinhalt nicht verloren gehen, wenn du die Seite neu lädst (F5) oder den Browser schließt.
- **Speicherort:** Sämtliche App-Zustände werden ausschließlich im lokalen Web-Speicher deines Browsers (`window.localStorage`) unter dem Schlüssel `schrank` abgelegt.
- **Keine Cloud & kein Account:** Deine Daten verlassen dein Gerät nicht. Es gibt keine zentrale Datenbank, keine Benutzerprofile in der Cloud und keine Registrierungspflicht.
- **Löschung & Kontrolle:** Du behältst zu jeder Zeit die volle Kontrolle. Über den Button **„Gesamten Schrank zurücksetzen“** in den Optionen oder über das Löschen deiner Website-Daten im Browser werden alle gespeicherten Werte unwiderruflich und restlos gelöscht.

---

## 3. Produktsuche & dm-Abfragen

- **Lokaler Basiskatalog (Offline):** Die App verfügt über einen internen, wissenschaftlich kuratierten Katalog mit über 980 Kosmetikprodukten. Dieser wird lokal durchsucht – hierfür ist keinerlei externe Datenübertragung nötig.
- **Optionale Live-Produktsuche (dm-Drogeriemarkt):** Wenn du ein Produkt suchst, das noch nicht im Katalog hinterlegt ist, oder den Button *„Jetzt bei dm prüfen“* nutzt, wird eine Anfrage an die offizielle, öffentliche Produktschnittstelle von dm übermittelt, um Inhaltsstoffe (INCI), Produktname und Richtpreise abzurufen.
- **Welche Daten werden übermittelt?** Ausschließlich der von dir eingegebene Suchbegriff oder die gescannte EAN-Nummer.
- **Welche Daten werden NICHT übermittelt?** Es werden zu keinem Zeitpunkt persönliche Daten, Hautzustände, Quiz-Ergebnisse, Profil-Kategorien oder dein Schrankinhalt an dm oder Dritte übermittelt. Suchanfragen sind völlig anonym und werden nicht für Profiling genutzt.

---

## 4. Keine Tracking-Cookies & keine Werbenetzwerke

- Wir setzen **keine Tracking-Cookies**, keine Affiliate-Pixel und keine Werbenetzwerke ein.
- Es sind **keine Third-Party-Analytics** eingebunden (kein Google Analytics, kein Meta Pixel, kein Hotjar).
- Die Anwendung lädt alle Skripte und Stile lokal und bindet keine externen CDNs ein.

---

## 5. Verbindlicher Disclaimer

> ⚖️ **Keine Therapie — dein Ratgeber für Einkauf & Layering.**
> Kosmetik dient der Hygiene, Pflege und dem Schutz der Hautbarriere. Kosmetische Produkte sind keine Arzneimittel und ersetzen keine dermatologische Diagnose oder ärztliche Therapie.

---

*Fragen zum Datenschutz oder Feedback? Kontaktiere uns direkt über das GitHub-Repository: [github.com/rprim3209/kokoro](https://github.com/rprim3209/kokoro).*
