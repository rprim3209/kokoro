#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lokaler Dev-Server für den Kosmetikschrank-Demo: Statik + dm-MCP-Proxy."""

from __future__ import annotations

import argparse
import csv
import io
import json
import os
import re
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, unquote, urlparse
import urllib.parse
from urllib.request import Request, urlopen

BASE_DIR = Path(__file__).resolve().parent
MCP_URL = "https://mcp.dm.de/mcp"
USER_AGENT = "Kosmetikschrank/0.1 (local-proxy)"
PROTOCOL_VERSION = "2024-11-05"
DEFAULT_PORT = 8787
DEFAULT_PAGE_SIZE = 12
MAX_PAGE_SIZE = 15
MCP_TIMEOUT = 25

# Boolean-Flags aus der TOON-Suche, die als attributes[] durchgereicht werden
ATTR_FLAGS = (
    "fragranceFree",
    "vegan",
    "bio",
    "glutenFree",
    "lactoseFree",
    "naturalCosmetics",
    "alcoholFree",
    "parabenFree",
    "sulfateFree",
    "preservativeFree",
    "dyeFree",
    "oilFree",
    "sugarFree",
    "nutFree",
    "soyFree",
    "siliconeFree",
    "vegetarian",
)

MIME = {
    ".html": "text/html; charset=utf-8",
    ".htm": "text/html; charset=utf-8",
    ".csv": "text/csv; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".txt": "text/plain; charset=utf-8",
    ".ico": "image/x-icon",
    ".webmanifest": "application/manifest+json",
}

TOON_HEADER_RE = re.compile(r"products\[(\d+)\]\{([^}]+)\}:")

_mcp_lock = threading.Lock()
_mcp_session: str | None = None
_mcp_rpc_id = 1


def next_rpc_id() -> int:
    global _mcp_rpc_id
    _mcp_rpc_id += 1
    return _mcp_rpc_id


def is_true(value) -> bool:
    if value is True:
        return True
    if value is False or value is None:
        return False
    return str(value).strip().lower() in ("true", "1", "yes", "ja", "y")


def path_from_applink(link: str) -> str:
    """Host abstreifen — Frontend macht https://www.dm.de + relativeProductUrl."""
    if not link:
        return ""
    link = str(link).strip()
    if link.startswith("/"):
        return link
    parsed = urlparse(link)
    rel = parsed.path or ""
    if parsed.query:
        rel += "?" + parsed.query
    return rel


def attributes_from_row(row: dict) -> list:
    attrs = []
    for name in ATTR_FLAGS:
        if is_true(row.get(name)):
            attrs.append({"name": name})
    return attrs


def product_from_toon_row(row: dict) -> dict:
    return {
        "dan": str(row.get("dan") or ""),
        "gtin": str(row.get("gtin") or ""),
        "title": row.get("title") or "",
        "brandName": row.get("brand") or "",
        "price": str(row.get("price") or "").strip(),
        "relativeProductUrl": path_from_applink(row.get("appLink") or ""),
        "attributes": attributes_from_row(row),
        "category": row.get("category") or "",
        "description": row.get("description") or "",
        "highlights": row.get("highlights") or "",
        "appLink": row.get("appLink") or "",
    }


def parse_sse_jsonrpc(body: str) -> dict:
    last = None
    for line in body.splitlines():
        if not line.startswith("data:"):
            continue
        payload = line[5:].strip()
        if not payload or payload == "[DONE]":
            continue
        last = json.loads(payload)
    if last is None:
        stripped = body.strip()
        if stripped.startswith("{"):
            return json.loads(stripped)
        raise ValueError("keine JSON-RPC-Daten in der MCP-Antwort")
    return last


def unwrap_toon_text(rpc: dict) -> str:
    result = rpc.get("result") or {}
    if result.get("isError"):
        raise RuntimeError("MCP-Tool meldete isError")
    holder = None
    sc = result.get("structuredContent") or {}
    if isinstance(sc, dict) and sc.get("result") is not None:
        holder = sc["result"]
    else:
        content = result.get("content") or []
        text = ""
        if content and isinstance(content[0], dict):
            text = content[0].get("text") or ""
        if not text:
            raise RuntimeError("MCP-Antwort ohne result-Text")
        try:
            wrapper = json.loads(text)
            holder = wrapper.get("result", text) if isinstance(wrapper, dict) else text
        except json.JSONDecodeError:
            holder = text
    if isinstance(holder, list):
        if not holder:
            return ""
        return str(holder[0])
    if isinstance(holder, str):
        s = holder.strip()
        if s.startswith("["):
            try:
                arr = json.loads(s)
                if isinstance(arr, list) and arr:
                    return str(arr[0])
            except json.JSONDecodeError:
                pass
        return holder
    raise RuntimeError("unerwartetes TOON-Format")


def parse_toon_products(toon: str) -> list:
    if not toon or not str(toon).strip():
        return []
    match = TOON_HEADER_RE.search(toon)
    if not match:
        raise ValueError("kein products[N]{cols}: Header im TOON")
    cols = [c.strip() for c in match.group(2).split(",") if c.strip()]
    products = []
    for line in toon[match.end():].splitlines():
        raw = line.strip()
        if not raw or raw.startswith("💡") or raw.lower().startswith("use "):
            continue
        try:
            fields = next(csv.reader(io.StringIO(raw)))
        except Exception:
            continue
        if len(fields) < 4:
            continue
        # zu kurze/zu lange Zeilen trotzdem zuordnen
        row = {cols[i]: (fields[i] if i < len(fields) else "") for i in range(len(cols))}
        products.append(product_from_toon_row(row))
    return products


def mcp_post(payload: dict, session: str | None = None) -> tuple[dict, dict]:
    data = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "User-Agent": USER_AGENT,
    }
    if session:
        headers["Mcp-Session-Id"] = session
    req = Request(MCP_URL, data=data, headers=headers, method="POST")
    with urlopen(req, timeout=MCP_TIMEOUT) as resp:
        body = resp.read().decode("utf-8", errors="replace")
        hdrs = {k: v for k, v in resp.headers.items()}
    rpc = {}
    if body.strip():
        rpc = parse_sse_jsonrpc(body)
    return rpc, hdrs


def header_ci(headers: dict, name: str) -> str | None:
    want = name.lower()
    for k, v in headers.items():
        if k.lower() == want:
            return v
    return None


def mcp_initialize() -> str:
    rpc, headers = mcp_post(
        {
            "jsonrpc": "2.0",
            "id": next_rpc_id(),
            "method": "initialize",
            "params": {
                "protocolVersion": PROTOCOL_VERSION,
                "capabilities": {},
                "clientInfo": {"name": "Kosmetikschrank", "version": "0.1"},
            },
        }
    )
    session = header_ci(headers, "Mcp-Session-Id")
    if not session:
        raise RuntimeError("MCP ohne Mcp-Session-Id")
    try:
        mcp_post({"jsonrpc": "2.0", "method": "notifications/initialized"}, session)
    except Exception:
        pass  # optional
    return session


def mcp_search_products(query: str) -> list:
    global _mcp_session
    last_err = None
    for attempt in range(2):
        with _mcp_lock:
            session = _mcp_session
            if not session or attempt > 0:
                session = mcp_initialize()
                _mcp_session = session
        try:
            rpc, _headers = mcp_post(
                {
                    "jsonrpc": "2.0",
                    "id": next_rpc_id(),
                    "method": "tools/call",
                    "params": {
                        "name": "searchProducts",
                        "arguments": {"query": query},
                    },
                },
                session,
            )
            toon = unwrap_toon_text(rpc)
            return parse_toon_products(toon)
        except (HTTPError, URLError, TimeoutError, ValueError, RuntimeError, json.JSONDecodeError) as exc:
            last_err = exc
            with _mcp_lock:
                _mcp_session = None
            continue
    raise RuntimeError(f"MCP-Suche fehlgeschlagen: {last_err}")


