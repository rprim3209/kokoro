@echo off
cd /d "%~dp0"
set "PY312=%LocalAppData%\Programs\Python\Python312\python.exe"
if exist "%PY312%" (
  "%PY312%" server.py %*
  goto :done
)
py -3 server.py %* 2>nul && goto :done
python server.py %*
:done
if errorlevel 1 (
  echo.
  echo Python starten fehlgeschlagen. Ist Python 3 installiert?
  pause
)
