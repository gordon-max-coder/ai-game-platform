@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ╔══════════════════════════════════════════════════════════╗
echo ║        🔙 Rollback create.html                           ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Current version (with encoding issues):
powershell -Command "Get-Content 'create.html' -TotalCount 10" | findstr "title"

echo.
echo Rolling back to commit 830d364 (before encoding issues)...
git checkout 830d364^ -- create.html

echo.
echo Checking rolled back version:
powershell -Command "Get-Content 'create.html' -TotalCount 10" | findstr "title"

echo.
echo Done!
pause
