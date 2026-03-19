@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Starting server...
node server.js > server-output.log 2>&1
exit
