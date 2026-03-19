# 🤖 模型集成规范

**创建时间**: 2025-01-15  
**约定**: 所有新集成的模型必须添加到创作页面的模型选择下拉框

---

## 📋 核心原则

> **任何新集成的模型，都必须添加到前端模型选择下拉框，让用户可以在创作页面直接切换使用。**

---

## 🎯 添加模型的完整流程

### 步骤 1: 确认模型信息

收集新模型的完整信息：

```markdown
- 模型名称：[例如：claude-sonnet-4-6]
- 显示名称：[例如：Claude Sonnet 4.6]
- 特点描述：[例如：高质量，适合复杂游戏]
- API 厂商：[jiekou.ai | 阿里云 | 其他]
- 成本：[例如：$0.02-0.08/次]
- 质量评级：[⭐⭐⭐⭐⭐]
- 是否推荐：[是/否]
```

---

### 步骤 2: 修改 `create.html`

在模型选择下拉框中添加新选项：

**文件位置**: `C:\Users\jiangym\.copaw\ai-game-platform\create.html`

**查找**:
```html
<select id="modelSelect" class="model-select">
```

**添加**:
```html
<option value="[模型 ID]">[显示名称] ([特点])</option>
```

**示例**:
```html
<select id="modelSelect" class="model-select">
    <!-- 新增模型 -->
    <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (高质量⭐)</option>
    
    <!-- 现有模型 -->
    <option value="claude-opus-4-6">Claude Opus 4.6 (旗舰质量)</option>
    <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite (快速)</option>
    <option value="gemini-2.5-flash" selected>Gemini 2.5 Flash (性价比⭐)</option>
</select>
```

**注意**:
- `value` 属性必须与 API 请求的模型名称完全一致
- 显示文本包含模型名称 + 特点标签
- 推荐模型添加 `⭐` 标记
- 默认模型添加 `selected` 属性

---

### 步骤 3: 修改 `api-config.js` (如需要)

如果新模型来自新厂商，需要更新 API 配置：

**文件位置**: `C:\Users\jiangym\.copaw\ai-game-platform\js\api-config.js`

**添加厂商配置**:
```javascript
const API_PROVIDERS = {
    jiekou: {
        name: 'jiekou.ai',
        endpoint: 'https://api.jiekou.ai/openai',
        models: [
            'claude-opus-4-6',
            'claude-sonnet-4-6',  // 新增
            'gemini-2.5-flash',
            'gemini-3.1-flash-lite-preview',
        ]
    },
    // 其他厂商...
};
```

---

### 步骤 4: 修改 `.env` (如需要)

如果新模型需要新的 API Key：

**文件位置**: `C:\Users\jiangym\.copaw\ai-game-platform\.env`

**添加**:
```bash
# 新增厂商的 API Key
API_KEY_NEW_PROVIDER=sk_xxx

# 设置模型
MODEL=new-model-name
```

**注意**: 修改 `.env` 后必须重启服务器！

---

### 步骤 5: 修改 `server.js` (如需要)

如果新模型需要特殊的路由配置：

**文件位置**: `C:\Users\jiangym\.copaw\ai-game-platform\server.js`

**添加模型路由**:
```javascript
// 模型路由配置
const MODEL_ROUTES = {
    'claude-opus-4-6': { provider: 'jiekou' },
    'claude-sonnet-4-6': { provider: 'jiekou' },  // 新增
    'gemini-2.5-flash': { provider: 'jiekou' },
    // ...
};
```

---

### 步骤 6: 更新文档

#### 6.1 更新 `docs/MODEL-SELECTOR-FEATURE.md`

在"支持的模型"表格中添加新模型信息。

#### 6.2 创建模型配置文档

创建 `docs/[MODEL-NAME]-SETUP.md`，包含：
- 模型介绍
- 配置步骤
- 测试结果
- 成本分析

#### 6.3 更新 `docs/JIEKOU-MODEL-COMPARISON.md`

在性价比分析文档中添加新模型的对比数据。

---

### 步骤 7: 测试验证

#### 测试清单

- [ ] 模型选择器显示新模型选项
- [ ] 选择新模型后能正常生成游戏
- [ ] 修改游戏也使用新模型
- [ ] 页面刷新后模型选择保持
- [ ] API 请求使用正确的模型名称
- [ ] 服务器日志显示正确的模型
- [ ] 响应时间和成本符合预期