def load_pilot_rows() -> list:
    path = BASE_DIR / "dm-pilot-produkte.csv"
    if not path.is_file():
        return []
    with path.open("r", encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


def product_from_pilot(row: dict) -> dict:
    flags = {
        "fragranceFree": is_true(row.get("dm_fragranceFree"))
        or str(row.get("flag_fragrance_free") or "").strip().lower() == "yes",
        "oilFree": is_true(row.get("dm_oilFree")),
        # flag_nc = non-comedogenic — NICHT naturalCosmetics
        "naturalCosmetics": is_true(row.get("dm_naturalCosmetics")),
        "vegan": is_true(row.get("dm_vegan")),
    }
    link = row.get("dm_url") or ""
    return {
        "dan": str(row.get("dan") or ""),
        "gtin": str(row.get("ean") or ""),
        "title": row.get("name") or "",
        "brandName": row.get("brand") or "",
        "price": str(row.get("price") or "").strip(),
        "relativeProductUrl": path_from_applink(link),
        "attributes": [{"name": k} for k, v in flags.items() if v],
        "category": row.get("category") or "",
        "description": row.get("description") or "",
        "highlights": row.get("highlights") or "",
        "appLink": link,
    }


def search_pilot_csv(query: str) -> list:
    q = (query or "").strip().lower()
    if not q:
        return []
    hits = []
    for row in load_pilot_rows():
        blob = " ".join(
            str(row.get(k) or "")
            for k in ("name", "brand", "ean", "dan", "category", "queries", "description")
        ).lower()
        if q in blob:
            hits.append(product_from_pilot(row))
    return hits


def search_dm(query: str, page_size: int) -> list:
    page_size = max(1, min(int(page_size or DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE))
    q = (query or "").strip()
    if not q:
        return []
    try:
        products = mcp_search_products(q)
        return products[:page_size]
    except Exception as exc:
        print(f"[dm-search] MCP fehlgeschlagen, CSV-Fallback: {exc}", file=sys.stderr)
        return search_pilot_csv(q)[:page_size]


def safe_file(url_path: str) -> Path | None:
    rel = unquote(url_path).split("?", 1)[0]
    rel = rel.lstrip("/")
    if not rel:
        return None
    parts = Path(rel).parts
    if any(p == ".." or p.startswith("/") for p in parts):
        return None
    full = (BASE_DIR / rel).resolve()
    try:
        full.relative_to(BASE_DIR)
    except ValueError:
        return None
    if full.is_file():
        return full
    return None



# ===== BEGIN country-aware live search (injected) =====
import urllib.parse

DM_COUNTRIES = {"DE", "AT", "IT", "PL", "CZ", "SK", "HU", "SI", "HR", "RO", "BG", "BA", "RS", "MK"}

DM_SHOP = {
    "DE": "https://www.dm.de/search?query=",
    "AT": "https://www.dm.at/search?query=",
    "IT": "https://www.dm.it/search?query=",
    "PL": "https://www.dm.pl/search?query=",
    "CZ": "https://www.dm.cz/search?query=",
    "SK": "https://www.dm.sk/search?query=",
    "HU": "https://www.dm.hu/search?query=",
    "SI": "https://www.dm.si/search?query=",
    "HR": "https://www.dm.hr/search?query=",
    "RO": "https://www.dm.ro/search?query=",
    "BG": "https://www.dm.bg/search?query=",
}

# Open Beauty Facts countries_tags uses English country names, lowercase, en: prefix
OBF_COUNTRY_TAG = {
    "AT": "en:austria", "BE": "en:belgium", "BG": "en:bulgaria", "HR": "en:croatia",
    "CY": "en:cyprus", "CZ": "en:czech-republic", "DK": "en:denmark", "EE": "en:estonia",
    "FI": "en:finland", "FR": "en:france", "DE": "en:germany", "GR": "en:greece",
    "HU": "en:hungary", "IE": "en:ireland", "IT": "en:italy", "LV": "en:latvia",
    "LT": "en:lithuania", "LU": "en:luxembourg", "MT": "en:malta", "NL": "en:netherlands",
    "PL": "en:poland", "PT": "en:portugal", "RO": "en:romania", "SK": "en:slovakia",
    "SI": "en:slovenia", "ES": "en:spain", "SE": "en:sweden",
    "CH": "en:switzerland", "NO": "en:norway", "IS": "en:iceland",
}

MUELLER_SHOP = {
    "DE": "https://www.mueller.de/search/?q=",
    "AT": "https://www.mueller.at/search/?q=",
    "CH": "https://www.mueller.ch/search/?q=",
    "HR": "https://www.mueller.hr/pretraga/?q=",
    "SI": "https://www.mueller.si/iskanje/?q=",
    "HU": "https://www.mueller.co.hu/kereses/?q=",
}

BIPA_SHOP = {
    "AT": "https://www.bipa.at/search?q=",
}

RETAILER_META = {
    "DE": {"primary": "dm", "secondary": "mueller", "label": "dm Deutschland", "mode": "mcp", "shop": DM_SHOP["DE"], "mueller_shop": MUELLER_SHOP["DE"]},
    "AT": {"primary": "dm", "secondary": "bipa", "tertiary": "mueller", "label": "dm, BIPA & Müller Österreich", "mode": "deeplink_obf", "shop": DM_SHOP["AT"], "bipa_shop": BIPA_SHOP["AT"], "mueller_shop": MUELLER_SHOP["AT"]},
    "IT": {"primary": "dm", "label": "dm Italia", "mode": "deeplink_obf", "shop": DM_SHOP["IT"]},
    "PL": {"primary": "dm", "label": "dm Polska", "mode": "deeplink_obf", "shop": DM_SHOP["PL"]},
    "CZ": {"primary": "dm", "label": "dm Česko", "mode": "deeplink_obf", "shop": DM_SHOP["CZ"]},
    "SK": {"primary": "dm", "label": "dm Slovensko", "mode": "deeplink_obf", "shop": DM_SHOP["SK"]},
    "HU": {"primary": "dm", "label": "dm Magyarország", "mode": "deeplink_obf", "shop": DM_SHOP["HU"]},
    "SI": {"primary": "dm", "label": "dm Slovenija", "mode": "deeplink_obf", "shop": DM_SHOP["SI"]},
    "HR": {"primary": "dm", "label": "dm Hrvatska", "mode": "deeplink_obf", "shop": DM_SHOP["HR"]},
    "RO": {"primary": "dm", "label": "dm România", "mode": "deeplink_obf", "shop": DM_SHOP["RO"]},
    "BG": {"primary": "dm", "label": "dm България", "mode": "deeplink_obf", "shop": DM_SHOP["BG"]},
    "FR": {"primary": "sephora", "label": "Sephora / Notino FR", "mode": "deeplink_obf", "shop": "https://www.notino.fr/search.asp?q="},
    "ES": {"primary": "notino", "label": "Notino / Sephora ES", "mode": "deeplink_obf", "shop": "https://www.notino.es/search.asp?q="},
    "PT": {"primary": "notino", "label": "Notino PT", "mode": "deeplink_obf", "shop": "https://www.notino.pt/search.asp?q="},
    "NL": {"primary": "douglas", "label": "Douglas / Notino NL", "mode": "deeplink_obf", "shop": "https://www.notino.nl/search.asp?q=", "note": "Auch Kruidvat/Etos"},
    "BE": {"primary": "douglas", "label": "Douglas / Notino BE", "mode": "deeplink_obf", "shop": "https://www.notino.be/search.asp?q=", "note": "Auch Kruidvat"},
    "CH": {"primary": "mueller", "secondary": "douglas", "label": "Müller Schweiz", "mode": "deeplink_obf", "shop": MUELLER_SHOP["CH"], "mueller_shop": MUELLER_SHOP["CH"]},
    "SE": {"primary": "notino", "label": "Notino SE", "mode": "deeplink_obf", "shop": "https://www.notino.se/search.asp?q="},
    "DK": {"primary": "notino", "label": "Notino DK", "mode": "deeplink_obf", "shop": "https://www.notino.dk/search.asp?q="},
    "FI": {"primary": "notino", "label": "Notino FI", "mode": "deeplink_obf", "shop": "https://www.notino.fi/search.asp?q="},
    "IE": {"primary": "notino", "label": "Notino IE", "mode": "deeplink_obf", "shop": "https://www.notino.ie/search.asp?q="},
    "GR": {"primary": "notino", "label": "Notino GR", "mode": "deeplink_obf", "shop": "https://www.notino.gr/search.asp?q="},
    "EE": {"primary": "douglas", "label": "Douglas / Notino EE", "mode": "deeplink_obf", "shop": "https://www.notino.ee/search.asp?q="},
    "LV": {"primary": "douglas", "label": "Douglas / Notino LV", "mode": "deeplink_obf", "shop": "https://www.notino.lv/search.asp?q="},
    "LT": {"primary": "douglas", "label": "Douglas / Notino LT", "mode": "deeplink_obf", "shop": "https://www.notino.lt/search.asp?q="},
    "LU": {"primary": "notino", "label": "Notino LU", "mode": "deeplink_obf", "shop": "https://www.notino.lu/search.asp?q="},
    "MT": {"primary": "notino", "label": "Notino (EU)", "mode": "deeplink_obf", "shop": "https://www.notino.com/search.asp?q="},
    "CY": {"primary": "notino", "label": "Notino (EU)", "mode": "deeplink_obf", "shop": "https://www.notino.com/search.asp?q="},
    "NO": {"primary": "notino", "label": "Notino NO", "mode": "deeplink_obf", "shop": "https://www.notino.no/search.asp?q="},
    "IS": {"primary": "notino", "label": "Notino (IS/EU)", "mode": "deeplink_obf", "shop": "https://www.notino.com/search.asp?q="},
}

EAN_RE = re.compile(r"^\d{8,14}$")
_EAN_WEB_CACHE: dict[str, dict] = {}


def retailer_for_country(cc: str) -> dict:
    code = (cc or "AT").strip().upper()
    meta = RETAILER_META.get(code)
    if meta:
        out = dict(meta)
        out["country"] = code
        return out
    return {
        "country": code,
        "primary": "notino",
        "label": "Notino (EU)",
        "mode": "deeplink_obf",
        "shop": "https://www.notino.com/search.asp?q=",
    }


def flatten_price(price) -> str:
    """API-Preis immer als String — nie nested object."""
    if price is None:
        return ""
    if isinstance(price, str):
        return price.strip()
    if isinstance(price, (int, float)) and not isinstance(price, bool):
        return str(price)
    if isinstance(price, dict):
        if "formattedValue" in price:
            return str(price.get("formattedValue") or "").strip()
        if price.get("value") not in (None, ""):
            cur = price.get("currency") or price.get("currencySymbol") or "€"
            val = str(price.get("value")).strip()
            return val if cur in val else f"{val} {cur}".strip()
        if price.get("amount") not in (None, ""):
            cur = price.get("currency") or price.get("currencySymbol") or "€"
            val = str(price.get("amount")).strip()
            return val if cur in val else f"{val} {cur}".strip()
        return ""
    return str(price).strip()


def ensure_product_price_str(p: dict) -> dict:
    if not isinstance(p, dict):
        return p
    p["price"] = flatten_price(p.get("price"))
    return p


def normalize_gtin(val: str) -> str:
    digits = re.sub(r"\D", "", str(val or ""))
    return digits.lstrip("0") or digits


def deeplink_card(query: str, meta: dict) -> dict:
    shop = meta.get("shop") or "https://www.notino.com/search.asp?q="
    url = shop + quote(query)
    return {
        "id": "deeplink_" + meta.get("country", "EU") + "_" + query[:20],
        "title": f"Im {meta.get('label', 'Shop')} nach „{query}“ suchen",
        "name": f"Im {meta.get('label', 'Shop')} nach „{query}“ suchen",
        "brand": meta.get("label") or "Shop",
        "brandName": meta.get("label") or "Shop",
        "price": "",
        "url": url,
        "appLink": url,
        "source": "deeplink",
        "deeplinkOnly": True,
        "retailerLabel": meta.get("label"),
        "store": meta.get("label"),
        "country": meta.get("country"),
        "countries": [meta.get("country")] if meta.get("country") else [],
        "gtin": "",
        "dan": "",
        "attributes": [],
    }


def bipa_deeplink_card(query: str, country: str) -> dict:
    cc = (country or "AT").strip().upper() or "AT"
    shop = BIPA_SHOP.get(cc, "https://www.bipa.at/search?q=")
    url = shop + quote(query)

    brand = "BIPA"
    q_clean = query.strip()
    q_lower = q_clean.lower()
    if re.search(r"\b(bi\s*good|bigood)\b", q_lower):
        brand = "bi good"
    elif re.search(r"\b(bi\s*care|bicare)\b", q_lower):
        brand = "bi care"
    elif re.search(r"\bbabywell\b", q_lower):
        brand = "Babywell"
    elif re.search(r"\blook\s*by\s*bipa\b", q_lower):
        brand = "Look by BIPA"
    elif re.search(r"\btoday\b", q_lower):
        brand = "Today"

    kat = "creme"
    if re.search(r"\b(wasch|reiniger|cleanser|reinigung|schaum|gel|mizell|seife)\b", q_lower):
        kat = "reiniger"
    elif re.search(r"\b(serum|ampulle|retinol|niacinamid|vitamin\s*c|aha|bha|peeling|elixier)\b", q_lower):
        kat = "serum"
    elif re.search(r"\b(sonne|sun|spf|lfs|uv)\b", q_lower):
        kat = "spf"
    elif re.search(r"\b(shampoo|haar|spülung|conditioner)\b", q_lower):
        kat = "haar"
    elif re.search(r"\b(windel|wundschutz|po-creme|zink|wickel)\b", q_lower):
        kat = "windel"

    safe_id = re.sub(r"\W+", "_", query)[:24].strip("_")
    return {
        "id": f"deeplink_bipa_{cc}_{safe_id}",
        "title": f"Im BIPA Onlineshop ({cc}) nach „{query}“ suchen",
        "name": f"Im BIPA Onlineshop nach „{query}“ suchen",
        "brand": brand,
        "brandName": brand,
        "price": "",
        "kat": kat,
        "url": url,
        "appLink": url,
        "source": "deeplink",
        "store": f"BIPA {cc}",
        "retailerLabel": f"BIPA {cc}",
        "country": cc,
        "countries": [cc],
        "wirk": f"BIPA Drogerie ({cc}) · Deep-Link",
        "attributes": [],
    }

def mueller_deeplink_card(query: str, country: str) -> dict:
    cc = (country or "AT").strip().upper() or "AT"
    shop = MUELLER_SHOP.get(cc, MUELLER_SHOP.get("DE", "https://www.mueller.de/search/?q="))
    url = shop + quote(query)

    brand = "Müller"
    q_clean = query.strip()
    q_lower = q_clean.lower()
    if re.search(r"\b(cv|cadeavera)\b", q_lower):
        brand = "CV CadeaVera"
    elif re.search(r"\bterra\s*naturi\b", q_lower):
        brand = "Terra Naturi"
    elif re.search(r"\bbeauty\s*baby\b", q_lower):
        brand = "Beauty Baby"
    elif re.search(r"\baveo\b", q_lower):
        brand = "Aveo"
    elif re.search(r"\baiko\b", q_lower):
        brand = "Aiko"
    elif re.search(r"\bduchesse\b", q_lower):
        brand = "Duchesse"

    kat = "creme"
    if re.search(r"\b(wasch|reiniger|cleanser|reinigung|schaum|gel|mizell)\b", q_lower):
        kat = "reiniger"
    elif re.search(r"\b(serum|ampulle|retinol|niacinamid|vitamin\s*c|aha|bha|peeling)\b", q_lower):
        kat = "serum"
    elif re.search(r"\b(sonne|sun|spf|lfs|uv)\b", q_lower):
        kat = "spf"
    elif re.search(r"\b(shampoo|haar|spülung|conditioner)\b", q_lower):
        kat = "haar"
    elif re.search(r"\b(windel|wundschutz|po-creme|zink|wickel)\b", q_lower):
        kat = "windel"

    safe_id = re.sub(r"\W+", "_", query)[:24].strip("_")
    return {
        "id": f"deeplink_mueller_{cc}_{safe_id}",
        "title": f"Im Müller Onlineshop ({cc}) nach „{query}“ suchen",
        "name": f"Im Müller Onlineshop nach „{query}“ suchen",
        "brand": brand,
        "brandName": brand,
        "price": "",
        "kat": kat,
        "url": url,
        "appLink": url,
        "source": "deeplink",
        "deeplinkOnly": True,
        "retailerLabel": f"Müller {cc}",
        "store": f"Müller {cc}",
        "country": cc,
        "countries": [cc],
        "gtin": "",
        "dan": "",
        "attributes": [],
        "wirk": f"Müller Onlineshop ({cc}) · Deep-Link",
    }


def shop_search_url(meta: dict, query: str) -> str:
    shop = meta.get("shop") or "https://www.notino.com/search.asp?q="
    return shop + quote(query)


def search_obf(query: str, country: str, page_size: int) -> list:
    """Open Beauty Facts search, optionally filtered by countries_tags."""
    q = (query or "").strip()
    if not q:
        return []
    tag = OBF_COUNTRY_TAG.get((country or "").upper())
    params = {
        "search_terms": q,
        "search_simple": "1",
        "action": "process",
        "json": "1",
        "page_size": str(max(1, min(page_size, 12))),
        "fields": "code,product_name,brands,image_url,countries_tags,url",
    }
    if tag:
        params["tagtype_0"] = "countries"
        params["tag_contains_0"] = "contains"
        params["tag_0"] = tag
    url = "https://world.openbeautyfacts.org/cgi/search.pl?" + urllib.parse.urlencode(params)
    req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with urlopen(req, timeout=18) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="replace"))
    except Exception as exc:
        print(f"[live-search] OBF fehlgeschlagen: {exc}", file=sys.stderr)
        return []
    products = []
    for p in data.get("products") or []:
        code = str(p.get("code") or "")
        name = p.get("product_name") or ""
        if not name and not code:
            continue
        brands = p.get("brands") or ""
        img = p.get("image_url") or ""
        link = p.get("url") or (f"https://world.openbeautyfacts.org/product/{code}" if code else "")
        brand_main = brands.split(",")[0].strip() if brands else "OBF"
        products.append(ensure_product_price_str({
            "id": "obf_" + (code or name[:24]),
            "title": name or brands,
            "name": name or brands,
            "brand": brand_main,
            "brandName": brand_main,
            "gtin": code,
            "ean": code,
            "price": "",
            "url": link,
            "appLink": link,
            "img": img,
            "image_url": img,
            "source": "obf",
            "deeplinkOnly": False,
            "retailerLabel": "Open Beauty Facts",
            "country": (country or "").upper(),
            "countries": [(country or "").upper()] if country else [],
            "countries_tags": ctags,
            "attributes": [],
            "store": "Open Beauty Facts",
        }))
    return products


