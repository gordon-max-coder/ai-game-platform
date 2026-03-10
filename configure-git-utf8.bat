@echo off
chcp 65001 >nul
title Configure Git for UTF-8

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Configure Git for UTF-8 Encoding                    ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Configuring Git global settings...
echo.

git config --global core.autocrlf false
echo ✓ core.autocrlf = false

git config --global core.safecrlf false
echo ✓ core.safecrlf = false

git config --global core.quotepath false
echo ✓ core.quotepath = false (显示中文文件名)

git config --global gui.encoding utf-8
echo ✓ gui.encoding = utf-8

git config --global i18n.commitencoding utf-8
echo ✓ i18n.commitencoding = utf-8

git config --global i18n.logoutputencoding utf-8
echo ✓ i18n.logoutputencoding = utf-8

git config --global diff.charset utf-8
echo ✓ diff.charset = utf-8

git config --global core.pager "less -r"
echo ✓ core.pager = less -r

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  ✅ Git configured for UTF-8!                            ║
echo ║                                                          ║
echo ║  Next steps:                                             ║
echo ║  1. Run fix-encoding.bat to fix existing files          ║
echo ║  2. Use check-encoding.bat to verify                    ║
echo ║  3. Use safe-edit.bat to edit files safely              ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

pause
