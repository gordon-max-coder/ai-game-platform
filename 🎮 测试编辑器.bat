@echo off
chcp 65001 >nul
echo.
echo =============================================
echo   🎮 AI Game Editor v32 - 快速测试
echo =============================================
echo.
echo 正在启动服务器...
echo.

:: 检查端口占用
netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口 3000 已被占用，正在清理...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

:: 启动服务器
echo ✅ 启动服务器...
start "AI Game Platform" cmd /k "cd /d %~dp0 && npm start"

echo.
echo ⏳ 等待服务器启动...
timeout /t 3 /nobreak >nul

echo.
echo =============================================
echo   ✅ 服务器已启动！
echo =============================================
echo.
echo 🌐 请在浏览器中访问:
echo.
echo    http://localhost:3000/create.html
echo.
echo 🎮 快速测试步骤:
echo.
echo    1. 在左侧输入框输入：创建一个贪食蛇游戏
echo    2. 点击 "🚀 创建" 按钮
echo    3. 等待 AI 生成游戏 (3-5 秒)
echo    4. 点击 "🎮 编辑器" 按钮
echo    5. 体验可视化编辑功能！
echo.
echo 📚 详细文档:
echo    - docs/GAME-EDITOR-GUIDE.md (使用指南)
echo    - docs/EDITOR-TEST-GUIDE.md (测试指南)
echo    - docs/EDITOR-COMPLETE-SUMMARY.md (完成总结)
echo.
echo =============================================
echo.
pause
