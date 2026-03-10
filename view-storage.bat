@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Full game-storage.js content:
type js\game-storage.js

pause
