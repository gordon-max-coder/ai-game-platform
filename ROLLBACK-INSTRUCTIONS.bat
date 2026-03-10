@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        ⚠️  ENCODING ISSUE - ROLLBACK REQUIRED            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Problem: create.html has encoding issues (Chinese characters corrupted)
echo.
echo Solution: Rollback to commit e9912dc (last known good version)
echo.
echo Current status:
git log --oneline -1

echo.
echo ═══════════════════════════════════════════════════════════
echo  WARNING: This will rollback ALL changes since e9912dc!
echo ═══════════════════════════════════════════════════════════
echo.
echo Do you want to continue? (Y/N)
set /p confirm=

if /i not "%confirm%"=="Y" (
    echo.
    echo Operation cancelled.
    pause
    exit /b 1
)

echo.
echo Rolling back to e9912dc...
git reset --hard e9912dc

echo.
echo Verifying rollback...
type create.html | findstr "title"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  ✅ Rollback complete!                                   ║
echo ║                                                          ║
echo ║  Next steps:                                             ║
echo ║  1. Verify create.html displays correctly               ║
echo ║  2. Re-implement code view feature safely               ║
echo ║  3. Use proper encoding (UTF-8 with BOM)                ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

pause
