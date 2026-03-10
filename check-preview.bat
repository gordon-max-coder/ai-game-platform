@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking create.html...
findstr /C:"preview-actions" create.html

echo.
echo Done!
pause
