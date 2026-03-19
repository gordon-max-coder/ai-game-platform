# 🎯 OpenRouter Hunter Alpha 模型集成指南

**版本:** v26  
**日期:** 2026-03-16  
**状态:** ✅ 已完成

---

## 📋 概述

成功集成 OpenRouter 平台的 Hunter Alpha 模型到 AI 游戏创作平台。

### 模型信息
- **平台:** OpenRouter
- **模型 ID:** `openrouter/hunter-alpha`
- **模型名称:** Hunter Alpha 🎯
- **API 端点:** `https://openrouter.ai/api/v1/chat/completions`
- **定价:** $0.50/1M input tokens, $2.00/1M output tokens
- **质量等级:** High
- **特点:** 全球模型聚合平台，支持多种顶级模型

---

## 🔧 配置步骤

### 1. 添加 API Key 到 `.env`

```bash
# OpenRouter API Key (新增)
API_KEY_OPENROUTER=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
```

### 2. 修改 `server.js` 添加 OpenRouter 配置

```javascript
const API_KEY_OPENROUTER = process.env.API_KEY_OPENROUTER;  // OpenRouter API Key

// API 厂商配置
const API_PROVIDERS = {
    jiekou: { ... },
    aliyun: { ... },
    openrouter: {
        name: 'OpenRouter',
        hostname: 'openrouter.ai',
        port: 443,
        path: '/api/v1/chat/completions',
        apiKey: API_KEY_OPENROUTER || API_KEY  // fallback 到主 API Key
    }
};
```

### 3. 修改 `js/api-config.js` 添加前端配置

```javascript
const API_PROVIDERS = {
    jiekou: { ... },
    aliyun: { ... },
    openrouter: {
        name: 'OpenRouter',
        baseUrl: 'https://openrouter.ai/api/v1',
        models: {
            'openrouter/hunter-alpha': { 
                name: 'Hunter Alpha 🎯', 
                cost: '$0.50/1M input, $2.00/1M output', 
                quality: 'high' 
            }
        },
        defaultModel: 'openrouter/hunter-alpha'
    }
};
```

### 4. 修改 `create.html` 添加 UI 选项

#### 模型选择下拉框
```html
<option value="openrouter/hunter-alpha">Hunter Alpha 🎯 (OpenRouter 新模型)</option>
```

#### API 切换模态框
```html
<div class="api-provider-item" data-provider="openrouter">
    <div class="provider-info">
        <h4>OpenRouter 🌐</h4>
        <p>全球模型聚合平台</p>
    </div>
    <div class="provider-models">
        <button class="model-btn active" data-model="openrouter/hunter-alpha">
            <span class="model-name">Hunter Alpha 🎯</span>
            <span class="model-cost">$0.50/1M input, $2.00/1M output</span>
        </button>
    </div>
</div>
```

---

## 🚀 使用方法

### 方法 1: 通过模型选择下拉框

1. 打开 `create.html`
2. 点击模型选择下拉框
3. 选择 **"Hunter Alpha 🎯 (OpenRouter 新模型)"**
4. 输入游戏描述，点击发送

### 方法 2: 通过 API 切换模态框

1. 点击 API 状态栏（页面顶部）
2. 选择 **"OpenRouter 🌐"** 厂商
3. 选择 **"Hunter Alpha 🎯"** 模型
4. 点击"✅ 确认切换"

### 方法 3: 修改 `.env` 文件

```bash
# 切换到 OpenRouter
API_PROVIDER=openrouter
MODEL=openrouter/hunter-alpha
```

然后重启服务器：
```bash
🔄 重启服务器.bat
```

---

## 📊 成本估算

### Hunter Alpha 定价
- **Input:** $0.50 / 1M tokens
- **Output:** $2.00 / 1M tokens

### 单次游戏生成成本估算

| 游戏复杂度 | Input Tokens | Output Tokens | 成本估算 |
|-----------|-------------|--------------|---------|
| **简单游戏** (贪食蛇) | ~500 | ~3,000 | ~$0.006 |
| **中等游戏** (飞机大战) | ~800 | ~6,000 | ~$0.012 |
| **复杂游戏** (RPG) | ~1,500 | ~12,000 | ~$0.025 |

### 对比其他模型

| 模型 | 单次成本 | 质量 | 性价比 |
|------|---------|------|--------|
| **Hunter Alpha** | **$0.006-0.025** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Gemini 2.5 Flash | $0.003 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| GPT-5 Mini | $0.003 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| GPT-5.4 | $0.50-1.00 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Claude Opus 4.6 | $0.10-0.39 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🧪 测试步骤

