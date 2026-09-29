# Lokale Überarbeitung

Basis: origin/main 6bb21e1. Die bestehenden Änderungen im übergeordneten Projekt bleiben separat erhalten.

Lokale Vorschau: http://127.0.0.1:8793/index.html. Einstieg: `python run.py --port 8793` mit den Paketen aus requirements.txt. `api.py` ist der neue Server; der alte `server.py` und die alten Startskripte wurden entfernt.

Für Nutzer wird die App über eine öffentliche HTTPS-Adresse bereitgestellt; sie starten keinen Server. Ein Betreiber hostet `api:app` mit explizitem KOKORO_ALLOWED_HOSTS hinter einem HTTPS-Proxy. Nicht den gesamten Projektordner als öffentliche Dateien freigeben. Kein Deployment wurde durchgeführt.

Profile und Routinen liegen im Browser, nicht in einer Nutzer-Datenbank. Katalogsuche ist lokal; unbekannte Barcodes können serverseitig bei Open Beauty Facts abgefragt werden (KOKORO_LIVE_SEARCH=0 deaktiviert dies). Keine Live-Preis- oder Verfügbarkeitsgarantie. Kamera-Verfügbarkeit wird erst beim tatsächlichen Zugriff festgestellt.

Änderungen: echte Profile mit rückgängig machbarem Löschen, Kontext im Profil, Routinen zuerst, ein Scan-Einstieg, erklärbare Warnungen, strikte Budget- und Produktanzahl, keine automatische Änderung des Schranks beim Ändern von Präferenzen, ziehbare Dialoggriffe.

Prüfung: Tests in tests/evidence.test.cjs und tests/test_api.py. Die Regelprüfung verwendet benannte Quellen und kennzeichnet Heuristiken; sie ist nicht klinisch validiert. Produktrezepturen sind Referenzdaten, nicht pauschal verifiziert.

Vor Veröffentlichung offen: redaktionelle Prüfung des verbleibenden Altkatalogs und älterer Empfehlungswege, Fachreview der Regelabdeckung, reale Kamera-Gerätetests, Hosting und korrekte Betreiber-/Datenschutzhinweise. Die Legacy-Oberfläche benötigt noch Inline-Skripte; die CSP enthält deshalb unsafe-inline. Keine Behauptung vollständiger Release-Freigabe.

Aktuelle Struktur und Startanleitung: [README](../../README.md). Priorisierte Restarbeiten: [OPEN-ISSUES](OPEN-ISSUES.md). Historische Konzepte liegen unter `../archive/`.
