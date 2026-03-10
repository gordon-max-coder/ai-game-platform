@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking for duplicate codeBtn...
findstr /N /C:"codeBtn" create.html

echo.
echo Done!
pause
