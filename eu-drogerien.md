# EU-Drogerien & Online-Shops (Länderkarte)

**Stand:** 2026-09-09 · ehrlich, ohne Scraping-Versprechen

Diese Karte steuert die **Live-Suche** im Kosmetikschrank: Welcher Shop wird für welches Land angeboten, und wann ist nur ein Deep-Link / Open Beauty Facts (OBF) möglich.

> Regel: Die dm-MCP-API (`mcp.dm.de`) liefert **nur Deutschland-Sortiment**. Für andere Länder niemals so tun, als wären DE-Treffer lokaler Bestand.

## Primär: dm-drogerie markt

Lokale Shops oft unter `dm.<tld>` / landesspezifischer Domain.

| ISO2 | Land | Hinweis |
|------|------|---------|
| DE | Deutschland | Live-API via MCP (`mcp.dm.de`) |
| AT | Österreich | dm.at — Deep-Link + OBF (kein IT/AT-MCP) |
| IT | Italien | dm.it — Deep-Link + OBF |
| PL | Polen | dm.pl |
| CZ | Tschechien | dm.cz |
| SK | Slowakei | dm.sk |
| HU | Ungarn | dm.hu |
| SI | Slowenien | dm.si |
| HR | Kroatien | dm.hr |
| RO | Rumänien | dm.ro |
| BG | Bulgarien | dm.bg |
| BA / RS / MK | Nicht-EU-Nachbarn | dm vorhanden, Demo optional |

**Nicht** bei dm (Auswahl): FR, ES, NL, BE, SE, DK, FI, IE, PT, GR, EE, LV, LT, LU, MT, CY, CH — dort Rossmann/Müller/Douglas/Notino/Sephora.

## Rossmann

DE, PL, HU, CZ, ES, CH (+ DK Online-Shop genannt) — **nicht** flächendeckend EU.

## Müller

DE, AT, CH, HR, HU, SI, ES (begrenzt), SK, LI.

- **Weg 2 (Live-Suche Integration):**
  - **Österreich (`AT`):** Müller Österreich (`https://www.mueller.at/search/?q=`) wird gleichwertig neben dm.at und bipa.at angeboten. Bei Müller-Eigenmarken (CV, Terra Naturi, Beauty Baby) steht Müller an Position 1.
  - **Deutschland (`DE`):** Müller Deutschland (`https://www.mueller.de/search/?q=`) ist als Drogerie-Alternative zur dm-MCP-API hinterlegt. Bei Müller-Marken steht Müller an Position 1.
  - **Schweiz (`CH`):** Müller Schweiz (`https://www.mueller.ch/search/?q=`) ist als primäre Drogerie hinterlegt.
  - **Eigenmarken-Erkennung:** Automatische Erkennung von `CV CadeaVera`, `Terra Naturi`, `Beauty Baby`, `Aveo`, `Aiko`, `Duchesse`, `Barfuss`, `SensiSana`.
  - **Cabinet-Adoption:** Müller-Karten können direkt via `+ Morgen`, `+ Abend` oder `+ Schrank` in alle Routinen übernommen werden.

## BIPA (REWE International)

Österreich (`AT`) — Marktführer neben dm mit über 600 Filialen.

- **Live-Suche Integration (Österreich):**
  - **Such-Endpoint:** `https://www.bipa.at/search?q=`
  - **Triple-Drogerie in AT:** In Österreich stehen mit `dm.at`, `bipa.at` und `mueller.at` alle drei führenden Ketten direkt zur Verfügung.
  - **Eigenmarken-Erkennung:** Automatische Erkennung von `bi good` (zertifizierte Naturkosmetik nach NATRUE & Vegan), `bi care` (Hautpflege, Seren, Cremes, LSF), `Babywell` (Babypflege, Wundschutz, Kinder-Sonnenschutz), `Look by BIPA`, `Today` / `Today Sun`.
  - **Master-Katalog:** Beliebte Eigenmarken sind fest im Master-Katalog (`katalog-produkte.csv` und `js/catalog.js`) mit verifizierten Claims hinterlegt.


## Douglas-Gruppe (Premium Beauty, ~22 Länder)

u. a. DE, AT, CH, NL, BE, FR (Nocibé), IT, ES, PT, HR, SI, PL, CZ, SK, HU, RO, BG, EE, LV, LT, …

## Sephora

Stark in FR; auch ES, PT, PL, RO, GR, CZ, DK, FI u. a.

## Notino

Pan-EU Online-Beauty (viele Länder-TLDs) — guter Fallback ohne dm.

## Benelux

Kruidvat / Etos (NL/BE) — in der Karte vermerkt; aktuell **kein** API, nur Hinweis / Deep-Link später.

## App-Verhalten (Kurz)

| Land | Live-Chip (Beispiel) | Backend |
|------|----------------------|---------|
| DE | Live: dm Deutschland | MCP `mcp.dm.de` (+ Pilot-CSV Fallback) |
| IT / AT / PL / … (dm-Set) | Live: dm Italia / dm Österreich … | Deep-Link dm.<tld> + OBF `countries_tags=en:italy` usw. — **kein** DE-MCP |
| FR / NL / ES / … | Live: Notino / Douglas / Sephora | Deep-Link-Karten + OBF mit Länderfilter |

Quellen: Händler-Websites / bekannte Filialnetze (dm, Rossmann, Müller, Douglas, Sephora, Notino). Vor Launch Domains erneut prüfen.
