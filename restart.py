import subprocess
import time
import os

# 停止现有进程
subprocess.run(['taskkill', '/F', '/IM', 'node.exe'], capture_output=True)

# 等待
time.sleep(1)

# 异步启动
os.chdir(r'C:\Users\jiangym\.copaw\ai-game-platform')
subprocess.Popen(['node', 'server.js'], 
                 stdout=open('server.log', 'w'), 
                 stderr=open('server-error.log', 'w'))

print("✅ Server restarted!")
