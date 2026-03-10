@echo off
chcp 65001 >nul
title Encoding Checker

REM ========================================
REM Encoding Checker - 文件编码检查工具
REM ========================================

cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Encoding Checker - 文件编码检查                     ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Checking HTML files...
echo.

for %%f in (*.html) do (
    echo [%%f]
    powershell -Command "$content = Get-Content '%%f' -Raw; $title = if ($content -match '<title>(.*?)</title>') { $matches[1] } else { 'N/A' }; if ($title -match '[\u4e00-\u9fa5]') { if ($title.Contains('鍒') -or $title.Contains('缓')) { Write-Host '  ❌ CORRUPTED (乱码)' -ForegroundColor Red } else { Write-Host '  ✓ OK (Chinese: $title)' -ForegroundColor Green } } else { Write-Host '  ℹ No Chinese text' -ForegroundColor Gray } }"
    echo.
)

echo Checking CSS files...
echo.

for %%f in (*.css) do (
    echo [%%f]
    powershell -Command "$content = Get-Content '%%f' -Raw; if ($content -match '[\u4e00-\u9fa5]') { Write-Host '  ✓ Contains Chinese' -ForegroundColor Green } else { Write-Host '  - No Chinese' -ForegroundColor Gray }"
    echo.
)

echo Checking JS files...
echo.

for %%f in (js\*.js) do (
    echo [%%f]
    powershell -Command "$content = Get-Content '%%f' -Raw; if ($content -match '[\u4e00-\u9fa5]') { Write-Host '  ✓ Contains Chinese' -ForegroundColor Green } else { Write-Host '  - No Chinese' -ForegroundColor Gray }"
    echo.
)

echo.
echo ═══════════════════════════════════════════════════════════
echo.

pause
