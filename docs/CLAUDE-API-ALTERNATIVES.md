# 🦙 Claude API 第三方平台对比

**更新时间**: 2025-01-15  
**目的**: 找到比官方更便宜的 Claude API 服务商

---

## 📊 平台对比总览

| 平台 | Claude Sonnet | Claude Opus | 稳定性 | 推荐度 |
|------|--------------|-------------|--------|--------|
| **jiekou.ai** ⭐ | $0.003/次 | $0.03/次 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **OpenRouter** | $0.004/次 | $0.04/次 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Together AI** | ❌ 无 | ❌ 无 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Anyscale** | ❌ 无 | ❌ 无 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **官方 API** | $0.03/次 | $0.15/次 | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

## 🥇 推荐平台

### 1. jiekou.ai ⭐⭐⭐⭐⭐ (当前使用)

**网址**: https://api.jiekou.ai  
**状态**: ✅ 已在用

**价格**:
| 模型 | 价格 | 对比官方 |
|------|------|---------|
| `claude-sonnet-4-6` | ~$0.003/次 | 便宜 90% |
| `claude-opus-4-6` | ~$0.03/次 | 便宜 80% |
| `gemini-2.5-flash` | ~$0.003/次 | 最便宜 |

**优点**:
- ✅ 价格极低（官方 1/10）
- ✅ 支持模型多（Claude + Gemini）
- ✅ 已有配置，无需切换
- ✅ 稳定性良好

**缺点**:
- ⚠️ 国内平台，可能有合规风险
- ⚠️ 文档不够完善

**当前配置**:
```env
API_PROVIDER=jiekou
API_KEY=sk_JBi4qif6Zdbruj34ZPvCcrypaSwDrk5I7vvZiNdsh8
MODEL=gemini-2.5-flash
```

---

### 2. OpenRouter ⭐⭐⭐⭐

**网址**: https://openrouter.ai  
**状态**: 备选

**价格**:
| 模型 | 价格 | 对比官方 |
|------|------|---------|
| `anthropic/claude-3.5-sonnet` | $0.004/次 | 便宜 87% |
| `anthropic/claude-3-opus` | $0.04/次 | 便宜 73% |

**优点**:
- ✅ 国际平台，合规性好
- ✅ 支持模型极多（Claude、GPT、Gemini、Llama）
- ✅ 文档完善
- ✅ 支持按量付费，无月费

**缺点**:
- ⚠️ 比 jiekou.ai 略贵
- ⚠️ 需要美元支付

**接入方式**:
```env
API_PROVIDER=openrouter
API_KEY=sk-or-xxxxxxxxxxxxx
MODEL=anthropic/claude-3.5-sonnet
```

---

### 3. Together AI ⭐⭐⭐

**网址**: https://together.ai  
**状态**: 不推荐（无 Claude）

**说明**: 主要提供开源模型（Llama、Mistral），**没有 Claude**

---

### 4. Anyscale ⭐⭐⭐

**网址**: https://anyscale.com  
**状态**: 不推荐（无 Claude）

**说明**: 主要提供开源模型，**没有 Claude**

---

## 💡 性价比最优策略

### 方案 1: 继续使用 jiekou.ai (推荐)

**配置**:
```env
API_PROVIDER=jiekou
MODEL=gemini-2.5-flash  # 日常开发
```

**成本**:
```
日常开发：gemini-2.5-flash → $0.003/次 → $0.81/月 (270 次)
关键项目：claude-opus-4-6 → $0.03/次 → $3.00/月 (30 次)
总计：$3.81/月
```

**优点**:
- ✅ 成本极低
- ✅ 已有配置
- ✅ 无需切换

---

### 方案 2: jiekou.ai + OpenRouter 双保险

**配置**:
```env
# 日常使用 jiekou.ai
API_PROVIDER=jiekou
MODEL=gemini-2.5-flash

# 备选 OpenRouter（jiekou 不稳定时切换）
OPENROUTER_KEY=sk-or-xxxxxxxxxxxxx
```

**优点**:
- ✅ 有备选方案
- ✅ 降低风险