#### 测试命令

```bash
# 1. 访问创作页面
http://localhost:3000/create.html

# 2. 选择新模型

# 3. 生成测试游戏
提示词：创建一个简单的测试游戏

# 4. 检查服务器日志
查看 api-responses/ 目录的最新响应文件

# 5. 验证模型名称
response-*.json 中的 model 字段应为新模型
```

---

## 📝 快速添加模板

### HTML 选项模板

```html
<option value="[model-id]">[Display Name] ([Feature Tag])</option>
```

### 完整示例

```html
<!-- 质量优先 -->
<option value="claude-opus-4-6">Claude Opus 4.6 (旗舰质量⭐⭐⭐⭐⭐)</option>

<!-- 性价比优先 -->
<option value="gemini-2.5-flash" selected>Gemini 2.5 Flash (性价比⭐⭐⭐⭐⭐)</option>

<!-- 速度优先 -->
<option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite (超快响应⚡)</option>

<!-- 代码专用 -->
<option value="gpt-5.3-codex">GPT-5.3 Codex (代码专用💻)</option>

<!-- 平衡选择 -->
<option value="claude-sonnet-4-6">Claude Sonnet 4.6 (高质量⭐⭐⭐⭐)</option>
```

---

## 🎯 模型分类标签

使用统一的标签系统帮助用户快速识别：

| 标签 | 含义 | 适用场景 |
|------|------|---------|
| **旗舰质量⭐⭐⭐⭐⭐** | 顶级模型，最佳效果 | 商业项目、复杂游戏 |
| **高质量⭐⭐⭐⭐** | 优秀质量，性价比高 | 日常开发、中等复杂度 |
| **性价比⭐⭐⭐⭐⭐** | 质量与成本完美平衡 | 日常使用、原型开发 |
| **快速⚡** | 响应速度快 | 快速迭代、学习测试 |
| **超快⚡⚡** | 极速响应 | 简单游戏、验证创意 |
| **代码专用💻** | 专为代码优化 | 复杂算法、代码重构 |
| **便宜💰** | 成本极低 | 大量生成、批量测试 |

---

## 📊 当前支持的模型列表

### jiekou.ai 平台

| 模型 ID | 显示名称 | 特点 | 成本 | 质量 | 状态 |
|--------|---------|------|------|------|------|
| `claude-opus-4-6` | Claude Opus 4.6 | 旗舰质量 | $0.10-0.39/次 | ⭐⭐⭐⭐⭐ | ✅ |
| `claude-sonnet-4-6` | Claude Sonnet 4.6 | 高质量 | $0.02-0.08/次 | ⭐⭐⭐⭐ | ⬜ |
| `gemini-2.5-flash` | Gemini 2.5 Flash | 性价比⭐ | $0.003/次 | ⭐⭐⭐⭐ | ✅ |
| `gemini-3.1-flash-lite-preview` | Gemini 3.1 Flash Lite | 快速 | $0.004/次 | ⭐⭐⭐ | ✅ |
| `deepseek-v3.1` | DeepSeek V3.1 | 代码优化 | $0.003/次 | ⭐⭐⭐⭐ | ⬜ |
| `gpt-5.3-codex` | GPT-5.3 Codex | 代码专用 | $0.03/次 | ⭐⭐⭐⭐⭐ | ⬜ |

### 阿里云百炼

| 模型 ID | 显示名称 | 特点 | 成本 | 质量 | 状态 |
|--------|---------|------|------|------|------|
| `qwen-plus` | Qwen Plus | 平衡选择 | ¥0.02/1K tokens | ⭐⭐⭐⭐ | ⚠️ |
| `qwen-max` | Qwen Max | 高质量 | ¥0.04/1K tokens | ⭐⭐⭐⭐ | ⬜ |

**图例**:
- ✅ 已集成并测试
- ⬜ 待集成
- ⚠️ 有问题

---

## 🔧 常见问题

### Q1: 添加新模型后不生效？

**检查清单**:
1. `.env` 是否配置了正确的 API Key
2. 服务器是否重启 (修改 `.env` 后必须重启)
3. `server.js` 是否支持该模型的路由
4. 浏览器缓存是否清除 (Ctrl+F5)

