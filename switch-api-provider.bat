@echo off
chcp 65001 >nul
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🔄 切换 API 厂商配置                               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

:menu
echo 当前配置:
findstr /R "^API_PROVIDER=" .env >nul 2>&1 && findstr "^API_PROVIDER=" .env
findstr /R "^MODEL=" .env >nul 2>&1 && findstr "^MODEL=" .env
echo.
echo 选项:
echo 1. 切换到 jiekou.ai (Claude Sonnet 3.5)
echo 2. 切换到 阿里云百炼 (Qwen Max)
echo 3. 自定义配置
echo 4. 退出
echo.
set /p choice="请选择 (1-4): "

if "%choice%"=="1" goto jiekou
if "%choice%"=="2" goto aliyun
if "%choice%"=="3" goto custom
if "%choice%"=="4" goto end
goto menu

:jiekou
echo.
echo 正在切换到 jiekou.ai...
powershell -Command "(Get-Content .env) -replace '^API_PROVIDER=.*', 'API_PROVIDER=jiekou' -replace '^MODEL=.*', 'MODEL=claude-sonnet-3-5' | Set-Content .env"
echo ✅ 已切换到 jiekou.ai (Claude Sonnet 3.5)
goto restart

:aliyun
echo.
echo 正在切换到 阿里云百炼...
powershell -Command "(Get-Content .env) -replace '^API_PROVIDER=.*', 'API_PROVIDER=aliyun' -replace '^MODEL=.*', 'MODEL=qwen-max' | Set-Content .env"
echo.
echo ⚠️  请确认 .env 文件中已设置 API_KEY_ALIYUN
echo     如果未设置，请编辑 .env 文件取消注释并填入 API Key
echo.
pause
echo ✅ 已切换到 阿里云百炼 (Qwen Max)
goto restart

:custom
echo.
echo 可用模型:
echo   jiekou.ai: claude-sonnet-3-5, claude-opus-4-6, deepseek-chat
echo   阿里云：qwen-max, qwen-plus, qwen-turbo
echo.
set /p provider="输入厂商 (jiekou/aliyun): "
set /p model="输入模型名称: "
powershell -Command "(Get-Content .env) -replace '^API_PROVIDER=.*', 'API_PROVIDER=%provider%' -replace '^MODEL=.*', 'MODEL=%model%' | Set-Content .env"
echo ✅ 配置已更新
goto restart

:restart
echo.
set /p restart="是否重启服务器？(Y/N): "
if /i "%restart%"=="Y" (
    echo 正在重启服务器...
    call stop-server.bat
    call start-server.bat
) else (
    echo ⚠️  请手动重启服务器以应用新配置
)
goto end

:end
echo.
pause
