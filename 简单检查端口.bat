@echo off
chcp 65001 >nul
title 检查 3000 端口

echo.
echo ========================================
echo   检查 3000 端口占用
echo ========================================
echo.

netstat -ano | findstr :3000

echo.
echo 按任意键查看进程详情...
pause >nul

echo.
echo ========================================
echo   进程列表
echo ========================================
tasklist

echo.
echo ========================================
echo 提示：找到上面 netstat 显示的 PID
echo 在 tasklist 中查找对应的程序名
echo ========================================
echo.
echo 按任意键退出...
pause >nul