def search_obf_barcode(ean: str) -> dict | None:
    """OBF product-by-barcode ohne Länderfilter."""
    code = re.sub(r"\D", "", str(ean or ""))
    if not code:
        return None
    url = f"https://world.openbeautyfacts.org/api/v2/product/{code}.json"
    req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="replace"))
    except Exception as exc:
        print(f"[live-search] OBF barcode fehlgeschlagen: {exc}", file=sys.stderr)
        return None
    if int(data.get("status") or 0) != 1:
        return None
    p = data.get("product") or {}
    name = p.get("product_name") or p.get("product_name_de") or p.get("product_name_en") or ""
    brands = p.get("brands") or ""
    if not name and not brands:
        return None
    img = p.get("image_url") or p.get("image_front_url") or ""
    brand_main = brands.split(",")[0].strip() if brands else "OBF"
    link = f"https://world.openbeautyfacts.org/product/{code}"
    return ensure_product_price_str({
        "id": "obf_" + code,
        "title": name or brands,
        "name": name or brands,
        "brand": brand_main,
        "brandName": brand_main,
        "gtin": code,
        "ean": code,
        "price": "",
        "url": link,
        "appLink": link,
        "img": img,
        "image_url": img,
        "source": "obf",
        "deeplinkOnly": False,
        "retailerLabel": "Open Beauty Facts",
        "countries": [],
        "attributes": [],
        "store": "Open Beauty Facts",
        "wirk": "EAN erkannt (OBF)",
    })


