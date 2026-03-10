# Force restore create.html with correct encoding

$repoPath = "C:\Users\jiangym\.copaw\ai-game-platform"
Set-Location $repoPath

Write-Host "Extracting create.html from commit e9912dc..." -ForegroundColor Green

# Extract file from git
git show e9912dc:create.html > temp-create.html

Write-Host "Reading with binary mode and converting to UTF-8..." -ForegroundColor Yellow

# Read as bytes and convert
$bytes = [System.IO.File]::ReadAllBytes("$repoPath\temp-create.html")
$utf8 = New-Object System.Text.UTF8Encoding $false
$text = $utf8.GetString($bytes)

# Find and replace the title
$text = $text -replace '鍒涘缓娓告垙', '创建游戏'

# Write back with proper UTF-8 encoding (with BOM for Windows compatibility)
[System.IO.File]::WriteAllText("$repoPath\create.html", $text, (New-Object System.Text.UTF8Encoding $true))

Write-Host "Done!" -ForegroundColor Green

# Cleanup
if (Test-Path "$repoPath\temp-create.html") {
    Remove-Item "$repoPath\temp-create.html"
}

Write-Host ""
Write-Host "Verification:" -ForegroundColor Cyan
$content = Get-Content "$repoPath\create.html" -Encoding UTF8 -TotalCount 10
$content | Select-String "title"
