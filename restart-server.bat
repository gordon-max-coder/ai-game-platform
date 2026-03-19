@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Stopping old server...
taskkill /F /IM node.exe 2>nul || echo No old server

echo Starting server...
start "" "node" "server.js"

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Checking status...
curl -s http://localhost:3000/api/health

echo.
echo Done!
