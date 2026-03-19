# ✅ 黑屏问题修复 - Markdown 代码块处理

**修复时间**: 2025-01-15  
**问题**: API 返回的游戏代码渲染黑屏  
**原因**: 响应包含 markdown 代码块（\`\`\`html... \`\`\`），没有提取就直接保存

---

## 🐛 问题分析

### 响应数据格式

**API 返回的原始内容**:
```
```html
<!DOCTYPE html>
<html>
...
</html>
```
```

**问题**:
- ❌ `gameCode` 字段包含了 markdown 标记
- ❌ iframe 无法解析 markdown 格式
- ❌ 导致黑屏（没有有效的 HTML）

### 问题根源

**之前的代码** (`server.js`):
```javascript
const logData = {
    gameCode: responseData.choices?.[0]?.message?.content || '',
    // ❌ 直接保存原始响应，包含 markdown
};
```

**保存的文件**:
```json
{
  "gameCode": "```html\n<!DOCTYPE html>...\n```"
  // ❌ 包含 markdown 标记
}
```

---

## ✅ 修复方案

### 1. 后端提取 HTML (`server.js`)

**在保存之前提取 HTML 代码**:

```javascript
const responseData = JSON.parse(apiResponse);

// 提取 HTML 代码（去除 markdown）
let rawGameCode = responseData.choices?.[0]?.message?.content || '';
let extractedGameCode = rawGameCode;

if (rawGameCode.includes('```html')) {
    const start = rawGameCode.indexOf('```html') + 7;
    const end = rawGameCode.indexOf('```', start);
    if (end !== -1) extractedGameCode = rawGameCode.substring(start, end).trim();
} else if (rawGameCode.includes('```')) {
    const start = rawGameCode.indexOf('```') + 3;
    const end = rawGameCode.indexOf('```', start);
    if (end !== -1) extractedGameCode = rawGameCode.substring(start, end).trim();
}

const logData = {
    gameCode: extractedGameCode,  // ✅ 保存提取后的 HTML
    rawGameCode: rawGameCode,     // 保留原始响应（用于调试）
    rawResponse: responseData,
    ...
};
```

### 2. 简化 HTML 保存逻辑

**之前** (重复提取):
```javascript
const htmlContent = logData.gameCode;
const htmlMatch = htmlContent.match(/```html([\s\S]*?)```/);
const htmlCode = htmlMatch ? htmlMatch[1] : htmlContent;
```

**现在** (直接使用提取后的):
```javascript
const htmlCode = logData.gameCode;  // 已经在上面提取过了
```

---

## 📝 修改的文件

| 文件 | 修改内容 | 说明 |
|------|---------|------|
| `server.js` | 添加 HTML 提取逻辑 | 在保存 JSON 之前提取 |
| `server.js` | 添加 `rawGameCode` 字段 | 保留原始响应用于调试 |
| `server.js` | 简化 HTML 保存逻辑 | 直接使用提取后的代码 |

---

## 🔄 数据流程

### 修复前 ❌

```
API 响应
  ↓
包含 markdown: ```html...```
  ↓
直接保存到 gameCode
  ↓
JSON 文件：gameCode = "```html...```"
  ↓
iframe 加载 markdown
  ↓
❌ 黑屏（无法解析）
```

### 修复后 ✅

```
API 响应
  ↓
包含 markdown: ```html...```
  ↓
提取 HTML（去除 markdown）
  ↓
保存到 gameCode = "<!DOCTYPE html>..."
保存到 rawGameCode = "```html...```"
  ↓
JSON 文件：gameCode = "<!DOCTYPE html>..."
  ↓
iframe 加载 HTML
  ↓
