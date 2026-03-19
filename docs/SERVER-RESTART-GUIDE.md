# 🔄 服务器配置更新问题

## 问题现象

API 返回 404 错误：
```json
{
  "code": 404,
  "reason": "MODEL_NOT_FOUND",
  "message": "model not found",
  "metadata": {
    "reason": "model: claude-sonnet-3-5 not found"
  }
}
```

## 根本原因

**服务器在 `.env` 更新之前启动**，仍然使用旧的配置：
- ❌ 旧模型：`claude-opus-4-6` 或 `claude-sonnet-3-5`
- ✅ 新模型：`gemini-3.1-flash-lite-preview`

## 解决方案

### 方法 1：双击重启脚本（推荐）

1. 双击运行：
   ```
   🔄 重启服务器 - 切换 Gemini.bat
   ```

2. 等待服务器启动完成

3. 访问创作页面验证

### 方法 2：手动重启

**步骤 1：停止旧服务器**
- 找到运行服务器的命令行窗口
- 按 `Ctrl+C` 停止

**步骤 2：确认配置**
检查 `.env` 文件：
```env
MODEL=gemini-3.1-flash-lite-preview
API_PROVIDER=jiekou
```

**步骤 3：启动新服务器**
```bash
node server.js
```

### 方法 3：PowerShell 重启

```powershell
# 停止
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 启动
cd C:\Users\jiangym\.copaw\ai-game-platform
Start-Process node -ArgumentList "server.js" -WindowStyle Hidden
```

## 验证配置

### 检查服务器日志

打开 `server.log` 应该看到：
```
╔══════════════════════════════════════════════════════════╗
║        🎮 AI 游戏生成器 - 本地服务器                     ║
╠══════════════════════════════════════════════════════════╣
║  地址：http://localhost:3000                           ║
║  API: api.jiekou.ai/openai                              ║
║  模型：gemini-3.1-flash-lite-preview   ║
╚══════════════════════════════════════════════════════════╝
```

### 测试 API

访问健康检查端点：
```
http://localhost:3000/api/health
```

响应应该包含：
```json
{
  "status": "ok",
  "provider": "jiekou",
  "model": "gemini-3.1-flash-lite-preview"
}
```

### 前端验证

访问创作页面：
```
http://localhost:3000/create.html
```

底部 API 状态栏应显示：
```
✅ jiekou.ai | gemini-3.1-flash-lite-preview
```

## 预防措施

### 修改配置后立即重启

每次修改 `.env` 文件后，**必须重启服务器**才能生效。

### 使用重启脚本

建议始终使用重启脚本而不是直接启动：
```bash
🔄 重启服务器 - 切换 Gemini.bat
```

### 检查日志

养成检查 `server.log` 的习惯，确认服务器使用的是正确的配置。

## 常见问题

### Q: 为什么修改 .env 后不生效？

A: Node.js 服务器在启动时读取 `.env` 文件，运行中不会重新读取。必须重启服务器。

### Q: 重启后还是旧模型？

A: 可能原因：
1. `.env` 文件没有正确保存
2. 启动了多个服务器实例
3. 浏览器缓存（尝试硬刷新 Ctrl+F5）

### Q: 如何确认服务器已停止？

A: 
- Windows: `tasklist | findstr node.exe`
- 如果有输出，说明还在运行
- 使用 `taskkill /F /IM node.exe` 强制停止

## 当前配置

```env
API_PROVIDER=jiekou
MODEL=gemini-3.1-flash-lite-preview
API_KEY=sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8
```

## 快速命令

```bash
# 停止所有 node 进程
taskkill /F /IM node.exe

# 启动服务器
node server.js

# 或使用重启脚本
🔄 重启服务器 - 切换 Gemini.bat
```

---

*最后更新：2025-01-15*  
*状态：⚠️ 需要重启服务器*
