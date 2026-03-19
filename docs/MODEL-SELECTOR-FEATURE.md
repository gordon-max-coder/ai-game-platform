# 🤖 模型选择器功能

**添加时间**: 2025-01-15  
**功能**: 允许用户在创作页面直接选择 AI 模型

---

## 📝 功能说明

在创作页面的灵感按钮下方，新增了一个模型选择下拉框，用户可以随时切换不同的 AI 模型来生成游戏。

### 支持的模型

| 模型 | 特点 | 成本 | 质量 |
|------|------|------|------|
| **Claude Opus 4.6** | 旗舰质量，适合复杂游戏 | $0.10-0.39/game | ⭐⭐⭐⭐⭐ |
| **Gemini 3.1 Flash Lite Preview** | 快速响应，适合原型 | $0.004/game | ⭐⭐⭐ |
| **Gemini 2.5 Flash** ⭐ | 性价比最优，默认推荐 | $0.003/game | ⭐⭐⭐⭐ |

---

## 🎨 UI 位置

```
┌─────────────────────────────────┐
│  💬 对话输入框                  │
│  [输入提示词...]    [🚀 生成]  │
│                                 │
│  [🎲 灵感]                      │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🤖 模型选择             │   │  ← 新增
│  │ [Claude Opus 4.6    ▼] │   │
│  │ 💡 不同模型质量和成本   │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 提示：描述越详细...         │
└─────────────────────────────────┘
```

---

## 🔧 技术实现

### 1. HTML 结构

```html
<div class="model-selector">
    <label for="modelSelect" class="model-label">🤖 模型选择</label>
    <select id="modelSelect" class="model-select">
        <option value="claude-opus-4-6">Claude Opus 4.6 (旗舰质量)</option>
        <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite (快速)</option>
        <option value="gemini-2.5-flash" selected>Gemini 2.5 Flash (性价比⭐)</option>
    </select>
    <div class="model-hint">
        <span>💡 不同模型质量和成本不同，默认推荐性价比最优</span>
    </div>
</div>
```

### 2. CSS 样式

- 深色主题匹配整体设计
- 悬停效果：边框高亮
- 焦点效果：紫色光晕
- 响应式设计

### 3. JavaScript 逻辑

#### 初始化

```javascript
function loadDefaultModel() {
    // 1. 优先从 localStorage 加载用户上次选择的模型
    const savedModel = localStorage.getItem('selectedModel');
    
    // 2. 否则从 API 配置加载默认模型
    const configModel = window.API_CONFIG.model;
    
    // 3. 默认使用 gemini-2.5-flash
}
```

#### 模型切换

```javascript
elements.modelSelect.addEventListener('change', (e) => {
    const selectedModel = e.target.value;
    
    // 更新 API 配置
    window.API_CONFIG.model = selectedModel;
    
    // 保存到 localStorage
    localStorage.setItem('selectedModel', selectedModel);
});
```

#### 发送请求

```javascript
async function generateGame() {
    // 使用用户选择的模型
    const selectedModel = elements.modelSelect?.value || API_CONFIG.model;
    
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            model: selectedModel,  // ← 使用用户选择的模型
            messages: [...]
        })
    });
}
```

---

## 📊 用户行为流程

### 首次访问

1. 页面加载 → 自动选择默认模型 (gemini-2.5-flash)
2. 用户输入提示词
3. 点击生成 → 使用默认模型生成游戏

### 切换模型

1. 用户点击模型下拉框
2. 选择其他模型 (如 Claude Opus 4.6)
3. 模型自动保存
4. 下次生成使用新选择的模型

### 页面刷新

1. 页面重新加载
2. 从 localStorage 读取上次选择的模型
3. 自动恢复到用户上次使用的模型

---

## 🎯 使用场景

### 场景 1: 日常开发

**选择**: Gemini 2.5 Flash  
**理由**: 性价比最优，适合快速迭代  
**成本**: ~$0.003/次

### 场景 2: 复杂游戏

**选择**: Claude Opus 4.6  
**理由**: 旗舰质量，代码结构更完整  
**成本**: ~$0.10-0.39/次

### 场景 3: 快速原型

**选择**: Gemini 3.1 Flash Lite  
**理由**: 响应速度快，适合验证创意  
**成本**: ~$0.004/次

---

## 💾 数据存储

### LocalStorage

```javascript
// 保存用户选择的模型
localStorage.setItem('selectedModel', 'gemini-2.5-flash');

// 读取用户选择的模型
const savedModel = localStorage.getItem('selectedModel');
```

### 持久化

- ✅ 模型选择会保存到 localStorage
- ✅ 页面刷新后自动恢复
- ✅ 不同浏览器独立保存
- ✅ 不同用户独立保存

