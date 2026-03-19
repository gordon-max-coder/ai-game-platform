# 🧠 长期记忆 - AI 游戏生成器项目

---

## 📋 项目概况

**目标**: 创建 AI 驱动的游戏生成平台，用户通过自然语言描述即可生成可玩的游戏

**技术栈**:
- 前端：HTML5, CSS3, Vanilla JavaScript
- 后端：Node.js + Express
- API: jiekou.ai (多模型支持)
- 存储：本地文件系统 + Git 版本控制

---

## 🎯 核心架构决策

### 游戏 ID 系统 (2025-01-12)
- 使用唯一 PID (timestamp + random) 而非游戏名
- 避免同名覆盖问题
- 所有操作基于 `currentGameId`

### 三栏布局 (2025-01-12)
- 对话区 | 预览区 | 参数面板 (各 1/3)
- 参数面板支持滑动调整，实时更新游戏
- 点击"创建"按钮切换单栏/三栏布局

### API 安全 (2025-01-12)
- API Key 存储在 `.env` 文件
- 服务器从 `process.env` 读取
- 禁止硬编码到代码中

### 编码保护 (2025-01-13)
- `.gitattributes` 强制 UTF-8
- `pre-modification-check.bat` 检查档案
- `safe-edit.bat` 安全编辑流程

### 多 API 厂商支持 (2025-01-14)
- 支持 jiekou.ai 和阿里云百炼
- 前端统一配置 `js/api-config.js`
- 支持用户在创作页面直接切换

---

## 🤖 模型质量分析 (2025-01-15)

**问题**: Gemini 3.1 Flash Lite 生成的游戏质量粗糙

**根本原因**:
- ❌ 不是上下文不够 (1M 远超需求)
- ❌ 不是输出限制 (65K 完全足够)
- ✅ 是模型定位 (轻量级 vs 旗舰级)
- ✅ 是训练深度 (通用 vs 代码优化)

**影响质量的关键因素** (按重要性):
1. ⭐⭐⭐⭐⭐ 模型架构和训练数据 (决定性)
2. ⭐⭐⭐⭐⭐ 推理能力和代码理解
3. ⭐⭐⭐⭐ 指令遵循能力
4. ⭐⭐⭐ 最大输出 tokens
5. ⭐⭐ 上下文长度 (影响最小)

**最佳策略**:
- 开发阶段：Gemini Flash Lite (快速迭代)
- 生产阶段：Claude Opus 4.6 (质量保证)
- 混合使用可节省 50-75% 成本

**提升 Gemini 质量技巧**:
- 使用超详细 Prompt (包含所有细节要求)
- 分步生成 (框架→逻辑→效果→功能)
- 提供代码示例参考
- 调整参数 (temperature: 0.5, max_tokens: 8000)

**文档**: `docs/MODEL-QUALITY-ANALYSIS.md`, `MODEL-SELECTION-QUICK.md`

---

## 📊 当前配置

### API 配置
- **厂商**: jiekou.ai
- **模型**: gemini-3.1-flash-lite-preview
- **成本**: ~$0.006/次
- **状态**: ✅ 生产就绪

### 支持模型
| 模型 | 成本 | 质量 | 推荐场景 |
|------|------|------|---------|
| gemini-3.1-flash-lite-preview | $ | ⭐⭐⭐ | 原型、学习 |
| claude-opus-4-6 | $$$$ | ⭐⭐⭐⭐⭐ | 高质量、商业 |
| gemini-2.5-flash | $ | ⭐⭐⭐⭐ | 平衡选择 |

---

## 🛠️ 工具脚本

### 服务器管理
- `启动服务器.bat` - 清理进程并启动
- `重启服务器.bat` - 重启服务器
- `🔄 重启服务器 - 切换 Gemini.bat` - 切换模型后重启

### API 管理
- `switch-api-provider.bat` - 交互式切换厂商
- `更新 APIKey.bat` - 更新 API Key
- `测试 Gemini API.bat` - 测试 API 连通性

