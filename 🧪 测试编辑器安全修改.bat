@echo off
chcp 65001 >nul
echo ========================================
echo 🧪 测试编辑器安全修改功能 v36
echo ========================================
echo.

echo 测试步骤:
echo 1. 启动服务器
echo 2. 打开浏览器访问 create.html
echo 3. 创建游戏（贪食蛇）
echo 4. 点击"🎮 编辑器"
echo 5. 修改属性值
echo 6. 验证代码修改准确性
echo 7. 测试撤销功能
echo.

echo 正在启动服务器...
cd /d "%~dp0"
call 启动服务器.bat

echo.
echo 等待服务器启动...
timeout /t 3 /nobreak >nul

echo.
echo 打开浏览器...
start http://localhost:3000/create.html

echo.
echo ========================================
echo ✅ 测试环境已就绪
echo ========================================
echo.
echo 测试清单:
echo □ 1. 创建贪食蛇游戏
echo □ 2. 打开编辑器能看到组件树
echo □ 3. 选择 Player 对象
echo □ 4. 修改 speed 从 300 → 500
echo □ 5. 验证 Toast 提示"✅ 已修改 speed: 300 → 500"
echo □ 6. 检查代码编辑器中只有声明处被修改
echo □ 7. 验证 playerSpeed 等相似变量名未被修改
echo □ 8. 点击"↩️ 撤销"恢复原值
echo □ 9. 多次修改后测试撤销栈
echo □ 10. 测试错误提示（修改不存在的变量）
echo.
echo 按任意键开始测试...
pause >nul
