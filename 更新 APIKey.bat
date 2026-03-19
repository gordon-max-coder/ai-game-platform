@echo off
chcp 65001 >nul
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║         📝 更新阿里云 API Key 配置                            ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion

:: 读取当前配置
for /f "tokens=2 delims==" %%a in ('findstr /R "^API_KEY=" .env') do set CURRENT_KEY=%%a
for /f "tokens=2 delims==" %%a in ('findstr /R "^API_KEY_ALIYUN=" .env') do set CURRENT_ALI_KEY=%%a

echo 当前配置:
echo   API_KEY: %CURRENT_KEY:~0,15%...
echo   API_KEY_ALIYUN: %CURRENT_ALI_KEY:~0,15%...
echo.

set /p NEW_KEY="请输入新的阿里云 API Key: "

if "!NEW_KEY!"=="" (
    echo ❌ 输入为空，取消操作
    pause
    exit /b 1
)

:: 更新 .env 文件
powershell -Command "(Get-Content .env) -replace '^API_KEY=.*', 'API_KEY=!NEW_KEY!' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^API_KEY_ALIYUN=.*', 'API_KEY_ALIYUN=!NEW_KEY!' | Set-Content .env"

echo.
echo ✅ API Key 已更新
echo   新 API_KEY: !NEW_KEY:~0,15%...
echo.

echo 正在测试新 API Key...
node test-aliyun-api.js

echo.
echo 按任意键退出...
pause >nul
