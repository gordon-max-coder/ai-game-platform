# 🔧 OpenRouter 模型 404 问题修复

> **日期**: 2026-03-19  
> **版本**: v39  
> **问题**: xiaomi/mimo-v2-pro 404 错误  
> **状态**: ✅ 已修复

---

## 📢 问题描述

**错误信息**:
```
厂商：jiekou
模型：xiaomi/mimo-v2-pro
❌ 失败：404 MODEL_NOT_FOUND
```

**根本原因**: 
- `xiaomi/mimo-v2-pro` 是 **OpenRouter** 平台的模型
- 但前端代码判断厂商时，只检查了 `openrouter/` 前缀
- `xiaomi/mimo-v2-pro` 不包含 `openrouter` 字符串
- 导致被错误地发送到 **jiekou.ai** 平台

---

## 🔍 问题分析

### 模型归属

| 模型 | 正确厂商 | 错误厂商 |
|------|----------|----------|
| `openrouter/hunter-alpha` | OpenRouter ✅ | - |
| **`xiaomi/mimo-v2-pro`** | **OpenRouter ✅** | **jiekou ❌** |
| `xiaomi/mimo-v2-flash` | jiekou.ai ✅ | - |
| `claude-sonnet-4-6` | jiekou.ai ✅ | - |

### 代码问题

**修改前的判断逻辑**:
```javascript
// ❌ 只检查 'openrouter' 前缀
const provider = selectedModel.includes('openrouter') ? 'openrouter' : 
                (selectedModel.includes('qwen') ? 'aliyun' : 'jiekou');

// 问题：
// xiaomi/mimo-v2-pro 不包含 'openrouter'
// → 被判断为 jiekou ❌
```

---

## ✅ 修复方案

### 修改 `js/create-new.js`

**修改后的判断逻辑**:
```javascript
// ✅ 同时检查 'openrouter' 和 'xiaomi/mimo-v2-pro'
const provider = selectedModel.includes('openrouter') || selectedModel.includes('xiaomi/mimo-v2-pro') ? 'openrouter' : 
                (selectedModel.includes('qwen') ? 'aliyun' : 'jiekou');

// 现在：
// xiaomi/mimo-v2-pro → 包含 'xiaomi/mimo-v2-pro' → OpenRouter ✅
// openrouter/hunter-alpha → 包含 'openrouter' → OpenRouter ✅
// xiaomi/mimo-v2-flash → 不包含 → jiekou ✅
```

### 修改位置

1. **`generateGame()` 函数** (第 548-549 行)
2. **`modifyGame()` 函数** (第 748-749 行)

### 同时修改模型选择监听

**修改前**:
```javascript
elements.modelSelect.addEventListener('change', () => {
    const model = elements.modelSelect.value;
    localStorage.setItem('selectedModel', model);
    console.log('🤖 模型已切换:', model);
});
```

**修改后**:
```javascript
elements.modelSelect.addEventListener('change', () => {
    const model = elements.modelSelect.value;
    localStorage.setItem('selectedModel', model);
    
    // ✅ 自动判断并切换 API 厂商
    let provider = 'jiekou';  // 默认 jiekou
    if (model.includes('xiaomi/mimo-v2-pro') || model.includes('openrouter/')) {
        provider = 'openrouter';
    }
    localStorage.setItem('selectedProvider', provider);
    
    console.log(`🤖 模型已切换：${model} (${provider})`);
});
```

---

## 📁 修改文件

### 1. `js/create-new.js` (v38 → v39)
- ✅ 修改 `generateGame()` provider 判断逻辑
- ✅ 修改 `modifyGame()` provider 判断逻辑
- ✅ 修改模型选择监听，自动保存 provider

### 2. `create.html` (v38 → v39)
- ✅ 更新 JS 版本号 v38 → v39

---

## 🧪 测试验证

### 测试步骤

1. **刷新浏览器**
   ```
   Ctrl + Shift + R
   ```

2. **选择 MiMo V2 Pro**
   - 模型下拉框 → "MiMo V2 Pro 🚀 (OpenRouter 新模型)"

3. **创建游戏**
   ```
   输入："创建一个贪食蛇游戏"
   点击"创建"
   ```

