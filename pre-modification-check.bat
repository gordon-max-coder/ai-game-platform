@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Pre-Modification Feature Check                      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo Checking existing features before modification...
echo.

set ERRORS=0

REM Check inspiration button
echo [1/6] Checking inspiration button...
findstr /C:"btn-inspire" create.html >nul
if %errorlevel% equ 0 (
    echo   ✓ Inspiration button exists
) else (
    echo   ✗ MISSING: Inspiration button
    set /a ERRORS+=1
)

REM Check inspiration.js script
echo [2/6] Checking inspiration.js...
findstr /C:"inspiration.js" create.html >nul
if %errorlevel% equ 0 (
    echo   ✓ inspiration.js is included
) else (
    echo   ✗ MISSING: inspiration.js script reference
    set /a ERRORS+=1
)

REM Check code button
echo [3/6] Checking code button...
findstr /C:"codeBtn" create.html >nul
if %errorlevel% equ 0 (
    echo   ✓ Code button exists
) else (
    echo   ✗ MISSING: Code button
    set /a ERRORS+=1
)

REM Check show-code.js script
echo [4/6] Checking show-code.js...
findstr /C:"show-code.js" create.html >nul
if %errorlevel% equ 0 (
    echo   ✓ show-code.js is included
) else (
    echo   ✗ MISSING: show-code.js script reference
    set /a ERRORS+=1
)

REM Check code modal
echo [5/6] Checking code modal...
findstr /C:"codeModal" create.html >nul
if %errorlevel% equ 0 (
    echo   ✓ Code modal exists
) else (
    echo   ✗ MISSING: Code modal HTML
    set /a ERRORS+=1
)

REM Check CSS styles
echo [6/6] Checking CSS styles...
findstr /C:"btn-inspire" css\create-layout.css >nul
if %errorlevel% equ 0 (
    echo   ✓ Inspiration button styles exist
) else (
    echo   ✗ MISSING: Inspiration button CSS
    set /a ERRORS+=1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo.

if %ERRORS% equ 0 (
    echo ✅ All features are present!
    echo.
    echo Safe to proceed with modifications.
) else (
    echo ⚠️  WARNING: %ERRORS% feature(s) missing!
    echo.
    echo DO NOT modify files until these are fixed!
    echo.
    echo Run: check-all-features.bat to see details
)

echo.
pause
