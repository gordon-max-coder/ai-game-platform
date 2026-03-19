# 停止现有 node 进程
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 等待 1 秒
Start-Sleep -Seconds 1

# 异步启动新服务器
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "C:\Users\jiangym\.copaw\ai-game-platform" -WindowStyle Hidden

# 立即退出
exit