### 代码保护
- `pre-modification-check.bat` - 修改前检查
- `safe-edit.bat` - 安全编辑
- `check-encoding.bat` - 编码检查

---

## 📁 关键文档

### 核心文档
- `AGENTS.md` - Agent 工作指南
- `SELF-IMPROVEMENT.md` - 自我改进日志
- `MEMORY.md` - 长期记忆 (本文件)

### 技术文档
- `docs/API-CONFIG.md` - API 配置指南
- `docs/MULTI-API-IMPLEMENTATION.md` - 多 API 实现
- `docs/MODEL-QUALITY-ANALYSIS.md` - 模型质量分析
- `docs/SERVER-RESTART-GUIDE.md` - 服务器重启指南

### 快速参考
- `GEMINI-QUICK-REF.md` - Gemini 配置速查
- `MODEL-SELECTION-QUICK.md` - 模型选择速查

---

## 🐛 已解决的关键问题

### 401 认证错误 (2025-01-14)
- **问题**: 阿里云 API 返回 401
- **解决**: 切换回 jiekou.ai 并使用正确 API Key
- **Key**: `sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8`

### 模型配置错误 (2025-01-15)
- **问题**: 服务器使用旧模型配置
- **原因**: 服务器在 `.env` 更新前启动
- **解决**: 创建重启脚本，修改配置后必须重启

### 游戏存储冲突 (2025-01-12)
- **问题**: 同名游戏覆盖
- **解决**: 使用唯一 PID 而非游戏名存储

---

## 📈 下一步计划

### 智能模型路由
- [ ] 根据游戏复杂度自动选择模型
- [ ] 简单游戏 → Gemini Flash Lite
- [ ] 复杂游戏 → Claude Opus 4.6

### 数据收集
- [ ] 记录每次请求的 tokens、成本
- [ ] 质量评分系统
- [ ] 模型性能对比分析

### P1 Bug 修复
- [ ] Toast 通知优化
- [ ] 移动端适配
- [ ] 隐藏功能入口

### 自我改进系统
- [ ] 创建 `.learnings/` 目录
- [ ] 实现错误记录→回顾→提升循环
- [ ] 定期回顾并更新 AGENTS.md

---

## 💡 经验教训

### 服务器配置
- ⚠️ 修改 `.env` 后必须重启服务器
- ✅ 使用重启脚本而非直接启动
- ✅ 检查 `server.log` 确认配置

### 模型选择
- ⭐ 模型架构 > 参数大小
- ⭐ 代码训练 > 通用能力
- ⭐ 详细 Prompt > 模型切换
- ⭐ 混合使用 > 单一模型

### 代码保护
- ⭐ 修改前必须检查档案
- ⭐ 使用 Git 而非手动备份
- ⭐ 所有文件强制 UTF-8

### 功能设计
- ⭐ 简洁直接 > 复杂引导
- ⭐ 用户控制 > 自动流程
- ⭐ 快速迭代 > 完美设计

---

*最后更新：2025-01-15*  
*状态：🟢 生产就绪*  
*版本：v17 - 移除智能体，恢复简洁流程*

---

## ❌ 已移除功能

### 提示词智能体（v17 移除）

**移除日期**: 2025-01-15  
**版本**: v17

**原因**:
- 多轮引导流程复杂，用户体验不够流畅
- 自动滚动等技术问题修复成本高
- 用户更倾向于直接输入需求
- 简化代码，减少维护成本

**当前流程**: 
```
用户直接输入需求 → AI 生成游戏 → 多轮修改优化
```

**不再使用**:
```
用户输入 → 智能体引导 (4 轮问答) → 生成游戏
```

**保留文档** (历史参考):
- `docs/PROMPT-AGENT-GUIDE.md`
- `docs/PROMPT-AGENT-IMPLEMENTATION.md`
- `docs/AGENT-FEATURE-REMOVED.md`

**删除文件**:
- `js/prompt-agent.js` (22KB)
- `debug-agent.html`
- `test-agent.html`
- `test-prompt-agent.js`
