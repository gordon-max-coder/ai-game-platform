@echo off
chcp 65001 >nul
echo ============================================================
echo   初始化本地 Git 仓库
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/4] 初始化 Git 仓库...
git init >nul 2>&1
if errorlevel 1 (
    echo [错误] Git 初始化失败
    pause
    exit /b 1
)
echo [成功] Git 仓库已初始化

echo.
echo [2/4] 创建 .gitignore 文件...
(
echo # 自动生成的文件
echo node_modules/
echo *.log
echo .DS_Store
echo Thumbs.db
echo.
echo # 临时文件
echo *.tmp
echo *.bak
echo *.swp
echo.
echo # 日志文件
echo server.log
echo *.log
) > .gitignore
echo [成功] .gitignore 已创建

echo.
echo [3/4] 添加所有文件到版本库...
git add -A >nul 2>&1
echo [成功] 文件已添加到暂存区

echo.
echo [4/4] 创建初始提交...
git commit -m "初始提交 - AI 游戏生成平台" >nul 2>&1
echo [成功] 初始版本已创建

echo.
echo ============================================================
echo   Git 仓库搭建完成！
echo ============================================================
echo.
echo 常用命令：
echo   git status          - 查看文件变更
echo   git add .           - 添加所有变更
echo   git commit -m "说明" - 提交新版本
echo   git log             - 查看历史记录
echo   git reset --hard HEAD~1  - 回滚到上一个版本
echo   git checkout 版本 hash  - 切换到指定版本
echo.
echo 当前分支：main
echo.
echo 提示：每次修改前先执行 git add . 和 git commit -m "说明"
echo ============================================================
echo.
pause
