@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking for inspiration button...
findstr /C:"inspire" create.html
findstr /C:"灵感" create.html

echo.
echo Done!
pause
