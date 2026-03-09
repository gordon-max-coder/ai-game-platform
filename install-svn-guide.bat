@echo off
chcp 65001 >nul
echo ============================================================
echo   SVN 安装指南
echo ============================================================
echo.
echo 你当前没有安装 SVN，请按以下步骤安装：
echo.
echo 方法 1：使用 TortoiseSVN（推荐，带图形界面）
echo ----------------------------------------------
echo 1. 访问：https://tortoisesvn.net/downloads.html
echo 2. 下载 Windows 版本（64 位或 32 位）
echo 3. 运行安装程序，一路下一步
echo 4. 安装完成后重启电脑
echo 5. 右键菜单会出现 SVN 相关选项
echo.
echo 方法 2：使用命令行 SVN
echo ----------------------------------------------
echo 1. 访问：https://www.apachelounge.com/download/
echo 2. 下载 SVN 二进制包
echo 3. 解压到 C:\svn
echo 4. 添加 C:\svn\bin 到系统 PATH 环境变量
echo 5. 重启命令行，运行 svn --version 验证
echo.
echo ============================================================
echo.
echo 建议：你已经安装了 Git，功能更强大，推荐使用 Git
echo 运行 init-git.bat 即可快速搭建本地仓库
echo ============================================================
echo.
pause
