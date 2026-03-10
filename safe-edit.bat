@echo off
chcp 65001 >nul
title Safe File Editor

REM ========================================
REM Safe File Editor - 安全文件修改工具
REM 使用 UTF-8 with BOM 编码，避免乱码
REM ========================================

cd /d "%~dp0"

if "%~1"=="" (
    echo Usage: safe-edit.bat ^<filename^>
    echo.
    echo Example: safe-edit.bat create.html
    pause
    exit /b 1
)

set FILE=%~1

if not exist "%FILE%" (
    echo Error: File not found: %FILE%
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Safe File Editor - UTF-8 with BOM                   ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo File: %FILE%
echo.
echo Opening file in default editor...
echo.
echo After editing, the file will be saved with UTF-8 BOM encoding.
echo.

REM 使用 PowerShell 安全地读取和保存文件
powershell -Command "$file = '%FILE%'; $content = Get-Content $file -Raw -Encoding UTF8; $temp = $file + '.tmp'; [System.IO.File]::WriteAllText($temp, $content, (New-Object System.Text.UTF8Encoding $true)); Start-Process notepad.exe -ArgumentList $temp; Write-Host 'Edit the file and press any key when done...'; pause >nul; $newContent = Get-Content $temp -Raw; [System.IO.File]::WriteAllText($file, $newContent, (New-Object System.Text.UTF8Encoding $true)); Remove-Item $temp; Write-Host 'File saved with UTF-8 BOM!' -ForegroundColor Green"

echo.
echo Done!
pause