**解决步骤**:
```bash
# 1. 重启服务器
🔄 重启服务器 - 切换 Gemini.bat

# 2. 强制刷新浏览器
Ctrl + F5

# 3. 检查服务器日志
查看控制台是否有模型相关的错误
```

---

### Q2: 模型选择器不显示新模型？

**检查**:
1. `create.html` 是否正确添加 `<option>` 标签
2. `value` 属性是否与模型 ID 一致
3. 浏览器是否加载了最新的 HTML

**解决**:
```bash
# 清除浏览器缓存
Ctrl + Shift + Delete

# 或者使用无痕模式
Ctrl + Shift + N
```

---

### Q3: 如何设置默认模型？

**方法 1**: 在 HTML 中设置 `selected` 属性

```html
<option value="gemini-2.5-flash" selected>Gemini 2.5 Flash</option>
```

**方法 2**: 在 `.env` 中设置

```bash
MODEL=gemini-2.5-flash
```

**方法 3**: 用户选择后自动保存 (已实现)

---

### Q4: 不同厂商的模型如何切换？

**自动路由** (推荐):
```javascript
// server.js 自动根据模型名称路由到对应厂商
const MODEL_ROUTES = {
    'claude-opus-4-6': { provider: 'jiekou' },
    'qwen-plus': { provider: 'aliyun' },
};
```

**手动切换**:
1. 点击底部 API 状态栏
2. 选择目标厂商
3. 确认切换
4. 重启服务器

---

## 📈 未来扩展

### 1. 动态加载模型列表

从服务器 API 动态获取支持的模型列表：

```javascript
async function loadModelList() {
    const response = await fetch('/api/models');
    const models = await response.json();
    
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = `${model.name} (${model.tag})`;
        elements.modelSelect.appendChild(option);
    });
}
```

### 2. 显示实时成本

```javascript
function updateModelCost(modelId) {
    const cost = getModelCost(modelId);
    document.getElementById('modelCost').textContent = 
        `预计成本：$${cost}/次`;
}
```

### 3. 模型推荐系统

```javascript
function recommendModel(prompt) {
    const complexity = analyzeComplexity(prompt);
    
    if (complexity > 0.8) {
        return 'claude-opus-4-6';
    } else if (complexity > 0.5) {
        return 'gemini-2.5-flash';
    } else {
        return 'gemini-3.1-flash-lite-preview';
    }
}
```

### 4. 模型性能统计

```javascript
const modelStats = {
    'gemini-2.5-flash': {
        avgResponseTime: '2.5s',
        successRate: '99.5%',
        avgCost: '$0.003',
    },
    // ...
};
```

---

## ✅ 检查清单

每次添加新模型时，确保完成以下步骤：

- [ ] **HTML**: 在 `create.html` 添加 `<option>` 标签
- [ ] **配置**: 在 `api-config.js` 添加模型配置 (如需要)
- [ ] **环境变量**: 在 `.env` 添加 API Key (如需要)
- [ ] **后端**: 在 `server.js` 添加路由配置 (如需要)
- [ ] **文档**: 更新 `docs/MODEL-SELECTOR-FEATURE.md`
- [ ] **文档**: 更新 `docs/JIEKOU-MODEL-COMPARISON.md`
- [ ] **测试**: 验证模型选择器显示新模型
- [ ] **测试**: 验证生成游戏使用新模型
- [ ] **测试**: 验证修改游戏使用新模型
- [ ] **测试**: 验证页面刷新后模型保持
- [ ] **重启**: 重启服务器 (如修改了 `.env`)
- [ ] **清理**: 清除浏览器缓存

---

## 🎯 总结

**核心约定**:
> 任何新集成的模型，都必须添加到前端模型选择下拉框！

**添加位置**:
- `create.html` → `<select id="modelSelect">` 内添加 `<option>`

**关键属性**:
- `value="[模型 ID]"` - 必须与 API 请求的模型名称一致
- `selected` - 标记默认模型
- 显示文本包含模型名称 + 特点标签 + 推荐标记

**测试验证**:
- 前端显示 ✓
- API 请求 ✓
- 模型持久化 ✓
- 生成/修改 ✓

---

**记住这个约定，未来所有新模型都要添加到下拉框！** 🎮🚀

*最后更新：2025-01-15*
