@echo off
chcp 65001 >nul
echo ╔══════════════════════════════════════════════════════════╗
echo ║        ✅ 检查 API 配置                                    ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 检查 .env 文件...
if not exist ".env" (
    echo ❌ 错误：未找到 .env 文件
    pause
    exit /b 1
)

echo ✅ .env 文件存在
echo.

echo 当前配置:
echo ────────────────────────────────────────
findstr /R "^API_PROVIDER=" .env
findstr /R "^MODEL=" .env
findstr /R "^PORT=" .env
echo ────────────────────────────────────────
echo.

echo 检查 API Key 配置...
findstr /R "^API_KEY=" .env | findstr "sk-" >nul
if errorlevel 1 (
    echo ❌ 错误：API_KEY 未配置或格式不正确
    pause
    exit /b 1
)
echo ✅ API_KEY 已配置

echo.
echo 检查阿里云 API Key...
findstr /R "^API_KEY_ALIYUN=" .env | findstr "sk-" >nul
if errorlevel 1 (
    echo ⚠️  API_KEY_ALIYUN 未配置 (使用阿里云时需要)
) else (
    echo ✅ API_KEY_ALIYUN 已配置
)

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        ✅ 配置检查完成                                    ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo 启动服务器：start-server.bat
echo 切换厂商：switch-api-provider.bat
echo.
pause
