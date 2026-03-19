# 🎮 AI 游戏生成器 - 快速开始

## 功能特性

✅ **多 API 厂商支持** - jiekou.ai + 阿里云百炼，一键切换  
✅ **游戏 ID 核心架构** - 所有操作基于唯一游戏 ID，避免重复  
✅ **三栏布局** - 对话区 | 预览区 | 参数面板 (1:1:1)  
✅ **代码保护系统** - UTF-8 编码强制，防止代码丢失  
✅ **API 响应日志** - 完整记录每次调用的 prompt、代码、tokens、耗时  
✅ **智能模型配置** - 前端统一配置，禁止硬编码  

## 快速启动

### 1. 配置 API Key

编辑 `.env` 文件：

```env
# jiekou.ai API Key
API_KEY=sk_xxxxxxxxxxxxxxxxxxxx

# API 厂商选择：jiekou | aliyun
API_PROVIDER=jiekou

# 模型选择
MODEL=claude-sonnet-3-5
```

### 2. 启动服务器

```bash
start-server.bat
```

### 3. 访问应用

打开浏览器访问：`http://localhost:3000/create.html`

## 切换 API 厂商

### 方法 1: 使用工具脚本

```bash
switch-api-provider.bat
```

### 方法 2: 前端 UI 切换

在创作页面点击右上角的 🔄 按钮

### 方法 3: 编辑 .env 文件

```env
# 切换到阿里云
API_PROVIDER=aliyun
MODEL=qwen-max
API_KEY_ALIYUN=sk-sp-xxxxxxxxxxxxxxxxxxxx
```

## 可用模型

| 厂商 | 模型 | 成本 | 质量 |
|------|------|------|------|
| jiekou.ai | claude-sonnet-3-5 | $0.02-0.08/game | ⭐⭐⭐⭐ |
| jiekou.ai | claude-opus-4-6 | $0.10-0.39/game | ⭐⭐⭐⭐⭐ |
| jiekou.ai | deepseek-chat | $0.01/game | ⭐⭐⭐ |
| 阿里云 | qwen-max | ¥0.04/1K tokens | ⭐⭐⭐⭐ |
| 阿里云 | qwen-plus | ¥0.02/1K tokens | ⭐⭐⭐ |
| 阿里云 | qwen-turbo | ¥0.008/1K tokens | ⭐⭐ |

## 管理工具

| 脚本 | 功能 |
|------|------|
| `start-server.bat` | 启动服务器 |
| `stop-server.bat` | 停止服务器 |
| `switch-api-provider.bat` | 切换 API 厂商 |
| `check-api-config.bat` | 检查配置 |
| `pre-modification-check.bat` | 修改前功能检查 |
| `check-encoding.bat` | 检查编码问题 |
| `fix-encoding.bat` | 修复编码问题 |

## 项目结构

```
ai-game-platform/
├── create.html          # 创作页面（三栏布局）
├── server.js            # 后端服务器（多 API 支持）
├── .env                 # 环境变量（API Key 等）
├── .gitignore           # Git 忽略配置
├── docs/
│   ├── API-CONFIG.md    # API 配置详细文档
│   └── CODE-ARCHIVE.md  # 代码档案
├── js/
│   ├── api-config.js    # API 配置管理（多厂商）
│   ├── create-new.js    # 创作页面逻辑
│   ├── game-analyzer.js # 游戏参数分析
│   ├── game-storage.js  # 游戏存储（唯一 PID）
│   ├── show-code.js     # 代码查看模态框
│   └── inspiration.js   # 灵感生成器
├── css/
│   └── create-layout.css # 三栏布局样式
├── api-responses/       # API 响应日志
└── tools/
    ├── start-server.bat
    ├── stop-server.bat
    └── switch-api-provider.bat
```

## API 响应日志

每次 API 调用会自动保存到 `api-responses/` 目录：

- `response-*.json` - 完整响应（prompt、代码、tokens、耗时）
- `game-*.html` - 生成的游戏预览

## 安全提示

⚠️ **重要**:
- `.env` 文件包含敏感信息，不要提交到 Git
- 已配置 `.gitignore` 自动排除 `.env`
- 不要分享你的 API Key

## 故障排除

### 服务器无法启动
1. 检查 `.env` 文件是否存在
2. 确认 `API_KEY` 已正确配置
3. 检查端口 3000 是否被占用

### API 请求失败
1. 检查网络连接
2. 验证 API Key 是否有效
3. 查看 `api-responses/` 目录的错误日志

### 游戏无法显示
1. 检查 iframe sandbox 属性
2. 确认游戏代码完整
3. 查看浏览器控制台错误

## 更多信息

- [API 配置详细文档](docs/API-CONFIG.md)
- [代码保护最佳实践](active_skills/code-preservation/SKILL.md)
