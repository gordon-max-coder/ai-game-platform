@echo off
chcp 65001 >nul
cd /d "%~dp0"
node create-showcode.js
if errorlevel 1 (
    echo Error creating file
) else (
    echo Success!
)
pause