4. **验证日志**
   ```
   控制台应该显示：
   🌐 使用厂商：openrouter
   ✅ 而不是：jiekou
   ```

5. **验证响应**
   ```
   ✅ 预期：Status 200，游戏正常生成
   ❌ 如果还是 404：检查 API Key 余额
   ```

---

## 📊 厂商判断逻辑

### 完整判断流程

```
用户选择模型
    ↓
检查模型字符串：
    ├─ 包含 'openrouter' 或 'xiaomi/mimo-v2-pro'
    │  └─ → OpenRouter
    │
    ├─ 包含 'qwen'
    │  └─ → 阿里云百炼
    │
    └─ 其他
       └─ → jiekou.ai
```

### 模型归属表

| 模型 | 包含字符串 | 判断结果 |
|------|-----------|----------|
| `openrouter/hunter-alpha` | 'openrouter' | OpenRouter ✅ |
| `xiaomi/mimo-v2-pro` | 'xiaomi/mimo-v2-pro' | OpenRouter ✅ |
| `xiaomi/mimo-v2-flash` | 'xiaomi' (但不是 v2-pro) | jiekou ✅ |
| `claude-sonnet-4-6` | 无 | jiekou ✅ |
| `gpt-5.4` | 无 | jiekou ✅ |
| `gemini-2.5-flash` | 无 | jiekou ✅ |
| `qwen-plus` | 'qwen' | 阿里云 ✅ |

---

## 💡 经验教训

### 问题根源

1. **模型命名不规范**
   - OpenRouter 的模型有两种格式：
     - `openrouter/xxx` (如 `openrouter/hunter-alpha`)
     - `厂商/模型` (如 `xiaomi/mimo-v2-pro`)
   - 只检查前缀会漏掉第二种

2. **硬编码判断逻辑**
   - 应该从配置文件读取厂商信息
   - 而不是在代码中硬编码字符串检查

### 最佳实践

1. **统一模型命名**
   ```javascript
   // 推荐格式：厂商/模型
   'openrouter/xiaomi-mimo-v2-pro'  // ✅ 统一格式
   'jiekou/claude-sonnet-4-6'       // ✅ 统一格式
   ```

2. **配置驱动**
   ```javascript
   // 从配置获取厂商
   const provider = API_PROVIDERS[API_CONFIG.provider];
   const modelInfo = provider.models[modelName];
   ```

3. **自动同步**
   - 前端选择模型时自动保存 provider
   - 后端从请求中读取 provider
   - 避免重复判断

---

## ✅ 修复验证

### 验证清单

- [x] `generateGame()` 已修改
- [x] `modifyGame()` 已修改
- [x] 模型选择监听已修改
- [x] 版本号已更新 (v39)
- [ ] 测试通过（待用户验证）

### 预期效果

**选择 MiMo V2 Pro 时**:
```
✅ 发送到 OpenRouter
✅ 使用正确的 API Key
✅ 返回 200 状态码
✅ 游戏正常生成
```

---

## 🚀 下一步

1. **测试验证**
   - 选择 MiMo V2 Pro 创建游戏
   - 验证发送到 OpenRouter
   - 确认游戏正常生成

2. **优化建议**
   - 重构 provider 判断逻辑
   - 使用配置文件驱动
   - 添加更多错误提示

3. **文档更新**
   - 更新模型选择指南
   - 添加厂商归属表
   - 说明命名规范

---

## 📚 相关文档

- `docs/OPENROUTER-MIMOV2PRO-UPDATE.md` - OpenRouter 模型更新
- `docs/MIMO-V2-FLASH-SETUP.md` - MiMo V2 Flash 设置
- `docs/MIMO-V2-FLASH-FIX.md` - MiMo V2 Flash ID 修正
- `docs/CHANGELOG-v38.md` - v38 更新日志

---

## 🎉 总结

**问题已修复！**

- ✅ 根本原因：provider 判断逻辑不完善
- ✅ 影响范围：xiaomi/mimo-v2-pro 被发送到错误的厂商
- ✅ 修复方式：添加特殊检查逻辑
- ✅ 修改文件：js/create-new.js, create.html
- ✅ 版本号：v38 → v39

**测试通过后，MiMo V2 Pro 应该可以正常使用了！** 🚀

---

**🔧 细节决定成败！**