def search_off_barcode(ean: str) -> dict | None:
    """Open Food Facts product-by-barcode (enthält Millionen Körperpflege- und Drogerieartikel)."""
    code = re.sub(r"\D", "", str(ean or ""))
    if not code:
        return None
    url = f"https://world.openfoodfacts.org/api/v2/product/{code}.json"
    req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="replace"))
    except Exception as exc:
        print(f"[live-search] OFF barcode fehlgeschlagen: {exc}", file=sys.stderr)
        return None
    if int(data.get("status") or 0) != 1:
        return None
    p = data.get("product") or {}
    name = p.get("product_name") or p.get("product_name_de") or p.get("product_name_en") or ""
    brands = p.get("brands") or ""
    if not name and not brands:
        return None
    img = p.get("image_url") or p.get("image_front_url") or ""
    brand_main = brands.split(",")[0].strip() if brands else "Open Food Facts"
    link = f"https://world.openfoodfacts.org/product/{code}"
    return ensure_product_price_str({
        "id": "off_" + code,
        "title": name or brands,
        "name": name or brands,
        "brand": brand_main,
        "brandName": brand_main,
        "gtin": code,
        "ean": code,
        "price": "",
        "url": link,
        "appLink": link,
        "img": img,
        "image_url": img,
        "source": "off",
        "deeplinkOnly": False,
        "retailerLabel": "Open Food Facts",
        "countries": [],
        "attributes": [],
        "store": "Open Food Facts",
        "wirk": "EAN erkannt (OFF)",
    })



def load_katalog_rows() -> list:
    path = BASE_DIR / "katalog-produkte.csv"
    if not path.is_file():
        return []
    with path.open("r", encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


def product_from_katalog(row: dict) -> dict:
    ean = str(row.get("ean") or "").strip()
    name = row.get("name") or ""
    brand = row.get("brand") or ""
    link = row.get("source_url") or row.get("offizielle_produktseite") or ""
    notes = row.get("notes") or row.get("kurzbeschreibung") or ""

    price = ""
    m_p = re.search(r"price=([^;]+)", notes)
    if m_p:
        price = m_p.group(1).strip()

    img = ""
    m_i = re.search(r"img=([^;]+)", notes)
    if m_i:
        img = m_i.group(1).strip()

    ff = row.get("flag_fragrance_free") == "yes"
    nc = row.get("flag_nc") == "yes"
    cf = row.get("flag_cf") == "yes"
    u3 = row.get("flag_under3_intended") == "yes"
    slot = row.get("slot") or "creme"

    store = "Katalog"
    low_src = (link + " " + notes).lower()
    if "mueller" in low_src:
        store = "Müller"
    elif "bipa" in low_src:
        store = "BIPA"
    elif "dm." in low_src:
        store = "dm"

    return ensure_product_price_str({
        "id": "katalog_" + (ean or name[:24]),
        "dan": "",
        "gtin": ean,
        "ean": ean,
        "title": name,
        "name": name,
        "brandName": brand,
        "brand": brand,
        "price": price,
        "img": img,
        "image_url": img,
        "url": link,
        "appLink": link,
        "relativeProductUrl": path_from_applink(link) if link else "",
        "source": "katalog",
        "deeplinkOnly": False,
        "retailerLabel": f"{store} (Katalog)",
        "store": store,
        "category": row.get("katalog") or "",
        "kat": slot,
        "ff": ff,
        "nc": nc,
        "cf": cf,
        "u3": u3,
        "attributes": [],
        "wirk": f"{store} · {price}" if price else f"EAN erkannt ({store} Katalog)",
    })


def search_katalog_ean(ean: str) -> dict | None:
    want = normalize_gtin(ean)
    raw = re.sub(r"\D", "", str(ean or ""))
    if not want and not raw:
        return None
    for row in load_katalog_rows():
        row_ean = str(row.get("ean") or "").strip()
        if not row_ean:
            continue
        if normalize_gtin(row_ean) == want or re.sub(r"\D", "", row_ean) == raw:
            return product_from_katalog(row)
    return None


def search_pilot_ean(ean: str) -> dict | None:
    want = normalize_gtin(ean)
    raw = re.sub(r"\D", "", str(ean or ""))
    if not want and not raw:
        return None
    for row in load_pilot_rows():
        row_ean = str(row.get("ean") or row.get("gtin") or "").strip()
        if not row_ean:
            continue
        if normalize_gtin(row_ean) == want or re.sub(r"\D", "", row_ean) == raw:
            p = product_from_pilot(row)
            p["source"] = "dm_pilot"
            p["deeplinkOnly"] = False
            p["retailerLabel"] = "dm Pilot-CSV"
            p["wirk"] = "EAN erkannt (Pilot-CSV)"
            return ensure_product_price_str(p)
    return None


def mcp_exact_gtin(ean: str, meta: dict) -> dict | None:
    """dm MCP mit exakter GTIN — Identity, kein lokaler AT-Lagerbestand."""
    raw = re.sub(r"\D", "", str(ean or ""))
    want = normalize_gtin(raw)
    if not raw:
        return None
    try:
        hits = mcp_search_products(raw)
    except Exception as exc:
        print(f"[live-search] MCP GTIN fehlgeschlagen: {exc}", file=sys.stderr)
        return None
    for p in hits or []:
        g = str(p.get("gtin") or p.get("ean") or "")
        if normalize_gtin(g) == want or re.sub(r"\D", "", g) == raw:
            out = dict(p)
            out["source"] = "dm_mcp_identity"
            out["deeplinkOnly"] = False
            out["gtin"] = raw
            out["ean"] = raw
            cc = meta.get("country") or ""
            # Ländershop-Deeplink bevorzugen wenn nicht DE
            if cc and cc != "DE":
                out["url"] = shop_search_url(meta, raw)
                out["appLink"] = out["url"]
                out["retailerLabel"] = f"{meta.get('label')} · Identity via dm DE-MCP (kein lokaler Bestand)"
            else:
                out["retailerLabel"] = "dm Deutschland"
                rel = out.get("relativeProductUrl") or ""
                if rel and not out.get("url"):
                    out["url"] = "https://www.dm.de" + rel
            out["wirk"] = "EAN erkannt (dm MCP Identity — Preis/Lager DE, nicht lokal)"
            out["country"] = cc
            out["countries"] = [cc] if cc else ["DE"]
            return ensure_product_price_str(out)
    return None


def _jina_get(url: str, timeout: int = 20) -> str:
    jina_url = "https://r.jina.ai/" + url
    req = Request(
        jina_url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "text/markdown",
            "X-Return-Format": "markdown",
        },
    )
    with urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="replace")


