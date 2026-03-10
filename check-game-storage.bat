@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking game storage logic...
echo.

echo [1] Check how games are saved:
findstr /C:"saveGame" js\game-storage.js | findstr /C:"function"

echo.
echo [2] Check how game ID is generated:
findstr /C:"gameId" js\game-storage.js | findstr /C:"generate"

echo.
echo [3] Check if games are stored by name or ID:
findstr /C:"getGame" js\game-storage.js

echo.
echo Done!
pause
