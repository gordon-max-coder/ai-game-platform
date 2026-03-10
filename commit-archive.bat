@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Commit Code Archive System                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

git add -A

echo Committing code archive and fixes...
git commit -m "📚 Add code archive system to prevent feature loss

Features:
- Complete code archive (CODE-ARCHIVE.md)
- Pre-modification check script
- Restored inspiration.js and CSS
- Automated feature verification

This ensures no features will be lost in future modifications."

if %errorlevel% equ 0 (
    echo.
    echo ✅ Committed!
) else (
    echo.
    echo ℹ No changes or already committed
)

echo.
git log --oneline -3

pause
