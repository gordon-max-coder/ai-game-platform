# 🔍 404 问题排查指南

> **问题**: xiaomi/mimo-v2-pro 返回 404  
> **厂商显示**: jiekou（错误）  
> **应为**: openrouter

---

## 📋 排查步骤

### 步骤 1: 验证代码修改

**检查 `js/create-new.js`**:
```bash
cd C:\Users\jiangym\.copaw\ai-game-platform
findstr /n "xiaomi/mimo-v2-pro" js\create-new.js
```

**预期输出**:
```
367:            if (model.includes('xiaomi/mimo-v2-pro') || model.includes('openrouter/')) {
548:        const provider = selectedModel.includes('openrouter') || selectedModel.includes('xiaomi/mimo-v2-pro') ? 'openrouter' : 
748:        const provider = selectedModel.includes('openrouter') || selectedModel.includes('xiaomi/mimo-v2-pro') ? 'openrouter' : 
```

✅ **如果有这 3 行** → 代码修改正确  
❌ **如果只有 1-2 行** → 代码修改不完整

---

### 步骤 2: 检查浏览器缓存

**问题**: 浏览器可能缓存了旧版本的 JS 文件

**解决方法 1: 强制刷新**
```
1. 在 create.html 页面
2. 按 Ctrl+Shift+R
3. 或者按 Ctrl+F5
```

**解决方法 2: 清除缓存**
```
1. Chrome/Edge: Ctrl+Shift+Delete
2. 选择"缓存的图像和文件"
3. 时间范围：全部时间
4. 点击"清除数据"
5. 重新访问页面
```

**解决方法 3: 使用无痕模式**
```
1. Chrome/Edge: Ctrl+Shift+N
2. 访问：http://localhost:3000/create.html
3. 选择模型测试
```

---

### 步骤 3: 检查服务器是否重启

**问题**: 服务器可能没有重启，仍在使用旧代码

**解决方法**:
```bash
# 停止所有 node 进程
taskkill /F /IM node.exe

# 重启服务器
node server.js
```

或者双击：`🔄 重启服务器 - 应用修复.bat`

---

### 步骤 4: 使用调试页面

**打开调试页面**:
```
双击：debug-provider.html
或访问：http://localhost:3000/debug-provider.html
```

**预期结果**:
```
✅ xiaomi/mimo-v2-pro → openrouter
✅ openrouter/hunter-alpha → openrouter
✅ xiaomi/mimo-v2-flash → jiekou
```

**如果显示错误**:
- 说明 `create-new.js` 文件没有被正确修改
- 重新检查步骤 1

---

### 步骤 5: 检查控制台日志

**在 create.html 页面**:
```
1. 按 F12 打开开发者工具
2. 切换到"Console"标签
3. 选择"MiMo V2 Pro"模型
4. 点击"创建"按钮
5. 查看控制台输出
```

**预期日志**:
```
🤖 模型已切换：xiaomi/mimo-v2-pro (openrouter)
🌐 使用厂商：openrouter
📤 发送请求到 OpenRouter...
```

**错误日志**:
```
🌐 使用厂商：jiekou  ← 错误！
```

---

### 步骤 6: 检查版本号

**查看 `create.html`**:
```bash
findstr /n "create-new.js?v" create.html
```

**预期输出**:
```
220:    <script src="js/create-new.js?v=39"></script>
```

✅ **如果是 v39** → 版本号正确  
❌ **如果是 v38 或更低** → 需要更新版本号

---

## 🔧 常见问题

### 问题 1: 代码修改了但还是 404

**原因**: 浏览器缓存

**解决**:
```
1. 清除浏览器缓存
2. 使用无痕模式
3. 强制刷新 (Ctrl+Shift+R)
```

---

### 问题 2: 服务器没有重启

**原因**: 修改代码后没有重启服务器

**解决**:
```
1. 停止所有 node.exe 进程
2. 重新启动服务器
3. 或者双击：🔄 重启服务器 - 应用修复.bat
```

---

### 问题 3: 版本号没有更新

**原因**: 忘记更新 `create.html` 中的版本号

**解决**:
```html
<!-- 修改前 -->
<script src="js/create-new.js?v=38"></script>

<!-- 修改后 -->
<script src="js/create-new.js?v=39"></script>
```

---

## ✅ 验证成功

**成功的标志**:

1. **控制台日志显示**:
   ```
   🌐 使用厂商：openrouter
   ```

2. **API 响应**:
   ```
   ✅ Status 200
   ✅ 游戏正常生成
   ```

3. **无 404 错误**

---

## 🚀 快速修复脚本

**一键修复**:
```bash
# 1. 重启服务器
双击：🔄 重启服务器 - 应用修复.bat

# 2. 清除缓存
双击：🔄 强制刷新浏览器.bat

# 3. 打开调试页面
双击：debug-provider.html

# 4. 测试
访问：http://localhost:3000/create.html
选择：MiMo V2 Pro
创建游戏
```

---

## 📊 检查清单

- [ ] `js/create-new.js` 有 3 处修改
- [ ] `create.html` 版本号是 v39
- [ ] 服务器已重启
- [ ] 浏览器缓存已清除
- [ ] 控制台显示 `openrouter`
- [ ] 调试页面测试通过
- [ ] 游戏生成成功

---

## 📞 如果还是不行

**提供以下信息**:

1. **控制台日志** (完整输出)
2. **`findstr` 输出** (确认代码修改)
3. **调试页面截图** (显示判断结果)
4. **版本号** (create.html 中的版本号)

---

**🔧 耐心排查，一定能解决！**
