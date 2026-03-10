@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Commit Encoding Protection Files                    ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Adding files...
git add -A

echo.
echo Checking status...
git status --short

echo.
echo Committing...
git commit -m "🔧 Add comprehensive encoding protection system

- Add .gitattributes to enforce UTF-8 encoding
- Add VS Code settings for UTF-8
- Add encoding check and fix tools
- Add safe-edit script for file editing
- Add documentation (ENCODING-GUIDE.md, ENCODING-SOLUTION.md)
- Add Git configuration script

This prevents future encoding issues with Chinese characters."

if %errorlevel% equ 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║  ✅ Commit successful!                                   ║
    echo ╚══════════════════════════════════════════════════════════╝
) else (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║  ⚠️  No changes to commit or commit failed              ║
    echo ╚══════════════════════════════════════════════════════════╝
)

echo.
echo Latest commits:
git log --oneline -3

echo.
pause
