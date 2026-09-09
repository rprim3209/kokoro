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
