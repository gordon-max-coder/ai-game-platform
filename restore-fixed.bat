@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Restoring create.html from fixed version...
copy /Y create-fixed.html create.html

echo.
echo Checking restored file:
type create.html | findstr "title"

echo.
echo Cleaning up...
del create-fixed.html

echo.
echo Done!
pause
