# ✅ GPT-5 Mini 400 错误已修复

**修复时间**: 2025-01-15  
**问题**: 400 Bad Request - 参数不支持  
**原因**: GPT-5 Mini 有特殊参数限制

---

## 🐛 问题原因

**错误信息**:
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
生成失败：Error: API 错误：400
```

**根本原因**:

GPT-5 Mini 有特殊的参数限制，**不支持自定义**以下参数：

- ❌ `temperature` - 固定为 1
- ❌ `top_p` - 固定为 1
- ❌ `n` - 固定为 1
- ❌ `presence_penalty` - 固定为 0
- ❌ `frequency_penalty` - 固定为 0

**API 返回错误**:
```json
{
  "message": "this model has beta-limitations, temperature, top_p and n are fixed at 1, while presence_penalty and frequency_penalty are fixed at 0",
  "type": "invalid_request_error"
}
```

---

## ✅ 修复方案

### 修改 `create-new.js`

**针对 GPT-5 Mini 不发送 temperature 参数**：

```javascript
// GPT-5 Mini 有特殊参数限制
const isGPT5Mini = selectedModel === 'gpt-5-mini';

const requestBody = {
    model: selectedModel,
    messages: [...],
    max_tokens: 16000
};

// GPT-5 Mini 不支持自定义 temperature 等参数
if (!isGPT5Mini) {
    requestBody.temperature = 0.7;
}

const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(requestBody)
});
```

---

## 📝 修改的位置

### 1. `generateGame()` 函数

**修改前**:
```javascript
const response = await fetch(API_URL, {
    body: JSON.stringify({
        model: selectedModel,
        messages: [...],
        max_tokens: 16000,
        temperature: 0.7  // ❌ GPT-5 Mini 不支持
    })
});
```

**修改后**:
```javascript
const isGPT5Mini = selectedModel === 'gpt-5-mini';

const requestBody = {
    model: selectedModel,
    messages: [...],
    max_tokens: 16000
};

// GPT-5 Mini 不支持自定义 temperature
if (!isGPT5Mini) {
    requestBody.temperature = 0.7;
}

const response = await fetch(API_URL, {
    body: JSON.stringify(requestBody)
});
```

### 2. `modifyGame()` 函数

同样的修改应用到修改游戏函数。

---

## 🔄 更新的文件

| 文件 | 修改内容 | 状态 |
|------|---------|------|
| `js/create-new.js` | 添加 GPT-5 Mini 特殊处理 | ✅ |
| `create.html` | 更新 JS 版本号 v8→v9 | ✅ |

---

## 🎯 GPT-5 Mini 参数限制

### 固定参数

| 参数 | 固定值 | 说明 |
|------|--------|------|
| `temperature` | 1.0 | 创造性 |
| `top_p` | 1.0 | 核采样 |
| `n` | 1 | 生成数量 |
| `presence_penalty` | 0.0 | 存在惩罚 |
| `frequency_penalty` | 0.0 | 频率惩罚 |

### 可用参数

| 参数 | 说明 |
|------|------|
| `model` | 模型名称 |
| `messages` | 对话消息 |
| `max_tokens` | 最大输出 tokens |
| `stream` | 流式输出 |

---

## ✅ 测试方法

### 1. 强制刷新浏览器

```
Ctrl + F5
```

### 2. 选择 GPT-5 Mini

在模型下拉框中选择：
```
GPT-5 Mini (平衡选择⚖️)
```

### 3. 生成游戏测试

提示词：
```
创建一个贪食蛇游戏
```

### 4. 验证成功

- ✅ 不再出现 400 错误
- ✅ 游戏成功生成
- ✅ 代码质量正常

---

## 📊 其他模型不受影响

| 模型 | temperature | 状态 |
|------|-------------|------|
| **GPT-5 Mini** | 固定为 1 | ✅ 特殊处理 |
| Claude Opus 4.6 | 可自定义 0.7 | ✅ 正常 |
| Claude Sonnet 4.6 | 可自定义 0.7 | ✅ 正常 |
| Gemini 2.5 Flash | 可自定义 0.7 | ✅ 正常 |
| Gemini 3.1 Flash Lite | 可自定义 0.7 | ✅ 正常 |

---

## 💡 经验教训

### 问题

1. ❌ 未查看模型文档就添加
2. ❌ 假设所有模型都支持相同参数
3. ❌ 没有先测试 API 参数限制

### 改进

1. ✅ 添加新模型前**必须先测试 API**
2. ✅ 查看模型是否有特殊限制
3. ✅ 针对不同模型做特殊处理
4. ✅ 提供错误处理和降级方案

---

## 🔧 调试技巧

### 检查请求体

```javascript
console.log('Request body:', JSON.stringify(requestBody, null, 2));
```

### 检查错误详情

```javascript
const error = await response.json();
console.error('API Error:', error);
// 输出：
// {
//   "message": "this model has beta-limitations...",
//   "type": "invalid_request_error"
// }
```

### 条件参数

```javascript
// 根据模型添加不同参数
const params = {
    model: selectedModel,
    max_tokens: 16000
};

// 只有非 GPT-5 Mini 才添加 temperature
if (selectedModel !== 'gpt-5-mini') {
    params.temperature = 0.7;
}
```

---

## 📁 相关文档

- `docs/GPT5-MINI-ADDED.md` - GPT-5 Mini 详细介绍
- `docs/DEEPSEEK-NOT-AVAILABLE.md` - DeepSeek 不可用说明
- `docs/MODEL-INTEGRATION-SPEC.md` - 模型集成规范

---

## 🎉 总结

**GPT-5 Mini 是一个优秀的模型，但有特殊限制！**

- ✅ 质量优秀 (⭐⭐⭐⭐)
- ✅ 价格低廉 ($0.003/次)
- ⚠️ 参数固定 (temperature=1, etc.)
- ✅ 已适配修复

**修复完成！现在可以正常使用 GPT-5 Mini 了！** 🚀

---

*最后更新：2025-01-15*