✅ 正常显示
```

---

## 📊 响应文件结构

### 修复后的 JSON 文件

```json
{
  "timestamp": "2026-03-12T09:44:11.034Z",
  "provider": "jiekou",
  "model": "gemini-2.5-flash",
  "messagesCount": 3,
  "messages": [...],
  "prompt": "你是专业的游戏开发 AI 助手。",
  "gameCode": "<!DOCTYPE html>...",  // ✅ 提取后的 HTML
  "rawGameCode": "```html\n...```",  // 原始响应（调试用）
  "rawResponse": {...},
  "usage": {...},
  "duration": 14483
}
```

### 字段说明

| 字段 | 说明 | 用途 |
|------|------|------|
| `gameCode` | 提取后的 HTML | ✅ 用于 iframe 渲染 |
| `rawGameCode` | 原始响应（含 markdown） | 🔍 用于调试 |
| `rawResponse` | 完整 API 响应 | 🔍 用于调试 |

---

## ✅ 验证方法

### 1. 检查新的响应文件

```bash
cd "C:\Users\jiangym\.copaw\ai-game-platform\api-responses"
dir /OD *.json | findstr /V "game-"
```

查看最新的 `response-*.json`:
```json
{
  "gameCode": "<!DOCTYPE html>...",  // ✅ 应该以 <!DOCTYPE 开头
  "rawGameCode": "```html..."        // 原始响应
}
```

### 2. 检查 HTML 文件

```bash
type game-*.html | more
```

应该直接是有效的 HTML，没有 markdown 标记。

### 3. 测试游戏生成

1. 刷新浏览器
2. 创建游戏："创建一个飞机大战"
3. 检查预览：
   - ✅ 应该正常显示游戏
   - ❌ 不再是黑屏

---

## 🎯 支持的 markdown 格式

### 格式 1: 带语言标记

**输入**:
````
```html
<!DOCTYPE html>
...
```
````

**提取**:
```html
<!DOCTYPE html>
...
```

### 格式 2: 不带语言标记

**输入**:
````
```
<!DOCTYPE html>
...
```
````

**提取**:
```html
<!DOCTYPE html>
...
```

### 格式 3: 直接 HTML

**输入**:
```html
<!DOCTYPE html>
...
```

**提取**:
```html
<!DOCTYPE html>
...
```
(保持不变)

---

## 🔧 前端提取逻辑（双重保护）

**前端** (`create-new.js`) 也有相同的提取逻辑：

```javascript
function extractHtmlCode(text) {
    if (text.includes('```html')) {
        const start = text.indexOf('```html') + 7;
        const end = text.indexOf('```', start);
        if (end !== -1) text = text.substring(start, end).trim();
    } else if (text.includes('```')) {
        const start = text.indexOf('```') + 3;
        const end = text.indexOf('```', start);
        if (end !== -1) text = text.substring(start, end).trim();
    }
    
    return text;
}
```

**双重保护**:
- ✅ 后端提取（保存前）
- ✅ 前端提取（渲染前）
- ✅ 确保万无一失

---

## 💡 经验教训

### 问题

1. ❌ 没有检查 API 响应的格式
2. ❌ 直接保存原始内容
3. ❌ 没有验证 HTML 有效性

### 改进

1. ✅ 在保存前提取 HTML
2. ✅ 保留原始响应用于调试
3. ✅ 前后端双重提取保护
4. ✅ 添加 `rawGameCode` 字段便于排查

---

## 📁 相关文档

- `docs/MARKDOWN-FIX.md` - 本文档
- `docs/CONTEXT-DEBUG-GUIDE.md` - 上下文调试指南
- `docs/CONTEXT-MEMORY-FIX.md` - 上下文记忆修复

---

## 🎉 总结

**问题**: API 返回 markdown 格式，导致黑屏  
**原因**: 没有提取 HTML 就直接保存  
**解决**: 后端保存前提取，前端渲染前再提取（双重保护）

**效果**:
- ✅ 游戏正常显示
- ✅ 不再黑屏
- ✅ 保留原始响应用于调试
- ✅ 前后端双重保护

**修复完成！现在游戏应该能正常显示了！** 🎮✨

---

*最后更新：2025-01-15*
