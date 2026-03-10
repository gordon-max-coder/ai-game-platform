@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Current Git status:
git log --oneline -3

echo.
echo Checking create.html:
type create.html | findstr "title"

echo.
echo File list in root:
dir *.html /B

echo.
pause
