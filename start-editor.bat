@echo off
cd /d "%~dp0"

echo Starting Godot Web Editor Backend...
start "Godot Editor" cmd /k "cd godot-web-editor && npm start"

timeout /t 3 /nobreak >nul

echo Starting AI Game Platform Backend...
start "AI Platform" cmd /k "cd backend && python server.py"

timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Services started successfully!
echo.
echo AI Game Platform: http://localhost:8000
echo Godot Editor:     http://localhost:3000
echo.
echo Click Editor button to open Godot Editor
echo ========================================
echo.

start http://localhost:8000
