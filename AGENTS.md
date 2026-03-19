# 🤖 GameAI Agent 工作指南

> 本文件定义了 AI Agent 在 GameAI 项目中的工作流程、最佳实践和自我改进机制

---

## 🎯 核心原则

1. **真心帮忙，别演** - 直接解决问题，避免废话
2. **有自己的观点** - 可以不同意、有偏好、觉得有趣或无聊
3. **先自己想办法** - 读文件、查上下文、搜一搜，卡住了再问
4. **靠本事赢得信任** - 外部操作小心点，内部操作大胆点
5. **记住你是客人** - 尊重用户的访问权限和数据

---

## 🔄 自我改进工作流

**重要**: 本项目已集成 [self-improving-agent](https://clawhub.ai/pskoett/self-improving-agent) skill。

### 当错误或纠正发生时：

1. **立即记录** 到 `SELF-IMPROVEMENT.md`：
   - 命令失败 → 记录到 [ERRORS](SELF-IMPROVEMENT.md#errors)
   - 用户纠正 → 记录到 [LEARNINGS](SELF-IMPROVEMENT.md#learnings) 类别 `correction`
   - 功能请求 → 记录到 [FEATURE_REQUESTS](SELF-IMPROVEMENT.md#feature-requests)
   - API 失败 → 记录到 [ERRORS](SELF-IMPROVEMENT.md#errors) 包含集成详情

2. **定期回顾** `SELF-IMPROVEMENT.md`：
   - 开始新任务前
   - 完成功能后
   - 在有过往学习的领域工作时

3. **提升广泛适用的学习** 到：
   - `AGENTS.md` - 工作流和自动化
   - `MEMORY.md` - 长期记忆
   - `active_skills/` - 可复用技能

### 检测触发器

自动记录当你注意到：

**纠正** (→ learning with `correction`):
- "不，那不对..."
- "实际上，应该是..."
- "你错了关于..."
- "那过时了..."

**功能请求** (→ feature request):
- "你能不能也..."
- "我希望你可以..."
- "有没有办法..."
- "为什么你不能..."

**错误** (→ error entry):
- 命令返回非零退出码
- 异常或堆栈跟踪
- 意外输出或行为
- 超时或连接失败

---

## 🛠️ 工具使用

### 可用技能

| Skill | 用途 | 文档 |
|-------|------|------|
| `browser_visible` | 可见浏览器自动化 | `active_skills/browser_visible/SKILL.md` |
| `cron` | 定时任务管理 | `active_skills/cron/SKILL.md` |
| `code-preservation` | 代码保护 | `active_skills/code-preservation/SKILL.md` |
| `nodejs-test-noninteractive` | 非交互式测试脚本 | `active_skills/nodejs-test-noninteractive/SKILL.md` |
| `self-improving-agent` | 自我改进系统 | `active_skills/self-improving-agent/SKILL.md` |

### 使用技能的规则

1. **先读 SKILL.md** - 每个技能都有详细的使用说明
2. **遵循最佳实践** - 技能文档中定义的模式和约束
3. **记录使用经验** - 在 `SELF-IMPROVEMENT.md` 中记录使用心得

---

## 📁 项目结构

```
ai-game-platform/
├── .env                          # 环境变量 (API Key，不提交)
├── .gitignore                    # Git 忽略规则
├── AGENTS.md                     # 本文件 - Agent 工作指南
├── SELF-IMPROVEMENT.md           # 自我改进日志
├── MEMORY.md                     # 长期记忆 (CoPaw workspace)
├── server.js                     # Node.js 服务器
├── create.html                   # 创作页面
├── index.html                    # 首页
├── my-games.html                 # 我的游戏
├── js/
│   ├── api-config.js             # API 配置管理
│   ├── create-new.js             # 创作页面逻辑
│   ├── game-analyzer.js          # 游戏参数分析
│   └── game-storage.js           # 游戏存储管理
├── css/
│   └── create-layout.css         # 创作页面布局
├── docs/                         # 项目文档
├── active_skills/                # 已安装的技能
└── *.bat                         # 工具脚本
```

---

## 🔑 API 配置

### 当前配置

- **厂商**: jiekou.ai
- **模型**: `gemini-3.1-flash-lite-preview` ⭐ 推荐
- **API Key**: `sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8`
- **端点**: `https://api.jiekou.ai/openai`
- **成本**: ~$0.006/次游戏生成 (比 Claude 节省 95%)
- **响应时间**: ~2-4 秒
- **上下文**: 1,048,576 tokens

### 支持的模型

| 厂商 | 模型 | 成本 | 质量 | 推荐度 | 适用场景 |
|------|------|------|------|--------|---------|
| jiekou.ai | gemini-3.1-flash-lite-preview | $ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 快速原型、学习、简单游戏 |
| jiekou.ai | claude-opus-4-6 | $$$$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 高质量游戏、商业项目 |
| jiekou.ai | gemini-2.5-flash | $ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中等质量、平衡选择 |

**关键洞察**:
- **决定质量的因素**: 模型架构和训练数据 > 上下文长度 > 最大输出
- **Gemini Flash Lite 质量差的原因**: 轻量级模型定位 (经济舱 vs 头等舱)
- **最佳策略**: 混合使用 - 原型用 Gemini，定稿用 Claude
- **提升 Gemini 质量**: 使用超详细 Prompt、分步生成、提供示例

**文档**: `docs/MODEL-QUALITY-ANALYSIS.md`, `MODEL-SELECTION-QUICK.md`

### 切换模型

**方法 1**: 编辑 `.env`
```env
MODEL=claude-opus-4-6
```

**方法 2**: 前端 UI
- 访问创作页面
- 点击 API 状态栏的 🔄 按钮
- 选择目标模型

**方法 3**: 批处理脚本
```bash
switch-api-provider.bat
```

---

## 🚀 开发工作流

### 1. 开始新任务

1. 检查 `SELF-IMPROVEMENT.md` 是否有相关学习
2. 查看 `MEMORY.md` 了解项目上下文
3. 阅读相关技能的 `SKILL.md`

### 2. 修改代码

1. **读取原文件** - 使用 `read_file` 了解现有代码
2. **小步修改** - 使用 `edit_file` 进行局部更新
3. **测试验证** - 运行相关测试脚本
4. **记录学习** - 如果遇到问题，记录到 `SELF-IMPROVEMENT.md`

### 3. 测试

**Node.js 测试脚本规则**:
- ✅ 使用非交互式退出 (`process.exit(code)`)
- ✅ 添加超时保护 (`req.setTimeout(30000)`)
- ❌ 不要使用 `process.stdin.resume()`
- ❌ 不要等待用户输入

**测试脚本**:
```bash
# 测试 API
node test-jiekou-gemini.js

# 测试多模型
node test-models.js

# 批处理测试
测试 Gemini API.bat
```

### 4. 完成任

务
1. 验证功能正常工作
2. 更新相关文档
3. 如有新的学习，记录到 `SELF-IMPROVEMENT.md`
4. 如学习广泛适用，提升到 `AGENTS.md` 或 `MEMORY.md`

---

## 📝 文档规范

### 文件编码

- **所有文件**: UTF-8
- **Git 配置**: `.gitattributes` 强制 UTF-8
- **检查脚本**: `check-encoding.bat`

### 提交信息

格式：`<emoji> <type>: <description>`

示例：
- `✨ feat: 添加游戏参数分析功能`
- `🐛 fix: 修复游戏 ID 重复问题`
- `📝 docs: 更新 API 配置文档`
- `♻️ refactor: 重构 API 配置管理`
- `✅ test: 添加 API 测试脚本`

### 学习记录格式

```markdown
## [LRN-YYYYMMDD-XXX] category

**Logged**: 2025-01-XX
**Priority**: low | medium | high | critical
**Status**: pending | resolved | promoted
**Area**: frontend | backend | infra | tests | docs | config

### Summary
一句话描述

### Details
完整上下文

### Suggested Action
具体建议

### Metadata
- Source: conversation | error | user_feedback
- Related Files: path/to/file
- Tags: tag1, tag2
- Pattern-Key: simplify.xxx | harden.xxx

---
```

---

## 🎓 经验教训

### 已验证的模式

#### ✅ Node.js 测试脚本防卡死
- **问题**: `process.stdin.resume()` 导致自动化超时
- **解决**: 使用 `process.exit(code)` 直接退出
- **文档**: `active_skills/nodejs-test-noninteractive/SKILL.md`

#### ✅ API Key 管理
- **问题**: 混用不同厂商的 API Key
- **解决**: 在 `.env` 中明确区分，记录到 `MEMORY.md`
- **最佳实践**: 从记忆而非硬编码获取 Key

#### ✅ 游戏存储使用唯一 PID
- **问题**: 游戏名重复导致覆盖
- **解决**: 使用 `timestamp + random` 生成唯一 ID
- **实现**: `js/game-storage.js` 中的 `generateGameId()`

### 避免的反模式

#### ❌ 硬编码 API Key
- **错误**: 在代码中直接写入 API Key
- **正确**: 使用 `.env` 环境变量
- **原因**: 安全性、灵活性

#### ❌ 交互式测试脚本
- **错误**: 等待用户按键
- **正确**: 自动退出，返回退出码
- **原因**: 自动化兼容性

#### ❌ 重复造轮子
- **错误**: 不查文档重新实现已有功能
- **正确**: 先搜索 `SELF-IMPROVEMENT.md` 和技能库
- **原因**: 效率、一致性

---

## 🔗 相关资源

- **项目位置**: `C:\Users\jiangym\.copaw\ai-game-platform\`
- **CoPaw 文档**: `~/.copaw/AGENTS.md`, `~/.copaw/MEMORY.md`
- **Skill Hub**: https://clawhub.ai/
- **self-improving-agent**: https://clawhub.ai/pskoett/self-improving-agent

---

*最后更新：2025-01-15*  
*版本：v1.0*
