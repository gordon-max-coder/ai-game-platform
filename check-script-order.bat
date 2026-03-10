@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Checking script order in create.html...
findstr /C:"script src" create.html | findstr /C:".js"
echo.
echo Done!
pause
