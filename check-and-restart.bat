@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Check & Restart Server                              ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Current .env configuration:
findstr /C:"MODEL=" .env
findstr /C:"API_KEY=" .env | findstr /V "sk_"
echo API_KEY=sk_*** (hidden)

echo.
echo Stopping old server...
taskkill /F /IM node.exe 2>nul
if %errorlevel% neq 0 (
    echo No running server found
)
timeout /t 2 /nobreak >nul

echo.
echo Starting server with new configuration...
start "GameAI Server" node server.js

echo.
echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo.
echo Checking server status...
curl -s http://localhost:3000/api/health | findstr "model"

echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo ⚠️  IMPORTANT: Check your API provider dashboard
echo.
echo If you still see Claude Opus calls:
echo 1. The model name might be wrong
echo 2. Your API provider might not support Llama 4
echo 3. The API key might be for Claude only
echo.
echo Possible solutions:
echo A. Check available models at api.jiekou.ai
echo B. Try different model name (e.g., llama-3.1-70b)
echo C. Use a different API provider (Groq, Together AI)
echo.

pause
