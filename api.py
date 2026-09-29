"""KoKoRo ASGI app: explicit public files, bounded catalog search, no account data."""
from __future__ import annotations
import asyncio
import csv
import hashlib
import json
import os
import re
import time
from collections import OrderedDict, deque
from contextlib import asynccontextmanager
from pathlib import Path
from urllib.parse import urlparse
import httpx
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware

ROOT = Path(__file__).resolve().parent
LIVE = os.getenv('KOKORO_LIVE_SEARCH', '1') == '1'
COUNTRIES = {'DE','AT','CH','FR','IT','ES','PT','NL','BE','SE','DK','FI','IE','GR','EE','LV','LT','LU','MT','CY','NO','IS','PL','CZ','SK','HU','SI','HR','RO','BG'}
PUBLIC_FILES = {'index.html','manifest.webmanifest','data/katalog-produkte.csv','data/dm-pilot-produkte.csv'}
PUBLIC_DIRS = {'js':{'.js'},'css':{'.css'},'icons':{'.png','.svg','.ico'}}
LIMITERS: OrderedDict[str, deque] = OrderedDict()
CACHE: OrderedDict[tuple, tuple] = OrderedDict()
SEARCH_SLOTS = asyncio.Semaphore(6)

def text(value, limit=500):
    # Data is plain text; legacy templates cannot interpret markup or JS delimiters.
    return str(value or '')[:limit].translate(str.maketrans({'<':'‹','>':'›','"':'”',"'":'’','`':'’','\\':'/'}))

def url(value):
    value=str(value or '')[:1500]
    p=urlparse(value)
    return value if p.scheme=='https' and p.hostname and not p.username and not p.password else ''

def public_file(path):
    if '\\' in path or any(part.startswith('.') for part in Path(path).parts): return None
    target=(ROOT/path).resolve()
    try: target.relative_to(ROOT)
    except ValueError: return None
    parts=Path(path).parts
    permitted=path in PUBLIC_FILES or (len(parts)>1 and parts[0] in PUBLIC_DIRS and target.suffix in PUBLIC_DIRS[parts[0]])
    return target if permitted and target.is_file() else None

def load_catalog():
    rows=[]
    for filename in ['katalog-produkte.csv','dm-pilot-produkte.csv']:
        with (ROOT/'data'/filename).open(encoding='utf-8-sig',newline='') as f:
            for row in csv.DictReader(f):
                name=text(row.get('name'));brand=text(row.get('brand'));ean=re.sub(r'\D','',row.get('ean') or '')[:14]
                if not name: continue
                identity=ean or hashlib.sha256((brand+name).encode()).hexdigest()[:16]
                rows.append({'id':'catalog_'+identity,'title':name,'name':name,'brand':brand,'brandName':brand,'ean':ean,'gtin':ean,'source':'local_catalog','price':'','url':url(row.get('dm_url') or row.get('url')),'countries':[],'store':'Lokaler Katalog · Verfügbarkeit nicht geprüft','deeplinkOnly':False})
    return rows
CATALOG=load_catalog()

@asynccontextmanager
async def lifespan(app):
    async with httpx.AsyncClient(timeout=httpx.Timeout(4.0),follow_redirects=False,limits=httpx.Limits(max_connections=6),headers={'User-Agent':'KoKoRo/1.0 (cosmetics catalog)'}) as client:
        app.state.client=client
        yield

app=FastAPI(title='KoKoRo',version='1.0.0',lifespan=lifespan,docs_url=None,redoc_url=None,openapi_url=None)
app.add_middleware(TrustedHostMiddleware,allowed_hosts=os.getenv('KOKORO_ALLOWED_HOSTS','127.0.0.1,localhost,testserver').split(','))

