@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking inspiration event binding...
echo.

echo [1] Check if inspireBtn exists in HTML:
findstr /C:"inspireBtn" create.html

echo.
echo [2] Check if inspiration.js is included:
findstr /C:"inspiration.js" create.html

echo.
echo [3] Check if create-new.js has event listener:
findstr /C:"inspire" js\create-new.js

echo.
echo [4] Check inspiration.js init function:
findstr /C:"init" js\inspiration.js

echo.
echo Done!
pause
