@echo off
chcp 65001 >nul
cd /d "%~dp0"
node remove-duplicate-btn.js
pause
