@echo off
chcp 65001 >nul
cd /d "%~dp0"
node add-code-feature.js
pause
