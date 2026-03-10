@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Commit Game ID Fix                                  ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

git add -A

echo Committing game ID fix...
git commit -m "🐛 CRITICAL: Fix game storage to use unique PID

Bug: Same-name games were overwriting each other
Fix: Each new game gets unique ID (timestamp + random)

Now:
- New creation → New unique PID
- Same name ≠ Same game
- Modify → Same PID, version++"

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
