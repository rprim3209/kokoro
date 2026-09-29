import importlib.util
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
spec=importlib.util.spec_from_file_location('kokoro_api',Path(__file__).parents[1]/'api.py')
api=importlib.util.module_from_spec(spec);spec.loader.exec_module(api)
@pytest.fixture
def client():
    api.LIMITERS.clear();api.CACHE.clear()
    with TestClient(api.app) as c:yield c

def test_public_assets_and_head(client):
    assert client.get('/',follow_redirects=False).headers['location']=='/index.html'
    assert 'js/app.js' in client.get('/index.html').text
    assert client.get('/demo.html').status_code==404
    assert client.get('/data/katalog-produkte.csv').status_code==200
    assert client.get('/data/dm-pilot-produkte.csv').status_code==200
    assert client.get('/docs/archive/README.md').status_code==404
    assert client.head('/index.html').status_code==200
    assert client.get('/js/evidence-engine.js').status_code==200

def test_private_files_not_served(client):
    for path in ['/api.py','/server.py','/.git/config','/requirements.txt','/tests/test_api.py','/js/../../api.py','/js/%2e%2e/api.py']:
        assert client.get(path).status_code==404

def test_headers_no_wildcard_cors(client):
    r=client.get('/demo.html');assert r.headers['X-Content-Type-Options']=='nosniff'
    assert "frame-ancestors 'none'" in r.headers['Content-Security-Policy']
    assert 'Access-Control-Allow-Origin' not in r.headers

def test_bounded_search(client):
    for query in ['query='+'a'*121,'query=test&pageSize=200','query=test&country=XX']:
        assert client.get('/api/live-search?'+query).status_code==422
    r=client.get('/api/live-search',params={'query':'Balea','country':'DE','pageSize':2})
    assert r.status_code==200;assert len(r.json()['products'])<=2
    assert 'nicht live geprüft' in r.json()['meta']['note']

def test_sensitive_query_not_reflected_in_errors(client):
    r=client.get('/api/live-search',params={'query':'\x01secret'})
    assert r.status_code==422;assert 'secret' not in r.text

def test_host_validation(client):assert client.get('/demo.html',headers={'Host':'evil.example'}).status_code==400

def test_display_data_is_plain_text():
    assert '<' not in api.text('<img onerror="alert(1)">')
    assert api.url('javascript:alert(1)')==''
    assert api.url('https://user:pass@example.org')==''

def test_rate_limit(client):
    for _ in range(60):assert client.get('/api/health').status_code==200
    assert client.get('/api/health').status_code==429