def _parse_web_ean_title(text: str, ean: str) -> tuple[str, str, str, str]:
    """Extrahiert (title, brand, dm_url, img) aus Jina/DDG/BarcodeLookup Markdown."""
    title = ""
    brand = ""
    dm_url = ""
    img = ""
    if not text:
        return title, brand, dm_url, img

    m_uddg = re.search(
        r"uddg=https?%3A%2F%2F(?:www\.)?dm\.de%2Fp%2Fd%2F(\d+)%2F([a-z0-9\-]+)",
        text,
        re.I,
    )
    if m_uddg:
        dm_url = f"https://www.dm.de/p/d/{m_uddg.group(1)}/{m_uddg.group(2)}"
    if not dm_url:
        m_dm = re.search(r"https?://(?:www\.)?dm\.de(/p/d/\d+/[a-z0-9\-]+)", text, re.I)
        if m_dm:
            dm_url = "https://www.dm.de" + m_dm.group(1).rstrip(").,;\"'")
    if not dm_url:
        m_dm2 = re.search(r"(?<![\w])(/p/d/\d+/[a-z0-9\-]+)", text, re.I)
        if m_dm2:
            dm_url = "https://www.dm.de" + m_dm2.group(1)

    for m in re.finditer(r"^#{1,4}\s+\[([^\]]+)\]\([^)]+\)", text, re.M):
        cand = re.sub(r"\s+", " ", m.group(1)).strip()
        cand = re.sub(r"\s*[-–|]\s*dm\.de\s*$", "", cand, flags=re.I).strip()
        low = cand.lower()
        if len(cand) < 8 or "duckduckgo" in low or "barcode" in low:
            continue
        if ean in cand:
            continue
        title = cand
        break

    if not title:
        m2 = re.search(r"^#\s*EAN\s+\d+\s*\n+#{2,4}\s+(.+)$", text, re.M)
        if m2:
            title = re.sub(r"\s+", " ", m2.group(1)).strip()
        else:
            m = re.search(r"^#{1,4}\s+(?!EAN\b)(.+)$", text, re.M)
            if m:
                cand = re.sub(r"\s+", " ", m.group(1)).strip()
                if "EAN" not in cand and len(cand) > 8:
                    title = cand

    m_brand = re.search(r"(?im)^Brand:\s*(.+)$", text)
    if m_brand:
        brand = m_brand.group(1).strip()

    m_img = re.search(r"!\[[^\]]*\]\((https://images\.barcodelookup\.com/[^)\s]+)\)", text)
    if m_img:
        img = m_img.group(1)
    if not img:
        m_img2 = re.search(r"!\[[^\]]*Mixa[^\]]*\]\((https?://[^)\s]+)\)", text, re.I)
        if m_img2:
            img = m_img2.group(1)

    if not title:
        patterns = [
            re.compile(r"(?i)Title:\s*(.+)$", re.M),
            re.compile(r"(?i)(Mixa\s+Balm\s+Cica[^\n\r|]{0,80})"),
            re.compile(r"(?i)(Balm\s+Cica\+?\s+Multi-Use[^\n\r|]{0,60})"),
        ]
        for pat in patterns:
            m = pat.search(text)
            if not m:
                continue
            cand = re.sub(r"\s+", " ", m.group(1)).strip(" #-*|")
            cand = re.sub(r"\s*[-–|]\s*(dm\.de|barcodelookup|duckduckgo).*$", "", cand, flags=re.I).strip()
            if "at DuckDuckGo" in cand or "Barcode Lookup" in cand:
                continue
            if any(bad in cand.lower() for bad in ["keine treffer", "nicht gefunden", "suchergebnis", "ergebnis für", "ergebnisse für", "kein treffer", "mehr als eine drogerie", "online mehr"]):
                continue
            if len(cand) >= 8:
                title = cand
                break

    if title:
        title = re.sub(r"\s*[-–|]\s*(dm\.de|barcodelookup|duckduckgo).*$", "", title, flags=re.I).strip()
        known_brands = [
            "The Ordinary", "CV CadeaVera", "CadeaVera", "Terra Naturi", "Aveo Med", "Aveo",
            "Beauty Baby", "Mixa", "CeraVe", "Balea", "Nivea", "Neutrogena", "La Roche-Posay",
            "Garnier", "Sebamed", "Isana", "Catrice", "Essence", "Maybelline", "L'Oréal", "Loreal",
            "L'Oreal", "Weleda", "Dr. Hauschka", "Alverde", "Kneipp", "bi good", "bi care",
            "Babywell", "Paula's Choice", "Geek & Gorgeous", "Avene", "Eucerin", "Bioderma"
        ]
        if " - " in title:
            parts = [p.strip() for p in title.split(" - ")]
            if len(parts) == 2:
                left, right = parts[0], parts[1]
                for kb in known_brands:
                    if right.lower() == kb.lower() or right.lower().startswith(kb.lower()):
                        brand = kb
                        title = f"{brand} {left}" if not left.lower().startswith(brand.lower()) else left
                        break
                    elif left.lower() == kb.lower() or left.lower().startswith(kb.lower()):
                        brand = kb
                        title = f"{brand} {right}" if not right.lower().startswith(brand.lower()) else right
                        break
        if not brand:
            for kb in known_brands:
                if title.lower().startswith(kb.lower()):
                    brand = kb
                    break
        if not brand:
            m = re.match(
                r"(?i)^(Mixa|CeraVe|Balea|Nivea|Isana|Garnier|La Roche-Posay|L['']?Oreal|Loreal|L['']Oréal)\b",
                title,
            )
            if m:
                brand = m.group(1)
        if not brand:
            m = re.search(r"(?i)\bvon\s+(Mixa|CeraVe|Balea|Nivea|Isana|Garnier)\b", text)
            if m:
                brand = m.group(1)
                if not title.lower().startswith(brand.lower()):
                    title = f"{brand} {title}"

    if not img:
        m_mimg = re.search(r'https?://[^\s\)\"]*(?:static|images)\.prod\.ecom\.mueller\.de[^\s\)\"]*products/[^\s\)\"]+', text)
        if m_mimg:
            img_raw = m_mimg.group(0)
            m_u = re.search(r'url=([^&]+)', img_raw)
            img = urllib.parse.unquote(m_u.group(1)) if m_u else img_raw

    return title, brand, dm_url, img


def _mcp_enrich_by_title(ean: str, title: str, meta: dict) -> dict | None:
    """Nach Web-Titel: MCP-Suche, nur exakte GTIN behalten."""
    raw = re.sub(r"\D", "", str(ean or ""))
    want = normalize_gtin(raw)
    q = re.sub(r"\s+", " ", (title or "")).strip()
    q = re.sub(r",\s*\d+\s*ml.*$", "", q, flags=re.I).strip()
    if len(q) > 60:
        q = " ".join(q.split()[:6])
    if len(q) < 4:
        return None
    try:
        hits = mcp_search_products(q)
    except Exception as exc:
        print(f"[live-search] MCP enrich fehlgeschlagen: {exc}", file=sys.stderr)
        return None
    for p in hits or []:
        g = str(p.get("gtin") or p.get("ean") or "")
        if normalize_gtin(g) == want or re.sub(r"\D", "", g) == raw:
            out = dict(p)
            out["source"] = "dm_mcp_identity"
            out["deeplinkOnly"] = False
            out["gtin"] = raw
            out["ean"] = raw
            cc = meta.get("country") or ""
            if cc and cc != "DE":
                out["url"] = shop_search_url(meta, raw)
                out["appLink"] = out["url"]
                out["retailerLabel"] = (
                    f"{meta.get('label')} · Identity via dm DE-MCP (kein lokaler Bestand)"
                )
            else:
                out["retailerLabel"] = "dm Deutschland"
                rel = out.get("relativeProductUrl") or ""
                if rel and not out.get("url"):
                    out["url"] = "https://www.dm.de" + rel
            out["wirk"] = "EAN erkannt (dm MCP Identity — Preis/Lager DE, nicht lokal)"
            out["country"] = cc
            out["countries"] = [cc] if cc else ["DE"]
            return ensure_product_price_str(out)
    return None


def resolve_ean_web(ean: str, meta: dict) -> dict | None:
    """Fallback: DuckDuckGo/jina + BarcodeLookup -> Produktidentitaet."""
    raw = re.sub(r"\D", "", str(ean or ""))
    if not raw:
        return None
    if raw in _EAN_WEB_CACHE:
        cached = dict(_EAN_WEB_CACHE[raw])
        if meta.get("country") and meta.get("country") != "DE" and not (cached.get("url") or "").startswith("https://www.dm.de/p/"):
            cached["url"] = shop_search_url(meta, raw)
            cached["appLink"] = cached["url"]
            cached["retailerLabel"] = meta.get("label") or cached.get("retailerLabel")
        return cached

    title = ""
    brand = ""
    dm_url = ""
    img = ""

    sources = [
        f"https://www.mueller.at/search/?q={urllib.parse.quote(raw)}",
        f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(raw)}",
        f"http://www.barcodelookup.com/{raw}",
        f"https://www.dm.de/search?query={urllib.parse.quote(raw)}",
    ]
    for src in sources:
        try:
            text = _jina_get(src, timeout=20)
        except Exception as exc:
            print(f"[live-search] jina EAN fetch fehlgeschlagen ({src}): {exc}", file=sys.stderr)
            continue
        t, b, u, im = _parse_web_ean_title(text, raw)
        if t and not title:
            title = t
        if b and not brand:
            brand = b
        if u and not dm_url:
            dm_url = u
        if im and not img:
            img = im
        if title and (dm_url or brand or len(title) > 12):
            break

    if dm_url and (not title or len(title) < 10 or not brand):
        try:
            text = _jina_get(dm_url, timeout=20)
            t, b, _u, im = _parse_web_ean_title(text, raw)
            m_title = re.search(r"(?im)^Title:\s*(.+)$", text)
            if m_title:
                page_title = m_title.group(1).strip()
                page_title = re.sub(r"\s*dauerhaft.*$", "", page_title, flags=re.I).strip()
                page_title = re.sub(r"\s*[|].*$", "", page_title).strip()
                page_title = re.sub(r"\s*[-–]\s*dm\.de.*$", "", page_title, flags=re.I).strip()
                if len(page_title) > 8:
                    title = page_title
            if t and not title:
                title = t
            if b and not brand:
                brand = b
            if im and not img:
                img = im
        except Exception as exc:
            print(f"[live-search] jina dm page fehlgeschlagen: {exc}", file=sys.stderr)

    if not title:
        return None

    if not brand:
        m = re.match(
            r"(?i)^(Mixa|CeraVe|Balea|Nivea|La Roche-Posay|Isana|Garnier|Loreal|The Ordinary)\b",
            title,
        )
        if m:
            brand = m.group(1)

    enriched = _mcp_enrich_by_title(raw, title, meta)
    if enriched:
        if img and not enriched.get("img"):
            enriched["img"] = img
        if dm_url and meta.get("country") == "DE":
            enriched["url"] = dm_url
            enriched["appLink"] = dm_url
        _EAN_WEB_CACHE[raw] = dict(enriched)
        return enriched

    cc = meta.get("country") or ""
    if dm_url and (cc == "DE" or not cc):
        url = dm_url
    else:
        url = shop_search_url(meta, raw) if meta.get("shop") else (dm_url or shop_search_url(meta, raw))

    prod = ensure_product_price_str({
        "id": "ean_" + raw,
        "title": title,
        "name": title,
        "brandName": brand,
        "brand": brand,
        "gtin": raw,
        "ean": raw,
        "price": "",
        "img": img,
        "url": url,
        "appLink": url,
        "source": "ean_web",
        "deeplinkOnly": False,
        "retailerLabel": meta.get("label") or "EAN (Web)",
        "country": cc,
        "countries": [cc] if cc else [],
        "attributes": [],
        "store": meta.get("label") or "EAN Web",
        "wirk": "EAN erkannt (Web)",
    })
    _EAN_WEB_CACHE[raw] = dict(prod)
    return prod


