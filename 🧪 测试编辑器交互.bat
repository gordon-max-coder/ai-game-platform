@echo off
chcp 65001 >nul
echo.
echo =============================================
echo   🐛 编辑器交互修复验证 - v33
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
echo 🧪 测试步骤:
echo.
echo    【步骤 1】创建游戏
echo    1. 在左侧输入框输入：创建一个贪食蛇游戏
echo    2. 点击 "🚀 创建" 按钮
echo    3. 等待 AI 生成游戏 (3-5 秒)
echo.
echo    【步骤 2】打开编辑器
echo    4. 点击预览区上方的 "🎮 编辑器" 按钮
echo    5. 按 F12 打开浏览器控制台
echo    6. 查看控制台日志
echo.
echo    【步骤 3】测试按钮交互
echo    7. 点击左侧组件树中的 "Player"
echo    8. 在右侧调整 "speed" 滑块
echo    9. 点击 "▶️ 运行" 按钮
echo    10. 点击 "💾 保存" 按钮
echo    11. 点击 "📦 导出" 按钮
echo.
echo    【步骤 4】验证 Toast 提示
echo    12. 每次点击后应该看到底部弹出 Toast
echo    13. Toast 应该在 3 秒后自动消失
echo.
echo 📋 验证清单:
echo.
echo    [ ] "🎮 编辑器" 按钮能打开模态框
echo    [ ] 组件树点击能高亮对象
echo    [ ] 属性面板能显示属性
echo    [ ] "▶️ 运行" 按钮能启动游戏
echo    [ ] "⏹️ 停止" 按钮能停止游戏
echo    [ ] "💾 保存" 按钮显示 Toast
echo    [ ] "📦 导出" 按钮下载文件
echo    [ ] 控制台有详细日志输出
echo.
echo 📚 详细文档:
echo    - docs/FIX-EDITOR-INTERACTION-v33.md
echo.
echo =============================================
echo.
echo 💡 提示：如果按钮仍然没反应，请检查：
echo.
echo    1. 浏览器控制台是否有错误
echo    2. 按 Ctrl+F5 强制刷新缓存
echo    3. 确认 JS 版本号为 v33
echo.
echo =============================================
echo.
pause
