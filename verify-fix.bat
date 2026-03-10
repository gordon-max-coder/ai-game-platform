@echo off
chcp 65001 >nul
echo Verifying codeBtn count...
findstr /C:"codeBtn" create.html | find /C /V ""
echo.
echo Done!
pause
