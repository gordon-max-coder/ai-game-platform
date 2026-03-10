@echo off
chcp 65001 >nul
title Encoding Fixer

REM ========================================
REM Encoding Fixer - 文件编码修复工具
REM 将所有文本文件转换为 UTF-8 with BOM
REM ========================================

cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Encoding Fixer - 文件编码修复                       ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo This will convert all text files to UTF-8 with BOM.
echo.
echo Do you want to continue? (Y/N)
set /p confirm=

if /i not "%confirm%"=="Y" (
    echo.
    echo Operation cancelled.
    pause
    exit /b 1
)

echo.
echo Fixing HTML files...
for %%f in (*.html) do (
    echo   [%%f]
    powershell -Command "$content = Get-Content '%%f' -Raw -Encoding UTF8; [System.IO.File]::WriteAllText('%%f', $content, (New-Object System.Text.UTF8Encoding $true))"
)

echo.
echo Fixing CSS files...
for %%f in (*.css) do (
    echo   [%%f]
    powershell -Command "$content = Get-Content '%%f' -Raw -Encoding UTF8; [System.IO.File]::WriteAllText('%%f', $content, (New-Object System.Text.UTF8Encoding $true))"
)

echo.
echo Fixing JS files...
for %%f in (js\*.js) do (
    echo   [%%f]
    powershell -Command "$content = Get-Content '%%f' -Raw -Encoding UTF8; [System.IO.File]::WriteAllText('%%f', $content, (New-Object System.Text.UTF8Encoding $true))"
)

echo.
echo Fixing Markdown files...
for %%f in (docs\*.md *.md) do (
    if exist "%%f" (
        echo   [%%f]
        powershell -Command "$content = Get-Content '%%f' -Raw -Encoding UTF8; [System.IO.File]::WriteAllText('%%f', $content, (New-Object System.Text.UTF8Encoding $true))"
    )
)

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  ✅ All files converted to UTF-8 with BOM!              ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

pause
