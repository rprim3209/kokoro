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
from urllib.parse import parse_qs, unquote, urlparse
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
        "price": {"formattedValue": row.get("price") or ""},
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
        "price": {"formattedValue": row.get("price") or ""},
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

    def _handle_dm_search(self, query_string: str) -> None:
        qs = parse_qs(query_string, keep_blank_values=True)
        query = (qs.get("query") or qs.get("q") or [""])[0]
        try:
            page_size = int((qs.get("pageSize") or [str(DEFAULT_PAGE_SIZE)])[0] or DEFAULT_PAGE_SIZE)
        except ValueError:
            page_size = DEFAULT_PAGE_SIZE
        products = search_dm(query, page_size)
        payload = json.dumps({"products": products}, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._cors()
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

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
    print(f"  API: http://{host}:{args.port}/api/dm-search?query=CeraVe&pageSize=12")
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
