@echo off
chcp 65001 >nul
findstr /C:"codeBtn" create.html
findstr /C:"codeModal" create.html
findstr /C:"show-code.js" create.html
echo.
echo Verification complete!
pause
