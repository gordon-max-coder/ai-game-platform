# API 配置指南

## 支持的 API 厂商

### 1. jiekou.ai (推荐)
- **Base URL**: `https://api.jiekou.ai/openai`
- **可用模型**:
  - `claude-sonnet-3-5` - Claude Sonnet 3.5 (性价比高，$0.02-0.08/game)
  - `claude-opus-4-6` - Claude Opus 4.6 (最高质量，$0.10-0.39/game)
  - `deepseek-chat` - DeepSeek Chat (最便宜，$0.01/game)

### 2. 阿里云百炼
- **Base URL**: `https://coding.dashscope.aliyuncs.com/v1`
- **可用模型**:
  - `qwen-max` - Qwen Max (最高质量，¥0.04/1K tokens)
  - `qwen-plus` - Qwen Plus (中等质量，¥0.02/1K tokens)
  - `qwen-turbo` - Qwen Turbo (快速响应，¥0.008/1K tokens)

## 配置方法

### 方法 1: 编辑 .env 文件

1. 打开 `.env` 文件
2. 修改以下配置：

```env
# jiekou.ai API Key (主要使用)
API_KEY=sk_xxxxxxxxxxxxxxxxxxxx

# 阿里云百炼 API Key (可选，使用时取消注释)
# API_KEY_ALIYUN=sk-sp-xxxxxxxxxxxxxxxxxxxx

# API 厂商选择：jiekou | aliyun
API_PROVIDER=jiekou

# 模型选择
MODEL=claude-sonnet-3-5
```

3. 重启服务器：
   ```bash
   call stop-server.bat
   call start-server.bat
   ```

### 方法 2: 使用切换工具

运行 `switch-api-provider.bat`，按提示选择：
- 1. 切换到 jiekou.ai (Claude Sonnet 3.5)
- 2. 切换到 阿里云百炼 (Qwen Max)
- 3. 自定义配置

### 方法 3: 前端 UI 切换

1. 访问 `http://localhost:3000/create.html`
2. 点击右上角的 🔄 按钮
3. 选择厂商和模型
4. 点击"确认切换"

## 快速切换示例

### 切换到 Claude Opus (最高质量)
```env
API_PROVIDER=jiekou
MODEL=claude-opus-4-6
```

### 切换到 DeepSeek (最便宜)
```env
API_PROVIDER=jiekou
MODEL=deepseek-chat
```

### 切换到阿里云 Qwen Max
```env
API_PROVIDER=aliyun
MODEL=qwen-max
# 确保已设置 API_KEY_ALIYUN
```

### 切换到阿里云 Qwen Turbo (最快)
```env
API_PROVIDER=aliyun
MODEL=qwen-turbo
```

## 验证配置

访问 `http://localhost:3000/api/health` 查看当前配置：

```json
{
  "status": "ok",
  "service": "AI Game Generator",
  "provider": "jiekou",
  "providerName": "jiekou.ai",
  "model": "claude-sonnet-3-5",
  "availableProviders": ["jiekou", "aliyun"],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 成本对比

| 厂商 | 模型 | 成本 | 质量 | 推荐场景 |
|------|------|------|------|----------|
| jiekou.ai | Claude Sonnet 3.5 | $0.02-0.08/game | ⭐⭐⭐⭐ | 日常使用 |
| jiekou.ai | Claude Opus 4.6 | $0.10-0.39/game | ⭐⭐⭐⭐⭐ | 复杂游戏 |
| jiekou.ai | DeepSeek Chat | $0.01/game | ⭐⭐⭐ | 简单游戏 |
| 阿里云 | Qwen Max | ¥0.04/1K tokens | ⭐⭐⭐⭐ | 国产替代 |
| 阿里云 | Qwen Plus | ¥0.02/1K tokens | ⭐⭐⭐ | 平衡选择 |
| 阿里云 | Qwen Turbo | ¥0.008/1K tokens | ⭐⭐ | 快速测试 |

## 故障排除

### 问题 1: API Key 无效
- 检查 `.env` 文件中 `API_KEY` 是否正确
- 确保没有多余的空格或引号
- 重启服务器

### 问题 2: 阿里云 API 无法使用
- 确保 `.env` 中 `API_KEY_ALIYUN` 已取消注释并填入正确的 Key
- 检查 `API_PROVIDER=aliyun`
- 访问阿里云控制台确认 API 已开通

### 问题 3: 模型不支持
- 检查模型名称拼写
- 确认当前厂商支持该模型
- 查看 `/api/health` 返回的可用模型列表

## 安全提示

⚠️ **重要**:
- `.env` 文件包含敏感信息，不要提交到 Git
- 已配置 `.gitignore` 自动排除 `.env`
- 不要分享你的 API Key
- 定期更换 API Key

## 下一步

- [ ] 智能模型路由 - 根据游戏复杂度自动选择模型
- [ ] 成本统计 - 记录每次生成的实际花费
- [ ] 质量评分 - 用户反馈优化模型选择
