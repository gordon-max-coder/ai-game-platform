@echo off
echo Stopping Node.js processes...
taskkill /F /IM node.exe 2>nul
if errorlevel 1 (
    echo No Node.js processes found
) else (
    echo Node.js processes stopped
)
timeout /t 2 /nobreak >nul

echo Starting server...
cd /d "%~dp0"
start "" node server.js
timeout /t 3 /nobreak >nul

echo.
echo Server started!
echo Access: http://localhost:3000
echo.
pause
