# ==========================================
# Kosmetikschrank - Lokaler Entwicklungs-Server
# Keine Installation noetig (nutzt natives Windows .NET HttpListener)
# ==========================================

$port = 8000
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
  Write-Host "==========================================================" -ForegroundColor Green
  Write-Host "  Kosmetikschrank Server laeuft auf:" -ForegroundColor Green
  Write-Host "  $prefix" -ForegroundColor Cyan
  Write-Host "  (Live CSV-Laden & Kamera-Barcode-Scanner aktiv)" -ForegroundColor Green
  Write-Host "  Beenden mit Strg + C" -ForegroundColor Yellow
  Write-Host "==========================================================" -ForegroundColor Green

  # Browser automatisch oeffnen
  if ($env:NO_BROWSER -ne "1") {
    Start-Process $prefix
  }

  while ($listener.IsListening) {
    try {
      $context = $listener.GetContext()
      $request = $context.Request
      $response = $context.Response

      $rawPath = $request.Url.AbsolutePath
      if ($rawPath -eq "/" -or $rawPath -eq "") {
        if (Test-Path (Join-Path $root "index.html")) {
          $rawPath = "/index.html"
        } else {
          $rawPath = "/demo.html"
        }
      }

      # Live-dm Proxy API Endpoint (Echtzeit-Produktsuche & EAN-Abfrage)
      if ($rawPath -eq "/api/dm-search") {
        $q = $request.QueryString["query"]
        $pageSize = $request.QueryString["pageSize"]
        if (-not $pageSize) { $pageSize = "12" }
        $cacheKey = "$q|$pageSize".ToLower().Trim()
        
        if ($global:dmCache -and $global:dmCache.ContainsKey($cacheKey)) {
          $dmJson = $global:dmCache[$cacheKey]
          $response.ContentType = "application/json; charset=utf-8"
          $response.Headers.Add("Access-Control-Allow-Origin", "*")
          $response.Headers.Add("Cache-Control", "max-age=300")
          $bytes = [System.Text.Encoding]::UTF8.GetBytes($dmJson)
          $response.ContentLength64 = $bytes.Length
          $response.OutputStream.Write($bytes, 0, $bytes.Length)
          $response.Close()
          Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 200 OK (Cache): Live-dm search: $q" -ForegroundColor Cyan
          continue
        }
        
        $dmUrl = "https://product-search.services.dmtech.com/de/search?query=" + [System.Uri]::EscapeDataString($q) + "&pageSize=" + $pageSize
        try {
          $dmReq = [System.Net.HttpWebRequest]::Create($dmUrl)
          $dmReq.Method = "GET"
          $dmReq.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          $dmReq.Accept = "application/json"
          $dmReq.Timeout = 8000
          
          $dmResp = $dmReq.GetResponse()
          $dmStream = $dmResp.GetResponseStream()
          $dmReader = New-Object System.IO.StreamReader($dmStream, [System.Text.Encoding]::UTF8)
          $dmJson = $dmReader.ReadToEnd()
          $dmResp.Close()
          
          if (-not $global:dmCache) { $global:dmCache = @{} }
          $global:dmCache[$cacheKey] = $dmJson
          
          $response.ContentType = "application/json; charset=utf-8"
          $response.Headers.Add("Access-Control-Allow-Origin", "*")
          $response.Headers.Add("Cache-Control", "no-cache")
          $bytes = [System.Text.Encoding]::UTF8.GetBytes($dmJson)
          $response.ContentLength64 = $bytes.Length
          $response.OutputStream.Write($bytes, 0, $bytes.Length)
          $response.Close()
          Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 200 OK: Live-dm search: $q" -ForegroundColor Green
          continue
        } catch {
          $response.StatusCode = 502
          $response.ContentType = "application/json; charset=utf-8"
          $response.Headers.Add("Access-Control-Allow-Origin", "*")
          $escapedMsg = $_.Exception.Message.Replace('"', '\"')
          $errJson = "{`"error`": `"dm_proxy_failed`", `"message`": `"$escapedMsg`"}"
          $bytes = [System.Text.Encoding]::UTF8.GetBytes($errJson)
          $response.ContentLength64 = $bytes.Length
          $response.OutputStream.Write($bytes, 0, $bytes.Length)
          $response.Close()
          Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 502 Error: Live-dm proxy: $($_.Exception.Message)" -ForegroundColor Red
          continue
        }
      }

      # URL decode
      $relPath = [System.Uri]::UnescapeDataString($rawPath.TrimStart('/'))
      $filePath = Join-Path $root $relPath

      if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = switch ($ext) {
          ".html" { "text/html; charset=utf-8" }
          ".htm"  { "text/html; charset=utf-8" }
          ".csv"  { "text/csv; charset=utf-8" }
          ".js"   { "application/javascript; charset=utf-8" }
          ".json" { "application/json; charset=utf-8" }
          ".css"  { "text/css; charset=utf-8" }
          ".png"  { "image/png" }
          ".jpg"  { "image/jpeg" }
          ".svg"  { "image/svg+xml" }
          default { "application/octet-stream" }
        }

        $response.ContentType = $contentType
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Cache-Control", "no-cache")

        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 200 OK: $rawPath ($contentType)" -ForegroundColor Gray
      } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawPath")
        $response.ContentLength64 = $msg.Length
        $response.OutputStream.Write($msg, 0, $msg.Length)
        Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 404 Not Found: $rawPath" -ForegroundColor Red
      }

      $response.OutputStream.Close()
    } catch {
      Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] Client abgebrochen/Fehler: $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
  }
} catch {
  Write-Host "Server beendet: $($_.Exception.Message)" -ForegroundColor Yellow
} finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}
