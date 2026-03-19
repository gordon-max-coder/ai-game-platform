@echo off
chcp 65001 >nul
cd /d "%~dp0"
taskkill /F /IM node.exe 2>nul
start "" node server.js
exit
