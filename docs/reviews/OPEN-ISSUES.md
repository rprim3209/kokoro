# Offene Probleme · 28.09.2026

## Hohe Priorität

1. **Produktdaten:** Zahlreiche Produkte haben nur Wirkstoff-Kurztexte, keine vollständige INCI-Liste mit Quelle und Rezepturdatum. Katalogumfang ist keine Aussage über Datenqualität. Fehlende Listen müssen produktweise beschafft und geprüft werden.
2. **Regelabdeckung:** Vollständige individuelle Allergieprüfungen, Konzentrationen und Formulierungsdaten fehlen. Ein grüner Gruppencheck ist keine medizinische Freigabe. Fachreview und dokumentierte Grenzfälle bleiben nötig.
3. **Einheitliche Auswahl:** Budget und neue Alternativen berücksichtigen hinterlegte Präferenzen; ältere Presets und Empfehlungswege sind nicht durchgehend auf dieselbe Filterpipeline umgestellt. Eine gemeinsame Auswahlfunktion ist erforderlich.
4. **Tierversuchsfrei:** Historische Katalogflags haben nicht überall aktuelle Nachweise. `false` bedeutet nicht automatisch nachgewiesene Tierversuche. Die Oberfläche behauptet deshalb keinen solchen Nachweis.

## Weitere Verbesserungen

- Übersetzungen verwenden nachträgliche DOM-Übersetzung. Stabile Übersetzungsschlüssel wären robuster; dynamische ältere Detailtexte brauchen weitere Prüfung.
- Große Legacy-Dateien, mehrfach definierte Funktionen und Inline-Handler erschweren Änderungen und eine strenge Content Security Policy. Schrittweise Module und Ereignislistener sind sinnvoll.
- Alternativen sind ähnliche Katalogprodukte, kein validierter Dupe-Algorithmus. Eine Routineprüfung für den konkreten Austausch inklusive Slot fehlt noch.
- Preise sind Richtwerte; regionale Verfügbarkeit und aktuelle Preise sind nicht zugesichert.
- Betreiber- und Datenschutztexte enthalten historische Vorlagen und müssen vor Veröffentlichung konkretisiert werden. Reale Kamera-/Mobilgerätetests und Hosting stehen aus.
- Browserdaten können gelöscht werden; Export/Import und Wiederherstellung müssen weiter als eigener Nutzerablauf geprüft werden.

## In dieser Änderung behoben

- „Ähnliche Alternativen“ öffnete nur einen Check mit einem Produkt; es zeigt jetzt auswählbare Kandidaten.
- Löschen wird nur am aktiven Profil angeboten, räumlich vom Namen getrennt.
- Inhaltsstoffe stehen beim Öffnen eines Produkts oben, sofern hinterlegt. Fehlende INCI bleiben ausdrücklich als fehlend markiert.
- CF-Badges sind ausgeschrieben; die falsche Gleichsetzung mit „duftstoffarm“ wurde entfernt.
- `index.html` ist der Einstieg. Alte Serverstarter/HTML-Testkopien sind entfernt, Dokumente und Daten geordnet.

## Nachprüfung der Oberfläche

Profil-× innerhalb des aktiven Rahmens, Kategorie-Akzentfarben und aktive Kategoriebezeichnung ergänzt. Verbliebenen Hero-Hintergrund im Kinderbereich entfernt und eine gemeinsame Routineüberschrift ergänzt. Produktaktionen haben 12 px Abstand, unterschiedliche Gewichtung und stapeln auf schmalen Displays. Profilname wird bei Neuanlage sprachabhängig vorbelegt; Eingabefokus liegt innerhalb des Feldes. Desktop-Geometrie und 390-px-Layout geprüft (kein horizontaler Seitenüberlauf).

## Navigation and header consolidation

Profile switching now preserves the current screen and calls the central renderer once. Settings no longer invokes a second renderer after activation. Page layout is applied synchronously after rendering; the mutation observer now handles dialogs only. Header styles live in `css/header.css`; the accumulated competing header overrides were removed from refinement.css. A navigation regression test covers all four screen and age-category combinations. Browser inspection confirmed Options keeps its normal container without cabinet columns after switching profiles.