@app.middleware('http')
async def headers(request:Request,call_next):
    if request.url.path.startswith('/api/'):
        key=request.client.host if request.client else 'unknown';now=time.monotonic()
        bucket=LIMITERS.setdefault(key,deque())
        while bucket and bucket[0]<now-60: bucket.popleft()
        if len(bucket)>=60:
            response=JSONResponse({'detail':'Zu viele Anfragen. Bitte kurz warten.'},429,headers={'Retry-After':'60'})
        else:
            bucket.append(now);LIMITERS.move_to_end(key)
            while len(LIMITERS)>2048: LIMITERS.popitem(last=False)
            response=await call_next(request)
    else: response=await call_next(request)
    response.headers.update({'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Permissions-Policy':'camera=(self), microphone=(), geolocation=()',
      'Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; connect-src 'self'; media-src 'self' blob:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"})
    response.headers['Cache-Control']='no-store' if request.url.path.startswith('/api/') else 'no-cache'
    return response

async def live_barcode(client,ean):
    response=await client.get('https://world.openbeautyfacts.org/api/v2/product/'+ean+'.json')
    response.raise_for_status()
    if len(response.content)>2_000_000: return []
    data=response.json();p=data.get('product') if data.get('status')==1 else None
    if not p:return []
    name=text(p.get('product_name_de') or p.get('product_name'))
    if not name:return []
    return [{'id':'obf_'+ean,'title':name,'brandName':text(p.get('brands')),'ean':ean,'gtin':ean,'source':'obf','countries':[],'price':'','store':'Open Beauty Facts · gemeinschaftlich erfasst','url':'https://world.openbeautyfacts.org/product/'+ean,'img':url(p.get('image_front_url')),'inci':text(p.get('ingredients_text'),8000),'deeplinkOnly':False}]

@app.get('/api/health')
async def health():return {'status':'ok','rules':'evidence-1.0.0','liveSearch':LIVE,'catalog':'unverified-reference-data','publication':'local-review'}

@app.get('/api/phone')
async def phone():return {'https':'','note':'Kamera über localhost oder vertrauenswürdiges HTTPS verwenden.'}

@app.get('/api/live-search')
@app.get('/api/dm-search')
async def search(request:Request,query:str=Query('',max_length=120),country:str=Query('DE',pattern='^[A-Z]{2}$'),pageSize:int=Query(12,ge=1,le=15)):
    if country not in COUNTRIES:raise HTTPException(422,'Land nicht unterstützt')
    q=query.strip()
    if len(q)<2:return {'products':[],'meta':{'note':'Mindestens zwei Zeichen eingeben.','country':country}}
    if any(ord(c)<32 for c in q):raise HTTPException(422,'Ungültige Suchanfrage')
    key=(q.casefold(),country,pageSize);now=time.monotonic()
    if key in CACHE and CACHE[key][0]>now:return CACHE[key][1]
    seen=set();hits=[]
    for p in CATALOG:
        if (q==p['ean'] or q.casefold() in (p['title']+' '+p['brand']).casefold()) and p['id'] not in seen:
            hits.append(p);seen.add(p['id'])
            if len(hits)>=pageSize:break
    note='Lokaler Katalog. Rezeptur, Preis und Verfügbarkeit nicht live geprüft.'
    if not hits and LIVE and re.fullmatch(r'\d{8,14}',q):
        if SEARCH_SLOTS.locked():raise HTTPException(503,'Suche ausgelastet. Bitte erneut versuchen.')
        async with SEARCH_SLOTS:
            try:
                hits=await live_barcode(request.app.state.client,q)
                note='Open Beauty Facts: Produktidentität, keine lokale Verfügbarkeitsbestätigung.'
            except (httpx.HTTPError,ValueError,TypeError):note='Online-Suche nicht erreichbar. Barcode oder Produkt manuell erfassen.'
    elif not hits:note='Kein Katalogtreffer. Produkt manuell erfassen oder den verlinkten Händler öffnen.'
    result={'products':hits[:pageSize],'meta':{'country':country,'source':'catalog_or_obf','note':note,'honest':True,'notFound':not bool(hits)}}
    CACHE[key]=(now+120,result)
    while len(CACHE)>256:CACHE.popitem(last=False)
    return result

@app.api_route('/',methods=['GET','HEAD'])
async def home():return RedirectResponse('/index.html',307)

@app.api_route('/{path:path}',methods=['GET','HEAD'])
async def static(path:str):
    target=public_file(path)
    if not target:raise HTTPException(404,'Nicht gefunden')
    return FileResponse(target)
