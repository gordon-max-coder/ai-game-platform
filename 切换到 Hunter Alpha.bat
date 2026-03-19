@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔄 切换到 OpenRouter Hunter Alpha
echo ========================================
echo.

set ENV_FILE=.env

echo 📝 检查 .env 文件...
if not exist %ENV_FILE% (
    echo ❌ 错误：.env 文件不存在！
    pause
    exit /b 1
)

echo 🔍 当前配置:
findstr /R "^API_PROVIDER=" %ENV_FILE%
findstr /R "^MODEL=" %ENV_FILE%
echo.

echo ⚙️  正在修改配置...

powershell -Command "(Get-Content %ENV_FILE%) -replace '^API_PROVIDER=.*', 'API_PROVIDER=openrouter' | Set-Content %ENV_FILE%.tmp"
powershell -Command "(Get-Content %ENV_FILE%.tmp) -replace '^MODEL=.*', 'MODEL=openrouter/hunter-alpha' | Set-Content %ENV_FILE%"
del %ENV_FILE%.tmp >nul 2>&1

echo.
echo ✅ 配置已更新:
findstr /R "^API_PROVIDER=" %ENV_FILE%
findstr /R "^MODEL=" %ENV_FILE%
echo.

echo ========================================
echo   ⚠️  重要提示
echo ========================================
echo.
echo 1. 配置已保存到 .env 文件
echo 2. 需要重启服务器才能生效
echo 3. 运行 "🔄 重启服务器.bat" 重启
echo.
echo ========================================
echo.

pause
