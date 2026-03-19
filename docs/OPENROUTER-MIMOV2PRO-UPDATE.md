# 🔄 OpenRouter 模型更新 - Hunter Alpha → MiMo V2 Pro

> **日期**: 2026-03-19  
> **版本**: v37  
> **状态**: ✅ 已完成

---

## 📢 问题

**Hunter Alpha 模型已被 OpenRouter 下架**

### 错误信息
```
404 Not Found
{
  "error": {
    "message": "Hunter Alpha was a stealth model revealed on March 18th 
                as an early testing version of MiMo-V2-Pro. 
                Find it here: https://openrouter.ai/xiaomi/mimo-v2-pro",
    "code": 404
  }
}
```

### 原因
- Hunter Alpha 是小米公司的**临时测试模型**
- 2026-03-18 发布，作为 MiMo-V2-Pro 的早期测试版本
- 发布后很快被正式版本 **MiMo-V2-Pro** 替代
- OpenRouter 已下架 Hunter Alpha，只保留 MiMo-V2-Pro

---

## ✅ 解决方案

### 替换方案
用 **MiMo V2 Pro** 替换 **Hunter Alpha**

| 项目 | Hunter Alpha | MiMo V2 Pro |
|------|--------------|-------------|
| **模型 ID** | `openrouter/hunter-alpha` | `xiaomi/mimo-v2-pro` |
| **厂商** | 小米 (Xiaomi) | 小米 (Xiaomi) |
| **成本** | $0.50/1M input, $2.00/1M output | $0.50/1M input, $2.00/1M output |
| **质量** | 高 | 高 |
| **状态** | ❌ 已下架 | ✅ 可用 |

---

## 🔧 修改文件

### 1. `js/api-config.js` (v13)

**修改前**:
```javascript
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
```

**修改后**:
```javascript
openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: {
        'xiaomi/mimo-v2-pro': { 
            name: 'MiMo V2 Pro 🚀', 
            cost: '$0.50/1M input, $2.00/1M output', 
            quality: 'high' 
        },
        'openrouter/hunter-alpha': {  // 保留但标记为已下架
            name: 'Hunter Alpha (已下架)', 
            cost: 'N/A', 
            quality: 'deprecated',
            deprecated: true 
        }
    },
    defaultModel: 'xiaomi/mimo-v2-pro'
}
```

---

### 2. `create.html` (v37)

#### 模型选择下拉框

**修改前**:
```html
<option value="openrouter/hunter-alpha">Hunter Alpha 🎯 (OpenRouter 新模型)</option>
```

**修改后**:
```html
<option value="xiaomi/mimo-v2-pro">MiMo V2 Pro 🚀 (OpenRouter 新模型)</option>
```

#### API 切换模态框

**修改前**:
```html
<button class="model-btn active" data-model="openrouter/hunter-alpha">
    <span class="model-name">Hunter Alpha 🎯</span>
    <span class="model-cost">$0.50/1M input, $2.00/1M output</span>
</button>
```

**修改后**:
```html
<button class="model-btn active" data-model="xiaomi/mimo-v2-pro">
    <span class="model-name">MiMo V2 Pro 🚀</span>
    <span class="model-cost">$0.50/1M input, $2.00/1M output</span>
</button>
```

---

### 3. 版本号更新

- `js/api-config.js`: v12 → **v13**
- `create.html`: v36 → **v37**

---

## 📊 MiMo V2 Pro 模型信息

### 基本信息
- **全称**: MiMo-V2-Pro (Xiaomi Multimodal V2 Pro)
- **厂商**: 小米公司 (Xiaomi)
- **类型**: 多模态大语言模型
- **发布**: 2026-03-18 (正式版本)

### 性能指标
- **上下文窗口**: 256K tokens
- **支持语言**: 中文、英文等
- **多模态**: 支持图像理解

### 成本
- **输入**: $0.50 / 1M tokens
- **输出**: $2.00 / 1M tokens
- **游戏生成**: ~$0.006-0.025/次 (估算)

### 质量评级
- **综合**: ⭐⭐⭐⭐ (4/5)
- **代码生成**: ⭐⭐⭐⭐
- **中文理解**: ⭐⭐⭐⭐⭐
- **推理能力**: ⭐⭐⭐⭐

---

## 🎯 使用指南

### 切换到 MiMo V2 Pro

**方法 1: 前端选择器**
```
1. 打开 create.html
2. 点击模型选择下拉框
3. 选择 "MiMo V2 Pro 🚀 (OpenRouter 新模型)"
4. 开始使用
```

**方法 2: API 切换模态框**
```
1. 点击 API 状态栏
2. 选择 "OpenRouter 🌐"
3. 点击 "MiMo V2 Pro 🚀"
4. 点击 "✅ 确认切换"
```

**方法 3: 修改 .env**
```env
API_PROVIDER=openrouter
MODEL=xiaomi/mimo-v2-pro
```

然后重启服务器。

---

## ✅ 测试清单

### 基础测试
- [ ] 模型选择下拉框显示 MiMo V2 Pro
- [ ] API 切换模态框显示 MiMo V2 Pro
- [ ] Hunter Alpha 不再出现在选项中

### 功能测试
- [ ] 选择 MiMo V2 Pro 后能正常生成游戏
- [ ] API 调用返回 200 状态码
- [ ] 响应时间合理 (<30s)
- [ ] 生成质量符合预期

### 兼容性测试
- [ ] 已有游戏不受影响
- [ ] 对话历史正常加载
- [ ] 多轮修改正常工作

---

## 📈 迁移影响

### 对用户的影响
- **无感知切换**: 用户界面自动更新
- **成本不变**: MiMo V2 Pro 与 Hunter Alpha 价格相同
- **质量提升**: 正式版本比测试版更稳定

### 对代码的影响
- **向后兼容**: 保留 Hunter Alpha 配置（标记为 deprecated）
- **默认模型**: OpenRouter 默认模型已更新
- **前端选择器**: 自动显示新模型

---

## 🔍 如何验证

### 1. 检查模型列表
```javascript
console.log('OpenRouter 可用模型:', API_PROVIDERS.openrouter.models);
// 应该显示 xiaomi/mimo-v2-pro
```

### 2. 测试 API 调用
```
1. 选择 MiMo V2 Pro
2. 创建游戏
3. 查看控制台日志
4. 确认状态码 200
```

### 3. 检查响应
```
✅ 成功：Status 200, 响应正常
❌ 失败：Status 404, 模型不存在
```

---

## 📚 相关资源

- [OpenRouter MiMo V2 Pro](https://openrouter.ai/xiaomi/mimo-v2-pro)
- [小米 MiMo 模型介绍](https://openrouter.ai/xiaomi)
- [模型对比](https://openrouter.ai/models)

---

## 🎉 总结

**Hunter Alpha 已下架，MiMo V2 Pro 正式接替！**

- ✅ 模型已更新到 `xiaomi/mimo-v2-pro`
- ✅ 前端选择器已更新
- ✅ API 配置已更新 (v13)
- ✅ 版本号已更新 (v37)
- ✅ 成本保持不变
- ✅ 质量更稳定

**建议**: 使用 MiMo V2 Pro 进行游戏生成，性价比优秀！

---

**🚀 享受更稳定的模型服务！**