def search_off_barcode(ean: str) -> dict | None:
    """Open Food Facts product-by-barcode (enthält Millionen Drogerie- und Kosmetikartikel)."""
    code = re.sub(r"\D", "", str(ean or ""))
    if not code:
        return None
    url = f"https://world.openfoodfacts.org/api/v2/product/{code}.json"
    req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="replace"))
    except Exception:
        return None
    if int(data.get("status") or 0) != 1:
        return None
    p = data.get("product") or {}
    name = p.get("product_name_de") or p.get("product_name") or p.get("generic_name_de") or p.get("generic_name") or ""
    brands = p.get("brands") or ""
    if not name and not brands:
        return None
    img = p.get("image_front_url") or p.get("image_url") or ""
    link = f"https://world.openfoodfacts.org/product/{code}"
    brand_main = brands.split(",")[0].strip() if brands else "Produkt"
    return ensure_product_price_str({
        "id": "off_" + code,
        "title": f"{brand_main} {name}" if not name.lower().startswith(brand_main.lower()) else name,
        "name": name or brand_main,
        "brandName": brand_main,
        "brand": brand_main,
        "gtin": code,
        "ean": code,
        "price": "",
        "url": link,
        "appLink": link,
        "img": img,
        "image_url": img,
        "source": "off",
        "deeplinkOnly": False,
        "retailerLabel": "Open Food Facts",
        "countries": [],
        "attributes": [],
        "store": "Open Food Facts",
        "wirk": "EAN erkannt (Open Food Facts)",
    })


def fetch_mueller_ean(code: str, country: str = "AT") -> dict | None:
    """Sucht Produkt-Identität mit echtem hochauflösendem Bild und Preis im Müller-Sortiment."""
    raw = re.sub(r"\D", "", str(code or ""))
    if not (8 <= len(raw) <= 14):
        return None

    candidates = [raw]
    if len(raw) == 13 and raw.startswith("0"):
        candidates.append(raw[1:])
    elif len(raw) == 12:
        candidates.append("0" + raw)

    cc = str(country or "AT").upper()
    domains = ["mueller.de", "mueller.at"] if cc == "DE" else ["mueller.at", "mueller.de"]

    for c_cand in candidates:
        for domain in domains:
            search_url = f"https://www.{domain}/search/?q={c_cand}"
            text = ""
            try:
                text = _jina_get(search_url, timeout=7)
            except Exception:
                continue

            if not text or ("Suchergebnis für" not in text and "/p/" not in text and "Title:" not in text):
                continue

            m_source = re.search(r"URL Source:\s*(https?://(?:www\.)?mueller\.[a-z]+/p/[^\s\)]+)", text, re.I)
            m_title_header = re.search(r"Title:\s*([^|\n\r]+)(?:\|\s*M[UÜ]LLER)?", text, re.I)

            raw_title = ""
            prod_url = ""

            # 1. Search result markdown link: [Title](/p/slug) or [Title](https://.../p/slug)
            m_link = re.search(r"\[([^\]]+)\]\(((?:https?://(?:www\.)?mueller\.[a-z]+)?/p/[a-zA-Z0-9_\-]+(?:\/|\b)?)\)", text, re.I)
            if m_link and not m_link.group(1).startswith("Image") and not m_link.group(1).startswith("![Image"):
                raw_title = m_link.group(1).strip()
                prod_url = m_link.group(2).strip()
            else:
                m_img_link = re.search(r"\[!\[Image\s*\d*:\s*([^\]]*)\]\([^)]+\)\]\(((?:https?://(?:www\.)?mueller\.[a-z]+)?/p/[a-zA-Z0-9_\-]+(?:\/|\b)?)\)", text, re.I)
                if m_img_link:
                    raw_title = m_img_link.group(1).strip()
                    prod_url = m_img_link.group(2).strip()
                elif m_source and m_title_header:
                    prod_url = m_source.group(1).strip()
                    raw_title = m_title_header.group(1).replace("online bestellen", "").strip()

            if not raw_title or not prod_url:
                continue

            if prod_url.startswith("/"):
                prod_url = f"https://www.{domain}" + prod_url

            # Image extraction
            img = ""
            m_img_code = re.search(rf"https?://[^\s\)\"]*products(?:/|%2F){raw}(?:/|%2F)[^\s\)\"]+", text, re.I)
            if m_img_code:
                img = m_img_code.group(0)
            if not img:
                m_img_prod = re.search(r"https?://[^\s\)\"]*(?:static|images)\.prod\.ecom\.mueller\.de[^\s\)\"]*products(?:%2F|\/)[^\s\)\"]+", text, re.I)
                if m_img_prod:
                    img = m_img_prod.group(0)
            if not img:
                m_card_img = re.search(r"\[!\[Image[^\]]*\]\((https?://[^\s\)\"]+)\)\]\([^\)]*\/p\/", text, re.I)
                if m_card_img and "icon" not in m_card_img.group(1).lower() and "dam/jcr" not in m_card_img.group(1).lower():
                    img = m_card_img.group(1)

            if img:
                m_u = re.search(r"url=([^&]+)", img)
                if m_u:
                    try:
                        img = urllib.parse.unquote(m_u.group(1))
                    except Exception:
                        pass

            price = ""
            m_price = re.search(r"(\d+[,.]\d{2}\s*€)", text)
            if m_price:
                price = m_price.group(1).strip()

            known_brands = [
                "The Ordinary", "CV CadeaVera", "CadeaVera", "Terra Naturi", "Aveo Med", "Aveo",
                "Beauty Baby", "Mixa", "CeraVe", "Balea", "Nivea", "Neutrogena", "La Roche-Posay",
                "Garnier", "Sebamed", "Isana", "Catrice", "Essence", "Maybelline", "L'Oréal", "Loreal",
                "L'Oreal", "Weleda", "Dr. Hauschka", "Alverde", "Kneipp", "bi good", "bi care", "Babywell"
            ]
            brand = ""
            for kb in known_brands:
                if raw_title.lower().startswith(kb.lower()):
                    brand = kb
                    break
            if not brand:
                brand = raw_title.split()[0] if raw_title else "Müller"

            name = raw_title
            if brand and name.lower().startswith(brand.lower()):
                name = name[len(brand):].strip().lstrip("-–: ")

            full_text = (raw_title + " " + brand).lower()
            kat = "creme"
            if re.search(r"\b(wasch|reiniger|cleanser|reinigung|schaum|gel|mizell|seife)\b", full_text):
                kat = "reiniger"
            elif re.search(r"\b(serum|ampulle|retinol|niacinamid|vitamin\s*c|aha|bha|peeling|elixier)\b", full_text):
                kat = "serum"
            elif re.search(r"\b(sonne|sun|spf|lsf|uv)\b", full_text):
                kat = "spf"
            elif re.search(r"\b(shampoo|haar|spülung|conditioner)\b", full_text):
                kat = "haar"
            elif re.search(r"\b(windel|wundschutz|po-creme|zink|wickel)\b", full_text):
                kat = "windel"

            return ensure_product_price_str({
                "id": f"mueller_{raw}",
                "dan": "",
                "gtin": raw,
                "ean": raw,
                "title": raw_title,
                "name": name or raw_title,
                "brand": brand,
                "brandName": brand,
                "price": price,
                "img": img,
                "image_url": img,
                "url": prod_url,
                "appLink": prod_url,
                "store": "Müller",
                "retailerLabel": "Müller",
                "source": "mueller_live",
                "deeplinkOnly": False,
                "kat": kat,
                "wirk": f"Müller Sortiment · {price}" if price else "Müller Sortiment",
                "country": cc,
                "countries": [cc],
            })

    return None


