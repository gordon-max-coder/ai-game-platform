# 🎮 GameAI - AI 游戏生成平台

使用 AI 自动生成 HTML5 游戏，无需编程经验！

## 🚀 快速开始

### 1. 配置 API Key

复制配置文件并填入你的 API Key：

```bash
copy .env.example .env
```

编辑 `.env` 文件，填入你的 API Key：

```env
API_KEY=你的_api_key
MODEL=claude-opus-4-6
PORT=3000
```

### 2. 启动服务器

**Windows:**
```bash
start-server.bat
```

**手动启动:**
```bash
node server.js
```

### 3. 访问应用

打开浏览器访问：http://localhost:3000/create.html

### 4. 停止服务器

**Windows:**
```bash
stop-server.bat
```

**手动停止:**
在服务器窗口按 `Ctrl+C`

---

## 📁 项目结构

```
ai-game-platform/
├── .env                 # 环境变量（包含 API Key，不要提交到 Git）
├── .env.example         # 环境变量模板
├── .gitignore          # Git 忽略文件配置
├── server.js           # 后端服务器
├── start-server.bat    # 启动脚本（Windows）
├── stop-server.bat     # 停止脚本（Windows）
│
├── create.html         # 创作页面（主页面）
├── index.html          # 首页
├── my-games.html       # 我的游戏
├── games.html          # 游戏库
├── learn.html          # 学习中心
├── auth.html           # 登录/注册
│
├── css/                # 样式文件
│   ├── create-layout.css
│   ├── header.css
│   ├── navigation.css
│   └── ...
│
├── js/                 # JavaScript 模块
│   ├── create-new.js       # 创作页面逻辑
│   ├── game-storage.js     # 游戏存储管理
│   ├── game-analyzer.js    # 游戏参数分析
│   ├── game-ui.js          # 游戏 UI 渲染
│   ├── my-games-page.js    # 我的游戏页面
│   ├── auth.js             # 认证模块
│   ├── navbar.js           # 导航栏
│   └── user-state.js       # 用户状态
│
└── images/             # 图片资源
```

---

## 🔒 安全说明

### API Key 保护

- ✅ **已修复**: API Key 不再硬编码在代码中
- ✅ **已修复**: `.env` 文件已添加到 `.gitignore`
- ⚠️ **注意**: 不要将 `.env` 文件提交到 Git 或分享给他人

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `API_KEY` | API 密钥（必需） | 无 |
| `MODEL` | AI 模型名称 | `claude-opus-4-6` |
| `PORT` | 服务器端口 | `3000` |
| `API_TIMEOUT` | API 超时时间（毫秒） | `120000` |

---

## 🎯 核心功能

### 1. 创作页面 (create.html)
- 📝 描述游戏创意，AI 自动生成
- 🎮 实时预览游戏（9:16 比例）
- ⚙️ 调整游戏参数（速度、生命、分数等）
- 💬 对话历史自动保存
- 🔄 支持修改和迭代

### 2. 我的游戏 (my-games.html)
- 📁 管理所有创建的游戏
- ✏️ 编辑、重命名、删除
- 📤 导出/导入游戏数据
- 📊 查看统计信息

### 3. 布局模式
- **创建模式**: 单栏居中布局，专注创作
- **编辑模式**: 三栏布局（对话 | 预览 | 参数）

---

## 🛠️ 开发说明

### 技术栈
- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Node.js (原生 HTTP 服务器)
- **存储**: localStorage (浏览器本地存储)
- **API**: Claude API (via proxy)

### 关键模块

#### GameStorage
游戏存储管理，负责：
- 保存/加载游戏
- 版本管理
- 对话历史关联

#### GameAnalyzer
游戏参数分析，负责：
- 提取关键参数（最多 5 个）
- 渲染参数面板
- 支持滑动调整

#### create-new.js
创作页面主逻辑，负责：
- 布局切换（创建/编辑模式）
- 游戏生成/修改
- 对话管理
- URL 状态管理

---

## 🐛 已知问题

详见测试报告。优先修复：
- ✅ P0: API Key 安全（已修复）
- ✅ P0: 旧代码清理（已修复）
- 🔄 P1: 移动端优化（待修复）
- 🔄 P1: 错误提示优化（待修复）

---

## 📝 更新日志

### v1.1.0 (2025-01-XX)
- 🔒 **安全加固**: API Key 移至环境变量
- 🧹 **代码清理**: 删除旧文件和测试代码
- 📄 **文档**: 添加 README 和使用说明
- 🔧 **工具**: 添加启动/停止脚本

### v1.0.0
- ✨ 初始版本发布

---

## 📞 支持

如有问题，请检查：
1. `.env` 文件是否存在且配置正确
2. 端口 3000 是否被占用
3. 浏览器控制台是否有错误信息

---

**© 2025 GameAI. All rights reserved.**
