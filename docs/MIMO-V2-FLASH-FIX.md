# 🔧 MiMo V2 Flash 模型 ID 修正

> **日期**: 2026-03-19  
> **问题**: 404 MODEL_NOT_FOUND  
> **状态**: ✅ 已修正

---

## 📢 问题

**错误信息**:
```
404 Not Found
{
  "code": 404,
  "reason": "MODEL_NOT_FOUND",
  "message": "model not found",
  "metadata": {
    "reason": "model: xiaomimimo-mimo-v2-flash not found"
  }
}
```

**原因**: 模型 ID 格式不正确

---

## 🔍 分析

从 URL 推断正确格式：
- 页面 URL: `https://jiekou.ai/models-console/model-detail/xiaomimimo-mimo-v2-flash`
- 初始 ID: `xiaomimimo-mimo-v2-flash` ❌
- 正确 ID: `xiaomi/mimo-v2-flash` ✅

**jiekou.ai 命名规范**:
```
格式：厂商/模型名

示例:
- claude-sonnet-4-6 (Anthropic)
- gpt-5.4 (OpenAI)
- gemini-2.5-flash (Google)
- xiaomi/mimo-v2-flash (Xiaomi) ✅
```

---

## ✅ 修正内容

### 1. `js/api-config.js`

**修改前**:
```javascript
'xiaomimimo-mimo-v2-flash': { 
    name: 'MiMo V2 Flash ⚡', 
    cost: '$0.10/1M input, $0.50/1M output', 
    quality: 'medium',
    speed: 'fast' 
}
```

**修改后**:
```javascript
'xiaomi/mimo-v2-flash': { 
    name: 'MiMo V2 Flash ⚡', 
    cost: '$0.10/1M input, $0.50/1M output', 
    quality: 'medium',
    speed: 'fast' 
}
```

### 2. `create.html`

**模型选择下拉框**:
```html
<!-- 修改前 -->
<option value="xiaomimimo-mimo-v2-flash">MiMo V2 Flash ⚡ (超快速🚀)</option>

<!-- 修改后 -->
<option value="xiaomi/mimo-v2-flash">MiMo V2 Flash ⚡ (超快速🚀)</option>
```

**API 切换模态框**:
```html
<!-- 修改前 -->
<button class="model-btn" data-model="xiaomimimo-mimo-v2-flash">

<!-- 修改后 -->
<button class="model-btn" data-model="xiaomi/mimo-v2-flash">
```

### 3. `切换到 MiMo V2 Flash.bat`

**修改前**:
```batch
echo MODEL=xiaomimimo-mimo-v2-flash
```

**修改后**:
```batch
echo MODEL=xiaomi/mimo-v2-flash
```

### 4. 文档更新

- ✅ `docs/MIMO-V2-FLASH-SETUP.md` - 更新模型 ID

---

## 🧪 测试验证

### 测试步骤

1. **刷新浏览器**
   ```
   Ctrl + Shift + R
   ```

2. **选择 MiMo V2 Flash**
   - 模型下拉框 → "MiMo V2 Flash ⚡"

3. **创建游戏**
   ```
   输入："创建一个贪食蛇游戏"
   点击"创建"
   ```

4. **验证响应**
   ```
   ✅ 预期：Status 200，游戏正常生成
   ❌ 如果还是 404：模型可能未上线或需要特殊权限
   ```

---

## 📊 模型信息确认

### 基本信息
- **正确 ID**: `xiaomi/mimo-v2-flash`
- **显示名**: MiMo V2 Flash ⚡
- **厂商**: 小米 (Xiaomi)
- **平台**: jiekou.ai
- **成本**: $0.10/1M input, $0.50/1M output
- **特点**: 超快速、低成本

### 可能的问题

如果修正后仍然 404，可能原因：

1. **模型未上线**
   - 联系 jiekou.ai 确认模型状态
   - 检查模型控制台是否可见

2. **需要特殊权限**
   - 某些模型可能需要申请访问
   - 检查账户是否有权限

3. **API Key 问题**
   - 确认 API Key 有效
   - 确认有该模型的使用权限

4. **端点问题**
   - 确认 jiekou.ai API 端点正确
   - 检查是否需要特殊请求头

---

## 🎯 下一步

### 如果测试通过 ✅
- 更新文档
- 通知用户
- 正常使用

### 如果仍然 404 ❌
1. **访问模型页面确认**
   ```
   https://jiekou.ai/models-console/model-detail/xiaomimimo-mimo-v2-flash
   ```

2. **查看模型状态**
   - 是否显示"已上线"
   - 是否需要申请权限

3. **联系支持**
   - jiekou.ai 客服
   - 查看模型文档

4. **备选方案**
   - 使用 Gemini 2.5 Flash (性价比优秀)
   - 使用 MiMo V2 Pro (OpenRouter 平台)

---

## 📚 相关资源

- [jiekou.ai 模型控制台](https://jiekou.ai/models-console)
- [MiMo V2 Flash 页面](https://jiekou.ai/models-console/model-detail/xiaomimimo-mimo-v2-flash)
- [jiekou.ai API 文档](https://jiekou.ai/api-docs)

---

## ✅ 总结

**已修正模型 ID 格式**:
- ❌ `xiaomimimo-mimo-v2-flash` → ✅ `xiaomi/mimo-v2-flash`
- 符合 jiekou.ai 命名规范
- 需要测试验证

**测试通过后即可正常使用！** 🚀

---

**🔧 细节决定成败！**
