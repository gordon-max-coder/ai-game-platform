@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking original create.html from commit e9912dc...
git show e9912dc:create.html | findstr "title"

echo.
echo Checking current create.html...
type create.html | findstr "title"

echo.
echo Restoring from e9912dc...
git checkout e9912dc -- create.html

echo.
echo After restore:
type create.html | findstr "title"

pause
