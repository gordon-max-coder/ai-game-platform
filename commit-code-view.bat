@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Commit Code View Feature                            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Adding files...
git add -A

echo.
echo Committing...
git commit -m "✨ Add code view button with copy and download features

Features:
- Add code view button in preview section
- Modal with full code display
- Copy to clipboard functionality
- Download as HTML file
- UTF-8 encoding protection

Files modified:
- create.html (button and modal HTML)
- create-layout.css (modal styles)
- js/create-new.js (event listener)
- js/show-code.js (new file - modal logic)

All files saved with UTF-8 encoding to prevent corruption."

if %errorlevel% equ 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║  ✅ Commit successful!                                   ║
    echo ╚══════════════════════════════════════════════════════════╝
) else (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║  ℹ️  No changes or commit failed                        ║
    echo ╚══════════════════════════════════════════════════════════╝
)

echo.
echo Latest commits:
git log --oneline -3

echo.
pause
