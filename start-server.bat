@echo off
cd /d "%~dp0"
set "PY312=%LocalAppData%\Programs\Python\Python312\python.exe"
echo.
echo  Kosmetikschrank-Server startet...
echo  Bitte dieses Fenster offen lassen.
echo.
if exist "%PY312%" (
  start "Kosmetikschrank-Server" "%PY312%" "%~dp0server.py"
) else if exist "%LocalAppData%\Programs\Python\Python313\python.exe" (
  start "Kosmetikschrank-Server" "%LocalAppData%\Programs\Python\Python313\python.exe" "%~dp0server.py"
) else (
  start "Kosmetikschrank-Server" py -3 "%~dp0server.py"
)
echo Warte 3 Sekunden...
ping -n 4 127.0.0.1 >nul
echo Oeffne Browser...
start "" "http://127.0.0.1:8787/demo.html"
echo.
echo Wenn die Seite leer ist: in 5 Sek. nochmal F5.
echo Die iPhone-Adresse steht im Fenster "Kosmetikschrank-Server".
echo Nur dieses WLAN. Das Repo bleibt privat.
echo Zum Stoppen: Fenster "Kosmetikschrank-Server" schliessen.
echo.
pause
