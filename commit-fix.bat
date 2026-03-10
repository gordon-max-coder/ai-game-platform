@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Fix: Remove duplicate code button                   ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Adding files...
git add -A

echo.
echo Committing...
git commit -m "🐛 fix: Remove duplicate code button

Bug: Two code buttons appeared in preview section
Fix: Removed duplicate button, kept only one

Files modified:
- create.html (removed duplicate codeBtn)"

if %errorlevel% equ 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║  ✅ Fix committed!                                       ║
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
