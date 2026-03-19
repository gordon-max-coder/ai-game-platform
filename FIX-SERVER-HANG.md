# 🔧 服务器卡死问题修复指南

## 问题现象

- ✅ 已修复：服务启动后卡住，无响应
- ✅ 已修复：Node.js 进程无法自动退出
- ✅ 已修复：API 请求超时导致整个服务挂起
- ✅ 已修复：批处理文件等待用户输入

---

## 已应用的修复

### 1. server.js - 添加双层超时保护

**修复内容**：
- 在 API 代理请求基础上增加了服务器级别的超时保护
- 如果 API 超时，服务器会在 `API_TIMEOUT + 30 秒` 后强制终止请求
- 防止单个请求卡死整个服务

**修改位置**：
```javascript
// 服务器级别超时保护
const serverTimeout = API_TIMEOUT + 30000;
const serverTimer = setTimeout(() => {
    console.error(`⚠️ 服务器超时 - 强制终止请求`);
    proxyReq.destroy();
    res.writeHead(504);
    res.end(JSON.stringify({ error: '服务器超时' }));
}, serverTimeout);
```

---

### 2. start-server.bat - 移除交互式 pause

**修复前**：
```batch
node server.js
pause  ← 会等待用户按键，导致自动化流程中断
```

**修复后**：
```batch
node server.js
if errorlevel 1 (
    echo ❌ 服务器异常退出
    timeout /t 3 /nobreak
)
```

**改进**：
- 移除了 `pause` 命令
- 添加了错误码显示
- 自动显示可能的原因

---

### 3. nodejs-test-noninteractive SKILL.md - 修复 YAML Front Matter

**问题**：技能文件缺少 YAML 头部，导致注册失败

**修复**：
```yaml
---
name: nodejs-test-noninteractive
description: 防止 Node.js 测试脚本卡死 - 移除非必要交互、添加超时保护、确保自动退出
---
```

---

## 诊断工具

### 快速诊断脚本

运行 `fix-server-hang.bat` 自动诊断和修复：

```bash
cd C:\Users\jiangym\.copaw\ai-game-platform
fix-server-hang.bat
```

**功能**：
1. 检查端口 3000 占用情况
2. 检测卡死的 Node.js 进程
3. 提供一键清理和重启选项
4. 显示详细的进程信息

---

## 手动排查步骤

### 步骤 1：检查端口占用

```bash
netstat -ano | findstr :3000
```

如果看到输出，说明端口被占用。记录最后一列的 PID。

### 步骤 2：查看进程信息

```bash
tasklist /FI "PID eq <PID>" /V
```

确认是否为 Node.js 进程。

### 步骤 3：终止进程

```bash
taskkill /F /PID <PID>
```

或者终止所有 Node.js 进程：

```bash
taskkill /F /IM node.exe
```

### 步骤 4：重启服务器

```bash
cd C:\Users\jiangym\.copaw\ai-game-platform
start-server.bat
```

---

## 预防措施

### 1. 避免重复启动

启动服务器前，先检查是否已在运行：

```bash
netstat -ano | findstr :3000
```

如果端口已被占用，说明服务器已在运行。

### 2. 使用健康检查

定期检查服务器状态：

```bash
curl http://localhost:3000/api/health
```

正常响应：
```json
{
  "status": "ok",
  "service": "AI Game Generator",
  "provider": "jiekou",
  "model": "claude-sonnet-3-5"
}
```

### 3. 设置合理的超时时间

编辑 `.env` 文件：

```env
API_TIMEOUT=120000  # 120 秒，根据 API 响应速度调整
```

不要设置过长，否则卡死时等待时间太久。

---

## 常见问题

### Q1: 为什么服务器会卡死？

**A**: 主要原因：
1. API 响应超时，没有超时保护
2. 网络连接中断，请求挂起
3. 批处理文件的 `pause` 命令等待输入
4. Node.js 进程异常退出但未清理

### Q2: 如何防止卡死？

**A**: 
1. 已添加超时保护（server.js）
2. 移除交互式命令（.bat 文件）
3. 使用诊断工具定期检查
4. 避免同时启动多个服务器实例

### Q3: 卡死后数据会丢失吗？

**A**: 
- 已保存的 API 响应不会丢失（存储在 `api-responses/` 目录）
- 正在进行的游戏生成会中断，需要重新请求
- 服务器配置保持不变

### Q4: 为什么日志显示 "query_handler cancelled"？

**A**: 
这是 CoPaw 的日志，表示用户取消了请求。可能的原因：
1. 服务器响应太慢，用户主动取消
2. 前端超时，自动取消请求
3. 网络连接问题

修复后，服务器会在规定时间内返回响应或错误，减少取消情况。

---

## 验证修复

### 测试 1：正常启动

```bash
cd C:\Users\jiangym\.copaw\ai-game-platform
start-server.bat
```

**预期结果**：
- ✅ 服务器在 5 秒内启动
- ✅ 显示 "服务器已启动" 消息
- ✅ 可以访问 http://localhost:3000

### 测试 2：API 超时处理

1. 断开网络连接
2. 尝试生成游戏
3. 观察服务器日志

**预期结果**：
- ✅ 在 `API_TIMEOUT + 30 秒` 后返回超时错误
- ✅ 服务器不会卡死，可以继续处理其他请求
- ✅ 日志显示超时信息

### 测试 3：进程清理

```bash
fix-server-hang.bat
```

**预期结果**：
- ✅ 正确检测到占用端口的进程
- ✅ 提供清理选项
- ✅ 清理后可以正常重启

---

## 更新日志

### 2026-03-17
- ✅ 添加服务器级别超时保护
- ✅ 移除 start-server.bat 的 pause 命令
- ✅ 创建 fix-server-hang.bat 诊断工具
- ✅ 修复 nodejs-test-noninteractive 技能注册失败
- ✅ 创建本修复文档

---

## 需要帮助？

如果问题仍然存在，请提供：
1. 服务器启动日志
2. `fix-server-hang.bat` 的输出
3. `netstat -ano | findstr :3000` 的输出
4. 具体的操作步骤和错误信息

这样可以更快地定位问题。
