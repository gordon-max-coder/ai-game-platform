# 🔑 jiekou.ai API Key 获取指南

## ⚠️ 当前状态
- **错误**: 401 Unauthorized - failed to authenticate API key
- **原因**: 当前 API Key 是阿里云的，不适用于 jiekou.ai
- **解决**: 需要获取 jiekou.ai 的 API Key

---

## 📋 步骤 1：访问 jiekou.ai 控制台

### 方式 A：直接访问
```
https://jiekou.ai/
```

### 方式 B：模型详情页
```
https://jiekou.ai/models-console/model-detail/gemini-3.1-flash-lite-preview
```

---

## 🔐 步骤 2：登录/注册账号

1. 点击右上角「登录」或「开始使用」
2. 使用邮箱或手机号注册/登录
3. 完成账号验证

---

## 💰 步骤 3：充值/购买资源包

jiekou.ai 使用预付费模式：

### 资源包价格
- **入门包**: $14.9/月
- **标准包**: 查看更多选项

### Gemini 3.1 Flash Lite 定价
- **输入**: $0.25 / 百万 tokens
- **输出**: $1.5 / 百万 tokens
- **Cache write**: $0.0833 / 百万 tokens
- **Cache read**: $0.025 / 百万 tokens

---

## 🔑 步骤 4：获取 API Key

1. 登录后访问「费用中心」或「API Key 管理」
2. 创建新的 API Key
3. 复制 Key（格式类似：`sk-xxxxxxxxxxxxxxxx`）

---

## ✅ 步骤 5：更新配置

### 方法 A：使用更新脚本
```bash
更新 APIKey.bat
# 输入新的 jiekou.ai API Key
```

### 方法 B：手动编辑 .env
编辑 `.env` 文件：
```env
# 替换为你的 jiekou.ai API Key
API_KEY=sk-your-jiekou-api-key-here
API_KEY_ALIYUN=sk-sp-1f8c74b136034be19241c679ed6fcd1d

# 确保厂商设置为 jiekou
API_PROVIDER=jiekou

# 模型设置为 Gemini
MODEL=gemini-3.1-flash-lite-preview
```

---

## 🧪 步骤 6：测试 API

```bash
# 运行测试脚本
node simple-test.js

# 或完整测试
测试 Gemini API.bat
```

成功响应示例：
```json
{
  "choices": [
    {
      "message": {
        "content": "Hi! How can I help you?"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  }
}
```

---

## 🔄 步骤 7：重启服务器

```bash
# 清理后台进程并重启
重启服务器.bat

# 或手动
启动服务器.bat
```

---

## 📊 验证配置

访问创作页面：
```
http://localhost:3000/create.html
```

检查 API 状态栏应显示：
```
✅ jiekou.ai | gemini-3.1-flash-lite-preview
```

---

## 🆘 常见问题

### Q1: API Key 无效
- 确认 Key 已复制完整（无多余空格）
- 确认 Key 来自 jiekou.ai（不是阿里云）
- 尝试在 jiekou.ai 控制台重新创建 Key

### Q2: 余额不足
- 访问「费用中心」充值
- 或购买资源包更划算

### Q3: 模型不可用
- 确认模型名称：`gemini-3.1-flash-lite-preview`
- 检查模型在控制台是否可用
- 尝试其他模型（`claude-sonnet-3-5`, `deepseek-chat`）

### Q4: 网络错误
- 检查网络连接
- 确认能访问 https://jiekou.ai/
- 检查防火墙设置

---

## 📞 jiekou.ai 支持

- **官网**: https://jiekou.ai/
- **文档**: https://docs.jiekou.ai/
- **模型库**: https://jiekou.ai/models-console/library

---

## 🔒 安全提醒

1. **不要**将 API Key 提交到 Git（已在 .gitignore）
2. **不要**在公开场合分享 API Key
3. **定期**轮换 API Key
4. **监控**用量，避免超额消费

---

## 📝 当前配置

```env
API_PROVIDER=jiekou
MODEL=gemini-3.1-flash-lite-preview
API_KEY=sk-sp-1f8c74b13... (❌ 阿里云 Key，需要替换)
```

---

**最后更新**: 2025-01-XX
**状态**: ⚠️ 待解决 - 需要 jiekou.ai API Key
