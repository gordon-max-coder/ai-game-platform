@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     Add Code View Button to create.html                 ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM 使用 PowerShell 安全地修改文件，明确指定 UTF-8 with BOM
powershell -Command ^
"$file = 'create.html'; ^
$content = Get-Content $file -Raw -Encoding UTF8; ^
$button = '<button class=\"btn-action\" id=\"codeBtn\">📄 代码</button>'; ^
$newContent = $content.Replace( ^
  '<div class=\"preview-actions\" id=\"previewActions\" style=\"display: none;\">', ^
  '<div class=\"preview-actions\" id=\"previewActions\" style=\"display: none;\">`n                            ' + $button); ^
[System.IO.File]::WriteAllText($file, $newContent, (New-Object System.Text.UTF8Encoding $true)); ^
Write-Host '✅ Button added to create.html' -ForegroundColor Green"

echo.
echo Verifying...
findstr /C:"codeBtn" create.html

echo.
echo Done!
pause
