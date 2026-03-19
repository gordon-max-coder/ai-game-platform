@echo off
chcp 65001 >nul
echo ========================================
echo 🔄 强制刷新浏览器缓存
echo ========================================
echo.
echo 浏览器缓存可能导致旧代码被使用！
echo.
echo 请按以下步骤操作：
echo.
echo 1. 关闭所有浏览器窗口
echo.
echo 2. 清除浏览器缓存
echo    - Chrome/Edge: Ctrl+Shift+Delete
echo    - 选择"缓存的图像和文件"
echo    - 时间范围：全部时间
echo    - 点击"清除数据"
echo.
echo 3. 重新打开浏览器
echo.
echo 4. 访问：http://localhost:3000/create.html
echo.
echo 5. 按 Ctrl+Shift+R 强制刷新
echo.
echo ========================================
echo 或者使用无痕模式（推荐）
echo ========================================
echo.
echo Chrome/Edge: Ctrl+Shift+N
echo Firefox: Ctrl+Shift+P
echo.
echo 然后访问：http://localhost:3000/create.html
echo.
pause
