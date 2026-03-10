@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Switch to Llama 4 Maverick Instruct                 ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Current configuration:
findstr /C:"MODEL=" .env
findstr /C:"API_KEY=" .env

echo.
echo ⚠️  IMPORTANT: Llama 4 Maverick Instruct availability
echo.
echo This model may require:
echo 1. A different API endpoint (e.g., Groq, Together AI, Fireworks)
echo 2. A different API key
echo.
echo Current API: api.jiekou.ai (appears to be Claude/GPT focused)
echo.
echo Options:
echo A. If you have a Groq API key for Llama models
echo B. If you have a Together AI API key
echo C. If your current provider supports Llama 4
echo.
set /p choice="Enter your option (A/B/C) or N to cancel: "

if /i "%choice%"=="A" goto GROQ
if /i "%choice%"=="B" goto TOGETHER
if /i "%choice%"=="C" goto CURRENT
if /i "%choice%"=="N" goto END
goto MENU

:GROQ
echo.
echo Groq API configuration:
set /p GROQ_KEY="Enter your Groq API key: "

echo.
echo Updating .env for Groq...
(
echo # GameAI Server Configuration
echo API_KEY=%GROQ_KEY%
echo MODEL=llama-3.1-70b-versatile
echo API_BASE_URL=https://api.groq.com/openai/v1
echo PORT=3000
echo API_TIMEOUT=300000
) > .env

echo ✅ Switched to Groq with Llama 3.1 70B
goto RESTART

:TOGETHER
echo.
echo Together AI configuration:
set /p TOGETHER_KEY="Enter your Together AI API key: "

echo.
echo Updating .env for Together AI...
(
echo # GameAI Server Configuration
echo API_KEY=%TOGETHER_KEY%
echo MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo
echo API_BASE_URL=https://api.together.xyz/v1
echo PORT=3000
echo API_TIMEOUT=300000
) > .env

echo ✅ Switched to Together AI with Llama 3.3 70B
goto RESTART

:CURRENT
echo.
echo Trying with current provider...
set /p CUSTOM_MODEL="Enter exact model name (e.g., llama-4-maverick-instruct): "

echo.
echo Updating .env...
(
echo # GameAI Server Configuration
echo API_KEY=sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8
echo MODEL=%CUSTOM_MODEL%
echo PORT=3000
echo API_TIMEOUT=300000
) > .env

echo ✅ Model updated to: %CUSTOM_MODEL%
goto RESTART

:RESTART
echo.
echo Restarting server...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

powershell -WindowStyle Hidden -Command "Start-Process node -ArgumentList 'server.js' -WorkingDirectory '%~dp0' -WindowStyle Hidden"

timeout /t 3 /nobreak >nul

echo.
echo Verifying...
curl -s http://localhost:3000/api/health | findstr "model"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  ✅ Server restarted with new model!                    ║
echo ╚══════════════════════════════════════════════════════════╝
goto END

:MENU
echo.
echo Invalid option.
goto END

:END
echo.
pause
