@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Checking for code-modal styles...
findstr /C:"code-modal" css\create-layout.css
if errorlevel 1 (
    echo.
    echo Code modal styles NOT found - need to add them
) else (
    echo.
    echo Code modal styles already exist
)
pause
