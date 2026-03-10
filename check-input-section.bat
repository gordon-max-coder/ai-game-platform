@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking input section...
findstr /N /C:"input-wrapper" create.html
findstr /N /C:"btn-send" create.html
findstr /N /C:"btn-inspire" create.html

echo.
echo Done!
pause
