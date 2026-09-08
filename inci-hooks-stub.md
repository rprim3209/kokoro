# INCI-Hooks — Stub-Hinweis (Demo 2026-09-08)

**Spec bleibt Quelle:** `inci-klassifikator.md`

## Was im Code läuft
In `js/rules.js` → `inciHooksFromProduct(p)` liest nur vorhandene Katalogfelder:
- `klassen[]`, `kat`, `ff`, `nc`, `cf`
- optional `textur` (falls gesetzt)

## Was bewusst fehlt (STUB)
- Kein Roh-INCI-Tokenizing
- Kein CosIng-Lookup / Annex-Allergen-Parser
- Keine Spur-vs-Wirk-Konzentrationsheuristik aus Listenposition
- Keine Derivat-Policy (aPAD vs. Azelaic) im Parser

Nächster Pass: Klassifikator anbinden, ohne Demo wieder zu einem Monolith-HTML zusammenzuziehen.
