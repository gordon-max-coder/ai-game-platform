@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   切换到 GPT-5.4 模型
echo ========================================
echo.

:: 备份原 .env 文件
if exist .env (
    copy .env .env.backup >nul
    echo ✅ 已备份 .env 文件
)

:: 修改 MODEL 配置
echo.
echo 当前配置:
findstr "^MODEL=" .env
echo.

:: 使用 PowerShell 修改 .env
powershell -Command "(Get-Content .env) -replace '^MODEL=.*', 'MODEL=gpt-5.4' | Set-Content .env"

echo 新配置:
findstr "^MODEL=" .env
echo.

echo ========================================
echo   ⚠️  重要提示
echo ========================================
echo.
echo 1. GPT-5.4 是最强 GPT 模型，质量最高
echo 2. 成本约 $0.50-1.00/次 (比 Gemini 贵)
echo 3. 建议用于关键项目，日常开发用 Gemini
echo.
echo ========================================
echo   📝 下一步操作
echo ========================================
echo.
echo 选项 1: 重启服务器（推荐，使配置生效）
echo 选项 2: 仅修改配置，稍后重启
echo 选项 3: 取消修改（恢复备份）
echo.
set /p choice="请选择 (1/2/3): "

if "%choice%"=="1" (
    echo.
    echo 🔄 正在重启服务器...
    call "🔄 重启服务器.bat"
) else if "%choice%"=="2" (
    echo.
    echo ⏸️  配置已修改，请手动重启服务器
    echo 📖 运行：🔄 重启服务器.bat
) else if "%choice%"=="3" (
    echo.
    echo ↩️  正在恢复备份...
    copy .env.backup .env >nul
    echo ✅ 已恢复原配置
) else (
    echo.
    echo ⏸️  配置已修改，请手动重启服务器
)

echo.
echo ========================================
echo   ✅ 完成
echo ========================================
echo.
pause