def fetch_dmtech_search(query: str, page_size: int = 10) -> list[dict]:
    """Direkte, schnelle dmtech-Produktsuche (inkl. hochauflösender Produktbilder und Preisen)."""
    q = str(query or "").strip()
    if not q:
        return []
    url = f"https://product-search.services.dmtech.com/de/search?query={quote(q)}&pageSize={max(1, min(page_size, 20))}"
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            out = []
            for p in data.get("products", []):
                tile = p.get("tileData", {})
                imgs = tile.get("images", [])
                img = imgs[0].get("tileSrc") if imgs else ""
                price_val = tile.get("price", {}).get("price", {}).get("current", {}).get("value") or ""
                self_path = tile.get("self") or ""
                dan = str(p.get("dan") or tile.get("dan") or "")
                gtin = str(p.get("gtin") or tile.get("gtin") or "")
                brand = p.get("brandName") or (tile.get("brand") or {}).get("name") or ""
                title = p.get("title") or (tile.get("title") or {}).get("tileHeadline") or ""
                full_url = f"https://www.dm.de{self_path}" if self_path else ""

                kat = "creme"
                title_lower = (title + " " + brand).lower()
                if re.search(r"\b(wasch|reiniger|cleanser|reinigung|schaum|gel|mizell|seife)\b", title_lower):
                    kat = "reiniger"
                elif re.search(r"\b(serum|ampulle|retinol|niacinamid|vitamin\s*c|aha|bha|peeling|elixier)\b", title_lower):
                    kat = "serum"
                elif re.search(r"\b(sonne|sun|spf|lfs|uv)\b", title_lower):
                    kat = "spf"
                elif re.search(r"\b(shampoo|haar|spülung|conditioner)\b", title_lower):
                    kat = "haar"
                elif re.search(r"\b(windel|wundschutz|po-creme|zink|wickel)\b", title_lower):
                    kat = "windel"

                safe_id = re.sub(r"\W+", "_", dan or gtin or title)[:24].strip("_")
                out.append({
                    "id": f"dmtech_{safe_id}",
                    "dan": dan,
                    "gtin": gtin,
                    "ean": gtin,
                    "title": title,
                    "name": title,
                    "brand": brand,
                    "brandName": brand,
                    "price": price_val,
                    "img": img,
                    "image_url": img,
                    "kat": kat,
                    "relativeProductUrl": self_path,
                    "url": full_url,
                    "appLink": full_url,
                    "store": "dm",
                    "source": "dm_live",
                    "deeplinkOnly": False,
                    "wirk": f"dm Sortiment · {price_val}" if price_val else "dm Sortiment"
                })
            return out
    except Exception as exc:
        print(f"[dmtech-search] Fehler bei Suche '{q}':", exc)
        return []

def resolve_ean_identity(ean: str, country: str, meta: dict) -> tuple[list, str, str | None]:
    """EAN/GTIN Identity-Auflösung vor alleinigem Deeplink-Card.
    Returns (products, note, shopSearchUrlHint).
    """
    raw = re.sub(r"\D", "", str(ean or ""))
    shop_hint = shop_search_url(meta, raw)

    # 1) Lokaler Katalog
    hit = search_katalog_ean(raw)
    if hit:
        hit["country"] = country
        hit["countries"] = [country] if country else []
        # Hochauflösendes Produktbild & Preis anreichern falls im CSV nicht vorhanden
        if not hit.get("img") or not hit.get("price"):
            is_mueller_pref = hit.get("store") == "Müller" or "mueller" in (hit.get("url") or "")
            if is_mueller_pref:
                m_hit = fetch_mueller_ean(raw, country)
                if m_hit:
                    if not hit.get("img") and m_hit.get("img"):
                        hit["img"] = m_hit["img"]
                        hit["image_url"] = m_hit["img"]
                    if not hit.get("price") and m_hit.get("price"):
                        hit["price"] = m_hit["price"]
                    if m_hit.get("url") and not hit.get("url"):
                        hit["url"] = m_hit["url"]
                        hit["appLink"] = m_hit["appLink"]
            else:
                dmtech_hits = fetch_dmtech_search(raw, 1)
                if dmtech_hits:
                    if not hit.get("img") and dmtech_hits[0].get("img"):
                        hit["img"] = dmtech_hits[0]["img"]
                        hit["image_url"] = dmtech_hits[0]["img"]
                    if not hit.get("price") and dmtech_hits[0].get("price"):
                        hit["price"] = dmtech_hits[0]["price"]
                    if dmtech_hits[0].get("url") and not hit.get("url"):
                        hit["url"] = dmtech_hits[0]["url"]
                        hit["appLink"] = dmtech_hits[0]["appLink"]
                elif not hit.get("img"):
                    m_hit = fetch_mueller_ean(raw, country)
                    if m_hit:
                        if not hit.get("img") and m_hit.get("img"):
                            hit["img"] = m_hit["img"]
                            hit["image_url"] = m_hit["img"]
                        if not hit.get("price") and m_hit.get("price"):
                            hit["price"] = m_hit["price"]
        if not hit.get("url"):
            hit["url"] = shop_hint
            hit["appLink"] = shop_hint
        return [ensure_product_price_str(hit)], "EAN: lokaler Katalog", shop_hint

    # 2) dmtech Direktsuche (schnellste Echtzeit-Identität mit echtem hochauflösendem Produktfoto & Preis!)
    dmtech_candidates = [raw]
    if len(raw) == 12:
        dmtech_candidates.append("0" + raw)
    elif len(raw) == 13 and raw.startswith("0"):
        dmtech_candidates.append(raw[1:])
    for d_cand in dmtech_candidates:
        dmtech_hits = fetch_dmtech_search(d_cand, 1)
        if dmtech_hits:
            hit = dmtech_hits[0]
            hit["country"] = country
            hit["countries"] = [country] if country else []
            hit["retailerLabel"] = f"{meta.get('label')} · EAN Identität via dm-Katalog"
            if country and country != "DE":
                hit["url"] = shop_hint
                hit["appLink"] = shop_hint
            return [ensure_product_price_str(hit)], "EAN: dm Live-Katalog (inkl. Produktbild & Details)", shop_hint

    # 2b) Müller Direktsuche (hochauflösendes Produktbild & Preis im Müller Sortiment!)
    mueller_hit = fetch_mueller_ean(raw, country)
    if mueller_hit:
        return [mueller_hit], "EAN: Müller Sortiment (inkl. Produktbild & Details)", shop_hint

    # 2c) Pilot CSV
    hit = search_pilot_ean(raw)
    if hit:
        hit["country"] = country
        hit["countries"] = [country] if country else []
        if country and country != "DE":
            hit["url"] = shop_hint
            hit["appLink"] = shop_hint
            hit["retailerLabel"] = f"{meta.get('label')} · Identity via Pilot-CSV (kein lokaler Bestand)"
        return [ensure_product_price_str(hit)], "EAN: dm Pilot-CSV", shop_hint

    # 3) OBF & OFF barcode (world - check both raw and 12/13-digit padded/stripped)
    hit = search_obf_barcode(raw)
    if not hit and len(raw) == 12:
        hit = search_obf_barcode("0" + raw)
    if not hit and len(raw) == 13 and raw.startswith("0"):
        hit = search_obf_barcode(raw[1:])
    if not hit:
        hit = search_off_barcode(raw)
        if not hit and len(raw) == 12:
            hit = search_off_barcode("0" + raw)
        if not hit and len(raw) == 13 and raw.startswith("0"):
            hit = search_off_barcode(raw[1:])
    if hit:
        hit["country"] = country
        hit["countries"] = [country] if country else []
        hit["url"] = shop_hint
        hit["appLink"] = shop_hint
        source_name = hit.get("retailerLabel") or "Open Beauty Facts"
        hit["retailerLabel"] = f"{meta.get('label')} · Identity via {source_name}"
        return [ensure_product_price_str(hit)], f"EAN: {source_name} (Barcode)", shop_hint

    # 4) dm MCP exact GTIN (auch für AT u.a. — ehrlich als DE-Identity)
    hit = mcp_exact_gtin(raw, meta)
    if hit:
        return [ensure_product_price_str(hit)], (
            "EAN: dm MCP Identity (DE-Katalog). "
            "Kein lokaler Lager-/Preisbestand für dieses Land — Shop-Link prüfen."
        ), shop_hint

    # 5) Web via jina/DDG/BarcodeLookup (+ optional MCP-Enrichment)
    hit = resolve_ean_web(raw, meta)
    if hit:
        note5 = "EAN: Web-Auflösung (kein Lagerbestand)"
        if hit.get("source") == "dm_mcp_identity":
            note5 = (
                "EAN: Web + dm MCP Identity (DE-Katalog). "
                "Kein lokaler Lager-/Preisbestand für dieses Land — Shop-Link prüfen."
            )
        return [ensure_product_price_str(hit)], note5, shop_hint

    # 6) Nichts gefunden — leere products, Deeplink nur als Meta-Hinweis
    return [], (
        f"EAN {raw} nicht gefunden (Katalog, Müller, dm, Pilot, OBF, dm MCP, Web). "
        "Kein Fake-Treffer — Shop-Suche optional über meta.shopSearchUrl."
    ), shop_hint


