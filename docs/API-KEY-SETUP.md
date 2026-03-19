# 🔑 阿里云百炼 API Key 获取指南

## ⚠️ 当前状态
- **错误**: 401 Unauthorized - Incorrect API key provided
- **原因**: 当前 API Key 无效或已过期
- **解决**: 需要获取新的 API Key

---

## 📋 步骤 1：访问阿里云控制台

### 方式 A：直接访问 API Key 管理页面
```
https://dashscope.console.aliyun.com/apiKey
```

### 方式 B：通过百炼控制台
1. 访问：https://dashscope.console.aliyun.com/
2. 登录阿里云账号
3. 点击左侧菜单「API-KEY 管理」

---

## 🔐 步骤 2：创建/管理 API Key

### 如果已有 API Key：
1. 检查状态是否为「启用」
2. 如被禁用，点击「启用」按钮
3. 点击「复制」获取 Key

### 如果创建新 API Key：
1. 点击「创建新的 API-KEY」
2. 输入 Key 名称（例如：`ai-game-platform`）
3. 点击「确定」
4. **立即复制 API Key**（只显示一次！）

### ⚠️ 重要提示
- API Key 只显示一次，务必立即复制保存
- 不要将 Key 分享给他人
- 不要将 Key 提交到 Git 仓库（已配置 .gitignore）

---

## 💰 步骤 3：确认账号余额

1. 访问：https://usercenter2.aliyun.com/bill
2. 登录账号
3. 检查「账户总览」中的余额
4. 如余额不足，需要充值

### 百炼服务计费
- **qwen-plus**: ¥0.02 / 1K tokens
- **qwen-max**: ¥0.04 / 1K tokens
- **qwen-turbo**: ¥0.008 / 1K tokens

---

## ✅ 步骤 4：验证 API Key

### 方法 A：使用测试脚本
```bash
# 1. 更新 .env 文件中的 API_KEY
# 2. 运行测试
node test-aliyun-api.js
```

### 方法 B：使用更新脚本
```bash
# 运行交互式更新脚本
更新 APIKey.bat
```

### 方法 C：使用 curl 测试
```bash
curl https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_API_KEY" ^
  -d "{\"model\":\"qwen-plus\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}"
```

---

## 🔄 步骤 5：更新项目配置

### 自动更新（推荐）
运行脚本：
```bash
更新 APIKey.bat
```

### 手动更新
编辑 `.env` 文件：
```env
# 替换为你的新 API Key
API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_KEY_ALIYUN=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🧪 步骤 6：测试游戏生成

1. 启动服务器：
```bash
启动服务器.bat
```

2. 访问创作页面：
```
http://localhost:3000/create.html
```

3. 检查 API 状态栏是否显示「✅ 阿里云 | qwen-plus」

4. 尝试生成一个简单游戏（如「猜数字」）

---

## 🆘 常见问题

### Q1: API Key 无效
- 确认 Key 已复制完整（无多余空格）
- 确认 Key 未被禁用
- 尝试创建新 Key

### Q2: 余额不足
- 访问用户中心充值
- 或切换到 jiekou.ai（使用美元计费）

### Q3: 服务未开通
- 访问百炼控制台
- 点击「开通服务」
- 同意服务协议

### Q4: 模型不可用
- 确认模型名称正确（`qwen-plus`）
- 检查模型是否在可用列表中
- 尝试其他模型（`qwen-turbo`, `qwen-max`）

---

## 📞 阿里云支持

- **帮助中心**: https://help.aliyun.com/zh/model-studio/
- **错误码查询**: https://help.aliyun.com/zh/model-studio/error-code
- **客服工单**: https://workorder.console.aliyun.com/

---

## 🔒 安全提醒

1. **不要**将 API Key 提交到 Git
2. **不要**在公开场合分享 API Key
3. **定期**轮换 API Key（建议每 3 个月）
4. **监控**用量，避免超额消费

当前 `.env` 文件已在 `.gitignore` 中，不会被提交。

---

## 📊 替代方案

如阿里云 API 持续不可用，可切换回 jiekou.ai：

```bash
# 切换厂商
switch-api-provider.bat

# 选择 jiekou
# 模型：claude-sonnet-3-5
```

---

**最后更新**: 2025-01-XX
**状态**: ⚠️ 待解决 - 需要新 API Key
