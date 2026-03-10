@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Checking currentGameCode in create-new.js...
findstr /C:"currentGameCode" js\create-new.js | findstr /V "let currentGameCode"
echo.
echo Done!
pause