---

## 🔄 与 API 切换模态框的区别

### 模型选择器 (新增)

- **位置**: 创作页面左侧，灵感按钮下方
- **用途**: 快速切换单个模型
- **操作**: 下拉框一键切换
- **持久化**: 保存到 localStorage
- **适用**: 日常使用，频繁切换

### API 切换模态框 (原有)

- **位置**: 点击底部 API 状态栏弹出
- **用途**: 切换 API 厂商和模型
- **操作**: 模态框选择，需要确认
- **持久化**: 保存到 .env 文件 (需要重启服务器)
- **适用**: 切换 API 厂商 (jiekou ↔ 阿里云)

---

## 📁 修改的文件

### 1. `create.html`

- 添加模型选择器 HTML 结构
- 位置：灵感按钮下方

### 2. `css/create-layout.css`

- 添加 `.model-selector` 样式
- 添加 `.model-select` 样式
- 添加 `.model-hint` 样式

### 3. `js/create-new.js`

- 添加 `elements.modelSelect` 元素缓存
- 添加 `loadDefaultModel()` 函数
- 修改 `generateGame()` 使用用户选择的模型
- 修改 `modifyGame()` 使用用户选择的模型
- 添加模型选择器事件监听

---

## ✅ 测试方法

### 测试 1: 默认模型加载

1. 访问创作页面
2. 检查模型选择器默认值
3. 应为：`Gemini 2.5 Flash (性价比⭐)`

### 测试 2: 切换模型

1. 选择 `Claude Opus 4.6`
2. 输入提示词生成游戏
3. 检查 API 请求使用的模型
4. 应为：`claude-opus-4-6`

### 测试 3: 持久化

1. 选择 `Claude Opus 4.6`
2. 刷新页面
3. 检查模型选择器
4. 应仍为：`Claude Opus 4.6`

### 测试 4: 修改游戏

1. 创建游戏
2. 切换模型
3. 点击修改按钮
4. 输入修改要求
5. 检查 API 请求使用的模型
6. 应为：用户选择的模型

---

## 🎨 样式定制

### 修改颜色

```css
.model-selector {
    border-color: #6366f1;  /* 边框颜色 */
}

.model-select:focus {
    border-color: #8b5cf6;  /* 焦点边框颜色 */
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);  /* 光晕颜色 */
}
```

### 修改尺寸

```css
.model-selector {
    padding: 1.5rem;  /* 内边距 */
}

.model-select {
    font-size: 1rem;  /* 字体大小 */
    padding: 1rem;    /* 内边距 */
}
```

---

## 🚀 未来扩展

### 1. 显示模型成本

```html
<div class="model-cost">
    <span>预计成本：$0.003/次</span>
</div>
```

### 2. 显示模型状态

```html
<div class="model-status">
    <span class="status-indicator online">● 在线</span>
</div>
```

### 3. 添加更多模型

```html
<option value="claude-sonnet-4-6">Claude Sonnet 4.6 (高质量)</option>
<option value="gpt-5.3-codex">GPT-5.3 Codex (代码专用)</option>
```

### 4. 模型推荐

根据游戏复杂度自动推荐模型：

```javascript
function recommendModel(prompt) {
    if (prompt.includes('复杂') || prompt.includes('多关卡')) {
        return 'claude-opus-4-6';
    } else {
        return 'gemini-2.5-flash';
    }
}
```

---

## ⚠️ 注意事项

1. **模型可用性**: 确保选择的模型在 API 厂商处可用
2. **API Key**: 不同模型可能需要不同的 API Key
3. **成本差异**: 旗舰模型成本可能是轻量级模型的 10-100 倍
4. **响应时间**: 高质量模型响应时间可能更长

---

## 🔧 故障排除

### 问题 1: 模型选择器不显示

**检查**:
- HTML 是否正确添加
- CSS 是否加载
- 浏览器缓存是否清除

**解决**:
```bash
Ctrl + F5 强制刷新
```

### 问题 2: 切换模型后不生效

**检查**:
- JavaScript 控制台是否有错误
- API 配置是否正确
- 服务器是否重启

**解决**:
```bash
# 重启服务器
🔄 重启服务器 - 切换 Gemini.bat
```

### 问题 3: 模型选择未保存

**检查**:
- localStorage 是否可用
- 浏览器是否禁用本地存储

**解决**:
```javascript
// 检查 localStorage
console.log(localStorage.getItem('selectedModel'));
```

---

**功能完成！现在用户可以自由选择 AI 模型生成游戏了！** 🎉

*最后更新：2025-01-15*
