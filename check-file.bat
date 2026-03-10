@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking create.html encoding...
powershell -Command "Get-Content 'create.html' -Head 5"

echo.
echo Git status:
git status --short create.html

echo.
echo Last 3 commits:
git log --oneline -3

echo.
pause