def live_search(query: str, country: str, page_size: int) -> dict:
    page_size = max(1, min(int(page_size or DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE))
    q = (query or "").strip()
    cc = (country or "AT").strip().upper() or "AT"
    meta = retailer_for_country(cc)
    products: list = []
    note = ""
    shop_hint = None

    if not q:
        return {"products": [], "meta": {"country": cc, "retailer": meta, "note": "leere Suche"}}

    # --- EAN/GTIN Pfad: Identity vor alleinigem Deeplink ---
    if EAN_RE.match(q):
        products, note, shop_hint = resolve_ean_identity(q, cc, meta)
        products = [ensure_product_price_str(p) for p in products]
        out_meta = {
            "country": cc,
            "retailer": meta,
            "note": note,
            "honest": True,
            "dmMcpUsed": any(p.get("source") == "dm_mcp_identity" for p in products) or (cc == "DE" and bool(products)),
            "eanQuery": True,
        }
        if shop_hint:
            out_meta["shopSearchUrl"] = shop_hint
        if not products:
            out_meta["notFound"] = True
        return {"products": products[:page_size], "meta": out_meta}

    is_bipa_q = bool(re.search(r"\b(bi\s*good|bigood|bi\s*care|bicare|babywell|look\s*by\s*bipa|today|today\s*sun|bipa)\b", q, re.IGNORECASE))
    is_mueller_q = bool(re.search(r"\b(cv|cadeavera|terra\s*naturi|beauty\s*baby|aveo|aiko|duchesse|barfuss|sensisana|müller|mueller)\b", q, re.IGNORECASE))

    if cc == "DE" and meta.get("mode") == "mcp":
        # Only Germany uses dm MCP — never reuse for other countries as local stock
        try:
            products = search_dm(q, page_size)
            for p in products:
                p["source"] = "dm_mcp"
                p["retailerLabel"] = "dm Deutschland"
                p["country"] = "DE"
                p["deeplinkOnly"] = False
                ensure_product_price_str(p)
            note = "Live-API: dm MCP (Deutschland)"
        except Exception as exc:
            note = f"MCP fehlgeschlagen, Fallback: {exc}"
            products = search_pilot_csv(q)[:page_size]
            for p in products:
                p["source"] = "dm_pilot"
                p["retailerLabel"] = "dm Pilot-CSV (DE)"
                p["deeplinkOnly"] = False
                ensure_product_price_str(p)

        # Müller DE Deep-Link Karte ergänzen
        m_card = mueller_deeplink_card(q, "DE")
        if is_mueller_q:
            products.insert(0, ensure_product_price_str(m_card))
        else:
            products.append(ensure_product_price_str(m_card))
    elif cc == "AT":
        # Österreich: dm.at, bipa.at und mueller.at vollwertig hinterlegen
        dm_card = ensure_product_price_str(deeplink_card(q, meta))
        b_card = ensure_product_price_str(bipa_deeplink_card(q, "AT"))
        m_card = ensure_product_price_str(mueller_deeplink_card(q, "AT"))
        if is_bipa_q:
            products.append(b_card)
            products.append(dm_card)
            products.append(m_card)
        elif is_mueller_q:
            products.append(m_card)
            products.append(dm_card)
            products.append(b_card)
        else:
            products.append(dm_card)
            products.append(b_card)
            products.append(m_card)
        # Direkte Produktsuche bei dmtech für echte Produktkarten mit Bild
        dmtech_prods = fetch_dmtech_search(q, page_size)
        if dmtech_prods:
            for p in dmtech_prods:
                p["country"] = "AT"
                p["countries"] = ["AT"]
                p["retailerLabel"] = "dm Österreich"
                ensure_product_price_str(p)
            if is_bipa_q:
                products = [b_card] + dmtech_prods + [p for p in products if p.get("id") != b_card.get("id")]
            elif is_mueller_q:
                products = [m_card] + dmtech_prods + [p for p in products if p.get("id") != m_card.get("id")]
            else:
                products = dmtech_prods + products
        note = (
            "Österreich Live-Suche: dm Sortiment (Live-Treffer) + "
            "dm.at, bipa.at & mueller.at (Onlineshop-Suche)."
        )
        obf = search_obf(q, cc, max(1, page_size - 3))
        products.extend(obf)
    elif cc == "CH" or meta.get("primary") == "mueller":
        # Schweiz: Müller Schweiz als primäre Drogerie
        m_card = ensure_product_price_str(mueller_deeplink_card(q, "CH"))
        products.append(m_card)
        note = "Schweiz Live-Suche: mueller.ch (Deep-Link) + Open Beauty Facts (Länderfilter CH)."
        obf = search_obf(q, cc, max(1, page_size - 1))
        products.extend(obf)
    else:
        # Honest path: deeplink card + OBF filtered by country when possible
        products.append(ensure_product_price_str(deeplink_card(q, meta)))
        if meta.get("primary") == "dm":
            note = (
                f"{meta.get('label')}: kein lokales Produkt-API in dieser Demo. "
                "Deep-Link zum Ländershop + Open Beauty Facts (Länderfilter). "
                "DE-MCP-Treffer werden absichtlich nicht als lokaler Bestand gezeigt."
            )
        else:
            note = (
                f"Kein dm in {cc}. Primär {meta.get('label')} (Deep-Link) + "
                "Open Beauty Facts mit Länderfilter."
            )
            if meta.get("note"):
                note += " " + str(meta["note"])
        obf = search_obf(q, cc, max(1, page_size - 1))
        products.extend(obf)

    products = [ensure_product_price_str(p) for p in products]
    return {
        "products": products[: page_size + 1],
        "meta": {
            "country": cc,
            "retailer": meta,
            "note": note,
            "honest": True,
            "dmMcpUsed": cc == "DE",
        },
    }
# ===== END country-aware live search =====



class Handler(BaseHTTPRequestHandler):
    server_version = "Kosmetikschrank/0.1"
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path or "/"
        if path == "/api/live-search":
            self._handle_live_search(parsed.query)
            return
        if path == "/api/dm-search":
            self._handle_dm_search(parsed.query)
            return
        if path == "/":
            demo = BASE_DIR / "demo.html"
            if demo.is_file():
                self.send_response(302)
                self.send_header("Location", "/demo.html")
                self._cors()
                self.send_header("Content-Length", "0")
                self.end_headers()
                return
        self._serve_static(path)


    def _handle_live_search(self, query_string: str) -> None:
        qs = parse_qs(query_string, keep_blank_values=True)
        query = (qs.get("query") or qs.get("q") or [""])[0]
        country = (qs.get("country") or qs.get("cc") or ["AT"])[0]
        try:
            page_size = int((qs.get("pageSize") or [str(DEFAULT_PAGE_SIZE)])[0] or DEFAULT_PAGE_SIZE)
        except ValueError:
            page_size = DEFAULT_PAGE_SIZE
        result = live_search(query, country, page_size)
        payload = json.dumps(result, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._cors()
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _handle_dm_search(self, query_string: str) -> None:
        qs = parse_qs(query_string, keep_blank_values=True)
        qs = dict(qs)
        if "country" not in qs:
            qs["country"] = ["DE"]
        from urllib.parse import urlencode
        flat = []
        for k, vals in qs.items():
            for v in vals:
                flat.append((k, v))
        self._handle_live_search(urlencode(flat))


    def _serve_static(self, path: str) -> None:
        target = safe_file(path)
        if target is None:
            self._send_bytes(404, "text/plain; charset=utf-8", b"Not found\n")
            return
        ctype = MIME.get(target.suffix.lower(), "application/octet-stream")
        data = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _send_bytes(self, code: int, ctype: str, body: bytes) -> None:
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self._cors()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Kosmetikschrank local dev server")
    parser.add_argument(
        "--port",
        "-p",
        type=int,
        default=int(os.environ.get("PORT") or DEFAULT_PORT),
        help=f"Port (default {DEFAULT_PORT}, oder PORT=)",
    )
    return parser.parse_args(argv)


def main() -> None:
    args = parse_args(sys.argv[1:])
    host = "127.0.0.1"
    httpd = ThreadingHTTPServer((host, args.port), Handler)
    url = f"http://{host}:{args.port}/demo.html"
    print("")
    print("  Kosmetikschrank — lokaler Dev-Server")
    print(f"  open {url}")
    print(f"  API: http://{host}:{args.port}/api/live-search?query=CeraVe&country=AT&pageSize=12")
    print(f"  Alias DE: http://{host}:{args.port}/api/dm-search?query=CeraVe")
    print("  Stop: Ctrl+C")
    print("")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer beendet.")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
