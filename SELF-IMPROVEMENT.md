# 📘 GameAI 自我改进日志

> 基于 self-improving-agent skill (v3.0.1)
> 
> **Skill 来源**: https://clawhub.ai/pskoett/self-improving-agent
> 
> **安装日期**: 2025-01-XX

---

## 📋 快速参考

| 场景 | 行动 |
|------|------|
| 命令/操作失败 | 📝 记录到 [ERRORS](#errors) |
| 用户纠正你 | 📝 记录到 [LEARNINGS](#learnings) 类别 `correction` |
| 用户请求缺失功能 | 📝 记录到 [FEATURE_REQUESTS](#feature-requests) |
| API/外部工具失败 | 📝 记录到 [ERRORS](#errors) 包含集成详情 |
| 知识过时 | 📝 记录到 [LEARNINGS](#learnings) 类别 `knowledge_gap` |
| 发现更好的方法 | 📝 记录到 [LEARNINGS](#learnINGS) 类别 `best_practice` |
| 广泛适用的学习 | ⬆️ 提升到 `AGENTS.md`, `MEMORY.md` |

---

## 🎯 LEARNINGS

### 已记录的学习

#### [LRN-20250115-001] best_practice - Node.js 测试脚本防卡死

**Logged**: 2025-01-15  
**Priority**: high  
**Status**: ✅ promoted  
**Area**: backend

**Summary**: Node.js 测试脚本必须使用非交互式退出

**Details**: 
- 创建测试脚本时使用了 `process.stdin.resume()` 等待用户按键
- 导致在自动化环境中执行时超时卡住
- 根本原因：交互式代码不适合自动化环境

**Suggested Action**: 
所有测试脚本应该：
1. ✅ 移除 `process.stdin.resume()` 调用
2. ✅ 使用 `process.exit(code)` 直接退出
3. ✅ 添加请求超时保护 (`req.setTimeout(30000)`)

**Metadata**:
- Source: error
- Related Files: `test-jiekou-gemini.js`, `simple-test.js`
- Tags: nodejs, testing, automation
- Pattern-Key: harden.non_interactive_scripts

**Promoted**: 
- ✅ `MEMORY.md` - API 配置历史 section
- ✅ `active_skills/nodejs-test-noninteractive/SKILL.md` - 完整技能文档

---

#### [LRN-20250115-002] knowledge_gap - API Key 管理

**Logged**: 2025-01-15  
**Priority**: high  
**Status**: ✅ resolved  
**Area**: config

**Summary**: 不同 API 厂商使用不同的 API Key，不能混用

**Details**:
- 阿里云百炼 API Key 格式：`sk-sp-xxxxxxxx`
- jiekou.ai API Key 格式：`sk_xxxxxxxxxxxx`
- 错误地将阿里云 Key 用于 jiekou.ai 导致 401 认证失败
- 正确的 jiekou.ai Key 在记忆中：`sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8`

**Suggested Action**:
1. ✅ 在 `.env` 中明确区分不同厂商的 Key
2. ✅ 更新 `MEMORY.md` 记录正确的 Key
3. ✅ 创建文档说明如何获取和切换 Key

**Metadata**:
- Source: error
- Related Files: `.env`, `js/api-config.js`
- Tags: api, authentication, configuration
- Pattern-Key: harden.api_key_management

**Resolution**:
- **Resolved**: 2025-01-15
- **Notes**: 从记忆中找回正确的 jiekou.ai API Key，配置已修复

---

## 🚫 ERRORS

### 已记录的错误

#### [ERR-20250115-001] node_test_script

**Logged**: 2025-01-15  
**Priority**: high  
**Status**: ✅ resolved  
**Area**: backend

**Summary**: Node.js 测试脚本在自动化环境中卡住

**Error**:
```
Command execution exceeded the timeout of 30 seconds.
```

**Context**:
- 命令：`node test-jiekou-gemini.js`
- 脚本包含 `process.stdin.resume()` 等待用户按键
- 自动化环境无法提供交互式输入

**Suggested Fix**:
移除交互式代码，使用 `process.exit(code)` 直接退出

**Metadata**:
- Reproducible: yes
- Related Files: `test-jiekou-gemini.js`
- See Also: LRN-20250115-001

**Resolution**:
- ✅ 修复脚本，移除 `process.stdin.resume()`
- ✅ 添加超时保护
- ✅ 创建 skill 文档防止重蹈覆辙

---

#### [ERR-20250115-002] api_authentication

**Logged**: 2025-01-15  
**Priority**: high  
**Status**: ✅ resolved  
**Area**: config

**Summary**: API Key 认证失败 (401)

**Error**:
```json
{
  "code": 401,
  "reason": "FAILED_TO_AUTH",
  "message": "failed to authenticate API key"
}
```

**Context**:
- API 厂商：jiekou.ai
- 使用的 Key：`sk-sp-1f8c74b13...` (阿里云格式)
- 正确的 Key：`sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8`

**Suggested Fix**:
使用正确的 jiekou.ai API Key

**Metadata**:
- Reproducible: yes
- Related Files: `.env`
- See Also: LRN-20250115-002

**Resolution**:
- ✅ 从记忆中找回正确的 API Key
- ✅ 更新 `.env` 配置
- ✅ 测试通过

---

## 💡 FEATURE_REQUESTS

### 已记录的请求

*暂无功能请求*

---

## 📊 统计

| 类型 | 总计 | 待处理 | 已解决 | 已提升 |
|------|------|--------|--------|--------|
| Learnings | 2 | 0 | 1 | 1 |
| Errors | 2 | 0 | 2 | 0 |
| Features | 0 | 0 | 0 | 0 |

---

## 🔗 相关链接

- **Skill 文档**: `active_skills/self-improving-agent/SKILL.md`
- **Skill 来源**: https://clawhub.ai/pskoett/self-improving-agent
- **原始仓库**: https://github.com/pskoett/pskoett-ai-skills

---

*最后更新：2025-01-15*
