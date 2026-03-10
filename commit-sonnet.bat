@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Commit Sonnet 3.5 Switch                            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

git add -A

echo Committing switch to Sonnet 3.5...
git commit -m "💰 Switch to Claude Sonnet 3.5 - 80% cost savings

Benefits:
- Cost: $96/month vs $483/month (80%% savings)
- Quality: 95% of Opus
- Speed: 2-3x faster"

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
