# 🚀 Gemini 3.1 Flash Lite 快速参考

> 一键查询关键信息

---

## 📋 核心配置

```env
API_PROVIDER=jiekou
MODEL=gemini-3.1-flash-lite-preview
API_KEY=sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8
```

---

## 💰 成本

| 项目 | 价格 |
|------|------|
| 输入 | $0.25 / 1M tokens |
| 输出 | $1.5 / 1M tokens |
| 单次游戏 | ~$0.006 |
| 月 1000 次 | ~$6 |

**对比 Claude**: 节省 **95%** 成本 💰

---

## ⚡ 性能

- **响应时间**: ~2-4 秒
- **上下文**: 1,048,576 tokens
- **最大输出**: 65,536 tokens
- **推荐度**: ⭐⭐⭐⭐⭐

---

## 🎯 适用场景

✅ **推荐**:
- 简单游戏生成
- 快速原型开发
- 成本敏感项目
- 快速响应需求

⚠️ **谨慎**:
- 复杂游戏逻辑
- 深度推理任务
- 最高质量要求

---

## 🔧 快速命令

```bash
# 测试 API
node test-gemini-simple.js

# 重启服务器
重启服务器.bat

# 切换模型
switch-api-provider.bat
```

---

## 🌐 访问地址

- **创作页面**: http://localhost:3000/create.html
- **API 状态**: 查看页面底部状态栏
- **控制台**: https://jiekou.ai/

---

## 📊 模型对比

| 模型 | 成本 | 质量 | 速度 | 推荐 |
|------|------|------|------|------|
| **Gemini 3.1 Flash Lite** | $ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ |
| Claude Opus 4.6 | $$$$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| Gemini 2.5 Flash | $ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🐛 常见问题

**401 错误**: 检查 API Key 是否正确  
**404 错误**: 检查模型名称拼写  
**空响应**: 增加 max_tokens 或简化 prompt  
**响应慢**: 检查网络或切换模型

---

## 📁 文档

- **完整指南**: `docs/GEMINI-3.1-FLASH-LITE-SETUP.md`
- **配置说明**: `docs/GEMINI-CONFIG-COMPLETE.md`
- **Agent 指南**: `AGENTS.md`
- **自我改进**: `SELF-IMPROVEMENT.md`

---

*最后更新：2025-01-15*  
*状态：✅ 生产就绪*