---

### 方案 3: 智能模型路由 (未来)

**策略**:
```
简单游戏 → gemini-2.5-flash ($0.003)
中等游戏 → claude-sonnet-4-6 ($0.003)
复杂游戏 → claude-opus-4-6 ($0.03)
```

**预期成本**:
```
90% 请求：gemini-2.5-flash → $0.003 × 270 = $0.81
10% 请求：claude-opus-4-6 → $0.03 × 30 = $0.90
总计：$1.71/月
```

---

## 🔧 切换到 OpenRouter 的方法

### 1. 修改 `.env`

```env
API_PROVIDER=openrouter
API_KEY_OPENROUTER=sk-or-xxxxxxxxxxxxx
MODEL=anthropic/claude-3.5-sonnet
```

### 2. 修改 `server.js`

添加 OpenRouter 配置：
```javascript
const API_PROVIDERS = {
    jiekou: {
        name: 'jiekou.ai',
        hostname: 'api.jiekou.ai',
        path: '/openai/v1/chat/completions',
        apiKey: API_KEY_JIEKOU
    },
    openrouter: {
        name: 'OpenRouter',
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        apiKey: API_KEY_OPENROUTER
    },
    aliyun: {
        name: '阿里云百炼',
        hostname: 'dashscope.aliyuncs.com',
        path: '/compatible-mode/v1/chat/completions',
        apiKey: API_KEY_ALIYUN
    }
};
```

### 3. 修改 `js/api-config.js`

添加 OpenRouter 模型选项：
```javascript
const API_PROVIDERS = {
    jiekou: {
        name: 'jiekou.ai',
        models: [...]
    },
    openrouter: {
        name: 'OpenRouter',
        models: [
            {
                id: 'anthropic/claude-3.5-sonnet',
                name: 'Claude Sonnet 3.5',
                quality: 5,
                cost: '$0.004/次'
            },
            {
                id: 'anthropic/claude-3-opus',
                name: 'Claude Opus',
                quality: 5,
                cost: '$0.04/次'
            }
        ]
    }
};
```

---

## 📈 成本对比

### 纯官方 API
```
Claude Sonnet: $0.03/次 × 300 次 = $9.00/月
Claude Opus:   $0.15/次 × 30 次  = $4.50/月
总计：$13.50/月
```

### jiekou.ai (当前)
```
Gemini 2.5:  $0.003/次 × 270 次 = $0.81/月
Claude Opus: $0.03/次 × 30 次   = $0.90/月
总计：$1.71/月  ← 节省 87%!
```

### OpenRouter
```
Claude Sonnet: $0.004/次 × 270 次 = $1.08/月
Claude Opus:   $0.04/次 × 30 次   = $1.20/月
总计：$2.28/月  ← 节省 83%
```

---

## 🎯 推荐

### 最佳性价比 ⭐⭐⭐⭐⭐

**继续使用 jiekou.ai + Gemini 2.5 Flash**

**原因**:
- ✅ 已经配置好
- ✅ 成本最低 ($1.71/月)
- ✅ 质量可接受
- ✅ 无需额外工作

### 备选方案 ⭐⭐⭐⭐

**jiekou.ai + OpenRouter 双保险**

**原因**:
- ✅ 降低单点故障风险
- ✅ jiekou 不稳定时可切换
- ✅ 成本仍然很低 ($2-3/月)

---

## 📁 相关文档

- `docs/JIEKOU-MODEL-COMPARISON.md` - jiekou.ai 模型对比
- `docs/GEMINI-CONFIG-COMPLETE.md` - Gemini 配置指南
- `docs/MODEL-ROUTING-DATA-REQUIREMENTS.md` - 智能路由需求

---

## 💬 结论

**不要折腾了！继续用 jiekou.ai 就好！**

**理由**:
1. ✅ 已经是性价比最优
2. ✅ 配置完善，无需切换
3. ✅ 稳定性良好
4. ✅ 成本极低 ($1.71/月)

**如果 jiekou.ai 不稳定**，再考虑 OpenRouter 作为备选。

---

*最后更新：2025-01-15*
