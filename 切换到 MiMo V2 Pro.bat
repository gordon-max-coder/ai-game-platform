@echo off
chcp 65001 >nul
echo ========================================
echo 🔄 切换到 OpenRouter MiMo V2 Pro
echo ========================================
echo.
echo 正在更新配置...
echo.

cd /d "%~dp0"

REM 备份当前配置
if exist .env.bak (
    del .env.bak
)
copy .env .env.bak >nul

REM 更新 .env 文件
echo 更新 .env 文件...
(
    for /f "delims=" %%a in ('findstr /v "^API_PROVIDER=" .env') do echo %%a
    echo API_PROVIDER=openrouter
    for /f "delims=" %%a in ('findstr /v "^MODEL=" .env ^| findstr /v "^API_PROVIDER="') do echo %%a
    echo MODEL=xiaomi/mimo-v2-pro
) > .env.tmp

move /y .env.tmp .env >nul

echo.
echo ✅ 配置已更新
echo.
echo 当前配置:
findstr "^API_PROVIDER=" .env
findstr "^MODEL=" .env
echo.
echo ========================================
echo ⚠️  重要：需要重启服务器才能生效！
echo ========================================
echo.
echo 是否现在重启服务器？(Y/N)
set /p choice=
if /i "%choice%"=="Y" (
    echo.
    echo 正在重启服务器...
    call 重启服务器.bat
) else (
    echo.
    echo 请手动运行：重启服务器.bat
)

pause
