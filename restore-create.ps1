# Restore create.html from a known good version

$repoPath = "C:\Users\jiangym\.copaw\ai-game-platform"
Set-Location $repoPath

Write-Host "Current create.html status:" -ForegroundColor Yellow
$firstLine = Get-Content "create.html" -TotalCount 1
Write-Host $firstLine

Write-Host ""
Write-Host "Checking Git history..." -ForegroundColor Green

# Try to restore from the commit before code view feature
$commits = git log --oneline -10
Write-Host $commits

Write-Host ""
Write-Host "Attempting to restore from eafe079 (initial commit with timeout fix)..." -ForegroundColor Yellow

# Restore from a known good commit
git checkout eafe079 -- create.html 2>&1

Write-Host ""
Write-Host "Checking restored file:" -ForegroundColor Green
$restored = Get-Content "create.html" -TotalCount 10
$restored | Select-String "title"

Write-Host ""
Write-Host "If still corrupted, we need to manually fix the encoding." -ForegroundColor Red
