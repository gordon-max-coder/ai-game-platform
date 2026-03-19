# 🎮 游戏编辑器改进计划 - v36

> **基于 code-preservation skill 的安全修改原则**  
> **日期**: 2026-03-19  
> **目标**: 解决"修改数值会错乱"问题

---

## 🐛 当前问题分析

### 用户反馈
> "这个编辑器还不是很好用，修改数值会错乱"

### 根本原因

1. **正则匹配不够精确**
   ```javascript
   // ❌ 可能错误匹配
   /speed\s*=\s*\d+/  // 会匹配 playerSpeed、enemySpeed、MAX_SPEED
   
   // ✅ 应该使用单词边界
   /\bspeed\b\s*=\s*\d+/  // 只匹配独立的 speed
   ```

2. **缺少修改验证**
   - 修改后没有确认是否只修改了目标变量
   - 没有显示修改前后对比

3. **没有回滚机制**
   - 修改错误后无法快速恢复

---

## ✅ 已实现功能（v35）

- [x] 使用 `\b` 单词边界匹配
- [x] 修改历史记录（最多 20 条）
- [x] 撤销功能（`undoLastEdit()`）
- [x] 修改提示 Toast（显示修改前后的值）
- [x] 备用变量匹配（playerSpeed、snakeSpeed 等）

---

## 🔧 待改进功能（v36）

### 1. 精确匹配增强

**当前实现**:
```javascript
const speedRegex = /\b(?:const|let|var)?\s*speed\s*[:=]\s*\d+\b/gi;
```

**问题**: 仍然可能匹配多行代码中的错误位置

**改进方案**:
```javascript
// 只匹配行首或 const/let/var 后的 speed
const speedRegex = /^(?:const|let|var)?\s*speed\s*[:=]\s*\d+$/gm;
```

### 2. 修改验证

**添加修改前后对比**:
```javascript
function validateModification(property, oldValue, newValue, codeBefore, codeAfter) {
    // 计算修改次数
    const beforeMatches = (codeBefore.match(new RegExp(property, 'gi')) || []).length;
    const afterMatches = (codeAfter.match(new RegExp(property, 'gi')) || []).length;
    
    // 验证只修改了目标变量
    if (beforeMatches !== afterMatches) {
        console.warn('⚠️ 修改可能影响了其他变量');
        return false;
    }
    
    return true;
}
```

### 3. 备份机制

**参考 code-preservation skill**:
```javascript
function backupCode() {
    const backup = {
        timestamp: Date.now(),
        code: state.currentGame,
        objects: JSON.parse(JSON.stringify(state.gameObjects))
    };
    
    state.backups.push(backup);
    
    // 限制备份数量
    if (state.backups.length > 5) {
        state.backups.shift();
    }
    
    console.log('💾 代码已备份');
}
```

### 4. 显示修改详情

**修改确认对话框**:
```javascript
function showModificationDialog(property, oldValue, newValue) {
    const confirmed = confirm(`
        确认修改 ${property}?
        
        修改前：${oldValue}
        修改后：${newValue}
        
        点击"确定"应用修改，"取消"撤销。
    `);
    
    return confirmed;
}
```

---

## 📋 实现清单

### 第 1 步：修复正则表达式 ✅
- [x] 使用 `\b` 单词边界
- [ ] 添加行首匹配（`^`）
- [ ] 添加多行模式（`m` 标志）

### 第 2 步：添加修改验证 🔴
- [ ] 实现 `validateModification()` 函数
- [ ] 修改后自动验证
- [ ] 验证失败时警告用户

### 第 3 步：添加备份机制 🔴
- [ ] 修改前自动备份
- [ ] 添加"恢复到上次备份"按钮
- [ ] 限制备份数量（最多 5 个）

### 第 4 步：显示修改详情 🔴
- [ ] 修改前后对比显示
- [ ] 添加修改确认对话框（可选）
- [ ] 显示受影响的代码行

### 第 5 步：增强撤销功能 ✅
- [x] 基本撤销功能
- [ ] 撤销后显示恢复的值
- [ ] 添加重做功能

---

## 🎯 最终目标

```
用户修改属性
    ↓
1. 自动备份当前代码
    ↓
2. 精确匹配目标变量（使用 \b 和 ^）
    ↓
3. 应用修改
    ↓
4. 验证修改（确认只修改了目标变量）
    ↓
5. 显示修改详情（前后对比）
    ↓
6. 提供撤销/恢复选项
```

---

## 📊 版本历史

| 版本 | 日期 | 改进内容 |
|------|------|---------|
| v32 | 2026-03-18 | 初始版本 |
| v33 | 2026-03-18 | 修复按钮交互 |
| v34 | 2026-03-18 | 修复 GameEditor 未定义 |
| v35 | 2026-03-18 | 添加属性编辑、撤销功能 |
| **v36** | **2026-03-19** | **精确匹配、修改验证、备份机制** |

---

**参考**: `code-preservation/SKILL.md` - 安全代码修改原则
