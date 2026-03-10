@echo off
chcp 65001 >nul
cd /d "%~dp0"
node fix-game-id-bug.js
pause
