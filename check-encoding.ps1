# Check actual file encoding

$file = "C:\Users\jiangym\.copaw\ai-game-platform\create.html"

Write-Host "Reading file with UTF-8 encoding..." -ForegroundColor Green
$content = Get-Content $file -Encoding UTF8 -TotalCount 10

Write-Host ""
Write-Host "First 10 lines:" -ForegroundColor Yellow
$content

Write-Host ""
Write-Host "Looking for title tag:" -ForegroundColor Yellow
$titleLine = $content | Select-String "title"
Write-Host $titleLine

Write-Host ""
Write-Host "File encoding details:" -ForegroundColor Green
$bytes = [System.IO.File]::ReadAllBytes($file)
Write-Host "File size: $($bytes.Length) bytes"

# Check for BOM
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "Encoding: UTF-8 with BOM" -ForegroundColor Cyan
} else {
    Write-Host "Encoding: UTF-8 without BOM" -ForegroundColor Cyan
}
