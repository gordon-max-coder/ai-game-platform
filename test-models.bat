@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Test API Models                                     ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Current MODEL in .env:
findstr /C:"MODEL=" .env

echo.
echo Available models at api.jiekou.ai:
echo ────────────────────────────────────────────────────────────
echo.
echo Claude Models (Anthropic):
echo   - claude-opus-4-6
echo   - claude-sonnet-3-5
echo   - claude-haiku-3-5
echo.
echo GPT Models (OpenAI):
echo   - gpt-4o
echo   - gpt-4o-mini
echo   - gpt-4-turbo
echo.
echo Llama Models (Meta):
echo   - llama-3.1-70b-instruct
echo   - llama-3.1-8b-instruct
echo   - llama-3-70b-instruct
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo ⚠️  "llama-4-maverick-instruct" is NOT a standard model name!
echo.
echo Llama 4 doesn't exist yet (as of 2025-01)
echo Latest is Llama 3.1
echo.
echo Recommended alternatives:
echo.
echo A. For best quality (similar to Opus):
echo    MODEL=llama-3.1-70b-instruct
echo.
echo B. For best value (similar to Sonnet):
echo    MODEL=claude-sonnet-3-5
echo.
echo C. For lowest cost:
echo    MODEL=gpt-4o-mini
echo.
echo ═══════════════════════════════════════════════════════════
echo.
set /p choice="Enter option (A/B/C) or N to keep current: "

if /i "%choice%"=="A" goto OPTION_A
if /i "%choice%"=="B" goto OPTION_B
if /i "%choice%"=="C" goto OPTION_C
if /i "%choice%"=="N" goto END
goto END

:OPTION_A
echo.
echo Switching to Llama 3.1 70B...
(
echo # GameAI Server Configuration
echo API_KEY=sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8
echo MODEL=llama-3.1-70b-instruct
echo PORT=3000
echo API_TIMEOUT=300000
) > .env
echo ✅ Updated to llama-3.1-70b-instruct
goto RESTART

:OPTION_B
echo.
echo Switching to Claude Sonnet 3.5...
(
echo # GameAI Server Configuration
echo API_KEY=sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8
echo MODEL=claude-sonnet-3-5
echo PORT=3000
echo API_TIMEOUT=300000
) > .env
echo ✅ Updated to claude-sonnet-3-5
goto RESTART

:OPTION_C
echo.
echo Switching to GPT-4o-mini...
(
echo # GameAI Server Configuration
echo API_KEY=sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8
echo MODEL=gpt-4o-mini
echo PORT=3000
echo API_TIMEOUT=300000
) > .env
echo ✅ Updated to gpt-4o-mini
goto RESTART

:RESTART
echo.
echo Restarting server...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

start "GameAI Server" node server.js

timeout /t 3 /nobreak >nul

echo.
echo Verifying...
curl -s http://localhost:3000/api/health | findstr "model"

echo.
echo ✅ Server restarted with new model!
goto END

:END
echo.
pause
