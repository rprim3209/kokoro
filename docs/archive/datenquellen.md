# Datenquellen

## Öffentlich, zum Start
| Quelle | Wofür | Hinweis |
|---|---|---|
| CosIng (EU-Kommission) | INCI, Annex II–VI, Funktionen, Restriktionen | Kein Produktkatalog, kein offizielles REST-API, Export möglich. Informativ, keine Rechtsberatung. |
| Open Beauty Facts | EAN → Produkt → INCI | API + Dumps, ODbL. Unvollständig für DACH-Regal, aber der offene Start. |
| AAD 2024 / EuroGuiDerm Akne 2025 | Quellen hinter Actives, nicht als App-Leitlinie | Zitieren, nicht abschreiben als Therapie. |

## Wir bauen selbst (Kern)
- Actives-Whitelist mit Evidenzgrad
- Konfliktmatrix (Klassen, nicht 10k Produktpaare)
- Constraint-Modell
- Verdict-Logik: zu dir / zu deinem Schrank / wohin
- Produktkategorien für Alternativen

## Vom Nutzer
- Schrank (Barcode, Foto, Suche)
- AM/PM-Reihenfolge
- Später: Quiz

## Später
Händlerfeeds (dm, Rossmann, Douglas, Notino) für „gibt’s hier wirklich“. Derm-Review der Regeln. Bilder, Preise.

## Gibt es nicht — nicht warten
- CPNP (EU-Produktregister ist zu)
- Konzentrationen / pH auf dem Label
- Amtliches Non-comedogenic-Register
- Eine fertige drugs.com-Interaktionsdatenbank für Kosmetik

Die Interaktions-DB ist ein kleiner Graph: ~30–80 relevante Actives, Klassenregeln, versioniert. Bau bar. Moat ist Pflege, nicht Menge.

## MVP-Stack
CosIng + Open Beauty Facts + Actives-Matrix + Schrank.