### 测试 1: API 连通性

```bash
# 创建测试脚本
node test-openrouter.js
```

预期输出：
```
🔗 正在测试 OpenRouter Hunter Alpha...
✅ Status: 200
🤖 模型：openrouter/hunter-alpha
⏱️ 响应时间：1234ms
💬 响应：游戏生成成功...
```

### 测试 2: 前端模型选择

1. 打开 `http://localhost:3000/create.html`
2. 按 F12 打开控制台
3. 验证日志：
   ```
   ✅ API 配置版本：v12 (OpenRouter Hunter Alpha)
   ✅ API 配置已加载:
      厂商：jiekou.ai
      模型：Gemini 2.5 Flash
   ```
4. 点击模型选择下拉框
5. 验证有 "Hunter Alpha 🎯" 选项

### 测试 3: 生成游戏

1. 选择 Hunter Alpha 模型
2. 输入："创建一个贪食蛇游戏"
3. 点击发送
4. 验证：
   - ✅ 游戏成功生成
   - ✅ 控制台显示正确的 API 响应
   - ✅ 成本在预期范围内

---

## 📝 修改的文件

| 文件 | 修改内容 | 版本 |
|------|---------|------|
| `.env` | 添加 `API_KEY_OPENROUTER` | - |
| `server.js` | 添加 OpenRouter 厂商配置 | - |
| `js/api-config.js` | 添加 OpenRouter 前端配置 | v12 |
| `create.html` | 添加 Hunter Alpha 模型选项 | v26 |
| `docs/OPENROUTER-HUNTER-ALPHA-SETUP.md` | 集成文档（新建） | - |

---

## 🔍 故障排查

### 问题 1: 401 认证错误

**症状:**
```
❌ API 错误：401 Unauthorized
```

**原因:** API Key 无效或未配置

**解决:**
1. 检查 `.env` 文件中 `API_KEY_OPENROUTER` 是否正确
2. 重启服务器
3. 验证 API Key 在 OpenRouter 平台有效

### 问题 2: 模型不存在

**症状:**
```
❌ 不支持的模型：openrouter/hunter-alpha
```

**原因:** 前端配置未更新

**解决:**
1. 强制刷新浏览器 `Ctrl+F5`
2. 检查 `js/api-config.js` 是否有 OpenRouter 配置
3. 检查 `create.html` 是否有模型选项

### 问题 3: 响应超时

**症状:**
```
❌ API 超时
```

**原因:** 网络问题或模型响应慢

**解决:**
1. 检查网络连接
2. 增加 `API_TIMEOUT` 值
3. 尝试其他模型

---

## 💡 最佳实践

### 1. 模型选择策略

```
日常开发：Gemini 2.5 Flash (90%) → $0.003/次
关键项目：Hunter Alpha (10%) → $0.01/次
总计：~$0.004/次 (比纯用 Hunter Alpha 节省 60%)
```

### 2. 成本优化

- 使用轻量级模型进行快速迭代
- 重要项目使用 Hunter Alpha 保证质量
- 监控 API 使用情况，避免超限

### 3. 质量对比

定期对比不同模型的输出质量：
- 代码完整性
- 功能实现准确度
- Bug 数量
- 响应时间

---

## 📚 相关文档

- `docs/API-CONFIG.md` - 多 API 厂商配置指南
- `docs/MULTI-API-IMPLEMENTATION.md` - 多 API 实现细节
- `docs/MODEL-INTEGRATION-SPEC.md` - 模型集成规范
- `docs/MODEL-SELECTION-QUICK.md` - 模型选择快速参考

---

## 🎉 总结

**集成状态:** ✅ 完成  
**可用模型:** 7 个 (原 6 个 + Hunter Alpha)  
**API 厂商:** 3 个 (jiekou.ai, 阿里云，OpenRouter)  
**测试状态:** 待验证

**下一步:**
1. 重启服务器使配置生效
2. 测试 Hunter Alpha 模型连通性
3. 验证游戏生成功能
4. 对比输出质量

---

**立即测试:**
```bash
# 1. 重启服务器
🔄 重启服务器.bat

# 2. 打开浏览器
http://localhost:3000/create.html

# 3. 选择 Hunter Alpha 模型
# 4. 创建游戏测试！
```
