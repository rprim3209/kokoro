@echo off
cd /d "%~dp0"
set "PY312=%LocalAppData%\Programs\Python\Python312\python.exe"
echo Starte Kosmetikschrank-Server...
echo Danach Browser: http://127.0.0.1:8787/demo.html
echo Fenster offen lassen. Zum Beenden: Strg+C oder Fenster schliessen.
echo.
if exist "%PY312%" (
  start "" http://127.0.0.1:8787/demo.html
  "%PY312%" server.py %*
  goto :done
)
start "" http://127.0.0.1:8787/demo.html
py -3 server.py %* 2>nul && goto :done
python server.py %*
:done
if errorlevel 1 (
  echo.
  echo Server starten fehlgeschlagen. Python 3 installiert?
  pause
)
